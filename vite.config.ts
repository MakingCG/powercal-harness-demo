import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// PWA (vite-plugin-pwa, registerType 'prompt') and the full manualChunks split land with F001/F006 — see harness/ARCHITECTURE.md.
export default defineConfig({
  server: {
    host: '0.0.0.0',
  },
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Recharts only ships in lazy chunks; keep it out of the showcase chunk.
        manualChunks(id) {
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3-')) return 'vendor-charts'
        },
      },
    },
  },
})
