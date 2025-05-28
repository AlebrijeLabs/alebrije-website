import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    sourcemap: true,
    rollupOptions: {
      external: [
        '@solana/wallet-adapter-wallets',
        '@solana/wallet-adapter-react',
        '@solana/wallet-adapter-react-ui',
        '@solana/wallet-adapter-base',
        '@solana/web3.js',
        '@solana/spl-token'
      ],
      output: {
        format: 'es',
        globals: {
          '@solana/wallet-adapter-wallets': 'SolanaWalletAdapterWallets',
          '@solana/wallet-adapter-react': 'SolanaWalletAdapterReact',
          '@solana/wallet-adapter-react-ui': 'SolanaWalletAdapterReactUi',
          '@solana/wallet-adapter-base': 'SolanaWalletAdapterBase',
          '@solana/web3.js': 'SolanaWeb3',
          '@solana/spl-token': 'SolanaSplToken'
        }
      }
    }
  },
  resolve: {
    alias: {
      process: "process/browser",
      stream: "stream-browserify",
      zlib: "browserify-zlib",
      util: 'util'
    }
  }
}) 