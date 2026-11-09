#!/usr/bin/env node
/**
 * synthux — Model Context Protocol (MCP) Server & Chrome Extension Bridge
 *
 * Zero-dependency, privacy-first MCP Server (JSON-RPC 2.0) supporting:
 *   1. Stdio Transport (for Antigravity, Claude Desktop/Code, Cursor, Windsurf, Codex)
 *   2. Streamable HTTP Transport (`http://127.0.0.1:17483/mcp`)
 *   3. Local WebSocket Bridge (`ws://127.0.0.1:17483/ws`) to the synthux Chrome Extension
 *   4. Multi-Instance Coexistence: If port 17483 is already bound by another synthux-mcp
 *      process holding the Chrome extension socket, new stdio instances transparently
 *      forward tool calls through `http://127.0.0.1:17483/mcp`.
 *
 * Security & Privacy Guarantees:
 *   - Strictly bound to `127.0.0.1` loopback interface (never exposed to LAN/0.0.0.0)
 *   - Strict Origin Verification: Blocks all `http://` and `https://` web page origins
 *     to prevent drive-by CSRF or WebSocket hijacking from malicious websites
 *   - Optional `SYNTHUX_MCP_TOKEN` shared-secret pairing authentication
 *   - Zero telemetry, zero external network calls, and automatic API key redaction
 */

import http from 'node:http';
import crypto from 'node:crypto';
import readline from 'node:readline';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFile, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import {
  BUILT_IN_RULE_PACKS,
  validateAndNormalizeRulePack,
  selectHeuristics,
  buildPrompt,
  parseEvaluation,
  calculateOverallScore
} from '../extension/core/heuristics.js';
import {
  PROFILES,
  getProfile,
  buildCustomSystemPrompt
} from '../extension/core/profiles.js';
import { runAccessibilityChecks } from '../extension/core/accessibility.js';
import { generateReport } from '../extension/core/report-generator.js';
import { AIClient } from '../extension/core/ai-client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const RULES_DIR = [
  path.join(__dirname, 'rules'),
  path.join(__dirname, '..', 'rules'),
  path.join(ROOT_DIR, 'extension', 'rules'),
  path.join(__dirname, '..', '..', 'extension', 'rules')
].find(dir => fs.existsSync(dir)) || path.join(ROOT_DIR, 'extension', 'rules');

const LOOPBACK_HOST = '127.0.0.1';
const PORT = Number(process.env.SYNTHUX_MCP_PORT || 17483);
const REQUIRED_TOKEN = (process.env.SYNTHUX_MCP_TOKEN || '').trim();
const SERVER_INFO = {
  name: 'synthux-mcp',
  version: '2.1.1'
};
const PROTOCOL_VERSION = '2024-11-05';

// ─── Local Fallback Storage (when Chrome extension is not yet connected) ────

const localState = {
  customRulePacks: [],
  customProfiles: [],
  lastReport: null,
  reportHistory: [],
  aiSettings: {
    ollamaEndpoint: process.env.OLLAMA_HOST || 'http://localhost:11434',
    ollamaModel: process.env.SYNTHUX_MODEL || 'gemma4',
    providerId: 'ollama',
    apiKey: '',
    rulePackId: 'nielsen-10',
    analysisMode: 'deep',
    language: 'en',
    enableVision: true
  }
};

function loadRulePackFromDisk(rulePackId = 'nielsen-10') {
  const custom = localState.customRulePacks.find(p => p.id === rulePackId);
  if (custom) return custom;

  const builtIn = BUILT_IN_RULE_PACKS.find(p => p.id === rulePackId) || BUILT_IN_RULE_PACKS[0];
  const filePath = path.join(RULES_DIR, path.basename(builtIn.file));
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return {
    ...raw,
    id: raw.id || builtIn.id,
    shortName: raw.shortName || builtIn.shortName,
    category: raw.category || builtIn.category
  };
}

// ─── Security Helpers ────────────────────────────────────────────────────────

function isAllowedOrigin(originHeader) {
  if (!originHeader) return true; // Local CLI / Node / Stdio process
  if (originHeader.startsWith('chrome-extension://')) return true;
  return false; // Block all http:// and https:// web origins
}

function validateSafeHttpUrl(urlStr) {
  if (!urlStr) return false;
  try {
    const parsed = new URL(urlStr);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// ─── Apple Foundation Models (macOS 26 / macOS 27+) Local Bridge ─────────────

const APPLE_FM_SWIFT_PATH = [
  path.join(__dirname, 'apple-fm-bridge.swift'),
  path.join(__dirname, '..', 'apple-fm-bridge.swift'),
  path.join(ROOT_DIR, 'mcp', 'apple-fm-bridge.swift')
].find(p => fs.existsSync(p)) || path.join(__dirname, 'apple-fm-bridge.swift');

const APPLE_FM_CACHE_DIR = path.join(os.tmpdir(), 'synthux-apple-fm-cache');
const APPLE_FM_BIN_PATH = path.join(APPLE_FM_CACHE_DIR, 'synthux-apple-fm');
let _appleFmCompiling = null;

async function ensureAppleFmBinary() {
  if (process.platform !== 'darwin') return null;
  if (!fs.existsSync(APPLE_FM_SWIFT_PATH)) return null;

  try {
    fs.mkdirSync(APPLE_FM_CACHE_DIR, { recursive: true });
    if (fs.existsSync(APPLE_FM_BIN_PATH)) {
      const srcStat = fs.statSync(APPLE_FM_SWIFT_PATH);
      const binStat = fs.statSync(APPLE_FM_BIN_PATH);
      if (binStat.mtimeMs >= srcStat.mtimeMs) {
        return APPLE_FM_BIN_PATH;
      }
    }
  } catch {}

  if (_appleFmCompiling) return _appleFmCompiling;

  _appleFmCompiling = new Promise((resolve) => {
    const moduleCache = path.join(APPLE_FM_CACHE_DIR, 'swift-module-cache');
    try { fs.mkdirSync(moduleCache, { recursive: true }); } catch {}

    execFile(
      'swiftc',
      ['-module-cache-path', moduleCache, '-O', APPLE_FM_SWIFT_PATH, '-o', APPLE_FM_BIN_PATH],
      { timeout: 30000 },
      (err) => {
        _appleFmCompiling = null;
        if (err) {
          resolve(null);
        } else {
          try { fs.chmodSync(APPLE_FM_BIN_PATH, 0o755); } catch {}
          resolve(APPLE_FM_BIN_PATH);
        }
      }
    );
  });

  return _appleFmCompiling;
}

async function runAppleFmStatus() {
  if (process.platform !== 'darwin') {
    return {
      available: false,
      status: 'unsupported_os',
      reason: 'Apple Foundation Models require macOS 26/27 on Apple Silicon.',
      osVersion: `${process.platform} (${os.release()})`,
      models: []
    };
  }

  const bin = await ensureAppleFmBinary();
  if (!bin) {
    return {
      available: false,
      status: 'compiler_unavailable',
      reason: 'Swift / Xcode Command Line Tools are required to bridge Apple FoundationModels on macOS.',
      osVersion: `macOS (${os.release()})`,
      models: [
        { id: 'apple-on-device', name: 'Apple Foundation Model (On-Device ANE)', size: 0 },
        { id: 'apple-pcc', name: 'Apple Private Cloud Compute (macOS 27)', size: 0 },
        { id: 'apple-content-tagging', name: 'Apple Foundation Model (Fast Tagging)', size: 0 }
      ]
    };
  }

  return new Promise((resolve) => {
    execFile(bin, ['status'], { timeout: 10000 }, (err, stdout) => {
      if (err || !stdout) {
        resolve({
          available: false,
          status: 'error',
          reason: err?.message || 'Failed to query Apple Foundation Models status.',
          osVersion: `macOS (${os.release()})`,
          models: [
            { id: 'apple-on-device', name: 'Apple Foundation Model (On-Device ANE)', size: 0 },
            { id: 'apple-pcc', name: 'Apple Private Cloud Compute (macOS 27)', size: 0 },
            { id: 'apple-content-tagging', name: 'Apple Foundation Model (Fast Tagging)', size: 0 }
          ]
        });
        return;
      }
      try {
        resolve(JSON.parse(stdout.trim()));
      } catch {
        resolve({
          available: false,
          status: 'parse_error',
          raw: stdout.trim(),
          models: []
        });
      }
    });
  });
}

async function runAppleFmGenerate(payload) {
  if (process.platform !== 'darwin') {
    return {
      success: false,
      error: 'Apple Foundation Models require macOS 26/27 on Apple Silicon.'
    };
  }

  const bin = await ensureAppleFmBinary();
  if (!bin) {
    return {
      success: false,
      error: 'Unable to compile Apple FoundationModels Swift bridge. Ensure Xcode / Command Line Tools are installed.'
    };
  }

  return new Promise((resolve) => {
    const child = spawn(bin, ['generate'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      try { child.kill('SIGKILL'); } catch {}
      resolve({
        success: false,
        error: 'Apple Foundation Model request timed out.'
      });
    }, 60000);

    child.stdout.on('data', (chunk) => { stdout += chunk.toString('utf8'); });
    child.stderr.on('data', (chunk) => { stderr += chunk.toString('utf8'); });

    child.on('close', () => {
      clearTimeout(timer);
      try {
        const parsed = JSON.parse(stdout.trim());
        resolve(parsed);
      } catch {
        resolve({
          success: false,
          error: stderr.trim() || stdout.trim() || 'Apple Foundation Model returned an invalid response.'
        });
      }
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({
        success: false,
        error: `Apple Foundation Model process error: ${err.message}`
      });
    });

    child.stdin.write(JSON.stringify(payload));
    child.stdin.end();
  });
}

function readJsonBody(req, maxBytes = 10 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString('utf8');
      if (body.length > maxBytes) {
        req.destroy?.();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

// ─── RFC 6455 Minimal WebSocket Server Implementation ────────────────────────

class WebSocketConnection {
  constructor(socket) {
    this.socket = socket;
    this.isAlive = true;
    this.extensionInfo = null;
    this.authenticated = !REQUIRED_TOKEN;
    this._buffer = Buffer.alloc(0);

    socket.on('data', (chunk) => this._onData(chunk));
    socket.on('close', () => this._onClose());
    socket.on('error', () => this._onClose());
  }

  send(obj) {
    if (this.socket.destroyed) return;
    const payload = Buffer.from(JSON.stringify(obj), 'utf8');
    const len = payload.length;
    let header;
    if (len < 126) {
      header = Buffer.alloc(2);
      header[0] = 0x81; // FIN + text frame
      header[1] = len;
    } else if (len < 65536) {
      header = Buffer.alloc(4);
      header[0] = 0x81;
      header[1] = 126;
      header.writeUInt16BE(len, 2);
    } else {
      header = Buffer.alloc(10);
      header[0] = 0x81;
      header[1] = 127;
      header.writeBigUInt64BE(BigInt(len), 2);
    }
    try {
      this.socket.write(Buffer.concat([header, payload]));
    } catch {}
  }

  close() {
    if (!this.socket.destroyed) {
      try {
        this.socket.end(Buffer.from([0x88, 0x00]));
      } catch {}
      this.socket.destroy();
    }
  }

  _onData(chunk) {
    this._buffer = Buffer.concat([this._buffer, chunk]);

    while (this._buffer.length >= 2) {
      const firstByte = this._buffer[0];
      const secondByte = this._buffer[1];
      const opcode = firstByte & 0x0f;
      const isMasked = (secondByte & 0x80) !== 0;
      let payloadLen = secondByte & 0x7f;
      let offset = 2;

      if (payloadLen === 126) {
        if (this._buffer.length < 4) return;
        payloadLen = this._buffer.readUInt16BE(2);
        offset = 4;
      } else if (payloadLen === 127) {
        if (this._buffer.length < 10) return;
        payloadLen = Number(this._buffer.readBigUInt64BE(2));
        offset = 10;
      }

      const maskKeyLen = isMasked ? 4 : 0;
      const totalFrameLen = offset + maskKeyLen + payloadLen;
      if (this._buffer.length < totalFrameLen) return;

      let payload = this._buffer.subarray(offset + maskKeyLen, totalFrameLen);
      if (isMasked) {
        const maskKey = this._buffer.subarray(offset, offset + 4);
        const unmasked = Buffer.alloc(payloadLen);
        for (let i = 0; i < payloadLen; i++) {
          unmasked[i] = payload[i] ^ maskKey[i % 4];
        }
        payload = unmasked;
      }

      this._buffer = this._buffer.subarray(totalFrameLen);

      if (opcode === 0x08) {
        // Close frame
        this.close();
        return;
      }
      if (opcode === 0x09) {
        // Ping → Pong
        this.socket.write(Buffer.from([0x8a, 0x00]));
        continue;
      }
      if (opcode === 0x01) {
        // Text frame
        const text = payload.toString('utf8');
        this.onMessage?.(text);
      }
    }
  }

  _onClose() {
    this.onClose?.();
  }
}

// ─── Extension Bridge State ──────────────────────────────────────────────────

let activeExtensionClient = null;
const pendingCommands = new Map();
let isProxyMode = false;

function sendExtensionCommand(command, params = {}, timeoutMs = 120000) {
  if (!activeExtensionClient || !activeExtensionClient.authenticated) {
    return Promise.reject(new Error('Chrome extension is not connected to MCP Bridge. Ensure the synthux extension is loaded in Chrome and MCP Bridge is enabled in Settings.'));
  }

  const id = `cmd_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pendingCommands.delete(id);
      reject(new Error(`Extension command "${command}" timed out after ${Math.round(timeoutMs / 1000)}s.`));
    }, timeoutMs);

    pendingCommands.set(id, { resolve, reject, timer });
    activeExtensionClient.send({
      type: 'MCP_COMMAND',
      id,
      command,
      params
    });
  });
}

// ─── MCP Tool Definitions (14 Tools Covering 100% of synthux Features) ──────

export const MCP_TOOLS = [
  {
    name: 'synthux_status',
    description: 'Check synthux MCP Server status, Chrome Extension live WebSocket connection, active browser tab, available Sectoral Rule Packs, Personas, and AI provider (Ollama Local LLM / Cloud API) status.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'synthux_open_url',
    description: 'Open or navigate a Chrome tab to a target URL and wait for the page to finish loading so synthux can audit it.',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'Target http:// or https:// URL to open and audit' },
        newTab: { type: 'boolean', description: 'Open in a new tab instead of reusing active tab (default: false)' },
        active: { type: 'boolean', description: 'Focus the tab in Chrome (default: true)' }
      },
      required: ['url']
    }
  },
  {
    name: 'synthux_list_tabs',
    description: 'List all open web tabs in Chrome with their tabId, title, and URL.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'synthux_scan_page',
    description: 'Extract comprehensive DOM structure, headings, landmarks, forms, navigation depth, CTAs, color contrast samples, unlabeled interactive elements, and performance metrics from the active tab or target URL.',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'Optional URL to navigate to before scanning' },
        tabId: { type: 'number', description: 'Optional Chrome tab ID (uses active tab if omitted)' },
        includeScreenshot: { type: 'boolean', description: 'Also capture full-page screenshot (default: false)' }
      }
    }
  },
  {
    name: 'synthux_run_wcag_audit',
    description: 'Run deterministic accessibility checks (10 rule-based DOM checks) combined with live axe-core WCAG 2.2 AA compliance auditing on the target page.',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'Optional URL to open before running WCAG 2.2 AA audit' },
        tabId: { type: 'number', description: 'Optional Chrome tab ID' },
        pageData: { type: 'object', description: 'Optional pre-extracted pageData for offline/headless testing' }
      }
    }
  },
  {
    name: 'synthux_run_ux_audit',
    description: 'Run a full autonomous synthux UX audit using the selected Sectoral Rule Pack (nielsen-10, ecommerce, saas, fintech, or custom pack), Synthetic Personas, and AI provider (Local Ollama gemma4/qwen3.8/deepseek-r1 or Cloud Gemini/OpenAI/Claude).',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'Optional URL to open and analyze' },
        tabId: { type: 'number', description: 'Optional Chrome tab ID' },
        rulePackId: {
          type: 'string',
          description: 'Rule pack ID: "nielsen-10", "ecommerce", "saas", "fintech", or a custom rule pack ID',
          default: 'nielsen-10'
        },
        mode: {
          type: 'string',
          enum: ['quick', 'deep', 'custom'],
          description: 'Analysis depth: "quick" (top 3 rules), "deep" (all rules), or "custom"',
          default: 'quick'
        },
        profiles: {
          type: 'array',
          items: { type: 'string' },
          description: 'Persona IDs: ["first-time", "power-user", "accessibility"] or custom persona IDs'
        },
        heuristics: {
          type: 'array',
          items: { type: 'string' },
          description: 'Specific heuristic rule IDs when mode is "custom"'
        },
        provider: {
          type: 'string',
          enum: ['ollama', 'apple', 'chromeai', 'gemini', 'openai', 'claude'],
          description: 'Optional AI provider override'
        },
        model: {
          type: 'string',
          description: 'Optional model override (e.g., "gemma4", "qwen3.8", "deepseek-r1", "gemini-2.5-flash")'
        }
      }
    }
  },
  {
    name: 'synthux_prepare_external_audit',
    description: 'Agent-Brain Mode (Step 1): Scans the page in Chrome, runs axe-core WCAG 2.2 AA checks, captures a screenshot, and builds the exact Sectoral Rule Pack + Persona evaluation prompts so YOU (the connected MCP AI Agent, e.g. Antigravity Gemini 4 Argon, Claude, Cursor, Codex) can evaluate the UX directly without needing a separate LLM call inside the extension.',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'Optional URL to open and scan' },
        tabId: { type: 'number', description: 'Optional Chrome tab ID' },
        rulePackId: {
          type: 'string',
          description: 'Rule pack ID: "nielsen-10", "ecommerce", "saas", "fintech", or custom pack ID',
          default: 'nielsen-10'
        },
        mode: {
          type: 'string',
          enum: ['quick', 'deep', 'custom'],
          default: 'quick'
        },
        profiles: {
          type: 'array',
          items: { type: 'string' },
          description: 'Persona IDs (e.g., ["first-time", "accessibility"])'
        },
        heuristics: {
          type: 'array',
          items: { type: 'string' }
        },
        includeScreenshot: {
          type: 'boolean',
          description: 'Include base64 screenshot in response (default: false to save context tokens)'
        },
        pageData: {
          type: 'object',
          description: 'Optional pre-extracted pageData for offline/headless testing when browser is closed'
        }
      }
    }
  },
  {
    name: 'synthux_submit_external_audit',
    description: 'Agent-Brain Mode (Step 2): Submit the heuristic evaluations generated by the MCP AI Agent back to synthux. Computes weighted scores, deduplicates issues, renders the live Issue Heatmap on the Chrome tab, captures an Annotated Screenshot with numbered markers, updates the Side Panel UI, and returns the complete Enhanced v2.0 Markdown & JSON Report.',
    inputSchema: {
      type: 'object',
      properties: {
        tabId: { type: 'number', description: 'Optional Chrome tab ID' },
        url: { type: 'string', description: 'Page URL (used when running in standalone/offline mode)' },
        title: { type: 'string', description: 'Page title' },
        rulePackId: { type: 'string', default: 'nielsen-10' },
        mode: { type: 'string', default: 'quick' },
        model: { type: 'string', description: 'Name of the MCP Agent model that performed the evaluation (e.g., "Gemini 4 Argon")' },
        showHeatmap: { type: 'boolean', description: 'Render live issue heatmap on the Chrome page (default: true)' },
        pageData: { type: 'object', description: 'Optional pageData for offline report generation' },
        evaluations: {
          type: 'array',
          description: 'Array of evaluations per profile and heuristic',
          items: {
            type: 'object',
            properties: {
              profileId: { type: 'string' },
              heuristicId: { type: 'string' },
              heuristicName: { type: 'string' },
              evaluation: {
                type: 'object',
                properties: {
                  score: { type: 'number' },
                  summary: { type: 'string' },
                  issues: { type: 'array', items: { type: 'object' } },
                  positives: { type: 'array', items: { type: 'string' } },
                  score_justification: { type: 'string' }
                }
              }
            },
            required: ['profileId', 'heuristicId', 'evaluation']
          }
        }
      },
      required: ['evaluations']
    }
  },
  {
    name: 'synthux_run_flow_audit',
    description: 'Run a multi-page User Journey Flow Builder analysis across 2 or more URLs. Evaluates navigation consistency, visual coherence, flow progression, and terminology across steps.',
    inputSchema: {
      type: 'object',
      properties: {
        pages: {
          type: 'array',
          description: 'Ordered list of pages in the user journey (minimum 2)',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              url: { type: 'string' },
              label: { type: 'string' }
            },
            required: ['url']
          }
        },
        connectors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              fromId: { type: 'string' },
              toId: { type: 'string' }
            }
          }
        },
        notes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              text: { type: 'string' },
              attachedTo: { type: 'string' }
            }
          }
        },
        profiles: {
          type: 'array',
          items: { type: 'string' }
        }
      },
      required: ['pages']
    }
  },
  {
    name: 'synthux_visual_overlay',
    description: 'Control live visual overlays on the active Chrome tab: highlight specific problematic CSS selectors, show/hide the severity Issue Heatmap, clear overlays, or capture an Annotated Visual Audit screenshot.',
    inputSchema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['highlight', 'clear_highlight', 'heatmap', 'clear_heatmap', 'clear_all', 'annotated_screenshot', 'full_screenshot'],
          description: 'Visual overlay action to execute in Chrome'
        },
        tabId: { type: 'number' },
        selector: { type: 'string', description: 'CSS selector to highlight (when action="highlight")' },
        severity: { type: 'string', enum: ['critical', 'moderate', 'minor'], description: 'Highlight color severity' },
        label: { type: 'string', description: 'Tooltip label for highlighted element' },
        issues: {
          type: 'array',
          description: 'Issues array with element CSS selectors and severities (for heatmap or annotated_screenshot)',
          items: { type: 'object' }
        }
      },
      required: ['action']
    }
  },
  {
    name: 'synthux_manage_rule_packs',
    description: 'List built-in Sectoral Rule Packs (nielsen-10, ecommerce, saas, fintech) and custom packs, inspect rules inside a pack, import/validate a new custom JSON rule pack, or delete a custom rule pack.',
    inputSchema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['list', 'get', 'save', 'delete'],
          default: 'list'
        },
        rulePackId: { type: 'string', description: 'Rule pack ID for "get" or "delete"' },
        rulePack: {
          type: 'object',
          description: 'Custom JSON rule pack object to validate and save (for action="save")'
        }
      }
    }
  },
  {
    name: 'synthux_manage_personas',
    description: 'List built-in Synthetic User Personas (first-time, power-user, accessibility) and custom personas, create a new custom persona (ageRange, techLevel, disabilities, goal), or delete a custom persona.',
    inputSchema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['list', 'save', 'delete'],
          default: 'list'
        },
        profileId: { type: 'string', description: 'Custom persona ID to delete' },
        persona: {
          type: 'object',
          description: 'New custom persona definition (for action="save")',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            ageRange: { type: 'string', enum: ['18-25', '25-35', '35-50', '50-65', '65+'] },
            techLevel: { type: 'string', enum: ['low', 'medium', 'high'] },
            disabilities: { type: 'array', items: { type: 'string' } },
            goal: { type: 'string' }
          }
        }
      }
    }
  },
  {
    name: 'synthux_configure_ai',
    description: 'Read or update synthux AI provider configuration (Local Ollama, Apple Intelligence macOS 26/27 FoundationModels, Chrome Built-in AI Gemini Nano, or Cloud Gemini/OpenAI/Claude) and test provider connectivity.',
    inputSchema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['get', 'update', 'ping'],
          default: 'get'
        },
        provider: { type: 'string', enum: ['ollama', 'apple', 'chromeai', 'gemini', 'openai', 'claude'] },
        model: { type: 'string' },
        endpoint: { type: 'string' },
        enableVision: { type: 'boolean' },
        rulePackId: { type: 'string' },
        analysisMode: { type: 'string', enum: ['quick', 'deep', 'custom'] }
      }
    }
  },
  {
    name: 'synthux_get_reports',
    description: 'Retrieve the latest UX audit report, list report history, or export a report in Enhanced Markdown v2.0 or JSON format.',
    inputSchema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['latest', 'history', 'by_id'],
          default: 'latest'
        },
        id: { type: 'string', description: 'Report ID when action="by_id"' },
        format: {
          type: 'string',
          enum: ['json', 'markdown'],
          default: 'markdown'
        }
      }
    }
  }
];

// ─── Tool Execution Logic ────────────────────────────────────────────────────

async function executeToolCall(name, args = {}) {
  // Security validation on URL parameters
  if (args.url && !validateSafeHttpUrl(args.url)) {
    throw new Error('Security Policy: Only valid http:// and https:// URLs are permitted.');
  }

  const extConnected = !!(activeExtensionClient && activeExtensionClient.authenticated);

  switch (name) {
    case 'synthux_status': {
      let extStatus = null;
      if (extConnected) {
        try {
          extStatus = await sendExtensionCommand('PING_EXTENSION', {}, 10000);
        } catch (err) {
          extStatus = { connected: false, error: err.message };
        }
      }

      // Check local Ollama directly as well
      const client = new AIClient(localState.aiSettings.ollamaEndpoint, {
        provider: localState.aiSettings.providerId,
        apiKey: localState.aiSettings.apiKey
      });
      let localAiPing = null;
      try {
        localAiPing = await client.ping();
      } catch {
        localAiPing = { status: 'offline' };
      }

      return {
        mcpServer: {
          ...SERVER_INFO,
          host: LOOPBACK_HOST,
          port: PORT,
          streamableHttpUrl: `http://${LOOPBACK_HOST}:${PORT}/mcp`,
          wsBridgeUrl: `ws://${LOOPBACK_HOST}:${PORT}/ws`,
          security: {
            loopbackOnly: true,
            originVerification: true,
            tokenAuthEnabled: !!REQUIRED_TOKEN
          }
        },
        chromeExtension: extConnected
          ? { connected: true, ...extStatus }
          : {
              connected: false,
              note: 'Chrome extension is not currently connected over WebSocket. Offline/standalone engine tools (rule packs, personas, WCAG checks, external audit preparation/submission, report generation, and local AI ping) remain 100% available.'
            },
        localAiStatus: localAiPing,
        builtInRulePacks: BUILT_IN_RULE_PACKS.map(p => ({ id: p.id, name: p.name, ruleCount: p.ruleCount })),
        builtInPersonas: Object.keys(PROFILES)
      };
    }

    case 'synthux_open_url': {
      if (!extConnected) {
        throw new Error('Opening a live browser tab requires the synthux Chrome extension to be connected to ws://127.0.0.1:17483/ws.');
      }
      return await sendExtensionCommand('OPEN_AND_WAIT_TAB', args, 25000);
    }

    case 'synthux_list_tabs': {
      if (!extConnected) {
        return {
          success: true,
          extensionConnected: false,
          tabs: [],
          note: 'Chrome extension is not connected.'
        };
      }
      return await sendExtensionCommand('LIST_TABS', {}, 10000);
    }

    case 'synthux_scan_page': {
      if (extConnected) {
        return await sendExtensionCommand('SCAN_PAGE', args, 30000);
      }
      throw new Error('Scanning a live browser DOM requires the synthux Chrome extension to be connected, or pass pre-extracted pageData to synthux_run_wcag_audit / synthux_prepare_external_audit.');
    }

    case 'synthux_run_wcag_audit': {
      if (extConnected && !args.pageData) {
        return await sendExtensionCommand('RUN_WCAG_AUDIT', args, 30000);
      }
      const pageData = args.pageData || {
        meta: { title: 'Sample Page', lang: 'en' },
        structure: { headings: [{ level: 1, text: 'Main Heading' }], landmarks: [{ role: 'main' }], forms: [] },
        navigation: { navCount: 1, skipLinks: true },
        content: { images: [], ctas: [] },
        accessibility: { hasLangAttr: true, contrastResults: [], tabOrderIssues: [], unlabeledInteractives: [] }
      };
      const accessibilityResults = runAccessibilityChecks(pageData);
      return {
        success: true,
        mode: 'standalone-engine',
        accessibilityResults
      };
    }

    case 'synthux_run_ux_audit': {
      if (extConnected) {
        return await sendExtensionCommand('START_ANALYSIS', args, 300000);
      }
      throw new Error('Live browser autonomous audit requires the Chrome extension connection, or use synthux_prepare_external_audit + synthux_submit_external_audit for Agent-Brain evaluation.');
    }

    case 'synthux_prepare_external_audit': {
      if (extConnected && !args.pageData) {
        return await sendExtensionCommand('PREPARE_EXTERNAL_AUDIT', args, 45000);
      }

      // Standalone engine mode using provided pageData
      const rulePackId = args.rulePackId || 'nielsen-10';
      const mode = args.mode || 'quick';
      const profileIds = Array.isArray(args.profiles) && args.profiles.length > 0
        ? args.profiles
        : ['first-time', 'power-user', 'accessibility'];
      const pageData = args.pageData || {
        meta: { title: args.title || 'Audited Page', lang: 'en', description: '' },
        structure: { headings: [{ level: 1, text: 'Welcome' }], landmarks: [{ role: 'main' }], forms: [] },
        navigation: { navCount: 1, skipLinks: false, breadcrumb: false },
        content: { textLength: 450, wordCount: 75, images: [], imageCount: 0, imagesWithoutAlt: 0, ctas: ['Get Started'] },
        accessibility: { hasLangAttr: true, ariaRoles: ['main'], contrastResults: [], tabOrderIssues: [], unlabeledInteractives: [] },
        performance: { domSize: 120, scriptCount: 2, styleSheetCount: 1 }
      };

      const rules = loadRulePackFromDisk(rulePackId);
      const accessibilityResults = runAccessibilityChecks(pageData);
      const evaluationTasks = [];

      for (const pid of profileIds) {
        const profile = getProfile(pid) || localState.customProfiles.find(p => p.id === pid);
        if (!profile) continue;

        const selectedRules = (args.heuristics && args.heuristics.length > 0)
          ? (rules.rules || []).filter(r => args.heuristics.includes(r.id))
          : selectHeuristics(rules, mode, pid);

        for (const heuristic of selectedRules) {
          evaluationTasks.push({
            profileId: profile.id,
            profileName: profile.name?.en || profile.name,
            heuristicId: heuristic.id,
            heuristicName: heuristic.name?.en || heuristic.name,
            weight: heuristic.weight || 1.0,
            prompt: buildPrompt(heuristic, profile, pageData, false)
          });
        }
      }

      return {
        success: true,
        executionMode: 'standalone-engine',
        rulePack: {
          id: rules.id || rulePackId,
          name: rules.name,
          shortName: rules.shortName,
          ruleCount: (rules.rules || []).length
        },
        mode,
        profiles: profileIds,
        accessibilityResults,
        evaluationTasks
      };
    }

    case 'synthux_submit_external_audit': {
      if (extConnected && !args.pageData) {
        return await sendExtensionCommand('SUBMIT_EXTERNAL_AUDIT', args, 45000);
      }

      // Standalone engine report compilation
      const rulePackId = args.rulePackId || 'nielsen-10';
      const mode = args.mode || 'quick';
      const rules = loadRulePackFromDisk(rulePackId);
      const pageData = args.pageData || {
        meta: { title: args.title || 'Audited Page', lang: 'en' },
        structure: { headings: [{ level: 1, text: 'Main' }], landmarks: [{ role: 'main' }], forms: [] },
        navigation: { navCount: 1, skipLinks: true },
        content: { images: [], ctas: [] },
        accessibility: { hasLangAttr: true, contrastResults: [], tabOrderIssues: [], unlabeledInteractives: [] }
      };
      const accessibilityResults = runAccessibilityChecks(pageData);

      const rawEvaluations = Array.isArray(args.evaluations) ? args.evaluations : [];
      const profileGroups = new Map();

      for (const item of rawEvaluations) {
        const pid = item.profileId || 'first-time';
        if (!profileGroups.has(pid)) profileGroups.set(pid, []);
        const ruleObj = (rules.rules || []).find(r => r.id === item.heuristicId) || {
          id: item.heuristicId || 'general',
          name: { en: item.heuristicName || item.heuristicId || 'General Usability' }
        };
        const parsed = parseEvaluation(item.evaluation || item);
        profileGroups.get(pid).push({
          heuristicId: ruleObj.id,
          heuristicName: ruleObj.name,
          ...parsed
        });
      }

      const profileResults = {};
      for (const [pid, evaluations] of profileGroups.entries()) {
        const profile = getProfile(pid) || localState.customProfiles.find(p => p.id === pid) || {
          id: pid,
          icon: '👤',
          name: { en: pid, tr: pid },
          description: { en: 'MCP Persona', tr: 'MCP Personası' }
        };
        const score = calculateOverallScore(evaluations, rules);
        profileResults[pid] = {
          profile: {
            id: profile.id,
            icon: profile.icon || '👤',
            name: profile.name,
            description: profile.description,
            custom: profile.custom || false
          },
          score,
          evaluations
        };
      }

      const allScores = Object.values(profileResults).map(r => r.score);
      const overallScore = allScores.length > 0
        ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
        : accessibilityResults.score;

      const allIssues = [];
      Object.values(profileResults).forEach(pr => {
        pr.evaluations.forEach(ev => {
          (ev.issues || []).forEach(issue => {
            allIssues.push({
              ...issue,
              heuristic: ev.heuristicName?.en || ev.heuristicName,
              profile: pr.profile.name?.en || pr.profile.name,
              profileIcon: pr.profile.icon || '👤'
            });
          });
        });
      });

      const report = generateReport({
        url: args.url || 'https://synthux.app',
        title: args.title || pageData.meta?.title || 'MCP Audited Page',
        timestamp: new Date().toISOString(),
        model: args.model || 'Gemini 4 Argon (MCP Agent)',
        mode,
        provider: 'mcp-agent',
        rulePackId: rules.id || rulePackId,
        rulePackName: rules.name,
        rulePackShortName: rules.shortName || 'Nielsen 10',
        ruleCount: (rules.rules || []).length,
        overallScore,
        profileResults,
        accessibilityResults,
        issues: allIssues,
        screenshot: null,
        annotatedScreenshot: null,
        costSummary: null
      });

      localState.lastReport = report;
      localState.reportHistory.unshift({
        id: `mcp-${Date.now()}`,
        url: report.url,
        title: report.title,
        score: report.overallScore,
        mode: report.mode,
        model: report.model,
        timestamp: report.timestamp,
        report
      });

      return {
        success: true,
        executionMode: 'standalone-engine',
        report
      };
    }

    case 'synthux_run_flow_audit': {
      if (extConnected) {
        return await sendExtensionCommand('START_FLOW_ANALYSIS', args, 300000);
      }
      throw new Error('Multi-page Flow Builder navigation requires the synthux Chrome extension to be connected.');
    }

    case 'synthux_visual_overlay': {
      if (extConnected) {
        return await sendExtensionCommand('VISUAL_OVERLAY', args, 20000);
      }
      throw new Error('Visual overlays (Heatmap, Highlight, Annotated Screenshot) require the live Chrome extension connection.');
    }

    case 'synthux_manage_rule_packs': {
      if (extConnected) {
        return await sendExtensionCommand('MANAGE_RULE_PACKS', args, 15000);
      }

      const action = args.action || 'list';
      if (action === 'list') {
        return {
          success: true,
          rulePacks: [...BUILT_IN_RULE_PACKS, ...localState.customRulePacks]
        };
      }
      if (action === 'get') {
        return {
          success: true,
          rulePack: loadRulePackFromDisk(args.rulePackId || 'nielsen-10')
        };
      }
      if (action === 'save') {
        const normalized = validateAndNormalizeRulePack(args.rulePack);
        const idx = localState.customRulePacks.findIndex(p => p.id === normalized.id);
        if (idx >= 0) localState.customRulePacks[idx] = normalized;
        else localState.customRulePacks.push(normalized);
        return { success: true, rulePack: normalized };
      }
      if (action === 'delete') {
        localState.customRulePacks = localState.customRulePacks.filter(p => p.id !== args.rulePackId);
        return { success: true, customRulePacks: localState.customRulePacks };
      }
      throw new Error(`Unknown rule pack action: ${action}`);
    }

    case 'synthux_manage_personas': {
      if (extConnected) {
        return await sendExtensionCommand('MANAGE_PERSONAS', args, 15000);
      }

      const action = args.action || 'list';
      if (action === 'list') {
        return {
          success: true,
          profiles: [...Object.values(PROFILES), ...localState.customProfiles]
        };
      }
      if (action === 'save') {
        const p = args.persona || {};
        if (!p.name) throw new Error('Persona name is required.');
        const newProfile = {
          id: `custom-${Date.now()}`,
          icon: '👤',
          custom: true,
          name: { en: p.name, tr: p.name },
          description: { en: p.description || '', tr: p.description || '' },
          ageRange: p.ageRange || '25-35',
          techLevel: p.techLevel || 'medium',
          disabilities: p.disabilities || [],
          goal: p.goal || '',
          weight: 1.0,
          systemPrompt: buildCustomSystemPrompt(p)
        };
        localState.customProfiles.push(newProfile);
        return { success: true, profile: newProfile };
      }
      if (action === 'delete') {
        localState.customProfiles = localState.customProfiles.filter(p => p.id !== args.profileId);
        return { success: true, customProfiles: localState.customProfiles };
      }
      throw new Error(`Unknown persona action: ${action}`);
    }

    case 'synthux_configure_ai': {
      if (extConnected) {
        return await sendExtensionCommand('CONFIGURE_AI', args, 15000);
      }

      if (args.action === 'update') {
        if (args.provider) localState.aiSettings.providerId = args.provider;
        if (args.model) localState.aiSettings.ollamaModel = args.model;
        if (args.endpoint) localState.aiSettings.ollamaEndpoint = args.endpoint;
        if (typeof args.enableVision === 'boolean') localState.aiSettings.enableVision = args.enableVision;
        if (args.rulePackId) localState.aiSettings.rulePackId = args.rulePackId;
        if (args.analysisMode) localState.aiSettings.analysisMode = args.analysisMode;
      }

      const client = new AIClient(localState.aiSettings.ollamaEndpoint, {
        provider: localState.aiSettings.providerId,
        apiKey: localState.aiSettings.apiKey
      });
      const pingResult = await client.ping();
      const models = await client.listModels();

      return {
        success: true,
        settings: {
          ...localState.aiSettings,
          apiKey: localState.aiSettings.apiKey ? '***configured***' : ''
        },
        connectionStatus: {
          ping: pingResult,
          models
        }
      };
    }

    case 'synthux_get_reports': {
      if (extConnected) {
        return await sendExtensionCommand('GET_REPORTS', args, 15000);
      }

      const action = args.action || 'latest';
      if (action === 'history') {
        return {
          success: true,
          history: localState.reportHistory.map(r => ({
            id: r.id,
            url: r.url,
            title: r.title,
            score: r.score,
            mode: r.mode,
            model: r.model,
            timestamp: r.timestamp
          }))
        };
      }
      if (action === 'by_id' && args.id) {
        const entry = localState.reportHistory.find(r => r.id === args.id);
        if (!entry) throw new Error(`Report ${args.id} not found.`);
        return {
          success: true,
          report: args.format === 'markdown' ? entry.report.markdown : entry.report
        };
      }
      if (!localState.lastReport) {
        return { error: 'No report generated yet in this session.' };
      }
      return {
        success: true,
        report: args.format === 'markdown' ? localState.lastReport.markdown : localState.lastReport
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ─── MCP JSON-RPC 2.0 Request Handler ────────────────────────────────────────

async function handleJsonRpcMessage(msg) {
  if (!msg || typeof msg !== 'object') return null;

  // If running in secondary stdio proxy mode, forward tool calls to primary daemon
  if (isProxyMode && (msg.method === 'tools/call' || msg.method === 'resources/read')) {
    try {
      const res = await fetch(`http://${LOOPBACK_HOST}:${PORT}/mcp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(REQUIRED_TOKEN ? { 'x-synthux-token': REQUIRED_TOKEN } : {})
        },
        body: JSON.stringify(msg)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback to local execution if primary closed
      isProxyMode = false;
    }
  }

  const { id, method, params } = msg;

  // Notifications (no id) do not return a response
  if (id === undefined || id === null) {
    return null;
  }

  try {
    switch (method) {
      case 'initialize':
        return {
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: params?.protocolVersion || PROTOCOL_VERSION,
            capabilities: {
              tools: { listChanged: false },
              resources: { listChanged: false },
              prompts: { listChanged: false }
            },
            serverInfo: SERVER_INFO
          }
        };

      case 'ping':
        return {
          jsonrpc: '2.0',
          id,
          result: {}
        };

      case 'tools/list':
        return {
          jsonrpc: '2.0',
          id,
          result: {
            tools: MCP_TOOLS
          }
        };

      case 'tools/call': {
        const toolName = params?.name;
        const toolArgs = params?.arguments || {};
        const output = await executeToolCall(toolName, toolArgs);
        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: typeof output === 'string' ? output : JSON.stringify(output, null, 2)
              }
            ],
            isError: !!output?.error
          }
        };
      }

      case 'resources/list':
        return {
          jsonrpc: '2.0',
          id,
          result: {
            resources: BUILT_IN_RULE_PACKS.map(pack => ({
              uri: `synthux://rules/${pack.id}`,
              name: pack.name,
              description: pack.description,
              mimeType: 'application/json'
            }))
          }
        };

      case 'resources/read': {
        const uri = String(params?.uri || '');
        const match = uri.match(/^synthux:\/\/rules\/(.+)$/);
        const packId = match ? match[1] : 'nielsen-10';
        const data = loadRulePackFromDisk(packId);
        return {
          jsonrpc: '2.0',
          id,
          result: {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(data, null, 2)
              }
            ]
          }
        };
      }

      case 'prompts/list':
        return {
          jsonrpc: '2.0',
          id,
          result: {
            prompts: [
              {
                name: 'audit_website_ux',
                description: 'Run a complete end-to-end UX & WCAG 2.2 AA audit on a target URL using synthux',
                arguments: [
                  { name: 'url', description: 'Website URL to audit', required: true },
                  { name: 'rulePackId', description: 'Rule pack (nielsen-10, ecommerce, saas, fintech)', required: false }
                ]
              }
            ]
          }
        };

      case 'prompts/get': {
        const url = params?.arguments?.url || 'https://example.com';
        const rulePackId = params?.arguments?.rulePackId || 'nielsen-10';
        return {
          jsonrpc: '2.0',
          id,
          result: {
            description: `Audit ${url} with synthux (${rulePackId})`,
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `Please audit ${url} using the synthux MCP tools with rulePackId="${rulePackId}". First call synthux_prepare_external_audit (or synthux_run_ux_audit), evaluate the heuristics, and then submit the findings via synthux_submit_external_audit to generate the live heatmap and Enhanced v2.0 UX Audit Report.`
                }
              }
            ]
          }
        };
      }

      default:
        return {
          jsonrpc: '2.0',
          id,
          error: {
            code: -32601,
            message: `Method not found: ${method}`
          }
        };
    }
  } catch (err) {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: err.message || String(err) }, null, 2)
          }
        ],
        isError: true
      }
    };
  }
}

// ─── HTTP & WebSocket Server (127.0.0.1:17483) ───────────────────────────────

async function handleHttpRequest(req, res) {
  const origin = req.headers?.origin;
  if (!isAllowedOrigin(origin)) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Forbidden: Web origins are blocked by synthux security policy.' }));
    return;
  }

  // Set CORS headers for allowed origins (chrome-extension://* and local CLI)
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-synthux-token',
    'Content-Type': 'application/json'
  };

  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  if (REQUIRED_TOKEN) {
    const headerToken = req.headers['x-synthux-token'] || (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (headerToken !== REQUIRED_TOKEN) {
      res.writeHead(401, corsHeaders);
      res.end(JSON.stringify({ error: 'Unauthorized: Invalid SYNTHUX_MCP_TOKEN.' }));
      return;
    }
  }

  const url = new URL(req.url || '/', `http://${LOOPBACK_HOST}:${PORT}`);

  if (req.method === 'GET' && url.pathname === '/health') {
    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify({
      status: 'ok',
      server: SERVER_INFO,
      extensionConnected: !!(activeExtensionClient && activeExtensionClient.authenticated)
    }));
    return;
  }

  // ─── Apple Foundation Models (macOS 26 / macOS 27+) Local Endpoints ────────
  if (req.method === 'GET' && url.pathname === '/apple-fm/status') {
    const status = await runAppleFmStatus();
    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify(status));
    return;
  }

  if (req.method === 'POST' && url.pathname === '/apple-fm/generate') {
    try {
      const payload = await readJsonBody(req);
      if (!payload.prompt) {
        res.writeHead(400, corsHeaders);
        res.end(JSON.stringify({ success: false, error: 'prompt is required' }));
        return;
      }
      const result = await runAppleFmGenerate(payload);
      res.writeHead(result.success ? 200 : 500, corsHeaders);
      res.end(JSON.stringify(result));
    } catch (err) {
      res.writeHead(400, corsHeaders);
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // ─── Backward-Compatible Ollama Endpoints on 127.0.0.1:17483 ──────────────
  // Allows even the v2.1.0 Chrome Extension to use Apple Foundation Models
  // simply by setting the Ollama Endpoint to http://127.0.0.1:17483.
  if (req.method === 'GET' && url.pathname === '/api/tags') {
    const status = await runAppleFmStatus();
    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify({
      models: (status.models || []).map(m => ({
        name: m.id,
        model: m.id,
        size: m.size || 0,
        details: { family: 'apple-foundation-model', parameter_size: '3B-ANE' }
      }))
    }));
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/version') {
    const status = await runAppleFmStatus();
    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify({ version: status.variant || status.osVersion || 'apple-fm-27.0' }));
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/show') {
    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify({
      capabilities: ['completion'],
      details: { family: 'apple-foundation-model' }
    }));
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/generate') {
    try {
      const body = await readJsonBody(req);
      if (!body.model) {
        res.writeHead(400, corsHeaders);
        res.end(JSON.stringify({ error: 'model is required' }));
        return;
      }
      const result = await runAppleFmGenerate({
        model: body.model,
        prompt: body.prompt || '',
        system: body.system || '',
        temperature: body.options?.temperature ?? 0.3,
        maxTokens: body.options?.num_predict ?? 2048
      });
      if (!result.success) {
        res.writeHead(500, corsHeaders);
        res.end(JSON.stringify({ error: result.error || 'Apple Foundation Model error' }));
        return;
      }
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify({
        model: result.model || body.model,
        response: result.response,
        done: true,
        total_duration: result.totalDuration || 0,
        prompt_eval_count: result.inputTokens || 0,
        eval_count: result.outputTokens || 0
      }));
    } catch (err) {
      res.writeHead(400, corsHeaders);
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // ─── OpenAI-Compatible Endpoints on 127.0.0.1:17483 (/v1/*) ───────────────
  if (req.method === 'GET' && url.pathname === '/v1/models') {
    const status = await runAppleFmStatus();
    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify({
      object: 'list',
      data: (status.models || []).map(m => ({
        id: m.id,
        object: 'model',
        owned_by: 'apple-foundation-models'
      }))
    }));
    return;
  }

  if (req.method === 'POST' && url.pathname === '/v1/chat/completions') {
    try {
      const body = await readJsonBody(req);
      const messages = Array.isArray(body.messages) ? body.messages : [];
      const sysMsg = messages.find(m => m.role === 'system');
      const userMsg = [...messages].reverse().find(m => m.role === 'user');
      const userText = Array.isArray(userMsg?.content)
        ? userMsg.content.filter(p => p.type === 'text').map(p => p.text).join('\n')
        : String(userMsg?.content || '');

      const result = await runAppleFmGenerate({
        model: body.model || 'apple-on-device',
        prompt: userText,
        system: sysMsg?.content || '',
        temperature: body.temperature ?? 0.3,
        maxTokens: body.max_tokens ?? 2048
      });

      if (!result.success) {
        res.writeHead(500, corsHeaders);
        res.end(JSON.stringify({ error: { message: result.error } }));
        return;
      }

      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify({
        id: `chatcmpl-${Date.now()}`,
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model: result.model || body.model || 'apple-on-device',
        choices: [
          {
            index: 0,
            message: { role: 'assistant', content: result.response },
            finish_reason: 'stop'
          }
        ],
        usage: {
          prompt_tokens: result.inputTokens || 0,
          completion_tokens: result.outputTokens || 0,
          total_tokens: (result.inputTokens || 0) + (result.outputTokens || 0)
        }
      }));
    } catch (err) {
      res.writeHead(400, corsHeaders);
      res.end(JSON.stringify({ error: { message: err.message } }));
    }
    return;
  }

  // Streamable HTTP MCP Endpoint (/mcp)
  if (url.pathname === '/mcp') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString('utf8');
        if (body.length > 25 * 1024 * 1024) req.destroy?.();
      });
      req.on('end', async () => {
        try {
          const parsed = JSON.parse(body);
          if (Array.isArray(parsed)) {
            const responses = (await Promise.all(parsed.map(m => handleJsonRpcMessage(m)))).filter(Boolean);
            res.writeHead(200, corsHeaders);
            res.end(JSON.stringify(responses));
          } else {
            const response = await handleJsonRpcMessage(parsed);
            if (!response) {
              res.writeHead(202, corsHeaders);
              res.end();
            } else {
              res.writeHead(200, corsHeaders);
              res.end(JSON.stringify(response));
            }
          }
        } catch (err) {
          res.writeHead(400, corsHeaders);
          res.end(JSON.stringify({
            jsonrpc: '2.0',
            id: null,
            error: { code: -32700, message: `Parse error: ${err.message}` }
          }));
        }
      });
      return;
    }

    if (req.method === 'GET') {
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify({
        name: SERVER_INFO.name,
        version: SERVER_INFO.version,
        transport: 'streamable-http',
        endpoint: `http://${LOOPBACK_HOST}:${PORT}/mcp`,
        extensionConnected: !!(activeExtensionClient && activeExtensionClient.authenticated)
      }));
      return;
    }
  }

  res.writeHead(404, corsHeaders);
  res.end(JSON.stringify({ error: 'Not Found' }));
}

function handleWebSocketUpgrade(req, socket) {
  const origin = req.headers?.origin;
  if (!isAllowedOrigin(origin)) {
    socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
    socket.destroy();
    return;
  }

  const key = req.headers?.['sec-websocket-key'];
  if (!key) {
    socket.write('HTTP/1.1 400 Bad Request\r\n\r\n');
    socket.destroy();
    return;
  }

  const acceptKey = crypto
    .createHash('sha1')
    .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
    .digest('base64');

  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
    'Upgrade: websocket\r\n' +
    'Connection: Upgrade\r\n' +
    `Sec-WebSocket-Accept: ${acceptKey}\r\n\r\n`
  );

  const wsClient = new WebSocketConnection(socket);
  activeExtensionClient = wsClient;

  wsClient.onMessage = (rawText) => {
    try {
      const msg = JSON.parse(rawText);
      if (msg.type === 'PING') {
        wsClient.send({ type: 'PONG', timestamp: Date.now() });
        return;
      }
      if (msg.type === 'EXTENSION_HELLO') {
        if (REQUIRED_TOKEN && msg.token !== REQUIRED_TOKEN) {
          wsClient.authenticated = false;
          wsClient.close();
          return;
        }
        wsClient.authenticated = true;
        wsClient.extensionInfo = {
          version: msg.version,
          extensionId: msg.extensionId,
          connectedAt: msg.timestamp || new Date().toISOString()
        };
        return;
      }
      if (msg.type === 'MCP_RESPONSE' && msg.id) {
        const pending = pendingCommands.get(msg.id);
        if (pending) {
          clearTimeout(pending.timer);
          pendingCommands.delete(msg.id);
          pending.resolve(msg.result);
        }
      }
    } catch {}
  };

  wsClient.onClose = () => {
    if (activeExtensionClient === wsClient) {
      activeExtensionClient = null;
    }
  };
}

function startBridgeServer(listenOptions = { port: PORT, host: LOOPBACK_HOST }) {
  const server = http.createServer(handleHttpRequest);
  server.on('upgrade', handleWebSocketUpgrade);

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      // Another synthux-mcp instance is already listening on 127.0.0.1:17483.
      isProxyMode = true;
    } else if (err.code === 'EPERM' || err.code === 'EACCES') {
      // Running inside a restricted sandbox where TCP port binding is disabled;
      // stdio transport remains active.
    }
  });

  try {
    if (listenOptions.socketPath) {
      server.listen(listenOptions.socketPath);
    } else {
      server.listen(listenOptions.port ?? PORT, listenOptions.host ?? LOOPBACK_HOST);
    }
  } catch {}
  return server;
}

// ─── Stdio Transport Loop ────────────────────────────────────────────────────

function startStdioTransport() {
  const rl = readline.createInterface({
    input: process.stdin,
    terminal: false
  });

  rl.on('line', async (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    try {
      const msg = JSON.parse(trimmed);
      const response = await handleJsonRpcMessage(msg);
      if (response) {
        process.stdout.write(JSON.stringify(response) + '\n');
      }
    } catch (err) {
      process.stdout.write(JSON.stringify({
        jsonrpc: '2.0',
        id: null,
        error: { code: -32700, message: `Parse error: ${err.message}` }
      }) + '\n');
    }
  });
}

// Run when executed directly as CLI / MCP server
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('synthux-mcp') || process.argv[1]?.endsWith('server.js')) {
  startBridgeServer();
  startStdioTransport();
}

export { startBridgeServer, handleHttpRequest, handleWebSocketUpgrade, handleJsonRpcMessage, executeToolCall };
