import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import electron from 'vite-plugin-electron';


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools({
      launchEditor: 'code',
    }),
    electron({
      // Entry points for Electron processes
      entry: [
        'electron/main.js', // Main process
        'electron/preload.js', // Preload script
      ],
    }),
  ],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'index.html',
    },
  },
  optimizeDeps: {
    include: ['map-promisified'],
  },
  server: {
    port: 5173,
    open: true,
  }
})
