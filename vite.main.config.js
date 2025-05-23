import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    outDir: 'dist-electron',
    emptyOutDir: true,
    target: 'node23',
    lib: {
      entry: path.resolve(__dirname, 'electron/main.js'),
      formats: ['cjs'],
      fileName: () => 'main.js', // explicitly set output file name
    },
    rollupOptions: {
      external: [
        'electron',
        'path',
        'url',
        // add any other node builtins or native modules your main.js uses
      ],
      output: {
        // for commonjs output
        exports: 'auto',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});