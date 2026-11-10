/**
 * In-chat HTML games, rendered by WhatsApp's own rich card.
 *
 * The payload is a complete HTML5 document handed to the client inside a
 * `GenAIaeacdsnwHtmlPrimitive` view model, which the app renders in its sandboxed
 * webview — so a game looks and behaves like a native card, not like a link.
 *
 * Payloads live in assets/htmlgames/ and are vendored on purpose: a hosted URL could be
 * swapped for malicious JavaScript later on, and every user would run it on open.
 *
 * Envelope (proven on the scene relays):
 *   messageContextInfo { messageSecret, deviceListMetadata, botMetadata { botResponseId,
 *     verificationMetadata { proofs [{ version, useCase, signature, certificateChain }] } } }
 *   botForwardedMessage { message { richResponseMessage {
 *     messageType, submessages [{ messageType, messageText }],
 *     unifiedResponse { data: base64({ response_id, sections [{ view_model { primitive } }] }) },
 *     contextInfo { forwardingScore, isForwarded, forwardedAiBotMessageInfo, forwardOrigin } } } }
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { generateWAMessageFromContent } = require('@adiwajshing/baileys');

const GAMES_DIR = path.join(__dirname, '..', 'assets', 'htmlgames');
const payloadCache = new Map();
let certificateChainCache;

// Scene-standard verification blob, identical to every bot that ships this envelope.
const VERIFICATION_SIGNATURE =
  'TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YeN55YRyad2+ZA==';

const HTML_GAMES = {
  chess: { file: 'chess.html', title: 'Mini Chess ♟️', desc: 'Two-player chess board' },
  ttc: { file: 'ttc.html', title: 'Tic-Tac-Toe ❌⭕', desc: 'Classic three in a row' },
  dino: { file: 'dino.html', title: 'Dino Runner 🦖', desc: 'Endless runner, tap to jump' },
  mbim: { file: 'mbim.html', title: 'Highway Rush 🏎️', desc: 'Dodge traffic at full speed', alias: 'highway' },
  plane: { file: 'plane.html', title: 'Space Rush 🚀', desc: 'Pilot through the asteroid field', alias: 'spacerush' },
  calc: { file: 'calc.html', title: 'Akoya Calc 🧮', desc: 'Full calculator inside the chat' },
  monitor: { file: 'monitor.html', title: 'Server Monitor 📡', desc: 'Live stats for this host', template: true }
};

function loadCertificateChain() {
  if (certificateChainCache) return certificateChainCache;
  try {
    const chain = JSON.parse(fs.readFileSync(path.join(GAMES_DIR, 'certificate.json'), 'utf-8'));
    certificateChainCache = Array.isArray(chain) ? chain : [];
  } catch (_) {
    certificateChainCache = [];
  }
  return certificateChainCache;
}

function loadPayload(file) {
  if (payloadCache.has(file)) return payloadCache.get(file);
  const payload = fs.readFileSync(path.join(GAMES_DIR, file), 'utf-8');
  payloadCache.set(file, payload);
  return payload;
}

function hydrateTemplate(html) {
  const mem = process.memoryUsage();
  return html
    .replace(/%LATENCY%/g, String(Date.now() % 1000))
    .replace(/%PLATFORM%/g, os.platform())
    .replace(/%OS_INFO%/g, `${os.platform()} ${os.release()}`)
    .replace(/%ARCH_INFO%/g, os.arch())
    .replace(/%CPU_CORES%/g, String(os.cpus()?.length || 1))
    .replace(/%HEAP_USED%/g, (mem.heapUsed / 1024 / 1024).toFixed(2))
    .replace(/%RSS_MEM%/g, (mem.rss / 1024 / 1024).toFixed(2))
    .replace(/%NODE_INFO%/g, `Node ${process.version}`)
    .replace(/%BOTUPTIME%/g, String(Math.floor(process.uptime())))
    .replace(/%SYSTEMUPTIME%/g, String(Math.floor(os.uptime())));
}

function findHtmlGame(name) {
  const key = String(name || '').toLowerCase().trim();
  if (HTML_GAMES[key]) return [key, HTML_GAMES[key]];
  for (const [k, game] of Object.entries(HTML_GAMES)) {
    if (game.alias === key) return [k, game];
  }
  return null;
}

async function sendHtmlGame(sock, jid, { game, quoted } = {}) {
  const resolved = findHtmlGame(game);
  if (!resolved) return { ok: false, reason: `unknown game "${game}"` };
  const [key, meta] = resolved;

  let payload;
  try {
    payload = loadPayload(meta.file);
  } catch (_) {
    return { ok: false, reason: `payload missing: ${meta.file}` };
  }
  if (meta.template) payload = hydrateTemplate(payload);

  const responseId = crypto.randomUUID();
  const unified = Buffer.from(
    JSON.stringify({
      response_id: responseId,
      sections: [{
        view_model: {
          primitive: {
            __typename: 'GenAIaeacdsnwHtmlPrimitive',
            payload,
            trusted_sources: ['nexora.dev']
          },
          __typename: 'GenAISingleLayoutViewModel'
        }
      }]
    })
  ).toString('base64');

  const certificateChain = loadCertificateChain();
  const content = {
    messageContextInfo: {
      messageSecret: crypto.randomBytes(32),
      deviceListMetadata: {},
      deviceListMetadataVersion: 2,
      botMetadata: {
        messageDisclaimerText: '',
        botResponseId: responseId,
        ...(certificateChain.length
          ? {
              verificationMetadata: {
                proofs: [{
                  version: 1,
                  useCase: 1,
                  signature: VERIFICATION_SIGNATURE,
                  certificateChain
                }]
              }
            }
          : {})
      }
    },
    botForwardedMessage: {
      message: {
        richResponseMessage: {
          messageType: 1,
          submessages: [{ messageType: 2, messageText: meta.title }],
          unifiedResponse: { data: unified },
          contextInfo: {
            ...(quoted && typeof quoted === 'object'
              ? {
                  stanzaId: quoted.key?.id,
                  participant: quoted.key?.participant || quoted.participant,
                  quotedMessage: quoted.message ?? quoted
                }
              : {}),
            forwardingScore: 1,
            isForwarded: true,
            forwardedAiBotMessageInfo: { botJid: '867051314767696@bot' },
            forwardOrigin: 4
          }
        }
      }
    }
  };

  const message = await generateWAMessageFromContent(jid, content, {
    userJid: sock.user?.id || '0@s.whatsapp.net'
  });
  await sock.relayMessage(jid, message.message, { messageId: message.key.id });
  return { ok: true, key: message.key, game: key, title: meta.title };
}

// ─────────────── chat commands ───────────────
// Dispatched from case.js before the switch. Names here must not collide with an
// existing case, or the card would shadow a working command.

function sender(name) {
  return async (ctx) => {
    const res = await sendHtmlGame(ctx.client, ctx.m.chat, { game: name, quoted: ctx.m });
    if (!res.ok) return ctx.reply(`Could not open ${name}: ${res.reason}.`);
  };
}

const commands = {
  chess: sender('chess'),
  ttc: sender('ttc'),
  tictactoe: sender('ttc'),
  calc: sender('calc'),
  monitor: sender('monitor'),
  htmlgame: async (ctx) => {
    const wanted = String(ctx.text || '').trim();
    if (!wanted) return listHtmlGames(ctx);
    const res = await sendHtmlGame(ctx.client, ctx.m.chat, { game: wanted, quoted: ctx.m });
    if (!res.ok) return ctx.reply(`No game called *${wanted}*. Try \`.htmlgame\` for the list.`);
  },
  games: listHtmlGames,
  htmlgames: listHtmlGames
};

async function listHtmlGames(ctx) {
  const lines = Object.entries(HTML_GAMES).map(([key, game]) => {
    const names = game.alias ? `*${key}* / ${game.alias}` : `*${key}*`;
    return `└╼ ${names} — ${game.desc}`;
  });
  return ctx.reply(
    `◜🎮◞ *HTML games*\n${lines.join('\n')}\n\nOpen one with \`.htmlgame <name>\` or straight from its name (\`.chess\`, \`.ttc\`, \`.calc\`, \`.monitor\`).`
  );
}

module.exports = {
  HTML_GAMES,
  sendHtmlGame,
  findHtmlGame,
  hydrateTemplate,
  commands
};
