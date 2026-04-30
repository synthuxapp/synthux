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
  <a href="https://github.com/synthuxapp/synthux/issues">Issues</a>
</p>

---

## ✨ What is synthux?

synthux is an open-source Chrome extension that evaluates web pages using **synthetic user profiles** and **Nielsen's 10 Usability Heuristics** — powered by local or cloud AI.

Run locally with Ollama for free, or use your own API key with Gemini, OpenAI, or Claude.

## 🚀 Features

- 🤖 **Multi-Provider AI** — Ollama (local), Google Gemini, OpenAI GPT-5, Anthropic Claude
- 📸 **Vision Analysis** — Full-page screenshot capture for visual layout evaluation
- 📋 **Nielsen's 10 Heuristics** — Industry-standard UX evaluation framework
- 👥 **Synthetic User Profiles** — 3 built-in + up to 5 custom personas (age, tech level, accessibility needs, goals)
- ♿ **WCAG Audit (axe-core)** — Automated WCAG 2.2 AA compliance testing with impact severity and fix references
- 📊 **Detailed Scoring** — 0-100 scores per heuristic with actionable recommendations
- 🔧 **Code Fixes** — Concrete before/after code suggestions for each issue
- ⚡ **Quick Wins** — Priority matrix highlights high-impact, easy-fix issues
- 💰 **Cost Tracking** — Real-time API cost estimation with verified pricing
- 📄 **PDF & Markdown Export** — Professional reports for stakeholders
- 🔓 **100% Private** — BYOK (Bring Your Own Key) — no middleman, no data collection
- ⚡ **Quick, Deep & Custom Modes** — 3-heuristic scan, full 10-heuristic analysis, or pick your own
- ⏱️ **Dynamic Time Estimates** — Realistic duration based on profile count × heuristics × provider speed

## 📦 Quick Start

### Option A — Local AI (Free)

**1. Install [Ollama](https://ollama.com)**

```bash
# macOS
brew install ollama
```

**2. Pull a model**

```bash
ollama pull gemma4         # Gemma 4 — recommended
ollama pull qwen3.5        # Qwen 3.5 — alternative
ollama pull llama4         # Llama 4 — alternative
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

> ⚠️ **Ollama updates may reset this setting.** If you get a CORS error after updating, repeat and restart.

### Option B — Cloud API (BYOK)

No local setup needed. Just enter your API key in Settings:

| Provider | Models | Cost (Quick scan) |
|:--|:--|:--|
| **Google Gemini** | Gemini 2.5 Flash, Pro | ~$0.05 |
| **OpenAI** | GPT-5.4, GPT-5.4-mini | ~$0.15 |
| **Anthropic** | Claude Sonnet 4.6, Haiku 4.5 | ~$0.20 |

### Install Extension

**Option 1 — Chrome Web Store** (recommended)

➡️ [**Install from Chrome Web Store**](https://chromewebstore.google.com/detail/synthux/cgldigellmojaejmnhjhpbfccncbmnhm)

**Option 2 — From Source** (for development)

1. Clone: `git clone https://github.com/synthuxapp/synthux.git`
2. Run `npm install && npm run build`
3. Open Chrome → `chrome://extensions`
4. Enable **Developer mode**
5. Click **Load unpacked** → Select the `extension/` folder

### Analyze!

1. Navigate to any website
2. Open synthux Side Panel
3. Select mode (Quick / Deep / Custom)
4. Click **"Analyze Page"**
5. View results, filter issues, export as PDF or Markdown

## 📸 Vision Analysis (v1.6)

When enabled, synthux captures a full-page screenshot and sends it alongside the DOM data to vision-capable AI models. This enables:

- **Visual hierarchy analysis** — Are headings and CTAs visually prominent?
- **Color harmony** — Do colors work well together?
- **Layout & spacing** — Is whitespace balanced and elements aligned?
- **CTA visibility** — Are call-to-action buttons discoverable?
- **Typography** — Is text readable at appropriate sizes?

Toggle in **Settings → Analysis → Screenshot Analysis**.

## 🏗️ Architecture

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
- **Vision** captures full-page JPEG (scroll + stitch) for multimodal analysis

## 🧩 Project Structure

```
synthuxapp/
├── extension/                  # Chrome Extension (load this in Chrome)
│   ├── manifest.json           # Manifest V3
│   ├── background/             # Service Worker
│   ├── content/                # Page scanning content script
│   ├── sidepanel/              # Side Panel UI (HTML + CSS + bundled JS)
│   ├── core/                   # Business logic modules
│   │   ├── analyzer.js         # Analysis orchestrator
│   │   ├── ai-client.js        # AI provider abstraction
│   │   ├── providers.js        # Ollama, OpenAI, Gemini, Claude adapters
│   │   ├── heuristics.js       # Prompt builder + JSON parser
│   │   ├── screenshot.js       # Full-page capture + stitch
│   │   ├── cost-calculator.js  # Token cost estimation
│   │   └── report-generator.js # Markdown + JSON report
│   ├── rules/                  # Heuristic rule definitions (JSON)
│   ├── assets/                 # Icons and logo
│   └── _locales/               # i18n (en, tr)
├── src/                        # Source code (Lit components)
│   └── sidepanel/
│       ├── app.js              # Root component
│       └── components/         # Scanner, Report, Settings, Score
├── website/                    # Landing page (synthux.app)
└── docs/                       # Documentation
```

## 🛠️ Development

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

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

**Ways to contribute:**
- 🐛 Report bugs
- 💡 Suggest features
- 📋 Add new heuristic rule sets (e.g., e-commerce, SaaS)
- 🌍 Add translations
- 📖 Improve documentation

## 📄 License

[MIT License](LICENSE) — free to use, modify, and distribute.

## 🔒 Security & Privacy

- **Privacy-first:** Local analysis via Ollama never leaves your machine. Cloud providers use your own API key directly — no middleman.
- **BYOK model:** API keys are stored in Chrome's sandboxed local storage, never transmitted to third parties.
- **Security policy:** Found a vulnerability? See [SECURITY.md](SECURITY.md).
- **Automated security:** Dependabot, CodeQL, and OpenSSF Scorecard for continuous monitoring.
- **No telemetry:** synthux does not collect usage data, analytics, or telemetry of any kind.

## 🔮 Roadmap

- [x] MVP: Chrome Extension + Ollama + Nielsen 10 Heuristics
- [x] BYOK API Key support (OpenAI, Gemini, Claude)
- [x] PDF report export
- [x] Code fix suggestions (before/after)
- [x] Priority matrix (Quick Wins, Critical, Easy Fixes)
- [x] Vision analysis (screenshot + DOM)
- [x] Real-time cost estimation
- [x] WCAG full audit module (axe-core)
- [x] Custom synthetic profiles
- [ ] History diff (compare past reports)
- [ ] Annotated screenshots
- [ ] Competitor comparison (2 URLs side by side)
- [ ] Figma plugin version
- [ ] Sectoral rule packs (e-commerce, fintech, SaaS)

---

<p align="center">
  Made with 🧠 by <a href="https://github.com/synthuxapp">synthuxapp</a>
</p>
