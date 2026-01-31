import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy API calls to backend (so frontend can call /api/* normally)
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});