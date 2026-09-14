import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'insikt.js'),
      name: 'insikt',
      formats: ['es', 'umd'],
      fileName: (format) => `insikt.${format}.js`
    },
    rollupOptions: {
      output: { exports: 'named' }
    },
    outDir: 'dist',
    minify: 'terser',
    sourcemap: true
  },
  server: {
    open: '/docs/index.html' // Opens the landing page during local dev
  }
});
