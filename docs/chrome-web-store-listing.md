# Chrome Web Store — Listing Materials

## Extension Name
synthux — AI UX Audit

## Short Description (132 char max)
AI-powered UX audit in your browser. Evaluate any page with synthetic user profiles and Nielsen's 10 heuristics. 100% local & private.

## Detailed Description (Chrome Web Store)

Analyze any website's UX quality using AI — right from your browser.

synthux evaluates web pages using Nielsen's 10 Usability Heuristics and synthetic user profiles, powered by local AI (Ollama). All processing happens on your machine. No data leaves your browser. No signup. No API costs.

⸻ FEATURES ⸻

🤖 Local AI Analysis
Run Ollama with Gemma 4, Qwen, Llama, or any model you prefer. Everything stays on your machine.

📋 Nielsen's 10 Heuristics
Industry-standard UX evaluation framework with per-heuristic scoring (0–100).

👥 Synthetic User Profiles
Evaluate as a first-time visitor, power user, or accessibility user — each with different expectations.

♿ Accessibility Audit
WCAG contrast checks, alt text validation, heading structure, and keyboard navigation analysis.

📊 Detailed Scoring
Overall UX score (0–100) with breakdowns per heuristic and actionable recommendations.

📝 Markdown Export
Download reports as .md files — perfect for Notion, GitHub Issues, or design handoffs.

⚡ Quick & Deep Modes
Fast 3-heuristic scan or full 10-heuristic deep analysis.

🔓 100% Private
Your data never leaves your machine. Open source under MIT License.

⸻ HOW IT WORKS ⸻

1. Install Ollama (ollama.com) and pull a model
2. Enable Chrome extension access (see Setup Guide in Settings)
3. Navigate to any website
4. Open synthux Side Panel
5. Click "Analyze Page"
6. View results and export as Markdown

⸻ REQUIREMENTS ⸻

• Ollama or LM Studio running locally
• A language model (Gemma 4, Qwen, Llama, etc.)
• Chrome 116+ (Side Panel API)

⸻ OPEN SOURCE ⸻

synthux is free and open source: https://github.com/synthuxapp/synthux

Found a bug? Have a feature request? Open an issue on GitHub.

---

## Category
Developer Tools

## Language
English (United States)

## Privacy Policy URL
https://synthux.app/privacy.html

## Single Purpose Description (for review)
synthux analyzes the UX quality of web pages using local AI (Ollama) and Nielsen's 10 Usability Heuristics, providing actionable scores and recommendations.

## Host Permission Justification

### `<all_urls>`
Required to inject a content script that reads the DOM structure (headings, forms, links, navigation, accessibility attributes) of any website the user chooses to analyze. The content script only executes when the user explicitly clicks "Analyze Page" in the Side Panel. No background scanning, monitoring, or data collection occurs. The extension does not access page data unless the user initiates an analysis.

### `http://localhost:11434/*`
Required to communicate with Ollama, a local AI server running on the user's machine. This is a localhost-only connection. No external network requests are made for AI processing.

## Privacy Practices Tab — Data Disclosure

### Does the extension collect or use personal data?
No

### Detailed breakdown:
- Personally identifiable information: NOT collected
- Health information: NOT collected
- Financial and payment information: NOT collected
- Authentication information: NOT collected
- Personal communications: NOT collected
- Location: NOT collected
- Web history: NOT collected
- User activity: NOT collected (page DOM is read only during user-initiated analysis and is never stored or transmitted externally)
- Website content: Temporarily accessed during analysis, processed locally, never transmitted

### Certifications:
- [x] I do not sell user data to third parties
- [x] I do not use or transfer user data for purposes unrelated to the item's core functionality
- [x] I do not use or transfer user data to determine creditworthiness or for lending purposes

## Screenshot Descriptions (for alt text)

1. **Scanner view** — synthux Side Panel showing the scan interface with profile selection and analysis mode toggle
2. **Analysis in progress** — Real-time terminal log showing heuristic evaluation progress
3. **Report results** — Detailed UX report with overall score, heuristic breakdown, and severity badges
4. **Settings panel** — Ollama connection settings and setup guide
5. **Markdown export** — Downloaded .md report file
