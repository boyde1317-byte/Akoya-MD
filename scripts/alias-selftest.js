#!/usr/bin/env node
/**
 * Prove the English command names actually land on a handler.
 *
 * check-menu.js proves the menus are honest; this proves the table behind them is.
 * Run it before a release:
 *
 *   node scripts/alias-selftest.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const { ALIASES, resolveCommand } = require(path.join(ROOT, 'source', 'cmdalias.js'));

const caseSource = fs.readFileSync(path.join(ROOT, 'case.js'), 'utf8');
const cases = new Set();
{
  const re = /case\s+['"]([^'"]+)['"]\s*:/g;
  let m;
  while ((m = re.exec(caseSource))) cases.add(m[1].toLowerCase());
}

const games = new Set();
try {
  const textGames = require(path.join(ROOT, 'library', 'games.js'));
  for (const key of Object.keys(textGames)) games.add(key.toLowerCase());
} catch (_) {}
try {
  const lib = require(path.join(ROOT, 'library', 'htmlgames.js'));
  for (const key of Object.keys(lib.commands || {})) games.add(key.toLowerCase());
} catch (_) {}

const answers = name => cases.has(name) || games.has(name);

let failures = 0;
const fail = message => {
  failures += 1;
  console.error(`  ✗ ${message}`);
};

// 1. every English name reaches something real
for (const [alias, target] of Object.entries(ALIASES)) {
  if (!answers(target)) fail(`${alias} -> ${target}, but nothing answers ${target}`);
  if (resolveCommand(alias) !== target) fail(`${alias} does not resolve to ${target}`);
}

// 2. an English name must not quietly take over a different handler
for (const alias of Object.keys(ALIASES)) {
  const canonical = resolveCommand(alias);
  if (canonical !== alias && cases.has(alias) && !cases.has(canonical)) {
    fail(`${alias} shadows an existing case`);
  }
}

// 3. untouched words must pass straight through
for (const name of ['menu', 'allmenu', 'ping', 'snake', 'definitely-not-a-command']) {
  if (resolveCommand(name) !== name) fail(`${name} was rewritten to ${resolveCommand(name)}`);
}

// 4. resolving twice must not wander (English -> handler -> handler)
for (const alias of Object.keys(ALIASES)) {
  const once = resolveCommand(alias);
  const twice = resolveCommand(once);
  if (once !== twice) fail(`${alias} resolves to ${once}, then to ${twice}`);
}

// 5. the pairs people actually type
const pairs = [
  ['weather', 'cuaca'],
  ['earthquake', 'cekgempa'],
  ['cat', 'cat'],
  ['soulmate', 'jodoh'],
  ['guessnumber', 'tebakangka'],
  ['broadcast', 'jpm'],
  ['balance', 'ceksaldo'],
  ['rawjson', 'ambilq']
];
for (const [typed, handler] of pairs) {
  if (resolveCommand(typed) !== handler) fail(`${typed} should dispatch as ${handler}, got ${resolveCommand(typed)}`);
}

if (failures) {
  console.error(`\n${failures} alias problem(s)`);
  process.exit(1);
}
console.log(`${Object.keys(ALIASES).length} English names resolve to a live handler`);
