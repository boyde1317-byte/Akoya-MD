/**
 * Text games that need nothing but WhatsApp itself.
 *
 * Every game is a plain function reachable through `global.games[name]`, called from
 * the command dispatcher in case.js before the big switch. State lives in memory per
 * chat and expires, so a restart simply drops half-played rounds instead of writing
 * junk into the database.
 */
const crypto = require('crypto');

const SESSION_TTL = 30 * 60 * 1000; // a stalled round disappears after half an hour
const sessions = new Map();

function key(name, chat) {
  return `${name}:${chat}`;
}

function get(name, chat) {
  const s = sessions.get(key(name, chat));
  if (!s) return null;
  if (Date.now() - s.touched > SESSION_TTL) {
    sessions.delete(key(name, chat));
    return null;
  }
  s.touched = Date.now();
  return s;
}

function put(name, chat, state) {
  state.touched = Date.now();
  sessions.set(key(name, chat), state);
  return state;
}

function drop(name, chat) {
  sessions.delete(key(name, chat));
}

function pick(n) {
  return crypto.randomInt(n);
}

// ─────────────────────────────── snake ───────────────────────────────

const SNAKE_W = 8;
const SNAKE_H = 8;
const DIRS = {
  up: { x: 0, y: -1 }, down: { x: 0, y: 1 },
  left: { x: -1, y: 0 }, right: { x: 1, y: 0 }
};
const DIR_ALIAS = {
  u: 'up', d: 'down', l: 'left', r: 'right',
  up: 'up', down: 'down', left: 'left', right: 'right',
  atas: 'up', bawah: 'down', kiri: 'left', kanan: 'right'
};

function snakeFood(body) {
  const taken = new Set(body.map(p => `${p.x},${p.y}`));
  const free = [];
  for (let y = 0; y < SNAKE_H; y++) {
    for (let x = 0; x < SNAKE_W; x++) {
      if (!taken.has(`${x},${y}`)) free.push({ x, y });
    }
  }
  return free.length ? free[pick(free.length)] : null;
}

function snakeBoard(state, skin) {
  const rows = [];
  const body = new Set(state.body.map((p, i) => `${p.x},${p.y}:${i}`));
  for (let y = 0; y < SNAKE_H; y++) {
    let row = '';
    for (let x = 0; x < SNAKE_W; x++) {
      const here = [...body].find(v => v.startsWith(`${x},${y}:`));
      if (this.food && this.food.x === x && this.food.y === y) row += '🍎';
      else if (here) row += here.endsWith(':0') ? skin.head : skin.body;
      else row += '⬛';
    }
    rows.push(row);
  }
  return rows.join('\n');
}

function snakeInfo(state) {
  return `*Snake* · score *${state.score}* · length *${state.body.length}*`;
}

const SNAKE_HINT = 'move with `.snake up|down|left|right` (short: `.snake u`), `.snake end` to stop.';

async function snakeStart(ctx, spawned) {
  const state = put('snake', ctx.m.chat, {
    body: [{ x: 3, y: 4 }, { x: 2, y: 4 }, { x: 1, y: 4 }],
    dir: 'right',
    score: 0,
    food: null,
    spawned: !!spawned
  });
  state.food = snakeFood(state.body);
  const skin = state.spawned
    ? { head: '🦊', body: '🟩' } // snake-rimba: the forest variant
    : { head: '🟢', body: '🟩' };
  await ctx.reply(`${snakeInfo(state)}\n\n${snakeBoard.call(state, state, skin)}\n\n${SNAKE_HINT}`);
}

async function snake(ctx) {
  const arg = String(ctx.text || '').trim().toLowerCase();
  const skin = ctx.command === 'snake-rimba' ? { head: '🦊', body: '🟩' } : { head: '🟢', body: '🟩' };
  let state = get('snake', ctx.m.chat);

  if (!state || arg === 'new' || arg === 'start' || arg === 'restart') {
    if (!state && !['', 'new', 'start', 'restart'].includes(arg)) {
      return ctx.reply(`No game running. Start one with \`.${ctx.command}\`.`);
    }
    return snakeStart(ctx, ctx.command === 'snake-rimba');
  }
  if (['end', 'stop', 'quit', 'exit'].includes(arg)) {
    drop('snake', ctx.m.chat);
    return ctx.reply(`Stopped. Final score *${state.score}*.`);
  }

  const wanted = DIR_ALIAS[arg];
  if (!wanted) return ctx.reply(SNAKE_HINT);

  const opposite = {
    up: 'down', down: 'up', left: 'right', right: 'left'
  };
  if (opposite[wanted] !== state.dir) state.dir = wanted;

  const step = DIRS[state.dir];
  const head = {
    x: state.body[0].x + step.x,
    y: state.body[0].y + step.y
  };

  const ate = state.food && head.x === state.food.x && head.y === state.food.y;
  const tail = state.body[state.body.length - 1];
  const willHitSelf = state.body.some((p, i) =>
    i < state.body.length - 1 && p.x === head.x && p.y === head.y
  );

  if (head.x < 0 || head.y < 0 || head.x >= SNAKE_W || head.y >= SNAKE_H || willHitSelf) {
    drop('snake', ctx.m.chat);
    return ctx.reply(`💀 Crashed. Final score *${state.score}* over ${state.body.length - 3} growth.\n\nStart again with \`.${ctx.command}\`.`);
  }

  state.body.unshift(head);
  if (ate) {
    state.score += 10;
    state.food = snakeFood(state.body);
    if (!state.food) {
      drop('snake', ctx.m.chat);
      return ctx.reply(`🏆 Board full. You win with *${state.score}*.`);
    }
  } else {
    state.body.pop();
    void tail;
  }

  return ctx.reply(`${snakeInfo(state)}\n\n${snakeBoard.call(state, state, skin)}\n\n${SNAKE_HINT}`);
}

// ─────────────────────────────── tic tac toe ───────────────────────────────

const TTT_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function tttWinner(b) {
  for (const [a, c, d] of TTT_LINES) {
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
  }
  return b.every(c => c) ? 'draw' : null;
}

function tttBoard(b) {
  const cell = (i) => b[i] === 'x' ? '❌' : b[i] === 'o' ? '⭕' : `*${i + 1}*`;
  return `${cell(0)} ${cell(1)} ${cell(2)}\n${cell(3)} ${cell(4)} ${cell(5)}\n${cell(6)} ${cell(7)} ${cell(8)}`;
}

function tttPerfect(b, me, them) {
  const result = tttWinner(b);
  if (result === me) return { score: 10 };
  if (result === them) return { score: -10 };
  if (result === 'draw') return { score: 0 };
  let best = { score: -Infinity };
  for (let i = 0; i < 9; i++) {
    if (b[i]) continue;
    b[i] = me;
    const { score } = tttPerfect(b, them, me);
    b[i] = null;
    if (-score > best.score) best = { score: -score, move: i };
  }
  return best;
}

async function ttt(ctx) {
  let state = get('ttt', ctx.m.chat);
  if (!state) {
    state = put('ttt', ctx.m.chat, { board: Array(9).fill(null), wins: 0, losses: 0 });
    return ctx.reply(`*Tic Tac Toe* · you are ❌, I am ⭕.\n\n${tttBoard(state.board)}\n\nSend \`.ttt 1\` to \`.ttt 9\` to place.`);
  }
  const move = parseInt(String(ctx.text || '').trim(), 10);
  if (!Number.isFinite(move) || move < 1 || move > 9) {
    return ctx.reply(`Pick a free square from 1 to 9.\n\n${tttBoard(state.board)}`);
  }
  const index = move - 1;
  if (state.board[index]) return ctx.reply(`Square ${move} is taken.\n\n${tttBoard(state.board)}`);

  state.board[index] = 'x';
  let outcome = tttWinner(state.board);
  let note = '';
  if (!outcome) {
    const { move: replyMove } = tttPerfect(state.board.slice(), 'o', 'x');
    if (replyMove !== undefined) state.board[replyMove] = 'o';
    outcome = tttWinner(state.board);
  }

  if (outcome === 'x') {
    state.wins += 1;
    note = `You win. Handy.`;
    drop('ttt', ctx.m.chat);
  } else if (outcome === 'o') {
    state.losses += 1;
    note = 'I win.';
    drop('ttt', ctx.m.chat);
  } else if (outcome === 'draw') {
    note = 'Draw.';
    drop('ttt', ctx.m.chat);
  }

  const score = state.wins !== undefined ? `\n\nYou *${state.wins}* · me *${state.losses}*` : '';
  const tail = note ? `${note}${score}\n\nNew round with \`.ttt\`.` : `Your move: \`.ttt 1-9\`.`;
  return ctx.reply(`${tttBoard(state.board)}\n\n${tail}`);
}

// ─────────────────────────────── guess the number ───────────────────────────────

async function tebakangka(ctx) {
  let state = get('tebakangka', ctx.m.chat);
  const arg = String(ctx.text || '').trim().toLowerCase();

  if (!state || ['new', 'start', 'restart', 'reset'].includes(arg)) {
    state = put('tebakangka', ctx.m.chat, {
      secret: 1 + pick(100),
      tries: 7,
      high: 100,
      low: 1
    });
    return ctx.reply(`🎲 *Guess the number* between 1 and 100. Seven tries.\n\nSend \`.guessnumber 42\`.`);
  }
  if (['end', 'stop', 'quit'].includes(arg)) {
    drop('tebakangka', ctx.m.chat);
    return ctx.reply(`Stopped. The number was *${state.secret}*.`);
  }

  const guess = parseInt(arg, 10);
  if (!Number.isFinite(guess)) return ctx.reply('Send a number: `.guessnumber 42`.');

  state.tries -= 1;
  if (guess === state.secret) {
    drop('tebakangka', ctx.m.chat);
    return ctx.reply(`✅ *${guess}* is it. You had ${state.tries} ${state.tries === 1 ? 'try' : 'tries'} left.\n\nAgain with \`.guessnumber\`.`);
  }
  if (state.tries <= 0) {
    drop('tebakangka', ctx.m.chat);
    return ctx.reply(`Out of tries. It was *${state.secret}*.\n\nAgain with \`.guessnumber\`.`);
  }

  if (guess < state.secret) state.low = Math.max(state.low, guess + 1);
  else state.high = Math.min(state.high, guess - 1);

  const arrow = guess < state.secret ? '⬆️ higher' : '⬇️ lower';
  return ctx.reply(`${arrow} than *${guess}*.\nRange *${state.low}-${state.high}* · ${state.tries} ${state.tries === 1 ? 'try' : 'tries'} left.`);
}

// ─────────────────────────────── sliding puzzle ───────────────────────────────

function puzzleRender(tiles) {
  const out = [];
  for (let r = 0; r < 3; r++) {
    const line = [];
    for (let c = 0; c < 3; c++) {
      const v = tiles[r * 3 + c];
      line.push(v === 0 ? '⬜' : `*${v}*`);
    }
    out.push(line.join(' '));
  }
  return out.join('\n');
}

function puzzleShuffle(tiles) {
  let blank = tiles.indexOf(0);
  for (let i = 0; i < 60; i++) {
    const r = Math.floor(blank / 3), c = blank % 3;
    const options = [];
    if (r > 0) options.push(blank - 3);
    if (r < 2) options.push(blank + 3);
    if (c > 0) options.push(blank - 1);
    if (c < 2) options.push(blank + 1);
    const pickIndex = options[pick(options.length)];
    [tiles[blank], tiles[pickIndex]] = [tiles[pickIndex], tiles[blank]];
    blank = pickIndex;
  }
  return tiles;
}

async function puzzle(ctx) {
  let state = get('puzzle', ctx.m.chat);
  const arg = String(ctx.text || '').trim().toLowerCase();

  if (!state || ['new', 'start', 'restart', 'reset'].includes(arg)) {
    const tiles = puzzleShuffle([1, 2, 3, 4, 5, 6, 7, 8, 0]);
    state = put('puzzle', ctx.m.chat, { tiles, moves: 0 });
    return ctx.reply(`🧩 *Slide puzzle* · put 1-8 in order, ⬜ is the gap.\n\n${puzzleRender(state.tiles)}\n\nSend \`.puzzle 5\` to slide tile 5 into the gap.`);
  }
  if (['end', 'stop', 'quit'].includes(arg)) {
    drop('puzzle', ctx.m.chat);
    return ctx.reply('Puzzle closed.');
  }

  const tile = parseInt(arg, 10);
  const at = state.tiles.indexOf(tile);
  if (!Number.isFinite(tile) || at === -1) return ctx.reply(`Tile ${arg} is not on the board.\n\n${puzzleRender(state.tiles)}`);

  const blank = state.tiles.indexOf(0);
  const adjacent = Math.abs(at - blank) === 3 ||
    (Math.abs(at - blank) === 1 && Math.floor(at / 3) === Math.floor(blank / 3));
  if (!adjacent) return ctx.reply(`Tile ${tile} cannot move into the gap.\n\n${puzzleRender(state.tiles)}`);

  state.tiles[blank] = tile;
  state.tiles[at] = 0;
  state.moves += 1;

  const solved = state.tiles.slice(0, 8).every((v, i) => v === i + 1) && state.tiles[8] === 0;
  if (solved) {
    drop('puzzle', ctx.m.chat);
    return ctx.reply(`🏆 Solved in *${state.moves}* moves.\n\nAgain with \`.puzzle\`.`);
  }
  return ctx.reply(`${puzzleRender(state.tiles)}\n\nMoves: *${state.moves}* · next \`.puzzle <tile>\`.`);
}

// ─────────────────────────────── memory match ───────────────────────────────

const MEM_EMOJI = ['🍇', '🍋', '🍑', '🥝', '🍒', '🥥', '🍍', '🫐'];

function memRender(state) {
  const rows = [];
  for (let r = 0; r < 4; r++) {
    const cells = [];
    for (let c = 0; c < 4; c++) {
      const i = r * 4 + c;
      const shown = state.matched.includes(i) || state.open.includes(i);
      cells.push(shown ? state.cards[i] : '❔');
    }
    rows.push(cells.join(''));
  }
  return rows.join('\n');
}

async function memory(ctx) {
  let state = get('memory', ctx.m.chat);
  const arg = String(ctx.text || '').trim().toLowerCase();

  if (!state || ['new', 'start', 'restart', 'reset'].includes(arg)) {
    const cards = [...MEM_EMOJI, ...MEM_EMOJI];
    for (let i = cards.length - 1; i > 0; i--) {
      const j = pick(i + 1);
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    state = put('memory', ctx.m.chat, { cards, open: [], matched: [], moves: 0 });
    return ctx.reply(`🃏 *Memory match* · 8 pairs behind 16 cards.\n\n${memRender(state)}\n\nSend \`.memory 5\` to flip card 5.`);
  }
  if (['end', 'stop', 'quit'].includes(arg)) {
    drop('memory', ctx.m.chat);
    return ctx.reply('Board closed.');
  }

  const n = parseInt(arg, 10);
  if (!Number.isFinite(n) || n < 1 || n > 16) return ctx.reply(`Card numbers run 1-16.\n\n${memRender(state)}`);
  const i = n - 1;
  if (state.matched.includes(i)) return ctx.reply(`Card ${n} is already matched.\n\n${memRender(state)}`);
  if (state.open.includes(i)) return ctx.reply(`Card ${n} is already face up.\n\n${memRender(state)}`);

  if (state.open.length === 0) {
    state.open = [i];
    return ctx.reply(`${memRender(state)}\n\nSecond card: \`.memory <1-16>\`.`);
  }

  state.open.push(i);
  state.moves += 1;
  const [a, b] = state.open;
  if (state.cards[a] === state.cards[b]) {
    state.matched.push(a, b);
    state.open = [];
    if (state.matched.length === 16) {
      drop('memory', ctx.m.chat);
      return ctx.reply(`${memRender(state)}\n\n🏆 All matched in *${state.moves}* moves.\n\nAgain with \`.memory\`.`);
    }
    return ctx.reply(`${memRender(state)}\n\n✅ Pair found · ${state.matched.length / 2}/8 · \`.memory <1-16>\`.`);
  }

  const miss = `❌ ${state.cards[a]} and ${state.cards[b]} do not match.`;
  state.open = [];
  return ctx.reply(`${memRender(state)}\n\n${miss} · ${state.matched.length / 2}/8 pairs · \`.memory <1-16>\`.`);
}

// ─────────────────────────────── tetris-lite ───────────────────────────────

const TETRIS_W = 8;
const TETRIS_H = 10;
const PIECES = {
  I: [[0, 0], [1, 0], [2, 0], [3, 0]],
  O: [[0, 0], [1, 0], [0, 1], [1, 1]],
  T: [[0, 0], [1, 0], [2, 0], [1, 1]],
  L: [[0, 0], [1, 0], [2, 0], [2, 1]],
  S: [[1, 0], [2, 0], [0, 1], [1, 1]]
};
const PIECE_KEYS = Object.keys(PIECES);

function tetrisSpawn(state) {
  const name = state.next || PIECE_KEYS[pick(PIECE_KEYS.length)];
  state.next = PIECE_KEYS[pick(PIECE_KEYS.length)];
  state.piece = PIECES[name].map(([x, y]) => ({ x: x + 2, y }));
  state.rot = 0;
}

function tetrisFits(board, cells) {
  return cells.every(({ x, y }) =>
    x >= 0 && x < TETRIS_W && y < TETRIS_H &&
    (y < 0 || !board[y][x])
  );
}

function tetrisRender(state) {
  const grid = state.board.map(row => row.slice());
  for (const { x, y } of state.piece) {
    if (y >= 0 && y < TETRIS_H) grid[y][x] = 1;
  }
  const rows = grid.map(row => row.map(v => v ? '🟦' : '⬛').join(''));
  return rows.join('\n');
}

function tetrisLock(state) {
  for (const { x, y } of state.piece) {
    if (y >= 0) state.board[y][x] = 1;
  }
  let cleared = 0;
  state.board = state.board.filter(row => {
    if (row.every(Boolean)) {
      cleared += 1;
      return false;
    }
    return true;
  });
  while (state.board.length < TETRIS_H) state.board.unshift(Array(TETRIS_W).fill(0));
  if (cleared) {
    state.score += [0, 100, 300, 500, 800][cleared];
    state.lines += cleared;
  } else {
    state.score += 10;
  }
}

function tetrisGravity(state) {
  const moved = state.piece.map(({ x, y }) => ({ x, y: y + 1 }));
  if (tetrisFits(state.board, moved)) {
    state.piece = moved;
    return true;
  }
  return false;
}

async function tetris(ctx) {
  let state = get('tetris', ctx.m.chat);
  const arg = String(ctx.text || '').trim().toLowerCase();

  if (!state || ['new', 'start', 'restart', 'reset'].includes(arg)) {
    state = put('tetris', ctx.m.chat, {
      board: Array.from({ length: TETRIS_H }, () => Array(TETRIS_W).fill(0)),
      piece: [],
      next: null,
      score: 0,
      lines: 0
    });
    tetrisSpawn(state);
    return ctx.reply(`🟦 *Tetris* · fill a row to clear it.\n\n${tetrisRender(state)}\n\n`.concat(
      '`.tetris left` · `.tetris right` · `.tetris rotate` · `.tetris drop` — a piece also falls one row on every move.'
    ));
  }
  if (['end', 'stop', 'quit'].includes(arg)) {
    drop('tetris', ctx.m.chat);
    return ctx.reply(`Tetris over. Score *${state.score}* over ${state.lines} lines.`);
  }

  let note = '';
  if (arg === 'left' || arg === 'right') {
    const dx = arg === 'left' ? -1 : 1;
    const moved = state.piece.map(({ x, y }) => ({ x: x + dx, y }));
    if (tetrisFits(state.board, moved)) state.piece = moved;
    else note = 'Edge.';
  } else if (arg === 'rotate' || arg === 'r') {
    const cx = Math.min(...state.piece.map(p => p.x));
    const cy = Math.min(...state.piece.map(p => p.y));
    const rotated = state.piece.map(({ x, y }) => ({
      x: cx + (y - cy),
      y: cy - (x - cx)
    }));
    const shifted = rotated.map(({ x, y }) => ({ x: Math.max(0, Math.min(TETRIS_W - 1, x)), y }));
    if (tetrisFits(state.board, shifted)) state.piece = shifted;
    else note = 'No room to rotate.';
  } else if (arg === 'drop' || arg === 'd') {
    while (tetrisGravity(state)) { /* fall to the floor */ }
    note = 'Dropped.';
  } else if (arg) {
    return ctx.reply('`.tetris left|right|rotate|drop`');
  }

  if (!tetrisGravity(state)) {
    tetrisLock(state);
    tetrisSpawn(state);
    if (!tetrisFits(state.board, state.piece)) {
      drop('tetris', ctx.m.chat);
      return ctx.reply(`💀 Stack overflow. Score *${state.score}* over ${state.lines} lines.\n\nAgain with \`.tetris\`.`);
    }
    note = note || 'Piece landed.';
  }

  return ctx.reply(`*Tetris* · score *${state.score}* · lines *${state.lines}*${note ? ` · ${note}` : ''}\n\n${tetrisRender(state)}\n\n`.concat(
    '`.tetris left|right|rotate|drop`'
  ));
}

// ─────────────────────────────── flappy ───────────────────────────────

const FLAPPY_H = 7;
const FLAPPY_LEN = 14;

function flappyRender(state) {
  const rows = [];
  for (let y = 0; y < FLAPPY_H; y++) {
    let row = '';
    for (let x = 0; x < FLAPPY_LEN; x++) {
      const wall = state.gates[x];
      if (x === 0 && state.bird === y) row += '🐤';
      else if (wall !== undefined && wall !== null && (y < wall || y >= wall + 3)) row += '🟥';
      else row += '⬛';
    }
    rows.push(row);
  }
  return rows.join('\n');
}

function flappyNew(ctx) {
  const gates = Array.from({ length: FLAPPY_LEN }, () => 1 + pick(FLAPPY_H - 3));
  put('flappy', ctx.m.chat, { bird: 3, gates, score: 0, tick: 0 });
  return get('flappy', ctx.m.chat);
}

function flappyTick(state) {
  state.tick += 1;
  state.bird += state.flap ? -2 : 1;
  state.flap = false;
  for (let i = 1; i < FLAPPY_LEN; i++) state.gates[i - 1] = state.gates[i];
  state.gates[FLAPPY_LEN - 1] = state.tick % 2 === 0 ? 1 + pick(FLAPPY_H - 3) : null;
  if (state.tick % 3 === 0) state.score += 1;
}

async function flappy(ctx) {
  let state = get('flappy', ctx.m.chat);
  const arg = String(ctx.text || '').trim().toLowerCase();

  if (!state || ['new', 'start', 'restart', 'reset'].includes(arg)) {
    state = flappyNew(ctx);
    return ctx.reply(`🐤 *Flappy* · keep the bird inside the gap.\n\n${flappyRender(state)}\n\nSend \`.flappy go\` to flap.`);
  }
  if (['end', 'stop', 'quit'].includes(arg)) {
    drop('flappy', ctx.m.chat);
    return ctx.reply(`Flappy over. Score *${state.score}*.`);
  }

  state.flap = true;
  flappyTick(state);

  const gate = state.gates[0];
  const hitWall = gate !== undefined && gate !== null && (state.bird < gate || state.bird >= gate + 3);
  const outOfBounds = state.bird < 0 || state.bird >= FLAPPY_H;
  if (hitWall || outOfBounds) {
    drop('flappy', ctx.m.chat);
    return ctx.reply(`💥 Down. Score *${state.score}*.\n\nAgain with \`.flappy\`.`);
  }

  return ctx.reply(`${flappyRender(state)}\n\nScore *${state.score}* · \`.flappy go\``);
}

module.exports = {
  snake,
  'snake-rimba': snake,
  ttt,
  tebakangka,
  puzzle,
  memory: memory,
  'memory-match': memory,
  tetris,
  flappy,
  _sessions: sessions
};
