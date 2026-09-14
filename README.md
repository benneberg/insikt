# INSIKT

[![npm version](https://img.shields.io/npm/v/insikt.js.svg)](https://www.npmjs.com/package/insikt.js)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/insikt.js)](https://bundlephobia.com/package/insikt.js)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Deploy Pages](https://github.com/benneberg/insikt/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/benneberg/insikt/actions/workflows/deploy-pages.yml)

**A mobile-first, zero-dependency developer console for debugging directly inside the browser.**

Desktop DevTools are excellent. Mobile debugging is still painful. INSIKT provides a clean, elegant debugging overlay that works directly in the browser — no remote setups, no desktop tooling required.

> 🌐 **Live Demo & Documentation**: [benneberg.github.io/insikt](https://benneberg.github.io/insikt/)

---

## Features

- **Console capture** — intercepts `log`, `warn`, `error`, and `info` with timestamps and log-level styling
- **Network inspector** — monitors Fetch and XHR requests with status, duration, headers, and URL filtering
- **Runtime error tracking** — captures uncaught exceptions and unhandled promise rejections
- **Storage inspector** — browse localStorage, sessionStorage, cookies, and IndexedDB
- **Built-in REPL** — evaluate JavaScript expressions directly in the overlay
- **DOM inspector** — tap any element on the page to inspect its attributes and structure
- **Copy to clipboard** — export console logs or network requests as formatted text with one tap
- **Settings panel** — toggle timestamps, auto-scroll, max entries, font size, and network monitoring
- **Floating overlay UI** — non-intrusive FAB that stays out of the way until you need it
- **Bookmarklet support** — inject into any page without modifying source
- **Zero dependencies** — single file, no build step required for CDN usage

---

## Why INSIKT?

Mobile debugging has no good native solution. Remote debugging requires cables, separate machines, or platform-specific setup. Browser-based tools exist but feel dated.

INSIKT is designed around three principles:

- **Precision** — only what you need, nothing you don't
- **Minimalism** — clean UI that stays out of the way until you need it
- **Portability** — works via NPM, CDN, or bookmarklet on any page

---

## Installation

### NPM

```bash
npm install insikt.js
```

```js
import 'insikt.js';
```

INSIKT auto-initializes on import and exposes `window.insikt` for programmatic control.

---

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/insikt.js/dist/insikt.umd.js"></script>
```

---

### Bookmarklet

Inject INSIKT into any page without modifying its source. Create a bookmark with this URL:

```
javascript:(function(){const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/insikt.js/dist/insikt.umd.js';document.body.appendChild(s);})();
```

---

## API

INSIKT auto-initializes when loaded. The global `window.insikt` object is available for programmatic control:

```js
window.insikt.toggle();   // Show or hide the panel
window.insikt.clear();    // Clear all captured logs
window.insikt.destroy();  // Remove INSIKT and restore original console/fetch/XHR
window.insikt.init();     // Re-initialize after destroy
```

---

## Browser Support

| Browser | Support |
|---|---|
| Safari iOS | ✅ |
| Chrome Android | ✅ |
| Samsung Internet | ✅ |
| Chromium desktop | ✅ |

---

## Architecture

INSIKT is a single self-contained IIFE with no external dependencies.

- **Console proxying** — wraps `console.log/warn/error/info` and restores originals on destroy
- **Fetch/XHR interception** — patches `window.fetch` and `XMLHttpRequest` to capture network activity
- **Error listeners** — binds to `window.onerror` and `unhandledrejection`
- **Overlay UI** — appends a FAB and panel directly to `document.body`
- **Centralized state** — single runtime state object; fully reset on destroy

---

## Development

```bash
npm install
npm run dev
```

Build production bundle:

```bash
npm run build
```

Output is written to `dist/` as both ES module (`insikt.es.js`) and UMD (`insikt.umd.js`).

---

## Roadmap

**v1.2**
- [ ] `console.table` support
- [ ] `console.group` / `console.groupCollapsed` support
- [ ] Improved object inspection for deeply nested structures
- [ ] Network request and response body capture
- [ ] Persistent log buffer across page reloads

**v2.0**
- [ ] WebSocket inspector
- [ ] Performance timeline
- [ ] Log and network session export to file
- [ ] Plugin API
- [ ] React/Vue adapters

---

## License

MIT
