import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allows access from external networks
    port: 5173,
    strictPort: true,
    allowedHosts: [
      "61f0-106-216-254-170.ngrok-free.app", // Your Ngrok URL
      ".ngrok-free.app", // Allow all Ngrok subdomains
      ".trycloudflare.com", // Allow Cloudflare Tunnel (optional)
    ],
  },
});
