# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.9.0] - 2026-06-09

### Added
- **Flow Builder:** Figma-style visual canvas for mapping multi-page user journeys. Drag-and-drop page nodes, draw connectors, and add sticky notes — all in a dedicated full-screen view.
- **Flow Analysis:** AI evaluates entire user journeys across connected pages. Cross-page consistency checks for navigation, visual design, flow logic, and terminology — powered by local or cloud AI with vision support.
- **Multi-Flow Saves:** Save, name, load, and delete multiple flows independently. Badge shows saved flow count on the Load button.
- **Clear Canvas:** One-click button to reset the entire flow canvas (with confirmation).
- **Terminal Logs:** Real-time floating terminal overlay showing analysis progress, phase transitions, and errors during flow analysis.
- **Session Tracking:** Each flow analysis generates a unique session ID. Stale messages from cancelled or previous sessions are automatically filtered out.
- **Screenshot Resize:** Flow screenshots are downscaled to 800×600 before sending to AI, dramatically reducing payload size and preventing Ollama timeouts.
- **Dynamic Token Limits:** Flow analysis uses `maxTokens: 8192` (Ollama) / `4096` (cloud) for the large JSON responses it requires.
- **Cancel & Restart:** Starting a new flow analysis automatically cancels any in-progress analysis instead of blocking.
- **Context Menu Integration:** Right-click on any page → "Analyze in synthux Flow" opens the Flow Builder with that page pre-added.
- **Auto-Connect:** New pages are automatically connected to the last added page with a connector arrow.
- **Heatmap Improvements:** Gradient rendering, legend overlay, and pulse animations for issue markers on the heatmap.
- **Chrome Web Store Rating Prompt:** In-app prompt encouraging users to rate the extension after successful analysis.
- **Privacy Policy Update:** Updated privacy policy covering Flow Analysis data handling, BYOK transparency, and developer information.

### Changed
- **AI Client:** `maxTokens` is now configurable per-call instead of hardcoded to 4096. Flow analysis passes 8192 for Ollama.
- **Vision Detection:** Dynamic capability check via Ollama `/api/show` endpoint with in-memory cache. Replaces unreliable hardcoded model name checks.
- **Error Propagation:** AI errors during flow analysis are now surfaced in the terminal log with red highlighting instead of failing silently.
- **Website:** Added Flow Builder feature card with "New" badge to features grid (6 languages).
- **README:** Added Flow Builder section, updated roadmap, added `flow-manager.js` to project structure.

### Fixed
- **Flow Analysis Stale Results:** Previous analysis results no longer appear when starting a new analysis (session ID validation + `clearAllResults()`).
- **Vision Crash:** Fixed crash when sending screenshots to non-vision models. Vision support is now checked dynamically before sending images.
- **Hardcoded maxTokens:** Fixed `ai-client.js` ignoring caller's `maxTokens` option — was always sending 4096 regardless.

---

## [1.8.0] - 2026-05-16

### Added
- **Hover-to-Highlight:** Hover over any issue in the report to highlight the affected element on the page with a severity-colored border and tooltip. Smooth scroll into view for off-screen elements.
- **Heatmap Toggle:** New 🔥 Heatmap button in the export bar. When active, renders a canvas-based issue density heatmap over the analyzed page — critical issues glow red, moderate yellow, minor green. Toggle on/off anytime.
- **Annotated Screenshot:** New `captureAnnotatedScreenshot()` for viewport screenshots with numbered severity markers at issue element positions. Available for PDF reports.
- **Page Overlay System:** New unified overlay manager (`overlay-manager.js`) injected into target pages on demand via `chrome.scripting.executeScript`. Handles highlight borders, heatmap canvas, and annotation markers with proper z-index isolation.
- **Fuzzy Selector Matching:** When AI returns descriptive element references instead of valid CSS selectors, the overlay manager attempts heuristic matching (class, ID, attribute, placeholder fallbacks).
- **CSS Selector Prompt Enhancement:** AI prompt now explicitly requires valid CSS selectors in the `element` field (rule #8) for reliable page highlighting.

### Changed
- **Issue Items:** Now clickable with hover state (subtle blue highlight) to indicate interactivity
- **Export Bar:** Added heatmap toggle alongside existing Markdown and PDF download buttons
- **Service Worker:** New overlay message relay system — forwards HIGHLIGHT/HEATMAP/CLEAR commands from side panel to active tab content script

---

## [1.7.1] - 2026-05-11

### Fixed
- **MV3 Compliance (Blue Argon):** Chrome Web Store rejection for remotely hosted code in jsPDF bundle. The previous esbuild plugin only stripped the CDN URL string but left `createElement("script")` + `.src` assignment patterns that the CWS scanner still flagged. Now the entire `pdfobjectnewwindow` and `pdfjsnewwindow` dead code paths are replaced with `throw` statements at build time, keeping the bundle fully self-contained.

---

## [1.7.0] - 2026-04-30

### Added
- **WCAG Full Audit (axe-core):** Automated WCAG 2.2 AA compliance testing via axe-core dynamic injection. Violations with impact severity, affected elements, and WCAG references shown in report UI, Markdown, and PDF
- **Custom Synthetic User Profiles:** Create up to 5 custom personas with age range, tech savviness, accessibility needs, and goals — evaluated alongside built-in profiles
- **Custom Analysis Mode:** Third mode alongside Quick/Deep — select specific heuristics to evaluate via toggle chips
- **Dynamic Time Estimates:** Analysis duration now calculated based on selected profile count × heuristic count × provider speed (local ~4 min/call, cloud ~30s/call)
- **Kebab Menu:** Vertical 3-dot dropdown menu for custom profile edit/delete actions
- **Profile Form Improvements:** Descriptive labels with helper text (Persona Name, Age Range, Tech Savviness, Accessibility Needs, Goal)
- **WCAG in Reports:** Violations section in PDF with impact-colored dots, element selectors; Markdown with WCAG tags and "Learn more" links

### Changed
- **Accessibility Score:** Weighted blend of rule-based checks (40%) and axe-core results (60%) for more accurate scoring
- **Settings Cleanup:** Removed redundant profile management section from Settings (consolidated into Scanner tab)
- **Quick Mode:** Corrected label from "4 heuristics" to "3 heuristics"
- **Time Estimates:** Updated to realistic values; dynamic calculation replaces static ranges

### Fixed
- **PDF Export Crash:** Fixed `COLORS.secondary is not iterable` error (undefined key → `COLORS.textSecondary`)
- **PDF Text Overflow:** Custom profile subtitle now wraps within page width using `splitTextToSize`
- **Custom Profile in Reports:** Full persona context (age, tech, disabilities, goal) now included in Markdown, PDF, and report UI

---

## [1.6.0] - 2026-04-29

### Added
- **Vision Analysis:** Full-page screenshot capture (3-chunk stitch) for multimodal AI evaluation of visual hierarchy, color harmony, CTA visibility, and layout balance
- **Multi-Provider AI:** Support for Google Gemini, OpenAI, and Anthropic Claude alongside Ollama — BYOK (Bring Your Own Key) model
- **Cost Calculator:** Real-time token usage tracking and cost estimation with verified April 2026 pricing for all providers
- **PDF Export:** Professional PDF report generation with scores, code fixes, priority matrix, and cost summary
- **Markdown Export:** Downloadable `.md` reports for developer workflows
- **Code Fix Suggestions:** Concrete before/after HTML/CSS snippets for each identified issue
- **Quick Win indicators:** Issues tagged as quick wins for easy prioritization
- **GPT-5.5 pricing support** in cost calculator
- **Vision-aware heuristic prompts:** AI evaluates both DOM structure and visual screenshots simultaneously
- **Chrome Web Store listing:** Extension published at `cgldigellmojaejmnhjhpbfccncbmnhm`

### Changed
- **Hero CTA:** Primary button now links to Chrome Web Store ("Add to Chrome"), GitHub moved to secondary
- **Website comparison section:** New unified table layout (Local vs Cloud) showing speed, cost, privacy, and setup differences
- **Website version badge:** Auto-fetches latest version from GitHub `manifest.json`
- **How It Works:** Step 2 now links to Chrome Web Store + GitHub
- **README:** Added Chrome Web Store link to header nav and install section (Option 1: Store, Option 2: Source)
- **Time estimates:** Updated to real benchmarks — Quick ~25-30 min (local) / ~5 min (cloud), Deep ~60-75 min (local) / ~15 min (cloud)
- **Gemini config:** `thinkingBudget: 0` for 60-80% output token reduction without quality loss
- **Max tokens:** Increased to 4096 for all providers for detailed reports
- **Heuristic count label:** Fixed "3 heuristics" → "4 heuristics" per profile in Quick mode
- **Features grid:** Expanded from 6 to 8 cards (added Vision Analysis and PDF Export)
- **Firebase cache:** CSS/JS reduced from immutable/1yr to 1hr TTL + cache-busting query params

### Fixed
- **Gemini thinking tokens:** `thoughtsTokenCount` now correctly aggregated into output tokens for accurate billing
- **Gemini pricing:** Corrected to $0.30/$2.50 per 1M tokens (input/output)
- **Claude pricing:** Fixed Opus ($5/$25) and Haiku ($1/$5) rates
- **Report filters:** Quick Wins, Critical Issues, and Easy Fixes now correctly filter and expand cards
- **Storage quota overflow:** Screenshots stripped before persisting analysis results to `chrome.storage.local`
- **Screenshot rate limiting:** 600ms delay between captures to avoid `MAX_CAPTURE_VISIBLE_TAB_CALLS_PER_SECOND`
- **JSON parser:** Added partial parse recovery for truncated AI responses
- **Cost debug logging:** Console now shows granular breakdown (input + output + thinking tokens) per scan

### Removed
- **Report Language setting:** Removed non-functional EN/TR language toggle from Settings (was never wired to analysis pipeline)

---

## [1.5.0] - 2026-04-24

### Added
- **Provider abstraction layer:** `providers.js` with unified interface for Ollama, Gemini, OpenAI, and Claude
- **API key management:** Secure storage of provider API keys in `chrome.storage.local`
- **Settings UI:** Provider selector, API key inputs, model selection, and vision toggle in Settings panel
- **ESBuild bundler:** Code splitting with dynamic imports for PDF/html2canvas chunks
- **Accessibility audit module:** Automated WCAG checks for contrast, alt text, heading structure

### Changed
- **Architecture:** Monolithic `app.bundle.js` → ESBuild with chunk splitting (`app.js` + `chunks/`)
- **Manifest:** Updated `sidepanel.default_path` from `app.bundle.js` to chunked `app.js`
- **Chrome Web Store submission:** Resolved host permissions compliance (`activeTab` instead of `<all_urls>`)

---

## [1.4.1] - 2026-04-23

### Added
- **Multi-platform setup guide** in extension: macOS (`launchctl`), Linux (`export`), Windows (`PowerShell`) CORS instructions
- **LM Studio support:** endpoint note (`localhost:1234`), "skip CORS step" guidance
- **Model alternatives:** setup guide now shows Gemma 4, Qwen 3.5, Llama 4 options
- **Ollama update warning:** ⚠️ CORS may reset after Ollama updates — restart required
- **`docs/design.md`:** Full design system reference for AI agents (colors, typography, components, layout)
- **Website CORS note:** How It Works section now includes setup commands + link to full GitHub guide
- **Auto-fix stale models:** if saved model not found in Ollama, auto-switch to first available

### Changed
- Export button: clipboard copy → file download as `design-change.md`
- Button label: "Download as Markdown" → "Download design-change.md"
- Model links updated: Gemma 4, Qwen 3.6, Llama 4 (latest versions)
- README Quick Start rewritten: Ollama + LM Studio backends, 3 platforms, model alternatives
- Architecture diagram updated for LM Studio (`localhost:1234`)

### Fixed
- **CORS 403 silent failure:** Ollama updates reset `OLLAMA_ORIGINS`, causing analysis to silently fail without errors
- Setup guide step 2: `gemma3` → `gemma4`

---

## [1.4.0] - 2026-04-23

### Added
- **Landing page:** Static site at `website/` with dark glassmorphism theme (Saira + Inter fonts)
- **Firebase Hosting:** Production deployment to `synthux-app.web.app` with custom domain `synthux.app`
- **Internationalization:** EN/TR language toggle with `localStorage` persistence (`i18n.js`)
- **SEO:** Google Analytics (GA4), `robots.txt`, `sitemap.xml`, JSON-LD structured data, Open Graph tags
- **LLM discoverability:** `llms.txt` for AI crawler context
- **Professional SVG icons:** Feature section (blue stroke) and Privacy section (green stroke) icon sets
- **Screenshot composite:** Extension UI preview (Scan + Report panels) for landing page

### Changed
- Feature descriptions updated to mention **LM Studio** and **Qwen** alongside Ollama/Gemma
- How It Works step 1 broadened: "Install Ollama or LM Studio"
- How It Works steps now include direct links to [Ollama](https://ollama.com), [LM Studio](https://lmstudio.ai), [Gemma 4](https://ollama.com/library/gemma4), [Qwen 3.6](https://ollama.com/library/qwen3.6), [Llama 4](https://ollama.com/library/llama4), and [GitHub repo](https://github.com/synthuxapp/synthux)
- `firebase.json` configured with security headers (X-Content-Type-Options, X-Frame-Options, CSP)
- `.gitignore` updated with Firebase cache exclusions

---

## [1.3.0] - 2026-04-23

### Added
- **Security tooling:** Dependabot, CodeQL, OpenSSF Scorecard, npm audit in CI
- **SECURITY.md:** Responsible disclosure policy with safe harbor provisions
- **PRIVACY.md:** Chrome Web Store–ready privacy policy documenting local-only processing
- **Branded identity:** Custom s-icon for extension (16/32/48/128px), white-logo SVG in Side Panel header
- **README:** Theme-adaptive logo (dark/light), Security & Privacy section

### Changed
- CI pipeline now includes `npm audit --audit-level=moderate` security check
- `.gitignore` updated to exclude local font/logo assets

---

## [1.2.0] - 2026-04-21

### Added
- **JSON Repair Engine:** 5-strategy progressive repair pipeline (direct parse → block extraction → sanitize → aggressive repair → partial extraction)
- **Retry mechanism:** Auto-retry on Ollama 500 errors with 3s delay
- **Graceful failure:** Failed heuristics get score 50 instead of crashing the analysis
- **Periodic health check:** Pings Ollama every 15s, re-checks on tab switch
- **Terminal log:** Dark monospace log panel during analysis with timestamps, active/completed line states, auto-scroll
- **Ollama setup guide:** Collapsible 4-step guide in Settings with copy-to-clipboard commands
- **Error hints:** 403 auto-opens CORS guide, timeout shows "Ollama not running" hint

### Changed
- **Accent color:** Indigo (#6366f1) → Blue (#3b82f6)
- **Text contrast:** Boosted all text levels (primary #ededf0, secondary #b4b4bc, tertiary #8a8a96)
- **Border visibility:** Increased opacity for normal (0.08) and hover (0.14) states
- **Page info lock:** URL/title freezes during analysis, tab switches don't change displayed page
- **Time estimates:** Quick ~9 min, Deep ~20 min (based on 31B model benchmarks)
- **Report URLs:** Shows hostname only instead of full path
- **Report language:** Renamed "Language" to "Report Language" with compact EN/TR toggle

---

## [1.1.0] - 2026-04-21

### Added
- **Report History:** Up to 20 saved reports in `chrome.storage.local`
- **History tab:** 4th tab in navigation (Scan | Report | History | Settings)
- **History entries:** Score badge, page title, relative timestamp, mode, model info
- **Load/delete reports:** Click to reload, × to remove from history
- **Auto-save:** Every completed analysis automatically saved to history

### Changed
- **LLM Comment Sanitizer:** `sanitizeLLMOutput()` strips `//` and `/* */` comments before JSON parse
- **Smart Deduplication:** Element + keyword fingerprinting instead of exact description match
- **Empty Output Filtering:** `isPlaceholder()` removes "No description" / blank entries
- **Color palette:** Neon cyan/purple → single indigo accent (#6366f1) + neutral grays
- **Emoji removal:** All emojis replaced with CSS dots and plain text
- **Logo simplification:** Gradient S icon → text-only "synthux" typemark
- **Button/card styling:** Gradients → flat solid, glow effects removed

---

## [1.0.0] - 2026-04-21

### Added
- Chrome Extension with Manifest V3 and Side Panel UI
- Active page scanning via Content Script (DOM, accessibility, navigation, content)
- Screenshot capture for visual reference
- Ollama integration (local AI) with Gemma 3/4 support
- Nielsen's 10 Usability Heuristics evaluation engine
- 3 synthetic user profiles: First-Time Visitor, Power User, Accessibility User
- Quick mode (3 heuristics) and Deep mode (10 heuristics)
- Automated accessibility audit (10 deterministic checks)
- Interactive report viewer with per-profile tabs and expandable heuristic cards
- Markdown export (copy to clipboard)
- Settings panel with Ollama connection test and model selection
- Internationalization support (English, Turkish)
- Premium dark theme UI with Lit Web Components
- MIT License
