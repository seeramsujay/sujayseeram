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
