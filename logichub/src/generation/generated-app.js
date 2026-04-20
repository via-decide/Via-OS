'use strict';

const VersionTracker = require('../versioning/version-tracker');

async function generateApp(appData, metadata = {}, options = {}) {
  const appId = appData?.appId || metadata?.appId;
  if (!appId) {
    throw new Error('appId is required to generate app version');
  }

  const tracker = new VersionTracker(appId, options.storage);
  const initialVersion = metadata.version || '1.0.0';

  await tracker.captureVersion(appData, {
    creator: metadata.creatorId || metadata.creator || 'unknown',
    changes: metadata.changes || ['feature: Initial generation'],
    changelog: metadata.changelog || `Generated from ${metadata.source || 'unknown source'}`,
    version: initialVersion
  });

  await tracker.publishVersion(initialVersion);

  return {
    appId,
    version: initialVersion,
    generatedAt: Date.now()
  };
}

module.exports = {
  generateApp
};
