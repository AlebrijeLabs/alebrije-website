# 🤖 ALBJ Token Telegram Bot

Official Telegram bot for ALBJ Token community.

**Bot URL**: https://t.me/ALBJTokenBot

## 🚀 Features

### Pre-Launch Commands
- `/start` - Welcome message with interactive buttons
- `/help` - List of all available commands
- `/info` - Detailed token information
- `/website` - Link to official website
- `/whitepaper` - Download whitepaper
- `/launch` - Launch date and countdown
- `/tokenomics` - Token distribution details
- `/social` - All social media links
- `/price` - Price check (post-launch)

### Interactive Features
- **Inline Keyboards** - Easy navigation buttons
- **Launch Countdown** - Real-time days until launch
- **Direct Links** - Quick access to website and socials
- **Rich Formatting** - Markdown formatted messages

## 🛠️ Setup

### Prerequisites
- Node.js 18+ installed
- Telegram Bot Token (already configured)

### Installation

1. **Install Dependencies**
   ```bash
   cd telegram-bot
   npm install
   ```

2. **Run the Bot**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

3. **Test the Bot**
   - Go to https://t.me/ALBJTokenBot
   - Send `/start` to test

## 📁 File Structure

```
telegram-bot/
├── bot.js          # Main bot implementation
├── config.js       # Configuration and messages
├── package.json    # Dependencies and scripts
└── README.md       # This file
```

## 🔧 Configuration

Edit `config.js` to update:
- Bot messages and responses
- Website URLs
- Social media links
- Token information

## 🚀 Deployment Options

### Option 1: Railway (Recommended)
1. Connect GitHub repository
2. Select telegram-bot folder
3. Deploy automatically

### Option 2: Heroku
1. Create new Heroku app
2. Connect GitHub repository
3. Set buildpack to Node.js
4. Deploy

### Option 3: VPS/Server
1. Clone repository to server
2. Install Node.js and dependencies
3. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start bot.js --name "albj-bot"
   pm2 startup
   pm2 save
   ```

## 📊 Bot Commands Reference

| Command | Description | Status |
|---------|-------------|---------|
| `/start` | Welcome message | ✅ Active |
| `/help` | Show all commands | ✅ Active |
| `/info` | Token information | ✅ Active |
| `/website` | Official website | ✅ Active |
| `/whitepaper` | Download PDF | ✅ Active |
| `/launch` | Launch countdown | ✅ Active |
| `/tokenomics` | Token distribution | ✅ Active |
| `/social` | Social media links | ✅ Active |
| `/price` | Price check | ⏳ Post-launch |

## 🔮 Post-Launch Features (Coming June 12, 2025)

- **Real-time price tracking**
- **Portfolio balance checking**
- **Trading alerts**
- **Community voting**
- **NFT integration**

## 🛡️ Security

- Bot token is stored in config.js
- No user data is stored
- All external links are verified
- Error handling implemented

## 📞 Support

For bot issues or feature requests:
- GitHub Issues: [AlebrijeLabs/alebrije-project](https://github.com/AlebrijeLabs/alebrije-project)
- Discord: https://discord.gg/vrBnKB68
- Telegram: @ALBJTokenBot

---

**Status**: 🟢 **LIVE AND READY**

The bot is fully functional and ready to serve the ALBJ community!

# ALBJ Telegram Bot - 24/7 Deployment Guide

## 🚀 Quick Deploy to Railway (FREE)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

### Step-by-Step Railway Setup:

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Connect your GitHub account**
6. **Create a new repo** with this bot code
7. **Add Environment Variable:**
   - `BOT_TOKEN` = `your_bot_token_here`
8. **Deploy!** 🎉

### Environment Variables Needed:
```
BOT_TOKEN=7604576999:AAHk7EqYFBM2jNGPSp4UFLnEEidWJgwYGyI
```

## 💰 Deploy to DigitalOcean ($6/month)

### Step-by-Step DigitalOcean Setup:

1. **Create DigitalOcean account**
2. **Create Droplet** (Basic $6/month)
3. **SSH into server**
4. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
5. **Upload bot code**
6. **Install PM2:**
   ```bash
   npm install -g pm2
   ```
7. **Start bot:**
   ```bash
   pm2 start bot.js --name "albj-bot"
   pm2 save
   pm2 startup
   ```

## 🤖 Bot Features

- **Daily Updates** at 9:00 AM UTC
- **Weekend Specials** at 10:00 AM UTC Saturday  
- **12 Alebrije Spirits** rotation
- **Pre/Post Launch** templates
- **Community Management**
- **Rate Limited** messaging

## 📊 Commands

```bash
# Test the system
npm run test

# Start daily updates
npm run daily

# Start bot
npm start
```

## 🔧 Configuration

Edit `groups-config.js` to add your group IDs:

```javascript
TEST_GROUPS: [
  '-4767748512',  // Your group ID here
],
```

## 🌟 Support

- **Telegram:** @ALBJTokenBot
- **Website:** Coming June 12, 2025
- **Community:** ALBJ Test Group 