# XOLO Website Deployment Instructions

This guide will help you deploy your updated XOLO website while preserving the exact same appearance as the original site at https://xolo-inu.netlify.app/.

## What Has Been Updated

1. The WhitepaperButton component now points to the dedicated whitepaper site at https://xolo-whitepaper.netlify.app/
2. The WhitepaperFallback component options also point to the dedicated whitepaper site
3. The metadata (title, description, etc.) has been updated to match the original site

## Deployment Steps

### 1. Verify Asset Integrity

```bash
# Run this command to ensure all assets match the original site
sh /Users/rastavo/xolo-project/xolo-frontend/capture-original-assets.sh
```

### 2. Build the Project

```bash
# Run this command to build the project
cd /Users/rastavo/xolo-project/xolo-frontend && npm run build
```

### 3. Deploy to the Original Site

#### Option A: Deploy Manually (Recommended)

1. Go to https://app.netlify.com/sites/xolo-inu/deploys
2. Click the "Deploy manually" button
3. Drag and drop the `dist` folder from your local computer
   - The dist folder is located at: `/Users/rastavo/xolo-project/xolo-frontend/dist`
4. Wait for deployment to complete

#### Option B: Using Netlify CLI

```bash
# Install Netlify CLI if not already installed
npm install -g netlify-cli

# Deploy to the existing site
netlify deploy --prod --dir=dist --site=xolo-inu
```

## Important Notes

1. **Do not create a new site** - Deploy to the existing site to preserve all settings and the domain name
2. **Test after deployment** - After deploying, verify that:
   - The site looks exactly the same as before
   - The "View Whitepaper" button now opens the dedicated whitepaper site
   - The logo and all styling are preserved

## Troubleshooting

If the site doesn't look exactly the same as the original:

1. **Compare CSS files** - Make sure all CSS files are included
2. **Check assets directory** - Ensure all images and assets are properly copied
3. **Inspect the original site** - Use browser dev tools to inspect the original site and compare

## Backup

A backup of the original site files can be found in the `temp_assets` directory if you need to reference them. 