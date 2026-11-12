/**
 * English command names.
 *
 * The handlers in case.js (and the game registries) were written around
 * Indonesian trigger words: `.cuaca`, `.cekgempa`, `.kucing`. Every other piece
 * of copy is English, so the menus now advertise the English name and this file
 * maps it onto the handler that already exists.
 *
 * The Indonesian original is NOT removed. It keeps answering exactly as before,
 * so nobody's saved habit breaks and no case label had to be rewritten. The
 * lookup happens after parsing, which means the usage examples inside a handler
 * still echo the word the user actually typed.
 */

// English name -> the handler name the switch or a game registry already answers.
const ALIASES = {
  // --- search and information ---
  weather: 'cuaca',
  earthquake: 'cekgempa',
  calendar: 'cekkalender',
  distance: 'jarak',
  checkbio: 'cekbio',
  checkbio2: 'cekbio2',
  checkbio3: 'cekbio3',
  checkwa: 'cekwa',
  checkchannel: 'cekidch',
  khodam: 'cekkhodam',

  // --- random and fun ---
  // `.cat` needs no entry here: the switch already answers it next to `.kucing`.
  prettygirl: 'cecan',
  handsomeguy: 'cogan',
  randompic: 'pap',
  soulmate: 'jodoh',
  insanity: 'cekgila',
  checkhandsome: 'cekganteng',
  motivation: 'motivasi',

  // --- image filters ---
  cinematic: 'cine',
  blacken: 'hitamin',
  toblack: 'tohitam',

  // --- makers ---
  fakegroup: 'fakegrup',
  fakeid: 'fakektp',
  fakechoose: 'fakepilih',
  fakechat: 'pakeko',
  fakemovie: 'fakemovi',
  fakemovie2: 'fakemovi2',
  fakemovie3: 'fakemovi3',
  fakemovie4: 'fakemovi4',
  certificate: 'serfikat',

  // --- group ---
  groupid: 'idgc',
  coup: 'kudeta',

  // --- broadcast ---
  broadcast: 'jpm',
  broadcast2: 'jpm2',
  broadcast3: 'jpm3',

  // --- store ---
  balance: 'ceksaldo',
  orderservice: 'pesantt',

  // --- owner and tools ---
  rawjson: 'ambilq',
  addseller: 'babu',
  cleanbot: 'bersihbot',
  process: 'proses',
  totalfeatures: 'totalfitur',

  // --- download and games ---
  tiktokphoto: 'ttphoto',
  guessnumber: 'tebakangka',
  guessbomb: 'tebakbom',
  slots: 'slot777',

  // --- jadibot ---
  canceljadibot: 'bataljadibot'
};

/**
 * Resolve whatever the user typed to the handler name.
 * Anything that is not in the table comes back untouched, so every existing
 * command behaves the way it always has.
 */
function resolveCommand(command) {
  const name = String(command || '').toLowerCase().trim();
  if (!name) return '';
  return ALIASES[name] || name;
}

module.exports = {
  ALIASES,
  resolveCommand
};
