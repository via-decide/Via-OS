# CODEX AGENT RULES — via-decide/decide.engine-tools
# Place this file at: .codex/instructions.md
# Codex reads this before every task in this repo.

════════════════════════════════════════════
REPO IDENTITY
════════════════════════════════════════════

Stack: Vanilla JS, HTML, CSS, Supabase CDN.
No build step. No npm. No bundler. No React.
Everything runs directly in the browser.
GitHub Pages host: https://via-decide.github.io/decide.engine-tools/

════════════════════════════════════════════
THE PRIME DIRECTIVE
════════════════════════════════════════════

READ every file you are about to change.
Understand what it does before touching it.
If you are unsure what a line does — do not change it.
Surgical edits only. Never rewrite whole files.

════════════════════════════════════════════
FILES YOU MUST NEVER MODIFY
════════════════════════════════════════════

These files are marked DO NOT MODIFY or are too risky:

  tools/games/skillhex-mission-control/js/app.js
  tools/games/hex-wars/index.html → QUESTIONS array
  shared/shared.css
  _redirects
  tools-manifest.json
  missions.json (skillhex)

════════════════════════════════════════════
FUNCTION BODIES — NEVER TOUCH
════════════════════════════════════════════

Do not modify these function bodies (add new code only after them):
- hex-wars: calcPoints(), showResult(), restart(), loadQuestion(), updateStats(), haptic()
- skillhex: handleDecision(), advanceMission(), calculateScore(), renderCycle(), initApp()
- snake-game: step(), draw(), reset(), spawnFood()
- wings-quiz: selectAnswer(), showQuestion(), startTimer(), broadcast(), createRoom(), joinRoom()
- layer1-swipe: commitSwipe(), finishSession(), buildCardElement(), startSessionIfEligible(), hydrateState(), syncState()
- growth-engine: anything inside Three.js animation loop

════════════════════════════════════════════
SCRIPT TAG LOADING ORDER — CRITICAL
════════════════════════════════════════════

Always in <head>:
1. Three.js CDN (if used)
2. Other CDN scripts
3. shared/vd-nav-fix.js
4. shared/vd-wallet.js (if needed)
5. shared/tool-storage.js (if needed)
6. Other shared/*.js files
7. Inline/module scripts last

Never add scripts after </body> or after existing inline script blocks.

════════════════════════════════════════════
ES MODULES vs PLAIN SCRIPTS
════════════════════════════════════════════

SkillHex uses ES modules. Other games use plain scripts.
Never convert shared scripts to modules.
Guard window globals in modules:
if (typeof window.VDWallet !== 'undefined') { ... }

════════════════════════════════════════════
SYNTAX RULES
════════════════════════════════════════════

1) No duplicate const declarations.
2) No orphaned object literals.
3) Use $$ for PostgreSQL function delimiters.
4) Never use !important on transform/opacity for game elements.
5) Do not break IIFE wrappers in shared/router scripts.

════════════════════════════════════════════
SHARED ECONOMY SAFE PATTERN
════════════════════════════════════════════

Integrate wallet only by:
1) correct script tag order,
2) adding new awardGameCredits() helper outside existing functions,
3) call helper from safe non-loop location,
4) guard with typeof check.

Wallet fields:
focusDrops, lumina, hexTokens, missionXP, snakeCoins, quizStars.

════════════════════════════════════════════
SUPABASE RULES
════════════════════════════════════════════

- Never hardcode anon key.
- Never use process.env in browser HTML.
- Use snake_case DB columns.
- Use .single() for single-row fetches.
- Always handle Supabase error responses.
- Never call .rpc() without verifying SQL function exists.

════════════════════════════════════════════
GITHUB PAGES PATH RULES
════════════════════════════════════════════

Site base: /decide.engine-tools/ (not /).
Use relative internal links only.
Avoid absolute /tools/... paths.

════════════════════════════════════════════
BEFORE EVERY COMMIT — CHECKS
════════════════════════════════════════════

1. grep -n "const canonicalRoute" router.js (exactly once)
2. grep -n "const navLinks\|const sections" router.js (each once)
3. node --check router.js
4. python3 -c "import json; json.load(open('tools-manifest.json'))"
5. grep -n "bar.href" shared/vd-nav-fix.js (must not set '/')
6. grep example.supabase.co placeholders in tools/eco-engine-test/index.html (none)
7. grep !important transform/opacity in tools/games/*/index.html (none)
8. script tag balance in each modified HTML

════════════════════════════════════════════
OUTPUT FORMAT FOR ALL TASKS
════════════════════════════════════════════

After tasks output:
- change table
- skipped files + reasons
- failed checklist items

════════════════════════════════════════════
AI EXECUTION PROTOCOL
════════════════════════════════════════════

READ → ANALYZE → PLAN → CONFIRM → MODIFY → VERIFY.

Strict adherence: no architecture changes, no unrelated refactors, no new frameworks/deps.
Mandatory analysis before edits, ambiguity handling, contradiction detection, and explicit confirmation for complex tasks.

Safety limits:
- max lines modified per file: 20
- max files changed per task: 5
- max new functions added: 3
If limits exceeded, split into separate task and ask.

Bug scan before edits for undefined variables, duplicate const, unhandled promises, script order, invalid JSON.

Browser-only assumption:
Never introduce process.env, require(), npm packages, bundlers, webpack, or vite into browser code.
