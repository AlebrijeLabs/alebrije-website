#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🛠️ Fixing dependencies for Railway deployment...');

// Read package.json
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

// Make sure Express is added at the correct version
packageJson.dependencies = packageJson.dependencies || {};

// Ensure Express dependency exists
if (!packageJson.dependencies.express) {
  packageJson.dependencies.express = '^4.21.2';
  console.log('Added express@^4.21.2 to dependencies');
}

// Write updated package.json
fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
console.log('✅ Updated package.json');

// Delete package-lock.json to force regeneration
try {
  fs.unlinkSync('./package-lock.json');
  console.log('🗑️ Removed old package-lock.json');
} catch (err) {
  console.log('No package-lock.json to remove');
}

// Run npm install to generate a new package-lock.json
console.log('📦 Running npm install...');
execSync('npm install', { stdio: 'inherit' });

console.log('✅ Dependencies fixed! You can now commit and push these changes.'); 