/**
 * scripts/app-registry.js — VIA Launcher Registry
 * 
 * Maps 3x3 Stargate sigil patterns (seeds) to Native Android Intents or actions.
 */

window.GlyphRegistry = {
  // ─── SOCIAL & MEDIA ────────────────────────────────────────────────────────

  // Horizontal Top Line (0,0 -> 1,0 -> 2,0)
  "0,0|1,0|2,0": { 
    name: "WhatsApp", 
    action: "link", 
    link: "whatsapp://send", 
    fallback: "https://web.whatsapp.com" 
  },
  
  // Horizontal Middle Line (0,1 -> 1,1 -> 2,1)
  "0,1|1,1|2,1": { 
    name: "YouTube", 
    action: "link", 
    link: "vnd.youtube://", 
    fallback: "https://youtube.com" 
  },
  
  // Horizontal Bottom Line (0,2 -> 1,2 -> 2,2)
  "0,2|1,2|2,2": { 
    name: "Spotify", 
    action: "link", 
    link: "spotify://", 
    fallback: "https://open.spotify.com" 
  },

  // ─── NATIVE HARDWARE ───────────────────────────────────────────────────────

  // Square (Top-Left 2x2: 0,0 -> 1,0 -> 1,1 -> 0,1 -> 0,0)
  "0,0|1,0|1,1|0,1|0,0": { 
    name: "Native Files", 
    action: "file_picker" 
  }
};
