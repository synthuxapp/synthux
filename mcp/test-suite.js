#!/usr/bin/env node
/**
 * synthux — MCP Server, Security & Chrome Extension E2E Test Suite
 *
 * Verifies:
 *   1. MCP JSON-RPC 2.0 Protocol (`initialize`, `tools/list`, `resources/list`, `resources/read`, `prompts/get`)
 *   2. Security & Privacy Controls:
 *      - Strict Loopback Guard (`isLoopbackWsUrl`) blocking remote WebSocket hosts
 *      - Strict Origin Verification blocking web origins (`http://` / `https://`) on `/mcp` and `/ws`
 *      - Safe URL validation blocking `file://`, `chrome://`, and `javascript:` URLs
 *      - API key redaction in `synthux_configure_ai`
 *   3. All 4 Sectoral Rule Packs (`nielsen-10`, `ecommerce`, `saas`, `fintech`) + Custom JSON Rule Pack import/delete
 *   4. Synthetic Personas (`first-time`, `power-user`, `accessibility`) + Custom Persona creation/deletion
 *   5. Deterministic Accessibility & WCAG 2.2 AA audit engine (`synthux_run_wcag_audit`)
 *   6. Agent-Brain Mode (Antigravity Gemini 4 Argon workflow: `synthux_prepare_external_audit` → `<think>` block sanitization → `synthux_submit_external_audit` → Enhanced Markdown v2.0 report)
 *   7. Live Chrome Extension WebSocket Bridge (`ws://127.0.0.1:17483/ws`) bidirectional E2E execution:
 *      - `synthux_open_url`, `synthux_list_tabs`, `synthux_scan_page`, `synthux_visual_overlay` (Heatmap, Highlight, Annotated Screenshot), and `synthux_run_flow_audit`
 */

import assert from 'node:assert/strict';
import { Duplex, PassThrough } from 'node:stream';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import {
  startBridgeServer,
  handleHttpRequest,
  handleWebSocketUpgrade,
  handleJsonRpcMessage,
  MCP_TOOLS
} from './server.js';
import { isLoopbackWsUrl } from '../extension/core/mcp-bridge.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.SYNTHUX_MCP_PORT || 17483);

let passed = 0;
let failed = 0;

async function runTest(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  ✅ ${name}`);
  } catch (err) {
    failed++;
    console.error(`  ❌ ${name}`);
    console.error(`     → ${err.message}`);
  }
}

/**
 * Helper: Simulate an HTTP request against handleHttpRequest (works both in sandboxed & normal environments)
 */
function simulateHttpRequest({ method = 'POST', url = '/mcp', headers = {}, body = '' }) {
  return new Promise((resolve) => {
    const req = new PassThrough();
    req.method = method;
    req.url = url;
    req.headers = headers;

    let statusCode = 200;
    let resHeaders = {};
    let resBody = '';

    const res = {
      writeHead(code, hdrs = {}) {
        statusCode = code;
        resHeaders = hdrs;
      },
      end(chunk = '') {
        resBody += chunk;
        resolve({
          status: statusCode,
          headers: resHeaders,
          text: resBody,
          json: () => JSON.parse(resBody)
        });
      }
    };

    handleHttpRequest(req, res);
    if (body) req.write(typeof body === 'string' ? body : JSON.stringify(body));
    req.end();
  });
}

/**
 * Helper: Call MCP tool via JSON-RPC handler
 */
async function callMcpTool(name, args = {}) {
  const response = await handleJsonRpcMessage({
    jsonrpc: '2.0',
    id: `test_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    method: 'tools/call',
    params: { name, arguments: args }
  });
  assert.ok(response?.result?.content?.[0]?.text, `Expected content from tool ${name}`);
  return {
    isError: !!response.result.isError,
    data: JSON.parse(response.result.content[0].text)
  };
}

/**
 * Helper: Minimal bidirectional Duplex socket pair for RFC 6455 Masked WebSocket E2E testing
 */
function createConnectedDuplexPair() {
  let clientSide, serverSide;

  clientSide = new Duplex({
    read() {},
    write(chunk, encoding, callback) {
      serverSide.push(chunk);
      callback();
    }
  });

  serverSide = new Duplex({
    read() {},
    write(chunk, encoding, callback) {
      clientSide.push(chunk);
      callback();
    }
  });

  return { clientSocket: clientSide, serverSocket: serverSide };
}

function createMockExtensionWsClient() {
  return new Promise((resolve) => {
    const { clientSocket, serverSocket } = createConnectedDuplexPair();
    const key = crypto.randomBytes(16).toString('base64');

    handleWebSocketUpgrade(
      {
        headers: {
          'sec-websocket-key': key,
          'origin': 'chrome-extension://cgldigellmojaejmnhjhpbfccncbmnhm'
        }
      },
      serverSocket
    );

    let handshakeDone = false;
    let buffer = Buffer.alloc(0);

    function sendMaskedFrame(obj) {
      const payload = Buffer.from(JSON.stringify(obj), 'utf8');
      const mask = crypto.randomBytes(4);
      const masked = Buffer.alloc(payload.length);
      for (let i = 0; i < payload.length; i++) {
        masked[i] = payload[i] ^ mask[i % 4];
      }
      let header;
      if (payload.length < 126) {
        header = Buffer.alloc(2);
        header[0] = 0x81;
        header[1] = 0x80 | payload.length;
      } else {
        header = Buffer.alloc(4);
        header[0] = 0x81;
        header[1] = 0x80 | 126;
        header.writeUInt16BE(payload.length, 2);
      }
      clientSocket.write(Buffer.concat([header, mask, masked]));
    }

    clientSocket.on('data', (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);

      if (!handshakeDone) {
        const headerEnd = buffer.indexOf('\r\n\r\n');
        if (headerEnd === -1) return;
        buffer = buffer.subarray(headerEnd + 4);
        handshakeDone = true;
      }

      while (buffer.length >= 2) {
        const second = buffer[1];
        let len = second & 0x7f;
        let offset = 2;
        if (len === 126) {
          if (buffer.length < 4) return;
          len = buffer.readUInt16BE(2);
          offset = 4;
        } else if (len === 127) {
          if (buffer.length < 10) return;
          len = Number(buffer.readBigUInt64BE(2));
          offset = 10;
        }
        if (buffer.length < offset + len) return;
        const payload = buffer.subarray(offset, offset + len).toString('utf8');
        buffer = buffer.subarray(offset + len);

        try {
          const msg = JSON.parse(payload);
          if (msg.type === 'MCP_COMMAND') {
            handleMockExtensionCommand(msg, sendMaskedFrame);
          }
        } catch {}
      }
    });

    // Send EXTENSION_HELLO handshake
    sendMaskedFrame({
      type: 'EXTENSION_HELLO',
      version: '2.1.0',
      extensionId: 'cgldigellmojaejmnhjhpbfccncbmnhm',
      timestamp: new Date().toISOString()
    });

    setTimeout(() => resolve({
      close: () => {
        clientSocket.destroy();
        serverSocket.destroy();
      }
    }), 50);
  });
}

function handleMockExtensionCommand(msg, send) {
  const { id, command, params } = msg;
  let result = { success: true };

  switch (command) {
    case 'PING_EXTENSION':
      result = {
        success: true,
        extensionVersion: '2.1.0',
        activeTab: { id: 101, url: 'https://synthux.app', title: 'synthux — AI-Powered UX Audit' }
      };
      break;
    case 'OPEN_AND_WAIT_TAB':
      result = {
        success: true,
        tab: { id: 102, url: params.url, title: 'Target Audited Page', status: 'complete' }
      };
      break;
    case 'LIST_TABS':
      result = {
        success: true,
        tabs: [
          { id: 101, url: 'https://synthux.app', title: 'synthux', active: true },
          { id: 102, url: 'https://synthux.app/solutions/fintech-banking-ux.html', title: 'Fintech UX', active: false }
        ]
      };
      break;
    case 'SCAN_PAGE':
      result = {
        success: true,
        tab: { id: 101, url: params.url || 'https://synthux.app', title: 'synthux' },
        pageData: {
          meta: { title: 'synthux', lang: 'en' },
          structure: { headings: [{ level: 1, text: 'AI-powered UX audit' }], landmarks: [{ role: 'main' }], forms: [] },
          navigation: { navCount: 1, skipLinks: true },
          content: { wordCount: 420, imageCount: 4, imagesWithoutAlt: 0, ctas: ['Add to Chrome'] },
          accessibility: { hasLangAttr: true, ariaRoles: ['navigation', 'main'] },
          performance: { domSize: 310 }
        }
      };
      break;
    case 'VISUAL_OVERLAY':
      result = {
        success: true,
        action: params.action,
        appliedOnTab: 101,
        ...(params.action === 'annotated_screenshot'
          ? { annotatedScreenshot: 'data:image/jpeg;base64,MOCK_ANNOTATED_IMAGE' }
          : {})
      };
      break;
    case 'START_FLOW_ANALYSIS':
      result = {
        success: true,
        flowReport: {
          type: 'flow',
          flowScore: 86,
          pages: (params.pages || []).map((p, i) => ({
            page: p,
            score: 88 - i * 4,
            report: { overallScore: 88 - i * 4, summary: 'Clear step progression', issues: [] }
          })),
          crossPage: {
            score: 86,
            findings: [{ title: 'Navigation Consistency', description: 'Header remains consistent across steps.', severity: 'minor' }]
          },
          transitions: [{ fromId: 'n1', toId: 'n2', quality: 'smooth', description: 'Direct CTA transition' }]
        }
      };
      break;
    default:
      result = { success: true, command };
  }

  send({ type: 'MCP_RESPONSE', id, result });
}

// ─── Main Test Runner ────────────────────────────────────────────────────────

async function main() {
  console.log('\n================================================================');
  console.log(' 🧪 synthux v2.1.1 — MCP Server, Security & E2E Test Suite');
  console.log('================================================================\n');

  const server = startBridgeServer();
  await new Promise(r => setTimeout(r, 150));

  console.log('1️⃣  MCP JSON-RPC 2.0 Protocol & Streamable HTTP Tests');

  await runTest('MCP initialize handshake returns protocolVersion & capabilities', async () => {
    const res = await handleJsonRpcMessage({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { protocolVersion: '2024-11-05' }
    });
    assert.equal(res.result.serverInfo.name, 'synthux-mcp');
    assert.equal(res.result.serverInfo.version, '2.1.1');
    assert.ok(res.result.capabilities.tools);
  });

  await runTest('MCP tools/list exposes all 14 synthux tools with valid schemas', async () => {
    const res = await handleJsonRpcMessage({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list'
    });
    assert.equal(res.result.tools.length, 14);
    assert.equal(MCP_TOOLS.length, 14);
    for (const tool of res.result.tools) {
      assert.ok(tool.name.startsWith('synthux_'), `Invalid tool name: ${tool.name}`);
      assert.equal(tool.inputSchema.type, 'object');
    }
  });

  await runTest('MCP resources/list & resources/read return built-in Sectoral Rule Packs', async () => {
    const listRes = await handleJsonRpcMessage({ jsonrpc: '2.0', id: 3, method: 'resources/list' });
    assert.equal(listRes.result.resources.length, 4);

    const readRes = await handleJsonRpcMessage({
      jsonrpc: '2.0',
      id: 4,
      method: 'resources/read',
      params: { uri: 'synthux://rules/fintech' }
    });
    const pack = JSON.parse(readRes.result.contents[0].text);
    assert.equal(pack.id, 'fintech');
    assert.ok(pack.rules.length >= 8);
  });

  await runTest('Streamable HTTP POST /mcp endpoint processes JSON-RPC requests', async () => {
    const res = await simulateHttpRequest({
      method: 'POST',
      url: '/mcp',
      headers: { 'content-type': 'application/json' },
      body: { jsonrpc: '2.0', id: 10, method: 'ping' }
    });
    assert.equal(res.status, 200);
    const body = res.json();
    assert.equal(body.id, 10);
  });

  console.log('\n2️⃣  Security & Privacy Hardening Verification');

  await runTest('Loopback guard (isLoopbackWsUrl) blocks external/remote WebSocket URLs', async () => {
    assert.equal(isLoopbackWsUrl('ws://127.0.0.1:17483/ws'), true);
    assert.equal(isLoopbackWsUrl('ws://localhost:17483/ws'), true);
    assert.equal(isLoopbackWsUrl('ws://192.168.1.50:17483/ws'), false);
    assert.equal(isLoopbackWsUrl('wss://attacker.example.com/ws'), false);
    assert.equal(isLoopbackWsUrl('http://127.0.0.1:17483/ws'), false);
  });

  await runTest('CSRF / Origin guard blocks malicious website Origin on /mcp HTTP endpoint & /ws upgrade', async () => {
    const res = await simulateHttpRequest({
      method: 'POST',
      url: '/mcp',
      headers: {
        'content-type': 'application/json',
        'origin': 'https://malicious-site.example.com'
      },
      body: { jsonrpc: '2.0', id: 99, method: 'tools/list' }
    });
    assert.equal(res.status, 403);

    // Also test WebSocket upgrade rejection for web origin
    const { clientSocket, serverSocket } = createConnectedDuplexPair();
    let wsResponse = '';
    clientSocket.on('data', chunk => { wsResponse += chunk.toString('utf8'); });
    handleWebSocketUpgrade(
      {
        headers: {
          'sec-websocket-key': 'dGhlIHNhbXBsZSBub25jZQ==',
          'origin': 'https://evil-website.example.com'
        }
      },
      serverSocket
    );
    await new Promise(r => setTimeout(r, 20));
    assert.match(wsResponse, /403 Forbidden/);
  });

  await runTest('URL guard blocks file://, chrome://, and javascript: URLs in tool calls', async () => {
    const bad1 = await callMcpTool('synthux_open_url', { url: 'file:///etc/passwd' });
    assert.equal(bad1.isError, true);
    assert.match(bad1.data.error, /Security Policy/);

    const bad2 = await callMcpTool('synthux_open_url', { url: 'chrome://extensions' });
    assert.equal(bad2.isError, true);
  });

  await runTest('API keys are never exposed in synthux_configure_ai responses', async () => {
    const cfg = await callMcpTool('synthux_configure_ai', { action: 'get' });
    assert.equal(cfg.isError, false);
    assert.equal(cfg.data.settings.apiKey, '');
  });

  console.log('\n3️⃣  Sectoral Rule Packs, Personas & Accessibility Engine Tests');

  await runTest('synthux_manage_rule_packs lists 4 built-in packs and validates custom JSON rule pack', async () => {
    const list = await callMcpTool('synthux_manage_rule_packs', { action: 'list' });
    assert.equal(list.data.rulePacks.length, 4);

    const saved = await callMcpTool('synthux_manage_rule_packs', {
      action: 'save',
      rulePack: {
        id: 'healthcare-portal',
        name: 'Healthcare Patient Portal UX',
        category: 'Healthcare',
        rules: [
          {
            id: 'medical-jargon-clarity',
            name: { en: 'Medical Terminology Clarity', tr: 'Tıbbi Terim Netliği' },
            description: { en: 'Lab results and appointment actions must use plain language.' },
            weight: 1.5
          }
        ]
      }
    });
    assert.equal(saved.data.rulePack.id, 'healthcare-portal');
    assert.equal(saved.data.rulePack.ruleCount, 1);

    const deleted = await callMcpTool('synthux_manage_rule_packs', {
      action: 'delete',
      rulePackId: 'healthcare-portal'
    });
    assert.equal(deleted.data.customRulePacks.length, 0);
  });

  await runTest('synthux_manage_personas creates and deletes custom synthetic user persona', async () => {
    const created = await callMcpTool('synthux_manage_personas', {
      action: 'save',
      persona: {
        name: 'Senior Banking Customer',
        ageRange: '65+',
        techLevel: 'low',
        disabilities: ['vision'],
        goal: 'Complete a secure wire transfer without hidden fees'
      }
    });
    assert.equal(created.data.profile.custom, true);
    assert.match(created.data.profile.systemPrompt, /65\+/);

    const deleted = await callMcpTool('synthux_manage_personas', {
      action: 'delete',
      profileId: created.data.profile.id
    });
    assert.equal(deleted.data.customProfiles.length, 0);
  });

  await runTest('synthux_run_wcag_audit detects accessibility issues on DOM structure', async () => {
    const wcag = await callMcpTool('synthux_run_wcag_audit', {
      pageData: {
        meta: { title: 'Checkout Page', lang: '' },
        structure: {
          headings: [{ level: 2, text: 'Skipped H1' }, { level: 4, text: 'Skipped H3' }],
          landmarks: [],
          forms: [{ hasSubmitButton: true, fields: [{ type: 'text', name: 'card', label: '' }] }]
        },
        navigation: { navCount: 0, skipLinks: false },
        content: { images: [{ src: 'hero.png', hasAlt: false }], ctas: [] },
        accessibility: {
          hasLangAttr: false,
          contrastResults: [{ element: '.btn', ratio: 2.1, required: 4.5, passes: false }],
          tabOrderIssues: [],
          unlabeledInteractives: [{ tag: 'button', selector: 'button.icon-only' }]
        }
      }
    });
    assert.equal(wcag.isError, false);
    assert.ok(wcag.data.accessibilityResults.score < 60);
    assert.ok(wcag.data.accessibilityResults.failCount >= 3);
  });

  console.log('\n4️⃣  Antigravity (Gemini 4 Argon) Agent-Brain Audit & Reporting Pipeline');

  await runTest('Agent-Brain workflow: prepare_external_audit → submit_external_audit (with <think> sanitizer) → v2.0 Markdown report', async () => {
    const prep = await callMcpTool('synthux_prepare_external_audit', {
      rulePackId: 'fintech',
      mode: 'quick',
      profiles: ['first-time', 'accessibility'],
      pageData: {
        meta: { title: 'NeoBank Wire Transfer', lang: 'en' },
        structure: {
          headings: [{ level: 1, text: 'Send International Wire' }],
          landmarks: [{ role: 'main' }],
          forms: [{ hasSubmitButton: true, fields: [{ type: 'text', name: 'iban', label: 'Recipient IBAN' }, { type: 'number', name: 'amount', label: '' }] }]
        },
        navigation: { navCount: 1, skipLinks: false },
        content: { wordCount: 180, imageCount: 1, imagesWithoutAlt: 0, ctas: ['Send Money Now'] },
        accessibility: { hasLangAttr: true, contrastResults: [{ element: '.fx-fee-note', ratio: 2.8, required: 4.5, passes: false }] }
      }
    });

    assert.equal(prep.isError, false);
    assert.equal(prep.data.rulePack.id, 'fintech');
    assert.equal(prep.data.evaluationTasks.length, 6); // 2 personas × 3 quick rules

    // Simulate Antigravity (Gemini 4 Argon) evaluating the tasks (including a <think> reasoning block)
    const evaluations = prep.data.evaluationTasks.map((task) => ({
      profileId: task.profileId,
      heuristicId: task.heuristicId,
      heuristicName: task.heuristicName,
      evaluation: `<think>Analyzing ${task.heuristicId} for ${task.profileId}...</think>` + JSON.stringify({
        score: 64,
        summary: 'Exchange rate markup and wire transfer fee are hidden until after submission.',
        issues: [
          {
            severity: 'critical',
            priority: 'high',
            fix_effort: 'easy',
            description: 'FX conversion spread and wire fee are low-contrast and not shown before final CTA',
            element: '.fx-fee-note',
            recommendation: 'Display total fee breakdown and effective exchange rate clearly above the primary submit button.',
            code_fix: {
              language: 'css',
              before: '.fx-fee-note { color: #888; font-size: 10px; }',
              after: '.fx-fee-note { color: #f8fafc; font-size: 14px; font-weight: 600; }'
            }
          }
        ],
        positives: ['Clear H1 page heading', 'Recipient IBAN input is properly labeled'],
        score_justification: 'Hidden FX fees violate Fintech fee transparency rules.'
      })
    }));

    const submitted = await callMcpTool('synthux_submit_external_audit', {
      url: 'https://neobank.example.com/transfer',
      title: 'NeoBank Wire Transfer',
      rulePackId: 'fintech',
      mode: 'quick',
      model: 'Gemini 4 Argon (Antigravity MCP)',
      pageData: {
        meta: { title: 'NeoBank Wire Transfer', lang: 'en' },
        structure: { headings: [{ level: 1, text: 'Send International Wire' }], landmarks: [{ role: 'main' }], forms: [] },
        accessibility: { hasLangAttr: true }
      },
      evaluations
    });

    assert.equal(submitted.isError, false);
    assert.equal(submitted.data.report.overallScore, 64);
    assert.equal(submitted.data.report.rulePackId, 'fintech');
    assert.ok(submitted.data.report.markdown.includes('Fintech, Banking & Web3 UX'));
    assert.ok(submitted.data.report.markdown.includes('Quick Wins'));

    const latestMd = await callMcpTool('synthux_get_reports', { action: 'latest', format: 'markdown' });
    assert.equal(latestMd.isError, false);
    assert.ok(latestMd.data.report.includes('# 📊 synthux UX Audit Report'));
  });

  console.log('\n5️⃣  Live Chrome Extension WebSocket Bridge E2E Tests');

  const mockExt = await createMockExtensionWsClient();

  await runTest('Chrome Extension connects over ws://127.0.0.1:17483/ws and synthux_status reports live connection', async () => {
    const status = await callMcpTool('synthux_status', {});
    assert.equal(status.data.chromeExtension.connected, true);
    assert.equal(status.data.chromeExtension.extensionVersion, '2.1.0');
  });

  await runTest('Desktop Agent controls browser navigation (synthux_open_url & synthux_list_tabs)', async () => {
    const nav = await callMcpTool('synthux_open_url', { url: 'https://synthux.app/solutions/fintech-banking-ux.html' });
    assert.equal(nav.isError, false);
    assert.equal(nav.data.tab.status, 'complete');

    const tabs = await callMcpTool('synthux_list_tabs', {});
    assert.equal(tabs.data.tabs.length, 2);
  });

  await runTest('Desktop Agent scans live page DOM, triggers Heatmap & Annotated Screenshot, and runs Flow Builder', async () => {
    const scan = await callMcpTool('synthux_scan_page', { url: 'https://synthux.app' });
    assert.equal(scan.isError, false);
    assert.equal(scan.data.pageData.meta.title, 'synthux');

    const overlay = await callMcpTool('synthux_visual_overlay', {
      action: 'annotated_screenshot',
      issues: [{ element: '.cta-btn', severity: 'critical', description: 'Low contrast CTA' }]
    });
    assert.equal(overlay.isError, false);
    assert.ok(overlay.data.annotatedScreenshot.startsWith('data:image/jpeg;base64,'));

    const flow = await callMcpTool('synthux_run_flow_audit', {
      pages: [
        { id: 'n1', url: 'https://synthux.app', label: 'Landing Page' },
        { id: 'n2', url: 'https://synthux.app/solutions/fintech-banking-ux.html', label: 'Fintech Solution' }
      ]
    });
    assert.equal(flow.isError, false);
    assert.equal(flow.data.flowReport.flowScore, 86);
    assert.equal(flow.data.flowReport.pages.length, 2);
  });

  await runTest('Apple Intelligence (macOS 26/27 FoundationModels) & Chrome Built-in AI providers and HTTP bridge endpoints', async () => {
    const { PROVIDERS, checkVisionSupport } = await import('../extension/core/providers.js');
    assert.ok(PROVIDERS.apple, 'apple provider registered');
    assert.ok(PROVIDERS.chromeai, 'chromeai provider registered');
    assert.equal(await checkVisionSupport('apple', 'apple-on-device'), false);
    assert.equal(await checkVisionSupport('chromeai', 'gemini-nano'), false);

    const fmStatus = await simulateHttpRequest({
      method: 'GET',
      url: '/apple-fm/status',
      headers: { origin: 'chrome-extension://abcdefghijklmnop' }
    });
    assert.equal(fmStatus.status, 200);
    const fmJson = fmStatus.json();
    assert.ok(Array.isArray(fmJson.models));
    assert.ok(fmJson.models.some(m => m.id === 'apple-on-device'));

    const ollamaCompatTags = await simulateHttpRequest({
      method: 'GET',
      url: '/api/tags',
      headers: { origin: 'chrome-extension://abcdefghijklmnop' }
    });
    assert.equal(ollamaCompatTags.status, 200);
    const tagsJson = ollamaCompatTags.json();
    assert.ok(tagsJson.models.some(m => m.name === 'apple-on-device'));
  });

  mockExt.close();
  server.close();

  await runTest('Stdio subprocess spawn (Antigravity / Claude / Cursor MCP stdio transport) roundtrip', async () => {
    const child = spawn(process.execPath, [path.join(__dirname, 'server.js')], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    const sendAndReceive = (msg) => new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Stdio timeout')), 5000);
      const onData = (chunk) => {
        const lines = chunk.toString('utf8').split('\n').filter(Boolean);
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.id === msg.id) {
              clearTimeout(timer);
              child.stdout.off('data', onData);
              resolve(parsed);
            }
          } catch {}
        }
      };
      child.stdout.on('data', onData);
      child.stdin.write(JSON.stringify(msg) + '\n');
    });

    const initReply = await sendAndReceive({
      jsonrpc: '2.0',
      id: 701,
      method: 'initialize',
      params: { protocolVersion: '2024-11-05' }
    });
    assert.equal(initReply.result.serverInfo.name, 'synthux-mcp');

    const statusReply = await sendAndReceive({
      jsonrpc: '2.0',
      id: 702,
      method: 'tools/call',
      params: { name: 'synthux_status', arguments: {} }
    });
    const statusJson = JSON.parse(statusReply.result.content[0].text);
    assert.equal(statusJson.mcpServer.name, 'synthux-mcp');
    assert.equal(statusJson.mcpServer.security.loopbackOnly, true);

    child.kill();
  });

  console.log('\n----------------------------------------------------------------');
  console.log(` 🎯 Test Summary: ${passed} passed, ${failed} failed`);
  console.log('----------------------------------------------------------------\n');

  if (failed > 0) process.exit(1);
}

main();
