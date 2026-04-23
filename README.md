<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="extension/assets/logo.svg" />
    <source media="(prefers-color-scheme: light)" srcset="extension/assets/logo-dark.svg" />
    <img src="extension/assets/logo-dark.svg" alt="synthux" height="48" />
  </picture>
</p>

<p align="center"><strong>AI-powered UX audit in your browser. Open source.</strong></p>



<p align="center">
  <a href="https://synthux.app">Website</a> ·
  <a href="docs/getting-started.md">Documentation</a> ·
  <a href="docs/CONTRIBUTING.md">Contributing</a> ·
  <a href="https://github.com/synthuxapp/synthux/issues">Issues</a>
</p>

---

## ✨ What is synthux?

synthux is an open-source Chrome extension that evaluates web pages using **synthetic user profiles** and **Nielsen's 10 Usability Heuristics** — powered by local AI (Ollama).

No data leaves your machine. No API costs. No signup.

## 🚀 Features

- 🤖 **Local AI Analysis** — Ollama, LM Studio, or any Ollama-compatible backend (Gemma 4, Qwen, Llama)
- 📋 **Nielsen's 10 Heuristics** — Industry-standard UX evaluation framework
- 👥 **Synthetic User Profiles** — First-time visitor, power user, accessibility user
- ♿ **Automated Accessibility Audit** — WCAG contrast, alt text, heading structure, landmarks
- 📊 **Detailed Scoring** — 0-100 scores per heuristic with actionable recommendations
- 🔓 **100% Private** — Your data never leaves your machine
- 📝 **Markdown Export** — Copy reports to Notion, GitHub Issues, or any markdown editor
- ⚡ **Quick & Deep Modes** — Fast 3-heuristic scan or full 10-heuristic analysis

## 📦 Quick Start

### 1. Install a Local AI Backend

**Option A — [Ollama](https://ollama.com)** (recommended)

```bash
# macOS
brew install ollama
# Or download from https://ollama.com
```

**Option B — [LM Studio](https://lmstudio.ai)**

Download and install. Start the local server — default endpoint is `http://localhost:1234`. No CORS configuration needed.

### 2. Pull a Model (Ollama only)

```bash
ollama pull gemma4         # Gemma 4 — recommended
ollama pull qwen3.5        # Qwen 3.5 — alternative
ollama pull llama4         # Llama 4 — alternative
```

LM Studio users: download a model from the built-in catalog instead.

### 3. Enable Chrome Extension Access (Ollama only)

Ollama blocks browser extension requests by default. Run the command for your platform, then **restart Ollama**:

**macOS (app)**
```bash
launchctl setenv OLLAMA_ORIGINS "*"
# Then quit and reopen Ollama from the menu bar
```

**Linux / Terminal**
```bash
export OLLAMA_ORIGINS="*"
ollama serve
```

**Windows (PowerShell)**
```powershell
[Environment]::SetEnvironmentVariable("OLLAMA_ORIGINS", "*", "User")
# Then restart Ollama
```

> ⚠️ **Ollama updates may reset this setting.** If you get a CORS error after updating Ollama, repeat this step and restart.

LM Studio users can skip this step.

### 4. Install Extension

- Clone this repo: `git clone https://github.com/synthuxapp/synthux.git`
- Open Chrome → `chrome://extensions`
- Enable "Developer mode"
- Click "Load unpacked" → Select the `extension/` folder
- Click the synthux icon → Side Panel opens

### 5. Analyze!

1. Navigate to any website
2. Open synthux Side Panel
3. Select profiles and analysis mode
4. Click **"Analyze Page"**
5. View results and export as Markdown

## 🏗️ Architecture

```
Extension (Chrome Side Panel)
    ↕ messages
Service Worker (Background)
    ↕ fetch
Content Script (DOM Extraction) ←→ Active Page
    ↕
Ollama (localhost:11434) / LM Studio (localhost:1234) ←→ Local AI Model
```

- **Content Script** extracts DOM structure, accessibility data, navigation, and content metrics
- **Service Worker** orchestrates analysis: scanning → screenshot → AI evaluation → report
- **Side Panel** (Lit Web Components) provides premium dark-themed UI for control and viewing
- **Ollama** runs locally, processing heuristic evaluations with synthetic user personas

## 🧩 Project Structure

```
synthuxapp/
├── extension/                  # Chrome Extension (load this in Chrome)
│   ├── manifest.json           # Manifest V3
│   ├── background/             # Service Worker
│   ├── content/                # Page scanning content script
│   ├── sidepanel/              # Side Panel UI (HTML + CSS + bundled JS)
│   ├── core/                   # Business logic modules
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

## 🌍 Supported Languages

- 🇬🇧 English (default)
- 🇹🇷 Türkçe

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

- **Privacy-first:** All analysis runs locally via Ollama. No data leaves your machine. See our [Privacy Policy](PRIVACY.md).
- **Security policy:** Found a vulnerability? Please report it responsibly. See [SECURITY.md](SECURITY.md).
- **Automated security:** This project uses Dependabot, CodeQL, and OpenSSF Scorecard for continuous security monitoring.
- **No telemetry:** synthux does not collect usage data, analytics, or telemetry of any kind.

## 🔮 Roadmap

- [x] MVP: Chrome Extension + Ollama + Nielsen 10 Heuristics
- [ ] BYOK API Key support (OpenAI, Gemini, Claude)
- [ ] PDF report export
- [ ] WCAG full audit module
- [ ] Custom synthetic profiles
- [ ] Competitor comparison (2 URLs side by side)
- [ ] Figma plugin version
- [ ] Sectoral rule packs (e-commerce, fintech, SaaS)

---

<p align="center">
  Made with 🧠 by <a href="https://github.com/synthuxapp">synthuxapp</a>
</p>
