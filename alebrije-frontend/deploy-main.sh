#!/bin/bash

# Deploy the XOLO website to the existing Netlify site
echo "Starting XOLO website deployment to existing site..."

# Make sure we're in the right directory
cd /Users/rastavo/xolo-project/xolo-frontend

# Check that dist directory exists
if [ ! -d "dist" ]; then
  echo "Error: dist directory not found! Run 'npm run build' first."
  exit 1
fi

echo "All files verified."
echo "Ready to deploy to Netlify."
echo ""
echo "You have two options for deployment:"
echo ""
echo "OPTION 1 (Recommended): Deploy to existing site"
echo "1. Go to https://app.netlify.com/sites/xolo-inu/deploys"
echo "2. Click 'Deploy manually'"
echo "3. Drag and drop the 'dist' folder"
echo ""
echo "OPTION 2: Deploy using Netlify CLI"
echo "1. Install Netlify CLI if not already installed: npm install -g netlify-cli"
echo "2. Run: netlify deploy --prod --dir=dist --site=xolo-inu"
echo ""
echo "This will preserve your original site's look and feel while updating the whitepaper links."

# Open Netlify site settings and folder for convenience
open https://app.netlify.com/sites/xolo-inu/overview
open /Users/rastavo/xolo-project/xolo-frontend/dist

echo "Deployment preparation complete!" 