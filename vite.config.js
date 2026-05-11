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
