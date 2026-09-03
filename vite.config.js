import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'insikt',
      formats: ['es', 'umd'],
      fileName: (format) => `insikt.${format}.js`
    },
    outDir: 'dist',
    minify: 'terser',
    sourcemap: true
  },
  server: {
    open: '/docs/index.html' // Opens the landing page during local dev
  }
});
