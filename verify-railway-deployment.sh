#!/bin/bash

# Railway Deployment Verification Script

echo "🧪 Verifying ALBJ Discord Bot for Railway Deployment..."

# Check package.json configuration
echo "📦 Checking package.json..."
if [ -f "package.json" ]; then
  # Check if required dependencies exist
  echo "✅ Checking required dependencies..."
  REQUIRED_DEPS=("discord.js" "express" "dotenv" "node-cron" "sqlite3")
  for dep in "${REQUIRED_DEPS[@]}"; do
    if ! grep -q "\"$dep\"" package.json; then
      echo "❌ Missing dependency: $dep"
      exit 1
    else
      echo "  ✓ Found $dep"
    fi
  done
else
  echo "❌ package.json not found!"
  exit 1
fi

# Check Dockerfile
echo "🐳 Checking Dockerfile..."
if [ -f "Dockerfile" ]; then
  # Check if the Dockerfile has the right commands
  if ! grep -q "npm install" Dockerfile; then
    echo "❌ Dockerfile is missing npm install command"
    exit 1
  fi
else
  echo "❌ Dockerfile not found!"
  exit 1
fi

# Check railway.json configuration
echo "🚂 Checking railway.json..."
if [ -f "railway.json" ]; then
  # Check for healthcheck
  if ! grep -q "healthcheckPath" railway.json; then
    echo "❌ Missing healthcheck configuration in railway.json"
    exit 1
  fi
else
  echo "❌ railway.json not found!"
  exit 1
fi

# Check health endpoint
echo "🩺 Checking for health endpoint..."
if ! grep -q "app.get('/health'" bot.js; then
  echo "❌ Health endpoint not found in bot.js"
  exit 1
fi

# Check env.example exists
echo "🔐 Checking environment variables setup..."
if [ -f ".env.example" ]; then
  # Check for key env vars
  REQUIRED_VARS=("DISCORD_TOKEN" "CLIENT_ID" "GUILD_ID")
  for var in "${REQUIRED_VARS[@]}"; do
    if ! grep -q "$var" .env.example; then
      echo "⚠️ Warning: $var not found in .env.example"
    else
      echo "  ✓ Found $var example"
    fi
  done
else
  echo "⚠️ .env.example not found. Consider creating one."
fi

echo -e "\n✅ Verification complete! Your bot appears ready for Railway deployment."
echo -e "\n📝 REMINDER: Before deploying, make sure to:"
echo "  1. Set all required environment variables in Railway"
echo "  2. Commit and push all changes to GitHub"
echo "  3. Connect Railway to the correct GitHub repository"

echo -e "\n🚀 Happy deploying!" 