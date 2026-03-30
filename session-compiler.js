/**
 * scripts/session-compiler.js
 * Session Compiler — tracks the user's spatial traversal and compiles it into a printable PDF report.
 * Uses window.print() which natively invokes "Save as PDF" on Android/iOS.
 */

let sessionLog = [];

// ─── ROOM ENTRY TRACKING ────────────────────────────────────────────────────

// Log the initial boot room on load
document.addEventListener('DOMContentLoaded', () => {
  sessionLog.push({
    title: 'Main Room',
    timestamp: new Date().toLocaleTimeString(),
    coords: '0,0,0'
  });
});

// Track every subsequent room visited
window.addEventListener('os:node_changed', (e) => {
  const { title, seed, z } = e.detail;
  sessionLog.push({
    room: title || "Uncharted",
    time: new Date().toLocaleTimeString(),
    pattern: seed || "SYSTEM_ASCENT"
  });
});

// Track floor changes
window.addEventListener('os:floor_changed', (e) => {
  const { floor } = e.detail;
  missionLog.push({
    title: `Floor Transition: Level ${floor}`,
    timestamp: new Date().toLocaleTimeString(),
    coords: 'N/A'
  });
});

// ─── CONCLUDE BUTTON ────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const concludeBtn = document.getElementById('btn-conclude-session');
  if (concludeBtn) {
    concludeBtn.addEventListener('click', () => compileAndPrint());
  }
});

// ─── PDF RENDER + PRINT ─────────────────────────────────────────────────────

function compileAndPrint() {
  const zone = document.getElementById('pdf-render-zone');
  if (!zone) return;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const timeStr = now.toLocaleTimeString();

  const logItems = sessionLog.map((entry, i) =>
    `<li>
      <span class="log-index">${String(i + 1).padStart(2, '0')}</span>
      <strong>${entry.room}</strong>
      <span class="log-time" style="font-size: 11px; margin-left: 8px;">[ SIGIL: ${entry.pattern || '0,0'} ]  —  ${entry.time}</span>
    </li>`
  ).join('');

  zone.innerHTML = `
    <div class="pdf-page">
      <div class="pdf-header">
        <div class="pdf-logo" style="color: #00ff96;">VIA OS</div>
        <h1 style="color: #00ff96;">Classified Session Report</h1>
        <p class="pdf-date" style="color: rgba(255,255,255,0.5);">${dateStr} &bull; MISSION CONCLUDED AT ${timeStr}</p>
        <hr style="border-color: rgba(255,255,255,0.2);">
      </div>
      <div class="pdf-body">
        <h2 style="color: #00ff96;">Spatial Traversal Log</h2>
        <p class="pdf-subtitle" style="color: rgba(255,255,255,0.5);">A verified record of your movement through the VIA Skyscraper.</p>
        <ul class="traversal-log">
          ${logItems}
        </ul>
      </div>
      <div class="pdf-footer" style="border-top: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.3);">
        <p>VIA SPATIAL OS &bull; MISSION NODES VERIFIED: <strong>${sessionLog.length}</strong></p>
        <p>CONFIDENTIAL &bull; INTERNAL DATA ONLY</p>
      </div>
    </div>
  `;

  zone.style.display = 'block';

  const cleanupAfterPrint = () => {
    zone.style.display = 'none';
    zone.innerHTML = '';

    if (window.OS) {
      // Return to [0,0] core pattern
      window.dispatchEvent(new CustomEvent('os:pattern_locked', { detail: { seed: '0,0' } }));
    }

    sessionLog = [{
      room: 'Galaxy Center',
      time: new Date().toLocaleTimeString(),
      pattern: '0,0'
    }];
  };

  const handleAfterPrint = () => {
    window.removeEventListener('afterprint', handleAfterPrint);
    cleanupAfterPrint();
  };

  window.addEventListener('afterprint', handleAfterPrint, { once: true });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setTimeout(() => window.print(), 180);
    });
  });

  setTimeout(() => {
    if (zone.style.display === 'block') cleanupAfterPrint();
  }, 8000);
}
