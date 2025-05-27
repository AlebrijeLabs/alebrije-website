#!/usr/bin/env node

/**
 * Manual Netlify Deployment Script
 * 
 * This script deploys the dist folder to Netlify using the Netlify JS client.
 * It will create a new site on Netlify if one doesn't exist.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DIST_DIR = path.join(__dirname, 'dist');
const PDF_PATH = path.join(__dirname, 'public', 'whitepaper.pdf');
const HTML_PATH = path.join(__dirname, 'public', 'whitepaper.html');
const REDIRECT_PATH = path.join(__dirname, 'public', 'whitepaper-redirect.html');
const REDIRECTS_CONTENT = `
# Ensure the whitepaper.pdf is served correctly
/whitepaper.pdf /whitepaper.pdf 200! Content-Type=application/pdf

# Fallback to HTML version if PDF fails
/whitepaper /whitepaper.html 200

# Direct access to HTML version
/whitepaper.html /whitepaper.html 200

# Redirect to fallback page if PDF has issues
/whitepaper.pdf /whitepaper-redirect.html 404
`;

// Ensure dist directory exists
if (!fs.existsSync(DIST_DIR)) {
  console.log('Creating dist directory...');
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

// Copy necessary files
console.log('Copying whitepaper files to dist...');
try {
  fs.copyFileSync(PDF_PATH, path.join(DIST_DIR, 'whitepaper.pdf'));
  fs.copyFileSync(HTML_PATH, path.join(DIST_DIR, 'whitepaper.html'));
  fs.copyFileSync(REDIRECT_PATH, path.join(DIST_DIR, 'whitepaper-redirect.html'));
  
  // Create _redirects file
  fs.writeFileSync(path.join(DIST_DIR, '_redirects'), REDIRECTS_CONTENT.trim());
  
  console.log('Files copied successfully.');
} catch (error) {
  console.error('Error copying files:', error);
  process.exit(1);
}

// Run Netlify CLI deploy command
console.log('Running Netlify deploy command...');
try {
  // Create a new site option
  const deployCommand = 'npx netlify-cli deploy --prod --dir=dist --create --name alebrije-frontend';
  
  console.log(`Executing: ${deployCommand}`);
  const result = execSync(deployCommand, { stdio: 'inherit' });
  
  console.log('Deployment completed successfully.');
} catch (error) {
  console.error('Error during deployment:', error.message);
  process.exit(1);
}

console.log('Deployment process completed.'); 