# Privacy Policy

**Last updated:** June 9, 2026

## Overview

synthux is an open-source Chrome extension that performs UX/UI analysis using local or cloud AI. We are committed to protecting your privacy. This policy explains what data synthux accesses, how it is processed, and what is stored.

**The short version:** synthux does not collect, transmit, or share any personal data with us. When using local AI (Ollama), all processing stays on your machine. When using cloud AI (BYOK mode), data is sent directly to your chosen provider using your own API key — we never see it.

## Data Collection

### What synthux accesses

When you initiate an analysis, synthux temporarily reads the following data from the active browser tab:

- **DOM structure:** HTML headings, forms, links, buttons, navigation elements, and landmarks
- **Accessibility attributes:** ARIA roles, alt text, tab order, and focus indicators
- **Page metadata:** Title, description, language, viewport settings
- **Visual metrics:** Screenshot of the visible area (for vision analysis and report reference)
- **Performance indicators:** DOM size, image count, script count
- **Flow Builder data:** When using Flow Builder, screenshots of each page in the flow are captured and temporarily held in memory for cross-page analysis

### What synthux does NOT access

- Passwords, form inputs, or autofill data
- Cookies or session tokens
- Browser history or bookmarks
- Files on your computer
- Data from other tabs or windows
- Any data when analysis is not actively running

## Data Processing

synthux supports two processing modes:

### Local AI (Ollama — default)

- Page data is sent to Ollama running on `localhost:11434`
- The AI model (e.g., Gemma 4) processes the data entirely on your machine
- No data leaves your device

### Cloud AI (BYOK — Bring Your Own Key)

When you explicitly configure a cloud provider in Settings, page data is sent directly to your chosen AI provider:

- **Google Gemini** — via `generativelanguage.googleapis.com`
- **OpenAI** — via `api.openai.com`
- **Anthropic Claude** — via `api.anthropic.com`

Important:
- This is entirely **opt-in**; you must manually enter your own API key
- Data is sent directly from your browser to the provider — **we never proxy, intercept, or see your data or API keys**
- API keys are stored only in `chrome.storage.local` on your device
- You are subject to the privacy policies of your chosen AI provider

## Data Storage

- **Analysis reports** are saved in `chrome.storage.local` (browser-local storage)
- Reports remain on your device and are never synced or uploaded
- **Settings** (Ollama endpoint, model selection, API keys, language preference) are stored in `chrome.storage.local`
- **Flow Builder data** (page screenshots, connections, sticky notes, analysis results) is stored in `chrome.storage.local` under the key `synthux_flows`
- You can delete all stored data by removing the extension or clearing extension data in Chrome settings
- Maximum 20 reports are retained; older reports are automatically removed
- Flow data is stored independently and can be managed (saved, loaded, deleted) within the Flow Builder UI

## Data Sharing

synthux does **not** share any data with:

- The extension developers
- Third-party analytics services
- Advertising networks
- Any external server or API

## Permissions Explained

synthux requires the following Chrome permissions:

| Permission | Purpose | Data Impact |
| :--------- | :------ | :---------- |
| `activeTab` | Read the current page's DOM for analysis | Page content accessed only during active analysis |
| `scripting` | Inject the content script that extracts page data | Required for DOM reading; runs only when triggered |
| `sidePanel` | Display the analysis UI in Chrome's Side Panel | No data access |
| `storage` | Save settings and report history locally | Local-only, never synced |
| `tabs` | Read the current tab's URL and title for reports | URL/title only; no browsing history |

### Host Permissions

| Host | Purpose |
| :--- | :------ |
| `http://localhost:11434/*` | Communicate with local Ollama AI server |
| `http://127.0.0.1:17483/*` | Communicate with local `synthux-mcp` Model Context Protocol bridge (loopback only) |
| `https://generativelanguage.googleapis.com/*` | Google Gemini API (BYOK mode only) |
| `https://api.openai.com/*` | OpenAI API (BYOK mode only) |
| `https://api.anthropic.com/*` | Anthropic Claude API (BYOK mode only) |
| `<all_urls>` | Enable analysis on any website the user visits |

### Model Context Protocol (MCP) Local Agent Bridge

When the local **MCP Agent Bridge** (`synthux-mcp`) is enabled in Settings, desktop AI coding assistants (such as Google Antigravity, Claude Code / Desktop, Cursor, OpenAI Codex, or local LLM MCP hosts) can trigger UX and WCAG 2.2 AA audits in your browser:

- **100% Loopback-Only (`127.0.0.1`):** All MCP communication stays strictly on your local loopback interface (`127.0.0.1:17483`). No external or LAN connections are accepted.
- **Origin-Verified:** Requests originating from regular web pages (`http://` or `https://` `Origin` headers) are blocked (`403 Forbidden`) to prevent cross-site request forgery or WebSocket hijacking.
- **API Key Isolation:** Stored BYOK API keys are never transmitted or exposed over the MCP bridge.
- **User Control:** You can toggle the MCP Agent Bridge on or off at any time in the extension's Settings tab and optionally require a secret pairing token (`SYNTHUX_MCP_TOKEN`).

> **Why `<all_urls>`?** synthux needs to inject a content script to read page structure on any website the user chooses to analyze. This permission is only exercised when the user actively initiates an analysis. The extension does not run background scripts on pages or monitor browsing activity.

## Flow Builder

The Flow Builder feature allows you to map multi-page user journeys for cross-page UX analysis:

- **Screenshots** of each page in the flow are captured and stored temporarily in memory during analysis
- **Flow data** (page metadata, connections, sticky notes) is saved to `chrome.storage.local` when you explicitly save a flow
- Screenshots sent to AI for analysis are **downscaled to 800×600** to minimize data size
- All flow analysis follows the same local/cloud processing rules described above
- Flow data never leaves your device unless you are using BYOK cloud mode, in which case it is sent directly to your chosen provider

## Developer Information

synthux is developed and maintained by:

- **Developer:** Ufuk Aydın
- **GitHub:** [github.com/ufhouck](https://github.com/ufhouck)
- **Organization:** [github.com/synthuxapp](https://github.com/synthuxapp)
- **Contact:** [Open an issue](https://github.com/synthuxapp/synthux/issues)

## Children's Privacy

synthux is a developer/designer tool and is not directed at children under 13. We do not knowingly collect data from children.

## Open Source Transparency

synthux is fully open source under the [MIT License](LICENSE). You can:

- **Inspect the source code** at [github.com/synthuxapp/synthux](https://github.com/synthuxapp/synthux)
- **Verify these claims** by reviewing the codebase
- **Build from source** to ensure the extension matches the published code

## Changes to This Policy

We may update this privacy policy from time to time. Changes will be documented in the [CHANGELOG](CHANGELOG.md) and reflected in the "Last updated" date above.

## Contact

If you have questions about this privacy policy, please [open an issue](https://github.com/synthuxapp/synthux/issues) on our GitHub repository.
