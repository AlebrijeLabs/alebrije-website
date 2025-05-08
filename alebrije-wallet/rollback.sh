#!/bin/bash

# Stop on errors
set -e

# Go to the workspace directory
cd /Users/rastavo/alebrije-project/alebrije-wallet

# Restore the original token-service.js file
git checkout -- src/services/token-service.js

# Remove the new files we added
rm -f src/components/Notifications.jsx
rm -f src/services/metrics-service.js
rm -f src/components/Settings.jsx
rm -f docs/token-account-creation.md
rm -f tests/token-account-creation.test.js

# Build the application
npm run build

# Deploy to Netlify production
netlify deploy --prod

echo "Rollback complete!" 