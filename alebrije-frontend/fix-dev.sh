#!/bin/bash

# XOLO Development Server Starter & Fixer
# This script prepares and starts the XOLO development environment

echo "🔥 XOLO Development Environment Setup"
echo "======================================"

# Kill any running Vite processes
echo "🔄 Stopping any running Vite servers..."
pkill -f vite || true

# Clear Vite cache
echo "🧹 Clearing Vite cache..."
rm -rf node_modules/.vite

# Verify public directory and files
echo "📂 Checking public directory..."
if [ ! -d "public" ]; then
  echo "⚠️ Public directory not found. Creating it..."
  mkdir -p public
fi

# Check for whitepaper.pdf
if [ ! -f "public/whitepaper.pdf" ]; then
  echo "❌ ERROR: whitepaper.pdf is missing from public directory!"
  echo "     Please add the whitepaper PDF to the public directory."
  echo "     The app requires this file to function correctly."
else
  echo "✅ whitepaper.pdf found"
  # Get file size
  size=$(du -h public/whitepaper.pdf | cut -f1)
  echo "   Size: $size"
  
  # Check if size is large
  if [[ $size == *"M"* ]]; then
    value=${size%M}
    if (( $(echo "$value > 10" | bc -l) )); then
      echo "⚠️ Note: The whitepaper PDF is quite large ($size)."
      echo "   Consider optimizing it for faster downloads."
    fi
  fi
fi

# Check for whitepaper.html
if [ ! -f "public/whitepaper.html" ]; then
  echo "❌ ERROR: whitepaper.html is missing from public directory!"
  echo "     Please add the HTML whitepaper version to the public directory."
  echo "     This is needed as a fallback for users who can't download the PDF."
else
  echo "✅ whitepaper.html found"
fi

# Check netlify.toml exists
if [ ! -f "netlify.toml" ]; then
  echo "⚠️ Warning: netlify.toml configuration file is missing."
  echo "   This may cause deployment issues later."
else
  echo "✅ netlify.toml configuration found"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.bin/vite" ]; then
  echo "📦 Installing dependencies..."
  npm install
  
  if [ $? -ne 0 ]; then
    echo "❌ Dependency installation failed. Please check your internet connection and try again."
    exit 1
  fi
fi

# Ensure environment is ready
echo ""
echo "✅ Environment setup complete!"
echo ""

# Start the development server
echo "🚀 Starting development server on port 3001..."
echo "📱 Access the app at: http://localhost:3001"
echo ""
echo "💡 Tip: If you encounter a blank page, try clearing your browser cache"
echo "    or open the app in an incognito/private window."
echo ""
echo "Press Ctrl+C to stop the server"

npm run dev -- --port 3001 