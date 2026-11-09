/// ───────── [ Shared In-Memory Store ] ───────── ///
/// Baileys 7 dropped makeInMemoryStore. This module keeps a small compatible
/// store so the main bot and jadibot sessions share one implementation.
class CompatMessageList {
  constructor(limit = 300) {
    this.limit = limit;
    this.array = [];
    this.map = new Map();
  }
  get(id) {
    return this.map.get(id);
  }
  all() {
    return this.array;
  }
  upsert(msg) {
    const id = msg?.key?.id;
    if (!id) return;
    const old = this.map.get(id);
    if (old) {
      Object.assign(old, msg);
      return;
    }
    this.array.push(msg);
    this.map.set(id, msg);
    while (this.array.length > this.limit) {
      const removed = this.array.shift();
      if (removed?.key?.id) this.map.delete(removed.key.id);
    }
  }
  remove(id) {
    const msg = this.map.get(id);
    if (!msg) return false;
    this.map.delete(id);
    const i = this.array.indexOf(msg);
    if (i >= 0) this.array.splice(i, 1);
    return true;
  }
  clear() {
    this.array = [];
    this.map.clear();
  }
  toJSON() {
    return this.array;
  }
}
function createCompatStore() {
  const store = {
    chats: {},
    contacts: {},
    messages: {},
    groupMetadata: {},
    presences: {},
    state: {
      connection: 'close'
    }
  };
  const mergeInto = (target, id, data) => {
    if (!id) return;
    target[id] = Object.assign(target[id] || {}, data);
  };
  const pushMessage = msg => {
    const jid = msg?.key?.remoteJid;
    if (!jid || !msg?.key?.id) return;
    if (!store.messages[jid]) store.messages[jid] = new CompatMessageList();
    store.messages[jid].upsert(msg);
  };
  store.bind = ev => {
    ev.on('connection.update', update => Object.assign(store.state, update));
    ev.on('messaging-history.set', ({
      chats = [],
      contacts = [],
      messages = []
    }) => {
      for (const c of chats) mergeInto(store.chats, c.id, c);
      for (const c of contacts) mergeInto(store.contacts, c.id, c);
      for (const m of messages) pushMessage(m);
    });
    ev.on('contacts.upsert', list => {
      for (const c of list) mergeInto(store.contacts, c.id, c);
    });
    ev.on('contacts.update', list => {
      for (const c of list) mergeInto(store.contacts, c.id, c);
    });
    ev.on('chats.upsert', list => {
      for (const c of list) mergeInto(store.chats, c.id, c);
    });
    ev.on('chats.update', list => {
      for (const c of list) mergeInto(store.chats, c.id, c);
    });
    ev.on('chats.delete', ids => {
      for (const id of ids) delete store.chats[id];
    });
    ev.on('messages.upsert', ({
      messages = []
    }) => {
      for (const m of messages) pushMessage(m);
    });
    ev.on('messages.update', updates => {
      for (const {
        key,
        update
      } of updates) {
        const msg = key && store.messages[key.remoteJid]?.get(key.id);
        if (msg) Object.assign(msg, update);
      }
    });
    ev.on('messages.delete', item => {
      if (item.all) {
        if (store.messages[item.jid]) store.messages[item.jid].clear();
      } else {
        for (const key of item.keys || []) store.messages[key.remoteJid]?.remove(key.id);
      }
    });
    ev.on('groups.upsert', list => {
      for (const g of list) store.groupMetadata[g.id] = g;
    });
    ev.on('groups.update', list => {
      for (const g of list) mergeInto(store.groupMetadata, g.id, g);
    });
    ev.on('group-participants.update', ({
      id,
      participants,
      action
    }) => {
      const meta = store.groupMetadata[id];
      if (!meta || !Array.isArray(meta.participants)) return;
      const list = participants.map(p => typeof p === 'string' ? p : p.id);
      if (action === 'add') {
        for (const jid of list) if (!meta.participants.some(p => p.id === jid)) meta.participants.push({
          id: jid
        });
      } else if (action === 'remove') {
        meta.participants = meta.participants.filter(p => !list.includes(p.id));
      } else if (action === 'promote' || action === 'demote') {
        for (const p of meta.participants) if (list.includes(p.id)) p.admin = action === 'promote' ? 'admin' : null;
      }
    });
    ev.on('presence.update', ({
      id,
      presences
    }) => {
      store.presences[id] = Object.assign(store.presences[id] || {}, presences);
    });
  };
  store.loadMessage = async (jid, id) => store.messages[jid]?.get(id) || undefined;
  store.loadMessages = async (jid, count) => (store.messages[jid]?.array || []).slice(-count);
  store.mostRecentMessage = async jid => (store.messages[jid]?.array || []).slice(-1)[0];
  store.fetchGroupMetadata = async (jid, sock) => {
    if (!store.groupMetadata[jid] && sock) store.groupMetadata[jid] = await sock.groupMetadata(jid);
    return store.groupMetadata[jid];
  };
  store.fetchMessageInfo = async () => undefined;
  store.fetchImageUrl = async (jid, sock) => {
    try {
      return await sock.profilePictureUrl(jid);
    } catch {
      return undefined;
    }
  };
  store.toJSON = () => ({
    chats: store.chats,
    contacts: store.contacts,
    messages: store.messages
  });
  store.writeToFile = () => {};
  store.readFromFile = () => {};
  return store;
}

const buildStore = opts => typeof require('@adiwajshing/baileys').makeInMemoryStore === 'function'
  ? require('@adiwajshing/baileys').makeInMemoryStore(opts)
  : createCompatStore();

module.exports = { CompatMessageList, createCompatStore, buildStore };
