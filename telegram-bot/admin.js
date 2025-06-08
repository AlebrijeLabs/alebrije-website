const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const userData = require('./userdata');

// Create bot instance for admin functions
const bot = new TelegramBot(config.BOT_TOKEN);

// Admin user IDs (add your user ID here)
const ADMIN_USER_IDS = [
  // Add your Telegram user ID here to use admin functions
  // Example: 123456789
];

// Function to send notification to subscribed users
async function sendNotificationToUsers(notificationType, message) {
  try {
    const subscribedUsers = userData.getUsersForNotification(notificationType);
    
    console.log(`📤 Sending ${notificationType} notification to ${subscribedUsers.length} users...`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const userId of subscribedUsers) {
      try {
        await bot.sendMessage(userId, message, { parse_mode: 'Markdown' });
        successCount++;
        console.log(`✅ Sent to user ${userId}`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        errorCount++;
        console.error(`❌ Failed to send to user ${userId}:`, error.message);
      }
    }
    
    console.log(`\n📊 Notification Summary:`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`📋 Total: ${subscribedUsers.length}`);
    
    return { successCount, errorCount, total: subscribedUsers.length };
  } catch (error) {
    console.error('Error sending notifications:', error);
    return { error: error.message };
  }
}

// Predefined notification templates
const NOTIFICATION_TEMPLATES = {
  launch: {
    countdown: (days) => `🚀 **Launch Update!** 🚀
    
Only **${days} days** left until ALBJ Token launches!

🗓️ **Launch Date:** June 12, 2025
⏰ **Time:** 00:00 UTC

**Get Ready:**
✅ Join our communities
✅ Follow social media  
✅ Prepare your wallet
✅ Spread the word!

The Alebrijes are excited! Are you? 🎭`,

    week: `🚀 **One Week to Launch!** 🚀

The moment we've all been waiting for is almost here!

**Final preparations:**
🔥 50% token burn ready
💧 Liquidity pools prepared
🎁 Airdrop campaigns activated
🎨 NFT reveals incoming

Join the celebration at https://albj.io! 🎉`,

    day: `🚀 **LAUNCH DAY IS HERE!** 🚀

Today is the day! ALBJ Token officially launches!

⏰ **Live NOW at:** https://albj.io
🔥 **50% Burn:** Complete
💧 **Trading:** Available on DEXs
🎁 **Airdrops:** Active

Welcome to the future of folklore and crypto! 🎭✨`
  },

  community: {
    milestone: (count, milestone) => `🎉 **Community Milestone!** 🎉

We've reached **${count}** ${milestone}!

This incredible growth shows the power of our community and the magic of the Alebrije spirits! 

Thank you for being part of this amazing journey! 🙏

**Keep growing:**
• Invite friends to join
• Share your spirit journey
• Participate in events
• Spread the ALBJ magic!

Together we're unstoppable! 💪🎭`,

    event: (eventName, date, details) => `📅 **Upcoming Community Event!** 📅

🎪 **Event:** ${eventName}
🗓️ **Date:** ${date}
📍 **Details:** ${details}

Don't miss this amazing opportunity to connect with fellow Alebrije enthusiasts!

Mark your calendars and join us! 🎭✨`
  },

  spirits: {
    reveal: (spiritName) => `🎨 **New Spirit Revealed!** 🎨

Meet the **${spiritName}**! 

This magnificent Alebrije has just been unveiled in our collection. Each spirit carries the wisdom and magic of Mexican folklore into the Web3 world.

🖼️ View the reveal: https://albj.io/spirits
🎭 Learn the story behind this spirit
✨ Discover its unique powers

The spirit realm grows stronger! 🌟`,

    collection: `🖼️ **NFT Collection Update!** 🖼️

Our Alebrije spirit collection continues to evolve!

**What's New:**
🎨 New artwork reveals
🎭 Enhanced spirit lore
✨ Special trait combinations
🔮 Rare variant discoveries

Explore the full collection at https://albj.io/nft

The spirits await your discovery! 🐉🦋`
  }
};

// Admin command functions
function showNotificationOptions() {
  console.log(`
🔔 **ALBJ Bot Notification System** 🔔

Available notification types:
• launch - Launch updates and countdown
• community - Community milestones and events  
• partnerships - Partnership announcements
• spirits - NFT and spirit reveals
• events - Event reminders and AMAs
• price - Price alerts (post-launch)

Usage Examples:
node admin.js send launch countdown 5
node admin.js send community milestone "1000 members" "members"
node admin.js send spirits reveal "Dragon-Jaguar"

Templates available:
${Object.keys(NOTIFICATION_TEMPLATES).map(type => 
  `• ${type}: ${Object.keys(NOTIFICATION_TEMPLATES[type]).join(', ')}`
).join('\n')}
  `);
}

// Main admin function
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    showNotificationOptions();
    return;
  }
  
  const command = args[0];
  
  if (command === 'send') {
    const notificationType = args[1];
    const templateType = args[2];
    const params = args.slice(3);
    
    if (!notificationType || !templateType) {
      console.error('❌ Usage: node admin.js send <notification-type> <template-type> [params...]');
      return;
    }
    
    let message;
    
    // Use predefined templates
    if (NOTIFICATION_TEMPLATES[notificationType] && NOTIFICATION_TEMPLATES[notificationType][templateType]) {
      message = NOTIFICATION_TEMPLATES[notificationType][templateType](...params);
    } else {
      // Custom message
      message = args.slice(2).join(' ');
    }
    
    console.log(`📤 Sending notification...`);
    console.log(`📋 Type: ${notificationType}`);
    console.log(`💬 Message: ${message.substring(0, 100)}...`);
    console.log('');
    
    const result = await sendNotificationToUsers(notificationType, message);
    
    if (result.error) {
      console.error(`❌ Error: ${result.error}`);
    } else {
      console.log(`\n✅ Notification sent successfully!`);
    }
  } else if (command === 'stats') {
    // Show user statistics
    userData.loadUserData();
    const users = Object.values(require('./users.json') || {});
    
    console.log(`📊 **ALBJ Bot Statistics** 📊\n`);
    console.log(`👥 Total Users: ${users.length}`);
    console.log(`🔥 Active Check-ins: ${users.filter(u => u.checkIn.streak > 0).length}`);
    console.log(`🏆 Users with Badges: ${users.filter(u => u.checkIn.badges.length > 0).length}`);
    console.log(`⚡ Total Spirit Points: ${users.reduce((sum, u) => sum + u.checkIn.spiritPoints, 0)}`);
    
    console.log(`\n🔔 Notification Subscriptions:`);
    Object.keys(config.NOTIFICATION_TYPES).forEach(type => {
      const key = type.toLowerCase().replace('_', '');
      const count = users.filter(u => u.notifications[key]).length;
      console.log(`• ${config.NOTIFICATION_TYPES[type].name}: ${count} users`);
    });
  } else {
    showNotificationOptions();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  sendNotificationToUsers,
  NOTIFICATION_TEMPLATES
}; 