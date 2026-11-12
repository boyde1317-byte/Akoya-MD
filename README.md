<div align="center">

# 🦪 Akoya-MD

**WhatsApp Multi-Device Bot — Fast, Lightweight, and Easy to Use**

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![WhatsApp](https://img.shields.io/badge/WhatsApp-Bot%20MD-25D366?logo=whatsapp&logoColor=white)
![License](https://img.shields.io/badge/License-Free%20%7C%20Not%20For%20Sale-red)

</div>

---

## 📖 About

**Akoya-MD** is a Node.js + Baileys WhatsApp multi-device bot: easy to install,
stable to run, and comfortable to extend. It grew out of the Yorumi-MD v2.00 base,
unpacked from its boot obfuscator, fully translated to English and cleaned up.
See `FINDINGS.md` for the cleanup report and `AUDIT-2026-11-09.md` for the latest
health check.

## ✨ Key Features

- 🛡️ **Group Moderation** — Anti Link, Anti Toxic, Anti Tag Status, Anti Channel
- 🎮 **Games in chat** — playable cards, HTML where WhatsApp renders it
- 🤖 **Jadibot** — turn other numbers into bots
- 💳 **Payment Menu**
- 🎨 **Stickers, Image Tools, Downloaders**
- 🧠 **AI Menu**
- 🔐 **Password-protected pairing**

> The full feature list is available through the in-bot menu.

---

## 📋 Requirements

| Requirement | Notes |
| ----------- | ----- |
| Node.js    | 18 or newer (tested on 24) |
| npm        | Ships with Node |
| FFmpeg     | Sticker, audio and video features |
| Git        | Optional |

---

## 🚀 Install and Run

```bash
npm install
npm start
```

Then open **`http://<host>:3000/pair`** (or `http://localhost:3000/pair` on the
machine itself), type the WhatsApp number with country code and use the code it
gives you. Terminal pairing still works when you switch `global.webPair.enabled`
off.

## ⚙️ Configure `settings.js`

At minimum set:

- `global.owner` — the owner's WhatsApp number, digits only, international
  format (`233XXXXXXXXX`). It ships set to `233533416608`, which is why owner-only
  commands answer out of the box; change it to hand the bot to someone else.
- `global.webPair` — the browser pairing page. `port` defaults to `PORT` or `3000`
  and `host` to `0.0.0.0` so the page answers at `https://<app>.fly.dev/pair`; set
  `host: '127.0.0.1'` to keep it local, and `key` to require an access key before a
  code is issued.
- `global.pair` — optional **8-character** custom pairing code (`A-Z`, `0-9`). Leave it
  empty and WhatsApp generates a random one; anything shorter is ignored.

Contact links are already set:

| Field | Value |
| ----- | ----- |
| Owner (WhatsApp) | https://wa.me/233533416608 (`global.linkOwner`, the number in the menu footers) |
| Owner (Telegram) | not set (`global.tele`) |
| Channel | not set (`global.idSaluran` is empty, so nothing is forwarded and no channel is followed) |
| Group | not set (`global.linkGrup`) |

The channel and group rows used to point at the previous author's newsletter and
group. Nothing follows, joins or forwards to them any more: 2.6.2 removed the
remote channel-follow and the two invite-code joins, so a channel appears in the bot
only after you set `global.idSaluran` yourself.

## 🌐 Pair from the browser

`npm start` prints `Pairing page http://<host>:3000/pair`. Open it on any device:

1. Type the number that should become the bot, with country code, digits only.
2. The page shows an 8-character code within seconds.
3. On that phone: **WhatsApp → Linked devices → Link a device → Link with phone
   number instead**, then type the code.

Notes:

| | |
| --- | --- |
| Code lifetime | 3 minutes (`global.webPair.codeWindowMs`), the page counts down |
| Page refresh | keeps the same attempt — the token lives in the tab, not the URL |
| Dropped connection | a fresh code is issued automatically (twice), the page says so |
| `/health` | JSON status for uptime checks: `{ ok, phase, linked, jid, uptimeSeconds, session }` |
| Access key | set `global.webPair.key` to require one before a code is issued |
| Visibility | the code is only ever rendered on the page: never in WhatsApp, chat logs or the terminal |
| On Fly.io | `https://<app-name>.fly.dev/pair` — see the deployment section below |

## 🔔 Pairing alerts

Every session that pairs sends the owner one short WhatsApp note, so a build that
is out in the wild reports itself instead of running silently:

```
*New pairing* 🔗
+233 24 ••• 2222 (Kofi)
from Accra, Ghana
device android
came via tiktok "nov"
10 Nov 2026, 11:42 · paired 2m after the code
3rd pairing on this build
```

- Fires once per pairing. Reconnects and redeploys inherit `registered: true`, so
  they stay quiet, and a pairing socket that cannot send yet keeps its note queued.
- Also announced: a number this build has never seen asking for a code (first proof
  an advert worked), a device removed on the phone, and a jadibot a user pairs.
- Your own number is shown in full; anyone else's is masked, so the note is a usage
  signal without leaking a user.
- The funnel behind it is kept on the volume at `library/database/pairs.json`:
  page opens, codes requested, pairings, wrong codes, refusals and the campaign
  (`?utm_source=` / referrer) that produced each one.
- Read it in chat with `.pairs` (owner only), or as JSON at
  `GET /pair/api/stats?key=<PAIR_STATS_KEY>`. It falls back to `WEB_PAIR_KEY`, and
  answers 404 while neither is set, so the report is never public.
- Turn the notes off, history and all counting kept, with `global.pairAlerts =
  { enabled: false }` or `PAIR_ALERTS=false`.

## 🚀 Deploy on Fly.io

This repo ships a `Dockerfile` and a `fly.toml` that already handle the three things
a WhatsApp bot needs on Fly: one always-on machine, durable state, and a health check.

| | |
| --- | --- |
| Always on | `auto_stop_machines = false`, `min_machines_running = 1`. A WhatsApp socket cannot scale to zero, and two machines would fight over one session |
| Durable state | volume `akoya_data` at `/data`; `scripts/fly-start.sh` links `session` and `library/database` onto it, so a redeploy does not log the bot out or wipe its data |
| Health check | `GET /health` every 30s, 25s grace period on boot |

```bash
fly launch --no-deploy      # keep the included fly.toml, then pick your region
fly volumes create akoya_data -s 1 -r jnb
fly secrets set WEB_PAIR_KEY=some-long-random-string   # do this before pairing
fly deploy
fly logs                    # look for: Pairing page https://<app>.fly.dev/pair
```

Open `https://<app-name>.fly.dev/pair`, type the number with country code, and enter
the code on the phone.

Worth knowing:

- `app = "akoya-md"` in `fly.toml` must be unique on Fly, and `primary_region = "jnb"`
  is Johannesburg. Both are yours to change.
- `1gb` memory is the practical floor: sharp, canvas and Baileys together do not fit
  comfortably in 256mb.
- Set `WEB_PAIR_KEY` before the machine is publicly reachable. Until the bot is linked
  anyone who opens `/pair` could request a code for a number, and rate limits only slow
  that down. After linking, the page refuses new requests on its own (409).
- `PORT` comes from `fly.toml`; the app reads it, so no code change is needed.
- Local Docker works the same way: `docker build -t akoya-md .` then
  `docker run -p 8080:8080 -v akoya_data:/data akoya-md`.

## 🎨 Menu images

The menu card, ad-reply art and payment thumbnail all come from `media/`, not from a
third-party host, and nothing is downscaled by accident any more.

| Asset | Size | Used for |
| --- | --- | --- |
| `media/menu.jpg` | 1024×1024, q96, 4:4:4 | menu art, `global.image.menu` |
| `media/thum.jpg` | 1024×1024, q95, 4:4:4 | thumbnail source, `global.image.reply` |

WhatsApp delivers thumbnails inside the message itself, so those are rendered at
**720px** (about 57 KB) instead of the old 300px. 720 is the largest size that still
fits a message's `jpegThumbnail` comfortably; 300 was simply smaller than the phone
would ever display. Full-size images are sent at their native 1024px with 4:4:4 colour
and no re-compression pass.

The bot serves these two files at `/media/menu.jpg` and `/media/thum.jpg` so ad-reply
links do not depend on anyone else's CDN. That needs a public address: `PUBLIC_URL`
is used when set, otherwise Fly's own `FLY_APP_NAME`. Only those two filenames are
served; payment IDs and audio stay private.

To swap in your own art, drop a square JPEG at `media/menu.jpg` and `media/thum.jpg`
(1024px or larger). Nothing else needs editing.

## 🔤 Command names

The menus advertise English command names: `.weather`, `.earthquake`, `.cat`,
`.soulmate`, `.guessnumber`. The handlers behind them are the ones the bot always
had, so nothing about how they behave changed.

Every Indonesian trigger still answers. `.cuaca`, `.cekgempa`, `.kucing` and the rest
are aliases, not dead words, which means pinned messages, saved chats and muscle
memory keep working. The table lives in `source/cmdalias.js` — one line per command:

```js
weather: 'cuaca',
```

The lookup happens after the message is parsed, so a usage hint always echoes the
word that was actually typed. `node tools/check-menu.js` fails the build if a menu
entry resolves to nothing, if an alias points at a handler that does not exist, or
if an English name would shadow a different handler.

Add your own alias with one line there and nothing else.

## 🆘 Troubleshooting

| Problem | Solution |
| ------- | -------- |
| Bot won't connect | Check the connection, delete the `session` folder, pair again on the web page |
| Pairing page not reachable | The page listens on `0.0.0.0` by default; check the platform forwards the port, or open `http://localhost:<port>/pair` from the host itself |
| Sticker feature fails | Install FFmpeg (`apt install ffmpeg`) |
| A command does not respond | Check the bot has the needed admin rights in the group |
| An Indonesian command still answers | Expected: `.cuaca` and friends are kept as aliases of their English name (`source/cmdalias.js`) |

---

## ⚠️ Notes

- For learning and personal use. No spam, no WhatsApp ToS violations.
- Keep your credentials and `session` folder private.
- Pterodactyl/panel hosting commands and the `ssh2` dependency were removed in this build.

## 🙏 Credits

- [Baileys](https://github.com/WhiskeySockets/Baileys) — WhatsApp multi-device engine
- **Yorumi-MD** — original base script this build is derived from
