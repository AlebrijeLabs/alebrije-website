#!/usr/bin/env node

const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const groupsConfig = require('./groups-config');
const fs = require('fs');

// Create bot instance
const bot = new TelegramBot(config.BOT_TOKEN);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorLog(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Interactive setup functions
async function setupGroups() {
  colorLog('cyan', '\n🚀 ALBJ Daily Updates Setup Wizard');
  colorLog('cyan', '=====================================\n');
  
  // Check current configuration
  const validation = groupsConfig.validateConfig();
  
  colorLog('blue', '📊 Current Configuration:');
  console.log(`• Total Groups: ${validation.totalGroups}`);
  console.log(`• Main Groups: ${validation.groupsByType.main}`);
  console.log(`• Regional Groups: ${validation.groupsByType.regional}`);
  console.log(`• VIP Groups: ${validation.groupsByType.vip}`);
  console.log(`• Test Groups: ${validation.groupsByType.test}\n`);
  
  if (validation.warnings.length > 0) {
    colorLog('yellow', '⚠️ Warnings:');
    validation.warnings.forEach(warning => console.log(`  ${warning}`));
    console.log('');
  }
  
  if (validation.errors.length > 0) {
    colorLog('red', '❌ Errors:');
    validation.errors.forEach(error => console.log(`  ${error}`));
    console.log('');
  }
  
  if (validation.totalGroups === 0) {
    colorLog('yellow', '📋 No groups configured yet!');
    console.log(groupsConfig.SETUP_INSTRUCTIONS);
    console.log('\n💡 After adding group IDs to groups-config.js, run this script again.\n');
    return;
  }
  
  colorLog('green', '✅ Configuration looks good!');
}

// Test bot permissions in groups
async function testBotPermissions() {
  colorLog('blue', '\n🤖 Testing Bot Permissions...\n');
  
  const allGroups = groupsConfig.getAllGroups();
  let successCount = 0;
  let errorCount = 0;
  
  for (const groupId of allGroups) {
    try {
      // Try to get chat info
      const chat = await bot.getChat(groupId);
      
      // Try to get bot member info
      const botMember = await bot.getChatMember(groupId, bot.options.polling.params.botInfo.id);
      
      const isAdmin = ['administrator', 'creator'].includes(botMember.status);
      const canPost = botMember.can_post_messages !== false;
      
      if (isAdmin && canPost) {
        colorLog('green', `✅ ${groupId} - ${chat.title || chat.username || 'Private Chat'} - Admin with post permissions`);
        successCount++;
      } else if (isAdmin) {
        colorLog('yellow', `⚠️ ${groupId} - ${chat.title || chat.username || 'Private Chat'} - Admin but can't post messages`);
        errorCount++;
      } else {
        colorLog('red', `❌ ${groupId} - ${chat.title || chat.username || 'Private Chat'} - Not admin (${botMember.status})`);
        errorCount++;
      }
      
    } catch (error) {
      colorLog('red', `❌ ${groupId} - Error: ${error.message}`);
      errorCount++;
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  colorLog('blue', `\n📊 Permission Test Results:`);
  colorLog('green', `✅ Success: ${successCount}`);
  colorLog('red', `❌ Errors: ${errorCount}`);
  colorLog('blue', `📋 Total: ${allGroups.length}\n`);
  
  if (errorCount > 0) {
    colorLog('yellow', '💡 To fix permission issues:');
    console.log('1. Add @ALBJTokenBot to the group/channel');
    console.log('2. Make it an admin');
    console.log('3. Give it "Post Messages" permission');
    console.log('4. For channels: Give "Post in Channel" permission\n');
  }
  
  return { successCount, errorCount, total: allGroups.length };
}

// Send test message
async function sendTestMessage() {
  colorLog('blue', '\n🧪 Sending Test Message...\n');
  
  const testMessage = `🧪 **ALBJ Bot Test Message** 🧪
*${new Date().toLocaleString()}*

This is a test message from the ALBJ Daily Updates system.

If you can see this message, the bot is working correctly in this group/channel!

🎭 Testing complete! 🎭

#ALBJTest #BotTest`;

  const testGroups = groupsConfig.getGroupsForUpdate('test');
  
  if (testGroups.length === 0) {
    colorLog('yellow', '⚠️ No test groups configured!');
    console.log('Add test group IDs to TEST_GROUPS in groups-config.js\n');
    return;
  }
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const groupId of testGroups) {
    try {
      await bot.sendMessage(groupId, testMessage, { parse_mode: 'Markdown' });
      colorLog('green', `✅ Test message sent to: ${groupId}`);
      successCount++;
    } catch (error) {
      colorLog('red', `❌ Failed to send to ${groupId}: ${error.message}`);
      errorCount++;
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  colorLog('blue', `\n📊 Test Message Results:`);
  colorLog('green', `✅ Success: ${successCount}`);
  colorLog('red', `❌ Errors: ${errorCount}`);
  colorLog('blue', `📋 Total: ${testGroups.length}\n`);
}

// Get bot info
async function getBotInfo() {
  try {
    const botInfo = await bot.getMe();
    colorLog('blue', '\n🤖 Bot Information:');
    console.log(`• Username: @${botInfo.username}`);
    console.log(`• Name: ${botInfo.first_name}`);
    console.log(`• ID: ${botInfo.id}`);
    console.log(`• Can Join Groups: ${botInfo.can_join_groups}`);
    console.log(`• Can Read Messages: ${botInfo.can_read_all_group_messages}\n`);
    return botInfo;
  } catch (error) {
    colorLog('red', `❌ Error getting bot info: ${error.message}\n`);
    return null;
  }
}

// Main setup function
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  try {
    // Get bot info first
    const botInfo = await getBotInfo();
    if (!botInfo) {
      colorLog('red', '❌ Cannot connect to Telegram API. Check your bot token.');
      return;
    }
    
    switch (command) {
      case 'config':
        await setupGroups();
        break;
        
      case 'test-permissions':
        await setupGroups();
        await testBotPermissions();
        break;
        
      case 'test-message':
        await sendTestMessage();
        break;
        
      case 'full-test':
        await setupGroups();
        await testBotPermissions();
        await sendTestMessage();
        break;
        
      default:
        colorLog('cyan', '\n🚀 ALBJ Daily Updates Setup');
        colorLog('cyan', '============================\n');
        
        console.log('Available commands:');
        console.log('• node setup-groups.js config           - Check current configuration');
        console.log('• node setup-groups.js test-permissions - Test bot permissions in groups');
        console.log('• node setup-groups.js test-message     - Send test message to test groups');
        console.log('• node setup-groups.js full-test        - Run all tests\n');
        
        colorLog('yellow', '📋 Quick Setup Guide:');
        console.log('1. Edit groups-config.js to add your group/channel IDs');
        console.log('2. Run: node setup-groups.js config');
        console.log('3. Run: node setup-groups.js test-permissions');
        console.log('4. Run: node setup-groups.js test-message');
        console.log('5. Start daily updates: node daily-updates.js schedule\n');
        
        colorLog('blue', '🔗 Need help getting group IDs?');
        console.log('• Add @userinfobot to your group');
        console.log('• Forward a message from the group to @userinfobot');
        console.log('• Copy the group ID (format: -1001234567890)\n');
        
        colorLog('green', '🎯 Ready to start? Run: node setup-groups.js full-test\n');
    }
    
  } catch (error) {
    colorLog('red', `❌ Setup error: ${error.message}`);
  }
}

// Export for use in other scripts
module.exports = {
  setupGroups,
  testBotPermissions,
  sendTestMessage,
  getBotInfo
};

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    colorLog('red', `❌ Fatal error: ${error.message}`);
    process.exit(1);
  });
} 