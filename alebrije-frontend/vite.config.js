import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        include: [
            '@solana/web3.js',
            '@coral-xyz/anchor',
            '@solana/wallet-adapter-react'
        ]
    }
})