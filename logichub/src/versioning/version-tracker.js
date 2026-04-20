'use strict';

const VersionStore = require('./version-store');
const { isValidSemver, bumpVersion } = require('./version-utils');

class VersionTracker {
  constructor(appId, storage = null) {
    this.appId = appId;
    this.storage = storage || new VersionStore();
    this.currentVersion = null;
  }

  async captureVersion(appData, metadata = {}) {
    const version = metadata.version || await this.getNextVersion(metadata.bumpType || 'patch');
    if (!isValidSemver(version)) {
      throw new Error(`Invalid version format: ${version}`);
    }

    const versionInfo = {
      appId: this.appId,
      version,
      timestamp: Date.now(),
      snapshot: {
        code: appData.code || '',
        config: appData.config || {},
        assets: appData.assets || [],
        dependencies: appData.dependencies || {}
      },
      creator: metadata.creator || 'unknown',
      changes: Array.isArray(metadata.changes) ? metadata.changes : [],
      changelog: metadata.changelog || '',
      preRelease: Boolean(metadata.preRelease),
      parentVersion: metadata.parentVersion || this.currentVersion,
      published: Boolean(metadata.published),
      downloadCount: Number(metadata.downloadCount || 0)
    };

    await this.storage.save(versionInfo);
    this.currentVersion = versionInfo.version;
    return versionInfo;
  }

  async getVersion(versionString) {
    return this.storage.get(this.appId, versionString);
  }

  async listVersions(limit = 50) {
    return this.storage.listAll(this.appId, limit);
  }

  async getTimeline() {
    const versions = await this.listVersions(1000);
    return versions.map((v) => ({
      version: v.version,
      timestamp: v.timestamp,
      creator: v.creator,
      changelog: v.changelog,
      published: v.published,
      downloadCount: v.downloadCount
    }));
  }

  async getNextVersion(bumpType = 'patch') {
    const versions = await this.listVersions(1);
    if (versions.length === 0) return '1.0.0';
    return bumpVersion(versions[0].version, bumpType);
  }

  async publishVersion(versionString) {
    const version = await this.getVersion(versionString);
    if (!version) throw new Error(`Version not found: ${versionString}`);
    version.published = true;
    version.publishedAt = Date.now();
    await this.storage.save(version);
    return version;
  }

  async trackDownload(versionString) {
    const version = await this.getVersion(versionString);
    if (!version) throw new Error(`Version not found: ${versionString}`);
    version.downloadCount = Number(version.downloadCount || 0) + 1;
    version.lastDownloaded = Date.now();
    await this.storage.save(version);
    return version.downloadCount;
  }

  async getStats() {
    const versions = await this.listVersions(1000);
    return {
      totalVersions: versions.length,
      publishedVersions: versions.filter((v) => v.published).length,
      currentVersion: versions[0]?.version || this.currentVersion,
      totalDownloads: versions.reduce((sum, v) => sum + Number(v.downloadCount || 0), 0),
      oldestVersion: versions[versions.length - 1]?.version || null,
      newestVersion: versions[0]?.version || null
    };
  }
}

module.exports = VersionTracker;
