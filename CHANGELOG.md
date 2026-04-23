# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
