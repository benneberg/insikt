# insikt - DevConsole for Mobile

**A drop-in, mobile-first in-page debugger for web apps.**

insikt gives you a full-featured debugging panel directly inside your page — no browser dev tools required. Built for mobile devices, WebViews, kiosks, smart TVs, and any environment where native dev tools are absent or inaccessible.

-----

## Why insikt

Native browser dev tools are unavailable in a surprising number of real-world scenarios: mobile Safari and Chrome on a physical device, embedded WebViews in native apps, signage players running on LG WebOS or Samsung Tizen, kiosk browsers, and remote test environments. insikt fills that gap by injecting a persistent, resizable debug panel directly into your page.

It intercepts `console.*` methods, `fetch`, and `XMLHttpRequest` at the source, so you see everything — including logs and requests fired before the panel was opened.

-----

## Features

### Console

- Captures `log`, `warn`, `error`, and `info` with color-coded styling
- Timestamps on every entry (toggleable)
- Object and array pretty-printing via `JSON.stringify`
- Global error capture via `window.onerror` and `unhandledrejection`
- Live error count badge on the FAB button

### REPL

- Execute arbitrary JavaScript directly in the page context
- Command history — navigate with ↑ / ↓ arrow keys
- Results and errors rendered inline in the console output
- Full access to `window`, `document`, and all page globals

### Network

- Intercepts all `fetch` and `XMLHttpRequest` calls
- Displays HTTP method (color-coded badges), URL, status code, and duration
- Expandable request rows with full response header detail
- Filter bar to search by URL or method
- Clear button to wipe the request history

### Storage

- **IndexedDB** — tree explorer: Database → Object Store → Records (up to 20 per store, with count and keyPath metadata)
- **LocalStorage** — key/value viewer with JSON auto-formatting
- **SessionStorage** — key/value viewer with JSON auto-formatting
- One-click refresh

### DOM Inspector

- Live, collapsible element tree built from `document.body`
- Shows tag name, `#id`, `.class` names, and a text content preview
- **Element Picker** — click ⊕, hover to highlight any element, click to inspect
- Attribute list and computed geometry (width, height, display, position) for the selected element
- Collapse-all button

### System Info

- Screen resolution and device pixel ratio
- Viewport dimensions
- Platform, language, cookie status, hardware concurrency
- Connection type, effective bandwidth, and round-trip time (where available)
- JS heap used / limit (Chromium-based browsers)
- Page load time and DOM ready time via the Navigation Timing API

### Settings

- Toggle timestamps, auto-scroll, global error capture, and network monitoring
- Adjustable font size (10–14 px) with live preview
- Configurable max log entries (100–2000) with automatic pruning
- Settings persisted to `localStorage`
- One-click clear-all

### Panel UX

- Floating action button (FAB) — always accessible, does not interfere with page layout
- Drag handle to resize the panel height (mouse and touch)
- Slide-up open / close animation
- Tab entry count badges on Console and Network tabs
- Copy-to-clipboard button exports all logs or network entries as plain text
- SPA-aware — detects URL changes and logs navigation events automatically

-----

## Installation

insikt is a single self-contained HTML file. For use as a script, use debugger.js

### Quickstart — script tag

Add the following line to any HTML page, just before `</body>`:

```html
<script src="insikt.js"></script>
```

The panel initialises automatically on `DOMContentLoaded` (or immediately if the DOM is already ready). No configuration is required.

### Bookmarklet

To inject insikt into any already-loaded page from your browser’s bookmark bar:

```javascript
javascript:(function(){var s=document.createElement('script');s.src='https://your-cdn.com/insikt.js';document.body.appendChild(s);})();
```

Replace the URL with wherever you host the file.

### Manual injection via DevTools console (desktop)

```javascript
var s = document.createElement('script');
s.src = 'https://your-cdn.com/insikt.js';
document.body.appendChild(s);
```

-----

## Usage

Once injected, a floating **⌥** button appears in the bottom-right corner of the page.

|Action               |How                                                 |
|---------------------|----------------------------------------------------|
|Open / close panel   |Click the ⌥ FAB                                     |
|Resize panel height  |Drag the handle bar at the top of the panel         |
|Switch tabs          |Click Console / Network / Storage / DOM / System / ⚙|
|Execute JavaScript   |Type in the REPL input and press Enter or click RUN |
|Navigate REPL history|↑ / ↓ arrow keys in the REPL input                  |
|Pick a DOM element   |DOM tab → ⊕ Pick element → hover and click          |
|Copy logs            |Click the 📋 button in the panel header              |
|Clear current tab    |Click the 🗑 button in the panel header              |
|Refresh Storage      |Storage tab → ↺ Refresh                             |
|Adjust settings      |⚙ tab                                               |

### REPL examples

```javascript
// Inspect a DOM element
document.querySelector('.my-component').getBoundingClientRect()

// Read from localStorage
JSON.parse(localStorage.getItem('user'))

// Manually dump an IndexedDB store
consoleDumpStore('MyDatabase', 'users')

// Trigger a network request
fetch('/api/health').then(r => r.json()).then(console.log)

// Check page performance
performance.getEntriesByType('navigation')[0]
```

The `consoleDumpStore(dbName, storeName)` helper is available globally after DevConsole loads. It reads all records from the specified object store and logs them to the Console tab.

-----

## Demo buttons

The bundled `devconsole.html` file includes a demo page with buttons that exercise each feature:

|Button          |What it does                                                    |
|----------------|----------------------------------------------------------------|
|Log Object      |Logs a structured object with `console.log`                     |
|Warn            |Fires a `console.warn`                                          |
|Error           |Fires a `console.error`                                         |
|Info            |Fires a `console.info`                                          |
|Test Fetch      |Makes a real `fetch` request to JSONPlaceholder                 |
|Test XHR        |Makes a real `XMLHttpRequest` to JSONPlaceholder                |
|Seed IDB        |Creates a `DemoApp` IndexedDB with `users` and `sessions` stores|
|Throw Error     |Triggers a caught TypeError to demonstrate error capture        |
|Rejected Promise|Fires an unhandled promise rejection                            |
|Spam Logs       |Generates 12 mixed log entries                                  |

-----

## Browser compatibility

|Feature                |Chrome|Firefox|Safari |Samsung Internet|WebOS / Tizen  |
|-----------------------|------|-------|-------|----------------|---------------|
|Console interception   |✅     |✅      |✅      |✅               |✅              |
|Fetch interception     |✅     |✅      |✅      |✅               |✅              |
|XHR interception       |✅     |✅      |✅      |✅               |✅              |
|IndexedDB explorer     |✅     |✅      |✅      |✅               |✅              |
|`indexedDB.databases()`|✅     |✅      |✅ 15.4+|✅               |⚠️ may be absent|
|JS heap info           |✅     |❌      |❌      |✅               |⚠️ varies       |
|Connection API         |✅     |❌      |❌      |✅               |⚠️ varies       |
|Drag resize (touch)    |✅     |✅      |✅      |✅               |✅              |
|Clipboard copy         |✅     |✅      |✅ 13.1+|✅               |⚠️ may be absent|

Where `indexedDB.databases()` is absent (older WebOS, some Android WebViews), the Storage tab will show an empty state rather than crash.

-----

## Architecture

DevConsole is implemented as a single IIFE with no external dependencies and no build step. All state is held in a plain object (`S`) within the closure. The UI is injected into the host page’s `document.body` at runtime.

```
devconsole.html
│
├── <style>          CSS custom properties, panel layout, tab styles, entry styles
├── Demo page        Example buttons and feature list (remove for production use)
├── FAB              Fixed-position toggle button
├── #dc-panel        The main panel container
│   ├── Drag handle  ns-resize for height adjustment
│   ├── Header bar   Title, pulse indicator, clear / copy / minimize
│   ├── Tab bar      Console · Network · Storage · DOM · System · Settings
│   └── Tab panels   One <div> per tab, shown/hidden on tab switch
└── <script>
    ├── State (S)         All runtime data: logs, network, dbs, settings, flags
    ├── Console shim      Wraps console.log/warn/error/info
    ├── fetch shim        Wraps window.fetch
    ├── XHR shim          Patches XMLHttpRequest.prototype.open/send
    ├── Render functions  One per tab — pure: read from S, write to DOM
    ├── Drag resize       Pointer/touch event listeners on #dc-drag
    ├── REPL              eval() in the page context with history
    ├── Element Picker    mouseover + click listeners on document
    ├── Settings          localStorage persistence, live apply
    └── SPA watcher       setInterval polling location.href
```

State mutations always go through dedicated `add*` functions, which update `S`, prune to `maxEntries`, and call the relevant render function if that tab is currently active. Tabs that are not active are rendered lazily on switch.

-----

## Configuration

Settings are saved to `localStorage` under the key `__dc_settings` and are re-applied on every subsequent load. You can also pre-set defaults by modifying the `S.settings` object at the top of the script before it initialises:

```javascript
// Example: disable timestamps and increase max entries
S.settings.timestamps  = false;
S.settings.maxEntries  = 1000;
S.settings.fontSize    = 11;
```

-----

## Production use

DevConsole is a development and QA tool. It should not ship to end users in production builds. The recommended pattern is to gate injection on a debug flag or build environment:

```html
<!-- Only inject in non-production environments -->
<% if (ENV !== 'production') { %>
  <script src="devconsole.js"></script>
<% } %>
```

Or conditionally via JavaScript:

```javascript
if (location.hostname === 'localhost' || location.search.includes('debug=1')) {
  import('./devconsole.js');
}
```

-----

## Contributing

The project is intentionally zero-dependency and single-file. Contributions that preserve that constraint are welcome. When adding features, follow the existing pattern: mutations go through `addLog` / `addNetReq` / similar, render functions are pure reads from `S`, and new tabs require an entry in both the HTML tab bar and the `switchTab` switch statement.

-----

## License

MIT
