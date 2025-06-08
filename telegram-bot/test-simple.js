const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');

// Create bot instance
const bot = new TelegramBot(config.BOT_TOKEN);

// Simple test message
async function testSend() {
  const groupId = '-4767748512'; // Your group ID
  const message = '🧪 Test message from ALBJ Bot!\n\nIf you see this, the connection is working! 🎉';
  
  try {
    console.log('📤 Sending test message...');
    await bot.sendMessage(groupId, message);
    console.log('✅ SUCCESS! Message sent to group!');
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  }
}

// Run the test
testSend(); 