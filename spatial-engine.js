/**
 * Copyright 2026 ViaDecide
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * scripts/spatial-engine.js — v4 Ecosystem Master
 *
 * UPGRADE: Macro-Routing (ViaDecide Ecosystem), Master Key Sigil,
 *          and Split-Screen Micro-Tool Launching.
 */

const MACRO_REGISTRY = {
  [window.masterKeySigil]: "root",
  "0,-1|0,0|0,1": "decision-core",      // Vertical Center
  "-1,0|0,0|1,0": "code-nexus",         // Horizontal Center
  "-1,-1|0,0|1,1": "orchard-engine",     // Diagonal 1
  "1,-1|0,0|-1,1": "logic-academy",     // Diagonal 2
  "-1,-1|0,-1|1,-1": "creator-forge",   // Top Row
  "-1,1|0,1|1,1": "research-matrix",    // Bottom Row
  "-1,-1|-1,0|-1,1": "utility-subsystem", // Left Col
  "1,-1|1,0|1,1": "meta-synthesis"       // Right Col
};

// =============================================================================
// PROCEDURAL ROOM ENGINE — Infinite Deterministic Generation
// =============================================================================
class ProceduralRoomEngine {
  constructor() {
    this.sectors = ["Nexus", "Obsidian", "Quantum", "Aegis", "Void", "Echo", "Helios", "Apex"];
    this.departments = ["Archives", "Engineering", "Synthetics", "Logic Core", "Terminal", "Containment", "Armory", "Hub"];
    this.descriptors = ["Classified operations", "Automated drone bay", "Abandoned data sector", "High-security vault", "Processing relay", "Dormant server farm"];
  }

  getRoom(seed, overrideZ = null) {
    if (!seed || seed === '0,0' || seed === 'center' || seed === '0') {
      return { title: 'Galaxy Center', desc: 'The main nexus.', z: overrideZ !== null ? overrideZ : 0 };
    }

    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash |= 0;
    }
    hash = Math.abs(hash);
    
    const sector = this.sectors[hash % this.sectors.length];
    const dept = this.departments[(hash * 7) % this.departments.length];
    const desc = this.descriptors[(hash * 11) % this.descriptors.length];

    let z = overrideZ;
    if (z === null) {
      z = 0;
      if (seed.length > 20) z = -99;
      else if (seed.length > 14) z = -10;
      else if (seed.length > 7) z = -1;
    }

    if (z === 0) {
      return { title: `${sector} ${dept}`, desc: `Surface Level: ${desc}`, z };
    } else if (z < 0) {
      return { title: `${sector} ${dept} // Sub-Level ${Math.abs(z)}`, desc: `Deep Storage: ${desc}`, z };
    } else {
      return { title: `${sector} ${dept} // Tower ${z}`, desc: `Atmospheric: ${desc}`, z };
    }
  }
}

const RoomMatrix = new ProceduralRoomEngine();

// =============================================================================
// SPATIAL MATRIX — Warp Gate Engine
// =============================================================================
class SpatialMatrix {
  constructor() {
    this.roomName  = document.getElementById('hud-room-name');
    this.roomDesc  = document.getElementById('hud-room-desc');

    this.currentSeed = '0,0';
    this.currentZ = 0;

    this.attachEventListeners();
    this.initGravityDrop();
    
    // Spawn initial OS Nexus window
    const room = RoomMatrix.getRoom(this.currentSeed, this.currentZ);
    window.WM.spawnWindow(room, this.currentSeed);
    this.updateHUD(room);
  }

  attachEventListeners() {
    window.addEventListener('os:pattern_locked', (e) => {
      if (e.detail && e.detail.seed) this.handleWarpGate(e.detail.seed);
    });

    window.addEventListener('os:macro_nav', (e) => {
      const fakeSeed = Object.keys(MACRO_REGISTRY).find(k => MACRO_REGISTRY[k] === e.detail.zoneId);
      if (fakeSeed) this.handleWarpGate(fakeSeed);
    });

    window.addEventListener('os:render_node', (e) => {
      this.renderNodeContent(e.detail.node, e.detail.seed, e.detail.z);
    });
  }

  initGravityDrop() {
    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; });
    document.addEventListener('touchend', (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchEndY - touchStartY;

      // Scroll Guard: Only trigger if not scrolling a window body
      const scrollTarget = e.target.closest('.window-body');
      const isScrollingWindow = scrollTarget && scrollTarget.scrollTop > 0;

      if (deltaY > 150 && !isScrollingWindow) {
        this.handleGravityDrop();
      }
    });
  }

  handleGravityDrop() {
    // Gravity Drop: Compile session into report
    const concludeBtn = document.getElementById('btn-conclude-session');
    if (concludeBtn) concludeBtn.click();
  }

  updateDiagnostics(seed, routeType, action) {
    const diag = document.getElementById('os-diagnostics');
    if (!diag) return;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    diag.innerHTML = `
      <div>[PWA STATUS: ${isStandalone ? 'INSTALLED' : 'BROWSER'}]</div>
      <div>[SEED: ${seed}]</div>
      <div>[ROUTE: ${routeType}]</div>
      <div style="color:#fff;">[ACTION: ${action}]</div>
      <div style="font-size:8px; color:rgba(255,255,255,0.3); margin-top:4px;">${new Date().toLocaleTimeString()}</div>
    `;
  }

  initDiagnosticToggle() {
    let tapCount = 0;
    let lastTapTime = 0;
    document.addEventListener('click', (e) => {
      if (e.clientX < 60 && e.clientY < 60) {
        const now = Date.now();
        if (now - lastTapTime < 600) {
          tapCount++;
        } else {
          tapCount = 1;
        }
        lastTapTime = now;
        if (tapCount >= 3) {
          const diag = document.getElementById('os-diagnostics');
          if (diag) diag.style.display = diag.style.display === 'none' ? 'block' : 'none';
          tapCount = 0;
        }
      }
    });
  }

  async handleWarpGate(seed) {
    this.updateDiagnostics(seed, 'INCOMING', 'Evaluating waterfall...');

    // ─── STEP A: Brand Master Key (Root Access) ───
    if (seed === window.masterKeySigil) {
      this.updateDiagnostics(seed, 'MASTER_SIGIL', 'Unlocked Dev Console');
      if (window.patternTracer) await window.patternTracer.triggerSigilFlash();

      this.currentZ = -99;
      this.currentSeed = seed;
      const vaultRoom = { 
        id: 'developer-vault',
        name: "[∞, ∞] Dharam Daxini / classified logs", 
        lore: "Proprietary root level access. System authorship verified.",
        z: -99 
      };

      const vaultWin = window.WM.spawnWindow(vaultRoom, seed);
      const body = vaultWin.querySelector('.window-body');
      body.innerHTML = `<iframe src="./tools/developer-vault/index.html" style="width:100%; height:100%; border:none; background:transparent;"></iframe>`;
      
      this.updateHUD(vaultRoom);
      this.dispatchNodeChanged(vaultRoom);
      return; // HARD STOP
    }

    // ─── STEP B: Deep Link App Registry (Native Hardware Apps) ───
    const nativeApp = window.AppRegistry ? window.AppRegistry[seed] : null;
    if (nativeApp) {
      this.updateDiagnostics(seed, 'DEEP_LINK', `Launched: ${nativeApp}`);
      window.location.href = nativeApp;
      return; // HARD STOP
    }

    // ─── STEP C: Fractal Navigation (2-Dot Center Out) ───
    if (seed === "1,1|0,0" || seed === "0,0|1,1" || seed.length === 7) { 
      // Example 2-dot logic placeholder
      this.updateDiagnostics(seed, 'FRACTAL_NAV', 'Executing Spatial Zoom');
      // Execute zoom logic here...
    }

    this.currentSeed = seed;

    // ─── STEP D: Macro Ecosystem Routing ───
    const zoneId = MACRO_REGISTRY[seed];
    const zone = zoneId === 'root' 
      ? { id: 'root', name: "ViaDecide Root", lore: "The master control nexus for all ecosystem tools.", tools: [] }
      : (window.ZONES ? window.ZONES.find(z => z.id === zoneId) : null);

    if (zone) {
      this.updateDiagnostics(seed, 'MACRO_ZONE', `Routing to: ${zone.name}`);
      this.currentZ = 0;
      const room = { title: zone.name, desc: zone.lore, z: 0, tools: zone.tools, zoneId: zone.id };
      window.WM.spawnWindow(room, seed);
      this.updateHUD(room);
      this.dispatchNodeChanged(room);
      return; // HARD STOP
    }

    // ─── STEP E: Procedural Fallback (The Uncharted Tower) ───
    this.updateDiagnostics(seed, 'PROCEDURAL', 'Generated Uncharted Room');
    const room = RoomMatrix.getRoom(seed);
    this.currentZ = room.z;
    window.WM.spawnWindow(room, seed);
    this.updateHUD(room);
    this.dispatchNodeChanged(room);
  }

  updateHUD(room) {
    if (!room) return;
    if (this.roomName) this.roomName.textContent = room.title;
    if (this.roomDesc) this.roomDesc.textContent = room.desc;
  }

  renderNodeContent(node, seed, z) {
    const zoneId = MACRO_REGISTRY[seed];
    const zone = zoneId === 'root' 
      ? { id: 'root', name: "ViaDecide Root", lore: "The master control nexus for all ecosystem tools.", tools: [] }
      : (window.ZONES ? window.ZONES.find(z => z.id === zoneId) : null);

    const room = zone ? { title: zone.name, z: 0, tools: zone.tools, zoneId: zone.id } : RoomMatrix.getRoom(seed, z);
    if (!room) return;

    let html = `<h2>${room.title}</h2>`;
    
    if (zoneId === 'root' && window.ZONES) {
      html += `<div class="node-grid" style="grid-template-columns: repeat(2, 1fr);">`;
      window.ZONES.forEach(z => {
        html += `<button class="access-node macro-node" data-seed="macro" data-zone-id="${z.id}" style="border-color:${z.color || 'var(--matrix-green)'}">[ ${z.name.toUpperCase()} ]</button>`;
      });
      html += `</div>`;
    } else {
      html += `<div id="room-environment" class="node-grid">`;
      if (room.tools && room.tools.length > 0) {
        room.tools.forEach(tool => {
          html += `<button class="access-node tool-node" data-zone="${room.zoneId}" data-tool="${tool.id}" title="${tool.desc}">[ ${tool.name.toUpperCase()} ]</button>`;
        });
      } else {
        let hash = 0;
        for (let i = 0; i < seed.length; i++) { hash = ((hash << 5) - hash) + seed.charCodeAt(i); hash |= 0; }
        hash = Math.abs(hash);
        
        if (z <= 0) html += `<button class="access-node depth-descend" data-delta="-1">[ DECRYPT : SUB-LEVEL ${Math.abs(z - 1)} ]</button>`;
        if (z < 0) html += `<button class="access-node depth-ascend" data-delta="1">[ AIRLOCK : RETURN TO Z-${z + 1} ]</button>`;

        const dummyCount = (hash % 3) + 1;
        const dummyTasks = ["EXTRACT LOGS", "SYSTEM SCAN", "SYNC TERMINAL", "BYPASS PROTOCOL", "MONITOR FEED", "DIAGNOSTIC"];
        for (let i = 0; i < dummyCount; i++) {
            const tIndex = (hash + i * 5) % dummyTasks.length;
            html += `<button class="access-node dummy-node">[ ${dummyTasks[tIndex]} ]</button>`;
        }
      }
      html += `</div>`;
    }
    node.innerHTML = html;

    // Attach local listeners for elevator buttons
    node.querySelectorAll('.depth-ascend, .depth-descend').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const delta = parseInt(btn.getAttribute('data-delta'));
        this.changeFloor(delta, node, node.closest('.glass-window').querySelector('.header-title'));
      });
    });
  }

  dispatchNodeChanged(room) {
    window.dispatchEvent(new CustomEvent('os:node_changed', {
      detail: { seed: this.currentSeed, z: this.currentZ, title: room ? room.title : 'Uncharted Sector' }
    }));
  }

  async changeFloor(delta, windowBody, headerTitle) {
    const targetZ = this.currentZ + delta;
    const room = RoomMatrix.getRoom(this.currentSeed, targetZ);
    if (!room) return;

    this.currentZ = targetZ;
    this.updateHUD(room);
    if (headerTitle) headerTitle.textContent = room.title.toUpperCase();

    windowBody.style.transition = 'opacity 0.3s ease, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    windowBody.style.opacity = '0';
    windowBody.style.transform = `scale(${delta < 0 ? 1.2 : 0.8})`;

    await new Promise(r => setTimeout(r, 400));
    
    this.renderNodeContent(windowBody, this.currentSeed, this.currentZ);

    windowBody.style.transition = 'none';
    windowBody.style.transform = `scale(${delta < 0 ? 0.8 : 1.2})`;

    requestAnimationFrame(() => {
      windowBody.style.transition = 'opacity 0.4s ease, transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)';
      windowBody.style.opacity = '1';
      windowBody.style.transform = `scale(1.0)`;
    });

    this.dispatchNodeChanged(room);
    window.dispatchEvent(new CustomEvent('os:floor_changed', { detail: { floor: this.currentZ } }));
  }
}

document.addEventListener('DOMContentLoaded', () => { 
  window.OS = new SpatialMatrix(); 
  window.OS.initDiagnosticToggle();
});
