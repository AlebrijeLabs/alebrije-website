#!/bin/bash

# This script downloads key assets from the original site to ensure nothing is missing
echo "Capturing essential assets from the original XOLO site..."

# Create a temporary directory
mkdir -p temp_assets

# Download the original site's main HTML to inspect
curl -s https://xolo-inu.netlify.app/ > temp_assets/original_index.html

# Download favicon and logos to ensure they match
curl -s https://xolo-inu.netlify.app/favicon.ico > temp_assets/original_favicon.ico
curl -s https://xolo-inu.netlify.app/logo192.png > temp_assets/original_logo192.png
curl -s https://xolo-inu.netlify.app/logo512.png > temp_assets/original_logo512.png

# Compare with local files
echo "Comparing assets with local files..."

# Check favicon
if cmp -s "temp_assets/original_favicon.ico" "public/favicon.ico"; then
    echo "✅ Favicon matches"
else
    echo "⚠️ Favicon differs - copying original"
    cp temp_assets/original_favicon.ico public/favicon.ico
fi

# Check logo192
if cmp -s "temp_assets/original_logo192.png" "public/logo192.png"; then
    echo "✅ logo192.png matches"
else
    echo "⚠️ logo192.png differs - copying original"
    cp temp_assets/original_logo192.png public/logo192.png
fi

# Check logo512
if cmp -s "temp_assets/original_logo512.png" "public/logo512.png"; then
    echo "✅ logo512.png matches"
else
    echo "⚠️ logo512.png differs - copying original"
    cp temp_assets/original_logo512.png public/logo512.png
fi

# Now copy all these files to the dist directory to ensure they're included
echo "Copying verified assets to dist directory..."
cp public/favicon.ico dist/
cp public/logo192.png dist/
cp public/logo512.png dist/

# Check for other assets like CSS files that might be missing
grep -o '<link[^>]*href="[^"]*"[^>]*>' temp_assets/original_index.html | grep -o 'href="[^"]*"' | sed 's/href="//g' | sed 's/"//g' > temp_assets/css_files.txt

echo "Additional files to check:"
cat temp_assets/css_files.txt

echo "Asset verification complete!"
echo "Now run npm run build again and deploy using the deploy-main.sh script." 