/**
 * v3/vite.config.js - Vite Configuration for Portfolio Version 3
 * ==============================================================
 * Role: Configures the Vite development server and optimized build pipeline for v3,
 *       splitting vendor chunks (Three.js and Motion) while omitting marked.js for minimal weight.
 */

import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          motion: ['gsap', 'lenis']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: false
  }
});
