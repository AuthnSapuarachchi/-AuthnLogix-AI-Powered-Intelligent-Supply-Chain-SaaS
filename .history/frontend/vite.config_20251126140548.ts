import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Standard Vite Port
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Point to Spring Boot
        changeOrigin: true,
        secure: false,
      }
    }
  },
  define: {
    // This tells the browser: "If code asks for 'global', use 'window' instead"
    global: 'window',
  },
})
