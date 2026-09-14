(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  // INSIKT v1.2
  // Mobile-first browser debugging / inspection console
  // Zero dependencies
  // ═══════════════════════════════════════════════════════════════

  const VERSION = '1.2.0';
  const BUFFER_KEY = '__insikt_buffer__';
  const SETTINGS_KEY = '__dc_settings';
  const BODY_DISPLAY_LIMIT = 10 * 1024;

  // ═══════════════════════════════════════════════════════════════
  // 1. INJECT CSS
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

    #dc-fab:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 30px rgba(124,106,247,0.7);
    }

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

    /* ── PANEL ───────────────────────────── */

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
      to   { transform: translateY(0); opacity: 1; }
    }

    /* ── DRAG HANDLE ─────────────────────── */

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

    /* ── HEADER ──────────────────────────── */

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
      0%,100% {
        opacity: 1;
        box-shadow: 0 0 0 0 rgba(61,255,160,0.4);
      }
      50% {
        opacity: 0.6;
        box-shadow: 0 0 0 5px rgba(61,255,160,0);
      }
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

    .dc-hbtn:hover {
      background: var(--dc-border);
      color: var(--dc-text0);
    }

    /* ── TABS ────────────────────────────── */

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

    /* ── PANEL CONTENT ───────────────────── */

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
    .dc-scroll::-webkit-scrollbar-thumb {
      background: var(--dc-border);
      border-radius: 2px;
    }

    /* ── LOG ENTRIES ──────────────────────── */

    .dc-entry {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 5px 8px;
      border-radius: 5px;
      margin-bottom: 3px;
      font-size: 12px;
      line-height: 1.5;
      word-break: break-word;
      animation: dcFadeIn 0.1s ease;
      position: relative;
    }

    @keyframes dcFadeIn {
      from {
        opacity: 0;
        transform: translateY(2px);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }

    .dc-entry-log {
      color: var(--dc-text0);
    }

    .dc-entry-warn {
      color: var(--dc-orange);
      background: rgba(255,179,71,0.07);
      border-left: 2px solid var(--dc-orange);
    }

    .dc-entry-error {
      color: var(--dc-red);
      background: rgba(255,92,110,0.07);
      border-left: 2px solid var(--dc-red);
    }

    .dc-entry-info {
      color: var(--dc-blue);
      background: rgba(91,206,250,0.06);
      border-left: 2px solid var(--dc-blue);
    }

    .dc-entry-cmd {
      color: var(--dc-accent);
      background: rgba(124,106,247,0.06);
    }

    .dc-entry-table {
      color: var(--dc-text0);
      background: rgba(124,106,247,0.04);
      border-left: 2px solid var(--dc-accent);
      display: block;
    }

    .dc-entry-group {
      color: var(--dc-accent);
      background: rgba(124,106,247,0.05);
      cursor: pointer;
      user-select: none;
      font-weight: 600;
    }

    .dc-entry-group:hover {
      background: rgba(124,106,247,0.10);
    }

    .dc-group-arrow {
      display: inline-block;
      width: 12px;
      color: var(--dc-text2);
      font-size: 9px;
      transition: transform 0.15s;
    }

    .dc-group-arrow.open {
      transform: rotate(90deg);
    }

    .dc-group-children {
      display: block;
    }

    .dc-group-children.collapsed {
      display: none;
    }

    .dc-grouped {
      margin-left: 18px;
      border-left: 1px solid var(--dc-border);
      border-radius: 0;
    }

    .dc-ts {
      color: var(--dc-text2);
      font-size: 10px;
      font-weight: 400;
      flex-shrink: 0;
      letter-spacing: 0;
      white-space: nowrap;
    }

    .dc-entry-body {
      min-width: 0;
      flex: 1;
    }

    /* ── OBJECT INSPECTOR ───────────────── */

    .dc-value {
      font-family: var(--dc-mono);
      font-size: inherit;
      line-height: 1.5;
    }

    .dc-primitive-string { color: var(--dc-green); }
    .dc-primitive-number { color: var(--dc-blue); }
    .dc-primitive-boolean { color: var(--dc-orange); }
    .dc-primitive-null,
    .dc-primitive-undefined {
      color: var(--dc-text2);
    }

    .dc-primitive-bigint { color: var(--dc-blue); }
    .dc-primitive-symbol { color: var(--dc-accent2); }
    .dc-primitive-function { color: var(--dc-accent2); }

    .dc-object-node {
      display: inline;
    }

    .dc-object-toggle {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      cursor: pointer;
      user-select: none;
      color: var(--dc-text1);
      border-radius: 3px;
      padding: 0 2px;
    }

    .dc-object-toggle:hover {
      background: var(--dc-bg3);
    }

    .dc-object-arrow {
      color: var(--dc-text2);
      width: 10px;
      font-size: 9px;
      display: inline-block;
    }

    .dc-object-summary {
      color: var(--dc-text1);
    }

    .dc-object-children {
      display: none;
      margin-left: 14px;
      border-left: 1px solid var(--dc-border);
      padding-left: 8px;
      margin-top: 2px;
      margin-bottom: 2px;
    }

    .dc-object-children.open {
      display: block;
    }

    .dc-object-row {
      display: block;
      padding: 1px 0;
    }

    .dc-object-key {
      color: var(--dc-accent2);
    }

    .dc-object-key-index {
      color: var(--dc-text2);
    }

    .dc-object-more {
      color: var(--dc-text2);
      font-style: italic;
    }

    /* ── TABLE ───────────────────────────── */

    .dc-table-wrap {
      overflow-x: auto;
      margin-top: 4px;
      border: 1px solid var(--dc-border);
      border-radius: 6px;
    }

    .dc-console-table {
      width: 100%;
      border-collapse: collapse;
      font-family: var(--dc-mono);
      font-size: 10px;
      min-width: 280px;
    }

    .dc-console-table th {
      background: var(--dc-bg3);
      color: var(--dc-accent);
      font-weight: 600;
      text-align: left;
      padding: 5px 7px;
      border-bottom: 1px solid var(--dc-border);
      white-space: nowrap;
    }

    .dc-console-table td {
      padding: 5px 7px;
      border-bottom: 1px solid var(--dc-border);
      color: var(--dc-text1);
      vertical-align: top;
    }

    .dc-console-table tr:last-child td {
      border-bottom: none;
    }

    /* ── REPL ────────────────────────────── */

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

    .dc-input:focus {
      border-color: var(--dc-accent);
      box-shadow: 0 0 0 2px rgba(124,106,247,0.15);
    }

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

    /* ── RELOAD SEPARATOR ────────────────── */

    .dc-reload-separator {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 10px 0;
      color: var(--dc-text2);
      font-size: 9px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .dc-reload-separator::before,
    .dc-reload-separator::after {
      content: '';
      height: 1px;
      background: var(--dc-border);
      flex: 1;
    }

    /* ── NETWORK ─────────────────────────── */

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

    .dc-clear-btn:hover {
      border-color: var(--dc-red);
      color: var(--dc-red);
    }

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
    .s-ok { color: var(--dc-green); }
    .s-redir { color: var(--dc-orange); }
    .s-err { color: var(--dc-red); }

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

    .dc-detail-title {
      color: var(--dc-accent);
      font-weight: 700;
      margin-bottom: 4px;
      font-size: 10px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .dc-detail-row {
      padding: 2px 0;
      word-break: break-all;
    }

    .dc-detail-key { color: var(--dc-text2); }

    .dc-body-block {
      background: var(--dc-bg1);
      border: 1px solid var(--dc-border);
      border-radius: 5px;
      padding: 7px;
      margin-top: 5px;
    }

    .dc-body-pre {
      white-space: pre-wrap;
      word-break: break-word;
      max-height: 160px;
      overflow: auto;
      margin: 0;
      font-family: var(--dc-mono);
      font-size: 10px;
      color: var(--dc-green);
    }

    .dc-body-truncated {
      color: var(--dc-orange);
      font-size: 9px;
      margin-top: 5px;
    }

    .dc-body-full {
      display: none;
      white-space: pre-wrap;
      word-break: break-word;
      max-height: 400px;
      overflow: auto;
      margin: 6px 0 0;
      font-family: var(--dc-mono);
      font-size: 10px;
      color: var(--dc-green);
    }

    .dc-body-full.open { display: block; }

    .dc-body-toggle {
      margin-top: 5px;
      padding: 4px 7px;
      background: var(--dc-bg3);
      border: 1px solid var(--dc-border);
      border-radius: 4px;
      color: var(--dc-text1);
      font-family: var(--dc-mono);
      font-size: 9px;
      cursor: pointer;
    }

    /* ── STORAGE ─────────────────────────── */

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

    .dc-st-btn.active {
      background: var(--dc-accent);
      border-color: var(--dc-accent);
      color: #fff;
    }

    .dc-st-btn:hover:not(.active) {
      border-color: var(--dc-text2);
      color: var(--dc-text1);
    }

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

    .dc-db-name {
      color: var(--dc-blue);
      font-size: 12px;
      font-weight: 700;
    }

    .dc-db-meta {
      color: var(--dc-text2);
      font-size: 10px;
      margin-top: 2px;
    }

    .dc-db-body {
      display: none;
      padding: 10px;
    }

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

    .dc-store-name {
      color: var(--dc-text0);
      font-size: 12px;
      font-weight: 600;
    }

    .dc-store-meta {
      color: var(--dc-text2);
      font-size: 10px;
      margin-top: 2px;
    }

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

    .dc-data-key {
      color: #ffd700;
      font-weight: 600;
    }

    .dc-data-val {
      color: var(--dc-blue);
      margin-top: 3px;
      word-break: break-all;
    }

    .dc-kv-row {
      display: flex;
      gap: 8px;
      align-items: baseline;
      padding: 6px 0;
      border-bottom: 1px solid var(--dc-border);
      font-size: 11px;
    }

    .dc-kv-key {
      color: #ffd700;
      font-weight: 600;
      min-width: 100px;
      word-break: break-all;
    }

    .dc-kv-val {
      color: var(--dc-blue);
      flex: 1;
      word-break: break-all;
    }

    .dc-empty {
      padding: 24px;
      text-align: center;
      color: var(--dc-text2);
      font-size: 12px;
    }

    /* ── DOM ─────────────────────────────── */

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

    .dc-dom-btn:hover {
      border-color: var(--dc-accent);
      color: var(--dc-accent);
    }

    .dc-dom-btn.picking {
      background: var(--dc-accent2);
      border-color: var(--dc-accent2);
      color: #fff;
    }

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

    .dc-arrow {
      color: var(--dc-text2);
      width: 12px;
      flex-shrink: 0;
      font-size: 9px;
    }

    .dc-tag {
      color: var(--dc-accent2);
      font-weight: 600;
    }

    .dc-id { color: var(--dc-blue); }
    .dc-cls { color: var(--dc-orange); }

    .dc-txt-preview {
      color: var(--dc-text2);
      font-size: 10px;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .dc-children {
      margin-left: 16px;
      display: none;
    }

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
    .dc-attr-val { color: var(--dc-green); }

    /* ── SYSTEM ──────────────────────────── */

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

    /* ── SETTINGS ───────────────────────── */

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

    .dc-setting-name {
      color: var(--dc-text0);
      font-size: 12px;
      font-weight: 600;
    }

    .dc-setting-desc {
      color: var(--dc-text2);
      font-size: 10px;
      margin-top: 2px;
    }

    .dc-toggle {
      position: relative;
      width: 40px;
      height: 22px;
      flex-shrink: 0;
    }

    .dc-toggle input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .dc-toggle-track {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--dc-border);
      border-radius: 11px;
      cursor: pointer;
      transition: background 0.2s;
    }

    .dc-toggle input:checked + .dc-toggle-track {
      background: var(--dc-accent);
    }

    .dc-toggle-track::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      background: white;
      border-radius: 50%;
      top: 3px;
      left: 3px;
      transition: transform 0.2s;
    }

    .dc-toggle input:checked + .dc-toggle-track::after {
      transform: translateX(18px);
    }

    .dc-select {
      background: var(--dc-bg0);
      border: 1px solid var(--dc-border);
      border-radius: 6px;
      color: var(--dc-text0);
      font-size: 12px;
      padding: 6px 10px;
      outline: none;
    }

    /* ── PICK ─────────────────────────────── */

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
  <button id="dc-fab" title="INSIKT">
    <span id="dc-fab-icon">⌥</span>
    <span class="dc-fab-badge" id="dc-error-badge">0</span>
  </button>

  <div id="dc-panel">
    <div id="dc-drag"></div>

    <div id="dc-header">
      <span id="dc-title">INSIKT</span>
      <span class="dc-pulse"></span>
      <button class="dc-hbtn" id="dc-clear-btn" title="Clear active tab">🗑</button>
      <button class="dc-hbtn" id="dc-copy-btn" title="Copy active tab">📋</button>
      <button class="dc-hbtn" id="dc-minimize-btn" title="Minimize">−</button>
    </div>

    <div id="dc-tabs">
      <button class="dc-tab active" data-tab="console">
        Console<span class="dc-tab-count" id="cnt-console" style="display:none"></span>
      </button>
      <button class="dc-tab" data-tab="network">
        Network<span class="dc-tab-count" id="cnt-network" style="display:none"></span>
      </button>
      <button class="dc-tab" data-tab="storage">Storage</button>
      <button class="dc-tab" data-tab="dom">DOM</button>
      <button class="dc-tab" data-tab="system">System</button>
      <button class="dc-tab" data-tab="settings">⚙</button>
    </div>

    <div class="dc-panel-content active" id="panel-console">
      <div class="dc-scroll" id="console-output"></div>

      <div class="dc-repl">
        <input
          class="dc-input"
          id="repl-input"
          placeholder="▶ execute javascript…"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
        >
        <button class="dc-run-btn" id="repl-run">RUN</button>
      </div>
    </div>

    <div class="dc-panel-content" id="panel-network">
      <div class="dc-net-filter">
        <input
          class="dc-filter-input"
          id="net-filter"
          placeholder="Filter by URL or method…"
        >
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
  // 3. STATE
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
    groupDepth: 0,
    nextLogId: 1,
    settings: {
      timestamps: true,
      autoScroll: true,
      maxEntries: 500,
      fontSize: 12,
      monitorNetwork: true,
      captureErrors: true,
      persistBuffer: false,
      theme: 'dark'
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 4. HELPERS
  // ═══════════════════════════════════════════════════════════════

  function saveSettings() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(S.settings));
    } catch(e) {}
  }

  function loadSettings() {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        S.settings = { ...S.settings, ...parsed };
      }
    } catch(e) {}
  }

  loadSettings();

  const el = {
    fab: () => document.getElementById('dc-fab'),
    panel: () => document.getElementById('dc-panel'),
    consOut: () => document.getElementById('console-output'),
    netOut: () => document.getElementById('network-output'),
    storOut: () => document.getElementById('storage-output'),
    domOut: () => document.getElementById('dom-output'),
    sysOut: () => document.getElementById('system-output'),
    settOut: () => document.getElementById('settings-output'),
    replIn: () => document.getElementById('repl-input'),
    netFlt: () => document.getElementById('net-filter'),
    badge: () => document.getElementById('dc-error-badge'),
    cntC: () => document.getElementById('cnt-console'),
    cntN: () => document.getElementById('cnt-network')
  };

  function ts() {
    const d = new Date();

    return (
      `${String(d.getHours()).padStart(2,'0')}:` +
      `${String(d.getMinutes()).padStart(2,'0')}:` +
      `${String(d.getSeconds()).padStart(2,'0')}.` +
      `${String(d.getMilliseconds()).padStart(3,'0')}`
    );
  }

  function escHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function truncUrl(url, max=55) {
    if (!url || url.length <= max) return url;

    try {
      const u = new URL(url);
      const tail = u.pathname.split('/').pop() || '';
      return `${u.hostname}/…/${tail}`;
    } catch(e) {
      return url.slice(0, max) + '…';
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

  function updateTabCount(tab, n) {
    const el2 = document.getElementById(`cnt-${tab}`);
    if (!el2) return;

    if (n > 0) {
      el2.textContent = n > 999 ? '999+' : n;
      el2.style.display = 'inline-flex';
    } else {
      el2.style.display = 'none';
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 5. SERIALIZABLE VALUE SNAPSHOT
  // ═══════════════════════════════════════════════════════════════

  /*
   * Console objects cannot safely be stored directly:
   *
   * - circular references
   * - DOM nodes
   * - functions
   * - symbols
   * - BigInt
   * - objects changing after console.log()
   *
   * Therefore INSIKT creates a compact inspection representation.
   *
   * depth 0 = root
   * depth 1 = first children
   * depth 2 = second children
   *
   * The UI can still expand deeper nodes because the representation
   * is generated recursively up to SNAPSHOT_DEPTH.
   */

  const SNAPSHOT_DEPTH = 8;
  const SNAPSHOT_KEYS = 100;

  function snapshotValue(value, depth=0, seen=new WeakSet()) {
    if (value === null) {
      return { kind: 'null' };
    }

    if (value === undefined) {
      return { kind: 'undefined' };
    }

    const type = typeof value;

    if (type === 'string') {
      return { kind: 'string', value };
    }

    if (type === 'number') {
      if (Number.isNaN(value)) return { kind: 'number', value: 'NaN' };
      if (value === Infinity) return { kind: 'number', value: 'Infinity' };
      if (value === -Infinity) return { kind: 'number', value: '-Infinity' };
      return { kind: 'number', value };
    }

    if (type === 'boolean') {
      return { kind: 'boolean', value };
    }

    if (type === 'bigint') {
      return { kind: 'bigint', value: value.toString() + 'n' };
    }

    if (type === 'symbol') {
      return { kind: 'symbol', value: String(value) };
    }

    if (type === 'function') {
      return {
        kind: 'function',
        value: value.name ? `[Function ${value.name}]` : '[Function]'
      };
    }

    if (type !== 'object') {
      return { kind: 'string', value: String(value) };
    }

    if (seen.has(value)) {
      return { kind: 'circular' };
    }

    if (depth >= SNAPSHOT_DEPTH) {
      return {
        kind: 'object',
        ctor: getConstructorName(value),
        entries: [],
        truncated: true
      };
    }

    seen.add(value);

    // Date
    if (value instanceof Date) {
      return {
        kind: 'date',
        value: isNaN(value.getTime()) ? 'Invalid Date' : value.toISOString()
      };
    }

    // RegExp
    if (value instanceof RegExp) {
      return {
        kind: 'regexp',
        value: String(value)
      };
    }

    // Error
    if (value instanceof Error) {
      const result = {
        kind: 'error',
        ctor: value.name || 'Error',
        message: String(value.message || ''),
        stack: value.stack ? String(value.stack) : '',
        entries: []
      };

      try {
        Object.keys(value).slice(0, SNAPSHOT_KEYS).forEach(key => {
          result.entries.push({
            key,
            value: snapshotValue(value[key], depth + 1, seen)
          });
        });
      } catch(e) {}

      return result;
    }

    // Array
    if (Array.isArray(value)) {
      const result = {
        kind: 'array',
        length: value.length,
        entries: [],
        truncated: false
      };

      const limit = Math.min(value.length, SNAPSHOT_KEYS);

      for (let i = 0; i < limit; i++) {
        try {
          result.entries.push({
            key: String(i),
            index: true,
            value: snapshotValue(value[i], depth + 1, seen)
          });
        } catch(e) {
          result.entries.push({
            key: String(i),
            index: true,
            value: { kind: 'string', value: '[Uninspectable]' }
          });
        }
      }

      if (value.length > limit) result.truncated = true;

      seen.delete(value);
      return result;
    }

    // Generic object
    const result = {
      kind: 'object',
      ctor: getConstructorName(value),
      entries: [],
      truncated: false
    };

    let keys = [];

    try {
      keys = Object.keys(value);
    } catch(e) {}

    const limit = Math.min(keys.length, SNAPSHOT_KEYS);

    for (let i = 0; i < limit; i++) {
      const key = keys[i];

      try {
        result.entries.push({
          key,
          value: snapshotValue(value[key], depth + 1, seen)
        });
      } catch(e) {
        result.entries.push({
          key,
          value: { kind: 'string', value: '[Uninspectable]' }
        });
      }
    }

    if (keys.length > limit) result.truncated = true;

    seen.delete(value);
    return result;
  }

  function getConstructorName(value) {
    try {
      if (value && value.constructor && value.constructor.name) {
        return value.constructor.name;
      }
    } catch(e) {}

    return 'Object';
  }

  function snapshotArgs(args) {
    return args.map(a => snapshotValue(a));
  }

  // ═══════════════════════════════════════════════════════════════
  // 6. OBJECT INSPECTOR
  // ═══════════════════════════════════════════════════════════════

  function renderValue(value, options={}) {
    const node = document.createElement('span');
    node.className = 'dc-value';

    if (!value || typeof value.kind !== 'string') {
      node.textContent = String(value);
      return node;
    }

    switch(value.kind) {
      case 'null':
        node.classList.add('dc-primitive-null');
        node.textContent = 'null';
        return node;

      case 'undefined':
        node.classList.add('dc-primitive-undefined');
        node.textContent = 'undefined';
        return node;

      case 'string':
        node.classList.add('dc-primitive-string');
        node.textContent = `"${value.value}"`;
        return node;

      case 'number':
        node.classList.add('dc-primitive-number');
        node.textContent = String(value.value);
        return node;

      case 'boolean':
        node.classList.add('dc-primitive-boolean');
        node.textContent = String(value.value);
        return node;

      case 'bigint':
        node.classList.add('dc-primitive-bigint');
        node.textContent = String(value.value);
        return node;

      case 'symbol':
        node.classList.add('dc-primitive-symbol');
        node.textContent = String(value.value);
        return node;

      case 'function':
        node.classList.add('dc-primitive-function');
        node.textContent = String(value.value);
        return node;

      case 'date':
        node.classList.add('dc-primitive-string');
        node.textContent = `Date("${value.value}")`;
        return node;

      case 'regexp':
        node.classList.add('dc-primitive-string');
        node.textContent = value.value;
        return node;

      case 'circular':
        node.classList.add('dc-primitive-null');
        node.textContent = '[Circular]';
        return node;

      case 'error':
        return renderExpandableValue(value, {
          summary: `${value.ctor || 'Error'}: ${value.message || ''}`,
          prefix: ''
        });

      case 'array':
        return renderExpandableValue(value, {
          summary: `[${value.length != null ? value.length + ' items' : '…'}]`,
          prefix: ''
        });

      case 'object':
        return renderExpandableValue(value, {
          summary: `{${value.ctor && value.ctor !== 'Object' ? value.ctor + ' ' : ''}…}`,
          prefix: ''
        });

      default:
        node.textContent = '[Unknown]';
        return node;
    }
  }

  function renderExpandableValue(value, options={}) {
    const wrap = document.createElement('span');
    wrap.className = 'dc-object-node';

    const toggle = document.createElement('span');
    toggle.className = 'dc-object-toggle';

    const arrow = document.createElement('span');
    arrow.className = 'dc-object-arrow';
    arrow.textContent = '▶';

    const summary = document.createElement('span');
    summary.className = 'dc-object-summary';
    summary.textContent = options.summary || '{…}';

    toggle.appendChild(arrow);
    toggle.appendChild(summary);

    const children = document.createElement('div');
    children.className = 'dc-object-children';

    const entries = Array.isArray(value.entries) ? value.entries : [];

    entries.forEach(entry => {
      const row = document.createElement('div');
      row.className = 'dc-object-row';

      const key = document.createElement('span');
      key.className = entry.index
        ? 'dc-object-key-index'
        : 'dc-object-key';

      key.textContent = entry.index
        ? `[${entry.key}] `
        : `${entry.key}: `;

      row.appendChild(key);
      row.appendChild(renderValue(entry.value, {
        depth: (options.depth || 0) + 1
      }));

      children.appendChild(row);
    });

    if (value.truncated) {
      const more = document.createElement('div');
      more.className = 'dc-object-more';
      more.textContent = '… more';
      children.appendChild(more);
    }

    if (value.kind === 'error' && value.stack) {
      const stack = document.createElement('div');
      stack.className = 'dc-object-more';
      stack.style.whiteSpace = 'pre-wrap';
      stack.style.marginTop = '4px';
      stack.textContent = value.stack;
      children.appendChild(stack);
    }

    toggle.addEventListener('click', e => {
      e.stopPropagation();

      const open = children.classList.toggle('open');
      arrow.textContent = open ? '▼' : '▶';
    });

    wrap.appendChild(toggle);

    if (entries.length || value.truncated || value.stack) {
      wrap.appendChild(children);
    }

    return wrap;
  }

  function renderArgsInto(container, args) {
    if (!args || !args.length) {
      container.textContent = '';
      return;
    }

    args.forEach((arg, index) => {
      if (index > 0) {
        container.appendChild(document.createTextNode(' '));
      }

      container.appendChild(renderValue(arg));
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // 7. CONSOLE INTERCEPTION
  // ═══════════════════════════════════════════════════════════════

  const _orig = {};

  ['log','warn','error','info','table','group','groupCollapsed','groupEnd'].forEach(level => {
    if (typeof console[level] === 'function') {
      _orig[level] = console[level].bind(console);
    }
  });

  ['log','warn','error','info'].forEach(level => {
    if (!_orig[level]) return;

    console[level] = (...args) => {
      _orig[level](...args);
      addLog(level, args);
    };
  });

  if (_orig.table) {
    console.table = (...args) => {
      _orig.table(...args);
      addTableLog(args);
    };
  }

  if (_orig.group) {
    console.group = (...args) => {
      _orig.group(...args);
      addGroupLog(false, args);
    };
  }

  if (_orig.groupCollapsed) {
    console.groupCollapsed = (...args) => {
      _orig.groupCollapsed(...args);
      addGroupLog(true, args);
    };
  }

  if (_orig.groupEnd) {
    console.groupEnd = (...args) => {
      _orig.groupEnd(...args);
      S.groupDepth = Math.max(0, S.groupDepth - 1);
    };
  }

  function addLog(type, args, options={}) {
    if (type === 'error') {
      S.errorCount++;

      const b = el.badge();

      if (b) {
        b.textContent = S.errorCount > 99 ? '99+' : S.errorCount;
        b.style.display = 'flex';
      }
    }

    const entry = {
      id: S.nextLogId++,
      type,
      args: snapshotArgs(args),
      ts: ts(),
      groupDepth: options.groupDepth != null
        ? options.groupDepth
        : S.groupDepth,
      restored: false
    };

    S.logs.push(entry);
    trimLogs();
    persistBuffer();

    updateTabCount('console', S.logs.length);

    if (S.activeTab === 'console') {
      renderConsole();
    }
  }

  function addTableLog(args) {
    const source = args.length > 0 ? args[0] : undefined;

    const entry = {
      id: S.nextLogId++,
      type: 'table',
      args: snapshotArgs(args),
      table: buildTableSnapshot(source),
      ts: ts(),
      groupDepth: S.groupDepth,
      restored: false
    };

    S.logs.push(entry);
    trimLogs();
    persistBuffer();

    updateTabCount('console', S.logs.length);

    if (S.activeTab === 'console') {
      renderConsole();
    }
  }

  function addGroupLog(collapsed, args) {
    const depth = S.groupDepth;

    const entry = {
      id: S.nextLogId++,
      type: 'group',
      args: snapshotArgs(args),
      ts: ts(),
      groupDepth: depth,
      collapsed: !!collapsed,
      restored: false
    };

    S.logs.push(entry);

    S.groupDepth++;

    trimLogs();
    persistBuffer();

    updateTabCount('console', S.logs.length);

    if (S.activeTab === 'console') {
      renderConsole();
    }
  }

  function buildTableSnapshot(source) {
    if (!Array.isArray(source)) {
      return {
        tabular: false,
        value: snapshotValue(source)
      };
    }

    const rows = source.slice(0, SNAPSHOT_KEYS).map((row, index) => {
      const cells = {};

      if (row && typeof row === 'object' && !Array.isArray(row)) {
        Object.keys(row).slice(0, SNAPSHOT_KEYS).forEach(key => {
          cells[key] = snapshotValue(row[key]);
        });
      } else {
        cells.value = snapshotValue(row);
      }

      return {
        index,
        cells
      };
    });

    return {
      tabular: true,
      rows,
      truncated: source.length > rows.length
    };
  }

  function trimLogs() {
    const max = Math.max(1, Number(S.settings.maxEntries) || 500);

    while (S.logs.length > max) {
      S.logs.shift();
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 8. CONSOLE RENDERING
  // ═══════════════════════════════════════════════════════════════

  function renderConsole() {
    const o = el.consOut();
    if (!o) return;

    o.innerHTML = '';

    if (!S.logs.length) {
      o.innerHTML = '<div class="dc-empty">No console entries yet</div>';
      return;
    }

    const frag = document.createDocumentFragment();

    let previousRestored = null;

    S.logs.forEach((log, index) => {
      if (log.restored && previousRestored === false) {
        frag.appendChild(createReloadSeparator());
      }

      previousRestored = !!log.restored;

      const entry = createConsoleEntry(log, index);

      if (entry) {
        frag.appendChild(entry);
      }
    });

    o.appendChild(frag);

    if (S.settings.autoScroll) {
      o.scrollTop = o.scrollHeight;
    }
  }

  function createReloadSeparator() {
    const separator = document.createElement('div');
    separator.className = 'dc-reload-separator';
    separator.textContent = 'reloaded';
    return separator;
  }

  function createConsoleEntry(log, index) {
    if (log.type === 'group') {
      return createGroupEntry(log, index);
    }

    if (log.type === 'table') {
      return createTableEntry(log, index);
    }

    const d = document.createElement('div');

    d.className = `dc-entry dc-entry-${log.type}`;

    if (log.groupDepth > 0) {
      d.classList.add('dc-grouped');
    }

    d.style.fontSize = S.settings.fontSize + 'px';

    if (S.settings.timestamps) {
      const timestamp = document.createElement('span');
      timestamp.className = 'dc-ts';
      timestamp.textContent = log.ts;
      d.appendChild(timestamp);
    }

    const body = document.createElement('span');
    body.className = 'dc-entry-body';

    renderArgsInto(body, log.args);

    d.appendChild(body);

    return d;
  }

  function createGroupEntry(log, index) {
    const d = document.createElement('div');

    d.className = 'dc-entry dc-entry-group';
    d.style.fontSize = S.settings.fontSize + 'px';

    const arrow = document.createElement('span');
    arrow.className = 'dc-group-arrow';
    arrow.textContent = '▶';

    const label = document.createElement('span');
    label.className = 'dc-entry-body';

    renderArgsInto(label, log.args);

    if (S.settings.timestamps) {
      const timestamp = document.createElement('span');
      timestamp.className = 'dc-ts';
      timestamp.textContent = log.ts;
      d.appendChild(timestamp);
    }

    d.appendChild(arrow);
    d.appendChild(label);

    const children = document.createElement('div');
    children.className = 'dc-group-children';

    const end = findGroupEnd(index, log.groupDepth);

    if (end > index + 1) {
      const childFrag = document.createDocumentFragment();

      for (let i = index + 1; i < end; i++) {
        const child = createConsoleEntry(S.logs[i], i);
        if (child) {
          childFrag.appendChild(child);
        }
      }

      children.appendChild(childFrag);

      if (log.collapsed) {
        children.classList.add('collapsed');
      } else {
        arrow.classList.add('open');
      }

      d.addEventListener('click', e => {
        e.stopPropagation();

        const collapsed = children.classList.toggle('collapsed');
        arrow.classList.toggle('open', !collapsed);
      });

      /*
       * The caller must skip child entries when the group itself
       * is rendered. This is handled in renderConsole().
       */
      d.dataset.groupEnd = String(end);
      d.appendChild(children);
    }

    return d;
  }

  function findGroupEnd(index, depth) {
    for (let i = index + 1; i < S.logs.length; i++) {
      const candidate = S.logs[i];

      if (
        candidate.type === 'group' &&
        candidate.groupDepth <= depth
      ) {
        return i;
      }

      if (
        candidate.groupDepth < depth
      ) {
        return i;
      }
    }

    return S.logs.length;
  }

  function createTableEntry(log) {
    const d = document.createElement('div');

    d.className = 'dc-entry dc-entry-table';

    if (log.groupDepth > 0) {
      d.classList.add('dc-grouped');
    }

    d.style.fontSize = S.settings.fontSize + 'px';

    if (S.settings.timestamps) {
      const timestamp = document.createElement('span');
      timestamp.className = 'dc-ts';
      timestamp.textContent = log.ts;
      d.appendChild(timestamp);
    }

    const body = document.createElement('div');
    body.className = 'dc-entry-body';

    const tableData = log.table;

    if (!tableData || !tableData.tabular) {
      renderArgsInto(body, log.args);
      d.appendChild(body);
      return d;
    }

    const wrap = document.createElement('div');
    wrap.className = 'dc-table-wrap';

    const table = document.createElement('table');
    table.className = 'dc-console-table';

    const columns = new Set();

    tableData.rows.forEach(row => {
      Object.keys(row.cells).forEach(key => columns.add(key));
    });

    const columnList = [...columns];

    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');

    const indexHead = document.createElement('th');
    indexHead.textContent = '(index)';
    headRow.appendChild(indexHead);

    columnList.forEach(column => {
      const th = document.createElement('th');
      th.textContent = column;
      headRow.appendChild(th);
    });

    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    tableData.rows.forEach(row => {
      const tr = document.createElement('tr');

      const indexCell = document.createElement('td');
      indexCell.textContent = String(row.index);
      tr.appendChild(indexCell);

      columnList.forEach(column => {
        const td = document.createElement('td');

        if (row.cells[column]) {
          td.appendChild(renderValue(row.cells[column]));
        } else {
          td.textContent = '—';
        }

        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    wrap.appendChild(table);
    body.appendChild(wrap);

    if (tableData.truncated) {
      const note = document.createElement('div');
      note.className = 'dc-object-more';
      note.textContent = '… more rows';
      body.appendChild(note);
    }

    d.appendChild(body);

    return d;
  }

  // ═══════════════════════════════════════════════════════════════
  // 9. ERROR CAPTURE
  // ═══════════════════════════════════════════════════════════════

  let _origOnError = window.onerror;

  function installErrorCapture() {
    if (!S.settings.captureErrors) return;

    _origOnError = window.onerror;

    window.onerror = function(msg, src, line, col, error) {
      addLog('error', [
        error || `${msg} @ ${src}:${line}:${col}`
      ]);

      if (typeof _origOnError === 'function') {
        try {
          return _origOnError.apply(this, arguments);
        } catch(e) {}
      }

      return false;
    };

    window.addEventListener('unhandledrejection', onUnhandledRejection);
  }

  function onUnhandledRejection(e) {
    addLog('error', [
      e.reason instanceof Error
        ? e.reason
        : `Unhandled Promise Rejection: ${String(e.reason)}`
    ]);
  }

  installErrorCapture();

  // ═══════════════════════════════════════════════════════════════
  // 10. NETWORK INTERCEPTION
  // ═══════════════════════════════════════════════════════════════

  const _origFetch = window.fetch;

  function isBinaryContentType(contentType) {
    if (!contentType) return false;

    const type = contentType.toLowerCase();

    return (
      type.includes('application/octet-stream') ||
      type.includes('image/') ||
      type.includes('audio/') ||
      type.includes('video/') ||
      type.includes('application/pdf') ||
      type.includes('application/zip') ||
      type.includes('application/gzip') ||
      type.includes('application/wasm')
    );
  }

  function shouldCaptureTextBody(contentType) {
    if (!contentType) return true;
    return !isBinaryContentType(contentType);
  }

  async function captureRequestBody(input, init) {
    try {
      if (init && init.body != null) {
        return serializeRequestBody(init.body);
      }

      if (input instanceof Request) {
        const clone = input.clone();

        if (
          clone.bodyUsed ||
          !shouldCaptureTextBody(clone.headers.get('content-type'))
        ) {
          return null;
        }

        return await clone.text();
      }
    } catch(e) {}

    return null;
  }

  function serializeRequestBody(body) {
    if (body == null) return null;

    if (typeof body === 'string') {
      return body;
    }

    if (body instanceof URLSearchParams) {
      return body.toString();
    }

    if (body instanceof FormData) {
      const result = {};

      try {
        body.forEach((value, key) => {
          if (value instanceof File) {
            result[key] = `[File ${value.name}, ${value.size} bytes]`;
          } else {
            result[key] = String(value);
          }
        });
      } catch(e) {
        return '[FormData]';
      }

      return JSON.stringify(result, null, 2);
    }

    if (body instanceof Blob) {
      return isBinaryContentType(body.type)
        ? null
        : `[Blob ${body.type || 'unknown'}, ${body.size} bytes]`;
    }

    if (body instanceof ArrayBuffer || ArrayBuffer.isView(body)) {
      return null;
    }

    try {
      return JSON.stringify(body, null, 2);
    } catch(e) {
      return String(body);
    }
  }

  async function captureResponseBody(response) {
    try {
      const contentType = response.headers.get('content-type') || '';

      if (!shouldCaptureTextBody(contentType)) {
        return null;
      }

      const clone = response.clone();

      if (clone.bodyUsed) return null;

      return await clone.text();
    } catch(e) {
      return null;
    }
  }

  if (_origFetch) {
    window.fetch = async (...args) => {
      if (!S.settings.monitorNetwork) {
        return _origFetch.apply(window, args);
      }

      const startTime = Date.now();

      let method = 'GET';
      let url = '';

      try {
        url = args[0] instanceof Request
          ? args[0].url
          : String(args[0]);

        if (args[1] && args[1].method) {
          method = String(args[1].method).toUpperCase();
        }

        if (args[0] instanceof Request) {
          method = args[0].method.toUpperCase();
        }
      } catch(e) {
        url = String(args[0]);
      }

      const req = {
        method,
        url,
        ts: ts(),
        startTime,
        status: null,
        statusText: '',
        duration: null,
        headers: {},
        requestHeaders: {},
        requestBody: null,
        responseBody: null,
        error: null
      };

      // Capture request headers
      try {
        const request = args[0] instanceof Request
          ? args[0]
          : new Request(url, args[1]);

        request.headers.forEach((v,k) => {
          req.requestHeaders[k] = v;
        });
      } catch(e) {}

      // Capture request body without consuming the actual body.
      req.requestBody = await captureRequestBody(args[0], args[1]);

      try {
        const res = await _origFetch.apply(window, args);

        req.status = res.status;
        req.statusText = res.statusText;
        req.duration = Date.now() - startTime;

        try {
          res.headers.forEach((v,k) => {
            req.headers[k] = v;
          });
        } catch(e) {}

        /*
         * Add the request immediately so the network entry appears
         * without waiting for potentially large response bodies.
         */
        addNetReq(req);

        /*
         * Response clone is independent of the application's response.
         * Capturing happens in the background.
         */
        captureResponseBody(res).then(body => {
          if (body == null) return;

          req.responseBody = body;

          if (S.activeTab === 'network') {
            renderNetwork();
          }

          persistBuffer();
        }).catch(() => {});

        return res;
      } catch(e) {
        req.error = e && e.message
          ? e.message
          : String(e);

        req.duration = Date.now() - startTime;

        addNetReq(req);

        throw e;
      }
    };
  }

  const _origOpen = XMLHttpRequest.prototype.open;
  const _origSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function(method, url) {
    if (!S.settings.monitorNetwork) {
      return _origOpen.apply(this, arguments);
    }

    this.__dcReq = {
      method: String(method).toUpperCase(),
      url: String(url),
      ts: ts(),
      startTime: 0,
      requestBody: null,
      responseBody: null,
      requestHeaders: {}
    };

    return _origOpen.apply(this, arguments);
  };

  const _origSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

  XMLHttpRequest.prototype.setRequestHeader = function(name, value) {
    if (this.__dcReq) {
      this.__dcReq.requestHeaders[name] = String(value);
    }

    return _origSetRequestHeader.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function(body) {
    if (!S.settings.monitorNetwork || !this.__dcReq) {
      return _origSend.apply(this, arguments);
    }

    const req = this.__dcReq;

    req.startTime = Date.now();
    req.requestBody = serializeRequestBody(body);

    this.addEventListener('loadend', () => {
      req.status = this.status;
      req.statusText = this.statusText;
      req.duration = Date.now() - req.startTime;
      req.headers = {};

      try {
        const raw = this.getAllResponseHeaders();

        if (raw) {
          raw
            .split('\r\n')
            .filter(Boolean)
            .forEach(line => {
              const i = line.indexOf(': ');

              if (i > 0) {
                req.headers[line.slice(0,i)] = line.slice(i+2);
              }
            });
        }
      } catch(e) {}

      req.error = this.status === 0
        ? 'Request failed'
        : null;

      /*
       * Never attempt responseText for binary response types.
       */
      try {
        const responseType = this.responseType || '';

        if (
          responseType === '' ||
          responseType === 'text'
        ) {
          const contentType = req.headers['content-type'] || '';

          if (shouldCaptureTextBody(contentType)) {
            req.responseBody = this.responseText || null;
          }
        }
      } catch(e) {}

      addNetReq(req);
    });

    return _origSend.apply(this, arguments);
  };

  function addNetReq(req) {
    S.network.unshift(req);

    if (S.network.length > S.settings.maxEntries) {
      S.network.pop();
    }

    persistBuffer();

    updateTabCount('network', S.network.length);

    if (S.activeTab === 'network') {
      renderNetwork();
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 11. NETWORK RENDERING
  // ═══════════════════════════════════════════════════════════════

  function renderNetwork(filter) {
    const o = el.netOut();
    if (!o) return;

    filter = filter !== undefined
      ? filter
      : (el.netFlt() ? el.netFlt().value : '');

    const needle = filter.trim().toLowerCase();

    const filtered = needle
      ? S.network.filter(r =>
          String(r.url).toLowerCase().includes(needle) ||
          String(r.method).toLowerCase().includes(needle)
        )
      : S.network;

    o.innerHTML = '';

    if (!filtered.length) {
      o.innerHTML = '<div class="dc-empty">No requests captured yet</div>';
      return;
    }

    filtered.forEach(req => {
      o.appendChild(createNetworkEntry(req));
    });
  }

  function createNetworkEntry(req) {
    const card = document.createElement('div');
    card.className = 'dc-req';

    const top = document.createElement('div');
    top.className = 'dc-req-top';

    const method = document.createElement('span');
    method.className = `dc-method ${methodClass(req.method)}`;
    method.textContent = req.method;

    const url = document.createElement('span');
    url.className = 'dc-req-url';
    url.title = req.url;
    url.textContent = truncUrl(req.url);

    const status = document.createElement('span');
    status.className = `dc-req-status ${
      req.error ? 's-err' : statusClass(req.status)
    }`;

    status.textContent = req.status
      ? String(req.status)
      : req.error
        ? 'ERR'
        : '…';

    top.appendChild(method);
    top.appendChild(url);
    top.appendChild(status);

    const meta = document.createElement('div');
    meta.className = 'dc-req-meta';

    const dur = req.duration != null
      ? `${req.duration}ms · `
      : '';

    meta.textContent =
      `${dur}${req.ts}` +
      (req.error ? ` · ${req.error}` : '');

    const detail = document.createElement('div');
    detail.className = 'dc-req-detail';

    buildNetworkDetail(detail, req);

    card.appendChild(top);
    card.appendChild(meta);
    card.appendChild(detail);

    card.addEventListener('click', e => {
      /*
       * Do not collapse when interacting with body "show full".
       */
      if (e.target.closest('.dc-body-toggle')) return;

      const open = detail.classList.toggle('open');
      card.classList.toggle('expanded', open);
    });

    return card;
  }

  function buildNetworkDetail(detail, req) {
    addDetailSection(detail, 'General', [
      ['URL', req.url],
      ['Method', req.method],
      ['Status', `${req.status || req.error || '–'} ${req.statusText || ''}`],
      ['Duration', req.duration != null ? `${req.duration}ms` : '–']
    ]);

    addHeaderSection(
      detail,
      'Request Headers',
      req.requestHeaders
    );

    addBodySection(
      detail,
      'Request Body',
      req.requestBody
    );

    addHeaderSection(
      detail,
      'Response Headers',
      req.headers
    );

    addBodySection(
      detail,
      'Response Body',
      req.responseBody
    );
  }

  function addDetailSection(parent, title, rows) {
    const section = document.createElement('div');
    section.className = 'dc-detail-section';

    const heading = document.createElement('div');
    heading.className = 'dc-detail-title';
    heading.textContent = title;

    section.appendChild(heading);

    rows.forEach(([key, value]) => {
      const row = document.createElement('div');
      row.className = 'dc-detail-row';

      const keyEl = document.createElement('span');
      keyEl.className = 'dc-detail-key';
      keyEl.textContent = `${key}: `;

      row.appendChild(keyEl);
      row.appendChild(document.createTextNode(String(value ?? '–')));

      section.appendChild(row);
    });

    parent.appendChild(section);
  }

  function addHeaderSection(parent, title, headers) {
    const section = document.createElement('div');
    section.className = 'dc-detail-section';

    const heading = document.createElement('div');
    heading.className = 'dc-detail-title';
    heading.textContent = title;

    section.appendChild(heading);

    const entries = headers
      ? Object.entries(headers)
      : [];

    if (!entries.length) {
      const empty = document.createElement('div');
      empty.className = 'dc-detail-row';
      empty.style.color = 'var(--dc-text2)';
      empty.textContent = 'none';
      section.appendChild(empty);
    } else {
      entries.forEach(([key, value]) => {
        const row = document.createElement('div');
        row.className = 'dc-detail-row';

        const keyEl = document.createElement('span');
        keyEl.className = 'dc-detail-key';
        keyEl.textContent = `${key}: `;

        row.appendChild(keyEl);
        row.appendChild(document.createTextNode(String(value)));

        section.appendChild(row);
      });
    }

    parent.appendChild(section);
  }

  function addBodySection(parent, title, body) {
    if (body == null || body === '') return;

    const section = document.createElement('div');
    section.className = 'dc-detail-section';

    const heading = document.createElement('div');
    heading.className = 'dc-detail-title';
    heading.textContent = title;

    section.appendChild(heading);

    const block = document.createElement('div');
    block.className = 'dc-body-block';

    const text = String(body);

    if (text.length <= BODY_DISPLAY_LIMIT) {
      const pre = document.createElement('pre');
      pre.className = 'dc-body-pre';
      pre.textContent = formatBodyForDisplay(text);
      block.appendChild(pre);
    } else {
      const preview = document.createElement('pre');
      preview.className = 'dc-body-pre';
      preview.textContent =
        formatBodyForDisplay(text.slice(0, BODY_DISPLAY_LIMIT)) +
        '\n…';

      const full = document.createElement('pre');
      full.className = 'dc-body-full';
      full.textContent = formatBodyForDisplay(text);

      const note = document.createElement('div');
      note.className = 'dc-body-truncated';
      note.textContent =
        `Showing first 10 KB of ${formatBytes(text.length)}.`;

      const toggle = document.createElement('button');
      toggle.className = 'dc-body-toggle';
      toggle.textContent = 'Show full';

      toggle.addEventListener('click', e => {
        e.stopPropagation();

        const open = full.classList.toggle('open');

        toggle.textContent = open
          ? 'Hide full'
          : 'Show full';
      });

      block.appendChild(preview);
      block.appendChild(note);
      block.appendChild(toggle);
      block.appendChild(full);
    }

    section.appendChild(block);
    parent.appendChild(section);
  }

  function formatBodyForDisplay(text) {
    const trimmed = text.trim();

    if (
      (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'))
    ) {
      try {
        return JSON.stringify(JSON.parse(trimmed), null, 2);
      } catch(e) {}
    }

    return text;
  }

  function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  // ═══════════════════════════════════════════════════════════════
  // 12. PERSISTENT BUFFER
  // ═══════════════════════════════════════════════════════════════

  function persistBuffer() {
    if (!S.settings.persistBuffer) return;

    try {
      const payload = {
        version: VERSION,
        savedAt: Date.now(),
        logs: S.logs.slice(-S.settings.maxEntries),
        network: S.network.slice(0, S.settings.maxEntries)
      };

      sessionStorage.setItem(
        BUFFER_KEY,
        JSON.stringify(payload)
      );
    } catch(e) {
      /*
       * Storage may fail due to quota/private browsing/etc.
       * Debugging must never break the application.
       */
    }
  }

  function restoreBuffer() {
    if (!S.settings.persistBuffer) return;

    try {
      const raw = sessionStorage.getItem(BUFFER_KEY);
      if (!raw) return;

      const payload = JSON.parse(raw);

      if (!payload || typeof payload !== 'object') return;

      if (Array.isArray(payload.logs)) {
        S.logs = payload.logs.map(log => ({
          ...log,
          restored: true
        }));
      }

      if (Array.isArray(payload.network)) {
        S.network = payload.network;
      }

      S.logs.forEach(log => {
        if (log.id >= S.nextLogId) {
          S.nextLogId = log.id + 1;
        }
      });

      /*
       * Restored entries should be followed by a new reload
       * separator. The separator is generated visually when a
       * fresh entry follows restored entries.
       */
      updateTabCount('console', S.logs.length);
      updateTabCount('network', S.network.length);
    } catch(e) {
      try {
        sessionStorage.removeItem(BUFFER_KEY);
      } catch(err) {}
    }
  }

  function clearPersistentBuffer() {
    try {
      sessionStorage.removeItem(BUFFER_KEY);
    } catch(e) {}
  }

  restoreBuffer();

  // ═══════════════════════════════════════════════════════════════
  // 13. STORAGE
  // ═══════════════════════════════════════════════════════════════

  async function loadStorage() {
    S.dbs = [];

    if (!window.indexedDB) return;

    try {
      if (indexedDB.databases) {
        const list = await indexedDB.databases();

        for (const d of list) {
          try {
            await inspectDb(d.name, d.version);
          } catch(e) {}
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

        const info = {
          name: db.name,
          version: db.version,
          stores: []
        };

        const storeNames = [...db.objectStoreNames];
        let pending = storeNames.length;

        if (!pending) {
          db.close();
          S.dbs.push(info);
          return res(info);
        }

        storeNames.forEach(storeName => {
          inspectStore(db, storeName)
            .then(storeInfo => {
              info.stores.push(storeInfo);

              if (--pending === 0) {
                db.close();
                S.dbs.push(info);
                res(info);
              }
            })
            .catch(() => {
              info.stores.push({
                name: storeName,
                count: 0,
                keyPath: null,
                data: []
              });

              if (--pending === 0) {
                db.close();
                S.dbs.push(info);
                res(info);
              }
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
        const info = {
          name: storeName,
          count: cntReq.result,
          keyPath: store.keyPath,
          data: []
        };

        const getReq = store.getAll(undefined, 20);

        getReq.onsuccess = () => {
          info.data = getReq.result;
          res(info);
        };

        getReq.onerror = () => res(info);
      };

      cntReq.onerror = () => res({
        name: storeName,
        count: 0,
        keyPath: null,
        data: []
      });
    });
  }

  function renderStorage() {
    const o = el.storOut();
    if (!o) return;

    switch(S.activeStorage) {
      case 'indexeddb':
        renderIDB(o);
        break;

      case 'localstorage':
        renderKV(o, localStorage, 'localStorage');
        break;

      case 'sessionstorage':
        renderKV(o, sessionStorage, 'sessionStorage');
        break;
    }
  }

  function renderIDB(o) {
    if (!S.dbs.length) {
      o.innerHTML =
        '<div class="dc-empty">No IndexedDB databases found</div>';
      return;
    }

    o.innerHTML = S.dbs.map((db, di) => `
      <div class="dc-db-card" id="db-card-${di}">
        <div class="dc-db-header" onclick="window.__dcToggleDb(${di})">
          <div>
            <div class="dc-db-name">${escHtml(db.name)}</div>
            <div class="dc-db-meta">
              v${db.version} ·
              ${db.stores.length}
              store${db.stores.length !== 1 ? 's' : ''}
            </div>
          </div>
          <span style="color:var(--dc-text2);font-size:11px">▼</span>
        </div>

        <div class="dc-db-body">
          ${db.stores.map((st, si) => `
            <div class="dc-store-item" onclick="window.__dcToggleStore(${di},${si})">
              <div class="dc-store-name">${escHtml(st.name)}</div>
              <div class="dc-store-meta">
                ${st.count} records ·
                keyPath: ${st.keyPath || 'none'}
              </div>

              <div class="dc-data-viewer" id="store-${di}-${si}">
                ${
                  st.data.length
                    ? st.data.slice(0,20).map(item => `
                      <div class="dc-data-row">
                        <div class="dc-data-key">
                          · ${escHtml(getKey(item, st.keyPath))}
                        </div>
                        <div class="dc-data-val">
                          ${escHtml(fmtVal(item))}
                        </div>
                      </div>
                    `).join('')
                    : '<div style="color:var(--dc-text2);font-size:11px;padding:8px">Empty store</div>'
                }
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  function getKey(obj, keyPath) {
    if (!keyPath) return '—';

    return typeof keyPath === 'string'
      ? String(obj[keyPath] ?? '—')
      : JSON.stringify(keyPath);
  }

  function fmtVal(v) {
    if (typeof v === 'object' && v !== null) {
      try {
        const s = JSON.stringify(v, null, 2);
        return s.length > 300
          ? s.slice(0,300) + '…'
          : s;
      } catch(e) {
        return '[Unserializable]';
      }
    }

    const s = String(v);

    return s.length > 200
      ? s.slice(0,200) + '…'
      : s;
  }

  window.__dcToggleDb = function(di) {
    const card = document.getElementById(`db-card-${di}`);

    if (card) {
      card.classList.toggle('open');
    }
  };

  window.__dcToggleStore = function(di, si) {
    const viewer =
      document.getElementById(`store-${di}-${si}`);

    if (viewer) {
      viewer.classList.toggle('open');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 14. DOM TREE
  // ═══════════════════════════════════════════════════════════════

  function renderDomTree() {
    const o = el.domOut();
    if (!o) return;

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

    if (
      nodeEl.className &&
      typeof nodeEl.className === 'string' &&
      nodeEl.className.trim()
    ) {
      const cls = document.createElement('span');
      cls.className = 'dc-cls';

      const clsStr = nodeEl.className
        .trim()
        .split(/\s+/)
        .slice(0,3)
        .map(c => `.${c}`)
        .join('');

      cls.textContent = clsStr;
      label.appendChild(cls);
    }

    const close = document.createElement('span');
    close.className = 'dc-tag';
    close.textContent = '>';
    label.appendChild(close);

    const txtContent = nodeEl.childNodes.length
      ? [...nodeEl.childNodes]
          .find(n =>
            n.nodeType === 3 &&
            n.textContent.trim()
          )
      : null;

    if (txtContent) {
      const preview = document.createElement('span');
      preview.className = 'dc-txt-preview';
      preview.textContent =
        ' ' +
        txtContent.textContent
          .trim()
          .slice(0,30);

      label.appendChild(preview);
    }

    label.addEventListener('click', e => {
      e.stopPropagation();

      if (hasChildren) {
        const childDiv =
          wrap.querySelector(':scope > .dc-children');

        const isOpen =
          childDiv &&
          childDiv.classList.contains('open');

        if (childDiv) {
          childDiv.classList.toggle('open', !isOpen);
        }

        arrow.textContent = !isOpen ? '▼' : '▶';
      }

      showNodeDetail(nodeEl);
    });

    wrap.appendChild(label);

    if (hasChildren) {
      const childDiv = document.createElement('div');
      childDiv.className = 'dc-children';

      children.forEach(child => {
        childDiv.appendChild(buildNode(child));
      });

      wrap.appendChild(childDiv);
    }

    return wrap;
  }

  function showNodeDetail(targetEl) {
    const existing =
      document.getElementById('dc-node-detail');

    if (existing) existing.remove();

    const d = document.createElement('div');

    d.className = 'dc-node-detail';
    d.id = 'dc-node-detail';

    const tag =
      `<${targetEl.tagName.toLowerCase()}>`;

    const attrs = [...targetEl.attributes];
    const styles = window.getComputedStyle(targetEl);

    d.innerHTML = `
      <div style="color:var(--dc-accent2);font-size:12px;font-weight:700;margin-bottom:8px">
        ${escHtml(tag)}
      </div>

      ${
        attrs.length
          ? `
            <div class="dc-detail-title">Attributes</div>
            ${
              attrs.map(a => `
                <div class="dc-attr-row">
                  <span class="dc-attr-name">${escHtml(a.name)}</span>=
                  <span class="dc-attr-val">"${escHtml(a.value)}"</span>
                </div>
              `).join('')
            }
          `
          : ''
      }

      <div class="dc-detail-title" style="margin-top:8px">
        Geometry
      </div>

      <div class="dc-attr-row">
        <span class="dc-attr-name">size: </span>
        <span class="dc-attr-val">
          ${Math.round(targetEl.offsetWidth)}×${Math.round(targetEl.offsetHeight)}
        </span>
      </div>

      <div class="dc-attr-row">
        <span class="dc-attr-name">display: </span>
        <span class="dc-attr-val">${styles.display}</span>
      </div>

      <div class="dc-attr-row">
        <span class="dc-attr-name">position: </span>
        <span class="dc-attr-val">${styles.position}</span>
      </div>
    `;

    el.domOut().prepend(d);
  }

  let _pickHandler = null;
  let _pickHoverHandler = null;
  let _pickedEl = null;

  function startPicking() {
    S.isPicking = true;

    const button =
      document.getElementById('dom-pick-btn');

    if (button) button.classList.add('picking');

    _pickHandler = e => {
      if (
        e.target.closest('#dc-panel') ||
        e.target.closest('#dc-fab')
      ) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      if (_pickedEl) {
        _pickedEl.classList.remove('dc-pick-highlight');
      }

      _pickedEl = e.target;
      _pickedEl.classList.add('dc-pick-highlight');

      showNodeDetail(_pickedEl);
      stopPicking();
    };

    _pickHoverHandler = e => {
      if (!S.isPicking) return;

      if (
        e.target.closest('#dc-panel') ||
        e.target.closest('#dc-fab')
      ) {
        return;
      }

      if (_pickedEl) {
        _pickedEl.classList.remove('dc-pick-highlight');
      }

      _pickedEl = e.target;
      _pickedEl.classList.add('dc-pick-highlight');
    };

    document.addEventListener(
      'click',
      _pickHandler,
      true
    );

    document.addEventListener(
      'mouseover',
      _pickHoverHandler,
      true
    );
  }

  function stopPicking() {
    S.isPicking = false;

    const button =
      document.getElementById('dom-pick-btn');

    if (button) {
      button.classList.remove('picking');
    }

    if (_pickHandler) {
      document.removeEventListener(
        'click',
        _pickHandler,
        true
      );

      _pickHandler = null;
    }

    if (_pickHoverHandler) {
      document.removeEventListener(
        'mouseover',
        _pickHoverHandler,
        true
      );

      _pickHoverHandler = null;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 15. SYSTEM INFO
  // ═══════════════════════════════════════════════════════════════

  function renderSystem() {
    const o = el.sysOut();
    if (!o) return;

    const nav = navigator;
    const perf = window.performance;
    const mem = perf && perf.memory;
    const conn =
      nav.connection ||
      nav.mozConnection ||
      nav.webkitConnection;

    const cards = [
      ['Screen', `${screen.width}×${screen.height} (devicePR: ${window.devicePixelRatio})`],
      ['Viewport', `${window.innerWidth}×${window.innerHeight}`],
      ['Platform', nav.platform || '—'],
      ['Language', nav.language || '—'],
      ['Online', nav.onLine ? '✅ Online' : '❌ Offline'],
      ['Cookies', nav.cookieEnabled ? 'Enabled' : 'Disabled'],
      ['HW Concurrency', nav.hardwareConcurrency || '—']
    ];

    if (conn) {
      cards.push([
        'Connection',
        `${conn.effectiveType || '—'} · ${conn.downlink || '—'} Mbps`
      ]);

      cards.push([
        'RTT',
        conn.rtt != null ? `${conn.rtt}ms` : '—'
      ]);
    }

    if (mem) {
      const mb = v =>
        (v / 1048576).toFixed(1) + ' MB';

      cards.push([
        'Heap Used',
        mb(mem.usedJSHeapSize)
      ]);

      cards.push([
        'Heap Limit',
        mb(mem.jsHeapSizeLimit)
      ]);
    }

    if (perf) {
      const nav2 =
        perf.getEntriesByType &&
        perf.getEntriesByType('navigation')[0];

      if (nav2) {
        cards.push([
          'Page Load',
          `${Math.round(nav2.loadEventEnd)}ms`
        ]);

        cards.push([
          'DOM Ready',
          `${Math.round(nav2.domContentLoadedEventEnd)}ms`
        ]);
      }
    }

    o.innerHTML =
      cards.map(([label, val]) => `
        <div class="dc-sys-card">
          <div class="dc-sys-label">${escHtml(label)}</div>
          <div class="dc-sys-val">${escHtml(String(val))}</div>
        </div>
      `).join('') +

      `
        <div class="dc-sys-card dc-sys-full">
          <div class="dc-sys-label">User Agent</div>
          <div
            class="dc-sys-val"
            style="word-break:break-all;font-size:10px"
          >
            ${escHtml(nav.userAgent)}
          </div>
        </div>
      `;
  }

  // ═══════════════════════════════════════════════════════════════
  // 16. SETTINGS
  // ═══════════════════════════════════════════════════════════════

  function renderSettings() {
    const o = el.settOut();
    if (!o) return;

    o.innerHTML = `
      <div class="dc-setting-row">
        <div class="dc-setting-info">
          <div class="dc-setting-name">Timestamps</div>
          <div class="dc-setting-desc">
            Show time prefix on each log entry
          </div>
        </div>

        <label class="dc-toggle">
          <input
            type="checkbox"
            id="s-ts"
            ${S.settings.timestamps ? 'checked' : ''}
          >
          <span class="dc-toggle-track"></span>
        </label>
      </div>

      <div class="dc-setting-row">
        <div class="dc-setting-info">
          <div class="dc-setting-name">Auto-scroll</div>
          <div class="dc-setting-desc">
            Scroll to latest entry automatically
          </div>
        </div>

        <label class="dc-toggle">
          <input
            type="checkbox"
            id="s-as"
            ${S.settings.autoScroll ? 'checked' : ''}
          >
          <span class="dc-toggle-track"></span>
        </label>
      </div>

      <div class="dc-setting-row">
        <div class="dc-setting-info">
          <div class="dc-setting-name">Capture Global Errors</div>
          <div class="dc-setting-desc">
            window.onerror + unhandledrejection
          </div>
        </div>

        <label class="dc-toggle">
          <input
            type="checkbox"
            id="s-ce"
            ${S.settings.captureErrors ? 'checked' : ''}
          >
          <span class="dc-toggle-track"></span>
        </label>
      </div>

      <div class="dc-setting-row">
        <div class="dc-setting-info">
          <div class="dc-setting-name">Monitor Network</div>
          <div class="dc-setting-desc">
            Intercept fetch + XHR requests
          </div>
        </div>

        <label class="dc-toggle">
          <input
            type="checkbox"
            id="s-mn"
            ${S.settings.monitorNetwork ? 'checked' : ''}
          >
          <span class="dc-toggle-track"></span>
        </label>
      </div>

      <div class="dc-setting-row">
        <div class="dc-setting-info">
          <div class="dc-setting-name">Persist Across Reload</div>
          <div class="dc-setting-desc">
            Keep console and network history in sessionStorage
          </div>
        </div>

        <label class="dc-toggle">
          <input
            type="checkbox"
            id="s-pb"
            ${S.settings.persistBuffer ? 'checked' : ''}
          >
          <span class="dc-toggle-track"></span>
        </label>
      </div>

      <div class="dc-setting-row">
        <div class="dc-setting-info">
          <div class="dc-setting-name">Font Size</div>
          <div class="dc-setting-desc">
            Console output font size (px)
          </div>
        </div>

        <select class="dc-select" id="s-fs">
          ${
            [10,11,12,13,14]
              .map(s => `
                <option
                  value="${s}"
                  ${S.settings.fontSize === s ? 'selected' : ''}
                >
                  ${s}px
                </option>
              `)
              .join('')
          }
        </select>
      </div>

      <div class="dc-setting-row">
        <div class="dc-setting-info">
          <div class="dc-setting-name">Max Log Entries</div>
          <div class="dc-setting-desc">
            Older entries are discarded
          </div>
        </div>

        <select class="dc-select" id="s-me">
          ${
            [100,250,500,1000,2000]
              .map(s => `
                <option
                  value="${s}"
                  ${S.settings.maxEntries === s ? 'selected' : ''}
                >
                  ${s}
                </option>
              `)
              .join('')
          }
        </select>
      </div>

      <div class="dc-setting-row" style="border:none">
        <div class="dc-setting-info">
          <div
            class="dc-setting-name"
            style="color:var(--dc-red)"
          >
            Clear All Data
          </div>

          <div class="dc-setting-desc">
            Wipe logs, network history and persistent buffer
          </div>
        </div>

        <button class="dc-clear-btn" id="dc-settings-clear">
          Clear
        </button>
      </div>
    `;

    document.getElementById('s-ts').onchange =
      e => {
        S.settings.timestamps = e.target.checked;
        saveSettings();
        renderConsole();
      };

    document.getElementById('s-as').onchange =
      e => {
        S.settings.autoScroll = e.target.checked;
        saveSettings();
      };

    document.getElementById('s-ce').onchange =
      e => {
        S.settings.captureErrors = e.target.checked;
        saveSettings();
      };

    document.getElementById('s-mn').onchange =
      e => {
        S.settings.monitorNetwork = e.target.checked;
        saveSettings();
      };

    document.getElementById('s-pb').onchange =
      e => {
        S.settings.persistBuffer = e.target.checked;
        saveSettings();

        if (!S.settings.persistBuffer) {
          clearPersistentBuffer();
        } else {
          persistBuffer();
        }
      };

    document.getElementById('s-fs').onchange =
      e => {
        S.settings.fontSize =
          parseInt(e.target.value, 10);

        saveSettings();

        if (S.activeTab === 'console') {
          renderConsole();
        }
      };

    document.getElementById('s-me').onchange =
      e => {
        S.settings.maxEntries =
          parseInt(e.target.value, 10);

        trimLogs();

        if (S.network.length > S.settings.maxEntries) {
          S.network =
            S.network.slice(0, S.settings.maxEntries);
        }

        saveSettings();
        persistBuffer();

        updateTabCount('console', S.logs.length);
        updateTabCount('network', S.network.length);

        renderConsole();
      };

    document.getElementById('dc-settings-clear')
      .addEventListener(
        'click',
        window.__dcClearAll
      );
  }

  window.__dcClearAll = function() {
    S.logs = [];
    S.network = [];
    S.errorCount = 0;
    S.groupDepth = 0;

    clearPersistentBuffer();

    const b = el.badge();

    if (b) {
      b.style.display = 'none';
      b.textContent = '0';
    }

    updateTabCount('console', 0);
    updateTabCount('network', 0);

    renderConsole();
    renderNetwork();
  };

  // ═══════════════════════════════════════════════════════════════
  // 17. TABS
  // ═══════════════════════════════════════════════════════════════

  function switchTab(name) {
    S.activeTab = name;

    document.querySelectorAll('.dc-tab')
      .forEach(b =>
        b.classList.toggle(
          'active',
          b.dataset.tab === name
        )
      );

    document.querySelectorAll('.dc-panel-content')
      .forEach(p =>
        p.classList.toggle(
          'active',
          p.id === `panel-${name}`
        )
      );

    switch(name) {
      case 'console':
        renderConsole();
        break;

      case 'network':
        renderNetwork();
        break;

      case 'storage':
        loadStorage();
        break;

      case 'dom':
        renderDomTree();
        break;

      case 'system':
        renderSystem();
        break;

      case 'settings':
        renderSettings();
        break;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 18. PANEL TOGGLE
  // ═══════════════════════════════════════════════════════════════

  let _panelOpen = false;

  function updateFab() {
    const fab = el.fab();
    if (!fab) return;

    fab.innerHTML =
      `${_panelOpen ? '✕' : '⌥'}` +
      `<span class="dc-fab-badge" id="dc-error-badge" ` +
      `style="display:${S.errorCount > 0 ? 'flex' : 'none'}">` +
      `${S.errorCount}` +
      `</span>`;
  }

  function togglePanel() {
    _panelOpen = !_panelOpen;

    const panel = el.panel();

    if (_panelOpen) {
      panel.style.display = 'flex';

      requestAnimationFrame(() => {
        panel.classList.add('visible');
      });

      switchTab(S.activeTab);
    } else {
      panel.classList.remove('visible');

      setTimeout(() => {
        if (!_panelOpen) {
          panel.style.display = 'none';
        }
      }, 260);
    }

    updateFab();
  }

  // ═══════════════════════════════════════════════════════════════
  // 19. DRAG RESIZE
  // ═══════════════════════════════════════════════════════════════

  (function initDrag() {
    const handle =
      document.getElementById('dc-drag');

    const panel =
      document.getElementById('dc-panel');

    let dragging = false;
    let startY = 0;
    let startH = 0;

    function onStart(e) {
      dragging = true;

      startY =
        e.clientY ||
        (e.touches && e.touches[0].clientY);

      startH = panel.offsetHeight;

      document.body.style.userSelect = 'none';
    }

    function onMove(e) {
      if (!dragging) return;

      const y =
        e.clientY ||
        (e.touches && e.touches[0].clientY);

      const newH = Math.max(
        120,
        Math.min(
          window.innerHeight * 0.85,
          startH + (startY - y)
        )
      );

      panel.style.height = newH + 'px';
    }

    function onEnd() {
      dragging = false;
      document.body.style.userSelect = '';
    }

    handle.addEventListener(
      'mousedown',
      onStart
    );

    handle.addEventListener(
      'touchstart',
      onStart,
      { passive: true }
    );

    document.addEventListener(
      'mousemove',
      onMove
    );

    document.addEventListener(
      'touchmove',
      onMove,
      { passive: true }
    );

    document.addEventListener(
      'mouseup',
      onEnd
    );

    document.addEventListener(
      'touchend',
      onEnd
    );
  })();

  // ═══════════════════════════════════════════════════════════════
  // 20. REPL
  // ═══════════════════════════════════════════════════════════════

  function initRepl() {
    const input = el.replIn();

    if (!input) return;

    function execute() {
      const code = input.value.trim();

      if (!code) return;

      S.replHistory.unshift(code);

      if (S.replHistory.length > 50) {
        S.replHistory.pop();
      }

      S.replHistoryIdx = -1;

      const entry = document.createElement('div');

      entry.className =
        'dc-entry dc-entry-cmd';

      entry.style.fontSize =
        S.settings.fontSize + 'px';

      if (S.settings.timestamps) {
        const timestamp = document.createElement('span');
        timestamp.className = 'dc-ts';
        timestamp.textContent = ts();
        entry.appendChild(timestamp);
      }

      const body = document.createElement('span');
      body.className = 'dc-entry-body';

      body.textContent = `▶ ${code}`;

      entry.appendChild(body);

      el.consOut().appendChild(entry);

      try {
        const result = (0, eval)(code);

        if (result !== undefined) {
          const resEntry =
            document.createElement('div');

          resEntry.className =
            'dc-entry dc-entry-log';

          resEntry.style.fontSize =
            S.settings.fontSize + 'px';

          if (S.settings.timestamps) {
            const timestamp =
              document.createElement('span');

            timestamp.className = 'dc-ts';
            timestamp.textContent = ts();

            resEntry.appendChild(timestamp);
          }

          const resultBody =
            document.createElement('span');

          resultBody.className =
            'dc-entry-body';

          resultBody.appendChild(
            renderValue(snapshotValue(result))
          );

          resEntry.appendChild(resultBody);

          el.consOut().appendChild(resEntry);
        }
      } catch(err) {
        const errEntry =
          document.createElement('div');

        errEntry.className =
          'dc-entry dc-entry-error';

        errEntry.style.fontSize =
          S.settings.fontSize + 'px';

        if (S.settings.timestamps) {
          const timestamp =
            document.createElement('span');

          timestamp.className = 'dc-ts';
          timestamp.textContent = ts();

          errEntry.appendChild(timestamp);
        }

        const body =
          document.createElement('span');

        body.className =
          'dc-entry-body';

        body.appendChild(
          renderValue(snapshotValue(err))
        );

        errEntry.appendChild(body);

        el.consOut().appendChild(errEntry);
      }

      input.value = '';

      if (S.settings.autoScroll) {
        el.consOut().scrollTop =
          el.consOut().scrollHeight;
      }

      switchTab('console');
    }

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        execute();
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();

        S.replHistoryIdx =
          Math.min(
            S.replHistoryIdx + 1,
            S.replHistory.length - 1
          );

        input.value =
          S.replHistory[S.replHistoryIdx] || '';
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();

        S.replHistoryIdx =
          Math.max(
            S.replHistoryIdx - 1,
            -1
          );

        input.value =
          S.replHistoryIdx >= 0
            ? S.replHistory[S.replHistoryIdx]
            : '';
      }
    });

    const runBtn =
      document.getElementById('repl-run');

    if (runBtn) {
      runBtn.addEventListener(
        'click',
        execute
      );
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 21. EVENT WIRING
  // ═══════════════════════════════════════════════════════════════

  document
    .getElementById('dc-fab')
    .addEventListener(
      'click',
      togglePanel
    );

  document
    .getElementById('dc-minimize-btn')
    .addEventListener(
      'click',
      togglePanel
    );

  document.querySelectorAll('.dc-tab')
    .forEach(btn => {
      btn.addEventListener(
        'click',
        () => switchTab(btn.dataset.tab)
      );
    });

  document
    .getElementById('dc-clear-btn')
    .addEventListener(
      'click',
      () => {
        switch(S.activeTab) {
          case 'console':
            S.logs = [];
            S.groupDepth = 0;
            clearPersistentBuffer();
            updateTabCount('console', 0);
            renderConsole();
            break;

          case 'network':
            S.network = [];
            clearPersistentBuffer();
            updateTabCount('network', 0);
            renderNetwork();
            break;

          default:
            break;
        }
      }
    );

  document
    .getElementById('dc-copy-btn')
    .addEventListener(
      'click',
      () => {
        let text = '';

        if (S.activeTab === 'console') {
          text = S.logs
            .map(l =>
              `[${l.ts}] [${String(l.type).toUpperCase()}] ${formatLogForCopy(l)}`
            )
            .join('\n');
        }

        else if (S.activeTab === 'network') {
          text = S.network
            .map(r =>
              `[${r.ts}] ${r.method} ${r.url} → ` +
              `${r.status || 'ERR'} (${r.duration}ms)` +
              (r.requestBody
                ? `\nRequest: ${r.requestBody}`
                : '') +
              (r.responseBody
                ? `\nResponse: ${r.responseBody}`
                : '')
            )
            .join('\n\n');
        }

        if (!text) return;

        if (
          navigator.clipboard &&
          navigator.clipboard.writeText
        ) {
          navigator.clipboard
            .writeText(text)
            .catch(() => {});
        }
      }
    );

  function formatLogForCopy(log) {
    if (log.type === 'table' && log.table) {
      try {
        return JSON.stringify(log.table, null, 2);
      } catch(e) {}
    }

    return (log.args || [])
      .map(snapshotToText)
      .join(' ');
  }

  function snapshotToText(value) {
    if (!value) return '';

    switch(value.kind) {
      case 'string':
        return `"${value.value}"`;

      case 'null':
      case 'undefined':
      case 'number':
      case 'boolean':
      case 'bigint':
      case 'symbol':
      case 'function':
        return String(value.value ?? value.kind);

      case 'date':
      case 'regexp':
      case 'circular':
        return String(value.value || `[${value.kind}]`);

      case 'error':
        return `${value.ctor}: ${value.message}`;

      case 'array':
      case 'object':
        try {
          return JSON.stringify(value, null, 2);
        } catch(e) {
          return '[Object]';
        }

      default:
        return '[Unknown]';
    }
  }

  // Network filter
  el.netFlt().addEventListener(
    'input',
    e => renderNetwork(e.target.value)
  );

  document
    .getElementById('net-clear')
    .addEventListener(
      'click',
      () => {
        S.network = [];
        clearPersistentBuffer();
        updateTabCount('network', 0);
        renderNetwork();
      }
    );

  // Storage sub-tabs
  document.querySelectorAll('.dc-st-btn')
    .forEach(btn => {
      btn.addEventListener(
        'click',
        () => {
          S.activeStorage =
            btn.dataset.storage;

          document
            .querySelectorAll('.dc-st-btn')
            .forEach(b =>
              b.classList.toggle(
                'active',
                b === btn
              )
            );

          renderStorage();
        }
      );
    });

  document
    .getElementById('storage-refresh')
    .addEventListener(
      'click',
      loadStorage
    );

  // DOM toolbar
  document
    .getElementById('dom-refresh-btn')
    .addEventListener(
      'click',
      renderDomTree
    );

  document
    .getElementById('dom-pick-btn')
    .addEventListener(
      'click',
      () => {
        S.isPicking
          ? stopPicking()
          : startPicking();
      }
    );

  document
    .getElementById('dom-collapse-btn')
    .addEventListener(
      'click',
      () => {
        document
          .querySelectorAll('.dc-children.open')
          .forEach(c =>
            c.classList.remove('open')
          );

        document
          .querySelectorAll('.dc-arrow')
          .forEach(a => {
            if (a.textContent === '▼') {
              a.textContent = '▶';
            }
          });
      }
    );

  // ═══════════════════════════════════════════════════════════════
  // 22. SPA NAVIGATION WATCHER
  // ═══════════════════════════════════════════════════════════════

  let _lastUrl = location.href;

  setInterval(() => {
    if (location.href !== _lastUrl) {
      _lastUrl = location.href;

      addLog(
        'info',
        ['🔄 SPA navigation detected:', location.href]
      );
    }
  }, 1000);

  // ═══════════════════════════════════════════════════════════════
  // 23. INIT
  // ═══════════════════════════════════════════════════════════════

  initRepl();

  renderConsole();

  /*
   * Only generate the startup entry for a genuinely new session.
   * If persisted entries were restored, the separator is more useful
   * than another generic startup log.
   */
  if (!S.logs.length) {
    addLog(
      'log',
      [`✅ INSIKT v${VERSION} loaded — click ⌥ to open`]
    );
  } else {
    /*
     * Mark all restored entries and then add a new live entry.
     * renderConsole() will place the separator between them.
     */
    S.logs.forEach(log => {
      log.restored = true;
    });

    addLog(
      'info',
      [`🔄 INSIKT v${VERSION} resumed after reload`]
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // 24. PUBLIC API
  // ═══════════════════════════════════════════════════════════════

  window.insikt = {
    version: VERSION,

    toggle: togglePanel,

    clear: window.__dcClearAll,

    init: () => {
      /*
       * Already initialized automatically.
       * Kept for API compatibility.
       */
    },

    destroy: () => {
      const fab = el.fab();
      const panel = el.panel();

      if (fab) fab.remove();
      if (panel) panel.remove();

      ['log','warn','error','info','table','group','groupCollapsed','groupEnd']
        .forEach(level => {
          if (_orig[level]) {
            console[level] = _orig[level];
          }
        });

      if (_origFetch) {
        window.fetch = _origFetch;
      }

      XMLHttpRequest.prototype.open = _origOpen;
      XMLHttpRequest.prototype.send = _origSend;
      XMLHttpRequest.prototype.setRequestHeader =
        _origSetRequestHeader;

      window.onerror = _origOnError;

      window.removeEventListener(
        'unhandledrejection',
        onUnhandledRejection
      );

      stopPicking();

      if (style && style.parentNode) {
        style.parentNode.removeChild(style);
      }

      delete window.__dcToggleReq;
      delete window.__dcToggleDb;
      delete window.__dcToggleStore;
      delete window.__dcClearAll;

      delete window.insikt;
    }
  };

})();
