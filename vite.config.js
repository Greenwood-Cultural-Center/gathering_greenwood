import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';
import vue from '@vitejs/plugin-vue';
import AutoZip from 'vite-plugin-auto-zip';

const __APP_VERSION__ = process.env.npm_package_version;
const __APP_NAME__ = process.env.npm_package_name;
const __APP_DESCRIPTION__ = process.env.npm_package_description;

const zipName = `${__APP_NAME__}-${__APP_VERSION__}.zip`;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools({
      launchEditor: 'code',
    }),
    AutoZip(zipName,'dist'),
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
