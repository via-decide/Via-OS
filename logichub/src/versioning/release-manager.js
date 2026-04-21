'use strict';

const { compareVersions, isValidSemver } = require('./version-utils');

class ReleaseManager {
  constructor(appId, tracker = null) {
    this.appId = appId;
    this.tracker = tracker;
    this.releaseHistory = [];
  }

  async createRelease(version, changes = [], changelog = '') {
    if (!isValidSemver(version)) {
      throw new Error(`Invalid semantic version: ${version}`);
    }

    const release = {
      appId: this.appId,
      version,
      timestamp: Date.now(),
      changes: this.parseChanges(changes),
      changelog,
      type: this.getVersionType(version),
      status: 'draft',
      notes: []
    };

    this.releaseHistory.push(release);
    return release;
  }

  async publishRelease(version) {
    const release = this.releaseHistory.find((r) => r.version === version);
    if (!release) throw new Error(`Release not found: ${version}`);

    release.status = 'published';
    release.publishedAt = Date.now();

    if (this.tracker) {
      await this.tracker.publishVersion(version);
    }

    return release;
  }

  async generateChangelog(fromVersion = null, toVersion = null) {
    if (!this.tracker) return [];
    let versions = await this.tracker.listVersions(1000);

    if (fromVersion) {
      versions = versions.filter((v) => compareVersions(v.version, fromVersion) >= 0);
    }
    if (toVersion) {
      versions = versions.filter((v) => compareVersions(v.version, toVersion) <= 0);
    }

    return versions
      .map((v) => ({
        version: v.version,
        date: new Date(v.timestamp).toISOString().split('T')[0],
        changes: v.changes || [],
        changelog: v.changelog || ''
      }))
      .reverse();
  }

  parseChanges(changesList = []) {
    return changesList.map((change) => {
      const [type, ...description] = String(change).split(':');
      const normalizedType = String(type || '').trim().toLowerCase() || 'feature';
      return {
        type: normalizedType,
        description: description.join(':').trim(),
        severity: this.getSeverity(normalizedType)
      };
    });
  }

  getVersionType(version) {
    const [core] = String(version).split('-');
    const [major, minor] = core.split('.').map((v) => Number.parseInt(v, 10) || 0);
    if (major > 0) return 'major';
    if (minor > 0) return 'minor';
    return 'patch';
  }

  getSeverity(changeType) {
    const severityMap = {
      breaking: 'critical',
      feature: 'medium',
      fix: 'low',
      docs: 'info',
      refactor: 'low'
    };
    return severityMap[changeType] || 'medium';
  }

  getLatestRelease() {
    const published = this.releaseHistory.filter((r) => r.status === 'published');
    if (published.length === 0) return null;
    return [...published].sort((a, b) => compareVersions(b.version, a.version))[0];
  }

  async createPreRelease(baseVersion, preReleaseId) {
    return this.createRelease(`${baseVersion}-${preReleaseId}`, [], `Pre-release version ${preReleaseId}`);
  }

  getReleaseNotes(version) {
    const release = this.releaseHistory.find((r) => r.version === version);
    if (!release) return null;
    return {
      version: release.version,
      date: new Date(release.timestamp).toISOString().split('T')[0],
      type: release.type,
      changes: release.changes,
      changelog: release.changelog,
      status: release.status
    };
  }
}

module.exports = ReleaseManager;
