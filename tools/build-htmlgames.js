#!/usr/bin/env node
/**
 * Generate the in-chat HTML payloads from the shared runtime plus one small spec each.
 *
 * The card shell, HUD, touch handling, high scores and the loop are identical for every
 * game, so they live once in tools/games/runtime.js. Each payload still ends up a single
 * self-contained document (nothing fetched at render time). assets/htmlgames/manifest.json
 * is written from the same table, so the bot's registry and the menu cannot advertise a
 * game that has no payload.
 *
 *   node tools/build-htmlgames.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'assets', 'htmlgames');
const runtime = fs.readFileSync(path.join(__dirname, 'games', 'runtime.js'), 'utf8');

const GAMES = [
  { name: 'sonic', title: 'Sonic Sprint 🦔', desc: 'Endless runner, tap to jump', mech: 'runner', accent: '#2f6bff', speed: 5.2 },
  { name: 'geometry', title: 'Geometry Dash 🔺', desc: 'Jump the spikes, keep the beat', mech: 'runner', accent: '#ffd166', speed: 5.8 },
  { name: 'stickman', title: 'Stickman Run 🏃', desc: 'One tap, endless rooftops', mech: 'runner', accent: '#e8eefc', speed: 4.6 },
  { name: 'racing', title: 'Turbo Racing 🏁', desc: 'Three lanes, no brakes', mech: 'dodge', accent: '#ff5f6d', lanes: 3, speed: 3.4 },
  { name: 'arrow', title: 'Arrow Dodge ➡️', desc: 'Four lanes of incoming arrows', mech: 'dodge', accent: '#a78bfa', lanes: 4, speed: 2.9 },
  { name: 'flappy', title: 'Flappy Bird 🐤', desc: 'Tap through the gaps', mech: 'flap', accent: '#ffd166', gap: 98 },
  { name: 'angrybirds', title: 'Angry Birds 🐦', desc: 'Pull back, let go, flatten the pigs', mech: 'sling' },
  { name: 'mortal', title: 'Mortal Duel ⚔️', desc: 'Strike on the green, dodge the rest', mech: 'duel' },
  { name: 'snake', title: 'Snake 🐍', desc: 'Swipe to steer, eat the apple', mech: 'snake', accent: '#2ecc71' },
  { name: 'snake-rimba', title: 'Snake Rimba 🌿', desc: 'The jungle variant', mech: 'snake', accent: '#ff9f43', alias: 'rimba' },
  { name: 'tetris', title: 'Tetris 🟦', desc: 'Stack, rotate, clear a row', mech: 'tetrix', accent: '#3b82f6' },
  { name: 'puzzle', title: 'Slide Puzzle 🧩', desc: 'Order the tiles 1 to 8', mech: 'slide', accent: '#8b5cf6' },
  { name: 'memory-match', title: 'Memory Match 🃏', desc: 'Eight pairs, one memory', mech: 'pairs', symbols: ['🍇', '🍋', '🍑', '🥝', '🍒', '🥥', '🍍', '🫐'] },
  { name: 'mahjong', title: 'Mahjong Pairs 🀄', desc: 'Match the tiles in pairs', mech: 'pairs', symbols: ['🀄', '🀅', '🀆', '🀇', '🀈', '🀉', '🀊', '🀋'] },
  { name: 'tebakangka', title: 'Guess the Number 🎲', desc: '1 to 100 in seven tries', mech: 'guess', tries: 7, alias: 'guess' }
];

// Documents shipped whole elsewhere and copied in as-is.
const VENDORED = {
  chess: { file: 'chess.html', title: 'Mini Chess ♟️', desc: 'Two-player chess board' },
  ttc: { file: 'ttc.html', title: 'Tic-Tac-Toe ❌⭕', desc: 'Classic three in a row' },
  dino: { file: 'dino.html', title: 'Dino Runner 🦖', desc: 'Endless runner, tap to jump' },
  mbim: { file: 'mbim.html', title: 'Highway Rush 🏎️', desc: 'Dodge traffic at full speed', alias: 'highway' },
  plane: { file: 'plane.html', title: 'Space Rush 🚀', desc: 'Pilot through the asteroid field', alias: 'spacerush' },
  calc: { file: 'calc.html', title: 'Akoya Calc 🧮', desc: 'Full calculator inside the chat' },
  monitor: { file: 'monitor.html', title: 'Server Monitor 📡', desc: 'Live stats for this host', template: true }
};

const CONTROLS = {
  tetrix: [['◀', 'left'], ['⟳', 'rotate'], ['▶', 'right'], ['⤓', 'drop']]
};

function shell(spec) {
  const accent = spec.accent || '#2f6bff';
  const pad = CONTROLS[spec.mech]
    ? `<div class="ft" id="pad">${CONTROLS[spec.mech].map(([label, cmd]) =>
        `<button data-cmd="${cmd}">${label}</button>`).join('')}</div>`
    : '';
  const guess = spec.mech === 'guess'
    ? `<div class="ft" id="pad"><input id="ginput" inputmode="numeric" placeholder="1-100"><button id="gsubmit">Guess</button></div>
  <div class="log" id="gamelog"></div>`
    : '';
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
<title>${spec.title}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none}
body{background:transparent;color:#e8eefc;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;padding:10px}
.card{max-width:480px;margin:0 auto;border:2px solid ${accent};border-radius:18px;overflow:hidden;background:linear-gradient(180deg,rgba(12,16,28,.97),rgba(8,11,20,.97));box-shadow:0 14px 40px rgba(0,0,0,.6)}
.hd{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:11px 14px;border-bottom:1px solid rgba(255,255,255,.1);font-size:14px}
.t{font-weight:700}.sc{display:flex;gap:12px;font-variant-numeric:tabular-nums}
.sc b{color:${accent}}.sc span{color:#8fa6c9;font-weight:600}
.stage{position:relative}
canvas{display:block;width:100%;height:auto;background:#0a1020;touch-action:none}
#overlay{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;gap:6px;background:rgba(5,8,16,.8);text-align:center;padding:16px}
#overlay.show{display:flex}
#ovtitle{font-size:20px;font-weight:700}#ovsub{font-size:13px;color:#9fb4d8}
.ft{display:flex;gap:8px;padding:10px 12px 12px}
button{flex:1;padding:11px;border:0;border-radius:11px;background:${accent};color:#08111f;font-weight:800;font-size:15px}
input{flex:2;padding:11px;border-radius:11px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);color:#fff;font-size:15px;text-align:center}
.log{padding:0 14px 12px;font-size:12px;color:#9fb4d8;line-height:1.6}
</style></head><body>
<div class="card">
  <div class="hd">
    <div class="t">${spec.title}</div>
    <div class="sc"><span>score <b id="score">0</b></span><span>best <b id="best">0</b></span></div>
  </div>
  <div class="stage">
    <canvas id="c" width="480" height="320"></canvas>
    <div id="overlay"><div id="ovtitle"></div><div id="ovsub"></div></div>
  </div>
  ${pad}${guess}
</div>
<script>window.__GAME = ${JSON.stringify(spec)};</script>
<script>
${runtime}
</script>
</body></html>
`;
}

fs.mkdirSync(OUT, { recursive: true });
const manifest = { games: {} };
let built = 0;

for (const spec of GAMES) {
  const html = shell(spec);
  const file = spec.name + '.html';
  fs.writeFileSync(path.join(OUT, file), html);
  manifest.games[spec.name] = {
    file,
    title: spec.title,
    desc: spec.desc,
    ...(spec.alias ? { alias: spec.alias } : {}),
    generated: true
  };
  built += 1;
}

for (const [name, meta] of Object.entries(VENDORED)) {
  const file = path.join(OUT, meta.file);
  if (!fs.existsSync(file)) {
    console.warn('missing vendored payload:', meta.file);
    continue;
  }
  manifest.games[name] = { ...meta };
}

fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

// guardrails: self-contained, sane size, actually interactive
let bad = 0;
for (const [name, meta] of Object.entries(manifest.games)) {
  const text = fs.readFileSync(path.join(OUT, meta.file), 'utf8');
  if (/(?:src|href)\s*=\s*["']https?:\/\//i.test(text)) { console.error('external resource in', meta.file); bad += 1; }
  const size = Buffer.byteLength(text);
  if (size > 60000) { console.error('payload too large:', meta.file, size); bad += 1; }
  if (meta.generated && !/<canvas|<input/i.test(text)) { console.error('no interactive element in', meta.file); bad += 1; }
  if (meta.generated && !/<script>/.test(text)) { console.error('no script in', meta.file); bad += 1; }
}
if (bad) { console.error(bad + ' payload(s) failed validation'); process.exit(1); }

console.log('generated', built, 'payloads | manifest games:', Object.keys(manifest.games).length);
