const VERSION = '1.0.0';

const state = {
  initialized: false,
  panelVisible: false,
  logs: [],
  requests: [],
  errors: [],
  ui: {
    root: null,
    panel: null,
    fab: null
  }
};

function initInsikt(options = {}) {
  if (state.initialized) return;
  state.initialized = true;
  
  createUI();
  attachConsoleProxy();
  attachGlobalErrorHandler();
  
  console.log(`[INSIKT v${VERSION}] initialized`);
}

function destroyInsikt() {
  removeUI();
  state.initialized = false;
  console.log('[INSIKT] destroyed');
}

function toggleInsikt() {
  state.panelVisible = !state.panelVisible;
  if (state.ui.panel) {
    state.ui.panel.style.display = state.panelVisible ? 'block' : 'none';
  }
}

function clearLogs() {
  state.logs = [];
  state.requests = [];
  state.errors = [];
  // TODO: Add UI clear logic here
}

function createUI() {
  // TODO: Build elegant, minimalist overlay UI
  state.ui.root = document.createElement('div');
  state.ui.root.id = 'insikt-root';
  document.body.appendChild(state.ui.root);
}

function removeUI() {
  if (state.ui.root) {
    state.ui.root.remove();
    state.ui.root = null;
  }
}

function attachConsoleProxy() {
  const originalLog = console.log;
  console.log = (...args) => {
    state.logs.push({ type: 'log', args, timestamp: Date.now() });
    originalLog.apply(console, args);
  };
}

function attachGlobalErrorHandler() {
  window.addEventListener('error', (event) => {
    state.errors.push({ error: event.error, timestamp: Date.now() });
  });
}

// Public API
const insiktAPI = {
  version: VERSION,
  init: initInsikt,
  destroy: destroyInsikt,
  toggle: toggleInsikt,
  clear: clearLogs
};

// Auto-initialize in browser environments
if (typeof window !== 'undefined') {
  window.insikt = insiktAPI;
  if (!window.__INSIKT_INITIALIZED__) {
    window.__INSIKT_INITIALIZED__ = true;
    // Defer initialization to ensure DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initInsikt);
    } else {
      initInsikt();
    }
  }
}

export { initInsikt, destroyInsikt, toggleInsikt, clearLogs };
export default insiktAPI;
