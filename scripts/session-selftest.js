#!/usr/bin/env node
/**
 * Provider-free test of the session persistence rules.
 *
 * The bug being guarded: a linked WhatsApp session must survive a redeploy. That
 * means boot must reuse stored creds, an unfinished pairing must be moved aside
 * (never deleted), a torn creds.json must come back from the backup, and the
 * moment the socket opens the handshake must be frozen to disk.
 *
 *   node scripts/session-selftest.js
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('assert');

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'akoya-session-'));
process.env.SESSION_SELFTEST = '1';
process.env.PORT = '0';
process.env.SESSION_DIR = path.join(root, 'session');
fs.mkdirSync(process.env.SESSION_DIR, { recursive: true });

const session = require('../index.js');
const dir = () => process.env.SESSION_DIR;
const write = (name, value) => fs.writeFileSync(path.join(dir(), name), JSON.stringify(value, null, 2));
const read = name => JSON.parse(fs.readFileSync(path.join(dir(), name), 'utf8'));
const exists = name => fs.existsSync(path.join(dir(), name));

const creds = extra => ({
  noiseKey: { private: 'x', public: 'y' },
  signedIdentityKey: { private: 'x', public: 'y' },
  registrationId: 1234,
  ...extra
});

const quarantined = () => fs.readdirSync(root).filter(n => n.startsWith('session.unpaired-'));

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

function reset() {
  session.resetSessionCache(); // the real bot prepares once per process
  for (const entry of fs.readdirSync(root)) {
    fs.rmSync(path.join(root, entry), { recursive: true, force: true });
  }
  fs.mkdirSync(dir(), { recursive: true });
}

test('first boot with nothing on the volume asks for a pairing', async () => {
  reset();
  const result = await session.prepareSession();
  assert.strictEqual(result.linked, false);
  assert.strictEqual(exists('creds.json'), false);
});

test('a linked session is reused instead of re-pairing', async () => {
  reset();
  write('creds.json', creds({ registered: true, me: { id: '233533416608:7@s.whatsapp.net' } }));
  const result = await session.prepareSession();
  assert.strictEqual(result.linked, true);
  assert.strictEqual(quarantined().length, 0, 'nothing may be moved aside');
  assert.ok(exists('creds.json'), 'creds must still be there');
});

test('a session opened before registered was set is still reused', async () => {
  reset();
  write('creds.json', creds({ registered: false }));
  write('.linked', { jid: '233533416608:7@s.whatsapp.net', linkedAt: new Date().toISOString() });
  const result = await session.prepareSession();
  assert.strictEqual(result.linked, true, 'the link marker proves it was paired');
  assert.strictEqual(quarantined().length, 0);
});

test('an unfinished pairing is moved aside, never deleted', async () => {
  reset();
  write('creds.json', creds({ registered: false }));
  const result = await session.prepareSession();
  assert.strictEqual(result.linked, false);
  assert.strictEqual(quarantined().length, 1, 'the old folder must survive for inspection');
  assert.strictEqual(exists('creds.json'), false, 'the live folder starts clean');
});

test('a torn creds.json comes back from the backup', async () => {
  reset();
  const good = creds({ registered: true, me: { id: '233533416608:7@s.whatsapp.net' } });
  fs.writeFileSync(path.join(dir(), 'creds.json.bak'), JSON.stringify(good));
  fs.writeFileSync(path.join(dir(), 'creds.json'), '{"noiseKey": {"priva');
  const result = await session.prepareSession();
  assert.strictEqual(result.linked, true, 'restored creds must count as linked');
  assert.deepStrictEqual(read('creds.json'), good);
});

test('opening the socket freezes the handshake to disk', async () => {
  reset();
  write('creds.json', creds({ registered: false }));
  const client = {
    user: { id: '233533416608:7@s.whatsapp.net', name: 'Akoya' },
    authState: { creds: creds({ registered: false }) }
  };
  await session.markSessionLinked(client);
  assert.strictEqual(read('creds.json').registered, true, 'registered must land on disk');
  assert.ok(exists('creds.json.bak'), 'a backup copy must exist');
  assert.strictEqual(read('.linked').jid, '233533416608:7@s.whatsapp.net');
  const info = await session.sessionState();
  assert.strictEqual(info.registered, true);
  assert.strictEqual(info.backup, true);
});

(async () => {
  let failed = 0;
  for (const { name, fn } of tests) {
    try {
      await fn();
      console.log(`  ok  ${name}`);
    } catch (error) {
      failed += 1;
      console.log(`  FAIL ${name}`);
      console.log(`       ${error.message}`);
    }
  }
  fs.rmSync(root, { recursive: true, force: true });
  console.log(`\n${tests.length - failed}/${tests.length} passed`);
  process.exit(failed ? 1 : 0);
})();
