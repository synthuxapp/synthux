<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="extension/assets/logo.svg" />
    <source media="(prefers-color-scheme: light)" srcset="extension/assets/logo-dark.svg" />
    <img src="extension/assets/logo-dark.svg" alt="synthux" height="48" />
  </picture>
</p>

<p align="center"><strong>AI-powered UX audit in your browser. Open source.</strong></p>



<p align="center">
  <a href="https://chromewebstore.google.com/detail/synthux/cgldigellmojaejmnhjhpbfccncbmnhm">Chrome Web Store</a> ·
  <a href="https://synthux.app">Website</a> ·
  <a href="docs/getting-started.md">Documentation</a> ·
  <a href="docs/CONTRIBUTING.md">Contributing</a> ·
  <a href="https://github.com/synthuxapp/synthux/releases">Releases</a> ·
  <a href="https://github.com/synthuxapp/synthux/issues">Issues</a>
</p>

---

## What is synthux?

synthux is an open-source Chrome extension that evaluates web pages using **synthetic user profiles** and **Nielsen's 10 Usability Heuristics** — powered by local or cloud AI.

Run locally with Ollama for free, or use your own API key with Gemini, OpenAI, or Claude.

## Features

- **MCP Server & AI Agent Bridge (`synthux-mcp`)** — Let Google Antigravity (Gemini 4 Argon), Claude Desktop/Code, Cursor, OpenAI Codex, or Windsurf control 100% of synthux via Model Context Protocol (14 tools, Stdio + Streamable HTTP, Agent-Brain mode)
- **Multi-Provider AI** — Ollama (local: Gemma 4, Qwen 3.8, Llama 4, DeepSeek R1), Google Gemini, OpenAI, Anthropic Claude
- **Sectoral Rule Packs & Plugin Ecosystem** — Built-in packs for General UX (Nielsen's 10), E-Commerce & Conversion, SaaS & Dashboards, and Fintech & Banking — plus custom `.json` rule pack plugin import
- **Vision Analysis** — Full-page screenshot capture for visual layout evaluation
- **Synthetic User Profiles** — 3 built-in + up to 5 custom personas (age, tech level, accessibility needs, goals)
- **WCAG Audit (axe-core)** — Automated WCAG 2.2 AA compliance testing with impact severity and fix references
- **Issue Heatmap** — Toggle a live heatmap overlay on the analyzed page showing issue density by severity
- **Hover-to-Highlight** — Hover any issue in the report to highlight the affected element directly on the page
- **Annotated Screenshots** — Viewport captures with numbered severity markers at issue element positions, embedded directly in PDF reports
- **Detailed Scoring** — 0-100 scores per heuristic with actionable recommendations
- **Code Fixes** — Concrete before/after code suggestions for each issue
- **Quick Wins & 2×2 Priority Matrix** — Categorizes issues by Impact × Effort (Quick Wins, Major Projects, Fill-Ins, Backlog)
- **Cost Tracking** — Real-time API cost estimation with verified pricing
- **Enhanced PDF & Markdown Export** — Executive KPI scorecard, annotated viewport issue maps, horizontal score bars, collapsible code fixes, and 2×2 priority matrix
- **100% Private** — BYOK (Bring Your Own Key) — no middleman, no data collection
- **Quick, Deep & Custom Modes** — 3-rule scan, full pack analysis, or pick your own rules
- **Dynamic Time Estimates** — Realistic duration based on profile count × heuristics × provider speed
- **Flow Builder** — Visual canvas for multi-page user journey analysis. Connect pages, add sticky notes, run cross-page UX evaluation, save & load multiple flows

## Quick Start

### Option A — Local AI (Free)

**1. Install [Ollama](https://ollama.com)**

```bash
# macOS
brew install ollama
```

**2. Pull a 2026 model**

```bash
ollama pull gemma4         # Gemma 4 — recommended (Multimodal Vision)
ollama pull gemma4:e4b     # Gemma 4 E4B — fast, low RAM vision model
ollama pull qwen3.8        # Qwen 3.8 — top structured JSON & code fixes
ollama pull qwen3.5        # Qwen 3.5 — multimodal vision alternative
ollama pull llama4:scout   # Meta Llama 4 Scout — multimodal MoE
ollama pull deepseek-r1    # DeepSeek R1 — deep reasoning model
```

**3. Enable CORS**

```bash
# macOS
launchctl setenv OLLAMA_ORIGINS "*"
# Then quit and reopen Ollama
```

```bash
# Linux
export OLLAMA_ORIGINS="*" && ollama serve
```

```powershell
# Windows
[Environment]::SetEnvironmentVariable("OLLAMA_ORIGINS", "*", "User")
# Then restart Ollama
```

> **Ollama updates may reset this setting.** If you get a CORS error after updating, repeat and restart. synthux will detect this automatically and show a fix wizard.

### Option B — Cloud API (BYOK)

No local setup needed. Just enter your API key in Settings:

| Provider | Models | Cost (Quick scan) |
|:--|:--|:--|
| **Google Gemini** | Gemini 2.5 Flash, Pro | ~$0.05 |
| **OpenAI** | GPT-5.4, GPT-5.4-mini | ~$0.15 |
| **Anthropic** | Claude Sonnet 4.6, Haiku 4.5 | ~$0.20 |

### Install Extension

**Option 1 — Chrome Web Store** (recommended)

[**Install from Chrome Web Store**](https://chromewebstore.google.com/detail/synthux/cgldigellmojaejmnhjhpbfccncbmnhm)

**Option 2 — From Source** (for development)

1. Clone: `git clone https://github.com/synthuxapp/synthux.git`
2. Run `npm install && npm run build`
3. Open Chrome → `chrome://extensions`
4. Enable **Developer mode**
5. Click **Load unpacked** → Select the `extension/` folder

### Analyze

1. Navigate to any website
2. Open synthux Side Panel
3. Select mode (Quick / Deep / Custom)
4. Click **"Analyze Page"**
5. View results, filter issues, export as PDF or Markdown

## MCP Server & AI Coding Agents (`synthux-mcp`)

Starting in **v2.1.0**, desktop AI coding agents (**Google Antigravity / Gemini 4 Argon**, **Claude Desktop**, **Claude Code**, **Cursor**, **OpenAI Codex**, **Windsurf**) and local LLM MCP hosts can control the `synthux` Chrome extension end-to-end via the **Model Context Protocol (MCP)**.

### 1. Add to your Agent's `mcp_config.json` (Stdio)

```json
{
  "mcpServers": {
    "synthux": {
      "command": "npx",
      "args": ["-y", "synthux-mcp"]
    }
  }
}
```

Or connect via **Streamable HTTP** (`http://127.0.0.1:17483/mcp`) after starting `npm run mcp:start`.

### 2. Dual Evaluation Modes

- **Agent-Brain Mode (Zero Extra API Keys Needed):** Your host agent calls `prepare_external_audit` to capture the live DOM, `axe-core` WCAG 2.2 AA results, full-page screenshot, and Sectoral Rule Pack prompt, evaluates the UX with its own model brain (e.g., Gemini 4 Argon, Claude, GPT), and calls `submit_external_audit` to generate the full v2.0 Markdown/JSON report and sync it directly to the Chrome Side Panel UI.
- **Extension AI Engine Mode:** Your agent calls `run_ux_audit` or `open_and_audit_url` to trigger the extension's configured provider (Local Ollama or Cloud BYOK).

### 3. Available MCP Tools (14 Tools)

| Tool | Description |
|:--|:--|
| `get_extension_status` | Live WebSocket bridge status, active AI provider, rule packs, and security boundary |
| `list_browser_tabs` | List open audit-eligible Chrome tabs (`http://` & `https://`) |
| `open_and_audit_url` | Open a URL in Chrome, wait for load, and run an audit or prepare an Agent-Brain bundle |
| `scan_page_ux_context` | Extract DOM structure, headings, forms, contrast, navigation, and optional screenshot |
| `run_wcag_audit` | Run `axe-core` WCAG 2.2 AA accessibility compliance audit |
| `run_ux_audit` | Execute full UX audit (`quick`, `deep`, `custom`) with Rule Packs & Synthetic Personas |
| `prepare_external_audit` | Capture DOM + WCAG + Screenshot + Rule Pack prompt for host Agent-Brain evaluation |
| `submit_external_audit` | Compile Agent-Brain findings into a v2.0 report and sync to the Chrome Side Panel |
| `start_flow_analysis` | Run multi-page User Journey (Flow Builder) analysis across 2+ URLs |
| `toggle_heatmap` | Render or hide the live severity heatmap overlay on the browser tab |
| `highlight_issue` | Highlight & scroll to a specific CSS selector on the live page with a severity tooltip |
| `capture_annotated_screenshot` | Capture a viewport PNG with numbered severity markers drawn on issue elements |
| `manage_rule_packs` / `manage_personas` | List, inspect, or import custom `.json` Sectoral Rule Packs and Synthetic Personas |
| `configure_ai_provider` / `get_report_history` | Switch active AI provider/model or retrieve past UX audit reports |

See [`mcp/README.md`](mcp/README.md) for full protocol and security details.

## Vision Analysis

When enabled, synthux captures a full-page screenshot and sends it alongside the DOM data to vision-capable AI models. This enables:

- **Visual hierarchy analysis** — Are headings and CTAs visually prominent?
- **Color harmony** — Do colors work well together?
- **Layout & spacing** — Is whitespace balanced and elements aligned?
- **CTA visibility** — Are call-to-action buttons discoverable?
- **Typography** — Is text readable at appropriate sizes?

Toggle in **Settings → Analysis → Screenshot Analysis**.

## Flow Builder

The Flow Builder lets you map and analyze complete user journeys across multiple pages:

- **Visual Canvas** — Drag-and-drop page nodes on a Figma-style dotted canvas
- **Page Connections** — Draw connectors between pages to define the user flow
- **Sticky Notes** — Attach context notes to pages for the AI to consider during analysis
- **Cross-Page Analysis** — AI evaluates navigation consistency, visual coherence, flow logic, and terminology across all pages
- **Multi-Flow Saves** — Save, name, load, and delete multiple flows independently
- **Terminal Logs** — Real-time analysis progress shown in a floating terminal
- **Session Tracking** — Each analysis gets a unique session ID to prevent stale results

Open the Flow Builder from the extension menu or right-click context menu on any page.

## Architecture

```
Extension (Chrome Side Panel)
    ↕ messages
Service Worker (Background)
    ↕ fetch
Content Script (DOM Extraction) ←→ Active Page
    ↕
AI Provider:
  ├── Ollama (localhost:11434) — Local, free
  ├── Gemini API — Cloud, BYOK
  ├── OpenAI API — Cloud, BYOK
  └── Claude API — Cloud, BYOK
```

- **Content Script** extracts DOM structure, accessibility data, navigation, and content metrics
- **Service Worker** orchestrates: scanning → screenshot → AI evaluation → cost calc → report
- **Side Panel** (Lit Web Components) provides premium dark-themed UI
- **Overlay Manager** injects page overlays for heatmap, highlight, and annotation features
- **Vision** captures full-page JPEG (scroll + stitch) for multimodal analysis

## Project Structure

```
synthuxapp/
├── extension/                  # Chrome Extension (load this in Chrome)
│   ├── manifest.json           # Manifest V3 (v2.1.0)
│   ├── background/             # Service Worker + MCP Bridge integration
│   ├── content/                # Page scanning content script
│   ├── sidepanel/              # Side Panel UI (HTML + CSS + bundled JS)
│   ├── core/                   # Business logic modules
│   │   ├── analyzer.js         # Analysis orchestrator
│   │   ├── mcp-bridge.js       # Local WebSocket bridge to synthux-mcp (127.0.0.1:17483)
│   │   ├── ai-client.js        # AI provider abstraction
│   │   ├── providers.js        # Ollama, OpenAI, Gemini, Claude adapters
│   │   ├── heuristics.js       # Prompt builder + JSON parser
│   │   ├── screenshot.js       # Full-page capture + annotated screenshots
│   │   ├── flow-manager.js     # Multi-page flow analysis orchestrator
│   │   ├── cost-calculator.js  # Token cost estimation
│   │   └── report-generator.js # Markdown + JSON report
│   ├── rules/                  # Sectoral Heuristic Rule Packs (JSON)
│   ├── assets/                 # Icons and logo
│   └── _locales/               # i18n (en, tr)
├── mcp/                        # Model Context Protocol (MCP) Server (synthux-mcp)
│   ├── server.js               # Stdio + Streamable HTTP MCP server & WS bridge
│   ├── test-suite.js           # Automated E2E & Agent-Brain test suite
│   ├── package.json            # Publishable npm package (npx synthux-mcp)
│   └── README.md               # MCP setup & security guide
├── src/                        # Source code (Lit components)
│   └── sidepanel/
│       ├── app.js              # Root component
│       └── components/         # Scanner, Report, Settings, Score
├── website/                    # Landing page (synthux.app)
└── docs/                       # Documentation
```

## Page Overlay System

After analysis, synthux can interact with the page directly:

- **Hover-to-Highlight** — Hover an issue in the report → the affected element is highlighted on the page with a severity-colored border and tooltip.
- **Heatmap Toggle** — Switch on from the report to render a canvas-based severity heatmap over the page.
- **Annotated Screenshot** — Capture a viewport screenshot with numbered markers at each issue location.

The overlay system uses a self-contained content script (`overlay-manager.js`) injected on demand via `chrome.scripting.executeScript`.

## Development

```bash
# Install dependencies
npm install

# Build Side Panel bundle
npm run build

# Watch mode (auto-rebuild on changes)
npm run dev

# Lint extension
npm run lint:ext

# Code formatting
npm run format
```

After building, load the `extension/` folder in Chrome as an unpacked extension.

## Contributing

We welcome contributions! See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

**Ways to contribute:**
- Report bugs
- Suggest features
- Add new heuristic rule sets (e.g., e-commerce, SaaS)
- Add translations
- Improve documentation

## License

[MIT License](LICENSE) — free to use, modify, and distribute.

## Security & Privacy

- **Privacy-first:** Local analysis via Ollama never leaves your machine. Cloud providers use your own API key directly — no middleman.
- **BYOK model:** API keys are stored in Chrome's sandboxed local storage, never transmitted to third parties.
- **Security policy:** Found a vulnerability? See [SECURITY.md](SECURITY.md).
- **Automated security:** Dependabot, CodeQL, and OpenSSF Scorecard for continuous monitoring.
- **No telemetry:** synthux does not collect usage data, analytics, or telemetry of any kind.

## Roadmap

### Done
- [x] MVP: Chrome Extension + Ollama + Nielsen 10 Heuristics
- [x] BYOK API Key support (OpenAI, Gemini, Claude)
- [x] PDF report export
- [x] Code fix suggestions (before/after)
- [x] Priority matrix (Quick Wins, Critical, Easy Fixes)
- [x] Vision analysis (screenshot + DOM)
- [x] Real-time cost estimation
- [x] WCAG full audit module (axe-core)
- [x] Custom synthetic profiles
- [x] Issue heatmap overlay
- [x] Hover-to-highlight on page
- [x] Annotated screenshots
- [x] Ollama CORS auto-diagnostics & fix wizard

### v1.9.0
- [x] Multi-page user flow analysis (Flow Builder)
- [x] Heatmap visualization improvements (gradient, legend, pulse animations)
- [x] Chrome Web Store rating prompt
- [x] Privacy policy update (Flow Analysis, BYOK transparency, developer info)

### v2.0.0
- [x] Sectoral Rule Packs & Plugin Ecosystem (`nielsen-10`, `ecommerce`, `saas`, `fintech` + custom JSON rule pack plugin import)
- [x] Enhanced Reporting (richer PDF & Markdown templates with Executive KPI scorecard, 2×2 Impact × Effort priority matrix, annotated viewport issue maps, visual score bars, and collapsible before/after code fixes)
- [x] 2026 Local LLM Updates (`gemma4`, `gemma4:e4b`, `qwen3.8`, `llama4:scout`, `deepseek-r1` with `<think>` block sanitization)
- [x] Right-click Context Menu integration ("Analyze in synthux Flow")

### v2.1.0 (Current)
- [x] **Model Context Protocol (MCP) Server & Chrome Extension Agent Bridge (`synthux-mcp`)** — 14 MCP tools over Stdio & Streamable HTTP (`127.0.0.1:17483`) for Google Antigravity (Gemini 4 Argon), Claude Desktop/Code, Cursor, OpenAI Codex, and Windsurf
- [x] **Agent-Brain Evaluation Mode** — Host AI agents can evaluate live DOM + WCAG + Screenshots using their own LLM reasoning (`prepare_external_audit` + `submit_external_audit`) and sync reports to the Chrome Side Panel
- [x] **Hardened Loopback Security** — Strict `127.0.0.1` binding, `Origin` CSRF firewall blocking web pages, optional `SYNTHUX_MCP_TOKEN` pairing, and zero API key exposure
- [x] **Automated E2E MCP Test Suite (`npm run test:mcp`)** — 16 automated test suites verifying full protocol & extension bridge parity

### Future
- [ ] **synthux insights** — Auto-fetched research library from NNGroup and Baymard Institute; AI uses latest UX research findings during analysis for evidence-based recommendations
- [ ] Walkthrough mode (guided issue tour on page)

---

<p align="center">
  Made by <a href="https://github.com/ufhouck">Ufuk Aydın</a> · <a href="https://github.com/synthuxapp">synthuxapp</a>
</p>
