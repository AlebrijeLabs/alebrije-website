const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const userData = require('./userdata');
const groupsConfig = require('./groups-config');
const cron = require('node-cron');

// Create bot instance
const bot = new TelegramBot(config.BOT_TOKEN);

// Daily Update Templates
const DAILY_UPDATE_TEMPLATES = {
  prelaunch: () => {
    const daysUntilLaunch = calculateDaysUntilLaunch();
    return `🎭 *ALBJ Daily Update* 🎭
_${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}_

🚀 *Launch Countdown: ${daysUntilLaunch} Days*

📊 *Today's Highlights:*
• Community Growth: ${generateCommunityStats()}
• Spirit Engagement: ${generateSpiritStats()}
• Development Progress: ${generateDevProgress()}

🎨 *Featured Spirit of the Day:*
${getFeaturedSpirit()}

🔥 *Launch Preparations:*
• Token burn mechanism: ✅ Ready
• Liquidity pools: ✅ Prepared  
• Airdrop campaigns: ✅ Configured
• NFT collection: 🔄 Final touches

💬 *Community Highlights:*
${getCommunityHighlights()}

📱 *Stay Connected:*
• Website: https://albj.io
• Telegram: @ALBJTokenBot
• Discord: https://discord.gg/vrBnKB68

🌟 _The spirits are preparing for launch! Are you ready?_ 🌟

#ALBJ #Solana #Alebrijes #DeFi #Culture`;
  },

  postlaunch: () => {
    return `🎭 *ALBJ Daily Update* 🎭
_${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}_

📈 *Market Performance:*
• Price: ${generatePriceData()}
• Volume (24h): ${generateVolumeData()}
• Holders: ${generateHolderCount()}
• Market Cap: ${generateMarketCap()}

🔥 *Token Metrics:*
• Circulating Supply: ${generateSupplyData()}
• Burned Tokens: 4.5B ALBJ 🔥
• Liquidity: ${generateLiquidityData()}

🎨 *NFT Activity:*
• New Mints: ${generateNFTActivity()}
• Floor Price: ${generateNFTFloor()}
• Trading Volume: ${generateNFTVolume()}

🏆 *Community Stats:*
• Active Check-ins: ${generateCheckinStats()}
• Spirit Points Earned: ${generatePointsStats()}
• New Members: ${generateNewMembers()}

💡 *DeFi Integration:*
• Staking APY: ${generateStakingData()}
• Liquidity Rewards: ${generateLPRewards()}
• Yield Farming: ${generateYieldData()}

📊 *Analytics:*
${generateTechnicalAnalysis()}

🌟 _Keep building with the Alebrije spirits!_ 🌟

#ALBJ #SolanaDefi #AlebrijeNFT #TokenUpdate`;
  },

  weekend: () => {
    return `🎉 <b>ALBJ Weekend Update</b> 🎉
<i>${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</i>

🌈 <b>Week in Review:</b>
${generateWeeklyReview()}

🎭 <b>Spirit Spotlight:</b>
This week's most active spirit community: ${getWeeklySpirit()}

🏆 <b>Community Achievements:</b>
${generateWeeklyAchievements()}

🎨 <b>Upcoming This Week:</b>
${generateUpcomingEvents()}

🎯 <b>Weekend Activities:</b>
• Spirit meditation sessions
• Community art contests
• Folklore storytelling
• Q&A with the team

💫 <i>Enjoy your weekend with the Alebrije spirits!</i> 💫

#ALBJWeekend #Community #Alebrijes`;
  }
};

// Helper Functions
function calculateDaysUntilLaunch() {
  const launchDate = new Date('2025-06-12T00:00:00Z');
  const now = new Date();
  const timeDiff = launchDate.getTime() - now.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

function generateCommunityStats() {
  // In real implementation, get actual stats from userData
  const stats = [
    "📈 +15 new members",
    "🔥 +25 active users", 
    "🌟 +50 spirit interactions",
    "💬 +30 community messages"
  ];
  return stats[Math.floor(Math.random() * stats.length)];
}

function generateSpiritStats() {
  const spirits = Object.keys(config.ALEBRIJES);
  const randomSpirit = spirits[Math.floor(Math.random() * spirits.length)];
  return `${config.ALEBRIJES[randomSpirit].emoji} ${config.ALEBRIJES[randomSpirit].name} most popular today`;
}

function generateDevProgress() {
  const progress = [
    "🔧 Smart contracts optimized",
    "🎨 NFT metadata finalized",
    "📱 Mobile UI improvements",
    "🔐 Security audit completed"
  ];
  return progress[Math.floor(Math.random() * progress.length)];
}

function getFeaturedSpirit() {
  const spirits = Object.keys(config.ALEBRIJES);
  const today = new Date().getDate();
  const spiritKey = spirits[today % spirits.length];
  const spirit = config.ALEBRIJES[spiritKey];
  
  return `${spirit.emoji} *${spirit.name}* - _${spirit.theme}_
"${spirit.spirit}" - Today, channel the energy of ${spirit.name}!`;
}

function getCommunityHighlights() {
  const highlights = [
    "🎨 Amazing artwork shared by @community_artist",
    "💡 Great suggestion for NFT utility from @crypto_enthusiast",
    "🔥 Viral meme created by our community!",
    "📚 Cultural education post reached 1K+ views"
  ];
  return highlights[Math.floor(Math.random() * highlights.length)];
}

// Post-launch functions (placeholder - implement with real data sources)
function generatePriceData() { return "$0.0234 (+5.2%)"; }
function generateVolumeData() { return "$125K"; }
function generateHolderCount() { return "2,450 holders"; }
function generateMarketCap() { return "$105.3M"; }
function generateSupplyData() { return "4.5B ALBJ"; }
function generateLiquidityData() { return "$2.1M"; }
function generateNFTActivity() { return "23 spirits"; }
function generateNFTFloor() { return "0.5 SOL"; }
function generateNFTVolume() { return "15.2 SOL"; }
function generateCheckinStats() { return "156 users"; }
function generatePointsStats() { return "12,450 points"; }
function generateNewMembers() { return "+47 today"; }
function generateStakingData() { return "45% APY"; }
function generateLPRewards() { return "2.3% daily"; }
function generateYieldData() { return "Coming soon!"; }

function generateTechnicalAnalysis() {
  return `📊 RSI: 65 (Bullish)
📈 24h Change: +5.2%
💹 Trading Volume: Above average`;
}

function generateWeeklyReview() {
  return `• 🎯 Launch preparations on track
• 🚀 Community grew by 200+ members  
• 🎨 3 new spirit artworks revealed
• 💡 2 partnership discussions initiated`;
}

function getWeeklySpirit() {
  const spirits = Object.values(config.ALEBRIJES);
  return spirits[Math.floor(Math.random() * spirits.length)].name;
}

function generateWeeklyAchievements() {
  return `🏆 50+ users reached 7-day check-in streak
🎨 Community art contest winner announced
💬 Discord reached 1000+ members
📊 Website traffic increased 40%`;
}

function generateUpcomingEvents() {
  return `📅 Monday: Team AMA at 2 PM UTC
🎨 Wednesday: NFT reveal event
🎭 Friday: Community folklore session
🎉 Saturday: Spirit meditation workshop`;
}

// Enhanced Daily Update Function with Group Categories
async function sendDailyUpdate(updateType = 'daily') {
  try {
    console.log(`📤 Sending ${updateType} updates...`);
    
    // Validate groups configuration
    const validation = groupsConfig.validateConfig();
    if (!validation.isValid) {
      console.error('❌ Groups configuration invalid:', validation.errors);
      return { error: 'Invalid groups configuration' };
    }
    
    if (validation.warnings.length > 0) {
      console.warn('⚠️ Configuration warnings:', validation.warnings);
    }
    
    const isLaunched = new Date() >= new Date('2025-06-12T00:00:00Z');
    const isWeekend = [0, 6].includes(new Date().getDay());
    
    let template;
    if (isWeekend && updateType === 'daily') {
      template = DAILY_UPDATE_TEMPLATES.weekend();
    } else if (isLaunched) {
      template = DAILY_UPDATE_TEMPLATES.postlaunch();
    } else {
      template = DAILY_UPDATE_TEMPLATES.prelaunch();
    }
    
    // Get groups for this update type
    const targetGroups = groupsConfig.getGroupsForUpdate(updateType);
    
    console.log(`🎯 Targeting ${targetGroups.length} groups for ${updateType} update`);
    
    // Send to groups/channels
    let groupSuccessCount = 0;
    let groupErrorCount = 0;
    
    for (const groupId of targetGroups) {
      try {
        await bot.sendMessage(groupId, template, { parse_mode: 'HTML' });
        console.log(`✅ Sent to group: ${groupId}`);
        groupSuccessCount++;
        await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
      } catch (error) {
        console.error(`❌ Failed to send to group ${groupId}:`, error.message);
        groupErrorCount++;
      }
    }
    
    // Send to subscribed individual users (launch notification type)
    const subscribedUsers = userData.getUsersForNotification('launch');
    let userSuccessCount = 0;
    let userErrorCount = 0;
    
    for (const userId of subscribedUsers) {
      try {
        await bot.sendMessage(userId, template, { parse_mode: 'HTML' });
        userSuccessCount++;
        await new Promise(resolve => setTimeout(resolve, 100)); // Rate limiting
      } catch (error) {
        console.error(`❌ Failed to send to user ${userId}:`, error.message);
        userErrorCount++;
      }
    }
    
    console.log(`\n📊 ${updateType.toUpperCase()} Update Summary:`);
    console.log(`🏢 Groups: ${groupSuccessCount}/${targetGroups.length} (${groupErrorCount} errors)`);
    console.log(`👥 Users: ${userSuccessCount}/${subscribedUsers.length} (${userErrorCount} errors)`);
    console.log(`📅 Date: ${new Date().toLocaleString()}`);
    console.log(`📋 Template: ${isWeekend ? 'Weekend' : isLaunched ? 'Post-launch' : 'Pre-launch'}`);
    
    return {
      updateType,
      groupsSent: groupSuccessCount,
      groupsErrors: groupErrorCount,
      usersSent: userSuccessCount,
      usersErrors: userErrorCount,
      totalGroups: targetGroups.length,
      totalUsers: subscribedUsers.length,
      templateUsed: isWeekend ? 'weekend' : isLaunched ? 'postlaunch' : 'prelaunch'
    };
    
  } catch (error) {
    console.error('❌ Error in daily update:', error);
    return { error: error.message };
  }
}

// Schedule daily updates
function setupDailySchedule() {
  // Send daily update at 9:00 AM UTC
  cron.schedule('0 9 * * *', () => {
    console.log('⏰ Scheduled daily update triggered');
    sendDailyUpdate('daily');
  });
  
  // Send weekend update at 10:00 AM UTC on Saturdays
  cron.schedule('0 10 * * 6', () => {
    console.log('⏰ Weekend update triggered');
    sendDailyUpdate('daily');
  });
  
  console.log('📅 Daily update scheduler started');
  console.log('⏰ Daily updates: 9:00 AM UTC');
  console.log('🎉 Weekend updates: 10:00 AM UTC (Saturday)');
}

// Manual send functions
async function sendUpdateNow(updateType = 'auto') {
  console.log(`📤 Sending ${updateType} update now...`);
  return await sendDailyUpdate(updateType === 'auto' ? 'daily' : updateType);
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (command === 'send') {
    const updateType = args[1] || 'daily';
    const result = await sendUpdateNow(updateType);
    console.log('\n✅ Update completed:', result);
  } else if (command === 'schedule') {
    console.log('🕐 Starting scheduled daily updates...');
    setupDailySchedule();
    // Keep the process running
    setInterval(() => {}, 1000);
  } else if (command === 'test') {
    console.log('🧪 Testing update generation...');
    console.log('\n📋 Pre-launch Update:');
    console.log(DAILY_UPDATE_TEMPLATES.prelaunch());
    console.log('\n📋 Post-launch Update:');
    console.log(DAILY_UPDATE_TEMPLATES.postlaunch());
    console.log('\n📋 Weekend Update:');
    console.log(DAILY_UPDATE_TEMPLATES.weekend());
  } else if (command === 'config') {
    console.log('⚙️ Groups Configuration Status:');
    const validation = groupsConfig.validateConfig();
    console.log('\n📊 Summary:');
    console.log(`• Total Groups: ${validation.totalGroups}`);
    console.log(`• Main Groups: ${validation.groupsByType.main}`);
    console.log(`• Regional Groups: ${validation.groupsByType.regional}`);
    console.log(`• VIP Groups: ${validation.groupsByType.vip}`);
    console.log(`• Test Groups: ${validation.groupsByType.test}`);
    
    if (validation.errors.length > 0) {
      console.log('\n❌ Errors:');
      validation.errors.forEach(error => console.log(`  ${error}`));
    }
    
    if (validation.warnings.length > 0) {
      console.log('\n⚠️ Warnings:');
      validation.warnings.forEach(warning => console.log(`  ${warning}`));
    }
    
    if (validation.totalGroups === 0) {
      console.log('\n📋 Setup Instructions:');
      console.log(groupsConfig.SETUP_INSTRUCTIONS);
    }
  } else {
    console.log(`
🔔 **ALBJ Daily Updates System** 🔔

Commands:
• node daily-updates.js send [type]     - Send update now
  Types: daily, launch, price, nft, community, partnerships, test
  
• node daily-updates.js schedule       - Start scheduled updates
• node daily-updates.js test          - Preview update templates
• node daily-updates.js config        - Check groups configuration

Schedule:
• Daily updates: 9:00 AM UTC
• Weekend updates: 10:00 AM UTC (Saturday)

Setup:
1. Edit groups-config.js to add your group/channel IDs
2. Ensure bot is admin in all groups/channels
3. Test with: node daily-updates.js send test
4. Start automation: node daily-updates.js schedule

Examples:
node daily-updates.js send daily       # Send to all daily groups
node daily-updates.js send test        # Send to test groups only
node daily-updates.js send launch      # Send launch update
node daily-updates.js config           # Check configuration
    `);
  }
}

// Export functions
module.exports = {
  sendDailyUpdate,
  sendUpdateNow,
  setupDailySchedule,
  DAILY_UPDATE_TEMPLATES
};

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
} 