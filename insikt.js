(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  // 1. INJECT CSS (Scoped to #dc-panel and #dc-fab)
  // ═══════════════════════════════════════════════════════════════
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Syne:wght@400;600;700;800&display=swap');

    :root {
      --dc-bg0: #0d0d0f;
      --dc-bg1: #141418;
      --dc-bg2: #1c1c22;
      --dc-bg3: #242430;
      --dc-border: #2a2a38;
      --dc-accent: #7c6af7;
      --dc-accent2: #f768a4;
      --dc-green: #3dffa0;
      --dc-orange: #ffb347;
      --dc-red: #ff5c6e;
      --dc-blue: #5bcefa;
      --dc-text0: #f0f0f8;
      --dc-text1: #a8a8c0;
      --dc-text2: #606078;
      --dc-mono: 'JetBrains Mono', monospace;
      --dc-sans: 'Syne', sans-serif;
    }

    /* Scope resets strictly to our elements */
    #dc-panel, #dc-fab { box-sizing: border-box; }
    #dc-panel *, #dc-fab * { box-sizing: inherit; }

    /* ── FAB ────────────────────────────── */
    #dc-fab {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: var(--dc-accent);
      color: #fff;
      border: none;
      font-size: 18px;
      cursor: pointer;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 24px rgba(124,106,247,0.5);
      transition: all 0.2s ease;
      font-family: var(--dc-mono);
      padding: 0;
      margin: 0;
    }

    #dc-fab:hover { transform: scale(1.05); box-shadow: 0 6px 30px rgba(124,106,247,0.7); }
    #dc-fab:active { transform: scale(0.95); }

    .dc-fab-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      min-width: 18px;
      height: 18px;
      background: var(--dc-red);
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      border-radius: 9px;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
      font-family: var(--dc-mono);
    }

    /* ── CONSOLE PANEL ───────────────────── */
    #dc-panel {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 320px;
      min-height: 120px;
      max-height: 85vh;
      background: var(--dc-bg1);
      border-top: 1px solid var(--dc-border);
      border-radius: 14px 14px 0 0;
      box-shadow: 0 -12px 50px rgba(0,0,0,0.6);
      display: none;
      flex-direction: column;
      z-index: 99998;
      overflow: hidden;
      font-family: var(--dc-mono);
      color: var(--dc-text0);
    }

    #dc-panel.visible {
      display: flex;
      animation: dcSlideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes dcSlideUp {
      from { transform: translateY(100%); opacity: 0; }
      to   { transform: translateY(0);   opacity: 1; }
    }

    /* Drag handle */
    #dc-drag {
      width: 100%;
      height: 22px;
      background: var(--dc-bg2);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: ns-resize;
      border-radius: 14px 14px 0 0;
      flex-shrink: 0;
      touch-action: none;
      user-select: none;
    }

    #dc-drag::before {
      content: '';
      width: 36px;
      height: 4px;
      background: var(--dc-border);
      border-radius: 2px;
      transition: background 0.2s;
    }

    #dc-drag:hover::before { background: var(--dc-accent); }

    /* Header bar */
    #dc-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: var(--dc-bg2);
      border-bottom: 1px solid var(--dc-border);
      flex-shrink: 0;
    }

    #dc-title {
      font-size: 11px;
      font-weight: 700;
      color: var(--dc-accent);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      flex: 1;
    }

    .dc-pulse {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--dc-green);
      animation: dcPulse 2s infinite;
      flex-shrink: 0;
    }

    @keyframes dcPulse {
      0%,100% { opacity: 1; box-shadow: 0 0 0 0 rgba(61,255,160,0.4); }
      50%      { opacity: 0.6; box-shadow: 0 0 0 5px rgba(61,255,160,0); }
    }

    .dc-hbtn {
      width: 28px;
      height: 28px;
      border: none;
      border-radius: 7px;
      background: var(--dc-bg3);
      color: var(--dc-text1);
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s;
      padding: 0;
    }

    .dc-hbtn:hover { background: var(--dc-border); color: var(--dc-text0); }

    /* Tabs */
    #dc-tabs {
      display: flex;
      background: var(--dc-bg0);
      border-bottom: 1px solid var(--dc-border);
      overflow-x: auto;
      scrollbar-width: none;
      flex-shrink: 0;
    }

    #dc-tabs::-webkit-scrollbar { display: none; }

    .dc-tab {
      padding: 10px 14px;
      background: none;
      border: none;
      color: var(--dc-text2);
      font-family: var(--dc-mono);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.05em;
      cursor: pointer;
      white-space: nowrap;
      border-bottom: 2px solid transparent;
      transition: all 0.15s;
      position: relative;
    }

    .dc-tab:hover { color: var(--dc-text1); }

    .dc-tab.active {
      color: var(--dc-accent);
      border-bottom-color: var(--dc-accent);
    }

    .dc-tab-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 16px;
      height: 16px;
      background: var(--dc-accent);
      color: #fff;
      font-size: 9px;
      font-weight: 700;
      border-radius: 8px;
      padding: 0 4px;
      margin-left: 5px;
    }

    /* Tab panels */
    .dc-panel-content {
      display: none;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
    }

    .dc-panel-content.active { display: flex; }

    .dc-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 10px 12px;
      scrollbar-width: thin;
      scrollbar-color: var(--dc-border) transparent;
    }

    .dc-scroll::-webkit-scrollbar { width: 4px; }
    .dc-scroll::-webkit-scrollbar-thumb { background: var(--dc-border); border-radius: 2px; }

    /* ── LOG ENTRIES ──────────────────────── */
    .dc-entry {
      display: flex;
      align-items: baseline;
      gap: 8px;
      padding: 5px 8px;
      border-radius: 5px;
      margin-bottom: 3px;
      font-size: 12px;
      line-height: 1.5;
      word-break: break-word;
      animation: dcFadeIn 0.1s ease;
    }

    @keyframes dcFadeIn { from { opacity: 0; transform: translateY(2px); } to { opacity: 1; transform: none; } }

    .dc-entry-log  { color: var(--dc-text0); }
    .dc-entry-warn { color: var(--dc-orange); background: rgba(255,179,71,0.07); border-left: 2px solid var(--dc-orange); }
    .dc-entry-error { color: var(--dc-red); background: rgba(255,92,110,0.07); border-left: 2px solid var(--dc-red); }
    .dc-entry-info { color: var(--dc-blue); background: rgba(91,206,250,0.06); border-left: 2px solid var(--dc-blue); }
    .dc-entry-cmd  { color: var(--dc-accent); background: rgba(124,106,247,0.06); }

    .dc-ts {
      color: var(--dc-text2);
      font-size: 10px;
      font-weight: 400;
      flex-shrink: 0;
      letter-spacing: 0;
    }

    .dc-entry pre {
      white-space: pre-wrap;
      word-break: break-all;
      background: var(--dc-bg0);
      padding: 6px 8px;
      border-radius: 5px;
      margin-top: 4px;
      font-size: 11px;
      color: var(--dc-green);
      width: 100%;
    }

    /* ── REPL INPUT ───────────────────────── */
    .dc-repl {
      display: flex;
      gap: 8px;
      padding: 8px 12px;
      background: var(--dc-bg2);
      border-top: 1px solid var(--dc-border);
      flex-shrink: 0;
    }

    .dc-input {
      flex: 1;
      padding: 8px 12px;
      background: var(--dc-bg0);
      border: 1px solid var(--dc-border);
      border-radius: 8px;
      color: var(--dc-text0);
      font-family: var(--dc-mono);
      font-size: 13px;
      outline: none;
      transition: border-color 0.15s;
    }

    .dc-input:focus { border-color: var(--dc-accent); box-shadow: 0 0 0 2px rgba(124,106,247,0.15); }

    .dc-run-btn {
      padding: 8px 14px;
      background: var(--dc-accent);
      border: none;
      border-radius: 8px;
      color: #fff;
      font-family: var(--dc-mono);
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s;
      letter-spacing: 0.05em;
    }

    .dc-run-btn:hover { background: #8f7ffb; }
    .dc-run-btn:active { transform: scale(0.96); }

    /* ── NETWORK TAB ──────────────────────── */
    .dc-net-filter {
      display: flex;
      gap: 8px;
      padding: 8px 12px;
      background: var(--dc-bg2);
      border-bottom: 1px solid var(--dc-border);
      flex-shrink: 0;
    }

    .dc-filter-input {
      flex: 1;
      padding: 7px 10px;
      background: var(--dc-bg0);
      border: 1px solid var(--dc-border);
      border-radius: 8px;
      color: var(--dc-text0);
      font-family: var(--dc-mono);
      font-size: 12px;
      outline: none;
    }

    .dc-filter-input:focus { border-color: var(--dc-accent); }

    .dc-clear-btn {
      padding: 7px 12px;
      background: var(--dc-bg3);
      border: 1px solid var(--dc-border);
      border-radius: 8px;
      color: var(--dc-text1);
      font-family: var(--dc-mono);
      font-size: 11px;
      cursor: pointer;
    }

    .dc-clear-btn:hover { border-color: var(--dc-red); color: var(--dc-red); }

    .dc-req {
      padding: 9px 10px;
      border-radius: 6px;
      margin-bottom: 4px;
      background: var(--dc-bg2);
      cursor: pointer;
      border: 1px solid transparent;
      transition: border-color 0.15s;
    }

    .dc-req:hover { border-color: var(--dc-border); }
    .dc-req.expanded { border-color: var(--dc-accent); }

    .dc-req-top {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 11px;
    }

    .dc-method {
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.05em;
      flex-shrink: 0;
    }

    .m-GET    { background: rgba(61,255,160,0.15); color: var(--dc-green); }
    .m-POST   { background: rgba(91,206,250,0.15); color: var(--dc-blue); }
    .m-PUT    { background: rgba(255,179,71,0.15); color: var(--dc-orange); }
    .m-DELETE { background: rgba(255,92,110,0.15); color: var(--dc-red); }
    .m-PATCH  { background: rgba(124,106,247,0.15); color: var(--dc-accent); }
    .m-UNK    { background: var(--dc-bg3); color: var(--dc-text2); }

    .dc-req-url {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--dc-text0);
    }

    .dc-req-status { flex-shrink: 0; }
    .s-ok   { color: var(--dc-green); }
    .s-redir { color: var(--dc-orange); }
    .s-err  { color: var(--dc-red); }

    .dc-req-meta {
      color: var(--dc-text2);
      font-size: 10px;
      margin-top: 3px;
    }

    .dc-req-detail {
      display: none;
      margin-top: 8px;
      background: var(--dc-bg0);
      border-radius: 6px;
      padding: 10px 12px;
      font-size: 11px;
      color: var(--dc-text1);
    }

    .dc-req-detail.open { display: block; }

    .dc-detail-section { margin-bottom: 10px; }
    .dc-detail-title { color: var(--dc-accent); font-weight: 700; margin-bottom: 4px; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; }
    .dc-detail-row { padding: 2px 0; word-break: break-all; }
    .dc-detail-key { color: var(--dc-text2); }

    /* ── STORAGE TAB ──────────────────────── */
    .dc-storage-nav {
      display: flex;
      gap: 4px;
      padding: 8px 12px;
      background: var(--dc-bg2);
      border-bottom: 1px solid var(--dc-border);
      flex-shrink: 0;
    }

    .dc-st-btn {
      padding: 5px 12px;
      border: 1px solid var(--dc-border);
      border-radius: 100px;
      background: none;
      color: var(--dc-text2);
      font-family: var(--dc-mono);
      font-size: 11px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .dc-st-btn.active { background: var(--dc-accent); border-color: var(--dc-accent); color: #fff; }
    .dc-st-btn:hover:not(.active) { border-color: var(--dc-text2); color: var(--dc-text1); }

    .dc-storage-actions {
      display: flex;
      justify-content: flex-end;
      padding: 6px 12px;
      flex-shrink: 0;
    }

    .dc-db-card {
      background: var(--dc-bg2);
      border: 1px solid var(--dc-border);
      border-radius: 8px;
      margin-bottom: 8px;
      overflow: hidden;
    }

    .dc-db-header {
      padding: 10px 14px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--dc-bg3);
      transition: background 0.15s;
    }

    .dc-db-header:hover { background: var(--dc-border); }

    .dc-db-name { color: var(--dc-blue); font-size: 12px; font-weight: 700; }
    .dc-db-meta { color: var(--dc-text2); font-size: 10px; margin-top: 2px; }

    .dc-db-body { display: none; padding: 10px; }
    .dc-db-card.open .dc-db-body { display: block; }

    .dc-store-item {
      padding: 8px 10px;
      background: var(--dc-bg0);
      border-radius: 5px;
      margin-bottom: 6px;
      cursor: pointer;
      border: 1px solid transparent;
      transition: border-color 0.15s;
    }

    .dc-store-item:hover { border-color: var(--dc-border); }
    .dc-store-name { color: var(--dc-text0); font-size: 12px; font-weight: 600; }
    .dc-store-meta { color: var(--dc-text2); font-size: 10px; margin-top: 2px; }

    .dc-data-viewer {
      display: none;
      margin-top: 8px;
      max-height: 180px;
      overflow-y: auto;
    }

    .dc-data-viewer.open { display: block; }

    .dc-data-row {
      padding: 6px 8px;
      border-bottom: 1px solid var(--dc-border);
      font-size: 11px;
    }

    .dc-data-key  { color: #ffd700; font-weight: 600; }
    .dc-data-val  { color: var(--dc-blue); margin-top: 3px; word-break: break-all; }

    .dc-kv-row {
      display: flex;
      gap: 8px;
      align-items: baseline;
      padding: 6px 0;
      border-bottom: 1px solid var(--dc-border);
      font-size: 11px;
    }

    .dc-kv-key { color: #ffd700; font-weight: 600; min-width: 100px; word-break: break-all; }
    .dc-kv-val { color: var(--dc-blue); flex: 1; word-break: break-all; }

    .dc-empty {
      padding: 24px;
      text-align: center;
      color: var(--dc-text2);
      font-size: 12px;
    }

    /* ── DOM TAB ──────────────────────────────────── */
    .dc-dom-toolbar {
      display: flex;
      gap: 8px;
      padding: 8px 12px;
      background: var(--dc-bg2);
      border-bottom: 1px solid var(--dc-border);
      flex-shrink: 0;
    }

    .dc-dom-btn {
      padding: 5px 12px;
      border: 1px solid var(--dc-border);
      border-radius: 100px;
      background: none;
      color: var(--dc-text2);
      font-size: 11px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .dc-dom-btn:hover { border-color: var(--dc-accent); color: var(--dc-accent); }
    .dc-dom-btn.picking { background: var(--dc-accent2); border-color: var(--dc-accent2); color: #fff; }

    .dc-tree { font-size: 12px; }

    .dc-node-label {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 3px 4px;
      border-radius: 4px;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      user-select: none;
      transition: background 0.1s;
    }

    .dc-node-label:hover { background: var(--dc-bg3); }

    .dc-arrow { color: var(--dc-text2); width: 12px; flex-shrink: 0; font-size: 9px; }
    .dc-tag   { color: var(--dc-accent2); font-weight: 600; }
    .dc-id    { color: var(--dc-blue); }
    .dc-cls   { color: var(--dc-orange); }
    .dc-txt-preview { color: var(--dc-text2); font-size: 10px; max-width: 150px; overflow: hidden; text-overflow: ellipsis; }

    .dc-children { margin-left: 16px; display: none; }
    .dc-children.open { display: block; }

    .dc-node-detail {
      background: var(--dc-bg0);
      border: 1px solid var(--dc-border);
      border-radius: 6px;
      padding: 12px;
      margin: 8px 0;
      font-size: 11px;
    }

    .dc-attr-row { padding: 3px 0; }
    .dc-attr-name { color: var(--dc-blue); }
    .dc-attr-val  { color: var(--dc-green); }

    /* ── SYSTEM TAB ───────────────────────────────── */
    .dc-sys-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      padding: 10px 12px;
    }

    .dc-sys-card {
      background: var(--dc-bg2);
      border: 1px solid var(--dc-border);
      border-radius: 8px;
      padding: 12px 14px;
    }

    .dc-sys-label {
      color: var(--dc-text2);
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 5px;
    }

    .dc-sys-val {
      color: var(--dc-text0);
      font-size: 11px;
      line-height: 1.4;
    }

    .dc-sys-full { grid-column: 1 / -1; }

    /* ── SETTINGS TAB ─────────────────────────────── */
    .dc-settings-body { padding: 10px 12px; }

    .dc-setting-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid var(--dc-border);
    }

    .dc-setting-row:last-child { border-bottom: none; }

    .dc-setting-info { flex: 1; }
    .dc-setting-name { color: var(--dc-text0); font-size: 12px; font-weight: 600; }
    .dc-setting-desc { color: var(--dc-text2); font-size: 10px; margin-top: 2px; }

    .dc-toggle {
      position: relative;
      width: 40px;
      height: 22px;
      flex-shrink: 0;
    }

    .dc-toggle input { opacity: 0; width: 0; height: 0; }

    .dc-toggle-track {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: var(--dc-border);
      border-radius: 11px;
      cursor: pointer;
      transition: background 0.2s;
    }

    .dc-toggle input:checked + .dc-toggle-track { background: var(--dc-accent); }

    .dc-toggle-track::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      background: white;
      border-radius: 50%;
      top: 3px; left: 3px;
      transition: transform 0.2s;
    }

    .dc-toggle input:checked + .dc-toggle-track::after { transform: translateX(18px); }

    .dc-select {
      background: var(--dc-bg0);
      border: 1px solid var(--dc-border);
      border-radius: 6px;
      color: var(--dc-text0);
      font-size: 12px;
      padding: 6px 10px;
      outline: none;
    }

    /* ── PICK highlight ───────────────────────────── */
    .dc-pick-highlight {
      outline: 2px dashed var(--dc-accent2) !important;
      outline-offset: 2px;
      background: rgba(247,104,164,0.08) !important;
    }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ═══════════════════════════════════════════════════════════════
  // 2. INJECT HTML
  // ═══════════════════════════════════════════════════════════════
  const html = `
  <button id="dc-fab" title="DevConsole">
    <span id="dc-fab-icon">⌥</span>
    <span class="dc-fab-badge" id="dc-error-badge">0</span>
  </button>

  <div id="dc-panel">
    <div id="dc-drag"></div>
    <div id="dc-header">
      <span id="dc-title">DevConsole</span>
      <span class="dc-pulse"></span>
      <button class="dc-hbtn" id="dc-clear-btn" title="Clear active tab">🗑</button>
      <button class="dc-hbtn" id="dc-copy-btn" title="Copy logs to clipboard">📋</button>
      <button class="dc-hbtn" id="dc-minimize-btn" title="Minimize">−</button>
    </div>

    <div id="dc-tabs">
      <button class="dc-tab active" data-tab="console">Console<span class="dc-tab-count" id="cnt-console" style="display:none"></span></button>
      <button class="dc-tab" data-tab="network">Network<span class="dc-tab-count" id="cnt-network" style="display:none"></span></button>
      <button class="dc-tab" data-tab="storage">Storage</button>
      <button class="dc-tab" data-tab="dom">DOM</button>
      <button class="dc-tab" data-tab="system">System</button>
      <button class="dc-tab" data-tab="settings">⚙</button>
    </div>

    <div class="dc-panel-content active" id="panel-console">
      <div class="dc-scroll" id="console-output"></div>
      <div class="dc-repl">
        <input class="dc-input" id="repl-input" placeholder="▶ execute javascript…" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
        <button class="dc-run-btn" id="repl-run">RUN</button>
      </div>
    </div>

    <div class="dc-panel-content" id="panel-network">
      <div class="dc-net-filter">
        <input class="dc-filter-input" id="net-filter" placeholder="Filter by URL or method…">
        <button class="dc-clear-btn" id="net-clear">Clear</button>
      </div>
      <div class="dc-scroll" id="network-output"></div>
    </div>

    <div class="dc-panel-content" id="panel-storage">
      <div class="dc-storage-nav">
        <button class="dc-st-btn active" data-storage="indexeddb">IndexedDB</button>
        <button class="dc-st-btn" data-storage="localstorage">LocalStorage</button>
        <button class="dc-st-btn" data-storage="sessionstorage">SessionStorage</button>
      </div>
      <div class="dc-storage-actions">
        <button class="dc-clear-btn" id="storage-refresh">↺ Refresh</button>
      </div>
      <div class="dc-scroll" id="storage-output"></div>
    </div>

    <div class="dc-panel-content" id="panel-dom">
      <div class="dc-dom-toolbar">
        <button class="dc-dom-btn" id="dom-refresh-btn">↺ Refresh tree</button>
        <button class="dc-dom-btn" id="dom-pick-btn">⊕ Pick element</button>
        <button class="dc-dom-btn" id="dom-collapse-btn">Collapse all</button>
      </div>
      <div class="dc-scroll" id="dom-output"></div>
    </div>

    <div class="dc-panel-content" id="panel-system">
      <div class="dc-scroll">
        <div class="dc-sys-grid" id="system-output"></div>
      </div>
    </div>

    <div class="dc-panel-content" id="panel-settings">
      <div class="dc-scroll dc-settings-body" id="settings-output"></div>
    </div>
  </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', html);

  // ═══════════════════════════════════════════════════════════════
  // 3. LOGIC
  // ═══════════════════════════════════════════════════════════════
  
  const S = {
    logs: [],
    network: [],
    dbs: [],
    activeTab: 'console',
    activeStorage: 'indexeddb',
    isPicking: false,
    replHistory: [],
    replHistoryIdx: -1,
    errorCount: 0,
    settings: {
      timestamps: true,
      autoScroll: true,
      maxEntries: 500,
      fontSize: 12,
      monitorNetwork: true,
      captureErrors: true,
      theme: 'dark',
    }
  };

  function saveSettings() {
    try { localStorage.setItem('__dc_settings', JSON.stringify(S.settings)); } catch(e) {}
  }

  function loadSettings() {
    try {
      const saved = localStorage.getItem('__dc_settings');
      if (saved) S.settings = { ...S.settings, ...JSON.parse(saved) };
    } catch(e) {}
  }
  loadSettings();

  const el = {
    fab:      () => document.getElementById('dc-fab'),
    panel:    () => document.getElementById('dc-panel'),
    consOut:  () => document.getElementById('console-output'),
    netOut:   () => document.getElementById('network-output'),
    storOut:  () => document.getElementById('storage-output'),
    domOut:   () => document.getElementById('dom-output'),
    sysOut:   () => document.getElementById('system-output'),
    settOut:  () => document.getElementById('settings-output'),
    replIn:   () => document.getElementById('repl-input'),
    netFlt:   () => document.getElementById('net-filter'),
    badge:    () => document.getElementById('dc-error-badge'),
    cntC:     () => document.getElementById('cnt-console'),
    cntN:     () => document.getElementById('cnt-network'),
  };

  function ts() {
    const d = new Date();
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}.${String(d.getMilliseconds()).padStart(3,'0')}`;
  }

  function escHtml(s) {
    return String(s).replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>');
  }

  function formatArg(a) {
    if (a === null) return '<span style="color:#aaa">null</span>';
    if (a === undefined) return '<span style="color:#aaa">undefined</span>';
    if (typeof a === 'object') {
      try {
        const s = JSON.stringify(a, null, 2);
        return `<pre>${escHtml(s)}</pre>`;
      } catch(e) { return String(a); }
    }
    return escHtml(String(a));
  }

  function truncUrl(url, max=55) {
    if (!url || url.length <= max) return url;
    try {
      const u = new URL(url);
      const tail = u.pathname.split('/').pop() || '';
      return `${u.hostname}/…/${tail}`;
    } catch(e) {
      return url.slice(0,max)+'…';
    }
  }

  function statusClass(code) {
    if (!code) return '';
    if (code < 300) return 's-ok';
    if (code < 400) return 's-redir';
    return 's-err';
  }

  function methodClass(m) {
    return `m-${['GET','POST','PUT','DELETE','PATCH'].includes(m) ? m : 'UNK'}`;
  }

  // ══ CONSOLE INTERCEPT ═════════════════════════════════════════════
  const _orig = {};
  ['log','warn','error','info'].forEach(level => {
    _orig[level] = console[level].bind(console);
    console[level] = (...args) => {
      _orig[level](...args);
      addLog(level, args);
    };
  });

  function addLog(type, args) {
    if (type === 'error') {
      S.errorCount++;
      const b = el.badge();
      if (b) { b.textContent = S.errorCount > 99 ? '99+' : S.errorCount; b.style.display = 'flex'; }
    }
    S.logs.push({ type, args, ts: ts() });
    if (S.logs.length > S.settings.maxEntries) S.logs.shift();
    updateTabCount('console', S.logs.length);
    if (S.activeTab === 'console') renderConsole();
  }

  function renderConsole() {
    const o = el.consOut(); if (!o) return;
    const frag = document.createDocumentFragment();
    S.logs.forEach(log => {
      const d = document.createElement('div');
      d.className = `dc-entry dc-entry-${log.type}`;
      const tsHtml = S.settings.timestamps ? `<span class="dc-ts">${log.ts}</span>` : '';
      const msgHtml = log.args.map(formatArg).join(' ');
      d.innerHTML = `${tsHtml}<span>${msgHtml}</span>`;
      d.style.fontSize = S.settings.fontSize + 'px';
      frag.appendChild(d);
    });
    o.innerHTML = '';
    o.appendChild(frag);
    if (S.settings.autoScroll) o.scrollTop = o.scrollHeight;
  }

  // ══ ERROR CAPTURE ═════════════════════════════════════════════════
  if (S.settings.captureErrors) {
    window.onerror = (msg, src, line, col) => {
      addLog('error', [`${msg} @ ${src}:${line}:${col}`]);
      return false;
    };
    window.addEventListener('unhandledrejection', e => {
      addLog('error', [`Unhandled Promise Rejection: ${e.reason}`]);
    });
  }

  // ══ NETWORK INTERCEPT ═════════════════════════════════════════════
  const _origFetch = window.fetch;
  window.fetch = async (...args) => {
    const startTime = Date.now();
    let method = 'GET';
    let url = args[0] instanceof Request ? args[0].url : String(args[0]);
    if (args[1] && args[1].method) method = args[1].method.toUpperCase();
    if (args[0] instanceof Request) method = args[0].method.toUpperCase();
    const req = { method, url, ts: ts(), startTime, status: null, duration: null, headers: {}, error: null };

    try {
      const res = await _origFetch(...args);
      req.status = res.status;
      req.statusText = res.statusText;
      req.duration = Date.now() - startTime;
      try { res.headers.forEach((v,k) => { req.headers[k] = v; }); } catch(e) {}
      addNetReq(req);
      return res;
    } catch(e) {
      req.error = e.message;
      req.duration = Date.now() - startTime;
      addNetReq(req);
      throw e;
    }
  };

  const _origOpen = XMLHttpRequest.prototype.open;
  const _origSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function(method, url) {
    this.__dcReq = { method: method.toUpperCase(), url: String(url), ts: ts(), startTime: 0 };
    return _origOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function(body) {
    if (this.__dcReq) {
      const req = this.__dcReq;
      req.startTime = Date.now();
      this.addEventListener('loadend', () => {
        req.status = this.status;
        req.statusText = this.statusText;
        req.duration = Date.now() - req.startTime;
        req.headers = {};
        const raw = this.getAllResponseHeaders();
        if (raw) raw.split('\r\n').filter(Boolean).forEach(line => {
          const i = line.indexOf(': ');
          if (i > 0) req.headers[line.slice(0,i)] = line.slice(i+2);
        });
        req.error = this.status === 0 ? 'Request failed' : null;
        addNetReq(req);
      });
    }
    return _origSend.apply(this, arguments);
  };

  function addNetReq(req) {
    S.network.unshift(req);
    if (S.network.length > S.settings.maxEntries) S.network.pop();
    updateTabCount('network', S.network.length);
    if (S.activeTab === 'network') renderNetwork();
  }

  function renderNetwork(filter) {
    const o = el.netOut(); if (!o) return;
    filter = filter !== undefined ? filter : (el.netFlt() ? el.netFlt().value : '');
    const filtered = filter
      ? S.network.filter(r => r.url.toLowerCase().includes(filter.toLowerCase()) || r.method.toLowerCase().includes(filter.toLowerCase()))
      : S.network;

    o.innerHTML = filtered.map((req, i) => {
      const sc = req.error ? 's-err' : statusClass(req.status);
      const mc = methodClass(req.method);
      const statusLabel = req.status ? `<span class="dc-req-status ${sc}">${req.status}</span>` : (req.error ? `<span class="dc-req-status s-err">ERR</span>` : '<span class="dc-req-status" style="color:var(--dc-text2)">…</span>');
      const durLabel = req.duration != null ? `${req.duration}ms · ` : '';
      const headersHtml = Object.keys(req.headers).length
        ? Object.entries(req.headers).map(([k,v]) => `<div class="dc-detail-row"><span class="dc-detail-key">${escHtml(k)}: </span>${escHtml(v)}</div>`).join('')
        : '<div class="dc-detail-row" style="color:var(--dc-text2)">none</div>';
      return `<div class="dc-req" id="req-${i}" onclick="window.__dcToggleReq(${i})">
        <div class="dc-req-top">
          <span class="dc-method ${mc}">${req.method}</span>
          <span class="dc-req-url" title="${escHtml(req.url)}">${escHtml(truncUrl(req.url))}</span>
          ${statusLabel}
        </div>
        <div class="dc-req-meta">${durLabel}${req.ts}${req.error ? ' · ' + escHtml(req.error) : ''}</div>
        <div class="dc-req-detail" id="req-detail-${i}">
          <div class="dc-detail-section">
            <div class="dc-detail-title">General</div>
            <div class="dc-detail-row"><span class="dc-detail-key">URL: </span>${escHtml(req.url)}</div>
            <div class="dc-detail-row"><span class="dc-detail-key">Method: </span>${req.method}</div>
            <div class="dc-detail-row"><span class="dc-detail-key">Status: </span>${req.status || req.error || '–'} ${req.statusText || ''}</div>
            <div class="dc-detail-row"><span class="dc-detail-key">Duration: </span>${req.duration != null ? req.duration+'ms' : '–'}</div>
          </div>
          <div class="dc-detail-section">
            <div class="dc-detail-title">Response Headers</div>
            ${headersHtml}
          </div>
        </div>
      </div>`;

    }).join('') || '<div class="dc-empty">No requests captured yet</div>';
  }

  window.__dcToggleReq = function(i) {
    const detail = document.getElementById(`req-detail-${i}`);
    const card   = document.getElementById(`req-${i}`);
    if (!detail) return;
    const isOpen = detail.classList.contains('open');
    detail.classList.toggle('open', !isOpen);
    card.classList.toggle('expanded', !isOpen);
  };

  // ══ STORAGE ═══════════════════════════════════════════════════════
  async function loadStorage() {
    S.dbs = [];
    if (!window.indexedDB) return;
    try {
      if (indexedDB.databases) {
        const list = await indexedDB.databases();
        for (const d of list) {
          try { await inspectDb(d.name, d.version); } catch(e) {}
        }
      }
    } catch(e) {}
    renderStorage();
  }

  function inspectDb(name, version) {
    return new Promise((res, rej) => {
      const req = indexedDB.open(name, version);
      req.onerror = () => rej(req.error);
      req.onsuccess = () => {
        const db = req.result;
        const info = { name: db.name, version: db.version, stores: [] };
        const storeNames = [...db.objectStoreNames];
        let pending = storeNames.length;
        if (!pending) { db.close(); S.dbs.push(info); return res(info); }

        storeNames.forEach(storeName => {
          inspectStore(db, storeName).then(storeInfo => {
            info.stores.push(storeInfo);
            if (--pending === 0) { db.close(); S.dbs.push(info); res(info); }
          }).catch(() => {
            info.stores.push({ name: storeName, count: 0, keyPath: null, data: [] });
            if (--pending === 0) { db.close(); S.dbs.push(info); res(info); }
          });
        });
      };
    });
  }

  function inspectStore(db, storeName) {
    return new Promise((res, rej) => {
      const tx = db.transaction([storeName], 'readonly');
      const store = tx.objectStore(storeName);
      const cntReq = store.count();
      cntReq.onsuccess = () => {
        const info = { name: storeName, count: cntReq.result, keyPath: store.keyPath, data: [] };
        const getReq = store.getAll(undefined, 20);
        getReq.onsuccess = () => { info.data = getReq.result; res(info); };
        getReq.onerror = () => res(info);
      };
      cntReq.onerror = () => res({ name: storeName, count: 0, keyPath: null, data: [] });
    });
  }

  function renderStorage() {
    const o = el.storOut(); if (!o) return;
    switch (S.activeStorage) {
      case 'indexeddb':   renderIDB(o);   break;
      case 'localstorage':  renderKV(o, localStorage, 'localStorage');  break;
      case 'sessionstorage': renderKV(o, sessionStorage, 'sessionStorage'); break;
    }
  }

  function renderIDB(o) {
    if (!S.dbs.length) { o.innerHTML = '<div class="dc-empty">No IndexedDB databases found</div>'; return; }
    o.innerHTML = S.dbs.map((db, di) => `<div class="dc-db-card" id="db-card-${di}">
        <div class="dc-db-header" onclick="window.__dcToggleDb(${di})">
          <div>
            <div class="dc-db-name">${escHtml(db.name)}</div>
            <div class="dc-db-meta">v${db.version} · ${db.stores.length} store${db.stores.length !== 1 ? 's' : ''}</div>
          </div>
          <span style="color:var(--dc-text2);font-size:11px">▼</span>
        </div>
        <div class="dc-db-body">
          ${db.stores.map((st, si) => `
          <div class="dc-store-item" onclick="window.__dcToggleStore(${di},${si})">
            <div class="dc-store-name">${escHtml(st.name)}</div>
            <div class="dc-store-meta">${st.count} records · keyPath: ${st.keyPath || 'none'}</div>
            <div class="dc-data-viewer" id="store-${di}-${si}">
              ${st.data.length ? st.data.slice(0,20).map(item => `
                <div class="dc-data-row">
                  <div class="dc-data-key">· ${escHtml(getKey(item, st.keyPath))}</div>
                  <div class="dc-data-val">${escHtml(fmtVal(item))}</div>
                </div>`).join('') : '<div style="color:var(--dc-text2);font-size:11px;padding:8px">Empty store</div>'}
            </div>
          </div>`).join('')}
        </div>
      </div>`).join('');
  }

  function getKey(obj, keyPath) {
    if (!keyPath) return '—';
    return typeof keyPath === 'string' ? String(obj[keyPath] ?? '—') : JSON.stringify(keyPath);
  }

  function fmtVal(v) {
    if (typeof v === 'object' && v !== null) {
      const s = JSON.stringify(v, null, 2);
      return s.length > 300 ? s.slice(0, 300) + '…' : s;
    }
    const s = String(v);
    return s.length > 200 ? s.slice(0,200)+'…' : s;
  }

  function renderKV(o, storage, name) {
    const items = [];
    for (let i = 0; i < storage.length; i++) {
      const k = storage.key(i);
      items.push({ k, v: storage.getItem(k) });
    }
    if (!items.length) { o.innerHTML = `<div class="dc-empty">No ${name} items</div>`; return; }
    o.innerHTML = `<div style="padding:4px 0">` + items.map(({k,v}) => `
        <div class="dc-kv-row">
          <span class="dc-kv-key">${escHtml(k)}</span>
          <span class="dc-kv-val">${escHtml(fmtVal(v))}</span>
        </div>`).join('') + `</div>`;
  }

  window.__dcToggleDb = function(di) {
    const card = document.getElementById(`db-card-${di}`);
    if (card) card.classList.toggle('open');
  };

  window.__dcToggleStore = function(di, si) {
    const viewer = document.getElementById(`store-${di}-${si}`);
    if (viewer) viewer.classList.toggle('open');
  };

  // ══ DOM TREE ══════════════════════════════════════════════════════
  function renderDomTree() {
    const o = el.domOut(); if (!o) return;
    o.innerHTML = '';
    const tree = document.createElement('div');
    tree.className = 'dc-tree';
    tree.appendChild(buildNode(document.body));
    o.appendChild(tree);
  }

  function buildNode(nodeEl) {
    const wrap = document.createElement('div');
    const children = [...nodeEl.children];
    const hasChildren = children.length > 0;

    const label = document.createElement('div');
    label.className = 'dc-node-label';

    const arrow = document.createElement('span');
    arrow.className = 'dc-arrow';
    arrow.textContent = hasChildren ? '▶' : ' ';
    label.appendChild(arrow);

    const tag = document.createElement('span');
    tag.className = 'dc-tag';
    tag.textContent = `<${nodeEl.tagName.toLowerCase()}`;
    label.appendChild(tag);

    if (nodeEl.id) {
      const id = document.createElement('span');
      id.className = 'dc-id';
      id.textContent = ` #${nodeEl.id}`;
      label.appendChild(id);
    }

    if (nodeEl.className && typeof nodeEl.className === 'string' && nodeEl.className.trim()) {
      const cls = document.createElement('span');
      cls.className = 'dc-cls';
      const clsStr = nodeEl.className.trim().split(/\s+/).slice(0,3).map(c => `.${c}`).join('');
      cls.textContent = clsStr;
      label.appendChild(cls);
    }

    const close = document.createElement('span');
    close.className = 'dc-tag';
    close.textContent = '>';
    label.appendChild(close);

    const txtContent = nodeEl.childNodes.length ? ([...nodeEl.childNodes].find(n => n.nodeType === 3 && n.textContent.trim())) : null;
    if (txtContent) {
      const preview = document.createElement('span');
      preview.className = 'dc-txt-preview';
      preview.textContent = ' ' + txtContent.textContent.trim().slice(0,30);
      label.appendChild(preview);
    }

    label.addEventListener('click', (e) => {
      e.stopPropagation();
      if (hasChildren) {
        const childDiv = wrap.querySelector(':scope > .dc-children');
        const isOpen = childDiv && childDiv.classList.contains('open');
        if (childDiv) childDiv.classList.toggle('open', !isOpen);
        arrow.textContent = (!isOpen) ? '▼' : '▶';
      }
      showNodeDetail(nodeEl);
    });

    wrap.appendChild(label);

    if (hasChildren) {
      const childDiv = document.createElement('div');
      childDiv.className = 'dc-children';
      children.forEach(child => childDiv.appendChild(buildNode(child)));
      wrap.appendChild(childDiv);
    }

    return wrap;
  }

  function showNodeDetail(targetEl) {
    const existing = document.getElementById('dc-node-detail');
    if (existing) existing.remove();

    const d = document.createElement('div');
    d.className = 'dc-node-detail';
    d.id = 'dc-node-detail';

    const tag = `<${targetEl.tagName.toLowerCase()}>`;
    const attrs = [...targetEl.attributes];
    const styles = window.getComputedStyle(targetEl);

    d.innerHTML = `<div style="color:var(--dc-accent2);font-size:12px;font-weight:700;margin-bottom:8px">${escHtml(tag)}</div>
      ${attrs.length ? `<div class="dc-detail-title">Attributes</div>${attrs.map(a => `<div class="dc-attr-row"><span class="dc-attr-name">${escHtml(a.name)}</span>=<span class="dc-attr-val">"${escHtml(a.value)}"</span></div>`).join('')}` : ''}
      <div class="dc-detail-title" style="margin-top:8px">Geometry</div>
      <div class="dc-attr-row"><span class="dc-attr-name">size: </span><span class="dc-attr-val">${Math.round(targetEl.offsetWidth)}×${Math.round(targetEl.offsetHeight)}</span></div>
      <div class="dc-attr-row"><span class="dc-attr-name">display: </span><span class="dc-attr-val">${styles.display}</span></div>
      <div class="dc-attr-row"><span class="dc-attr-name">position: </span><span class="dc-attr-val">${styles.position}</span></div>`;
    
    el.domOut().prepend(d);
  }

  let _pickHandler = null;
  let _pickedEl = null;

  function startPicking() {
    S.isPicking = true;
    document.getElementById('dom-pick-btn').classList.add('picking');

    _pickHandler = (e) => {
      if (e.target.closest('#dc-panel') || e.target.closest('#dc-fab')) return;
      e.preventDefault(); e.stopPropagation();
      if (_pickedEl) _pickedEl.classList.remove('dc-pick-highlight');
      _pickedEl = e.target;
      _pickedEl.classList.add('dc-pick-highlight');
      showNodeDetail(_pickedEl);
      stopPicking();
    };

    document.addEventListener('click', _pickHandler, true);
    document.addEventListener('mouseover', (e) => {
      if (!S.isPicking) return;
      if (e.target.closest('#dc-panel') || e.target.closest('#dc-fab')) return;
      if (_pickedEl) _pickedEl.classList.remove('dc-pick-highlight');
      _pickedEl = e.target;
      _pickedEl.classList.add('dc-pick-highlight');
    }, true);
  }

  function stopPicking() {
    S.isPicking = false;
    const btn = document.getElementById('dom-pick-btn');
    if (btn) btn.classList.remove('picking');
    if (_pickHandler) { document.removeEventListener('click', _pickHandler, true); _pickHandler = null; }
  }

  // ══ SYSTEM INFO ═══════════════════════════════════════════════════
  function renderSystem() {
    const o = el.sysOut(); if (!o) return;
    const nav = navigator;
    const perf = window.performance;
    const mem = perf && perf.memory;
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection;

    const cards = [
      ['Screen', `${screen.width}×${screen.height} (devicePR: ${window.devicePixelRatio})`],
      ['Viewport', `${window.innerWidth}×${window.innerHeight}`],
      ['Platform', nav.platform || '—'],
      ['Language', nav.language || '—'],
      ['Online', nav.onLine ? '✅ Online' : '❌ Offline'],
      ['Cookies', nav.cookieEnabled ? 'Enabled' : 'Disabled'],
      ['HW Concurrency', nav.hardwareConcurrency || '—'],
    ];

    if (conn) {
      cards.push(['Connection', `${conn.effectiveType || '—'} · ${conn.downlink || '—'} Mbps`]);
      cards.push(['RTT', conn.rtt != null ? `${conn.rtt}ms` : '—']);
    }

    if (mem) {
      const mb = v => (v / 1048576).toFixed(1) + ' MB';
      cards.push(['Heap Used', mb(mem.usedJSHeapSize)]);
      cards.push(['Heap Limit', mb(mem.jsHeapSizeLimit)]);
    }

    if (perf) {
      const nav2 = perf.getEntriesByType && perf.getEntriesByType('navigation')[0];
      if (nav2) {
        cards.push(['Page Load', `${Math.round(nav2.loadEventEnd)}ms`]);
        cards.push(['DOM Ready', `${Math.round(nav2.domContentLoadedEventEnd)}ms`]);
      }
    }

    o.innerHTML = cards.map(([label, val]) =>
      `<div class="dc-sys-card"><div class="dc-sys-label">${label}</div><div class="dc-sys-val">${escHtml(String(val))}</div></div>`
    ).join('') +
    `<div class="dc-sys-card dc-sys-full"><div class="dc-sys-label">User Agent</div><div class="dc-sys-val" style="word-break:break-all;font-size:10px">${escHtml(nav.userAgent)}</div></div>`;
  }

  // ══ SETTINGS RENDER ═══════════════════════════════════════════════
  function renderSettings() {
    const o = el.settOut(); if (!o) return;
    o.innerHTML = `
    <div class="dc-setting-row">
      <div class="dc-setting-info">
        <div class="dc-setting-name">Timestamps</div>
        <div class="dc-setting-desc">Show time prefix on each log entry</div>
      </div>
      <label class="dc-toggle"><input type="checkbox" id="s-ts" ${S.settings.timestamps ? 'checked' : ''}><span class="dc-toggle-track"></span></label>
    </div>
    <div class="dc-setting-row">
      <div class="dc-setting-info">
        <div class="dc-setting-name">Auto-scroll</div>
        <div class="dc-setting-desc">Scroll to latest entry automatically</div>
      </div>
      <label class="dc-toggle"><input type="checkbox" id="s-as" ${S.settings.autoScroll ? 'checked' : ''}><span class="dc-toggle-track"></span></label>
    </div>
    <div class="dc-setting-row">
      <div class="dc-setting-info">
        <div class="dc-setting-name">Capture Global Errors</div>
        <div class="dc-setting-desc">window.onerror + unhandledrejection</div>
      </div>
      <label class="dc-toggle"><input type="checkbox" id="s-ce" ${S.settings.captureErrors ? 'checked' : ''}><span class="dc-toggle-track"></span></label>
    </div>
    <div class="dc-setting-row">
      <div class="dc-setting-info">
        <div class="dc-setting-name">Monitor Network</div>
        <div class="dc-setting-desc">Intercept fetch + XHR requests</div>
      </div>
      <label class="dc-toggle"><input type="checkbox" id="s-mn" ${S.settings.monitorNetwork ? 'checked' : ''}><span class="dc-toggle-track"></span></label>
    </div>
    <div class="dc-setting-row">
      <div class="dc-setting-info">
        <div class="dc-setting-name">Font Size</div>
        <div class="dc-setting-desc">Console output font size (px)</div>
      </div>
      <select class="dc-select" id="s-fs">
        ${[10,11,12,13,14].map(s => `<option value="${s}" ${S.settings.fontSize===s?'selected':''}>${s}px</option>`).join('')}
      </select>
    </div>
    <div class="dc-setting-row">
      <div class="dc-setting-info">
        <div class="dc-setting-name">Max Log Entries</div>
        <div class="dc-setting-desc">Older entries are discarded</div>
      </div>
      <select class="dc-select" id="s-me">
        ${[100,250,500,1000,2000].map(s => `<option value="${s}" ${S.settings.maxEntries===s?'selected':''}>${s}</option>`).join('')}
      </select>
    </div>
    <div class="dc-setting-row" style="border:none">
      <div class="dc-setting-info">
        <div class="dc-setting-name" style="color:var(--dc-red)">Clear All Data</div>
        <div class="dc-setting-desc">Wipe logs and network history</div>
      </div>
      <button class="dc-clear-btn" onclick="window.__dcClearAll()">Clear</button>
    </div>`;

    document.getElementById('s-ts').onchange = e => { S.settings.timestamps = e.target.checked; saveSettings(); renderConsole(); };
    document.getElementById('s-as').onchange = e => { S.settings.autoScroll = e.target.checked; saveSettings(); };
    document.getElementById('s-ce').onchange = e => { S.settings.captureErrors = e.target.checked; saveSettings(); };
    document.getElementById('s-mn').onchange = e => { S.settings.monitorNetwork = e.target.checked; saveSettings(); };
    document.getElementById('s-fs').onchange = e => { S.settings.fontSize = parseInt(e.target.value); saveSettings(); if (S.activeTab === 'console') renderConsole(); };
    document.getElementById('s-me').onchange = e => { S.settings.maxEntries = parseInt(e.target.value); saveSettings(); };
  }

  window.__dcClearAll = function() {
    S.logs = []; S.network = []; S.errorCount = 0;
    const b = el.badge(); if (b) { b.style.display = 'none'; }
    updateTabCount('console', 0);
    updateTabCount('network', 0);
    if (S.activeTab === 'console') renderConsole();
    if (S.activeTab === 'network') renderNetwork();
  };

  // ══ TABS ══════════════════════════════════════════════════════════
  function switchTab(name) {
    S.activeTab = name;
    document.querySelectorAll('.dc-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
    document.querySelectorAll('.dc-panel-content').forEach(p => p.classList.toggle('active', p.id === `panel-${name}`));

    switch(name) {
      case 'console':  renderConsole();  break;
      case 'network':  renderNetwork();  break;
      case 'storage':  loadStorage();    break;
      case 'dom':      renderDomTree();  break;
      case 'system':   renderSystem();   break;
      case 'settings': renderSettings(); break;
    }
  }

  function updateTabCount(tab, n) {
    const el2 = document.getElementById(`cnt-${tab}`);
    if (!el2) return;
    if (n > 0) { el2.textContent = n > 999 ? '999+' : n; el2.style.display = 'inline-flex'; }
    else el2.style.display = 'none';
  }

  // ══ PANEL TOGGLE ══════════════════════════════════════════════════
  let _panelOpen = false;

  function togglePanel() {
    _panelOpen = !_panelOpen;
    const panel = el.panel();
    if (_panelOpen) {
      panel.style.display = 'flex';
      requestAnimationFrame(() => { panel.classList.add('visible'); });
      switchTab(S.activeTab);
    } else {
      panel.classList.remove('visible');
      setTimeout(() => { panel.style.display = 'none'; }, 260);
    }
    
    if (_panelOpen) {
        el.fab().innerHTML = `✕<span class="dc-fab-badge" id="dc-error-badge" style="display:${S.errorCount>0?'flex':'none'}">${S.errorCount}</span>`;
    } else {
        el.fab().innerHTML = `⌥<span class="dc-fab-badge" id="dc-error-badge" style="display:${S.errorCount>0?'flex':'none'}">${S.errorCount}</span>`;
    }
  }

  // ══ DRAG RESIZE ═══════════════════════════════════════════════════
  (function initDrag() {
    const handle = document.getElementById('dc-drag');
    const panel  = document.getElementById('dc-panel');
    let dragging = false, startY = 0, startH = 0;

    function onStart(e) {
      dragging = true;
      startY = e.clientY || (e.touches && e.touches[0].clientY);
      startH = panel.offsetHeight;
      document.body.style.userSelect = 'none';
    }
    function onMove(e) {
      if (!dragging) return;
      const y = e.clientY || (e.touches && e.touches[0].clientY);
      const newH = Math.max(120, Math.min(window.innerHeight * 0.85, startH + (startY - y)));
      panel.style.height = newH + 'px';
    }
    function onEnd() {
      dragging = false;
      document.body.style.userSelect = '';
    }

    handle.addEventListener('mousedown', onStart);
    handle.addEventListener('touchstart', onStart, { passive: true });
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchend', onEnd);
  })();

  // ══ REPL ══════════════════════════════════════════════════════════
  function initRepl() {
    const input = el.replIn();
    if (!input) return;

    function execute() {
      const code = input.value.trim();
      if (!code) return;
      S.replHistory.unshift(code);
      if (S.replHistory.length > 50) S.replHistory.pop();
      S.replHistoryIdx = -1;

      const entry = document.createElement('div');
      entry.className = 'dc-entry dc-entry-cmd';
      entry.style.fontSize = S.settings.fontSize + 'px';
      entry.innerHTML = `<span class="dc-ts">${ts()}</span><span>▶ ${escHtml(code)}</span>`;
      el.consOut().appendChild(entry);

      try {
        const result = (0, eval)(code);
        if (result !== undefined) {
          const resEntry = document.createElement('div');
          resEntry.className = 'dc-entry dc-entry-log';
          resEntry.style.fontSize = S.settings.fontSize + 'px';
          resEntry.innerHTML = `<span class="dc-ts">${ts()}</span><span>${formatArg(result)}</span>`;
          el.consOut().appendChild(resEntry);
        }
      } catch(err) {
        const errEntry = document.createElement('div');
        errEntry.className = 'dc-entry dc-entry-error';
        errEntry.style.fontSize = S.settings.fontSize + 'px';
        errEntry.innerHTML = `<span class="dc-ts">${ts()}</span><span>${escHtml(err.toString())}</span>`;
        el.consOut().appendChild(errEntry);
      }

      input.value = '';
      if (S.settings.autoScroll) el.consOut().scrollTop = el.consOut().scrollHeight;
      switchTab('console');

    }

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') { execute(); return; }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        S.replHistoryIdx = Math.min(S.replHistoryIdx + 1, S.replHistory.length - 1);
        input.value = S.replHistory[S.replHistoryIdx] || '';
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        S.replHistoryIdx = Math.max(S.replHistoryIdx - 1, -1);
        input.value = S.replHistoryIdx >= 0 ? S.replHistory[S.replHistoryIdx] : '';
      }
    });

    // Run button
    const runBtn = document.getElementById('repl-run');
    if (runBtn) runBtn.addEventListener('click', execute);
  }

  // ══ EVENT WIRING ══════════════════════════════════════════════════
  document.getElementById('dc-fab').addEventListener('click', togglePanel);
  document.getElementById('dc-minimize-btn').addEventListener('click', togglePanel);

  document.querySelectorAll('.dc-tab').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  document.getElementById('dc-clear-btn').addEventListener('click', () => {
    switch(S.activeTab) {
      case 'console': S.logs = []; updateTabCount('console', 0); renderConsole(); break;
      case 'network': S.network = []; updateTabCount('network', 0); renderNetwork(); break;
      default: break;
    }
  });

  document.getElementById('dc-copy-btn').addEventListener('click', () => {
    let text = '';
    if (S.activeTab === 'console') {
      text = S.logs.map(l => `[${l.ts}] [${l.type.toUpperCase()}] ${l.args.map(a => typeof a === 'object' ? JSON.stringify(a,null,2) : String(a)).join(' ')}`).join('\n');
    } else if (S.activeTab === 'network') {
      text = S.network.map(r => `[${r.ts}] ${r.method} ${r.url} → ${r.status || 'ERR'} (${r.duration}ms)`).join('\n');
    }
    if (text) {
      navigator.clipboard ? navigator.clipboard.writeText(text).catch(() => {}) : (() => {})();
      console.log('📋 Copied to clipboard');
    }
  });

  // Network filter
  el.netFlt().addEventListener('input', e => renderNetwork(e.target.value));
  document.getElementById('net-clear').addEventListener('click', () => { S.network = []; updateTabCount('network', 0); renderNetwork(); });

  // Storage sub-tabs
  document.querySelectorAll('.dc-st-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      S.activeStorage = btn.dataset.storage;
      document.querySelectorAll('.dc-st-btn').forEach(b => b.classList.toggle('active', b === btn));
      renderStorage();
    });
  });

  document.getElementById('storage-refresh').addEventListener('click', loadStorage);

  // DOM toolbar
  document.getElementById('dom-refresh-btn').addEventListener('click', renderDomTree);
  document.getElementById('dom-pick-btn').addEventListener('click', () => {
    S.isPicking ? stopPicking() : startPicking();
  });
  document.getElementById('dom-collapse-btn').addEventListener('click', () => {
    document.querySelectorAll('.dc-children.open').forEach(c => c.classList.remove('open'));
    document.querySelectorAll('.dc-arrow').forEach(a => { if (a.textContent === '▼') a.textContent = '▶'; });
  });

  // ══ SPA / DOM CHANGE WATCHER ══════════════════════════════════════
  let _lastUrl = location.href;
  setInterval(() => {
    if (location.href !== _lastUrl) {
      _lastUrl = location.href;
      addLog('info', ['🔄 SPA navigation detected:', location.href]);
    }
  }, 1000);

  // ══ INIT ══════════════════════════════════════════════════════════
  initRepl();
  renderConsole();

  addLog('log', ['✅ DevConsole v2.0 loaded — click ⌥ to open']);

})();
