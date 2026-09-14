# INSIKT — Implementation TODO

Tasks are ordered by priority within each version. Each item includes what needs to happen and why it matters.

---

## v1.2

### `console.table` support
**Why:** `console.table` is heavily used in frameworks and testing. Currently it falls through to the native implementation and nothing appears in the INSIKT panel.
**What to do:**
- Intercept `console.table` in the console proxy alongside `log/warn/error/info`
- Detect when the argument is an array of objects and render it as an HTML `<table>` inside the console tab
- Fall back to `JSON.stringify` display for non-tabular data
- Add `dc-entry-table` CSS class for styling consistency

---

### `console.group` / `console.groupCollapsed` support
**Why:** React, Vue, and most testing libraries use `console.group` for structured output. Without it, grouped logs appear as flat unrelated entries, making framework output unreadable.
**What to do:**
- Intercept `console.group`, `console.groupCollapsed`, and `console.groupEnd`
- Track nesting depth in state (e.g. `state.groupDepth`)
- Indent grouped entries visually in the console tab
- `groupCollapsed` should render as collapsed by default with an expand toggle
- `groupEnd` decrements depth

---

### Improved object inspection for deeply nested structures
**Why:** Complex objects (API responses, Redux state, etc.) currently render as a flat `JSON.stringify` string, which is unreadable at any depth beyond 2 levels.
**What to do:**
- Replace flat string rendering with an interactive expandable tree
- Top level shows `{ key: value, … }` summary with a `▶` toggle
- Clicking expands to show child keys, recursively collapsible
- Distinguish types visually: strings in green, numbers in blue, nulls in grey, booleans in orange
- Cap initial render depth at 2; expand on demand
- Reuse the same renderer for REPL output

---

### Network request and response body capture
**Why:** INSIKT currently captures URL, method, status, duration, and headers — but not the request payload or response body. The body is almost always what you actually need to debug an API call.
**What to do:**
- In the `fetch` interceptor: read and store `request.clone().text()` before passing through
- In the `fetch` interceptor: read and store `response.clone().text()` after resolution
- In the XHR interceptor: capture `xhr.send(body)` argument as request body
- Store bodies in `state.network[n].requestBody` and `state.network[n].responseBody`
- Add a collapsible "Body" section to the network detail view
- Be mindful of large responses — truncate display beyond 10KB with a "show full" toggle
- Never log binary/blob responses as text

---

### Persistent log buffer across page reloads
**Why:** Mobile debugging often involves interactions that trigger a reload (form submissions, redirects, PWA updates). When the page reloads, all captured logs are gone. This is the single most painful gap in the mobile debugging experience.
**What to do:**
- On each new log/network/error entry, write the entry to `sessionStorage` under a key like `__insikt_buffer__`
- On init, check for an existing buffer in `sessionStorage` and replay entries into state before rendering
- Add a visual separator in the console tab between pre-reload and post-reload entries (e.g. `── reloaded ──`)
- Cap the buffer at `state.settings.maxEntries` to avoid storage bloat
- `window.insikt.clear()` should also clear the sessionStorage buffer
- Add a toggle in Settings to enable/disable persistence (off by default to avoid surprising users)

---

## v2.0

### WebSocket inspector
**Why:** WebSocket debugging on mobile is currently impossible without desktop tooling. As WebSocket usage grows (real-time apps, chat, live data), this becomes a meaningful gap.
**What to do:**
- Intercept `new WebSocket(url)` via prototype patching
- Capture `open`, `message`, `error`, and `close` events
- Store in `state.ws[]` with timestamp, direction (in/out), and payload
- Add a new "WS" tab to the panel alongside Console and Network
- Display messages in a chat-style timeline (sent right, received left)

---

### Performance timeline
**Why:** Slow page loads and janky interactions are hard to diagnose on mobile without a timeline view. `PerformanceObserver` is available in all modern mobile browsers.
**What to do:**
- Use `PerformanceObserver` to capture `navigation`, `resource`, `paint`, and `longtask` entries
- Add a "Perf" tab with a horizontal bar timeline
- Highlight long tasks (>50ms) in red
- Show FCP and LCP markers if available
- Keep it read-only (no interaction needed at v2.0)

---

### Log and network session export to file
**Why:** Copy-to-clipboard works for small outputs but fails for long sessions. Being able to download a full log file is essential for sharing bug reports from a device.
**What to do:**
- Add an "Export" button in the panel header next to the existing copy button
- On click, serialize `state.logs` and `state.network` to a structured JSON or plain text file
- Use `URL.createObjectURL(new Blob([...]))` with a temporary `<a download>` to trigger download
- Filename format: `insikt-{date}-{time}.log`
- Include device info (user agent, screen size, url) as a header in the export

---

### Plugin API
**Why:** Once INSIKT has real users, they will want to extend it — custom tabs, custom log renderers, framework-specific integrations. A plugin API makes that possible without forking.
**What to do:**
- Design the API surface first before implementing (survey what users actually ask for)
- Likely shape: `window.insikt.use({ name, tab, onLog, onNetwork, onInit })`
- Plugins can register a custom tab with their own render function
- Plugins receive log/network events via callbacks
- Keep the core zero-dependency; plugins are the user's responsibility
- Document the API contract clearly before publishing

---

### React / Vue adapters
**Why:** React and Vue apps generate structured component-level logs. An adapter can surface component names, prop changes, and hook calls in a meaningful way rather than raw strings.
**What to do:**
- React: hook into `__REACT_DEVTOOLS_GLOBAL_HOOK__` to receive component tree events
- Vue: use `app.config.globalProperties` and Vue's devtools hook
- Surface component names alongside log entries when available
- Ship as separate optional packages (`insikt-react`, `insikt-vue`) that depend on `insikt.js`
- Do not build until there is confirmed user demand for this

---

## Deferred / Needs User Validation

These are worth tracking but should not be built until real usage patterns confirm the need:

- **Offline/PWA support** — loading INSIKT from CDN fails when offline; would require bundling or a service worker strategy
- **Theme customization** — dark/light toggle already exists; full custom theming is low priority until there are power users
- **`console.assert` / `console.count` / `console.time`** — niche methods; implement only if requested

