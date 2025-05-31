import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    target: 'esnext',
    sourcemap: true,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      external: [
        'process/browser',
        'process/browser/'
      ]
    }
  },
  resolve: {
    alias: {
      stream: "stream-browserify",
      zlib: "browserify-zlib",
      util: 'util',
      buffer: 'buffer'
    }
  },
  define: {
    global: 'globalThis',
    'process.env': {},
    'process.browser': true
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext'
    },
    include: [
      'buffer',
      '@solana/wallet-adapter-wallets',
      '@solana/wallet-adapter-react',
      '@solana/wallet-adapter-react-ui',
      '@solana/wallet-adapter-base',
      '@solana/web3.js',
      '@solana/spl-token'
    ]
  }
}) 