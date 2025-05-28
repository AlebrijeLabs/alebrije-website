import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodeResolve({
      browser: true,
      preferBuiltins: false,
      mainFields: ['browser', 'module', 'main']
    }),
    commonjs({
      include: /node_modules/,
      transformMixedEsModules: true
    })
  ],
  build: {
    target: 'esnext',
    sourcemap: true,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
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
      '@solana/web3.js'
    ]
  }
}) 