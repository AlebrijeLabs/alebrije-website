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
        '@solana/wallet-adapter-wallets',
        '@solana/addresses',
        '@solana/codecs',
        '@solana/errors',
        '@solana/functional',
        '@solana/instructions',
        '@solana/codecs-core',
        '@solana/codecs-strings',
        '@solana/rpc-spec',
        '@solana/assertions'
      ]
    }
  },
  resolve: {
    alias: {
      process: "process/browser",
      stream: "stream-browserify",
      zlib: "browserify-zlib",
      util: 'util'
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext'
    },
    include: [
      '@solana/wallet-adapter-wallets',
      '@solana/wallet-adapter-react',
      '@solana/wallet-adapter-react-ui',
      '@solana/wallet-adapter-base',
      '@solana/web3.js',
      '@solana/spl-token'
    ]
  }
}) 