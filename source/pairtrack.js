'use strict';

/**
 * pairtrack.js — pairing telemetry, plus one short WhatsApp note to the owner
 * every time a session actually pairs.
 *
 * Why it exists: Akoya-MD ships as a script, so the one thing the author cannot
 * see from the inside is whether anybody deploys it and pairs a number. Every
 * new pairing now records itself on the volume and pings the owner, which makes
 * this both an audit trail for this instance and a real usage signal for builds
 * other people are running.
 *
 * What it keeps:
 *   · the log sits in library/database (symlinked to /data/database on Fly), so
 *     a redeploy cannot wipe the history
 *   · a number is printed in full only when it belongs to the owner; everybody
 *     else is masked. The usage ping stays honest without leaking a user
 *   · nothing here can break pairing: alerts are queued fire-and-forget, never
 *     awaited by the HTTP handler, and a failed send is logged and dropped
 *   · `global.pairAlerts.enabled = false` in settings.js switches it off
 *
 * The numbers it keeps are the advert funnel, which is the point: how many
 * people opened /pair, how many asked for a code, how many finished, and the
 * campaign that sent them there.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const DAY = 24 * 60 * 60 * 1000;
const MAX_EVENTS = 400;
const MAX_QUEUE = 40;
const ALERT_GAP_MS = 60 * 1000;
const ATTEMPT_TTL_MS = 30 * 60 * 1000;

const FILE = process.env.PAIR_LOG_FILE ||
  path.join(process.cwd(), 'library', 'database', 'pairs.json');

const DEFAULTS = {
  enabled: true,
  timezone: 'Africa/Accra',
  notifier: null, // async (text) => boolean
  log: console
};

let cfg = { ...DEFAULTS };

const store = {
  version: 1,
  createdAt: Date.now(),
  firstPairAt: null,
  totals: { visits: 0, attempts: 0, linked: 0, refused: 0, wrongCode: 0, unpaired: 0 },
  days: {}, // YYYY-MM-DD -> { visits, attempts, linked }
  numbers: {}, // digits -> { first, last, attempts, linked, name, jid, city, country, source }
  events: [] // newest last, capped
};

let loaded = false;
let saveTimer = null;
let saveQueued = false;
const queue = []; // alerts waiting for a socket
const recentAlerts = new Map(); // dedupe key -> ts
const geoCache = new Map();
let pendingAttempt = null; // context of the last code request, for the link note
let suppressed = 0; // alerts held back while one was already queued

/* ── configuration ─────────────────────────────────────────────────────── */

function configure(patch = {}) {
  cfg = { ...DEFAULTS, ...cfg, ...patch };
  if (!cfg.log || typeof cfg.log.info !== 'function') cfg.log = console;
  load();
  return cfg;
}

function isEnabled() {
  return !!cfg.enabled;
}

/** Wire the WhatsApp sender. Must return true when the message went out. */
function setNotifier(fn) {
  cfg.notifier = typeof fn === 'function' ? fn : null;
}

/* ── storage ───────────────────────────────────────────────────────────── */

function load() {
  if (loaded) return store;
  loaded = true;
  try {
    const raw = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    if (raw && typeof raw === 'object') {
      store.createdAt = Number(raw.createdAt) || store.createdAt;
      store.firstPairAt = Number(raw.firstPairAt) || null;
      Object.assign(store.totals, raw.totals || {});
      Object.assign(store.days, raw.days || {});
      Object.assign(store.numbers, raw.numbers || {});
      if (Array.isArray(raw.events)) store.events = raw.events.slice(-MAX_EVENTS);
    }
  } catch (error) {
    if (error && error.code !== 'ENOENT') {
      cfg.log.warn(`[pairtrack] could not read ${FILE}: ${error.message}`);
    }
  }
  return store;
}

function writeNow() {
  saveQueued = false;
  const tmp = `${FILE}.tmp`;
  try {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(tmp, JSON.stringify(store, null, 2));
    fs.renameSync(tmp, FILE);
  } catch (error) {
    cfg.log.warn(`[pairtrack] could not save ${FILE}: ${error && error.message}`);
  }
}

/** Debounced so a burst of events is one write, never one write per request. */
function save() {
  if (saveQueued) return;
  saveQueued = true;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    writeNow();
  }, 400);
  saveTimer.unref?.();
}

// A deploy sends SIGTERM: write the pending tail before the process goes.
process.once('exit', () => {
  if (saveQueued) writeNow();
});

/* ── formatting helpers ────────────────────────────────────────────────── */

function digits(value) {
  return String(value || '').split('@')[0].split(':')[0].replace(/[^0-9]/g, '');
}

function ownerNumber() {
  const g = typeof global !== 'undefined' ? global : {};
  return digits(g.owner);
}

function isOwnerNumber(phone) {
  const owner = ownerNumber();
  return !!owner && digits(phone) === owner;
}

/** +233 24 111 2222 */
function prettyPhone(phone) {
  const d = digits(phone);
  if (!d) return 'unknown';
  if (d.length <= 6) return `+${d}`;
  const tail = d.slice(-4);
  const mid = d.slice(Math.max(0, d.length - 7), d.length - 4);
  const head = d.slice(0, Math.max(0, d.length - 7));
  let cc = head;
  let rest = '';
  // North America is the one country code everybody writes as a single digit.
  if (d.length === 11 && d.startsWith('1')) {
    cc = '1';
    rest = head.slice(1);
  } else if (head.length > 3) {
    cc = head.slice(0, 3);
    rest = head.slice(3);
  }
  return [`+${cc}`, rest, mid, tail].filter(Boolean).join(' ');
}

/** +233 55 ••• 4567 — a stranger's number, enough to tell two people apart. */
function maskPhone(phone) {
  const d = digits(phone);
  if (!d) return 'unknown';
  const shown = prettyPhone(d);
  if (isOwnerNumber(d)) return shown;
  if (d.length < 7) return `${shown.slice(0, 3)}••••`;
  return shown.replace(/\d{3}(?=\s\d{4}$)/, '•••');
}

function stamp(ts = Date.now()) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: cfg.timezone
    }).format(new Date(ts));
  } catch (_) {
    return new Date(ts).toISOString().replace('T', ' ').slice(0, 16);
  }
}

function dayKey(ts = Date.now()) {
  return new Date(ts).toISOString().slice(0, 10);
}

function duration(ms) {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 90) return `${s}s`;
  const m = Math.round(s / 60);
  if (m < 90) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 48) return `${h}h`;
  return `${Math.round(h / 24)}d`;
}

function place(city, country) {
  return [city, country].filter(Boolean).join(', ') || null;
}

/** Human label for where a visitor came from: a campaign first, then referrer. */
function sourceLabel(source) {
  if (!source || typeof source !== 'object') return null;
  const bits = [];
  if (source.source) bits.push(source.source);
  if (source.medium) bits.push(`/${source.medium}`);
  if (source.campaign) bits.push(`"${source.campaign}"`);
  if (!bits.length && source.referrer) bits.push(source.referrer);
  if (!bits.length && source.landing) bits.push(source.landing);
  return bits.length ? bits.join(' ') : null;
}

function cleanSource(source) {
  if (!source || typeof source !== 'object') return null;
  const pick = (value) => (value ? String(value).replace(/[^\w .:/?&=@-]/g, '').slice(0, 48) : '');
  const out = {
    source: pick(source.utm_source || source.source || source.src),
    medium: pick(source.utm_medium || source.medium),
    campaign: pick(source.utm_campaign || source.campaign),
    referrer: pick(source.referrer || source.ref),
    landing: pick(source.landing)
  };
  return Object.values(out).some(Boolean) ? out : null;
}

/* ── geo (best effort, never blocks) ───────────────────────────────────── */

const SKIP_GEO = /^(|unknown|::1|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|f[cd])/i;

function lookupGeo(ip) {
  const address = String(ip || '').replace(/^::ffff:/, '');
  if (SKIP_GEO.test(address)) return Promise.resolve(null);
  if (geoCache.has(address)) return Promise.resolve(geoCache.get(address));
  return new Promise((resolve) => {
    let settled = false;
    const done = (value) => {
      if (settled) return;
      settled = true;
      geoCache.set(address, value);
      resolve(value);
    };
    const req = https.get(
      `https://ipapi.co/${encodeURIComponent(address)}/json/`,
      { headers: { 'User-Agent': 'Akoya-MD pairtrack' }, timeout: 2500 },
      (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          body += chunk;
          if (body.length > 4096) req.destroy();
        });
        res.on('end', () => {
          try {
            const data = JSON.parse(body);
            if (data && !data.error) {
              return done({
                city: data.city || null,
                country: data.country_name || null,
                cc: data.country_code || null
              });
            }
          } catch (_) {
            /* not json — fall through */
          }
          done(null);
        });
      }
    );
    req.on('timeout', () => {
      req.destroy();
      done(null);
    });
    req.on('error', () => done(null));
  });
}

/* ── alert delivery ────────────────────────────────────────────────────── */

function remember(key) {
  const now = Date.now();
  for (const [k, ts] of recentAlerts) {
    if (now - ts > ALERT_GAP_MS) recentAlerts.delete(k);
  }
  return recentAlerts.get(key) || 0;
}

/**
 * Queue one owner note. Alerts are never awaited by a request handler: while a
 * pairing socket is unregistered it cannot send, so anything raised then waits
 * and leaves the moment the session opens.
 */
function alertNow(key, text) {
  if (!cfg.enabled || !cfg.notifier) return false;
  const since = remember(key);
  if (since && Date.now() - since < ALERT_GAP_MS) {
    suppressed += 1;
    return false;
  }
  recentAlerts.set(key, Date.now());
  if (queue.length >= MAX_QUEUE) queue.shift();
  queue.push(suppressed > 0
    ? `${text}\n(+${suppressed} earlier note${suppressed === 1 ? '' : 's'} folded in)`
    : text);
  suppressed = 0;
  flush().catch(() => {});
  return true;
}

let flushing = null;

/** One drain at a time: two concurrent flushes would deliver the same note twice. */
function flush() {
  if (flushing) return flushing;
  if (!cfg.notifier || !queue.length) return Promise.resolve(0);
  flushing = (async () => {
    let sent = 0;
    try {
      while (queue.length) {
        const text = queue[0];
        let ok = false;
        try {
          ok = (await cfg.notifier(text)) !== false;
        } catch (error) {
          cfg.log.warn(`[pairtrack] alert not delivered: ${error && error.message}`);
          ok = false;
        }
        if (!ok) return sent; // socket not ready: keep it queued for the next flush
        queue.shift();
        sent += 1;
      }
      return sent;
    } finally {
      flushing = null;
    }
  })();
  return flushing;
}

/* ── recording ─────────────────────────────────────────────────────────── */

function touchNumber(phone, patch = {}) {
  const d = digits(phone);
  if (!d) return null;
  const now = Date.now();
  const rec = store.numbers[d] || { first: now, last: now, attempts: 0, linked: 0 };
  rec.last = now;
  for (const [key, value] of Object.entries(patch)) {
    if (value !== undefined && value !== null && value !== '') rec[key] = value;
  }
  store.numbers[d] = rec;
  return rec;
}

function pushEvent(type, data = {}) {
  store.events.push({ t: Date.now(), type, ...data });
  if (store.events.length > MAX_EVENTS) {
    store.events.splice(0, store.events.length - MAX_EVENTS);
  }
  const day = dayKey();
  const bucket = store.days[day] || { visits: 0, attempts: 0, linked: 0 };
  if (type === 'visit') bucket.visits += 1;
  if (type === 'attempt') bucket.attempts += 1;
  if (type === 'linked') bucket.linked += 1;
  store.days[day] = bucket;
  // 90 days is plenty for an advert read and keeps the file small.
  const keys = Object.keys(store.days).sort();
  while (keys.length > 90) delete store.days[keys.shift()];
  save();
}

/** Someone opened the pairing page. Counted, never announced. */
function visit({ ip, source } = {}) {
  if (!cfg.enabled) return null;
  const src = cleanSource(source);
  store.totals.visits += 1;
  pushEvent('visit', { ip: ip || null, source: src });
  lookupGeo(ip).then((geo) => {
    if (!geo) return;
    const last = store.events[store.events.length - 1];
    if (last && last.type === 'visit' && !last.city) {
      last.city = geo.city;
      last.country = geo.country;
      save();
    }
  }).catch(() => {});
  return { visits: store.totals.visits };
}

/**
 * A number asked for a code. A number this build has never seen before is worth
 * telling the owner about right away: it is the earliest proof that an advert
 * brought somebody to the page.
 */
async function attempt({ phone, ip, source } = {}) {
  if (!cfg.enabled) return null;
  const src = cleanSource(source);
  const d = digits(phone);
  const seen = !!store.numbers[d];
  const geo = await lookupGeo(ip).catch(() => null);

  store.totals.attempts += 1;
  touchNumber(d, {
    attempts: ((store.numbers[d] && store.numbers[d].attempts) || 0) + 1,
    ip: ip || undefined,
    city: geo ? geo.city : undefined,
    country: geo ? geo.country : undefined,
    source: sourceLabel(src) || undefined
  });
  pushEvent('attempt', {
    phone: d,
    ip: ip || null,
    city: geo ? geo.city : null,
    country: geo ? geo.country : null,
    source: src
  });

  pendingAttempt = { phone: d, at: Date.now(), geo, source: src };

  if (!seen) {
    const where = place(geo && geo.city, geo && geo.country);
    const via = sourceLabel(src);
    alertNow(`attempt:${d}`, [
      '*Someone is pairing* 👀',
      `${maskPhone(d)}${where ? ` · ${where}` : ''}`,
      via ? `came via ${via}` : null,
      'the code went out, not linked yet',
      stamp()
    ].filter(Boolean).join('\n'));
  }
  return { attempts: store.totals.attempts, first: !seen };
}

/** WhatsApp refused to issue a code (bad number, rate limited). Counted only. */
function refused({ phone, ip, error } = {}) {
  if (!cfg.enabled) return null;
  store.totals.refused += 1;
  pushEvent('refused', {
    phone: digits(phone),
    ip: ip || null,
    error: String(error || '').slice(0, 120)
  });
  return { refused: store.totals.refused };
}

/** The code was typed wrong, or expired. Counted only, so retries stay quiet. */
function wrongCode({ phone, ip } = {}) {
  if (!cfg.enabled) return null;
  store.totals.wrongCode += 1;
  touchNumber(phone, { lastWrongCode: Date.now() });
  pushEvent('wrong_code', { phone: digits(phone), ip: ip || null });
  return { wrongCode: store.totals.wrongCode };
}

/**
 * The moment this build was waiting for: creds went from unregistered to
 * registered. Fires once per pairing, never on a reconnect or a redeploy.
 */
async function linked({ jid, name, platform } = {}) {
  load();
  const phone = digits(jid);
  const firstPair = !store.firstPairAt;
  const ctx = pendingAttempt && Date.now() - pendingAttempt.at < ATTEMPT_TTL_MS
    ? pendingAttempt
    : null;
  const subject = phone || (ctx && ctx.phone) || '';

  store.totals.linked += 1;
  if (firstPair) store.firstPairAt = Date.now();
  const rec = touchNumber(subject, { jid: jid || undefined, name: name || undefined });
  if (rec) rec.linked = (rec.linked || 0) + 1;
  pushEvent('linked', {
    phone: subject || null,
    jid: jid || null,
    name: name || null,
    city: (ctx && ctx.geo && ctx.geo.city) || null,
    country: (ctx && ctx.geo && ctx.geo.country) || null,
    source: (ctx && ctx.source) || null
  });

  if (!cfg.enabled) return { ...getStats(), alerted: false };

  const where = place(ctx && ctx.geo && ctx.geo.city, ctx && ctx.geo && ctx.geo.country);
  const via = sourceLabel(ctx && ctx.source);
  const took = ctx && ctx.at ? ` · paired ${duration(Date.now() - ctx.at)} after the code` : '';
  const lines = [
    '*New pairing* 🔗',
    `${maskPhone(subject)}${name ? ` (${String(name).slice(0, 40)})` : ''}`,
    where ? `from ${where}` : null,
    platform ? `device ${platform}` : null,
    via ? `came via ${via}` : null,
    stamp() + took,
    `${ordinal(store.totals.linked)} pairing on this build` +
      (firstPair ? ' · the first one, so a new deployment just came online' : '')
  ].filter(Boolean);

  const alerted = alertNow(`linked:${subject || 'unknown'}`, lines.join('\n'));
  cfg.log.info(`[pairtrack] pairing #${store.totals.linked} recorded (${maskPhone(subject)})`);
  await flush().catch(() => {});
  return { ...getStats(), alerted };
}

/** The device was removed on the phone. The bot is now waiting to pair again. */
function unpaired({ jid, name } = {}) {
  if (!cfg.enabled) return null;
  const phone = digits(jid);
  store.totals.unpaired += 1;
  pushEvent('unpaired', { phone, name: name || null });
  alertNow(`unpaired:${phone || 'unknown'}`, [
    '*Device removed* ⚠️',
    maskPhone(phone),
    name ? `${String(name).slice(0, 40)} logged the bot out` : 'the session was logged out on the phone',
    'the bot is unlinked and waits for the next pairing',
    stamp()
  ].filter(Boolean).join('\n'));
  return { unpaired: store.totals.unpaired };
}

/** A jadibot the owner's bot hosts came online for the first time. */
function jadibotLinked({ number, name, parent } = {}) {
  if (!cfg.enabled) return null;
  const phone = digits(number);
  store.totals.jadibot = (store.totals.jadibot || 0) + 1;
  pushEvent('jadibot', { phone, name: name || null, parent: parent || null });
  alertNow(`jadibot:${phone}`, [
    '*New jadibot paired* 🧩',
    maskPhone(phone) + (name ? ` (${String(name).slice(0, 40)})` : ''),
    'a user connected their own number to your bot',
    stamp()
  ].join('\n'));
  return { jadibot: store.totals.jadibot };
}

function ordinal(n) {
  const value = Number(n) || 0;
  const rem100 = value % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${value}th`;
  const suffix = { 1: 'st', 2: 'nd', 3: 'rd' }[value % 10] || 'th';
  return `${value}${suffix}`;
}

/* ── reading ───────────────────────────────────────────────────────────── */

function windowTotals(sinceDays) {
  const since = Date.now() - sinceDays * DAY;
  const out = { visits: 0, attempts: 0, linked: 0 };
  for (const [day, bucket] of Object.entries(store.days)) {
    if (new Date(`${day}T00:00:00Z`).getTime() < since) continue;
    out.visits += bucket.visits || 0;
    out.attempts += bucket.attempts || 0;
    out.linked += bucket.linked || 0;
  }
  return out;
}

function getStats() {
  load();
  const week = windowTotals(7);
  const today = store.days[dayKey()] || { visits: 0, attempts: 0, linked: 0 };
  const people = Object.entries(store.numbers)
    .map(([phone, rec]) => ({
      phone,
      masked: maskPhone(phone),
      name: rec.name || null,
      city: rec.city || null,
      country: rec.country || null,
      source: rec.source || null,
      attempts: rec.attempts || 0,
      linked: rec.linked || 0,
      first: rec.first || null,
      last: rec.last || null
    }))
    .sort((a, b) => (b.last || 0) - (a.last || 0));

  const lastLink = store.events.filter((event) => event.type === 'linked').pop();

  return {
    enabled: !!cfg.enabled,
    file: FILE,
    totals: { ...store.totals },
    today,
    week,
    uniqueNumbers: people.length,
    convert: store.totals.attempts
      ? Math.round((store.totals.linked / store.totals.attempts) * 100)
      : 0,
    firstPairAt: store.firstPairAt,
    lastLinkedAt: lastLink ? lastLink.t : null,
    pendingAlerts: queue.length,
    numbers: people,
    recent: store.events.slice(-12).reverse()
  };
}

const EVENT_LABEL = {
  visit: 'opened /pair',
  attempt: 'asked for a code',
  linked: 'paired',
  refused: 'code refused',
  wrong_code: 'code typed wrong',
  unpaired: 'device removed',
  jadibot: 'jadibot paired'
};

function eventLine(event) {
  const when = stamp(event.t);
  const who = event.phone ? maskPhone(event.phone) : 'visitor';
  const where = place(event.city, event.country);
  const via = sourceLabel(event.source);
  const tail = [where, via].filter(Boolean).join(' · ');
  const label = EVENT_LABEL[event.type] || event.type;
  const suffix = event.type === 'visit' ? '' : (tail ? ` (${tail})` : '');
  return `• ${when} — ${who} ${label}${suffix}`;
}

/** Plain-text report for `.pairs`, built from the same numbers as the JSON view. */
function report() {
  const s = getStats();
  const t = s.totals;
  const pct = (part, whole) => (whole ? `${Math.round((part / whole) * 100)}%` : '0%');
  const lines = [
    '*Pairing report*',
    `opened the page: *${t.visits}*`,
    `asked for a code: *${t.attempts}* (${pct(t.attempts, t.visits)} of visitors)`,
    `paired: *${t.linked}* (${pct(t.linked, t.attempts)} of codes)`,
    `wrong or expired codes: *${t.wrongCode}*`,
    `numbers WhatsApp refused: *${t.refused}*`,
    `devices removed: *${t.unpaired}*`,
    t.jadibot ? `jadibots paired: *${t.jadibot}*` : null,
    '',
    `last 7 days: *${s.week.visits}* visits · *${s.week.attempts}* codes · *${s.week.linked}* paired`,
    `today: *${s.today.visits}* visits · *${s.today.attempts}* codes · *${s.today.linked}* paired`,
    s.lastLinkedAt ? `last pairing: *${stamp(s.lastLinkedAt)}*` : 'last pairing: *none yet*',
    s.firstPairAt ? `first pairing: *${stamp(s.firstPairAt)}*` : null,
    s.pendingAlerts ? `${s.pendingAlerts} note(s) still waiting for the socket` : null
  ].filter((line) => line !== null);

  const people = s.numbers.slice(0, 8);
  if (people.length) {
    lines.push('', '*Numbers that reached the page*');
    for (const p of people) {
      const bits = [p.linked ? 'paired' : `${p.attempts} code${p.attempts === 1 ? '' : 's'}`];
      if (place(p.city, p.country)) bits.push(place(p.city, p.country));
      if (p.source) bits.push(p.source);
      lines.push(`• ${p.masked} — ${bits.join(' · ')}`);
    }
  }

  const recent = s.recent.filter((event) => event.type !== 'visit').slice(0, 6);
  if (recent.length) {
    lines.push('', '*Recent*');
    for (const event of recent) lines.push(eventLine(event));
  }
  if (!t.visits && !t.linked) {
    lines.push('', 'Nothing yet: nobody has opened the pairing page on this build.');
  }
  return lines.join('\n');
}

module.exports = {
  configure,
  isEnabled,
  setNotifier,
  flush,
  visit,
  attempt,
  refused,
  wrongCode,
  linked,
  unpaired,
  jadibotLinked,
  getStats,
  report,
  // exposed so the format can be checked without a WhatsApp socket
  maskPhone,
  prettyPhone,
  sourceLabel,
  eventLine,
  ordinal
};
