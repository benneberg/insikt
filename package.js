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

