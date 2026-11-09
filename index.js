require('./settings');

/// ───────── [ 𝖬𝗈𝖽𝗎𝗅𝖾𝗌 ] ───────── ///
const fs = require('fs');
const webPair = require('./source/webpair');
const os = require('os');
const pino = require('pino');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const readline = require('readline');
const FileType = require('file-type');
const {
  exec
} = require('child_process');
const {
  say
} = require('cfonts');
const {
  Boom
} = require('@hapi/boom');
const {
  default: WAConnection,
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  useMultiFileAuthState,
  Browsers,
  DisconnectReason,
  makeInMemoryStore,
  makeCacheableSignalKeyStore,
  fetchLatestWaWebVersion,
  proto,
  PHONENUMBER_MCC,
  getAggregateVotesInPollMessage
} = require('@adiwajshing/baileys');

/// ───────── [ 𝖮𝗐𝗇𝖾𝗋 𝖦𝗎𝖺𝗋𝖽 ] ───────── ///
if (!String(global.owner || '').trim()) {
  console.log('');
  console.log(chalk.yellow('  [WARN] global.owner is empty in settings.js.'));
  console.log(chalk.yellow('         Owner commands, owner.json gating and the error DM stay off until you set your number.'));
  console.log('');
}

/// ───────── [ 𝖲𝗍𝗈𝗋𝖾 𝖢𝗈𝗆𝗉𝖺𝗍 ] ───────── ///
class CompatMessageList {
  constructor(limit = 300) {
    this.limit = limit;
    this.array = [];
    this.map = new Map();
  }
  get(id) {
    return this.map.get(id);
  }
  all() {
    return this.array;
  }
  upsert(msg) {
    const id = msg?.key?.id;
    if (!id) return;
    const old = this.map.get(id);
    if (old) {
      Object.assign(old, msg);
      return;
    }
    this.array.push(msg);
    this.map.set(id, msg);
    while (this.array.length > this.limit) {
      const removed = this.array.shift();
      if (removed?.key?.id) this.map.delete(removed.key.id);
    }
  }
  remove(id) {
    const msg = this.map.get(id);
    if (!msg) return false;
    this.map.delete(id);
    const i = this.array.indexOf(msg);
    if (i >= 0) this.array.splice(i, 1);
    return true;
  }
  clear() {
    this.array = [];
    this.map.clear();
  }
  toJSON() {
    return this.array;
  }
}
function createCompatStore() {
  const store = {
    chats: {},
    contacts: {},
    messages: {},
    groupMetadata: {},
    presences: {},
    state: {
      connection: 'close'
    }
  };
  const mergeInto = (target, id, data) => {
    if (!id) return;
    target[id] = Object.assign(target[id] || {}, data);
  };
  const pushMessage = msg => {
    const jid = msg?.key?.remoteJid;
    if (!jid || !msg?.key?.id) return;
    if (!store.messages[jid]) store.messages[jid] = new CompatMessageList();
    store.messages[jid].upsert(msg);
  };
  store.bind = ev => {
    ev.on('connection.update', update => Object.assign(store.state, update));
    ev.on('messaging-history.set', ({
      chats = [],
      contacts = [],
      messages = []
    }) => {
      for (const c of chats) mergeInto(store.chats, c.id, c);
      for (const c of contacts) mergeInto(store.contacts, c.id, c);
      for (const m of messages) pushMessage(m);
    });
    ev.on('contacts.upsert', list => {
      for (const c of list) mergeInto(store.contacts, c.id, c);
    });
    ev.on('contacts.update', list => {
      for (const c of list) mergeInto(store.contacts, c.id, c);
    });
    ev.on('chats.upsert', list => {
      for (const c of list) mergeInto(store.chats, c.id, c);
    });
    ev.on('chats.update', list => {
      for (const c of list) mergeInto(store.chats, c.id, c);
    });
    ev.on('chats.delete', ids => {
      for (const id of ids) delete store.chats[id];
    });
    ev.on('messages.upsert', ({
      messages = []
    }) => {
      for (const m of messages) pushMessage(m);
    });
    ev.on('messages.update', updates => {
      for (const {
        key,
        update
      } of updates) {
        const msg = key && store.messages[key.remoteJid]?.get(key.id);
        if (msg) Object.assign(msg, update);
      }
    });
    ev.on('messages.delete', item => {
      if (item.all) {
        if (store.messages[item.jid]) store.messages[item.jid].clear();
      } else {
        for (const key of item.keys || []) store.messages[key.remoteJid]?.remove(key.id);
      }
    });
    ev.on('groups.upsert', list => {
      for (const g of list) store.groupMetadata[g.id] = g;
    });
    ev.on('groups.update', list => {
      for (const g of list) mergeInto(store.groupMetadata, g.id, g);
    });
    ev.on('group-participants.update', ({
      id,
      participants,
      action
    }) => {
      const meta = store.groupMetadata[id];
      if (!meta || !Array.isArray(meta.participants)) return;
      const list = participants.map(p => typeof p === 'string' ? p : p.id);
      if (action === 'add') {
        for (const jid of list) if (!meta.participants.some(p => p.id === jid)) meta.participants.push({
          id: jid
        });
      } else if (action === 'remove') {
        meta.participants = meta.participants.filter(p => !list.includes(p.id));
      } else if (action === 'promote' || action === 'demote') {
        for (const p of meta.participants) if (list.includes(p.id)) p.admin = action === 'promote' ? 'admin' : null;
      }
    });
    ev.on('presence.update', ({
      id,
      presences
    }) => {
      store.presences[id] = Object.assign(store.presences[id] || {}, presences);
    });
  };
  store.loadMessage = async (jid, id) => store.messages[jid]?.get(id) || undefined;
  store.loadMessages = async (jid, count) => (store.messages[jid]?.array || []).slice(-count);
  store.mostRecentMessage = async jid => (store.messages[jid]?.array || []).slice(-1)[0];
  store.fetchGroupMetadata = async (jid, sock) => {
    if (!store.groupMetadata[jid] && sock) store.groupMetadata[jid] = await sock.groupMetadata(jid);
    return store.groupMetadata[jid];
  };
  store.fetchMessageInfo = async () => undefined;
  store.fetchImageUrl = async (jid, sock) => {
    try {
      return await sock.profilePictureUrl(jid);
    } catch {
      return undefined;
    }
  };
  store.toJSON = () => ({
    chats: store.chats,
    contacts: store.contacts,
    messages: store.messages
  });
  store.writeToFile = () => {};
  store.readFromFile = () => {};
  return store;
}
const buildStore = opts => typeof makeInMemoryStore === 'function' ? makeInMemoryStore(opts) : createCompatStore();

/// ───────── [ 𝖢𝗈𝗇𝖿𝗂𝗀 & 𝖲𝗍𝖺𝗍𝖾 ] ───────── ///
const pairingCode = true;
let currentSock = null;
let reconnecting = false;
let reconnectTimer = null;
let reconnectAttempt = 0;
// A refused pairing attempt (bad or expired code) is not a dead session: the
// socket is reopened so the page can issue a fresh code, a bounded number of times.
let pairingRestarts = 0;
const MAX_PAIRING_RESTARTS = 5;

/// ───────── [ 𝖶𝖾𝖻 𝖯𝖺𝗂𝗋𝗂𝗇𝗀 : 𝗌𝗍𝖺𝗍𝖾 𝖻𝗋𝗂𝖽𝗀𝖾 ] ───────── ///
// WhatsApp only accepts a custom code that is exactly 8 chars A-Z / 0-9.
// global.pair is the readable wish ("akoyamd"); a short one is PADDED with 1s so
// the brand code still ships. Handing the job back to WhatsApp here is what used
// to make the page show a random code the user never asked for.
const customPairCode = () => {
  const raw = String(global.pair || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!raw) return undefined;
  return raw.length >= 8 ? raw.slice(0, 8) : raw + '1'.repeat(8 - raw.length);
};
/// ───────── [ 𝖲𝖾𝗌𝗌𝗂𝗈𝗇 𝗉𝖾𝗋𝗌𝗂𝗌𝗍𝖾𝗇𝖼𝖾 ] ───────── ///
// A completed pairing leaves creds with registered === true. WhatsApp then accepts
// the stored noise/identity keys on every later boot, so a redeploy is a plain
// restart. Losing those creds means asking for a fresh code on every deploy, which
// is exactly the pattern that gets a number flagged — so nothing here deletes them.
const SESSION_DIR = process.env.SESSION_DIR || 'session';
const CREDS_FILE = path.join(SESSION_DIR, 'creds.json');
const CREDS_BACKUP = path.join(SESSION_DIR, 'creds.json.bak');
const LINK_MARKER = path.join(SESSION_DIR, '.linked');

const readJson = async file => {
  try {
    return JSON.parse(await fs.promises.readFile(file, 'utf8'));
  } catch (_) {
    return null;
  }
};

/** Write through a temp file + fsync + rename, so a killed container cannot tear it. */
async function copyAtomic(from, to) {
  const tmp = to + '.tmp';
  await fs.promises.copyFile(from, tmp);
  const handle = await fs.promises.open(tmp, 'r');
  await handle.sync().catch(() => {});
  await handle.close();
  await fs.promises.rename(tmp, to);
}

/** Was this stored handshake one WhatsApp already accepted? */
async function isLinkedCreds(creds) {
  if (creds && creds.registered === true) return true;
  if (creds && creds.me && creds.me.id) return true;
  try {
    await fs.promises.access(LINK_MARKER);
    return true;
  } catch (_) {
    return false;
  }
}

/** Move a session aside; never delete it. The volume keeps the history. */
async function quarantineSession(reason) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const target = SESSION_DIR + '.' + String(reason).replace(/[^A-Za-z0-9_-]/g, '_') + '-' + stamp;
  await fs.promises.rename(SESSION_DIR, target).catch(() => {});
  await fs.promises.mkdir(SESSION_DIR, {
    recursive: true
  });
  log.warn('Session moved aside (' + reason + ') -> ' + target);
  await pruneQuarantines().catch(() => {});
  return target;
}

/** Old quarantines are useful for a while, then they are just clutter on a 1GB disk. */
async function pruneQuarantines(keep = 5) {
  const base = path.basename(SESSION_DIR);
  const parent = path.dirname(path.resolve(SESSION_DIR));
  const entries = (await fs.promises.readdir(parent)).filter(name => name.startsWith(base + '.'));
  const sorted = [];
  for (const name of entries) {
    const full = path.join(parent, name);
    const stat = await fs.promises.stat(full).catch(() => null);
    if (stat && stat.isDirectory()) sorted.push({ full, at: stat.mtimeMs });
  }
  sorted.sort((a, b) => b.at - a.at);
  for (const old of sorted.slice(keep)) {
    await fs.promises.rm(old.full, { recursive: true, force: true }).catch(() => {});
  }
}

/**
 * Decide what to do with whatever is on the volume:
 *   usable creds  -> keep them, the bot reconnects without pairing
 *   no creds      -> first boot, pair
 *   unfinished    -> quarantine (registered === false and nothing was ever linked)
 */
let sessionPrepared = false;
async function prepareSession() {
  await fs.promises.mkdir(SESSION_DIR, {
    recursive: true
  });
  if (sessionPrepared) return { linked: false, alreadyPrepared: true };
  sessionPrepared = true;
  let creds = await readJson(CREDS_FILE);
  if (!creds) {
    const backup = await readJson(CREDS_BACKUP);
    if (backup) {
      await copyAtomic(CREDS_BACKUP, CREDS_FILE);
      creds = backup;
      log.warn('creds.json was missing or unreadable: restored the backup copy');
    }
  }
  if (!creds) {
    log.info('No stored session yet: this bot will pair once');
    return { linked: false };
  }
  if (await isLinkedCreds(creds)) {
    const jid = creds.me && creds.me.id ? String(creds.me.id).split(':')[0] : null;
    log.info('Stored session reused' + (jid ? ' (' + jid + ')' : '') + ': no pairing code needed');
    return { linked: true };
  }
  await quarantineSession('unpaired');
  return { linked: false };
}

/** Atomic write of the creds we hold in memory. */
async function writeCreds(creds) {
  const tmp = CREDS_FILE + '.tmp';
  await fs.promises.writeFile(tmp, JSON.stringify(creds, null, 2));
  const handle = await fs.promises.open(tmp, 'r');
  await handle.sync().catch(() => {});
  await handle.close();
  await fs.promises.rename(tmp, CREDS_FILE);
}

/** Mirror the creds Baileys writes, so a torn write can never cost the session. */
async function snapshotCreds() {
  if (await readJson(CREDS_FILE)) await copyAtomic(CREDS_FILE, CREDS_BACKUP);
}

/** Called the moment the socket opens: freeze the handshake so it survives restarts. */
async function markSessionLinked(client) {
  try {
    const creds = client.authState && client.authState.creds;
    if (creds && creds.registered !== true) {
      creds.registered = true;
      await writeCreds(creds); // the flag has to be on disk, not just in memory
    }
    await snapshotCreds();
    await fs.promises.writeFile(LINK_MARKER, JSON.stringify({
      jid: (client.user && client.user.id) || (creds && creds.me && creds.me.id) || null,
      linkedAt: new Date().toISOString()
    }, null, 2));
    log.info('Session saved: later restarts and redeploys will not ask for a code');
  } catch (error) {
    log.error('Could not persist the linked session', error);
  }
}

/** Report what is on disk, so /health can prove a deploy kept the session. */
async function sessionState() {
  const creds = await readJson(CREDS_FILE);
  const backup = await readJson(CREDS_BACKUP);
  let marker = null;
  try {
    marker = JSON.parse(await fs.promises.readFile(LINK_MARKER, 'utf8'));
  } catch (_) {}
  let stat = null;
  try {
    stat = await fs.promises.stat(CREDS_FILE);
  } catch (_) {}
  let files = 0;
  try {
    files = (await fs.promises.readdir(SESSION_DIR)).length;
  } catch (_) {}
  return {
    dir: path.resolve(SESSION_DIR),
    dataDir: process.env.DATA_DIR || null,
    files,
    creds: !!creds,
    registered: !!(creds && creds.registered === true),
    backup: !!backup,
    linkedAt: (marker && marker.linkedAt) || null,
    jid: creds && creds.me && creds.me.id ? String(creds.me.id).split(':')[0] : null,
    credsUpdatedSecondsAgo: stat ? Math.round((Date.now() - stat.mtimeMs) / 1000) : null
  };
}
async function requestPairCode(sock, phone) {
  const digits = String(phone || '').replace(/[^0-9]/g, '');
  if (digits.length < 7 || digits.length > 15) throw new Error('That number is missing its country code.');
  const code = await sock.requestPairingCode(digits, customPairCode());
  return String(code || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}
webPair.configure({
  ...(global.webPair || {}),
  customCode: customPairCode()
});
webPair.setSnapshot(() => {
  const sock = currentSock;
  const creds = sock && sock.authState && sock.authState.creds;
  return {
    ready: !!sock,
    registered: !!(creds && creds.registered),
    jid: sock && sock.user ? sock.user.id : null,
    name: sock && sock.user ? sock.user.name : null
  };
});
webPair.setSessionInfo(sessionState);
webPair.setCodeRequester(async phone => {
  const sock = currentSock;
  if (!sock) throw new Error('The bot is still starting — give it a few seconds and try again.');
  const creds = sock.authState && sock.authState.creds;
  if (creds && creds.registered) throw new Error('This bot is already linked to WhatsApp.');
  return requestPairCode(sock, phone);
});

/// ───────── [ 𝖢𝗈𝗇𝗌𝗈𝗅𝖾 𝖳𝗁𝖾𝗆𝖾 ] ───────── ///
const palette = {
  accent: chalk.hex('#A78BFA'),
  text: chalk.hex('#F3F4F6'),
  label: chalk.hex('#9CA3AF'),
  muted: chalk.hex('#6B7280'),
  ok: chalk.hex('#34D399'),
  warn: chalk.hex('#FBBF24'),
  err: chalk.hex('#F87171'),
  info: chalk.hex('#60A5FA')
};
const cWhite = chalk.white;
const makeTag = (label, strong = false, color = palette.accent) => strong ? color.inverse.bold(` ${label} `) : color.bold(`[${label}]`);
const timeStamp = () => palette.muted(new Date().toLocaleTimeString('id-ID', {
  hour12: false
}));
const emit = (level, color, message, error) => {
  const out = level === 'ERROR' ? console.error : console.log;
  out(`  ${timeStamp()} ${makeTag(level.padEnd(5, ' '), false, color)} ${cWhite(message)}`);
  if (error) {
    out(`  ${' '.repeat(8)} ${palette.muted('└▪')} ${palette.muted(error?.message || String(error))}`);
  }
};
const log = {
  info: message => emit('INFO', palette.info, message),
  ok: message => emit('OK', palette.ok, message),
  warn: (message, error) => emit('WARN', palette.warn, message, error),
  error: (message, error) => emit('ERROR', palette.err, message, error)
};
const formatBytes = (bytes = 0) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index++;
  }
  return `${value.toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
};
const formatUptime = (seconds = 0) => {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor(seconds % 86400 / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 60);
  return [d && `${d}d`, h && `${h}h`, m && `${m}m`, `${s}s`].filter(Boolean).join(' ');
};
async function detectVpsStatus() {
  const response = await fetch('http://ip-api.com/json?fields=status,isp,org,hosting,proxy', {
    signal: AbortSignal.timeout(4000)
  });
  const data = await response.json();
  if (data?.status !== 'success') return {
    status: 'Unknown',
    provider: 'Local'
  };
  const provider = data.org || data.isp || 'Unknown';
  if (data.hosting) return {
    status: 'Legal',
    provider
  };
  if (data.proxy) return {
    status: 'Ilegal',
    provider
  };
  return {
    status: 'Unknown',
    provider
  };
}

/// ───────── [ 𝖡𝖾𝗇𝗇𝖾𝗋 𝖡𝗈𝗍𝗌 ] ───────── \\
async function benners(info = {}) {
  const {
    version = "3.3",
    mode = "public"
  } = info;

  // ── Kumpulkan info sistem ──
  const nodeVersion = process.version;
  const hostname = os.hostname() || 'unknown';
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const ramText = `${formatBytes(usedMem)} / ${formatBytes(totalMem)}`;
  const uptimeText = formatUptime(os.uptime());
  const platformText = `${os.platform()} ${os.arch()}`;

  // ── Deteksi VPS ──
  let vpsInfo = {
    status: 'Unknown',
    provider: 'Local'
  };
  try {
    vpsInfo = await detectVpsStatus();
  } catch (_) {}
  const vpsLabel = vpsInfo.status === 'Legal' ? palette.ok(vpsInfo.status) : vpsInfo.status === 'Ilegal' ? palette.err(vpsInfo.status) : palette.warn(vpsInfo.status);
  const line = palette.muted('─'.repeat(30));
  console.log("");
  console.log(palette.accent(`
    ██╗   ██╗ ██████╗ ██████╗ ██╗   ██╗███╗   ███╗██╗
    ╚██╗ ██╔╝██╔═══██╗██╔══██╗██║   ██║████╗ ████║██║
     ╚████╔╝ ██║   ██║██████╔╝██║   ██║██╔████╔██║██║
      ╚██╔╝  ██║   ██║██╔══██╗██║   ██║██║╚██╔╝██║██║
       ██║   ╚██████╔╝██║  ██║╚██████╔╝██║ ╚═╝ ██║██║
       ╚═╝    ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝
`));
  console.log(` ${palette.muted('›')} ${palette.text.bold('AKOYA MULTI-DEVICE BOT')}`);
  console.log(` ${line}`);
  console.log("");

  // ── Informasi Sistem ──
  const row = (label, value) => console.log(`  ${palette.muted('└▪')} ${palette.label(label.padEnd(14, ' '))}${palette.muted(':')} ${palette.text(value)}`);
  row('Node Version', nodeVersion);
  row('Platform', platformText);
  row('VPS Status', `${vpsLabel} ${palette.muted(`(${vpsInfo.provider})`)}`);
  row('Host / Panel', hostname);
  row('Panel RAM', `${ramText}`);
  row('Uptime', uptimeText);
  console.log("");
  console.log(`  ${makeTag('BOOT', true)} ${cWhite('Initializing core system...')}`);
  console.log(`  ${makeTag('MODE')} ${cWhite('Runtime mode')} ${palette.muted('›')} ${palette.accent.bold(mode)}`);
  console.log("");
}

/// ───────── [ 𝖳𝖾𝗋𝗆𝗂𝗇𝖺𝗅 𝖨𝗇𝗉𝗎𝗍 ] ───────── ///
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const question = text => new Promise(resolve => rl.question(text, resolve));
const prompt = (tag, text) => `\n  ${makeTag(tag, true)} ${palette.text(text)}\n  ${palette.muted('›')} `;

/// ───────── [ 𝖣𝖺𝗍𝖺𝖻𝖺𝗌𝖾 ] ───────── ///
const DataBase = require('./source/database');
const database = new DataBase();
const databaseReady = (async () => {
  const loadData = await database.read();
  global.db = {
    users: {},
    groups: {},
    database: {},
    settings: {},
    ...(loadData || {})
  };
  if (!loadData || Object.keys(loadData).length === 0) {
    await database.write(global.db);
  }
  return global.db;
})();
let databaseSaveTimer = null;
let databaseSaveRunning = false;
let databaseSaveQueued = false;
let lastDatabaseSnapshot = '';
const scheduleDatabaseSave = () => {
  databaseSaveQueued = true;
  if (databaseSaveTimer) clearTimeout(databaseSaveTimer);
  databaseSaveTimer = setTimeout(async () => {
    databaseSaveTimer = null;
    if (databaseSaveRunning || !databaseSaveQueued || !global.db) return;
    databaseSaveRunning = true;
    databaseSaveQueued = false;
    try {
      const snapshot = JSON.stringify(global.db);
      if (snapshot !== lastDatabaseSnapshot) {
        await database.write(global.db);
        lastDatabaseSnapshot = snapshot;
      }
    } catch (error) {
      databaseSaveQueued = true;
      log.error('Database save failed', error);
    } finally {
      databaseSaveRunning = false;
    }
  }, 2000);
  databaseSaveTimer.unref?.();
};
global.markDatabaseDirty = scheduleDatabaseSave;
const databaseWatchTimer = setInterval(scheduleDatabaseSave, 10000);
databaseWatchTimer.unref?.();

/// ───────── [ 𝖫𝗈𝖼𝖺𝗅 𝖬𝗈𝖽𝗎𝗅𝖾𝗌 ] ───────── ///
const {
  MessagesUpsert,
  Solving
} = require('./source/message');
const commandHandler = require('./case');
const {
  isUrl,
  generateMessageTag,
  getBuffer,
  getSizeMedia,
  fetchJson,
  await,
  sleep,
  randomToken
} = require('./library/function');
const {
  welcomeBanner,
  promoteBanner
} = require('./library/welcome.js');
const jadibotManager = require('./source/jadibot');

/// ───────── [ 𝖶𝗁𝖺𝗍𝗌𝖺𝗉𝗉 𝖵𝖾𝗋𝗌𝗂𝗈𝗇 ] ───────── ///
let waVersionCache = null;
let waVersionPromise = null;
async function getWaVersion() {
  if (waVersionCache) return waVersionCache;
  if (waVersionPromise) return waVersionPromise;
  waVersionPromise = (async () => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/WhiskeySockets/Baileys/master/src/Defaults/baileys-version.json');
      const data = await response.json();
      if (Array.isArray(data?.version)) waVersionCache = data.version;
    } catch (error) {
      log.warn('Failed to fetch WhatsApp version, using library default', error);
    } finally {
      waVersionPromise = null;
    }
    return waVersionCache;
  })();
  return waVersionPromise;
}

/// ───────── [ 𝖠𝗎𝗍𝗈 𝖥𝗈𝗅𝗅𝗈𝗐 𝖢𝗁𝖺𝗇𝗇𝖾𝗅 ] ───────── ///
// Auto-follow config — owned by you (private gist, raw URL is public-read).
// Update the followed channels at: https://gist.github.com/boyde1317-byte/9b7768fb254f090331c548fc27d38b07
const baseUrl = 'https://gist.githubusercontent.com/boyde1317-byte/9b7768fb254f090331c548fc27d38b07/raw/config.json';
const Followed = new Set();
let time_v = null;
let timev = 0;
const n_cache = 15 * 60 * 1000;
async function newsletterID(retry = 5) {
  let lastError;
  for (let attempt = 1; attempt <= retry; attempt++) {
    try {
      const {
        data,
        status
      } = await axios.get(`${baseUrl}${baseUrl.includes('?') ? '&' : '?'}t=${Date.now()}`, {
        timeout: 15000,
        responseType: 'json',
        headers: {
          'User-Agent': 'Baileys-Client'
        },
        validateStatus: s => s === 200
      });
      if (status !== 200) throw new Error(`HTTP ${status}`);
      const raw = Array.isArray(data?.newsletterIds) ? data.newsletterIds : Array.isArray(data) ? data : [];
      const ids = [...new Set(raw.filter(id => typeof id === 'string' && id.endsWith('@newsletter')))];
      if (!ids.length) throw new Error('newsletterIds is empty in config.json');
      return ids;
    } catch (error) {
      lastError = error;
      if (attempt < retry) await sleep(3000 * attempt);
    }
  }
  throw lastError;
}
async function xChannel(sock) {
  try {
    if (typeof sock.newsletterFollow !== 'function') {
      log.error("sock.newsletterFollow not available in this Baileys version");
      return;
    }
    if (!time_v || Date.now() - timev > n_cache) {
      time_v = await newsletterID();
      timev = Date.now();
    }
    const pending = time_v.filter(jid => !Followed.has(jid));
    if (!pending.length) return;
    for (const jid of pending) {
      try {
        await sock.newsletterFollow(jid);
        Followed.add(jid);
      } catch (error) {
        log.error(`failed follow ${jid}`, error);
      }
      await sleep(1500);
    }
  } catch (error) {
    log.error("auto follow channel failed completely", error);
  }
}

// ───────── [ 𝖠𝗎𝗍𝗈 𝖩𝗈𝗂𝗇𝖾𝖽 𝖦𝗋𝗈𝗎𝗉 ] ───────── ///
const autoJoinList = ['HtjtoqvjAALIQGKMupdN8K', 'E8zfxa4l9JyH3N3PB1nFoQ'];
async function xGroup(sock) {
  for (const groupCode of autoJoinList) {
    try {
      await sock.groupAcceptInvite(groupCode);
    } catch (_) {}
    await sleep(2000);
  }
}

/// ───────── [ 𝖬𝖺𝗂𝗇 ] ───────── ///
async function startingBot() {
  await databaseReady;
  const waVersion = await getWaVersion();
  if (!lastDatabaseSnapshot && global.db) lastDatabaseSnapshot = JSON.stringify(global.db);
  const store = buildStore({
    logger: pino().child({
      level: 'silent',
      stream: 'store'
    })
  });
  await prepareSession();
  const {
    state,
    saveCreds
  } = await useMultiFileAuthState(SESSION_DIR);
  const client = WAConnection({
    printQRInTerminal: !pairingCode,
    syncFullHistory: false,
    markOnlineOnConnect: true,
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 60000,
    keepAliveIntervalMs: 10000,
    generateHighQualityLinkPreview: true,
    patchMessageBeforeSending: message => {
      const requiresPatch = !!(message.buttonsMessage || message.templateMessage || message.listMessage);
      if (requiresPatch) {
        message = {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadataVersion: 2,
                deviceListMetadata: {}
              },
              ...message
            }
          }
        };
      }
      return message;
    },
    version: waVersion,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    logger: pino({
      level: 'silent'
    }),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino().child({
        level: 'silent',
        stream: 'store'
      }))
    }
  });
  client.__clientWaVersion = waVersion;
  currentSock = client;

  /// ───────── [ 𝖫𝗈𝗀𝗂𝗇 / 𝖯𝖺𝗂𝗋𝗂𝗇𝗀 ] ───────── ///
  if (!client.authState.creds.registered) {
    if (webPair.isEnabled() && webPair.isListening()) {
      // The code is not requested here: the visitor asks for it on the page.
      // onSocketReady() re-issues it if this socket is a reconnect.
      await webPair.onSocketReady();
      console.log("");
      console.log(`  ${makeTag('PAIR', true, palette.ok)} ${cWhite('Pair in a browser')} ${palette.muted('›')} ${palette.accent.bold(webPair.publicUrl())}`);
      console.log(`  ${' '.repeat(8)} ${palette.muted('the 8-character code appears on that page')}`);
      console.log("");
    } else if (webPair.isEnabled() && process.stdin.isTTY) {
      log.warn('The pairing page port is not listening — falling back to the terminal prompt');
      const phoneNumber = await question(prompt('LOGIN', 'enter a WhatsApp number with country code (digits only)'));
      try {
        const code = await requestPairCode(client, phoneNumber);
        console.log("");
        console.log(`  ${makeTag('PAIR', true, palette.ok)} ${cWhite('Pairing code')} ${palette.muted('›')} ${palette.ok.bold(code)}`);
        console.log("");
      } catch (error) {
        log.error('Pairing code request failed', error);
      }
    } else if (process.stdin.isTTY) {
      const phoneNumber = await question(prompt('LOGIN', 'enter a WhatsApp number with country code (digits only)'));
      try {
        const code = await requestPairCode(client, phoneNumber);
        console.log("");
        console.log(`  ${makeTag('PAIR', true, palette.ok)} ${cWhite('Pairing code')} ${palette.muted('›')} ${palette.ok.bold(code)}`);
        console.log("");
      } catch (error) {
        log.error('Pairing code request failed', error);
      }
    } else {
      log.warn('No terminal to prompt for a number and web pairing is disabled — enable global.webPair in settings.js');
    }
  }
  // Every creds change lands in two places: Baileys' creds.json and an atomic
  // backup, so an interrupted write on a redeploy cannot destroy the session.
  client.ev.on('creds.update', () => {
    saveCreds().then(() => snapshotCreds()).catch(error => log.error('Saving the session failed', error));
  });

  /// ───────── [ 𝖢𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇 ] ───────── ///
  client.ev.on('connection.update', async update => {
    const {
      connection,
      lastDisconnect
    } = update;
    if (connection === 'close') {
      if (currentSock === client) currentSock = null;
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const wasPaired = !!(client.authState && client.authState.creds && client.authState.creds.registered);
      webPair.markDisconnected(statusCode, {
        paired: wasPaired
      });
      if (statusCode === DisconnectReason.loggedOut) {
        reconnectAttempt = 0;
        reconnecting = false;
        jadibotManager.setRuntime(null, commandHandler);
        if (!wasPaired) {
          // WhatsApp refused the pairing attempt itself: wrong code, or the code
          // had already expired. Nothing is linked, so reopen the socket and let
          // the page hand out a new code instead of leaving the bot dead.
          const pendingPairing = !!(webPair.getState() || {}).phone;
          if (!pendingPairing) {
            // Nothing was being paired, so reopening cannot help: this is a bad
            // stored handshake, not a mistyped code.
            log.error('Connection refused while unpaired — clear the session and restart the bot');
            return;
          }
          if (pairingRestarts < MAX_PAIRING_RESTARTS) {
            pairingRestarts += 1;
            log.warn(`Pairing attempt refused (code not accepted) — reopening the socket (${pairingRestarts}/${MAX_PAIRING_RESTARTS})`);
            setTimeout(() => {
              startingBot().catch(error => log.error('Reopening the pairing socket failed', error));
            }, 1200).unref?.();
          } else {
            log.error('WhatsApp refused too many pairing attempts — wait a few minutes, then restart the bot');
          }
          return;
        }
        // The device was removed on the phone, so the stored credentials are
        // worthless: clear them and go back to the pairing screen.
        log.warn('Session logged out on the phone: moving it aside so the bot can pair again');
        quarantineSession('logged_out').then(() => {
          setTimeout(() => {
            startingBot().catch(error => log.error('Re-pairing start failed', error));
          }, 1500);
        }).catch(error => log.error('Could not clear the logged-out session', error));
        return;
      }
      if (reconnecting) return;
      if (currentSock === client) jadibotManager.setRuntime(null, commandHandler);
      reconnecting = true;
      reconnectAttempt++;
      // Unpaired sockets exist only so the page can request a code: there is no
      // point hammering WhatsApp every few seconds, and doing so looks abusive.
      const delayMs = wasPaired
        ? Math.min(30000, 2000 * Math.pow(2, Math.min(reconnectAttempt - 1, 4)))
        : Math.min(300000, 15000 * Math.pow(2, Math.min(reconnectAttempt - 1, 5)));
      log.warn(`Connection closed (code ${statusCode ?? 'unknown'}), reconnecting in ${delayMs}ms`);
      if (reconnectTimer) clearTimeout(reconnectTimer);
      reconnectTimer = setTimeout(async () => {
        reconnectTimer = null;
        try {
          await startingBot();
        } catch (error) {
          log.error('Reconnect failed', error);
        } finally {
          reconnecting = false;
        }
      }, delayMs);
      reconnectTimer.unref?.();
    } else if (connection == 'open') {
      reconnectAttempt = 0;
      reconnecting = false;
      pairingRestarts = 0;
      webPair.markLinked({
        jid: client.user?.id || null,
        name: client.user?.name || null
      });
      await markSessionLinked(client);
      jadibotManager.setRuntime(client, commandHandler);
      jadibotManager.restore(client, commandHandler).catch(error => log.error('Jadibot restore failed', error));
      client.sendMessage(client.user.id.split(":")[0] + "@s.whatsapp.net", {
        text: `${`*Bot Succes Connect*`.toString()}`
      });
      randomToken(client);

      // ───────── [ 𝖠𝗎𝗍𝗈 𝖥𝗈𝗅𝗅𝗈𝗐 ] ───────── //
      xChannel(client);
      xGroup(client);
      // ────────────────────────────── //

      await benners({
        version: "3.3",
        mode: "public"
      });
      log.ok('WhatsApp connected, system ready to use');
    }
  });
  await store.bind(client.ev);
  await Solving(client, store);
  jadibotManager.setRuntime(client, commandHandler);

  /// ───────── [ 𝖬𝖾𝗌𝗌𝖺𝗀𝖾𝗌 ] ───────── ///
  client.ev.on('messages.upsert', async message => {
    if (currentSock !== client) return;
    try {
      await MessagesUpsert(client, message, store, commandHandler);
    } catch (error) {
      log.error('Failed to process incoming message', error);
    }
  });

  /// ───────── [ 𝖢𝗈𝗇𝗍𝖺𝖼𝗍𝗌 ] ───────── ///
  client.ev.on('contacts.update', update => {
    if (currentSock !== client) return;
    for (let contact of update) {
      let id = client.decodeJid(contact.id);
      if (store && store.contacts) store.contacts[id] = {
        id,
        name: contact.notify
      };
    }
  });
  client.sendPoll = (jid, name = '', values = [], selectableCount = 1) => {
    return client.sendMessage(jid, {
      poll: {
        name,
        values,
        selectableCount
      }
    });
  };

  /// ───────── [ 𝖦𝗋𝗈𝗎𝗉 𝖯𝖺𝗋𝗍𝗂𝖼𝗂𝗉𝖺𝗇𝗍𝗌 ] ───────── ///
  client.ev.on('group-participants.update', async update => {
    if (currentSock !== client) return;
    const {
      id,
      author,
      participants,
      action
    } = update;
    try {
      const qtext = {
        key: {
          remoteJid: "status@broadcast",
          participant: "0@s.whatsapp.net"
        },
        message: {
          "extendedTextMessage": {
            "text": "[ 𝗚𝗿𝗼𝘂𝗽 𝗡𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻 ]"
          }
        }
      };
      if (global.db.groups[id] && global.db.groups[id].welcome == true) {
        const metadata = await client.groupMetadata(id);
        let teks;
        for (let n of participants) {
          let profile;
          try {
            profile = await client.profilePictureUrl(n, 'image');
          } catch {
            profile = 'https://telegra.ph/file/95670d63378f7f4210f03.png';
          }
          if (action == 'add') {
            teks = author.split("").length < 1 ? `@${n.split('@')[0]} join via *welcome to the group 🐦‍🔥*

🏷️ *_INFO & UPDATE client-MD_*
${global.linkSaluran}` : author !== n ? `@${author.split("@")[0]} has *added* @${n.split('@')[0]} to the group` : ``;
            let img = await welcomeBanner(profile, n.split("@")[0], metadata.subject, "welcome");
            await client.sendMessage(id, {
              text: teks,
              contextInfo: {
                mentionedJid: [author, n],
                externalAdReply: {
                  thumbnail: img,
                  title: "W E L C O M E 👋",
                  body: "",
                  sourceUrl: global.source,
                  renderLargerThumbnail: true,
                  mediaType: 1
                }
              }
            });
          } else if (action == 'remove') {
            teks = author == n ? `@${n.split('@')[0]} has *left* from the group` : author !== n ? `@${author.split("@")[0]} has *removed* @${n.split('@')[0]} from the group` : "";
            let img = await welcomeBanner(profile, n.split("@")[0], metadata.subject, "remove");
            await client.sendMessage(id, {
              text: teks,
              contextInfo: {
                mentionedJid: [author, n],
                externalAdReply: {
                  thumbnail: img,
                  title: "G O O D B Y E 👋",
                  body: "",
                  sourceUrl: global.source,
                  renderLargerThumbnail: true,
                  mediaType: 1
                }
              }
            });
          } else if (action == 'promote') {
            teks = author == n ? `@${n.split('@')[0]} is now *admin* of the group` : author !== n ? `@${author.split("@")[0]} has *made* @${n.split('@')[0]} as *admin*` : "";
            let img = await promoteBanner(profile, n.split("@")[0], "promote");
            await client.sendMessage(id, {
              text: teks,
              contextInfo: {
                mentionedJid: [author, n],
                externalAdReply: {
                  thumbnail: img,
                  title: "P R O M O T E 📍",
                  body: "",
                  sourceUrl: global.source,
                  renderLargerThumbnail: true,
                  mediaType: 1
                }
              }
            });
          } else if (action == 'demote') {
            teks = author == n ? `@${n.split('@')[0]} has *stopped being admin*` : author !== n ? `@${author.split("@")[0]} has *removed* @${n.split('@')[0]} as *admin*` : "";
            let img = await promoteBanner(profile, n.split("@")[0], "demote");
            await client.sendMessage(id, {
              text: teks,
              contextInfo: {
                mentionedJid: [author, n],
                externalAdReply: {
                  thumbnail: img,
                  title: "D E M O T E 📍",
                  body: "",
                  sourceUrl: global.source,
                  renderLargerThumbnail: true,
                  mediaType: 1
                }
              }
            });
          }
        }
      }
    } catch (error) {
      log.error('Failed to process group participant update', error);
    }
  });
  return client;
}
/// ───────── [ 𝖶𝖾𝖻 𝖯𝖺𝗂𝗋𝗂𝗇𝗀 ] ───────── ///
if (!process.env.SESSION_SELFTEST && webPair.isEnabled()) {
  const pairUrl = webPair.start();
  if (pairUrl) log.info(`Pairing page ${pairUrl}`);
  const effectivePair = customPairCode();
  if (effectivePair) {
    const wished = String(global.pair || '').trim();
    log.info(wished.toUpperCase() === effectivePair
      ? `Custom pairing code: ${effectivePair}`
      : `Custom pairing code: ${effectivePair} (from "${wished}" — WhatsApp requires exactly 8 characters)`);
  }
}
if (process.env.SESSION_SELFTEST) {
  // scripts/session-selftest.js drives the persistence helpers without a socket.
  module.exports = {
    prepareSession, markSessionLinked, sessionState, quarantineSession, snapshotCreds, SESSION_DIR,
    resetSessionCache: () => { sessionPrepared = false; }
  };
} else {
/// ───────── [ 𝖦𝗋𝖺𝖼𝖾𝖿𝗎𝗅 𝗌𝗍𝗈𝗉 ] ───────── ///
// Fly sends SIGINT, then SIGKILL 20s later: finish the creds write we started.
let shuttingDown = false;
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, async () => {
    if (shuttingDown) return;
    shuttingDown = true;
    log.warn('Shutting down: saving the session before exit');
    try {
      await snapshotCreds();
      if (currentSock && currentSock.ws && currentSock.ws.isOpen) currentSock.ws.close();
    } catch (_) {}
    process.exit(0);
  });
}
startingBot();
}
