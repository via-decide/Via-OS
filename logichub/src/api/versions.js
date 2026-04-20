'use strict';

const VersionTracker = require('../versioning/version-tracker');
const RollbackEngine = require('../versioning/rollback-engine');

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function parseRoute(url) {
  const pathname = String(url || '').split('?')[0];
  const match = pathname.match(/^\/api\/apps\/([^/]+)\/versions(?:\/([^/]+))?(?:\/rollback\/([^/]+))?$/);
  if (!match) return null;
  return {
    appId: decodeURIComponent(match[1]),
    version: match[2] ? decodeURIComponent(match[2]) : null,
    rollbackVersion: match[3] ? decodeURIComponent(match[3]) : null
  };
}

function createVersionsApiHandler(options = {}) {
  return async function versionsApiHandler(req, res) {
    const method = (req.method || 'GET').toUpperCase();
    const route = parseRoute(req.url || '');

    if (!route) {
      if ((req.url || '').split('?')[0] === '/api/apps/stats') {
        sendJson(res, 400, { error: 'appId required' });
        return true;
      }
      return false;
    }

    const tracker = new VersionTracker(route.appId, options.storage);
    const rollbackEngine = new RollbackEngine(route.appId, tracker);

    try {
      if (method === 'GET' && !route.version && !route.rollbackVersion) {
        const versions = await tracker.listVersions(50);
        sendJson(res, 200, versions);
        return true;
      }

      if (method === 'GET' && route.version && route.version !== 'stats') {
        const versionData = await tracker.getVersion(route.version);
        if (!versionData) {
          sendJson(res, 404, { error: 'Version not found' });
          return true;
        }
        sendJson(res, 200, versionData);
        return true;
      }

      if (method === 'GET' && route.version === 'stats') {
        sendJson(res, 200, await tracker.getStats());
        return true;
      }

      if (method === 'POST' && route.version === 'rollback' && route.rollbackVersion) {
        const result = await rollbackEngine.rollbackTo(route.rollbackVersion);
        sendJson(res, 200, result);
        return true;
      }

      sendJson(res, 405, { error: 'Method not allowed' });
      return true;
    } catch (error) {
      sendJson(res, 400, { error: error.message || 'version api failed' });
      return true;
    }
  };
}

module.exports = {
  createVersionsApiHandler
};
