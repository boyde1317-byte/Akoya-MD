require('../settings');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const FileType = require('file-type');
const PhoneNumber = require('awesome-phonenumber');
const {
  imageToWebp,
  videoToWebp,
  writeExif
} = require('../library/exif');
const {
  isUrl,
  getGroupAdmins,
  generateMessageTag,
  getBuffer,
  getSizeMedia,
  fetchJson,
  sleep,
  getTypeUrlMedia,
  assertSafeFetchUrl
} = require('../library/function');
const {
  jidNormalizedUser,
  proto,
  getBinaryNodeChildren,
  getBinaryNodeChild,
  generateWAMessageContent,
  generateForwardMessageContent,
  prepareWAMessageMedia,
  delay,
  areJidsSameUser,
  extractMessageContent,
  generateMessageID,
  downloadContentFromMessage,
  generateWAMessageFromContent,
  jidDecode,
  generateWAMessage,
  toBuffer,
  getContentType,
  getDevice
} = require('@adiwajshing/baileys');
// Additional owners are read fresh on every check, not once at require
// time. case.js mutates the same file live (.addowner/.delowner), so a
// cached copy here made self-mode gating stale until restart: a removed
// owner kept getting through, and an added owner stayed blocked. The file
// is tiny and this path only runs when the bot is in self mode, so the
// re-read costs nothing.
function loadExtraOwners() {
  try {
    const parsed = JSON.parse(fs.readFileSync('./library/database/owner.json', 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
// WhatsApp media downloads are streamed whole into memory. Without a cap,
// one huge file (the sender-controlled fileLength header cannot be
// trusted) can OOM the process, so every download loop below aborts past
// this many bytes.
const MAX_MEDIA_DOWNLOAD_BYTES = 100 * 1024 * 1024;
function normalizeOwnerJid(value = '') {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const jid = raw.includes('@') ? raw : `${raw}@s.whatsapp.net`;
  return jid.replace(/:\d+(?=@)/, '');
}
function isConfiguredOwner(jid = '', client = null) {
  const normalized = normalizeOwnerJid(jid);
  if (!normalized) return false;
  const owners = [global.owner, ...loadExtraOwners()];
  if (client?.isJadibot && client?.user?.id) owners.push(client.user.id, client.jadibotOwnerJid);
  return owners.map(normalizeOwnerJid).filter(Boolean).includes(normalized);
}
function getMessageSenderJid(client, msg, botNumber) {
  if (msg?.key?.fromMe) return botNumber;
  return client.decodeJid(msg?.key?.participant || msg?.key?.remoteJid || '');
}
function getInteractiveResponseId(msg) {
  try {
    const paramsJson = msg?.nativeFlowResponseMessage?.paramsJson;
    if (!paramsJson) return '';
    const params = typeof paramsJson === 'string' ? JSON.parse(paramsJson) : paramsJson;
    return String(params?.id || params?.selected_id || params?.row_id || params?.button_id || '').trim();
  } catch {
    return '';
  }
}
async function MessagesUpsert(client, message, store, commandHandler) {
  if (!client || !message || !Array.isArray(message.messages) || !message.messages.length) return;
  const botNumber = await client.decodeJid(client.user?.id || '');
  for (const msg of message.messages) {
    try {
      if (!msg?.key) continue;
      if (msg.key.remoteJid === 'status@broadcast') {
        if (global.db?.settings?.readsw === true) {
          await client.readMessages([msg.key]).catch(() => {});
        }
        continue;
      }
      if (!msg.message) continue;
      if (!client.public && !msg.key.fromMe && message.type === 'notify') {
        const senderJid = getMessageSenderJid(client, msg, botNumber);
        if (!isConfiguredOwner(senderJid, client)) continue;
      }
      if (global.db?.settings?.autoread === true) {
        await client.readMessages([msg.key]).catch(() => {});
      }
      if (global.db?.settings?.autotyping === true && !msg.key.fromMe) {
        await client.sendPresenceUpdate('composing', msg.key.remoteJid).catch(() => {});
      }
      const m = await Serialize(client, msg, store);
      if (!m || m.isBaileys && !(client.isJadibot && m.fromMe)) continue;
      if (m.type === 'interactiveResponseMessage') {
        const interactiveId = getInteractiveResponseId(m.msg);
        if (interactiveId) {
          m.body = interactiveId;
          m.text = interactiveId;
        }
      }
      if (typeof commandHandler === 'function') {
        await commandHandler(client, m, message, store);
      }
    } catch (error) {
      console.error(`[MESSAGES UPSERT${client.isJadibot ? ` JADIBOT ${client.jadibotOwnerJid || ''}` : ''}]`, error);
    }
  }
}
async function Solving(client, store) {
  client.public = true;
  client.serializeM = m => MessagesUpsert(client, m, store);
  client.decodeJid = jid => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return decode.user && decode.server && decode.user + '@' + decode.server || jid;
    } else return jid;
  };
  client.getName = (jid, withoutContact = false) => {
    const id = client.decodeJid(jid);
    if (id.endsWith('@g.us')) {
      const groupInfo = store.contacts[id] || client.groupMetadata(id) || {};
      return Promise.resolve(groupInfo.name || groupInfo.subject || PhoneNumber('+' + id.replace('@g.us', '')).getNumber('international'));
    } else {
      if (id === '0@s.whatsapp.net') {
        return 'WhatsApp';
      }
      const contactInfo = store.contacts[id] || {};
      return withoutContact ? '' : contactInfo.name || contactInfo.subject || contactInfo.verifiedName || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international');
    }
  };
  client.sendContactV2 = async (jid, kon, desk = "Developer Bot", quoted = '', opts = {}) => {
    let list = [];
    for (let i of kon) {
      list.push({
        displayName: global.namaOwner,
        vcard: 'BEGIN:VCARD\n' + 'VERSION:3.0\n' + `N:;${global.namaOwner};;;\n` + `FN:${global.namaOwner}\n` + 'ORG:null\n' + 'TITLE:\n' + `item1.TEL;waid=${i}:${i}\n` + 'item1.X-ABLabel:Ponsel\n' + `X-WA-BIZ-DESCRIPTION:${desk}\n` + `X-WA-BIZ-NAME:${global.namaOwner}\n` + 'END:VCARD'
      });
    }
    client.sendMessage(jid, {
      contacts: {
        displayName: `${list.length} contacts`,
        contacts: list
      },
      ...opts
    }, {
      quoted
    });
  };
  client.sendContact = async (jid, kon, quoted = '', opts = {}) => {
    let list = [];
    for (let i of kon) {
      list.push({
        displayName: await client.getName(i + '@s.whatsapp.net'),
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await client.getName(i + '@s.whatsapp.net')}\nFN:${await client.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nitem2.ADR:;;;;;;\nitem2.X-ABLabel:Region\nEND:VCARD`
      });
    }
    client.sendMessage(jid, {
      contacts: {
        displayName: `${list.length} contacts`,
        contacts: list
      },
      ...opts
    }, {
      quoted
    });
  };
  client.profilePictureUrl = async (jid, type = 'image', timeoutMs) => {
    const result = await client.query({
      tag: 'iq',
      attrs: {
        target: jidNormalizedUser(jid),
        to: '@s.whatsapp.net',
        type: 'get',
        xmlns: 'w:profile:picture'
      },
      content: [{
        tag: 'picture',
        attrs: {
          type,
          query: 'url'
        }
      }]
    }, timeoutMs);
    const child = getBinaryNodeChild(result, 'picture');
    return child?.attrs?.url;
  };
  client.setStatus = status => {
    client.query({
      tag: 'iq',
      attrs: {
        to: '@s.whatsapp.net',
        type: 'set',
        xmlns: 'status'
      },
      content: [{
        tag: 'status',
        attrs: {},
        content: Buffer.from(status, 'utf-8')
      }]
    });
    return status;
  };
  client.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
    async function getFileUrl(res, mime) {
      if (mime && mime.includes('gif')) {
        return client.sendMessage(jid, {
          video: res.data,
          caption: caption,
          gifPlayback: true,
          ...options
        }, {
          quoted
        });
      } else if (mime && mime === 'application/pdf') {
        return client.sendMessage(jid, {
          document: res.data,
          mimetype: 'application/pdf',
          caption: caption,
          ...options
        }, {
          quoted
        });
      } else if (mime && mime.includes('image')) {
        return client.sendMessage(jid, {
          image: res.data,
          caption: caption,
          ...options
        }, {
          quoted
        });
      } else if (mime && mime.includes('video')) {
        return client.sendMessage(jid, {
          video: res.data,
          caption: caption,
          mimetype: 'video/mp4',
          ...options
        }, {
          quoted
        });
      } else if (mime && mime.includes('audio')) {
        return client.sendMessage(jid, {
          audio: res.data,
          mimetype: 'audio/mpeg',
          ...options
        }, {
          quoted
        });
      }
    }
    assertSafeFetchUrl(url);
    const res = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 60000,
      maxContentLength: 50 * 1024 * 1024
    });
    let mime = res.headers['content-type'];
    if (!mime || mime === 'application/octet-stream') {
      const fileType = await FileType.fromBuffer(res.data);
      mime = fileType ? fileType.mime : null;
    }
    const hasil = await getFileUrl(res, mime);
    return hasil;
  };
  client.sendTextMentions = async (jid, text, quoted, options = {}) => client.sendMessage(jid, {
    text: text,
    mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
    ...options
  }, {
    quoted
  });
  client.sendAsSticker = async (jid, path, quoted, options = {}) => {
    const buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await await getBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExif(buff, options);
    } else {
      buffer = await videoToWebp(buff);
    }
    await client.sendMessage(jid, {
      sticker: {
        url: buffer
      },
      ...options
    }, {
      quoted
    });
    return buff;
  };
  client.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path) ? path : /^data:.?\/.?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await getBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExif(buff, options);
    } else {
      buffer = await videoToWebp(buff);
    }
    await client.sendMessage(jid, {
      sticker: {
        url: buffer
      },
      ...options
    }, {
      quoted
    });
    return buffer;
  };
  client.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
    const quoted = message.msg || message;
    const mime = quoted.mimetype || '';
    const messageType = (message.mtype || mime.split('/')[0]).replace(/Message/gi, '');
    const stream = await downloadContentFromMessage(quoted, messageType);
    const chunks = [];
    let totalBytes = 0;
    for await (const chunk of stream) {
      totalBytes += chunk.length;
      if (totalBytes > MAX_MEDIA_DOWNLOAD_BYTES) throw new Error('Media is larger than the 100 MB download cap');
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    const type = await FileType.fromBuffer(buffer);
    const trueFileName = attachExtension ? `./library/database/sampah/${filename ? filename : Date.now()}.${type.ext}` : filename;
    await fs.promises.writeFile(trueFileName, buffer);
    return trueFileName;
  };
  client.getFile = async (PATH, save) => {
    let res;
    let filename;
    let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0);
    let type = (await FileType.fromBuffer(data)) || {
      mime: 'application/octet-stream',
      ext: '.bin'
    };
    // `filename` used to be an undeclared global shared across concurrent
    // calls, the path joined onto __filename (landing in source/library/),
    // and the write was fire-and-forget while senders read the path at once.
    filename = path.join(__dirname, '..', 'library', 'database', 'sampah', Date.now() + '.' + type.ext);
    if (data && save) {
      await fs.promises.mkdir(path.dirname(filename), {
        recursive: true
      });
      await fs.promises.writeFile(filename, data);
    }
    return {
      res,
      filename,
      size: await getSizeMedia(data),
      ...type,
      data
    };
  };
  client.sendMedia = async (jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
    const {
      mime,
      data,
      filename
    } = await client.getFile(path, true);
    const isWebpSticker = options.asSticker || /webp/.test(mime);
    let type = 'document',
      mimetype = mime,
      pathFile = filename;
    if (isWebpSticker) {
      const {
        writeExif
      } = require('../library/exif');
      const media = {
        mimetype: mime,
        data
      };
      pathFile = await writeExif(media, {
        packname: options.packname || global.packname,
        author: options.author || global.author,
        categories: options.categories || []
      });
      await fs.promises.unlink(filename);
      type = 'sticker';
      mimetype = 'image/webp';
    } else if (/image|video|audio/.test(mime)) {
      type = mime.split('/')[0];
    }
    await client.sendMessage(jid, {
      [type]: {
        url: pathFile
      },
      caption,
      mimetype,
      fileName,
      ...options
    }, {
      quoted,
      ...options
    });
    return fs.promises.unlink(pathFile);
  };
  return client;
}
const groupMetadataCache = new Map();
const GROUP_METADATA_TTL = 5 * 60 * 1000;
const GROUP_METADATA_ERROR_TTL = 5000;
async function getCachedGroupMetadata(client, jid) {
  const now = Date.now();
  const cached = groupMetadataCache.get(jid);
  if (cached?.data && cached.expiresAt > now) return cached.data;
  if (cached?.promise) return cached.promise;
  // A failed lookup used to refetch on the very next message: the error
  // entry carried neither data nor a promise, so the 5s error TTL never
  // applied. Re-throw the cached failure until it expires instead.
  if (cached?.errorAt && now - cached.errorAt < GROUP_METADATA_ERROR_TTL) throw cached.error;
  const promise = client.groupMetadata(jid).then(data => {
    groupMetadataCache.set(jid, {
      data,
      expiresAt: Date.now() + GROUP_METADATA_TTL
    });
    return data;
  }).catch(error => {
    groupMetadataCache.set(jid, {
      error,
      errorAt: Date.now(),
      expiresAt: Date.now() + GROUP_METADATA_ERROR_TTL
    });
    throw error;
  });
  groupMetadataCache.set(jid, {
    promise,
    expiresAt: now + GROUP_METADATA_ERROR_TTL
  });
  return promise;
}
async function Serialize(client, m, store) {
  const botNumber = await client.decodeJid(client.user.id);
  // m.isDeveloper used to be decided by the previous author's number, obfuscated,
  // which handed him owner rights on every command. Now it follows settings.js.
  const botrunning = [global.owner, ...(Array.isArray(global.developer) ? global.developer : [])]
    .map(value => String(value || '').replace(/[^0-9]/g, ''))
    .filter(Boolean)
    .map(value => `${value}@s.whatsapp.net`);
  if (!m) return m;
  if (m.key) {
    m.id = m.key.id;
    m.chat = m.key.remoteJid;
    m.fromMe = m.key.fromMe;
    m.isBaileys = m.id ? m.id.startsWith('3EB0') || m.id.startsWith('B1E') || m.id.startsWith('BAE') || m.id.startsWith('3F8') : false;
    m.isGroup = m.chat.endsWith('@g.us');
    m.sender = await client.decodeJid(m.fromMe && client.user.id || m.participant || m.key.participant || m.chat || '');
    if (m.isGroup) {
      m.metadata = m.isGroup ? (await getCachedGroupMetadata(client, m.chat).catch(() => ({}))) || {} : {};
      m.admins = m.metadata && m.metadata.participants ? await m.metadata.participants.filter(e => e.admin !== null).map(e => e.id) : [];
      m.isAdmin = m.admins ? m.admins.includes(m.sender) : false;
      m.participant = m.key.participant || "";
      m.isBotAdmin = m.admins ? m.admins.includes(botNumber) : false;
    }
    m.isDeveloper = botrunning.includes(m.sender) ? true : false;
  }
  if (m.message) {
    m.type = getContentType(m.message) || Object.keys(m.message)[0];
    m.msg = /viewOnceMessage/i.test(m.type) ? m.message[m.type].message[getContentType(m.message[m.type].message)] : extractMessageContent(m.message[m.type]) || m.message[m.type];
    const interactiveResponseId = m.type === 'interactiveResponseMessage' ? getInteractiveResponseId(m.msg) : '';
    m.body = m.message?.conversation || m.msg?.text || m.msg?.conversation || m.msg?.caption || m.msg?.selectedButtonId || m.msg?.singleSelectReply?.selectedRowId || m.msg?.selectedId || interactiveResponseId || m.msg?.contentText || m.msg?.selectedDisplayText || m.msg?.title || m.msg?.name || '';
    m.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : [];
    m.text = m.msg?.text || m.msg?.caption || m.message?.conversation || m.msg?.selectedButtonId || m.msg?.singleSelectReply?.selectedRowId || m.msg?.selectedId || interactiveResponseId || m.msg?.contentText || m.msg?.selectedDisplayText || m.msg?.title || '';
    m.expiration = m.msg?.contextInfo?.expiration || 0;
    m.timestamp = (typeof m.messageTimestamp === "number" ? m.messageTimestamp : m.messageTimestamp.low ? m.messageTimestamp.low : m.messageTimestamp.high) || m.msg.timestampMs * 1000;
    m.isMedia = !!m.msg?.mimetype || !!m.msg?.thumbnailDirectPath;
    if (m.isMedia) {
      m.mime = m.msg?.mimetype;
      m.size = m.msg?.fileLength;
      m.height = m.msg?.height || '';
      m.width = m.msg?.width || '';
      if (/webp/i.test(m.mime)) {
        m.isAnimated = m.msg?.isAnimated;
      }
    }
    m.quoted = m.msg?.contextInfo?.quotedMessage || null;
    if (m.quoted) {
      m.quoted.message = extractMessageContent(m.msg?.contextInfo?.quotedMessage);
      m.quoted.type = getContentType(m.quoted.message) || Object.keys(m.quoted.message)[0];
      m.quoted.id = m.msg.contextInfo.stanzaId;
      m.quoted.device = getDevice(m.quoted.id);
      m.quoted.isBaileys = m.quoted.id ? m.quoted.id.startsWith('3EB0') || m.quoted.id.startsWith('B1E') || m.quoted.id.startsWith('3F8') || m.quoted.id.startsWith('BAE') : false;
      m.quoted.sender = client.decodeJid(m.msg.contextInfo.participant);
      m.quoted.fromMe = m.quoted.sender === client.decodeJid(client.user.id);
      m.quoted.text = m.quoted.caption || m.quoted.conversation || m.quoted.contentText || m.quoted.selectedDisplayText || m.quoted.title || '';
      m.quoted.msg = extractMessageContent(m.quoted.message[m.quoted.type]) || m.quoted.message[m.quoted.type];
      m.quoted.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : [];
      m.quoted.body = m.quoted.msg?.text || m.quoted.msg?.caption || m.quoted?.message?.conversation || m.quoted.msg?.selectedButtonId || m.quoted.msg?.singleSelectReply?.selectedRowId || m.quoted.msg?.selectedId || m.quoted.msg?.contentText || m.quoted.msg?.selectedDisplayText || m.quoted.msg?.title || m.quoted?.msg?.name || '';
      m.getQuotedObj = async () => {
        if (!m.quoted.id) return false;
        let q = await store.loadMessage(m.chat, m.quoted.id, client);
        return await Serialize(client, q, store);
      };
      m.quoted.key = {
        remoteJid: m.msg?.contextInfo?.remoteJid || m.chat,
        participant: m.quoted.sender,
        fromMe: areJidsSameUser(client.decodeJid(m.msg?.contextInfo?.participant), client.decodeJid(client?.user?.id)),
        id: m.msg?.contextInfo?.stanzaId
      };
      m.quoted.mentions = m.quoted.msg?.contextInfo?.mentionedJid || [];
      m.quoted.body = m.quoted.msg?.text || m.quoted.msg?.caption || m.quoted?.message?.conversation || m.quoted.msg?.selectedButtonId || m.quoted.msg?.singleSelectReply?.selectedRowId || m.quoted.msg?.selectedId || m.quoted.msg?.contentText || m.quoted.msg?.selectedDisplayText || m.quoted.msg?.title || m.quoted?.msg?.name || '';
      m.quoted.isMedia = !!m.quoted.msg?.mimetype || !!m.quoted.msg?.thumbnailDirectPath;
      if (m.quoted.isMedia) {
        m.quoted.mime = m.quoted.msg?.mimetype;
        m.quoted.size = m.quoted.msg?.fileLength;
        m.quoted.height = m.quoted.msg?.height || '';
        m.quoted.width = m.quoted.msg?.width || '';
        if (/webp/i.test(m.quoted.mime)) {
          m.quoted.isAnimated = m?.quoted?.msg?.isAnimated || false;
        }
      }
      m.quoted.fakeObj = proto.WebMessageInfo.fromObject({
        key: {
          remoteJid: m.quoted.chat,
          fromMe: m.quoted.fromMe,
          id: m.quoted.id
        },
        message: m.quoted,
        ...(m.isGroup ? {
          participant: m.quoted.sender
        } : {})
      });
      m.quoted.download = async () => {
        const quotednya = m.quoted.msg || m.quoted;
        const mimenya = quotednya.mimetype || '';
        const messageType = (m.quoted.type || mimenya.split('/')[0]).replace(/Message/gi, '');
        const stream = await downloadContentFromMessage(quotednya, messageType);
        const chunks = [];
        let totalBytes = 0;
        for await (const chunk of stream) {
          totalBytes += chunk.length;
          if (totalBytes > MAX_MEDIA_DOWNLOAD_BYTES) throw new Error('Media is larger than the 100 MB download cap');
          chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);
        return buffer;
      };
      m.quoted.delete = () => {
        client.sendMessage(m.quoted.chat, {
          delete: {
            remoteJid: m.quoted.chat,
            fromMe: m.isBotAdmin ? false : true,
            id: m.quoted.id,
            participant: m.quoted.sender
          }
        });
      };
    }
  }
  m.download = async () => {
    const quotednya = m.msg || m.quoted;
    const mimenya = quotednya.mimetype || '';
    const messageType = (m.type || mimenya.split('/')[0]).replace(/Message/gi, '');
    const stream = await downloadContentFromMessage(quotednya, messageType);
    const chunks = [];
    let totalBytes = 0;
    for await (const chunk of stream) {
      totalBytes += chunk.length;
      if (totalBytes > MAX_MEDIA_DOWNLOAD_BYTES) throw new Error('Media is larger than the 100 MB download cap');
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    return buffer;
  };
  m.copy = () => Serialize(client, proto.WebMessageInfo.fromObject(proto.WebMessageInfo.toObject(m)));
  m.reply = async (text, options = {}) => {
    const chatId = options?.chat ? options.chat : m.chat;
    const caption = options.caption || '';
    const quoted = options?.quoted ? options.quoted : m;
    try {
      if (/^https?:\/\//.test(text)) {
        assertSafeFetchUrl(text);
        const data = await axios.get(text, {
          responseType: 'arraybuffer',
          timeout: 60000,
          maxContentLength: 50 * 1024 * 1024
        });
        const mime = data.headers['content-type'] || (await FileType.fromBuffer(data.data)).mime;
        if (/gif|image|video|audio|pdf/i.test(mime)) {
          return client.sendFileUrl(chatId, text, caption, quoted, options);
        } else {
          return client.sendMessage(chatId, {
            text: text,
            mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
            ...options
          }, {
            quoted
          });
        }
      } else {
        return client.sendMessage(chatId, {
          text: text,
          mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
          ...options
        }, {
          quoted
        });
      }
    } catch (e) {
      return client.sendMessage(chatId, {
        text: text,
        mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
        ...options
      }, {
        quoted
      });
    }
  };
  return m;
}
module.exports = {
  MessagesUpsert,
  Solving
};