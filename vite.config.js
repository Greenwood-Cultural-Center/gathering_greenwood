import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools({
      launchEditor: 'code',
    })
  ],
  build: {
    cacheDir: '.vite', // Make sure the cache is stored in a persistent location
    minify: 'terser',
    terserOptions: {
      compress: {
        defaults: true,
        drop_console: ['log', 'info'], // Remove console logs and infos in production
      },
      format: {
        comments: false, // Remove comments in production
      },
    },
  },
  optimizeDeps: {
    include: ['map-promisified'],
  },
  server: {
    port: 5173,
    open: true,
  },
})
