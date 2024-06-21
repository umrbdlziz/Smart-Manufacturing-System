import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Bind to all network interfaces
    port: 5175, // The port Vite server runs on
    proxy: {
      "/api": "http://localhost:3001", // Proxy API requests to the backend server
    },
  },
});
