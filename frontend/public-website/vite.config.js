// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Default, but good to be explicit
  },
  // If your app is served from a subpath, set base accordingly
  // base: '/my-app/',
});