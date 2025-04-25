#!/bin/bash

# Script to deploy the XOLO whitepaper site
echo "Preparing to deploy XOLO whitepaper site..."

# Navigate to the correct directory
cd /Users/rastavo/xolo-project/xolo-frontend

# Create a temporary zip file of the clean-whitepaper folder
echo "Creating deployment archive..."
zip -r whitepaper-deploy.zip clean-whitepaper

# Open the Netlify manual deploy page
echo "Opening Netlify deploy page..."
open https://app.netlify.com/drop

# Also open the folder containing the zip file for easy drag and drop
echo "Opening folder containing the zip file..."
open .

echo "Instructions:"
echo "-------------------------------------"
echo "1. Drag and drop the 'whitepaper-deploy.zip' file onto the Netlify page"
echo "2. Once deployed, your site will be updated with the XOLO branding"
echo "3. If you want to update the site name, click on 'Site settings' > 'Change site name'"
echo "-------------------------------------"
echo "If you don't see the updated site right away, try clearing your browser cache or opening in an incognito window." 