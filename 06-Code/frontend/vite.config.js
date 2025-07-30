// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  preview: {
    host: true,
    port: 4173, 
    allowedHosts: ['espe202550-crimsoncode.onrender.com']
  }
});
