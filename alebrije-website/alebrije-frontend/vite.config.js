import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    target: 'esnext',
    sourcemap: true
  },
  define: {
    global: 'globalThis'
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext'
    }
  }
}) 