# Privacy Policy

**Last updated:** April 23, 2026

## Overview

synthux is an open-source Chrome extension that performs UX/UI analysis using local AI. We are committed to protecting your privacy. This policy explains what data synthux accesses, how it is processed, and what is stored.

**The short version:** synthux does not collect, transmit, or share any personal data. All processing happens locally on your machine.

## Data Collection

### What synthux accesses

When you initiate an analysis, synthux temporarily reads the following data from the active browser tab:

- **DOM structure:** HTML headings, forms, links, buttons, navigation elements, and landmarks
- **Accessibility attributes:** ARIA roles, alt text, tab order, and focus indicators
- **Page metadata:** Title, description, language, viewport settings
- **Visual metrics:** Screenshot of the visible area (for report reference only)
- **Performance indicators:** DOM size, image count, script count

### What synthux does NOT access

- Passwords, form inputs, or autofill data
- Cookies or session tokens
- Browser history or bookmarks
- Files on your computer
- Data from other tabs or windows
- Any data when analysis is not actively running

## Data Processing

All analysis is performed **entirely on your local machine** using [Ollama](https://ollama.com), an open-source local AI runtime. Specifically:

- Page data is sent to Ollama running on `localhost:11434`
- The AI model (e.g., Gemma 3/4) processes the data locally
- No data is transmitted to external servers, cloud services, or third parties
- No API calls are made to remote AI services (unless the user explicitly configures BYOK mode in future versions)

## Data Storage

- **Analysis reports** are saved in `chrome.storage.local` (browser-local storage)
- Reports remain on your device and are never synced or uploaded
- **Settings** (Ollama endpoint, model selection, language preference) are stored in `chrome.storage.local`
- You can delete all stored data by removing the extension or clearing extension data in Chrome settings
- Maximum 20 reports are retained; older reports are automatically removed

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
| `<all_urls>` | Enable analysis on any website the user visits |

> **Why `<all_urls>`?** synthux needs to inject a content script to read page structure on any website the user chooses to analyze. This permission is only exercised when the user actively initiates an analysis. The extension does not run background scripts on pages or monitor browsing activity.

## Future: BYOK (Bring Your Own Key) Mode

A future version of synthux may support BYOK mode, where users can optionally use their own API keys for cloud AI services (OpenAI, Google Gemini, Anthropic Claude). In this mode:

- Data will be sent to the user's chosen AI provider using the user's own API key
- This is entirely opt-in; local Ollama remains the default
- Users will be clearly informed before any data leaves their machine
- The extension developers never have access to user API keys

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
