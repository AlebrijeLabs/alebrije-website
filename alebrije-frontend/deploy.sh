#!/bin/bash

# XOLO Frontend Deployment Script
# This script handles building and deploying the XOLO frontend with special handling for large files

echo "🔥 Starting XOLO Frontend deployment..."

# Ensure we have a clean build
echo "Cleaning previous builds..."
rm -rf dist

# Install dependencies if needed
echo "Installing dependencies..."
npm install

# Create the dist directory
mkdir -p dist

# Build the project
echo "Building project..."
npm run build

# Verify the whitepaper exists in the public directory
if [ ! -f "public/whitepaper.pdf" ]; then
  echo "❌ Error: whitepaper.pdf is missing from the public directory!"
  exit 1
fi

# Verify the HTML fallback exists
if [ ! -f "public/whitepaper.html" ]; then
  echo "❌ Error: whitepaper.html is missing from the public directory!"
  exit 1
fi

# Special handling for large files - ensure they're properly copied to dist
echo "Handling large files..."
mkdir -p dist
cp -f public/whitepaper.pdf dist/
cp -f public/whitepaper.html dist/

# Ensure PDF has correct permissions
chmod 644 dist/whitepaper.pdf

# Copy Netlify configuration files
cp -f netlify.toml dist/
# Ensure _redirects file is copied if it exists
if [ -f "public/_redirects" ]; then
  cp -f public/_redirects dist/
else
  # Create a _redirects file if it doesn't exist
  echo "Creating _redirects file for Netlify..."
  echo "/whitepaper.pdf /whitepaper.pdf 200! Content-Type=application/pdf" > dist/_redirects
  echo "/whitepaper /whitepaper.html 200" >> dist/_redirects
  echo "/whitepaper.html /whitepaper.html 200" >> dist/_redirects
fi

# Deploy to Netlify
echo "✅ Build complete! Ready for deployment."
echo "Deploying to Netlify..."

# Check if netlify CLI is installed
if ! command -v netlify &> /dev/null; then
  echo "Installing Netlify CLI..."
  npm install -g netlify-cli
fi

# Deploy to production
echo "Running Netlify deploy command..."
netlify deploy --prod

echo "Done! Check the Netlify dashboard for your deployed site." 