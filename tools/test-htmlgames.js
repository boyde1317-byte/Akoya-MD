#!/usr/bin/env node
/**
 * Run every generated game headlessly: real runtime source, stubbed DOM/canvas, a few
 * hundred frames, plus a tap. Catches crashes and dead mechanics without a phone.
 *
 *   node tools/test-htmlgames.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const OUT = path.join(__dirname, '..', 'assets', 'htmlgames');
const runtimeSrc = fs.readFileSync(path.join(__dirname, 'games', 'runtime.js'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(OUT, 'manifest.json'), 'utf8'));

function ctxStub() {
  const noop = () => {};
  const gradient = { addColorStop: noop };
  return new Proxy({}, {
    get(_, key) {
      if (key === 'createLinearGradient') return () => gradient;
      if (key === 'measureText') return () => ({ width: 10 });
      if (key === 'canvas') return { width: 480, height: 320 };
      return noop;
    },
    set() { return true; }
  });
}

function makeEl(id, log) {
  const el = {
    id,
    style: {},
    dataset: {},
    textContent: '',
    innerHTML: '',
    value: '',
    width: 480,
    height: 320,
    classList: { add: () => {}, remove: () => {} },
    addEventListener: (type, fn) => { el._handlers = el._handlers || {}; el._handlers[type] = fn; },
    getContext: () => ctxStub(),
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 480, height: 320 }),
    closest: () => null,
    onclick: null
  };
  return el;
}

function runGame(name, meta) {
  const html = fs.readFileSync(path.join(OUT, meta.file), 'utf8');
  const cfgMatch = html.match(/window\.__GAME = (\{.*?\});/s);
  if (!cfgMatch) throw new Error('no config in ' + meta.file);
  const cfg = JSON.parse(cfgMatch[1]);

  const log = [];
  const els = {};
  const canvas = makeEl('c', log);
  els.c = canvas;

  const rafQueue = [];
  const documentStub = {
    getElementById: (id) => {
      if (!els[id]) els[id] = makeEl(id, log);
      return els[id];
    },
    addEventListener: () => {},
    body: makeEl('body', log)
  };
  const sandbox = {
    window: { __GAME: cfg },
    document: documentStub,
    localStorage: { getItem: () => '0', setItem: () => {}, removeItem: () => {} },
    requestAnimationFrame: (fn) => { rafQueue.push(fn); return rafQueue.length; },
    setTimeout: (fn) => { try { fn(); } catch (e) { throw e; } return 0; },
    console,
    Math,
    Date,
    JSON,
    isFinite,
    parseInt,
    parseFloat,
    String,
    Number,
    Array,
    Object,
    Boolean,
    Error
  };
  sandbox.window.requestAnimationFrame = sandbox.requestAnimationFrame;
  sandbox.globalThis = sandbox;

  const errors = [];
  vm.createContext(sandbox);
  try {
    vm.runInContext(runtimeSrc, sandbox, { filename: name + '.js' });
  } catch (e) {
    return { name, ok: false, error: 'init: ' + e.message };
  }

  // drive frames
  let ts = 0;
  for (let i = 0; i < 240; i++) {
    const fn = rafQueue.shift();
    if (!fn) { errors.push('loop stopped at frame ' + i); break; }
    ts += 16.7;
    try { fn(ts); } catch (e) { errors.push('frame ' + i + ': ' + e.message); break; }
  }

  // poke it: pointer + key handlers if the runtime bound any
  const tapAt = (x, y) => {
    try {
      const ev = (cx, cy) => ({
        preventDefault() {}, clientX: cx, clientY: cy, touches: [{ clientX: cx, clientY: cy }],
        changedTouches: [{ clientX: cx, clientY: cy }]
      });
      if (canvas._handlers && canvas._handlers.touchstart) {
        canvas._handlers.touchstart(ev(x, y));
        canvas._handlers.touchend(ev(x, y));
      } else if (canvas._handlers && canvas._handlers.mousedown) {
        canvas._handlers.mousedown(ev(x, y));
        canvas._handlers.mouseup(ev(x, y));
      }
    } catch (e) { errors.push('tap: ' + e.message); }
  };
  tapAt(240, 160);
  for (let i = 0; i < 90; i++) {
    const fn = rafQueue.shift();
    if (!fn) break;
    ts += 16.7;
    try { fn(ts); } catch (e) { errors.push('post-tap frame: ' + e.message); break; }
  }

  const hud = els.score ? String(els.score.textContent) : '';
  return { name, ok: !errors.length, error: errors[0] || null, hud, mech: cfg.mech };
}

let failures = 0;
for (const [name, meta] of Object.entries(manifest.games)) {
  if (!meta.generated) continue;
  const res = runGame(name, meta);
  if (res.ok) {
    console.log('  ok  ' + name.padEnd(14) + res.mech.padEnd(8) + 'hud=' + (res.hud || '-'));
  } else {
    failures += 1;
    console.log('FAIL  ' + name.padEnd(14) + res.error);
  }
}
console.log(failures ? failures + ' game(s) failed' : 'all generated games ran');
process.exit(failures ? 1 : 0);
