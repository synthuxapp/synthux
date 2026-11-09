---
name: synthux-mcp-audit
description: >-
  Run end-to-end UX, Heuristic, Multi-Page User Flow, and WCAG 2.2 AA audits on any website
  by connecting Google Antigravity (or any MCP agent) to the synthux Chrome Extension and
  MCP Server (`mcp/server.js`). Use when auditing websites, evaluating UI/UX with Sectoral
  Rule Packs (Nielsen 10, E-Commerce, SaaS, Fintech), testing synthetic user personas, or
  rendering live issue heatmaps and Enhanced v2.0 UX reports.
---

# synthux MCP Audit Skill (Antigravity Integration)

This skill enables **Google Antigravity** (and other MCP-compatible agents) to control 100% of the **synthux** Chrome Extension and UX Audit Engine via the local Model Context Protocol bridge (`mcp/server.js`).

## Workflow 1: Agent-Brain Mode (Antigravity Evaluates Directly)

1. **Open & Scan Target URL:**
   - Call `synthux_open_url({ url: "https://target-site.com" })` if auditing a live browser tab.
   - Call `synthux_prepare_external_audit({ url: "https://target-site.com", rulePackId: "fintech", mode: "deep", profiles: ["first-time", "accessibility"] })`.
2. **Evaluate Heuristics:**
   - Review the returned `pageData`, `accessibilityResults` (including `axe-core` WCAG 2.2 AA violations), and `evaluationTasks` prompts.
   - Generate structured heuristic evaluations (`score`, `summary`, `issues` with CSS selectors and `code_fix`, `positives`, `score_justification`).
3. **Render Live Overlays & Generate v2.0 Report:**
   - Call `synthux_submit_external_audit({ rulePackId: "fintech", model: "Gemini 4 Argon", showHeatmap: true, evaluations: [...] })`.
   - This automatically renders the live **Issue Heatmap** on the Chrome tab, captures an **Annotated Visual Audit** screenshot, updates the Side Panel UI, and returns the **Enhanced v2.0 Markdown & JSON Report**.

## Workflow 2: Autonomous Extension AI Engine (Local Ollama / BYOK Cloud)

1. Call `synthux_configure_ai({ action: "update", provider: "ollama", model: "gemma4" })` (or `gemini`, `openai`, `claude`).
2. Call `synthux_run_ux_audit({ url: "https://target-site.com", rulePackId: "ecommerce", mode: "quick" })`.
3. Export the report via `synthux_get_reports({ action: "latest", format: "markdown" })`.

## Workflow 3: Automated Verification & E2E Test Suite

Run the complete MCP protocol, security, rule pack, persona, accessibility, and WebSocket bridge test suite:

```bash
npm run test:mcp
```
