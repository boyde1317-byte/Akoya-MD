#!/usr/bin/env node
/**
 * Fail the build if the menu advertises something the bot cannot answer.
 *
 * This is the drift check for the bug that started all this: 35 commands were listed in
 * the menus while case.js had no code for them, so `.snake` disappeared without a word.
 * A menu entry must resolve to a switch case, an HTML game payload, or a text game.
 *
 *   node tools/check-menu.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const menuSource = fs.readFileSync(path.join(ROOT, 'source', 'listfitur.js'), 'utf8');
const caseSource = fs.readFileSync(path.join(ROOT, 'case.js'), 'utf8');

// English command names mapped onto the handler that answers them
const { ALIASES, resolveCommand } = require(path.join(ROOT, 'source', 'cmdalias.js'));

// commands the switch answers
const cases = new Set();
{
  const re = /case\s+['"]([^'"]+)['"]\s*:/g;
  let m;
  while ((m = re.exec(caseSource))) cases.add(m[1].toLowerCase());
}

// commands an HTML card answers
const htmlGames = new Set();
try {
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets', 'htmlgames', 'manifest.json'), 'utf8'));
  for (const [name, meta] of Object.entries(manifest.games || {})) {
    htmlGames.add(name.toLowerCase());
    if (meta.alias) htmlGames.add(meta.alias.toLowerCase());
  }
} catch (_) {}

// commands the HTML card module registers (names + aliases + list commands)
try {
  const lib = require(path.join(ROOT, 'library', 'htmlgames.js'));
  for (const key of Object.keys(lib.commands || {})) htmlGames.add(key.toLowerCase());
} catch (_) {}

// commands the text game module answers
const textGames = new Set();
try {
  const games = require(path.join(ROOT, 'library', 'games.js'));
  for (const key of Object.keys(games)) textGames.add(key.toLowerCase());
} catch (_) {}

// menu lines: │ ├─ ${prefix}name
const advertised = new Map();
const lineRe = /[│|]\s*[├└]\S*\s*\$\{prefix\}([a-z0-9@._-]+)\s*$/gim;
let match;
while ((match = lineRe.exec(menuSource))) {
  const name = match[1].toLowerCase();
  if (!name || name.includes('${')) continue;
  advertised.set(name, (advertised.get(name) || 0) + 1);
}

const answers = name => cases.has(name) || htmlGames.has(name) || textGames.has(name);

const missing = [];
for (const [name] of advertised) {
  // A menu advertises either the handler itself or its English alias.
  if (answers(name) || answers(resolveCommand(name))) continue;
  missing.push(name);
}

// An alias that points at nothing is the same bug from the other side: the menu
// would advertise a word that resolves to a handler nobody wrote.
const deadAliases = Object.entries(ALIASES)
  .filter(([, target]) => !answers(target))
  .map(([alias, target]) => `${alias} -> ${target}`);

// Two English names for one handler is fine; an English name that shadows a
// different handler is not, because the alias would win silently.
const shadowed = Object.keys(ALIASES)
  .filter(alias => answers(alias) && resolveCommand(alias) !== alias)
  .map(alias => `${alias} shadows the existing ${alias} handler`);

console.log('menu entries:', advertised.size, '| cases:', cases.size, '| html cards:', htmlGames.size, '| text games:', textGames.size, '| aliases:', Object.keys(ALIASES).length);
let failed = false;
if (missing.length) {
  console.error('advertised but unhandled:', missing.join(', '));
  failed = true;
}
if (deadAliases.length) {
  console.error('alias points at a missing handler:', deadAliases.join(', '));
  failed = true;
}
if (shadowed.length) {
  console.error('alias shadowed by an existing handler:', shadowed.join(', '));
  failed = true;
}
if (failed) process.exit(1);
console.log('every advertised command resolves');
