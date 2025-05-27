#!/bin/bash

# Simple Netlify deployment script
echo "Starting simple Netlify deployment..."

# Make sure we're in the right directory
cd /Users/rastavo/xolo-project/xolo-frontend

# Ensure the dist directory has the latest build
echo "Copying whitepaper files to dist directory..."
mkdir -p dist
cp -f public/whitepaper.pdf dist/
cp -f public/whitepaper.html dist/
cp -f public/whitepaper-redirect.html dist/

# Create _redirects file
echo "Creating _redirects file..."
echo "/whitepaper.pdf /whitepaper.pdf 200! Content-Type=application/pdf" > dist/_redirects
echo "/whitepaper.html /whitepaper.html 200" >> dist/_redirects
echo "/whitepaper /whitepaper.html 200" >> dist/_redirects
echo "/whitepaper.pdf /whitepaper-redirect.html 404" >> dist/_redirects

# Ensure correct permissions
chmod 644 dist/whitepaper.pdf

echo "Running Netlify deployment..."
npx netlify-cli deploy --prod --dir=dist

echo "Deployment command completed." 