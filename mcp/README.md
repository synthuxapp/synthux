# synthux-mcp — Official Model Context Protocol (MCP) Server

Connect desktop AI coding agents (**Google Antigravity**, **Claude Desktop / Claude Code**, **Cursor**, **OpenAI Codex**, **Windsurf**, or **Local LLM MCP Hosts**) directly to the **synthux** Chrome Extension and UX Audit Engine.

## Architecture & Security

- **Dual MCP Transport:** Supports both **Stdio** (`npx -y synthux-mcp` / `node mcp/server.js`) and **Streamable HTTP** (`http://127.0.0.1:17483/mcp`).
- **Live Chrome Extension Bridge:** Connects to the synthux MV3 Chrome Extension over local WebSocket (`ws://127.0.0.1:17483/ws`).
- **Two AI Evaluation Modes:**
  1. **Agent-Brain Mode (Passthrough):** Your connected MCP Agent (e.g., Antigravity Gemini 4 Argon, Claude, Codex) uses `synthux_prepare_external_audit` to scan the live DOM, run `axe-core` WCAG 2.2 AA checks, and get Sectoral Rule Pack prompts — evaluates them with its own intelligence — and calls `synthux_submit_external_audit` to render live page heatmaps, annotated screenshots, and Enhanced v2.0 Markdown/JSON reports.
  2. **Extension AI Engine Mode:** Trigger `synthux_run_ux_audit` to run the audit using the extension's configured **Local LLM (Ollama: `gemma4`, `qwen3.8`, `deepseek-r1`)** or **Cloud BYOK API (`Gemini`, `OpenAI`, `Claude`)**.
- **Privacy & Security Hardened:**
  - Strictly bound to `127.0.0.1` loopback (never exposed to LAN/`0.0.0.0`).
  - Strict Origin Verification blocks all `http://` and `https://` web page origins from accessing `/ws` or `/mcp` (CSRF / WebSocket hijacking protection).
  - Optional `SYNTHUX_MCP_TOKEN` pairing token for high-security workstations.
  - Zero telemetry and automatic API key redaction.

---

## Quick Setup (`mcp_config.json`)

### Google Antigravity (`~/.gemini/config/mcp_config.json`) / Claude / Cursor

```json
{
  "mcpServers": {
    "synthux": {
      "command": "node",
      "args": ["/path/to/synthux/mcp/server.js"]
    }
  }
}
```

Or via `npx`:

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

Or via **Streamable HTTP**:

```json
{
  "mcpServers": {
    "synthux": {
      "url": "http://127.0.0.1:17483/mcp"
    }
  }
}
```

---

## Available MCP Tools (14 Tools)

| Tool | Description |
| :--- | :--- |
| `synthux_status` | Check MCP bridge, Chrome extension connection, active tab, Rule Packs, Personas, and AI status |
| `synthux_open_url` | Open or navigate a Chrome tab to a target URL and wait for load completion |
| `synthux_list_tabs` | List open web tabs in Chrome |
| `synthux_scan_page` | Extract DOM structure, headings, landmarks, forms, navigation, CTAs, contrast, and performance |
| `synthux_run_wcag_audit` | Run deterministic DOM accessibility checks + live `axe-core` WCAG 2.2 AA audit |
| `synthux_run_ux_audit` | Run full autonomous UX audit via Local Ollama or BYOK Cloud API |
| `synthux_prepare_external_audit` | Prepare DOM + WCAG + Screenshot + Sectoral Rule Pack prompts for external MCP Agent evaluation |
| `synthux_submit_external_audit` | Submit external MCP Agent evaluations to render live Heatmap, Annotated Screenshot, and v2.0 Report |
| `synthux_run_flow_audit` | Run multi-page Flow Builder user journey evaluation across 2+ URLs |
| `synthux_visual_overlay` | Trigger live `highlight`, `heatmap`, `clear_all`, `annotated_screenshot`, or `full_screenshot` |
| `synthux_manage_rule_packs` | List, inspect, import/validate custom JSON rule packs, or delete custom rule packs |
| `synthux_manage_personas` | List, create custom synthetic user personas, or delete custom personas |
| `synthux_configure_ai` | Configure Local Ollama or Cloud AI provider settings and test connectivity |
| `synthux_get_reports` | List report history or export reports in Enhanced Markdown v2.0 or JSON format |
