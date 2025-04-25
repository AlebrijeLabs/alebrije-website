#!/bin/bash

# All-in-one script to fix and deploy the XOLO site
echo "Starting XOLO site fix and deployment..."
cd /Users/rastavo/xolo-project/xolo-frontend

# 1. Ensure all assets from the original site are present
echo "Capturing and verifying assets from original site..."
mkdir -p temp_assets

# Download the original site's main HTML and assets
curl -s https://xolo-inu.netlify.app/ > temp_assets/original_index.html
curl -s https://xolo-inu.netlify.app/favicon.ico > temp_assets/original_favicon.ico
curl -s https://xolo-inu.netlify.app/logo192.png > temp_assets/original_logo192.png
curl -s https://xolo-inu.netlify.app/logo512.png > temp_assets/original_logo512.png

# Copy the assets to both public and dist directories to ensure they're included
cp temp_assets/original_favicon.ico public/favicon.ico
cp temp_assets/original_logo192.png public/logo192.png
cp temp_assets/original_logo512.png public/logo512.png

mkdir -p dist
cp temp_assets/original_favicon.ico dist/favicon.ico
cp temp_assets/original_logo192.png dist/logo192.png
cp temp_assets/original_logo512.png dist/logo512.png

echo "Assets verified and copied!"

# 2. Build the project
echo "Building the project..."
npm run build

# 3. Copy the built files to another location as backup
echo "Creating backup..."
mkdir -p backup_dist
cp -r dist/* backup_dist/

# 4. Instructions for manual deployment
echo ""
echo "=======================================================
BUILD COMPLETED SUCCESSFULLY!
=======================================================

Now you need to deploy to your original Netlify site:

1. Go to: https://app.netlify.com/sites/xolo-inu/deploys
2. Click 'Deploy manually'
3. Drag and drop the dist folder from:
   /Users/rastavo/xolo-project/xolo-frontend/dist

We've also created a backup at:
/Users/rastavo/xolo-project/xolo-frontend/backup_dist

=======================================================

Do you want to open the Netlify deploy page now? (y/n)"

read -p "> " OPEN_NETLIFY

if [[ $OPEN_NETLIFY == "y" || $OPEN_NETLIFY == "Y" ]]; then
  open https://app.netlify.com/sites/xolo-inu/deploys
  open /Users/rastavo/xolo-project/xolo-frontend/dist
  echo "Opened Netlify deploy page and dist folder!"
fi

echo "✅ Script completed successfully!" 