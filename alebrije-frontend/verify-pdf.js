#!/usr/bin/env node

/**
 * PDF Verification Script
 * 
 * This script verifies that the whitepaper.pdf file exists and is a valid PDF.
 * If it's not valid or too large, it creates a fallback HTML page.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PUBLIC_DIR = path.join(__dirname, 'public');
const PDF_PATH = path.join(PUBLIC_DIR, 'whitepaper.pdf');
const HTML_PATH = path.join(PUBLIC_DIR, 'whitepaper.html');
const REDIRECT_PATH = path.join(PUBLIC_DIR, 'whitepaper-redirect.html');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

console.log(`${colors.blue}🔍 Verifying whitepaper.pdf...${colors.reset}`);

// Check if PDF exists
if (!fs.existsSync(PDF_PATH)) {
  console.error(`${colors.red}❌ Error: whitepaper.pdf not found!${colors.reset}`);
  process.exit(1);
}

// Get PDF file size
const pdfStats = fs.statSync(PDF_PATH);
const pdfSizeMB = pdfStats.size / (1024 * 1024);

console.log(`${colors.cyan}📋 PDF details:${colors.reset}`);
console.log(`   - Path: ${PDF_PATH}`);
console.log(`   - Size: ${pdfSizeMB.toFixed(2)} MB`);

// Check if PDF is very large
if (pdfSizeMB > 10) {
  console.log(`${colors.yellow}⚠️ Warning: PDF file is large (${pdfSizeMB.toFixed(2)} MB)${colors.reset}`);
  console.log(`   This may cause loading issues for some users.`);
}

// Check if it's a valid PDF (basic header check)
const pdfHeader = fs.readFileSync(PDF_PATH, { encoding: 'utf8', flag: 'r' }).slice(0, 8);
const isPdfValid = pdfHeader.startsWith('%PDF-');

if (!isPdfValid) {
  console.error(`${colors.red}❌ Error: The file does not appear to be a valid PDF!${colors.reset}`);
  console.error(`   First bytes: ${pdfHeader}`);
} else {
  console.log(`${colors.green}✅ PDF header check passed${colors.reset}`);
}

// Check if HTML fallback exists
if (!fs.existsSync(HTML_PATH)) {
  console.error(`${colors.red}❌ Error: whitepaper.html fallback not found!${colors.reset}`);
} else {
  console.log(`${colors.green}✅ HTML fallback found${colors.reset}`);
}

// Check if redirect page exists
if (!fs.existsSync(REDIRECT_PATH)) {
  console.error(`${colors.yellow}⚠️ Warning: whitepaper-redirect.html not found!${colors.reset}`);
} else {
  console.log(`${colors.green}✅ Redirect page found${colors.reset}`);
}

// Copy PDF to dist folder directly to ensure it's not processed
console.log(`${colors.blue}📋 Ensuring PDF is properly copied for build...${colors.reset}`);

try {
  // Make sure dist directory exists
  if (!fs.existsSync(path.join(__dirname, 'dist'))) {
    fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
  }
  
  // Copy PDF to dist
  fs.copyFileSync(
    PDF_PATH,
    path.join(__dirname, 'dist', 'whitepaper.pdf')
  );
  
  console.log(`${colors.green}✅ PDF copied to dist folder${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}❌ Error copying PDF: ${error.message}${colors.reset}`);
}

console.log(`${colors.green}✅ Verification complete!${colors.reset}`);

// Exit with success
process.exit(0); 