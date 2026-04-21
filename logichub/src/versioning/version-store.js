'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');

class VersionStore {
  constructor(options = {}) {
    this.filePath = options.filePath || path.resolve(process.cwd(), 'logichub', 'data', 'versions.json');
  }

  async ensureStore() {
    const dir = path.dirname(this.filePath);
    await fs.mkdir(dir, { recursive: true });
    try {
      await fs.access(this.filePath);
    } catch {
      await fs.writeFile(this.filePath, '{"apps":{}}\n', 'utf8');
    }
  }

  async readStore() {
    await this.ensureStore();
    const raw = await fs.readFile(this.filePath, 'utf8');
    const parsed = JSON.parse(raw || '{}');
    return parsed.apps ? parsed : { apps: {} };
  }

  async writeStore(data) {
    await this.ensureStore();
    await fs.writeFile(this.filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  }

  async save(versionData) {
    const store = await this.readStore();
    const appBucket = Array.isArray(store.apps[versionData.appId]) ? store.apps[versionData.appId] : [];
    const index = appBucket.findIndex((entry) => entry.version === versionData.version);

    if (index >= 0) {
      appBucket[index] = { ...appBucket[index], ...versionData };
    } else {
      appBucket.push(versionData);
    }

    appBucket.sort((a, b) => b.timestamp - a.timestamp);
    store.apps[versionData.appId] = appBucket;
    await this.writeStore(store);
    return versionData;
  }

  async get(appId, version) {
    const store = await this.readStore();
    const appBucket = Array.isArray(store.apps[appId]) ? store.apps[appId] : [];
    return appBucket.find((entry) => entry.version === version) || null;
  }

  async listAll(appId, limit = 50) {
    const store = await this.readStore();
    const appBucket = Array.isArray(store.apps[appId]) ? store.apps[appId] : [];
    return appBucket.slice(0, Number(limit) || 50);
  }

  async delete(appId, version) {
    const store = await this.readStore();
    const appBucket = Array.isArray(store.apps[appId]) ? store.apps[appId] : [];
    store.apps[appId] = appBucket.filter((entry) => entry.version !== version);
    await this.writeStore(store);
  }
}

module.exports = VersionStore;
