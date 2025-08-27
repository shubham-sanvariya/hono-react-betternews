import path from "path";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite({}), tailwindcss() ,react()],
  resolve: {
    alias: {
      // Shared aliases (matches root tsconfig)
      "@/shared": path.resolve(__dirname, "../shared"),
      // Server aliases (matches root tsconfig pattern @/* -> ./server/*)
      "@/db": path.resolve(__dirname, "../server/db"),
      "@/middleware": path.resolve(__dirname, "../server/middleware"),
      "@/routes": path.resolve(__dirname, "../server/routes"),
      // Frontend aliases (keep @ for frontend src last to avoid conflicts)
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
