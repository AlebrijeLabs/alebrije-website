import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createHtmlPlugin } from "vite-plugin-html";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
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
          } else {
            console.warn(`Warning: PDF file not found: ${sourcePath}`);
          }
        });
      }
    }
  ],
  define: {
    global: "globalThis", // required for polyfills
  },
  resolve: {
    alias: {
      buffer: "buffer", // force Vite to use browser-safe Buffer
    },
  },
  optimizeDeps: {
    include: ["buffer"],
    esbuildOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
  // Asset handling configuration
  assetsInclude: ['**/*.pdf'],
  // Ensure public assets are properly served
  publicDir: 'public',
  // Base path for all assets
  base: '/',
  // Prevent assets from being processed
  build: {
    assetsInlineLimit: 0, // never inline assets (important for PDFs)
    rollupOptions: {
      // Explicitly tell Rollup to treat PDFs as assets and preserve their original names
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && /\.pdf$/.test(assetInfo.name)) {
            // Use original name for PDFs without hashing
            return '[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  },
});


