const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');

// Create bot instance
const bot = new TelegramBot(config.BOT_TOKEN, { polling: true });

console.log('🤖 ALBJ Token Bot is starting...');

// Welcome message and start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name || 'Friend';
  
  const welcomeKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🌐 Visit Website', url: config.ALBJ_WEBSITE_URL },
          { text: '📄 Whitepaper', url: `${config.ALBJ_WEBSITE_URL}/whitepaper.pdf` }
        ],
        [
          { text: '📊 Token Info', callback_data: 'token_info' },
          { text: '🗓️ Launch Date', callback_data: 'launch_info' }
        ],
        [
          { text: '🔗 Social Links', callback_data: 'social_links' },
          { text: '❓ Help', callback_data: 'help' }
        ]
      ]
    }
  };

  bot.sendMessage(chatId, `👋 Hello ${userName}!\n\n${config.WELCOME_MESSAGE}`, {
    parse_mode: 'Markdown',
    ...welcomeKeyboard
  });
});

// Help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, config.HELP_MESSAGE, { parse_mode: 'Markdown' });
});

// Token information command
bot.onText(/\/info/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, config.TOKEN_INFO, { parse_mode: 'Markdown' });
});

// Website command
bot.onText(/\/website/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `🌐 **Official ALBJ Website**\n\n${config.ALBJ_WEBSITE_URL}\n\nVisit our website to see the 12 floating Alebrije creatures and learn more about our project!`, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[
        { text: '🌐 Open Website', url: config.ALBJ_WEBSITE_URL }
      ]]
    }
  });
});

// Whitepaper command
bot.onText(/\/whitepaper/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `📄 **ALBJ Token Whitepaper**\n\nDownload our comprehensive whitepaper to learn about:\n\n• Project vision and roadmap\n• Tokenomics and distribution\n• Technical implementation\n• Alebrije spirit creatures\n• Cultural inspiration`, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[
        { text: '📄 Download Whitepaper', url: `${config.ALBJ_WEBSITE_URL}/whitepaper.pdf` }
      ]]
    }
  });
});

// Launch information command
bot.onText(/\/launch/, (msg) => {
  const chatId = msg.chat.id;
  
  // Calculate days until launch (June 12, 2025)
  const launchDate = new Date('2025-06-12T00:00:00Z');
  const now = new Date();
  const timeDiff = launchDate.getTime() - now.getTime();
  const daysUntilLaunch = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  const launchMessage = `🗓️ **ALBJ Token Launch**

**Launch Date**: June 12, 2025
**Days Remaining**: ${daysUntilLaunch} days

**What happens at launch:**
🔥 50% token burn (4.5B tokens destroyed)
💧 Liquidity pool creation
🎁 Community airdrops begin
📈 Trading starts on DEXs

**Countdown is live on our website!**`;

  bot.sendMessage(chatId, launchMessage, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[
        { text: '⏰ View Live Countdown', url: config.ALBJ_WEBSITE_URL }
      ]]
    }
  });
});

// Tokenomics command
bot.onText(/\/tokenomics/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, config.TOKEN_INFO, { parse_mode: 'Markdown' });
});

// Social links command
bot.onText(/\/social/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, config.SOCIAL_LINKS, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🐦 Twitter/X', url: 'https://twitter.com/ALBJToken' },
          { text: '🎮 Discord', url: 'https://discord.gg/vrBnKB68' }
        ],
        [
          { text: '👩‍💻 GitHub', url: 'https://github.com/AlebrijeLabs' },
          { text: '🌐 Website', url: config.ALBJ_WEBSITE_URL }
        ]
      ]
    }
  });
});

// Price command (disabled until launch)
bot.onText(/\/price/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `📊 **ALBJ Price Check**

⚠️ ALBJ token has not launched yet!

**Launch Date**: June 12, 2025

Price tracking will be available after launch. Stay tuned! 🚀`, {
    parse_mode: 'Markdown'
  });
});

// Handle callback queries from inline keyboards
bot.on('callback_query', (callbackQuery) => {
  const message = callbackQuery.message;
  const chatId = message.chat.id;
  const data = callbackQuery.data;

  switch (data) {
    case 'token_info':
      bot.sendMessage(chatId, config.TOKEN_INFO, { parse_mode: 'Markdown' });
      break;
    
    case 'launch_info':
      // Reuse launch command logic
      const launchDate = new Date('2025-06-12T00:00:00Z');
      const now = new Date();
      const timeDiff = launchDate.getTime() - now.getTime();
      const daysUntilLaunch = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      bot.sendMessage(chatId, `🗓️ **Launch Countdown**\n\n**${daysUntilLaunch} days** until ALBJ Token launches!\n\n**Date**: June 12, 2025\n**Time**: 00:00 UTC`, {
        parse_mode: 'Markdown'
      });
      break;
    
    case 'social_links':
      bot.sendMessage(chatId, config.SOCIAL_LINKS, { parse_mode: 'Markdown' });
      break;
    
    case 'help':
      bot.sendMessage(chatId, config.HELP_MESSAGE, { parse_mode: 'Markdown' });
      break;
  }

  // Answer the callback query
  bot.answerCallbackQuery(callbackQuery.id);
});

// Handle errors
bot.on('error', (error) => {
  console.error('Bot error:', error);
});

// Log when bot is ready
bot.getMe().then((botInfo) => {
  console.log(`✅ Bot @${botInfo.username} is running!`);
  console.log(`🔗 Bot URL: https://t.me/${botInfo.username}`);
  console.log('🎭 ALBJ Token Bot is ready to serve the community!');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down ALBJ Token Bot...');
  bot.stopPolling();
  process.exit(0);
}); 