import TelegramBot, { Message } from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

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

// Add debug logging at the start
console.log('Starting ALBJ Token Telegram bot...');
console.log('Loading environment variables...');
console.log('Bot token length:', token?.length || 0);
console.log('Channel IDs loaded:', Object.keys(channelIds).length);

// Initialize bot with debug logging
console.log('Initializing bot...');
const bot = new TelegramBot(token, { polling: true });
console.log('Bot initialized successfully');

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
             '• Discord: [Join our community]\n' +
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
             '• Discord: [Join our community]\n' +
             '• Telegram: [Coming Soon]\n\n' +
             'Our team will assist you as soon as possible! 🙏'
  }
};

// Add image handling for Alebrije creatures
type AlebrijeName = 'Dragon-Jaguar' | 'Owl-Serpent' | 'Fox-Butterfly' | 'Frog-Hummingbird' | 
  'Eagle-Lizard' | 'Wolf-Fish' | 'Turtle-Bat' | 'Snake-Quetzal' | 'Horse-Phoenix' | 
  'Cat-Chameleon' | 'Sheet-Coyote' | 'Crab-Dragonfly';

// Define base path for images
const basePath = '/Users/rastavo/alebrije-project/bot/telegram-bot/images';
console.log('Base path for images:', basePath);

const alebrijeImages: Record<AlebrijeName, string> = {
  'Dragon-Jaguar': path.join(basePath, 'Dragon-Jaguar.png'),
  'Owl-Serpent': path.join(basePath, 'Owl-Serpent.png'),
  'Fox-Butterfly': path.join(basePath, 'Fox-Butterfly.png'),
  'Frog-Hummingbird': path.join(basePath, 'Frog-Hummingbird.png'),
  'Eagle-Lizard': path.join(basePath, 'Eagle-Lizard.png'),
  'Wolf-Fish': path.join(basePath, 'Wolf-Fish.png'),
  'Turtle-Bat': path.join(basePath, 'Turtle-Bat.png'),
  'Snake-Quetzal': path.join(basePath, 'Snake-Quetzal.png'),
  'Horse-Phoenix': path.join(basePath, 'Horse-Phoenix.png'),
  'Cat-Chameleon': path.join(basePath, 'Cat-Chameleon.png'),
  'Sheet-Coyote': path.join(basePath, 'Sheet-Coyote.png'),
  'Crab-Dragonfly': path.join(basePath, 'Crab-Dragonfly.png')
};

// Function to send Alebrije image
async function sendAlebrijeImage(chatId: number, creatureName: string) {
  // Convert input to match the format in our type (e.g., "cat-chameleon" -> "Cat-Chameleon")
  const normalizedName = creatureName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('-') as AlebrijeName;
    
  console.log('Attempting to send image for:', normalizedName);
  const imagePath = path.join(basePath, `${normalizedName}.png`);
  console.log('Image path:', imagePath);
  console.log('Full path exists:', fs.existsSync(imagePath));
  
  try {
    if (fs.existsSync(imagePath)) {
      console.log('File exists, reading file...');
      const photoBuffer = fs.readFileSync(imagePath);
      console.log('File read successfully, sending photo...');
      await bot.sendPhoto(chatId, photoBuffer, {
        caption: `🎨 Here's the ${normalizedName} Alebrije!`
      });
      console.log('Photo sent successfully!');
    } else {
      console.log('Image not found at path:', imagePath);
      bot.sendMessage(chatId, `The image for ${normalizedName} is not available yet. Stay tuned for updates!`);
    }
  } catch (error) {
    console.error(`Error sending image for ${normalizedName}:`, error);
    bot.sendMessage(chatId, `Sorry, I couldn't send the image for ${normalizedName}. Please try again later.`);
  }
}

// Add command to view specific Alebrije
bot.onText(/\/alebrije (.+)/, (msg: Message, match: RegExpExecArray | null) => {
  if (!match) return;
  const chatId = msg.chat.id;
  const creatureName = match[1].trim();
  sendAlebrijeImage(chatId, creatureName);
});

// Update spirits command to include image viewing
bot.onText(/\/spirits/, (msg: Message) => {
  const chatId = msg.chat.id;
  const spiritsMessage = 
    `🎨 *ALBJ Spirit/Mood Themes*\n\n` +
    `*Alebrije Creatures & Their Themes:*\n\n` +
    `*1. Dragon-Jaguar* 🐉\n` +
    `• Theme: Strength & Courage\n` +
    `• Design: Red, fiery design\n` +
    `• Spirit: Powerful and fearless\n` +
    `• View: /alebrije dragon-jaguar\n\n` +
    `*2. Owl-Serpent* 🦉\n` +
    `• Theme: Wisdom & Reflection\n` +
    `• Design: Deep blue with silver feathers\n` +
    `• Spirit: Contemplative and insightful\n` +
    `• View: /alebrije owl-serpent\n\n` +
    `*3. Fox-Butterfly* 🦊\n` +
    `• Theme: Playfulness & Curiosity\n` +
    `• Design: Orange and pink glowing wings\n` +
    `• Spirit: Energetic and inquisitive\n` +
    `• View: /alebrije fox-butterfly\n\n` +
    `*4. Frog-Hummingbird* 🐸\n` +
    `• Theme: Joy & Celebration\n` +
    `• Design: Bright green with rainbow sparkles\n` +
    `• Spirit: Cheerful and vibrant\n` +
    `• View: /alebrije frog-hummingbird\n\n` +
    `*5. Eagle-Lizard* 🦅\n` +
    `• Theme: Freedom & Vision\n` +
    `• Design: Golden body with scale patterns\n` +
    `• Spirit: Soaring and perceptive\n` +
    `• View: /alebrije eagle-lizard\n\n` +
    `*6. Wolf-Fish* 🐺\n` +
    `• Theme: Loyalty & Persistence\n` +
    `• Design: Midnight blue with water ripple effects\n` +
    `• Spirit: Steadfast and flowing\n` +
    `• View: /alebrije wolf-fish\n\n` +
    `*7. Turtle-Bat* 🐢\n` +
    `• Theme: Patience & Protection\n` +
    `• Design: Earth tones with mystical runes\n` +
    `• Spirit: Grounded and watchful\n` +
    `• View: /alebrije turtle-bat\n\n` +
    `*8. Snake-Quetzal* 🐍\n` +
    `• Theme: Transformation & Growth\n` +
    `• Design: Emerald green with feathered wings\n` +
    `• Spirit: Evolving and majestic\n` +
    `• View: /alebrije snake-quetzal\n\n` +
    `*9. Horse-Phoenix* 🐎\n` +
    `• Theme: Passion & Drive\n` +
    `• Design: Crimson and gold flames\n` +
    `• Spirit: Fiery and determined\n` +
    `• View: /alebrije horse-phoenix\n\n` +
    `*10. Cat-Chameleon* 🐈\n` +
    `• Theme: Adaptability & Cleverness\n` +
    `• Design: Purple shifting colors\n` +
    `• Spirit: Versatile and cunning\n` +
    `• View: /alebrije cat-chameleon\n\n` +
    `*11. Sheep-Coyote* 🐑\n` +
    `• Theme: Innocence & Mischief\n` +
    `• Design: White with colorful tails\n` +
    `• Spirit: Pure and playful\n` +
    `• View: /alebrije sheep-coyote\n\n` +
    `*12. Crab-Dragonfly* 🦀\n` +
    `• Theme: Balance & Defense\n` +
    `• Design: Cyan with armored wings\n` +
    `• Spirit: Protective and harmonious\n` +
    `• View: /alebrije crab-dragonfly\n\n` +
    `Each Alebrije represents a unique combination of traits and energies in the ALBJ ecosystem. Which creature resonates with your spirit? 🎭\n\n` +
    `Use /alebrije [creature-name] to view each creature's image!\n` +
    `Example: /alebrije dragon-jaguar\n\n` +
    `Type /nft to learn about our NFT collection featuring these magical creatures!`;
  bot.sendMessage(chatId, spiritsMessage, { parse_mode: 'Markdown' });
});

// Function to populate channels
async function populateChannels() {
  console.log('Starting to populate channels...');
  
  for (const [channelName, content] of Object.entries(channelContent)) {
    console.log(`Attempting to populate channel: ${channelName}`);
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
bot.onText(/\/start/, (msg: Message) => {
  const chatId = msg.chat.id;
  const userName = msg.from?.first_name || 'there';
  bot.sendMessage(chatId, 
    `👋 Hello ${userName}! Welcome to the ALBJ Token community!\n\n` +
    `I'm your friendly guide to everything ALBJ. I can help you with:\n` +
    `• Token information 📊\n` +
    `• NFT collection details 🎨\n` +
    `• Community events 🎉\n` +
    `• Support and help 🆘\n\n` +
    `Just type /help to see all the things I can do!\n\n` +
    `Did you know? ALBJ Token is inspired by the vibrant Alebrije art from Mexico! 🎨✨`
  );
});

// Add more fun facts
const funFacts = [
  "Did you know? ALBJ Token is named after Alebrijes, the colorful Mexican folk art sculptures that represent spirit animals! 🎨",
  "Fun fact: Our NFT collection will feature unique Alebrije-inspired designs, each telling its own story! 🦊",
  "Interesting: ALBJ Token's launch date (VI·XII·MMXXV) is written in Roman numerals, adding a touch of ancient wisdom! 📜",
  "Did you know? Our community events include a special 'Design Your Alebrije Spirit' contest with amazing prizes! 🎯",
  "Fun fact: ALBJ Token combines traditional art with modern blockchain technology! 🌟",
  "Did you know? Alebrijes were first created by Pedro Linares in 1936 after a fever dream! 🎭",
  "Fun fact: Each Alebrije is unique, just like our ALBJ Token holders! 🎨",
  "Interesting: The word 'Alebrije' comes from the Spanish word 'alegría' meaning joy! 😊",
  "Did you know? Our token's design incorporates elements from ancient Mexican art! 🏺",
  "Fun fact: ALBJ Token's community is as diverse as the colors in an Alebrije! 🌈",
  "Interesting: The first Alebrijes were made from papier-mâché, but ours are digital masterpieces! 💫",
  "Did you know? Our NFT collection will feature both traditional and modern Alebrije designs! 🎯"
];

// Add social media links
const socialLinks = {
  twitter: "https://twitter.com/ALBJToken",
  discord: "https://discord.gg/alebrije",
  telegram: "https://t.me/AlebrijeToken",
  website: "https://albj.io",
  instagram: "https://instagram.com/albjtoken"
};

// Add new commands
bot.onText(/\/social/, (msg: Message) => {
  const chatId = msg.chat.id;
  const socialMessage = 
    `🌟 *Connect with ALBJ Token!*\n\n` +
    `*Official Social Media Links:*\n` +
    `• Twitter: [@ALBJToken](${socialLinks.twitter}) 🐦\n` +
    `• Discord: [Join our community](${socialLinks.discord}) 🎮\n` +
    `• Telegram: [Official Channel](${socialLinks.telegram}) 📱\n` +
    `• Instagram: [@albjtoken](${socialLinks.instagram}) 📸\n` +
    `• Website: [albj.io](${socialLinks.website}) 🌐\n\n` +
    `Stay connected for the latest updates and community events! 🚀`;
  bot.sendMessage(chatId, socialMessage, { parse_mode: 'Markdown', disable_web_page_preview: true });
});

bot.onText(/\/roadmap/, (msg: Message) => {
  const chatId = msg.chat.id;
  const roadmapMessage = 
    `🗺️ *ALBJ Token Roadmap*\n\n` +
    `*Phase 1: Foundation* 🏗️\n` +
    `• Token launch on Solana\n` +
    `• Community building\n` +
    `• Website launch\n` +
    `• Social media presence\n\n` +
    `*Phase 2: Growth* 📈\n` +
    `• NFT collection launch\n` +
    `• Community events\n` +
    `• Partnership announcements\n` +
    `• Exchange listings\n\n` +
    `*Phase 3: Expansion* 🌟\n` +
    `• Advanced NFT features\n` +
    `• Global community events\n` +
    `• Major partnerships\n` +
    `• Ecosystem development\n\n` +
    `Stay tuned for more updates! 🚀`;
  bot.sendMessage(chatId, roadmapMessage, { parse_mode: 'Markdown' });
});

bot.onText(/\/team/, (msg: Message) => {
  const chatId = msg.chat.id;
  const teamMessage = 
    `👥 *Meet the ALBJ Team*\n\n` +
    `*Core Team:*\n` +
    `• Founder & CEO - Visionary leader\n` +
    `• CTO - Blockchain expert\n` +
    `• Art Director - Creative genius\n` +
    `• Community Manager - Community builder\n\n` +
    `*Advisors:*\n` +
    `• Blockchain experts\n` +
    `• Art industry leaders\n` +
    `• Marketing specialists\n\n` +
    `*Community Team:*\n` +
    `• Moderators\n` +
    `• Content creators\n` +
    `• Event organizers\n\n` +
    `Join our team! Type /careers for opportunities. 🌟`;
  bot.sendMessage(chatId, teamMessage, { parse_mode: 'Markdown' });
});

bot.onText(/\/careers/, (msg: Message) => {
  const chatId = msg.chat.id;
  const careersMessage = 
    `💼 *Join the ALBJ Team!*\n\n` +
    `*Current Openings:*\n` +
    `• Community Moderators\n` +
    `• Content Creators\n` +
    `• Social Media Managers\n` +
    `• NFT Artists\n\n` +
    `*Benefits:*\n` +
    `• Work with a creative team\n` +
    `• Flexible hours\n` +
    `• Token rewards\n` +
    `• Growth opportunities\n\n` +
    `*How to Apply:*\n` +
    `Send your resume to careers@albj.io\n\n` +
    `Join us in building the future of art and blockchain! 🚀`;
  bot.sendMessage(chatId, careersMessage, { parse_mode: 'Markdown' });
});

// Add interactive quiz command
bot.onText(/\/quiz/, (msg: Message) => {
  const chatId = msg.chat.id;
  const quizMessage = 
    `🎯 *ALBJ Knowledge Quiz*\n\n` +
    `Test your knowledge about ALBJ Token!\n\n` +
    `*Question 1:* What does ALBJ stand for?\n` +
    `A) Art Love Blockchain Joy\n` +
    `B) Alebrije\n` +
    `C) Always Love Beautiful Journeys\n` +
    `D) Art Life Blockchain Journey\n\n` +
    `Reply with your answer (A, B, C, or D)!`;
  bot.sendMessage(chatId, quizMessage, { parse_mode: 'Markdown' });
});

// Add price alert command
bot.onText(/\/pricealert/, (msg: Message) => {
  const chatId = msg.chat.id;
  const priceAlertMessage = 
    `💰 *Set Price Alert*\n\n` +
    `Get notified when ALBJ reaches your target price!\n\n` +
    `*Current Price:* $0.0001\n\n` +
    `Reply with your target price to set an alert.\n` +
    `Example: 0.0002`;
  bot.sendMessage(chatId, priceAlertMessage, { parse_mode: 'Markdown' });
});

// Add meme command
bot.onText(/\/meme/, (msg: Message) => {
  const chatId = msg.chat.id;
  const memes = [
    "🚀 To the moon!",
    "💎 Diamond hands!",
    "🎨 When your NFT sells for 100x",
    "🌙 When you buy the dip",
    "🎯 When you hit your price target"
  ];
  const randomMeme = memes[Math.floor(Math.random() * memes.length)];
  bot.sendMessage(chatId, randomMeme);
});

// Add countdown command
bot.onText(/\/countdown/, (msg: Message) => {
  const chatId = msg.chat.id;
  const launchDate = new Date('2025-06-12');
  const now = new Date();
  const diff = launchDate.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  const countdownMessage = 
    `⏳ *ALBJ Token Launch Countdown*\n\n` +
    `*Launch Date:* June 12, 2025\n` +
    `*Days Remaining:* ${days} days\n\n` +
    `Get ready for the most colorful token launch! 🎨`;
  bot.sendMessage(chatId, countdownMessage, { parse_mode: 'Markdown' });
});

// Update help message to include spirits command
bot.onText(/\/help/, (msg: Message) => {
  const chatId = msg.chat.id;
  const helpMessage = 
    `🌟 *Here's how I can help you!*\n\n` +
    `*Basic Commands:*\n` +
    `/start - Get a warm welcome\n` +
    `/help - Show this help message\n` +
    `/hello - Get a friendly greeting\n` +
    `/funfact - Learn something interesting about ALBJ\n\n` +
    `*Token Information:*\n` +
    `/info - Show token details\n` +
    `/price - Check current token price\n` +
    `/holders - See number of token holders\n` +
    `/roadmap - View project roadmap\n` +
    `/countdown - See launch countdown\n` +
    `/launch - Get launch information\n` +
    `/tokenomics - Detailed tokenomics information\n\n` +
    `*NFT & Community:*\n` +
    `/nft - Show NFT collection preview\n` +
    `/spirits - View ALBJ Spirit Themes\n` +
    `/events - Show upcoming events\n` +
    `/community - Learn about our community\n` +
    `/team - Meet the team\n` +
    `/careers - View job opportunities\n` +
    `/culture - Learn about our cultural heritage\n\n` +
    `*Support:*\n` +
    `/support - Get help and support\n` +
    `/faq - View frequently asked questions\n\n` +
    `*Social Media:*\n` +
    `/social - Get social media links\n\n` +
    `*Fun Stuff:*\n` +
    `/quote - Get an inspiring quote\n` +
    `/joke - Hear a crypto-themed joke\n` +
    `/meme - Get a crypto meme\n` +
    `/quiz - Test your ALBJ knowledge\n\n` +
    `*Tools:*\n` +
    `/pricealert - Set price alerts\n\n` +
    `Need something else? Just ask me! 😊`;
  bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
});

bot.onText(/\/hello/, (msg: Message) => {
  const chatId = msg.chat.id;
  const userName = msg.from?.first_name || 'there';
  const greetings = [
    `👋 Hey ${userName}! How's your day going?`,
    `🌟 Hello ${userName}! Ready to explore the world of ALBJ?`,
    `✨ Hi ${userName}! Great to see you here!`,
    `🎨 Welcome back ${userName}! Let's create something amazing together!`
  ];
  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
  bot.sendMessage(chatId, randomGreeting);
});

bot.onText(/\/funfact/, (msg: Message) => {
  const chatId = msg.chat.id;
  const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
  bot.sendMessage(chatId, randomFact);
});

bot.onText(/\/quote/, (msg: Message) => {
  const chatId = msg.chat.id;
  const quotes = [
    "🌟 'The best way to predict the future is to create it.' - Peter Drucker",
    "🎨 'Art is not what you see, but what you make others see.' - Edgar Degas",
    "💫 'Innovation distinguishes between a leader and a follower.' - Steve Jobs",
    "✨ 'The only way to do great work is to love what you do.' - Steve Jobs",
    "🌠 'Creativity is intelligence having fun.' - Albert Einstein"
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  bot.sendMessage(chatId, randomQuote);
});

bot.onText(/\/joke/, (msg: Message) => {
  const chatId = msg.chat.id;
  const jokes = [
    "Why did the blockchain developer go broke? Because he used up all his cache! 😄",
    "What do you call a crypto investor who's always optimistic? A HODLer! 🚀",
    "Why did the NFT artist go to the doctor? Because he had too many tokens! 🎨",
    "What's a blockchain's favorite dance? The Hash! 💃",
    "Why did the smart contract go to therapy? It had too many issues to resolve! 🤖"
  ];
  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
  bot.sendMessage(chatId, randomJoke);
});

bot.onText(/\/community/, (msg: Message) => {
  const chatId = msg.chat.id;
  const communityMessage = 
    `🌟 *Welcome to the ALBJ Community!*\n\n` +
    `We're a vibrant group of art lovers, crypto enthusiasts, and creative minds!\n\n` +
    `*What makes our community special:*\n` +
    `• Regular community events and contests 🎯\n` +
    `• Exclusive NFT previews and giveaways 🎨\n` +
    `• Active discussions about art and technology 💭\n` +
    `• Supportive and friendly environment 🤝\n\n` +
    `*Join our events:*\n` +
    `• Weekly AMAs with the team 🎤\n` +
    `• Art workshops and tutorials 🖌️\n` +
    `• Community challenges and rewards 🏆\n\n` +
    `Type /events to see what's coming up next!\n\n` +
    `Remember: Together, we're not just building a token - we're creating a movement! 🌈`;
  bot.sendMessage(chatId, communityMessage, { parse_mode: 'Markdown' });
});

bot.onText(/\/faq/, (msg: Message) => {
  const chatId = msg.chat.id;
  const faqMessage = 
    `❓ *Frequently Asked Questions About ALBJ*\n\n` +
    `*General Questions:*\n\n` +
    `*Q: What is ALBJ Token?*\n` +
    `A: ALBJ is a culturally inspired meme coin that fuses global folklore, ancestral traditions, dream-world symbology, and decentralized finance. It draws inspiration from spirit-creatures across different cultures, from Greek Chimera to Mexican Alebrijes.\n\n` +
    `*Q: What makes ALBJ unique?*\n` +
    `A: ALBJ uniquely combines ancient cultural archetypes with modern blockchain technology, serving as a bridge between humanity's timeless myths and the future of Web3. It's not just a token, but a modern spirit guide for the digital age.\n\n` +
    `*Q: When is the token launching?*\n` +
    `A: June 12, 2025 (VI·XII·MMXXV)\n\n` +
    `*Token Information:*\n\n` +
    `*Q: What is the total supply of ALBJ?*\n` +
    `A: 9,000,000,000 ALBJ tokens\n\n` +
    `*Q: What is the max wallet limit?*\n` +
    `A: 2% of total supply\n\n` +
    `*Q: What is the transaction tax?*\n` +
    `A: 5% total tax:\n` +
    `• 3% Liquidity\n` +
    `• 1% Marketing\n` +
    `• 1% Charity\n` +
    `• 1% Burn\n\n` +
    `*Q: How is the token distributed?*\n` +
    `A: Distribution:\n` +
    `• 50% Burn\n` +
    `• 20% Liquidity\n` +
    `• 10% Airdrops\n` +
    `• 10% Marketing\n` +
    `• 5% Ecosystem\n` +
    `• 5% Founders (Locked)\n\n` +
    `*NFT & Community:*\n\n` +
    `*Q: What is the NFT collection about?*\n` +
    `A: Our NFT collection features unique Alebrije-inspired designs, combining elements from various global cultures. Each NFT tells its own story and offers special utilities.\n\n` +
    `*Q: How can I participate in community events?*\n` +
    `A: Join our channels and stay active! We host regular AMAs, trading competitions, NFT giveaways, and community challenges. Type /events to see what's coming up!\n\n` +
    `*Q: What is the "Design Your Alebrije Spirit" contest?*\n` +
    `A: A special community event where members can create their own Alebrije-inspired designs. The winner receives 100,000 $ALBJ tokens!\n\n` +
    `*Technical Questions:*\n\n` +
    `*Q: Which blockchain is ALBJ on?*\n` +
    `A: ALBJ is built on the Solana blockchain, known for its speed and low transaction costs.\n\n` +
    `*Q: How can I buy ALBJ?*\n` +
    `A: Trading will begin after launch. Stay tuned to our announcements channel for trading pair information.\n\n` +
    `*Q: How can I get support?*\n` +
    `A: Type /support for assistance, or ask your question directly in the support channel.\n\n` +
    `Need more information? Try these commands:\n` +
    `• /info - Detailed token information\n` +
    `• /roadmap - Project roadmap\n` +
    `• /social - Connect with us`;
  bot.sendMessage(chatId, faqMessage, { parse_mode: 'Markdown' });
});