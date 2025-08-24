import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({
      target: 'react',
      autoCodeSplitting: true,
    }),
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      "@/shared" : path.resolve(__dirname, "../shared"),
      "@" : path.resolve(__dirname, "./src"),
    }
  },
  server: {             // it helps out with cors errors during development
    proxy: {
      "/api" : {
        target: "http://localhost:3000",
        changeOrigin: true
      }
    }
  }
})
