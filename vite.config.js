import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "qrlink-demo-app.onrender.com",
      "atcplagarodemo.vercel.app",
      "localhost",
      ".ngrok-free.app",
      ".trycloudflare.com",
    ],
    proxy: {
      "/api": {
        target: "https://qrlink-demo-app.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
