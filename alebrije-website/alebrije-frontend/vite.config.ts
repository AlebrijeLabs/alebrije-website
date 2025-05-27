import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createHtmlPlugin } from "vite-plugin-html";
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: 'react',
      babel: {
        babelrc: true
      }
    }),
    nodePolyfills({
      // Whether to polyfill specific node globals and modules
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Whether to polyfill `node:` protocol imports
      protocolImports: true,
      // Whether to polyfill node built-in modules
      include: ['buffer', 'crypto', 'stream', 'util', 'process'],
    }),
    createHtmlPlugin({
      inject: {
        tags: [
          {
            tag: 'meta',
            attrs: {
              'http-equiv': 'Content-Security-Policy',
              content: "script-src 'self' 'unsafe-eval';"
            },
            injectTo: 'head'
          }
        ]
      }
    }),
    // Custom plugin to copy PDFs without processing
    {
      name: 'copy-pdf-files',
      writeBundle() {
        // Only run during build, not during dev
        if (process.env.NODE_ENV === 'production') {
          const publicDir = path.resolve(__dirname, 'public');
          const outDir = path.resolve(__dirname, 'dist');
          
          // Copy PDF files directly without processing
          const pdfFiles = ['whitepaper.pdf'];
          pdfFiles.forEach(file => {
            const sourcePath = path.join(publicDir, file);
            const destPath = path.join(outDir, file);
            
            if (fs.existsSync(sourcePath)) {
              // Create directory if it doesn't exist
              const dir = path.dirname(destPath);
              if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
              }
              
              // Copy the file
              fs.copyFileSync(sourcePath, destPath);
              console.log(`Copied ${sourcePath} to ${destPath}`);
            }
          });
        }
      }
    }
  ],
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      stream: 'stream-browserify',
      crypto: 'crypto-browserify',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
    include: [
      'buffer',
      'process',
      'stream-browserify',
      'util',
      'crypto-browserify',
      '@solana/web3.js',
      '@solana/wallet-adapter-react',
      '@solana/wallet-adapter-wallets',
    ],
  },
  // Asset handling configuration
  assetsInclude: ['**/*.pdf'],
  // Ensure public assets are properly served
  publicDir: 'public',
  // Base path for all assets
  base: '/',
  // Prevent assets from being processed
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/],
    },
    assetsInlineLimit: 0, // never inline assets (important for PDFs)
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          solana: ['@solana/web3.js', '@solana/wallet-adapter-react'],
        },
      },
    },
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 3000,
    host: true,
  },
});


