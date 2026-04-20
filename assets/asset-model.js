'use strict';

(function initAssetModel(global) {
  function toISO(value) { return value ? new Date(value).toISOString() : new Date().toISOString(); }
  function createAssetRecord(input = {}) {
    const history = Array.isArray(input.version_history) ? input.version_history : [{ version: '1.0.0', timestamp: toISO(input.created_at), repo_source: input.repo_source || input.source || 'unknown' }];
    return {
      asset_id: input.asset_id || input.slug || `asset-${Math.random().toString(36).slice(2, 10)}`,
      creator_passport: input.creator_passport || input.creator || input.ownerType || 'community',
      created_at: toISO(input.created_at || input.createdAt),
      repo_source: input.repo_source || input.source || 'unknown',
      version_history: history,
      remix_parent: input.remix_parent || null
    };
  }
  function createLineageEdge(asset) {
    if (!asset || !asset.remix_parent) return [];
    return [{ asset: asset.asset_id, derived_from: 'parent_asset', parent_asset: asset.remix_parent }];
  }
  global.DaxiniAssetModel = { createAssetRecord, createLineageEdge };
})(window);
