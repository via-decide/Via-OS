'use strict';

const { AppRegistry, normalizeSlug } = require('./app-registry');
const VersionTracker = require('../logichub/src/versioning/version-tracker');

const ALLOWED_CATEGORIES = new Set([
  'research',
  'creator tools',
  'game dev',
  'analysis',
  'utilities',
  'simulations'
]);

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += String(chunk || '');
      if (body.length > 1_000_000) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function createRegisterAppHandler(options = {}) {
  const registry = new AppRegistry(options);

  return async function registerAppHandler(req, res) {
    const method = (req.method || 'GET').toUpperCase();
    const urlPath = (req.url || '').split('?')[0];

    if (method !== 'POST' || urlPath !== '/api/register-app') {
      return false;
    }

    try {
      const payload = await parseJsonBody(req);
      const slug = normalizeSlug(payload.slug || payload.name);
      const category = String(payload.category || 'utilities').trim().toLowerCase();

      if (!payload.name || !payload.creator || !payload.description) {
        sendJson(res, 400, { error: 'name, creator, and description are required' });
        return true;
      }

      if (!slug) {
        sendJson(res, 400, { error: 'slug is required' });
        return true;
      }

      if (!ALLOWED_CATEGORIES.has(category)) {
        sendJson(res, 400, {
          error: 'invalid category',
          allowed_categories: Array.from(ALLOWED_CATEGORIES)
        });
        return true;
      }

      const version = payload.version || '1.0.0';
      const updatedIndex = await registry.register({
        id: slug,
        slug,
        name: payload.name,
        creator: payload.creator,
        description: payload.description,
        category,
        runtime: 'edge-runtime',
        deployment_url: `/apps/${slug}`,
        version
      });

      const tracker = new VersionTracker(slug);
      await tracker.captureVersion({
        code: payload.code || '',
        config: payload.config || {},
        assets: payload.assets || [],
        dependencies: payload.dependencies || {}
      }, {
        creator: payload.creator,
        changes: payload.changes || ['feature: Published app update'],
        changelog: payload.changelog || `Published ${payload.name}` ,
        version
      });
      await tracker.publishVersion(version);

      sendJson(res, 201, {
        success: true,
        app: updatedIndex.apps.find((entry) => entry.slug === slug),
        total_apps: updatedIndex.apps.length
      });

      return true;
    } catch (error) {
      sendJson(res, 500, { error: error.message || 'register app failed' });
      return true;
    }
  };
}

module.exports = {
  ALLOWED_CATEGORIES,
  createRegisterAppHandler
};
