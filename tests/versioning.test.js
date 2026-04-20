'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

const VersionStore = require('../logichub/src/versioning/version-store');
const VersionTracker = require('../logichub/src/versioning/version-tracker');
const ReleaseManager = require('../logichub/src/versioning/release-manager');
const RollbackEngine = require('../logichub/src/versioning/rollback-engine');

const tempStorePath = path.resolve(process.cwd(), 'logichub', 'data', 'versions.test.json');

test.beforeEach(async () => {
  await fs.mkdir(path.dirname(tempStorePath), { recursive: true });
  await fs.writeFile(tempStorePath, '{"apps":{}}\n', 'utf8');
});

test('version tracker captures and publishes versions', async () => {
  const store = new VersionStore({ filePath: tempStorePath });
  const tracker = new VersionTracker('app-a', store);

  const capture = await tracker.captureVersion({ code: 'x', config: { a: 1 } }, { creator: 'dev' });
  assert.equal(capture.version, '1.0.0');

  await tracker.publishVersion('1.0.0');
  await tracker.trackDownload('1.0.0');

  const stats = await tracker.getStats();
  assert.equal(stats.totalVersions, 1);
  assert.equal(stats.totalDownloads, 1);
  assert.equal(stats.publishedVersions, 1);
});

test('release manager generates changelog', async () => {
  const store = new VersionStore({ filePath: tempStorePath });
  const tracker = new VersionTracker('app-b', store);
  await tracker.captureVersion({ code: 'v1', config: { a: 1 } }, { version: '1.0.0', changes: ['feature: init'] });
  await tracker.captureVersion({ code: 'v2', config: { a: 1 } }, { version: '1.1.0', changes: ['feature: add panel'] });

  const manager = new ReleaseManager('app-b', tracker);
  const log = await manager.generateChangelog('1.0.0', '1.1.0');
  assert.equal(log.length, 2);
  assert.equal(log[1].version, '1.1.0');
});

test('rollback engine rolls back to prior compatible version', async () => {
  const store = new VersionStore({ filePath: tempStorePath });
  const tracker = new VersionTracker('app-c', store);

  await tracker.captureVersion({ code: 'v1', config: { mode: 'safe' }, dependencies: { a: '1.2.3' } }, { version: '1.0.0' });
  await tracker.captureVersion({ code: 'v2', config: { mode: 'safe' }, dependencies: { a: '1.4.0' } }, { version: '1.0.1' });
  tracker.currentVersion = '1.0.1';

  const engine = new RollbackEngine('app-c', tracker);
  const result = await engine.rollbackTo('1.0.0');

  assert.equal(result.success, true);
  assert.equal(result.toVersion, '1.0.0');
  assert.equal(tracker.currentVersion, '1.0.0');
});
