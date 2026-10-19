/**
 * v2/vite.config.js - Vite Configuration for Portfolio Version 2
 * ==============================================================
 * Role: Configures the Vite development server and production build pipeline for v2,
 *       splitting vendor chunks (Three.js, Marked, Motion) for optimized caching and delivery.
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
          marked: ['marked'],
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
