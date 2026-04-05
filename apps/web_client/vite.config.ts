import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Proxy API calls to backend (so frontend can call /api/* normally)
    proxy: {
      "/api": "http://localhost:8000",
    },
    port: Number(process.env.VITE_PORT) || 5173,
  },
});
