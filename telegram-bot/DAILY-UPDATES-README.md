# ALBJ Daily Updates System 🎭📡

Automated daily updates system for ALBJ Token community groups and channels.

## 🌟 Features

- **📅 Scheduled Daily Updates** - Automatic updates at 9:00 AM UTC
- **🎉 Weekend Specials** - Special weekend content on Saturdays
- **🎯 Targeted Groups** - Different updates for different audience segments
- **📊 Pre/Post Launch** - Content automatically adapts based on launch status
- **🔔 Individual Notifications** - Personal updates for subscribed users
- **🧪 Testing System** - Safe testing environment before going live
- **⚙️ Easy Configuration** - Simple group management system

## 📋 Quick Start

### 1. Install Dependencies
```bash
npm install node-cron
```

### 2. Configure Your Groups
Edit `groups-config.js` and add your group/channel IDs:
```javascript
MAIN_GROUPS: [
  '@ALBJTokenChannel',    // Public channel
  '-1001234567890',       // Private group
],
TEST_GROUPS: [
  '-1006666666666',       // Test group
]
```

### 3. Setup and Test
```bash
# Check configuration
node setup-groups.js config

# Test bot permissions
node setup-groups.js test-permissions

# Send test message
node setup-groups.js test-message

# Run all tests
node setup-groups.js full-test
```

### 4. Start Daily Updates
```bash
# Send update now
node daily-updates.js send daily

# Start scheduled updates
node daily-updates.js schedule
```

## 🏗️ System Architecture

### Files Overview
- `daily-updates.js` - Main update system with scheduling
- `groups-config.js` - Group/channel configuration
- `setup-groups.js` - Setup wizard and testing tools
- `userdata.js` - User data management (existing)
- `config.js` - Bot configuration (existing)

### Group Categories
- **MAIN_GROUPS** - Primary community channels
- **REGIONAL_GROUPS** - Language/region specific groups
- **VIP_GROUPS** - Exclusive holder groups  
- **TEST_GROUPS** - Development testing

## 📊 Update Types

### Daily Updates (`daily`)
- **Pre-launch**: Countdown, community stats, spirit features
- **Post-launch**: Price data, NFT activity, market metrics
- **Weekend**: Weekly review, community highlights

### Targeted Updates
- `launch` - Launch announcements
- `price` - Price alerts and market updates
- `nft` - NFT reveals and collection updates
- `community` - Community milestones and events
- `partnerships` - Partnership announcements
- `test` - Testing messages

## 🕐 Scheduling

### Default Schedule
- **Daily Updates**: 9:00 AM UTC (Mon-Fri)
- **Weekend Updates**: 10:00 AM UTC (Saturday)

### Custom Scheduling
```javascript
// Add custom schedules in daily-updates.js
cron.schedule('0 12 * * *', () => {
  sendDailyUpdate('price'); // Noon price updates
});
```

## 📱 Commands Reference

### Daily Updates
```bash
# Send updates
node daily-updates.js send daily          # All daily groups
node daily-updates.js send launch         # Launch update
node daily-updates.js send test           # Test groups only

# Automation
node daily-updates.js schedule            # Start scheduler
node daily-updates.js test               # Preview templates
node daily-updates.js config             # Check configuration
```

### Setup Tools
```bash
# Configuration
node setup-groups.js config              # Check current setup
node setup-groups.js test-permissions    # Test bot permissions
node setup-groups.js test-message        # Send test message
node setup-groups.js full-test          # Complete test suite
```

## 🔧 Configuration

### Group Permissions Matrix
```javascript
UPDATE_PERMISSIONS: {
  daily: ['MAIN_GROUPS', 'REGIONAL_GROUPS', 'VIP_GROUPS'],
  launch: ['MAIN_GROUPS', 'REGIONAL_GROUPS', 'VIP_GROUPS'],
  price: ['MAIN_GROUPS', 'VIP_GROUPS'],
  nft: ['MAIN_GROUPS', 'VIP_GROUPS'],
  community: ['MAIN_GROUPS', 'REGIONAL_GROUPS'],
  partnerships: ['MAIN_GROUPS', 'VIP_GROUPS'],
  test: ['TEST_GROUPS']
}
```

### Getting Group IDs

#### Method 1: Using @userinfobot
1. Add @userinfobot to your group
2. Forward a message from the group to @userinfobot  
3. Copy the group ID (format: -1001234567890)

#### Method 2: Using Bot Logs
1. Add your bot to the group
2. Send any message in the group
3. Check bot logs for the chat ID

#### Method 3: Public Channels
- Use @username format (e.g., '@ALBJTokenChannel')

## 🎭 Content Templates

### Pre-Launch Template
- Launch countdown
- Community growth stats
- Featured spirit of the day
- Development progress
- Community highlights

### Post-Launch Template  
- Market performance (price, volume, holders)
- Token metrics (supply, liquidity)
- NFT activity
- Community stats
- DeFi integration updates

### Weekend Template
- Week in review
- Spirit spotlight
- Community achievements
- Upcoming events

## 🧪 Testing

### Test Environment
```bash
# 1. Add test group to TEST_GROUPS in groups-config.js
TEST_GROUPS: ['-1006666666666']

# 2. Test bot permissions
node setup-groups.js test-permissions

# 3. Send test message
node daily-updates.js send test

# 4. Verify message received in test group
```

### Production Deployment
```bash
# 1. Configure main groups
# 2. Test in test groups first
# 3. Verify all permissions
# 4. Start production scheduler
node daily-updates.js schedule
```

## 📊 Monitoring & Analytics

### Update Success Tracking
```javascript
// Results from sendDailyUpdate()
{
  updateType: 'daily',
  groupsSent: 5,
  groupsErrors: 0,
  usersSent: 150,
  usersErrors: 2,
  totalGroups: 5,
  totalUsers: 152,
  templateUsed: 'prelaunch'
}
```

### Permission Monitoring
```bash
# Regular permission checks
node setup-groups.js test-permissions
```

## 🚨 Troubleshooting

### Common Issues

#### Bot Not Posting
- ✅ Bot is admin in group
- ✅ Bot has "Post Messages" permission
- ✅ For channels: "Post in Channel" permission
- ✅ Group ID format is correct

#### Rate Limiting
- Automatic delays between messages (1s for groups, 100ms for users)
- Monitor logs for rate limit errors
- Reduce frequency if needed

#### Invalid Group IDs
- Check format: -1001234567890 (groups/channels)
- Or @username (public channels)
- Verify with @userinfobot

### Error Messages
```bash
❌ ETELEGRAM: 400 Bad Request: chat not found
# Solution: Check group ID, ensure bot is in group

❌ ETELEGRAM: 403 Forbidden: bot was blocked by the user  
# Solution: User blocked bot, remove from user list

❌ Invalid groups configuration
# Solution: Run node daily-updates.js config to check issues
```

## 🔄 Production Deployment

### Using PM2 (Recommended)
```bash
# Install PM2
npm install -g pm2

# Start scheduled updates
pm2 start daily-updates.js --name "albj-updates" -- schedule

# Monitor
pm2 list
pm2 logs albj-updates
pm2 restart albj-updates
```

### Using Screen
```bash
# Start screen session
screen -S albj-updates

# Run scheduler
node daily-updates.js schedule

# Detach: Ctrl+A, D
# Reattach: screen -r albj-updates
```

### Using Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "daily-updates.js", "schedule"]
```

## 📈 Advanced Features

### Custom Update Types
```javascript
// Add new update type in groups-config.js
UPDATE_PERMISSIONS: {
  // ... existing types
  special: ['VIP_GROUPS'],
  announcement: ['MAIN_GROUPS', 'REGIONAL_GROUPS']
}

// Use with:
node daily-updates.js send special
```

### Multi-Language Support
```javascript
// Add regional templates in daily-updates.js
const REGIONAL_TEMPLATES = {
  spanish: () => `🎭 **Actualización Diaria ALBJ** 🎭...`,
  portuguese: () => `🎭 **Atualização Diária ALBJ** 🎭...`
};
```

### Data Integration
```javascript
// Connect to real data sources
async function generatePriceData() {
  const response = await fetch('https://api.dexscreener.com/...');
  const data = await response.json();
  return `$${data.price} (${data.change24h}%)`;
}
```

## 📞 Support

### Getting Help
1. Check this README for common issues
2. Run diagnostic commands:
   ```bash
   node daily-updates.js config
   node setup-groups.js test-permissions
   ```
3. Check bot logs for error details
4. Verify group IDs and permissions

### Contact
- Telegram: @ALBJTokenBot
- Discord: https://discord.gg/vrBnKB68
- GitHub: Issues section

---

**🎭 Built with love for the ALBJ community! 🌟** 