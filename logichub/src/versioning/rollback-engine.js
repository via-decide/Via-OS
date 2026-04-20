'use strict';

const { compareVersions } = require('./version-utils');

class RollbackEngine {
  constructor(appId, tracker = null) {
    this.appId = appId;
    this.tracker = tracker;
    this.rollbackHistory = [];
  }

  async rollbackTo(targetVersion) {
    if (!this.tracker) {
      throw new Error('Rollback engine requires a tracker instance');
    }

    const currentVersion = this.tracker.currentVersion;
    const targetApp = await this.tracker.getVersion(targetVersion);
    if (!targetApp) {
      throw new Error(`Target version not found: ${targetVersion}`);
    }

    const compatibility = await this.checkCompatibility(currentVersion, targetVersion);
    if (!compatibility.isCompatible) {
      throw new Error(`Incompatible rollback: ${compatibility.reason}`);
    }

    const rollbackTx = {
      id: this.generateRollbackId(),
      appId: this.appId,
      fromVersion: currentVersion,
      toVersion: targetVersion,
      timestamp: Date.now(),
      status: 'in-progress',
      snapshot: targetApp.snapshot
    };
    this.rollbackHistory.push(rollbackTx);

    try {
      await this.applySnapshot(targetApp.snapshot);
      await this.updateDeployment(targetVersion);
      rollbackTx.status = 'completed';
      rollbackTx.completedAt = Date.now();
      this.tracker.currentVersion = targetVersion;
      return {
        success: true,
        rollbackId: rollbackTx.id,
        fromVersion: currentVersion,
        toVersion: targetVersion,
        completedAt: rollbackTx.completedAt
      };
    } catch (error) {
      rollbackTx.status = 'failed';
      rollbackTx.error = error.message;
      throw new Error(`Rollback failed: ${error.message}`);
    }
  }

  async checkCompatibility(fromVersion, toVersion) {
    if (!fromVersion) return { isCompatible: true };

    const fromApp = await this.tracker.getVersion(fromVersion);
    const toApp = await this.tracker.getVersion(toVersion);

    if (!fromApp || !toApp) return { isCompatible: false, reason: 'Version not found' };

    const depCompatible = this.areDependenciesCompatible(fromApp.snapshot.dependencies, toApp.snapshot.dependencies);
    if (!depCompatible) return { isCompatible: false, reason: 'Incompatible dependencies' };

    const breakingChanges = await this.detectBreakingChanges(fromVersion, toVersion);
    if (breakingChanges.length > 0) {
      return { isCompatible: false, reason: `Breaking changes detected: ${breakingChanges.join(', ')}` };
    }

    return { isCompatible: true };
  }

  areDependenciesCompatible(fromDeps = {}, toDeps = {}) {
    return Object.entries(fromDeps).every(([pkg, fromVersion]) => {
      const toVersion = toDeps[pkg];
      if (!toVersion) return true;
      const fromMajor = Number.parseInt(String(fromVersion).split('.')[0], 10) || 0;
      const toMajor = Number.parseInt(String(toVersion).split('.')[0], 10) || 0;
      return fromMajor === toMajor;
    });
  }

  async detectBreakingChanges(fromVersion, toVersion) {
    const versions = await this.tracker.listVersions(1000);
    return versions
      .filter((v) => compareVersions(v.version, fromVersion) <= 0 && compareVersions(v.version, toVersion) >= 0)
      .flatMap((v) => v.changes || [])
      .filter((change) => String(change).toLowerCase().includes('breaking'))
      .map((change) => String(change).replace(/breaking:/i, '').trim());
  }

  async applySnapshot(snapshot) {
    if (!snapshot || !snapshot.code || !snapshot.config) {
      throw new Error('Invalid snapshot: missing required fields');
    }
    return true;
  }

  async updateDeployment(version) {
    return Boolean(version);
  }

  getRollbackHistory(limit = 50) {
    return [...this.rollbackHistory]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit)
      .map((tx) => ({
        id: tx.id,
        fromVersion: tx.fromVersion,
        toVersion: tx.toVersion,
        timestamp: tx.timestamp,
        status: tx.status,
        completedAt: tx.completedAt
      }));
  }

  async cancelRollback(rollbackId) {
    const rollback = this.rollbackHistory.find((r) => r.id === rollbackId);
    if (!rollback) throw new Error(`Rollback not found: ${rollbackId}`);
    if (rollback.status !== 'in-progress') {
      throw new Error(`Cannot cancel: rollback status is ${rollback.status}`);
    }

    rollback.status = 'cancelled';
    rollback.cancelledAt = Date.now();
    return rollback;
  }

  generateRollbackId() {
    return `rb_${this.appId}_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }
}

module.exports = RollbackEngine;
