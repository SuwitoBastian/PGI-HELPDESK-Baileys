import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dashboard React untuk PGI Helpdesk.
// Di dev: '/api' diproxy ke Express (port 3000).
// Di produksi: hasil build (dist/) disajikan langsung oleh Express, same-origin.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
