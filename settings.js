const fs = require('fs');
const chalk = require('chalk');
const sharp = require('sharp');
const {
  version
} = require("./package.json");

// Settings Bot
global.owner = '233533416608';
global.versi = version;
// Everything date/time related uses this zone (menu header, greetings, logs).
global.timezone = 'Africa/Accra';
global.namaOwner = "moonson";
global.tele = "t.me/DeathCore_Xr";
global.packname = 'Sticker by - Akoya-MD';
global.botname = 'Akoya-MD';
global.botname2 = 'akoya-MD';
global.maxJadibot = 20;
// Custom pairing code. WhatsApp only accepts exactly 8 characters (A-Z, 0-9), so
// a shorter wish is padded with 1s: "akoyamd" ships as AKOYAMD1. Leave it empty
// to let WhatsApp generate a random code instead.
global.pair = "akoyamd";

// Settings Link
global.linkOwner = "https://wa.me/moonson3";
global.linkGrup = "https://chat.whatsapp.com/LSej82OTpns4IqpKqGbxjJ?s=cl&p=a&iam=2";
global.source = "https://whatsapp.com/channel/0029Vb7eSHf42Dcmdd3XA326";

// Settings Web Pairing
// Browse to http://<host>:<port>/pair to get a code — no terminal, no QR.
// ENV overrides exist for Fly.io / Docker: PORT and WEB_PAIR_* are read there,
// so the page can be gated with `fly secrets set WEB_PAIR_KEY=...` without
// editing this file.
global.webPair = {
  enabled: String(process.env.WEB_PAIR_ENABLED ?? 'true').toLowerCase() !== 'false',
  port: Number(process.env.PORT || process.env.WEB_PAIR_PORT || 3000),
  host: process.env.WEB_PAIR_HOST || '0.0.0.0', // 127.0.0.1 keeps the page local-only
  key: process.env.WEB_PAIR_KEY || '', // optional access key required before a code is issued
  codeWindowMs: 3 * 60 * 1000 // how long a code stays valid
};

// Delay Settings
global.delayJpm = 3500;
global.delayPushkontak = 6000;

// Channel Settings
global.linkSaluran = "https://whatsapp.com/channel/0029Vb7eSHf42Dcmdd3XA326";
global.idSaluran = "120363406397452589@newsletter";
global.namaSaluran = "Akoya-MD";

// OrderKuota Settings
global.merchantIdOrderKuota = "-";
global.apiOrderKuota = "-";
global.qrisOrderKuota = "-";

// Settings Apikey
global.apiSimpleBot = "simplebotz85";

// Settings Payment
global.pay = sharp('./media/payment/payment.jpg').resize(720, 720, {
  fit: 'cover',
  position: 'centre'
}).jpeg({
  quality: 88,
  chromaSubsampling: '4:4:4'
}).toBuffer();
global.dana = "08xxx";
global.ovo = "08xxx";
global.gopay = "08xxx";
global.shoopepay = "08xxx";
global.qris = "./media/payment/qris.jpg";
global.andana = "Dana account name";
global.anovo = "name account ovo";
global.angopay = "name account gopay";
global.anshoope = "name account shoopepay";

// Settings Image
// The brand art lives in media/ and is served by this bot's own HTTP server
// (source/webpair.js, /media/*) once it knows its public address: PUBLIC_URL, or
// FLY_APP_NAME on Fly. The old catbox links were the original author's images.
const publicBase = String(process.env.PUBLIC_URL || (process.env.FLY_APP_NAME ? `https://${process.env.FLY_APP_NAME}.fly.dev` : '')).replace(/\/+$/, '');
global.image = {
  menu: publicBase ? `${publicBase}/media/menu.jpg` : './media/menu.jpg',
  reply: publicBase ? `${publicBase}/media/thum.jpg` : './media/thum.jpg',
  logo: publicBase ? `${publicBase}/media/menu.jpg` : './media/menu.jpg',
  qris: './media/payment/qris.jpg' // local on purpose: a payment ID, not public art
};
// Thumbnails that travel inside a WhatsApp message (jpegThumbnail, ad-reply art)
// have to stay small, but 300px was gratuitous: 720px at q88 lands around 57 KB.
const THUMB_SIZE = 720;
global.thumb = sharp('./media/thum.jpg').resize(THUMB_SIZE, THUMB_SIZE, {
  fit: 'cover',
  position: 'centre'
}).jpeg({
  quality: 88,
  chromaSubsampling: '4:4:4'
}).toBuffer();



// Promo Text Settings
global.tekspromosi = `
fill in any text you like
`;

// Settings Message 
global.mess = {
  owner: "*[ access denied ]*\nthis feature is for the Owner only!",
  admin: "*[ access denied ]*\nthis feature is for group admins only!",
  botAdmin: "*[ access denied ]*\nthis feature works only when the bot is a group admin!",
  group: "*[ access denied ]*\nthis feature works only inside groups!",
  private: "*[ access denied ]*\nthis feature works only in private chat!",
  prem: "*[ access denied ]*\nfeature is for premium users",
  wait: 'Loading...',
  error: 'Error!',
  done: 'Done'
};
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update ${__filename}`));
  delete require.cache[file];
  require(file);
});