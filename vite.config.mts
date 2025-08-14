import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    svgr({
      // svgr options: https://react-svgr.com/docs/options/
      svgrOptions: {},
    }),
  ],
  server: {
    port: 3050,
  },
  envPrefix: 'BOB',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
