import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: '/',
  server: {
    host: true,
    port: 5173,
  },
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
    },
  },
  esbuild: {
    jsx: 'automatic',
  },
});