(function registerEarningsLedger(global) {
  'use strict';

  const LEDGER_KEY = 'daxini.earnings.ledger';
  const SOURCE_AMOUNTS = {
    app_sales: 4,
    template_licensing: 3,
    simulation_worlds: 5,
    research_exports: 6
  };

  function safeParse(value, fallback) {
    try {
      return JSON.parse(value);
    } catch (_error) {
      return fallback;
    }
  }

  function readLedger() {
    return safeParse(localStorage.getItem(LEDGER_KEY), []);
  }

  function writeLedger(rows) {
    localStorage.setItem(LEDGER_KEY, JSON.stringify(rows));
    return rows;
  }

  function sourceAmount(source) {
    return Number(SOURCE_AMOUNTS[source] || 1);
  }

  function addEntry(input) {
    if (!input || !input.passport_id) return null;
    const entry = {
      passport_id: input.passport_id,
      asset_id: input.asset_id || 'unknown_asset',
      amount: Number(input.amount || 0),
      source: input.source || 'app_sales',
      timestamp: input.timestamp || new Date().toISOString()
    };
    const ledger = readLedger();
    ledger.push(entry);
    writeLedger(ledger);

    if (global.DaxiniReputationEngine && typeof global.DaxiniReputationEngine.updatePassportWallet === 'function') {
      global.DaxiniReputationEngine.updatePassportWallet(entry.passport_id, entry.amount);
    }

    return entry;
  }

  function recordEarning(passportId, assetId, source) {
    if (!passportId) return null;
    return addEntry({
      passport_id: passportId,
      asset_id: assetId,
      source,
      amount: sourceAmount(source)
    });
  }

  function passportSummary(passportId) {
    const entries = readLedger().filter((row) => row.passport_id === passportId);
    const byAsset = {};
    let total = 0;
    entries.forEach((row) => {
      const key = row.asset_id || 'unknown_asset';
      const item = byAsset[key] || { asset_id: key, downloads: 0, earnings: 0 };
      item.downloads += 1;
      item.earnings += Number(row.amount || 0);
      byAsset[key] = item;
      total += Number(row.amount || 0);
    });
    return {
      passport_id: passportId,
      entries,
      total_earnings: Number(total.toFixed(2)),
      assets: Object.values(byAsset)
    };
  }

  global.DaxiniEarningsLedger = {
    readLedger,
    addEntry,
    recordEarning,
    sourceAmount,
    passportSummary
  };
})(window);
