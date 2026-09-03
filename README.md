# INSIKT 
[![npm version](https://img.shields.io/npm/v/insikt.js.svg)](https://www.npmjs.com/package/insikt.js)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/insikt.js)](https://bundlephobia.com/package/insikt.js)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Deploy Pages](https://github.com/benneberg/insikt/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/benneberg/insikt/actions/workflows/deploy-pages.yml)


**A mobile-first, zero-dependency developer console for debugging directly inside the browser.**

Desktop DevTools are excellent. Mobile debugging is still painful. INSIKT provides a clean, elegant, mobile-first debugging experience directly inside the browser without requiring remote debugging setups or desktop tooling.

> 🌐 **Live Demo & Documentation**: [benneberg.github.io/insikt](https://benneberg.github.io/insikt/)


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

