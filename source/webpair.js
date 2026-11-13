'use strict';

/**
 * webpair.js — browser pairing for Akoya-MD.
 *
 * Idea borrowed from NEXORA-MD's web pairing (src/web/pairWeb.js), rebuilt for
 * this codebase: Akoya is a single-socket CommonJS bot, so there is no session
 * fleet, no Telegram approval queue, and no express/helmet/rate-limit stack.
 * What was kept is the part that actually matters:
 *
 *   · the visitor enters a number and the CODE IS ISSUED BY THEM, never at boot
 *   · the code is shown only to the holder of a one-time polling token
 *   · the code never leaves this process (no WhatsApp/Telegram delivery)
 *   · a linking socket that closes after the code is accepted is RESUMED, not
 *     torn down (that is the "stuck on logging in" bug)
 *   · a socket that drops BEFORE the code is entered gets a fresh code, up to
 *     a small retry budget, instead of a dead page
 *   · start attempts are rate limited per IP, tokens expire
 *
 * What is different here on purpose:
 *   · zero new dependencies — node:http + crypto, so `npm install` stays the same
 *   · the page is self-contained (no Google Fonts, no CDN): a VPS behind a
 *     strict firewall still renders it
 *   · optional access key (global.webPair.key), because this bot is
 *     single-tenant: no admin is available to approve a stranger's request
 *   · the same server keeps serving /health after linking, which hosting
 *     panels and uptime checks can use
 *
 * Runtime contract (index.js owns the socket):
 *   webPair.setCodeRequester(async phone => code)
 *   webPair.setSnapshot(() => ({ ready, registered, jid, name }))
 *   webPair.start()                 -> begins listening (idempotent)
 *   webPair.onSocketReady()         -> after each (re)connect attempt
 *   webPair.markLinked({jid,name})  -> connection === 'open'
 *   webPair.markDisconnected(code)  -> connection === 'close'
 */

const fs = require('fs');
const http = require('http');
const path = require('path');
const crypto = require('crypto');
const pairTrack = require('./pairtrack');

const PAIRING_WINDOW_MS = 3 * 60 * 1000; // code entry window
const TOKEN_TTL_MS = 15 * 60 * 1000; // polling token life
const MAX_BODY = 8 * 1024;

const DEFAULTS = {
  enabled: true,
  port: Number(process.env.PORT || 3000),
  host: '0.0.0.0',
  key: '',
  codeWindowMs: PAIRING_WINDOW_MS,
  maxRotations: 2,
  statsKey: ''
};

let cfg = { ...DEFAULTS };
let server = null;
let listenError = null;
let startedAt = Date.now();

const handlers = {
  requestCode: null,
  snapshot: null,
  sessionInfo: null,
  restart: null
};

const state = {
  phase: 'idle', // idle | starting | code | linked | failed
  phone: null,
  code: null,
  error: null,
  rotated: false,
  issuedAt: null,
  expiresAt: null,
  attempts: 0,
  lastPollAt: 0,
  linked: null // { jid, name, at }
};

const tokens = new Map(); // token -> { phone, ts }
const buckets = new Map(); // `${ip}|${bucket}` -> { n, reset }

/* ── configuration ─────────────────────────────────────────────────────── */

function configure(patch = {}) {
  const next = { ...cfg, ...patch };
  next.port = Number(next.port) || DEFAULTS.port;
  next.host = String(next.host || DEFAULTS.host);
  next.key = String(next.key || '');
  next.codeWindowMs = Number(next.codeWindowMs) || DEFAULTS.codeWindowMs;
  next.customCode = next.customCode ? String(next.customCode).toUpperCase().replace(/[^A-Z0-9]/g, '') : '';
  next.maxRotations = Number.isFinite(next.maxRotations) ? next.maxRotations : DEFAULTS.maxRotations;
  cfg = next;
  // The pairing report is owner-only: unlocked by a key in the URL, never public.
  // Falls back to the page key, so a gated page is never a half-open door.
  cfg.statsKey = String(cfg.statsKey || process.env.PAIR_STATS_KEY || cfg.key || '');
  return cfg;
}

function isEnabled() {
  return !!cfg.enabled;
}

function setCodeRequester(fn) {
  handlers.requestCode = typeof fn === 'function' ? fn : null;
}

/** Lets the page rebuild a dead socket instead of telling the user to redeploy. */
function setRestartRequester(fn) {
  handlers.restart = typeof fn === 'function' ? fn : null;
}

function setSessionInfo(fn) {
  handlers.sessionInfo = typeof fn === 'function' ? fn : null;
}
function setSnapshot(fn) {
  handlers.snapshot = typeof fn === 'function' ? fn : null;
}

function snapshot() {
  if (!handlers.snapshot) return { ready: false, registered: false, jid: null, name: null };
  try {
    return handlers.snapshot() || { ready: false, registered: false, jid: null, name: null };
  } catch (_) {
    return { ready: false, registered: false, jid: null, name: null };
  }
}

/* ── state transitions (called by index.js) ────────────────────────────── */

function markLinked(info = {}) {
  state.phase = 'linked';
  state.code = null;
  state.expiresAt = null;
  state.error = null;
  state.linked = {
    jid: info.jid || null,
    name: info.name || null,
    at: Date.now()
  };
}

/** A fresh handshake deserves a fresh rotation budget. */
function resetRotations() {
  state.attempts = 0;
  state.rotated = false;
  return state.attempts;
}

function markDisconnected(statusCode, opts = {}) {
  state.code = null;
  state.expiresAt = null;
  const paired = opts.paired === undefined ? !!state.linked : !!opts.paired;
  if (statusCode === 401) {
    if (!paired) {
      // Not a dead session: WhatsApp refused the code typed on the phone (a wrong
      // digit, or it had expired). Keep the number so a fresh code can be issued.
      pairTrack.wrongCode({ phone: state.phone });
      state.phase = 'failed';
      state.linked = null;
      state.error = 'WhatsApp did not accept that code — it was typed wrong, or it had expired. Get a new code and type it exactly as shown.';
      return;
    }
    // WhatsApp removed the device: nothing stored can be resumed.
    state.phase = 'failed';
    state.phone = null;
    state.linked = null;
    state.error = 'this session was logged out on the phone — the bot is pairing itself again';
    return;
  }
  if (state.linked) {
    state.phase = 'starting';
    state.error = `disconnected (${statusCode == null ? 'unknown' : statusCode}) — reconnecting`;
    return;
  }
  if (state.phone) {
    state.phase = 'starting';
    state.error = 'the connection restarted — requesting a fresh code';
  } else {
    state.phase = 'idle';
  }
}

/**
 * Called right after the socket exists (first boot and every reconnect).
 * If somebody is mid-pairing, re-issue their code so the page never dies on
 * a 515/transient close. Respects the rotation budget.
 */
async function onSocketReady() {
  const snap = snapshot();
  if (snap.registered) {
    if (state.phase !== 'linked') markLinked({ jid: snap.jid, name: snap.name });
    return { phase: 'linked' };
  }
  if (!state.phone || !handlers.requestCode) {
    if (state.phase !== 'code') state.phase = 'starting';
    return { phase: state.phase };
  }
  // Nobody has polled the page for two minutes: do not spend another pairing
  // code on it. Repeated code requests are what gets a number flagged.
  const watching = state.phone && Date.now() - (state.lastPollAt || 0) < 120000;
  if (!watching) {
    state.phase = 'idle';
    state.code = null;
    state.expiresAt = null;
    state.phone = null;
    state.error = null;
    return { phase: 'idle' };
  }
  if (state.attempts >= cfg.maxRotations) {
    state.phase = 'failed';
    state.code = null;
    state.expiresAt = null;
    state.error = 'the connection kept restarting — request a new code';
    return { phase: 'failed' };
  }
  state.attempts += 1;
  try {
    const code = await handlers.requestCode(state.phone);
    state.phase = 'code';
    state.code = normaliseCode(code);
    state.rotated = true;
    state.error = null;
    state.issuedAt = Date.now();
    state.expiresAt = state.issuedAt + cfg.codeWindowMs;
    console.log(`[web-pair] fresh code issued for ${maskPhone(state.phone)} (retry ${state.attempts}/${cfg.maxRotations})`);
    return { phase: 'code', code: state.code };
  } catch (error) {
    state.phase = 'failed';
    state.code = null;
    state.expiresAt = null;
    state.error = error && error.message ? error.message : String(error);
    return { phase: 'failed', error: state.error };
  }
}

/* ── helpers ───────────────────────────────────────────────────────────── */

function normaliseCode(code) {
  return String(code == null ? '' : code).replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

function maskPhone(phone) {
  const p = String(phone || '');
  return p.length > 4 ? `${p.slice(0, 4)}${'•'.repeat(Math.max(0, p.length - 6))}${p.slice(-2)}` : '••••';
}

function pruneTokens() {
  const now = Date.now();
  for (const [token, rec] of tokens) {
    if (now - rec.ts > TOKEN_TTL_MS) tokens.delete(token);
  }
  // Rate-limit buckets used to live forever: one entry per visitor, never
  // removed. Expired buckets go with the token sweep.
  for (const [key, rec] of buckets) {
    if (now > rec.reset) buckets.delete(key);
  }
}

function keysEqual(given, expected) {
  const a = Buffer.from(String(given || ''));
  const b = Buffer.from(String(expected || ''));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function rateLimit(ip, bucket, max, windowMs) {
  const key = `${ip}|${bucket}`;
  const now = Date.now();
  const rec = buckets.get(key);
  if (!rec || now > rec.reset) {
    buckets.set(key, { n: 1, reset: now + windowMs });
    return true;
  }
  if (rec.n >= max) return false;
  rec.n += 1;
  return true;
}

/**
 * The visitor's address, not the proxy's. Behind Fly (or any reverse proxy) the
 * socket belongs to the proxy, so rate limits and geo lookups would all collapse
 * onto one address. `fly-client-ip` is set by Fly itself and cannot be spoofed by
 * the client; the forwarded headers are the fallback elsewhere.
 */
function clientIp(req) {
  const headers = req.headers || {};
  const first = (value) => String(value || '').split(',')[0].replace(/\s+/g, '');
  const candidates = [
    headers['fly-client-ip'],
    first(headers['x-forwarded-for']),
    headers['x-real-ip'],
    req.socket && req.socket.remoteAddress
  ];
  for (const candidate of candidates) {
    const ip = String(candidate || '').replace(/^::ffff:/, '').trim();
    if (ip) return ip;
  }
  return 'unknown';
}

/** Where the visitor clicked from: an ad campaign first, then the referrer host. */
function requestSource(req, query, body) {
  const fromBody = body && typeof body.source === 'object' ? body.source : {};
  const pick = (key) => fromBody[key] || (query && query.get ? query.get(key) : '') || '';
  let referrer = String(fromBody.referrer || '');
  if (!referrer) {
    const raw = String((req.headers && req.headers.referer) || '');
    try {
      const host = raw ? new URL(raw).hostname.replace(/^www\./, '') : '';
      const mine = String(req.headers.host || '').split(':')[0];
      referrer = host && host !== mine ? host : '';
    } catch (_) {
      referrer = '';
    }
  }
  const source = {
    utm_source: pick('utm_source') || pick('src'),
    utm_medium: pick('utm_medium') || pick('medium'),
    utm_campaign: pick('utm_campaign') || pick('campaign'),
    referrer
  };
  return Object.values(source).some(Boolean) ? source : null;
}

function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

/* ── http plumbing ─────────────────────────────────────────────────────── */

// Brand art for ad-reply thumbnails. Whitelisted by name: this is not a static
// file server, and nothing else in media/ (payment IDs, audio) is reachable.
const MEDIA_DIR = path.join(__dirname, '..', 'media');
const MEDIA_FILES = new Set(['menu.jpg', 'thum.jpg']);
const MEDIA_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp'
};

function serveMedia(req, res, rawName) {
  let name = '';
  try {
    name = decodeURIComponent(rawName);
  } catch (_) {
    name = '';
  }
  if (!MEDIA_FILES.has(name)) return sendJson(res, 404, { error: 'Not found' });
  const file = path.join(MEDIA_DIR, name);
  fs.readFile(file, (error, data) => {
    if (error) return sendJson(res, 404, { error: 'Not found' });
    res.writeHead(200, {
      'Content-Type': MEDIA_TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Content-Length': data.length,
      'Cache-Control': 'public, max-age=604800, immutable',
      'X-Content-Type-Options': 'nosniff'
    });
    if (req.method === 'HEAD') return res.end();
    return res.end(data);
  });
}

const SECURITY_HEADERS = {
  'Content-Security-Policy':
    "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; " +
    "img-src data:; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Cache-Control': 'no-store'
};

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    ...SECURITY_HEADERS,
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

function sendHtml(res, status, html) {
  res.writeHead(status, {
    ...SECURITY_HEADERS,
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Length': Buffer.byteLength(html)
  });
  res.end(html);
}

function readJson(req) {
  return new Promise((resolve) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        resolve(null);
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (!chunks.length) return resolve({});
      try {
        const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        resolve(parsed && typeof parsed === 'object' ? parsed : {});
      } catch (_) {
        resolve(null);
      }
    });
    req.on('error', () => resolve(null));
  });
}

function publicUrl() {
  const host = cfg.host === '0.0.0.0' || cfg.host === '::' ? 'localhost' : cfg.host;
  return `http://${host}:${cfg.port}/pair`;
}

/* ── request handling ──────────────────────────────────────────────────── */

async function handleStart(req, res) {
  // 8, not 3: a rejected code is normal (wrong digit, expired) and the retry has
  // to work straight away instead of answering "too many attempts".
  if (!rateLimit(clientIp(req), 'start', 8, 10 * 60 * 1000)) {
    return sendJson(res, 429, { error: 'Too many pairing attempts from this address. Wait a few minutes.' });
  }
  pruneTokens();

  const body = await readJson(req);
  if (!body) return sendJson(res, 400, { error: 'Malformed request.' });

  if (cfg.key && !keysEqual(body.key, cfg.key)) {
    return sendJson(res, 401, { error: 'Wrong access key.' });
  }

  const phone = String(body.phone || '').replace(/[^0-9]/g, '');
  if (phone.length < 7 || phone.length > 15) {
    return sendJson(res, 400, {
      error: 'Enter the full number with the country code, digits only. Example: 233240000000.'
    });
  }

  const snap = snapshot();
  if (snap.registered || state.phase === 'linked') {
    return sendJson(res, 409, { error: 'This bot is already linked to WhatsApp.' });
  }
  if (!handlers.requestCode) {
    return sendJson(res, 503, { error: 'Pairing is not available on this instance.' });
  }
  if (!snap.ready) {
    // No socket (the rotation budget ran out, or it was refused): rebuild one
    // rather than making the owner redeploy just to get a code.
    if (handlers.restart) {
      Promise.resolve().then(() => handlers.restart()).catch(() => {});
      return sendJson(res, 202, {
        retry: true,
        error: 'Restarting the pairing socket. Try again in about ten seconds.'
      });
    }
    return sendJson(res, 503, { error: 'The bot is still starting. Give it a few seconds and try again.' });
  }

  state.attempts = 0;
  state.rotated = false;
  try {
    const code = await handlers.requestCode(phone);
    state.phase = 'code';
    state.phone = phone;
    state.code = normaliseCode(code);
    state.error = null;
    state.issuedAt = Date.now();
    state.expiresAt = state.issuedAt + cfg.codeWindowMs;
  } catch (error) {
    state.phase = 'failed';
    state.phone = phone;
    state.code = null;
    state.expiresAt = null;
    state.error = (error && error.message) || 'WhatsApp did not return a pairing code. Try again.';
    pairTrack.refused({ phone, ip: clientIp(req), error: state.error });
    return sendJson(res, 409, { error: state.error });
  }

  const token = crypto.randomUUID();
  tokens.set(token, { phone, ts: Date.now(), ip: clientIp(req) });
  const ip = clientIp(req);
  console.log(`[web-pair] code issued for ${maskPhone(phone)} from ${ip}`);
  // Fire and forget: telemetry must never delay or fail a pairing.
  Promise.resolve()
    .then(() => pairTrack.attempt({ phone, ip, source: requestSource(req, null, body) }))
    .catch(() => {});

  return sendJson(res, 200, {
    token,
    phone,
    expiresAt: state.expiresAt,
    step: 'code'
  });
}

function handleStatus(req, res, query) {
  if (!rateLimit(clientIp(req), 'status', 150, 10 * 60 * 1000)) {
    return sendJson(res, 429, { phase: 'blocked', error: 'Too many requests. Reload the page.' });
  }
  pruneTokens();

  const token = String(query.get('token') || '');
  const rec = token ? tokens.get(token) : null;
  if (!rec) {
    return sendJson(res, 404, { phase: 'expired', error: 'This pairing session expired. Start again.' });
  }

  state.lastPollAt = Date.now();
  const snap = snapshot();
  const linked = snap.registered || state.phase === 'linked';
  if (linked) {
    return sendJson(res, 200, {
      phase: 'linked',
      phone: rec.phone,
      linked: {
        name: (state.linked && state.linked.name) || snap.name || null,
        jid: (state.linked && state.linked.jid) || snap.jid || null
      }
    });
  }

  // Before `ready`: a refused attempt closes the socket, and reporting that as
  // "starting" is what left the page spinning on "Talking to WhatsApp".
  if (state.phase === 'failed') {
    return sendJson(res, 200, { phase: 'failed', phone: rec.phone, error: state.error, retryable: true });
  }

  if (!snap.ready) {
    return sendJson(res, 200, { phase: 'starting', phone: rec.phone, error: state.error });
  }

  if (state.phone && state.phone !== rec.phone) {
    return sendJson(res, 200, {
      phase: 'busy',
      phone: rec.phone,
      error: 'Another number is being paired right now. Try again in a minute.'
    });
  }

  if (state.phase === 'code' && state.code) {
    const expired = state.expiresAt && Date.now() > state.expiresAt;
    if (!expired) {
      return sendJson(res, 200, {
        phase: 'code',
        phone: rec.phone,
        code: state.code,
        rotated: state.rotated,
        expiresAt: state.expiresAt,
        secondsLeft: Math.max(0, Math.round((state.expiresAt - Date.now()) / 1000))
      });
    }
    return sendJson(res, 200, { phase: 'expired_code', phone: rec.phone });
  }

  return sendJson(res, 200, { phase: 'starting', phone: rec.phone, error: state.error });
}

async function route(req, res) {
  const url = new URL(req.url || '/', 'http://localhost');
  const pathname = url.pathname.replace(/\/+$/, '') || '/';

  if (req.method === 'GET' && (pathname === '/' || pathname === '/pair')) {
    if (!cfg.enabled) {
      return sendHtml(res, 503, renderDisabled());
    }
    // Counted before the page is served: a visitor who never submits a number is
    // still part of the advert funnel.
    try {
      pairTrack.visit({ ip: clientIp(req), source: requestSource(req, url.searchParams) });
    } catch (_) {
      /* telemetry never blocks a page load */
    }
    return sendHtml(res, 200, renderPage());
  }

  if ((req.method === 'GET' || req.method === 'HEAD') && pathname.startsWith('/media/')) {
    return serveMedia(req, res, pathname.slice('/media/'.length));
  }

  if (req.method === 'GET' && pathname === '/health') {
    const snap = snapshot();
    const session = handlers.sessionInfo ? await handlers.sessionInfo().catch(() => null) : null;
    // The session report is public (uptime checks hit this), so filesystem
    // paths stay out of it. The linked number stays: the README documents
    // it, and it is how a deploy is confirmed to be the right bot.
    const { dir: _dir, dataDir: _dataDir, ...publicSession } = session || {};
    return sendJson(res, 200, {
      ok: true,
      // Which build is answering. Without this, confirming a deploy means
      // reading the machine by hand.
      version: require('../package.json').version,
      startedAt: new Date(startedAt).toISOString(),
      uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
      phase: state.phase,
      linked: !!(snap.registered || state.phase === 'linked'),
      jid: (snap && snap.jid) || null,
      session: session ? publicSession : null
    });
  }

  if (req.method === 'GET' && pathname === '/pair/api/stats') {
    // 404 rather than 401 when no key is configured: an unset key must never turn
    // the owner's usage numbers into a public endpoint.
    if (!cfg.statsKey) return sendJson(res, 404, { error: 'Not found' });
    if (!rateLimit(clientIp(req), 'stats', 30, 10 * 60 * 1000)) {
      return sendJson(res, 429, { error: 'Too many requests.' });
    }
    if (!keysEqual(url.searchParams.get('key'), cfg.statsKey)) return sendJson(res, 401, { error: 'Wrong key.' });
    return sendJson(res, 200, pairTrack.getStats());
  }

  if (req.method === 'GET' && pathname === '/pair/api/info') {
    // No customCode here: the old response advertised the bot's fixed
    // pairing code to every visitor, so the code was no secret at all.
    // The code itself is only ever shown to a token-holding visitor who
    // asked for it, via /pair/api/status.
    return sendJson(res, 200, {
      enabled: !!cfg.enabled,
      keyRequired: !!cfg.key,
      phase: state.phase,
      codeWindowMs: cfg.codeWindowMs,
      serverTime: Date.now()
    });
  }

  if (req.method === 'POST' && pathname === '/pair/api/start') {
    if (!cfg.enabled) return sendJson(res, 503, { error: 'Web pairing is disabled by the operator.' });
    return handleStart(req, res);
  }

  if (req.method === 'GET' && pathname === '/pair/api/status') {
    if (!cfg.enabled) return sendJson(res, 503, { phase: 'expired', error: 'Web pairing is disabled.' });
    return handleStatus(req, res, url.searchParams);
  }

  return sendJson(res, 404, { error: 'Not found' });
}

/* ── server lifecycle ──────────────────────────────────────────────────── */

function start() {
  if (!cfg.enabled) return null;
  if (server && server.listening) return publicUrl();
  if (listenError) return null;
  startedAt = Date.now();
  server = http.createServer(async (req, res) => {
    Promise.resolve(route(req, res)).catch((error) => {
      try {
        sendJson(res, 500, { error: 'Internal error' });
      } catch (_) {
        /* response already sent */
      }
      console.error('[web-pair] request failed:', error && error.message ? error.message : error);
    });
  });
  server.on('error', (error) => {
    console.error(`[web-pair] cannot listen on ${cfg.host}:${cfg.port} — ${error.code || error.message}`);
    listenError = error.code || error.message || 'listen failed';
    server = null;
  });
  try {
    server.listen(cfg.port, cfg.host, () => {
      listenError = null;
      console.log(`[web-pair] listening on ${publicUrl()}`);
    });
  } catch (error) {
    console.error('[web-pair] failed to start:', error.message);
    server = null;
    return null;
  }
  return publicUrl();
}

function stop() {
  if (!server) return;
  try {
    server.close();
  } catch (_) {
    /* ignore */
  }
  server = null;
}

function isListening() {
  return !!(server && server.listening);
}

function getState() {
  return { ...state, linked: state.linked ? { ...state.linked } : null };
}

/* ── page ──────────────────────────────────────────────────────────────── */

function brand() {
  const g = (typeof global !== 'undefined' ? global : {});
  return {
    name: g.botname || 'Akoya-MD',
    telegram: g.tele || '',
    whatsapp: g.linkOwner || '',
    channel: g.linkSaluran || '',
    group: g.linkGrup || '',
    keyRequired: !!cfg.key
  };
}

function renderDisabled() {
  const b = brand();
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(b.name)} · pairing off</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#08060d;color:#F3F4F6;font:16px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
main{max-width:34ch;text-align:center;padding:2rem}p{color:#9CA3AF}</style></head>
<body><main><h1 style="font-size:1.2rem">Web pairing is off</h1>
<p>The operator disabled browser pairing for this bot. Use the terminal, or ask the owner for a code.</p></main></body></html>`;
}

function renderPage() {
  const b = brand();
  const channel = b.channel
    ? `<a href="${escapeHtml(b.channel)}" target="_blank" rel="noopener">Channel</a>`
    : '';
  const group = b.group
    ? `<a href="${escapeHtml(b.group)}" target="_blank" rel="noopener">Group</a>`
    : '';
  const telegram = b.telegram
    ? `<a href="https://${escapeHtml(b.telegram).replace(/^https?:\/\//, '')}" target="_blank" rel="noopener">Telegram</a>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>${escapeHtml(b.name)} · link WhatsApp</title>
<style>
:root{--bg:#08060d;--panel:#12101c;--line:rgba(255,255,255,.09);--ink:#F3F4F6;--mut:#9CA3AF;--dim:#6B7280;
--accent:#A78BFA;--accent-deep:#7C3AED;--ok:#34D399;--err:#F87171;--warn:#FBBF24}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:1.5rem 1rem 2.5rem;position:relative;overflow-x:hidden}
body::before{content:"";position:fixed;inset:-20% -10% auto -10%;height:52vh;z-index:0;pointer-events:none;
background:radial-gradient(ellipse at 30% 0%,rgba(124,58,237,.35),transparent 62%),
radial-gradient(ellipse at 75% 10%,rgba(167,139,250,.16),transparent 60%);filter:blur(8px)}
.orbs{position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none}
.orb{position:absolute;border-radius:50%;will-change:transform}
.orb-a{width:420px;height:420px;left:-120px;top:-80px;background:radial-gradient(circle,rgba(124,58,237,.26),transparent 68%);animation:drift 26s ease-in-out infinite alternate}
.orb-b{width:360px;height:360px;right:-110px;top:34%;background:radial-gradient(circle,rgba(167,139,250,.16),transparent 68%);animation:drift 32s ease-in-out infinite alternate-reverse}
.orb-c{width:300px;height:300px;left:38%;bottom:-150px;background:radial-gradient(circle,rgba(76,29,149,.28),transparent 68%);animation:drift 38s ease-in-out infinite alternate}
@keyframes drift{from{transform:translate3d(0,0,0) scale(1)}to{transform:translate3d(24px,-18px,0) scale(1.06)}}
@keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
nav{animation:rise .5s ease both}
h1{animation:rise .5s .08s ease both}
.lede{animation:rise .5s .16s ease both}
.assurance{animation:rise .5s .22s ease both}
.card{animation:rise .55s .28s ease both}
footer,.footnote{animation:rise .5s .36s ease both}
.wrap{position:relative;z-index:1;width:100%;max-width:460px}
nav{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin:.25rem 0 1.6rem}
.brand{display:flex;align-items:center;gap:.6rem;font-weight:700;letter-spacing:.02em}
.mark{width:30px;height:30px;border-radius:10px;display:grid;place-items:center;flex:0 0 auto;
background:linear-gradient(150deg,var(--accent),var(--accent-deep));box-shadow:0 6px 18px -8px rgba(167,139,250,.9);
animation:glow 4s ease-in-out infinite;transition:transform .3s ease}
@keyframes glow{0%,100%{box-shadow:0 6px 18px -8px rgba(167,139,250,.9)}50%{box-shadow:0 6px 22px -6px rgba(167,139,250,1)}}
.brand:hover .mark{transform:scale(1.06) rotate(-4deg)}
.mark svg{width:16px;height:16px}
.pill{display:inline-flex;align-items:center;gap:.4rem;font-size:.72rem;color:var(--mut);
border:1px solid var(--line);padding:.3rem .7rem;border-radius:999px;white-space:nowrap}
.dot{width:7px;height:7px;border-radius:50%;background:var(--warn);box-shadow:0 0 8px currentColor}
.dot.on{background:var(--ok);color:var(--ok)}
.dot.off{background:var(--err);color:var(--err)}
h1{font-size:clamp(1.6rem,6vw,1.95rem);line-height:1.15;letter-spacing:-.02em;margin:0 0 .6rem;font-weight:750}
h1 em{font-style:normal;color:var(--accent)}
.lede{color:var(--mut);margin:0 0 .7rem;max-width:40ch}
.assurance{display:flex;gap:.5rem;align-items:flex-start;color:var(--dim);font-size:.82rem;line-height:1.5;margin:0 0 1.4rem;max-width:44ch}
.assurance svg{flex:0 0 auto;margin-top:.18rem;color:var(--accent)}
.card{background:linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.02));
border:1px solid var(--line);border-radius:18px;padding:1.35rem;
box-shadow:0 26px 60px -34px rgba(0,0,0,.9)}
.steps{list-style:none;margin:0 0 1.25rem;padding:0;display:flex;flex-direction:column;gap:.7rem}
.steps li{display:flex;gap:.7rem;align-items:flex-start;font-size:.87rem;color:#C7CFDA;
padding:.85rem .9rem;border:1px solid var(--line);border-radius:14px;background:rgba(255,255,255,.02);
transition:transform .25s ease,border-color .25s ease,background .25s ease,box-shadow .25s ease}
.steps li:hover{transform:translateY(-1px);border-color:rgba(167,139,250,.35)}
.steps li.active{border-color:rgba(167,139,250,.55);background:rgba(167,139,250,.08);box-shadow:0 10px 24px -18px rgba(124,58,237,.8)}
.steps li::before{content:attr(data-n);flex:0 0 auto;width:24px;height:24px;border-radius:8px;display:grid;place-items:center;
font-size:.75rem;font-weight:700;color:var(--accent);background:rgba(167,139,250,.1);border:1px solid rgba(167,139,250,.28);
transition:background .25s ease,color .25s ease,box-shadow .25s ease}
.steps li.active::before{background:linear-gradient(150deg,var(--accent),var(--accent-deep));color:#140a28;border-color:transparent;
box-shadow:0 4px 14px -6px rgba(167,139,250,.9)}
.steps b{display:block;color:var(--ink);margin-bottom:.1rem}
label{display:block;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--mut);margin:0 0 .45rem;font-weight:600}
input{width:100%;padding:.9rem 1rem;font-size:1.05rem;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
background:rgba(0,0,0,.4);border:1px solid var(--line);border-radius:12px;color:var(--ink);outline:none;transition:border-color .18s,box-shadow .18s}
input::placeholder{color:#4b5563}
input:hover{border-color:rgba(255,255,255,.18)}
input.valid{border-color:rgba(52,211,153,.55);box-shadow:0 0 0 3px rgba(52,211,153,.12)}
input:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(167,139,250,.16)}
.field+.field{margin-top:.9rem}
button{font:inherit;cursor:pointer;border-radius:12px;border:1px solid transparent;width:100%;padding:.9rem;font-weight:650}
button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.cta{margin-top:1.1rem;display:flex;align-items:center;justify-content:center;gap:.6rem;
background:linear-gradient(120deg,var(--accent),var(--accent-deep),var(--accent));background-size:200% 100%;color:#140a28;
box-shadow:0 12px 28px -14px rgba(124,58,237,.95);transition:background-position .5s ease,filter .18s,transform .1s,box-shadow .18s}
.cta:hover{background-position:100% 0;filter:brightness(1.08)}
.cta:active{transform:translateY(1px) scale(.99)}
.cta:disabled{filter:saturate(.35) brightness(.72);cursor:not-allowed;box-shadow:none;background-position:0 0}
.cta.loading::before{content:"";width:16px;height:16px;border-radius:50%;flex:0 0 auto;
border:2px solid rgba(20,10,40,.3);border-top-color:#140a28;animation:spin .8s linear infinite}
.ghost{background:transparent;border-color:var(--line);color:var(--ink);margin-top:.7rem}
.ghost:hover{border-color:#7c8899}
.msg{margin-top:.75rem;font-size:.83rem;min-height:1.1rem;color:var(--mut)}
.msg.err{color:var(--err)}
.msg.ok{color:var(--ok)}
.hidden{display:none!important}
.progresshead{display:flex;align-items:center;gap:.65rem;margin-bottom:1rem}
.spinner{width:16px;height:16px;border-radius:50%;border:2px solid rgba(167,139,250,.25);border-top-color:var(--accent);animation:spin .9s linear infinite;flex:0 0 auto}
@keyframes spin{to{transform:rotate(360deg)}}
.sub{color:var(--mut);font-size:.85rem;margin:.15rem 0 0}
.codebox{margin:1.1rem 0 .35rem;padding:1rem .5rem;border-radius:14px;border:1px dashed rgba(167,139,250,.4);
background:rgba(167,139,250,.07);display:flex;justify-content:center;gap:.35rem;flex-wrap:wrap}
.codebox.reveal{animation:codeIn .4s ease both}
@keyframes codeIn{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:none}}
.digit{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:clamp(1.3rem,7.5vw,1.65rem);font-weight:700;letter-spacing:.06em;
width:1.55em;text-align:center;color:#fff;text-shadow:0 0 22px rgba(167,139,250,.55);animation:pop .35s ease both}
.digit.gap{margin-left:.5rem}
@keyframes pop{from{opacity:0;transform:translateY(6px) scale(.92)}to{opacity:1;transform:none}}
.howto{margin:.9rem 0 0;padding:0 0 0 1.05rem;color:#C7CFDA;font-size:.85rem}
.howto li{margin:.3rem 0}
.howto b{color:var(--ink)}
.timer{font-size:.78rem;color:var(--dim);margin-top:.55rem}
.ok-mark{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;margin-bottom:.85rem;
background:rgba(52,211,153,.12);border:1px solid rgba(52,211,153,.35);color:var(--ok)}
.ident{font-size:1.05rem;font-weight:650;margin:.2rem 0 .1rem;word-break:break-word}
.mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.78rem;color:var(--dim);word-break:break-all}
footer{margin-top:1.6rem;display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;font-size:.78rem;color:var(--dim)}
footer a{color:var(--mut);text-decoration:none;border-bottom:1px solid rgba(255,255,255,.14);padding-bottom:1px}
footer a:hover{color:var(--ink)}
.footnote{margin-top:1.1rem;text-align:center;font-size:.72rem;color:#4b5563;line-height:1.5}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
@media (max-width:420px){body{padding:1.25rem .9rem 2rem}.card{padding:1.2rem}.steps{gap:.6rem}.steps li{padding:.75rem .8rem}button{padding:1rem}}
@media (max-width:380px){.digit{font-size:1.35rem}.card{padding:1.1rem}nav{margin-bottom:1.2rem}}
</style>
</head>
<body>
<div class="orbs" aria-hidden="true"><i class="orb orb-a"></i><i class="orb orb-b"></i><i class="orb orb-c"></i></div>
<div class="wrap">
  <nav>
    <div class="brand">
      <span class="mark"><svg viewBox="0 0 24 24" fill="none" stroke="#140a28" stroke-width="2.2" stroke-linecap="round"><path d="M12 3a9 9 0 1 0 9 9"/><path d="M21 3v6h-6"/></svg></span>
      <span>${escapeHtml(b.name)}</span>
    </div>
    <span class="pill" aria-label="Server status"><i class="dot" id="dot"></i><span id="server-label">Checking…</span></span>
  </nav>

  <h1>Link this bot to <em>WhatsApp</em></h1>
  <p class="lede">Connect your WhatsApp account securely and start using Akoya-MD. Generate your pairing code and link your account in just a few steps.</p>
  <p class="assurance"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg><span>Your WhatsApp account remains under your control. Only link accounts you own or are authorized to use.</span></p>

  <section class="card">
    <!-- step 1 -->
    <div id="view-input">
      <ol class="steps" id="steps">
        <li data-n="1" data-step="1" class="active"><span><b>Enter your number</b>Type the number that will become the bot, with country code and no + or spaces.</span></li>
        <li data-n="2" data-step="2"><span><b>Generate the code</b>Press the button. Your 8-character code appears here in a few seconds.</span></li>
        <li data-n="3" data-step="3"><span><b>Link in WhatsApp</b>On that phone open WhatsApp → Linked devices → Link a device → Link with phone number instead, and type the code.</span></li>
      </ol>
      <div class="field">
        <label for="phone">WhatsApp number</label>
        <input id="phone" type="tel" inputmode="numeric" autocomplete="tel" spellcheck="false" placeholder="233240000000">
      </div>
      <div class="field hidden" id="key-field">
        <label for="key">Access key</label>
        <input id="key" type="text" autocomplete="off" spellcheck="false" placeholder="from the bot owner">
      </div>
      <button class="cta" id="btn-start"><span class="btn-label">Generate Pairing Code</span></button>
      <p class="msg" id="msg-input"></p>
    </div>

    <!-- step 2 -->
    <div id="view-progress" class="hidden">
      <div class="progresshead">
        <span class="spinner" id="spin"></span>
        <div>
          <strong id="prog-title">Talking to WhatsApp…</strong>
          <p class="sub" id="prog-sub">This usually takes 5–15 seconds.</p>
        </div>
      </div>
      <div class="codebox hidden" id="codebox"></div>
      <button class="ghost hidden" id="btn-copy">Copy code</button>
      <ol class="howto hidden" id="howto">
        <li>Open <b>WhatsApp</b> on that phone.</li>
        <li>Go to <b>Settings → Linked devices → Link a device</b>.</li>
        <li>Tap <b>Link with phone number instead</b> and type the code above.</li>
      </ol>
      <p class="timer hidden" id="timer"></p>
      <button class="ghost hidden" id="btn-retry">Get a new code</button>
      <p class="msg" id="msg-progress"></p>
    </div>

    <!-- step 3 -->
    <div id="view-success" class="hidden">
      <div class="ok-mark"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>
      <strong>Linked. The bot is online.</strong>
      <p class="ident" id="who"></p>
      <p class="mono" id="jid"></p>
      <button class="ghost" id="btn-again">Link another number</button>
      <p class="msg ok" id="msg-success"></p>
    </div>
  </section>

  <footer>
    ${telegram}
    ${channel}
    ${group}
  </footer>
  <p class="footnote">This page is the bot's pairing surface. Keep the address private and close it when you are done.</p>
</div>

<script>
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var token = null, phone = '', pollTimer = null, tickTimer = null, lastPhase = '';
  var LINKED_KEY = 'akoya-pair-token';

  function showView(id) {
    ['view-input', 'view-progress', 'view-success'].forEach(function (v) {
      $(v).classList.toggle('hidden', v !== id);
    });
  }
  // The top badge reports only whether this server answers. It used to show
  // the bot's pairing phase ("linked", "waiting"), which read as if the
  // visitor's own account was already connected. Online/offline follows
  // real fetches: a response means online, a failed fetch means offline.
  // Nothing here claims the bot or the visitor's account is linked.
  function setServerStatus(state) {
    var dot = $('dot');
    var label = $('server-label');
    if (state === 'online') {
      dot.className = 'dot on';
      label.textContent = 'Server Online';
    } else if (state === 'offline') {
      dot.className = 'dot off';
      label.textContent = 'Server Offline';
    } else {
      dot.className = 'dot';
      label.textContent = 'Checking…';
    }
  }
  function setBtnLabel(text, loading) {
    var btn = $('btn-start');
    btn.querySelector('.btn-label').textContent = text;
    btn.classList.toggle('loading', !!loading);
  }
  // Visual progress only: step 2 lights up once the number looks complete.
  // It never gates anything; the button works the same either way.
  function setStep(n) {
    var items = document.querySelectorAll('#steps li');
    for (var i = 0; i < items.length; i++) {
      items[i].classList.toggle('active', Number(items[i].getAttribute('data-step')) === n);
    }
  }
  function say(id, text, kind) {
    var el = $(id);
    el.textContent = text || '';
    el.className = 'msg' + (kind ? ' ' + kind : '');
  }
  function digits(text) {
    return String(text || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  }
  function renderCode(code) {
    var box = $('codebox');
    box.innerHTML = '';
    digits(code).split('').forEach(function (ch, i) {
      var d = document.createElement('span');
      d.className = 'digit' + (i === 4 ? ' gap' : '');
      d.textContent = ch;
      d.style.animationDelay = (i * 45) + 'ms';
      box.appendChild(d);
    });
    box.classList.remove('hidden');
    box.classList.remove('reveal');
    void box.offsetWidth;
    box.classList.add('reveal');
    $('btn-copy').classList.remove('hidden');
    $('howto').classList.remove('hidden');
    $('timer').classList.remove('hidden');
  }
  function clearPoll() {
    if (pollTimer) { clearTimeout(pollTimer); pollTimer = null; }
    if (tickTimer) { clearInterval(tickTimer); tickTimer = null; }
  }

  fetch('/pair/api/info').then(function (r) { return r.json(); }).then(function (d) {
    setServerStatus('online');
    if (d.keyRequired) $('key-field').classList.remove('hidden');
  }).catch(function () { setServerStatus('offline'); });

  $('btn-start').addEventListener('click', start);
  $('phone').addEventListener('input', function () {
    var num = this.value.replace(/[^0-9]/g, '');
    var valid = num.length >= 7 && num.length <= 15;
    this.classList.toggle('valid', valid);
    setStep(valid ? 2 : 1);
  });
  $('phone').addEventListener('keydown', function (e) { if (e.key === 'Enter') start(); });
  $('key').addEventListener('keydown', function (e) { if (e.key === 'Enter') start(); });
  $('btn-retry').addEventListener('click', start);
  $('btn-copy').addEventListener('click', function () {
    var text = digits($('codebox').textContent);
    var btn = this;
    var done = function () { btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = 'Copy code'; }, 1500); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () { done(); });
    } else {
      var area = document.createElement('textarea');
      area.value = text;
      document.body.appendChild(area);
      area.select();
      try { document.execCommand('copy'); } catch (e) { /* ignore */ }
      document.body.removeChild(area);
      done();
    }
  });
  $('btn-again').addEventListener('click', function () {
    token = null;
    try { sessionStorage.removeItem(LINKED_KEY); } catch (e) { /* ignore */ }
    $('codebox').innerHTML = '';
    $('codebox').classList.add('hidden');
    $('howto').classList.add('hidden');
    $('btn-copy').classList.add('hidden');
    $('timer').classList.add('hidden');
    $('btn-retry').classList.add('hidden');
    $('spin').style.display = 'block';
    say('msg-progress', '');
    say('msg-input', '');
    $('btn-start').disabled = false;
    setBtnLabel('Generate Pairing Code', false);
    $('phone').classList.remove('valid');
    setStep(1);
    showView('view-input');
    lastPhase = '';
  });

  // Where this visitor came from. Read on the page so /pair?utm_source=tiktok
  // survives a reload, and posted with the number so the report can say which
  // advert actually produced a pairing.
  function campaign() {
    var out = {};
    try {
      var params = new URLSearchParams(location.search);
      ['utm_source', 'src', 'utm_medium', 'utm_campaign', 'ref'].forEach(function (k) {
        var v = params.get(k);
        if (v) out[k] = String(v).slice(0, 40);
      });
      var ref = document.referrer || '';
      if (ref && ref.indexOf(location.host) === -1) out.referrer = String(ref).slice(0, 120);
    } catch (e) {
      /* very old browser: no campaign, pairing still works */
    }
    return out;
  }

  function start() {
    // One request at a time: Enter + click (or a double tap) used to be
    // able to fire twice before the button disabled. The request itself
    // is unchanged; this only guards re-entry.
    if (start.busy) return;
    var raw = $('phone').value;
    var num = raw.replace(/[^0-9]/g, '');
    var key = $('key').value;
    if (num.length < 7 || num.length > 15) {
      say('msg-input', 'Enter the full number with the country code, digits only. Example: 233240000000.', 'err');
      return;
    }
    start.busy = true;
    phone = num;
    say('msg-input', '');
    var btn = $('btn-start');
    btn.disabled = true;
    setBtnLabel('Generating…', true);

    fetch('/pair/api/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: phone, key: key, source: campaign() })
    }).then(function (r) {
      setServerStatus('online');
      return r.json().then(function (d) { return { ok: r.ok, body: d }; });
    }).then(function (res) {
      if (!res.ok) {
        // socket not up yet: retry once quietly, then report
        if (res.body && /still starting/i.test(res.body.error || '') && !start.waited) {
          start.waited = true;
          start.busy = false;
          setTimeout(start, 4000);
          return;
        }
        start.busy = false;
        btn.disabled = false;
        setBtnLabel('Generate Pairing Code', false);
        say('msg-input', (res.body && res.body.error) || 'Something went wrong. Try again.', 'err');
        return;
      }
      start.waited = false;
      start.busy = false;
      token = res.body.token;
      try { sessionStorage.setItem(LINKED_KEY, token); } catch (e) { /* private mode */ }
      showView('view-progress');
      btn.classList.remove('loading');
      $('spin').style.display = 'block';
      $('prog-title').textContent = 'Talking to WhatsApp…';
      $('prog-sub').textContent = 'The code appears here in a few seconds.';
      say('msg-progress', '');
      $('btn-retry').classList.add('hidden');
      poll();
    }).catch(function () {
      start.busy = false;
      setServerStatus('offline');
      btn.disabled = false;
      setBtnLabel('Generate Pairing Code', false);
      say('msg-input', 'Network error. Check the connection and try again.', 'err');
    });
  }

  function apply(data) {
    var phase = data.phase;
    if (phase === 'code') {
      if (lastPhase !== 'code' || $('codebox').classList.contains('hidden')) {
        renderCode(data.code);
        if (data.rotated) {
          say('msg-progress', 'The connection restarted, so this is a fresh code. The earlier one no longer works.', 'ok');
        } else {
          say('msg-progress', '');
        }
      }
      lastPhase = 'code';
      $('spin').style.display = 'none';
      $('btn-retry').classList.add('hidden');
      startTimer(data.secondsLeft);
      return;
    }
    if (phase === 'linked') {
      clearPoll();
      lastPhase = 'linked';
      $('spin').style.display = 'none';
      showView('view-success');
      var name = (data.linked && data.linked.name) || phone;
      $('who').textContent = name;
      $('jid').textContent = (data.linked && data.linked.jid) || '';
      try { sessionStorage.removeItem(LINKED_KEY); } catch (e) { /* ignore */ }
      return;
    }
    if (phase === 'failed') {
      $('spin').style.display = 'none';
      $('codebox').classList.add('hidden');
      $('btn-copy').classList.add('hidden');
      $('howto').classList.add('hidden');
      $('timer').classList.add('hidden');
      $('btn-retry').classList.remove('hidden');
      try { sessionStorage.removeItem(LINKED_KEY); } catch (e) { /* ignore */ }
      $('prog-title').textContent = 'That code was not accepted';
      $('prog-sub').textContent = 'A fresh code is requested automatically — or press the button.';
      say('msg-progress', data.error || 'Pairing failed. Get a new code.', 'err');
      lastPhase = 'failed';
      return;
    }
    if (phase === 'expired' || phase === 'expired_code' || phase === 'busy') {
      clearPoll();
      $('spin').style.display = 'none';
      $('codebox').classList.add('hidden');
      $('btn-copy').classList.add('hidden');
      $('howto').classList.add('hidden');
      $('timer').classList.add('hidden');
      $('btn-retry').classList.remove('hidden');
      try { sessionStorage.removeItem(LINKED_KEY); } catch (e) { /* ignore */ }
      var messages = {
        expired: 'This session expired. Get a new code.',
        expired_code: 'The code timed out. Get a new one — the old code is dead.',
        failed: (data.error || 'Pairing failed.') + ' Get a new code.',
        busy: data.error || 'Another number is pairing right now. Try again shortly.'
      };
      $('prog-title').textContent = phase === 'busy' ? 'Another pairing is in progress' : 'That code is no longer valid';
      $('prog-sub').textContent = 'Press the button for a fresh code.';
      say('msg-progress', messages[phase] || '', phase === 'busy' ? '' : 'err');
      return;
    }
    // starting / pending
    if (lastPhase !== phase) {
      $('spin').style.display = 'block';
      $('prog-title').textContent = 'Talking to WhatsApp…';
      $('prog-sub').textContent = 'This usually takes 5–15 seconds.';
    }
    lastPhase = phase;
  }

  function startTimer(seconds) {
    if (tickTimer) clearInterval(tickTimer);
    var left = typeof seconds === 'number' ? seconds : null;
    var paint = function () {
      if (left == null) { $('timer').textContent = 'Enter the code on your phone now.'; return; }
      var m = Math.floor(left / 60), s = left % 60;
      $('timer').textContent = left > 0
        ? 'Code valid for ' + m + ':' + (s < 10 ? '0' + s : s) + ' — WhatsApp adds the dash itself, type digits only.'
        : 'Code timed out. Press "Get a new code".';
    };
    paint();
    if (left == null) return;
    tickTimer = setInterval(function () {
      left -= 1;
      paint();
      if (left <= 0) clearInterval(tickTimer);
    }, 1000);
  }

  function poll() {
    if (!token) return;
    fetch('/pair/api/status?token=' + encodeURIComponent(token))
      .then(function (r) { return r.json(); })
      .then(function (data) {
        setServerStatus('online');
        apply(data);
        if (data.phase !== 'linked' && data.phase !== 'expired' && data.phase !== 'expired_code' && data.phase !== 'busy') {
          pollTimer = setTimeout(poll, 2500);
        }
      })
      .catch(function () {
        setServerStatus('offline');
        pollTimer = setTimeout(poll, 4000);
      });
  }

  // resume an in-flight session after a refresh
  try {
    var saved = sessionStorage.getItem(LINKED_KEY);
    if (saved) {
      token = saved;
      showView('view-progress');
      poll();
    }
  } catch (e) { /* ignore */ }

  window.addEventListener('beforeunload', clearPoll);
})();
</script>
</body>
</html>`;
}

module.exports = {
  configure,
  isEnabled,
  start,
  stop,
  setCodeRequester,
  setSessionInfo,
  setRestartRequester,
  resetRotations,
  setSnapshot,
  onSocketReady,
  markLinked,
  markDisconnected,
  getState,
  publicUrl,
  isListening,
  get config() {
    return { ...cfg };
  }
};
