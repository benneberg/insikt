Need:

* repository structure
* packaging
* branding
* onboarding flow
* publishing pipeline
* public API
* documentation
* GitHub Pages
* npm release flow


⸻

Folder Structure

insikt/
├── src/
│   └── index.js
│
├── dist/
│
├── docs/
│   ├── index.html
│   ├── demo.html
│   ├── style.css
│   └── assets/
│       ├── screenshots/
│       └── logo/
│
├── .github/
│   └── workflows/
│       ├── deploy-pages.yml
│       └── publish-npm.yml
│
├── package.json
├── vite.config.js
├── README.md
├── LICENSE
├── .gitignore
└── CHANGELOG.md

⸻

PHASE 3 — Your Core Runtime Architecture


At the top of src/index.js:

const state = {
  initialized: false,
  panelVisible: false,
  logs: [],
  requests: [],
  errors: [],
  settings: {
    theme: 'dark'
  },
  ui: {
    root: null,
    panel: null,
    fab: null
  }
};


⸻

Proper Public API

src/index.js

Here is the architecture skeleton you should use.

const VERSION = '1.0.0';
const state = {
  initialized: false,
  panelVisible: false,
  logs: [],
  requests: [],
  errors: [],
  ui: {}
};
function initInsikt(options = {}) {
  if (state.initialized) return;
  state.initialized = true;
  createUI();
  attachConsoleProxy();
  attachGlobalErrorHandler();
  console.log('[INSIKT] initialized');
}
function destroyInsikt() {
  removeUI();
  state.initialized = false;
  console.log('[INSIKT] destroyed');
}
function toggleInsikt() {
  state.panelVisible = !state.panelVisible;
  if (state.ui.panel) {
    state.ui.panel.style.display =
      state.panelVisible ? 'block' : 'none';
  }
}
function clearLogs() {
  state.logs = [];
}
function createUI() {
  // Build overlay UI
}
function removeUI() {
  // Cleanup
}
function attachConsoleProxy() {
  const originalLog = console.log;
  console.log = (...args) => {
    state.logs.push(args);
    originalLog.apply(console, args);
  };
}
function attachGlobalErrorHandler() {
  window.addEventListener('error', (event) => {
    state.errors.push(event.error);
  });
}
export {
  initInsikt,
  destroyInsikt,
  toggleInsikt,
  clearLogs
};
if (typeof window !== 'undefined') {
  window.insikt = {
    version: VERSION,
    init: initInsikt,
    destroy: destroyInsikt,
    toggle: toggleInsikt,
    clear: clearLogs
  };
  if (!window.__INSIKT_INITIALIZED__) {
    window.__INSIKT_INITIALIZED__ = true;
    initInsikt();
  }
}

⸻

Production vite.config.js
vite.config.js

import { defineConfig } from 'vite';
import { resolve } from 'path';
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'Insikt',
      fileName: (format) => {
        return `insikt.${format}.js`;
      },
      formats: ['es', 'umd']
    },
    minify: 'terser',
    sourcemap: true,
    rollupOptions: {
      external: [],
      output: {
        exports: 'named'
      }
    }
  }
});

⸻

Production package.json

package.json

{
  "name": "insikt.js",
  "version": "1.0.0",
  "description": "A mobile-first in-browser developer console and debugging overlay.",
  "license": "MIT",
  "type": "module",
  "files": [
    "dist"
  ],
  "main": "./dist/insikt.umd.js",
  "module": "./dist/insikt.es.js",
  "exports": {
    ".": {
      "import": "./dist/insikt.es.js",
      "require": "./dist/insikt.umd.js"
    }
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "keywords": [
    "mobile",
    "console",
    "debug",
    "browser",
    "devtools",
    "overlay",
    "javascript"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/benneberg/insikt.git"
  },
  "homepage": "https://benneberg.github.io/insikt/",
  "bugs": {
    "url": "https://github.com/benneberg/insikt/issues"
  },
  "devDependencies": {
    "terser": "^5.0.0",
    "vite": "^5.0.0"
  }
}

⸻

README.md

MOST IMPORTANT file.

README.md

# INSIKT
A mobile-first in-browser developer console and debugging overlay.
INSIKT brings developer tooling directly into mobile browsers with an elegant overlay UI for logs, errors, requests, storage inspection, and runtime debugging.
---
# Features
- Mobile-first debugging UI
- Console log capture
- Runtime error tracking
- Fetch/XHR interception
- Storage inspection
- Built-in REPL
- Floating overlay interface
- Bookmarklet support
- CDN delivery
- NPM package
- Zero dependencies
---
# Why INSIKT?
Desktop DevTools are excellent.
Mobile debugging is still painful.
INSIKT was built to provide a clean, elegant, mobile-first debugging experience directly inside the browser without requiring remote debugging setups or desktop tooling.
The project focuses on:
- simplicity
- speed
- visibility
- minimalism
- developer ergonomics
---
# Installation
## NPM
```bash
npm install insikt.js
```
```js
import 'insikt.js';
```
---
## CDN
```html
<script src="https://cdn.jsdelivr.net/npm/insikt.js/dist/insikt.umd.js"></script>
```
---
## Bookmarklet
Create a bookmark with this URL:
```javascript
javascript:(function(){
const s=document.createElement('script');
s.src='https://cdn.jsdelivr.net/npm/insikt.js/dist/insikt.umd.js';
document.body.appendChild(s);
})();
```
---
# Usage
INSIKT auto-initializes when loaded.
Global API:
```js
window.insikt.toggle();
window.insikt.clear();
window.insikt.destroy();
window.insikt.init();
```
---
# Screenshots
## Floating Action Button
(Add screenshot)
## Console Overlay
(Add screenshot)
## Network Inspector
(Add screenshot)
---
# Architecture
INSIKT uses:
- console proxying
- fetch/XHR interception
- runtime error listeners
- overlay-based UI rendering
- centralized runtime state
- automatic cleanup lifecycle
The library is designed to remain lightweight and dependency-free.
---
# Roadmap
- [ ] console.table support
- [ ] IndexedDB viewer
- [ ] WebSocket inspector
- [ ] Performance timeline
- [ ] Plugin API
- [ ] Theme system
- [ ] Session export/import
---
# Browser Support
- Safari iOS
- Chrome Android
- Samsung Internet
- Chromium desktop browsers
---
# Development
```bash
npm install
npm run dev
```
Build production bundle:
```bash
npm run build
```
---
# License
MIT

⸻

GitHub Pages Landing Page

Your GitHub Pages should NOT be a blank page.

It should be:
* homepage
* install guide
* demo
* branding surface

⸻

docs/index.html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>INSIKT</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <main class="hero">
    <h1>INSIKT</h1>
    <p>
      Mobile-first browser debugging.
    </p>
    <div class="buttons">
      <a href="https://github.com/benneberg/insikt">
        GitHub
      </a>
      <a href="./demo.html">
        Live Demo
      </a>
    </div>
  </main>
</body>
</html>

⸻

docs/style.css

body {
  margin: 0;
  background: #0f1115;
  color: white;
  font-family: Inter, sans-serif;
}
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
h1 {
  font-size: 5rem;
  letter-spacing: 0.15em;
}
.buttons {
  display: flex;
  gap: 1rem;
}
a {
  padding: 1rem 1.5rem;
  border-radius: 12px;
  background: #1c1f26;
  color: white;
  text-decoration: none;
}

⸻

Evergreen Bookmarklet

Use THIS:

javascript:(function(){
const s=document.createElement('script');
s.src='https://cdn.jsdelivr.net/npm/insikt.js/dist/insikt.umd.js';
document.body.appendChild(s);
})();

NOT .cjs.

⸻

GitHub Actions

.github/workflows/deploy-pages.yml

name: Deploy Pages
on:
  push:
    branches:
      - main
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs
      - uses: actions/deploy-pages@v4

⸻

Release Checklist

Before publishing:

MUST TEST

iPhone Safari

Especially:

* keyboard overlap
* viewport resize
* touch drag
* z-index issues

Android Chrome

Especially:

* FAB positioning
* scroll behavior
* clipboard

Samsung Internet

Samsung Internet exposes weird rendering bugs.

Test it.

⸻

Real Branding Direction

insikt have a strong positioning opportunity.

INSIKT should feel:

* premium
* minimalist
* calm
* technical
* precise

Think:

* Linear
* Vercel
* Raycast
* Arc Browser
* Teenage Engineering

NOT:

* hacker-terminal gimmicks
* neon cyberpunk
* “1337 devtools”

That Scandinavian design direction is a real differentiator in devtools.

⸻

Next Build 

Priority order:

v1.1

* console.table
* request filtering
* better object inspection
* collapsible logs

v1.2

* IndexedDB viewer
* export logs
* persistent sessions

v2.0

* plugin system
* performance timeline
* websocket inspector
* React/Vue adapters

⸻

FINAL ADVICE

This is the dangerous phase where developers:

* endlessly refactor
* endlessly rename
* endlessly redesign

Instead:

Ship a clean v1.

Then iterate.

insikt core idea is already strong:

elegant mobile-native debugging UX

That niche is much less saturated than desktop devtools.
