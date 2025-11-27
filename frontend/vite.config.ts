import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Configure HMR to be less verbose
    hmr: {
      // Only show errors, not all module reloads
      overlay: true,
    },
  },
  build: {
    // Don't expose source maps in production
    sourcemap: false,
  },
})
