import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

// Initialize bot
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error('❌ TELEGRAM_BOT_TOKEN not found in environment variables');
  process.exit(1);
}

// Channel IDs
const channelIds = {
  announcements: process.env.ANNOUNCEMENTS_CHANNEL_ID,
  rules: process.env.RULES_CHANNEL_ID,
  tokenInfo: process.env.TOKEN_INFO_CHANNEL_ID,
  nftPreview: process.env.NFT_PREVIEW_CHANNEL_ID,
  communityEvents: process.env.COMMUNITY_EVENTS_CHANNEL_ID,
  support: process.env.SUPPORT_CHANNEL_ID
};

// Verify channel IDs
Object.entries(channelIds).forEach(([key, value]) => {
  if (!value) {
    console.error(`❌ ${key.toUpperCase()}_CHANNEL_ID not found in environment variables`);
    process.exit(1);
  }
});

const bot = new TelegramBot(token, { polling: true });

// Channel content
const channelContent = {
  'announcements': {
    title: '📢 ALBJ Token Official Announcements',
    description: 'Official announcements and updates about ALBJ Token',
    message: '📢 **Welcome to ALBJ Token Official Announcements**\n\n' +
             'This channel is where we\'ll post important updates about:\n' +
             '• Token launches\n' +
             '• Partnership announcements\n' +
             '• Major milestones\n' +
             '• Community events\n\n' +
             'Launch Date: June 12, 2025 (VI·XII·MMXXV)\n' +
             'Stay tuned for exciting news! 🚀'
  },
  'rules': {
    title: '📜 ALBJ Token Community Rules',
    description: 'Community guidelines and rules',
    message: '📜 **ALBJ Token Community Rules**\n\n' +
             '1. **Be Respectful**\n' +
             '   • No harassment, hate speech, or discrimination\n' +
             '   • Respect all community members\n\n' +
             '2. **No Spam**\n' +
             '   • No excessive posting\n' +
             '   • No repetitive messages\n' +
             '   • No unauthorized advertising\n\n' +
             '3. **Stay On Topic**\n' +
             '   • Keep discussions relevant to ALBJ Token\n' +
             '   • Use appropriate channels for different topics\n\n' +
             '4. **No Financial Advice**\n' +
             '   • Do not give financial advice\n' +
             '   • Always DYOR (Do Your Own Research)\n\n' +
             '5. **No Scams**\n' +
             '   • No phishing attempts\n' +
             '   • No fake giveaways\n' +
             '   • No impersonation of team members\n\n' +
             'Violation of these rules may result in a warning or ban.\n' +
             'Thank you for helping us maintain a positive community! 🙏'
  },
  'token-info': {
    title: '💎 ALBJ Token Information',
    description: 'Token specifications and distribution details',
    message: '💎 **ALBJ Token Information**\n\n' +
             '**Token Name:** ALBJ Token\n' +
             '**Symbol:** ALBJ\n' +
             '**Network:** Solana\n' +
             '**Total Supply:** 9,000,000,000 ALBJ\n' +
             '**Max Wallet Limit:** 2% of supply\n\n' +
             '**Transaction Tax:** 5%\n' +
             '• 3% Liquidity\n' +
             '• 1% Marketing\n' +
             '• 1% Charity\n' +
             '• 1% Burn\n\n' +
             '**Token Distribution:**\n' +
             '• 50% Burn\n' +
             '• 20% Liquidity\n' +
             '• 10% Airdrops\n' +
             '• 10% Marketing\n' +
             '• 5% Ecosystem\n' +
             '• 5% Founders (Locked)\n\n' +
             '**Useful Links:**\n' +
             '• Website: [Coming Soon]\n' +
             '• Twitter: [@ALBJToken]\n' +
             '• Telegram: [Coming Soon]\n\n' +
             'Stay tuned for more information! 🚀'
  },
  'nft-preview': {
    title: '🎨 ALBJ NFT Collection Preview',
    description: 'Preview of upcoming NFT collection',
    message: '🎨 **ALBJ NFT Collection Preview**\n\n' +
             'Coming soon: Our exclusive NFT collection featuring unique Alebrije-inspired designs!\n\n' +
             '**Collection Highlights:**\n' +
             '• Unique handcrafted designs inspired by global and ancient cultures\n' +
             '• Limited edition pieces with special utilities\n' +
             '• Each NFT tells a unique story\n' +
             '• Special benefits for holders\n\n' +
             '**Launch Timeline:**\n' +
             '• Preview images: Coming soon\n' +
             '• Minting details: TBA\n' +
             '• Collection launch: TBA\n\n' +
             'Join our community events for exclusive previews!\n' +
             'Stay tuned for updates! 🎉'
  },
  'community-events': {
    title: '🎉 ALBJ Community Events',
    description: 'Community events and contests',
    message: '🎉 **ALBJ Community Events**\n\n' +
             'Welcome to our community events channel! Here you\'ll find:\n\n' +
             '**Upcoming Events:**\n' +
             '• Community AMAs\n' +
             '• Trading competitions\n' +
             '• NFT giveaways\n' +
             '• Community challenges\n' +
             '• Design your Alebrije Spirit contest (Prize: 100,000 $ALBJ)\n\n' +
             '**How to Participate:**\n' +
             '1. Stay active in the community\n' +
             '2. Follow our announcements\n' +
             '3. Join our events\n' +
             '4. Win exciting prizes! 🏆\n\n' +
             'First community event coming soon!'
  },
  'support': {
    title: '🆘 ALBJ Support',
    description: 'Technical support and help',
    message: '🆘 **ALBJ Support Channel**\n\n' +
             'Welcome to our support channel! Here\'s how we can help you:\n\n' +
             '**Common Topics:**\n' +
             '• Token-related questions\n' +
             '• Technical support\n' +
             '• General inquiries\n' +
             '• Wallet setup\n' +
             '• Trading information\n\n' +
             '**How to Get Help:**\n' +
             '1. Check our FAQ in #token-info\n' +
             '2. Ask your question clearly\n' +
             '3. Be patient for a response\n\n' +
             '**Important Links:**\n' +
             '• Website: [Coming Soon]\n' +
             '• Twitter: [@ALBJToken]\n' +
             '• Telegram: [Coming Soon]\n\n' +
             'Our team will assist you as soon as possible! 🙏'
  }
};

// Function to populate channels
async function populateChannels() {
  console.log('Starting to populate channels...');
  
  for (const [channelName, content] of Object.entries(channelContent)) {
    const channelId = channelIds[channelName as keyof typeof channelIds];
    if (!channelId) {
      console.error(`❌ Channel ID not found for ${channelName}`);
      continue;
    }

    try {
      // Send the message to the channel
      await bot.sendMessage(channelId, content.message, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true
      });
      console.log(`✅ Populated #${channelName}`);
    } catch (error) {
      console.error(`❌ Error populating #${channelName}:`, error);
    }
  }
}

// Command handlers
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to ALBJ Token Bot! Use /help to see available commands.');
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpMessage = 'Available commands:\n' +
                     '/start - Start the bot\n' +
                     '/help - Show this help message\n' +
                     '/info - Show token information\n' +
                     '/nft - Show NFT collection preview\n' +
                     '/events - Show upcoming events\n' +
                     '/support - Get support information';
  bot.sendMessage(chatId, helpMessage);
});

bot.onText(/\/info/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, channelContent['token-info'].message, { parse_mode: 'Markdown' });
});

bot.onText(/\/nft/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, channelContent['nft-preview'].message, { parse_mode: 'Markdown' });
});

bot.onText(/\/events/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, channelContent['community-events'].message, { parse_mode: 'Markdown' });
});

bot.onText(/\/support/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, channelContent['support'].message, { parse_mode: 'Markdown' });
});

// Error handling
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

// Start the bot and populate channels
console.log('Starting ALBJ Token Telegram bot...');
bot.once('ready', () => {
  console.log('Bot is ready!');
  populateChannels();
}); 