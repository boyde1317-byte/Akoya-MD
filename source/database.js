require('../settings');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// JSON-file database only. A Mongo branch used to sit behind
// /mongo/.test("database.json"), a test on a hardcoded literal that can
// never match, so it was dead code dragging in mongoose. If Mongo support
// is ever wanted, it needs a real switch (an env var), not a literal test.
class DataBase {
  constructor() {
    this.data = {};
    this.file = path.join(process.cwd(), 'library/database', 'database.json');
    this.writePromise = Promise.resolve();
  }
  read = async () => {
    try {
      await fs.promises.mkdir(path.dirname(this.file), {
        recursive: true
      });
      const raw = await fs.promises.readFile(this.file, 'utf8').catch(() => null);
      if (!raw) {
        this.data = {};
        await fs.promises.writeFile(this.file, JSON.stringify(this.data, null, 2), 'utf8');
        return this.data;
      }
      this.data = JSON.parse(raw);
      return this.data;
    } catch (error) {
      console.error('[DATABASE READ]', error);
      return this.data || {};
    }
  };
  write = async data => {
    this.data = data || global.db || this.data || {};
    const payload = JSON.stringify(this.data, null, 2);
    const file = this.file;
    this.writePromise = this.writePromise.catch(() => {}).then(async () => {
      await fs.promises.mkdir(path.dirname(file), {
        recursive: true
      });
      const tmp = `${file}.tmp`;
      await fs.promises.writeFile(tmp, payload, 'utf8');
      await fs.promises.rename(tmp, file);
    });
    return this.writePromise;
  };
}
module.exports = DataBase;
