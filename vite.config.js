import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Production on www.kampfiskapps.com uses root base.
// Override with VITE_BASE=/KampfiskApps/ for GitHub Pages if needed.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
})
