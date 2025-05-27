import { Client, GatewayIntentBits, Events, ChannelType, TextChannel, EmbedBuilder, GuildMember, Message, PermissionFlagsBits, Role } from 'discord.js';
import dotenv from 'dotenv';
import path from 'path';
import axios from 'axios';

// Load environment variables
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

// Initialize bot
const token = process.env.DISCORD_BOT_TOKEN;
if (!token) {
  console.error('❌ DISCORD_BOT_TOKEN not found in environment variables');
  process.exit(1);
}

// Create Discord client with all necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildModeration
  ]
});

// Store for moderation warnings and mutes
const warnings = new Map<string, number>();
const mutes = new Map<string, number>();

// Fun content arrays
const memes = [
  'https://example.com/meme1.jpg',
  'https://example.com/meme2.jpg',
  // Add more meme URLs
];

const quotes = [
  "The spirit of Alebrijes guides us through the blockchain realm.",
  "In the multiverse of DeFi, ALBJ is your spirit guide.",
  "Every Alebrije is unique, just like every ALBJ holder.",
  "From ancient traditions to modern blockchain, ALBJ bridges worlds.",
  "In the realm of crypto, ALBJ is your spirit companion.",
  // Add more quotes
];

const facts = [
  "Alebrijes were first created by Pedro Linares in 1936.",
  "Each Alebrije is unique, just like every ALBJ holder.",
  "Alebrijes are believed to protect homes and guide spirits.",
  "The word 'Alebrije' comes from the Spanish word 'alegría' meaning joy.",
  "Traditional Alebrijes are made from copal wood and painted with natural pigments.",
  // Add more facts
];

// Color scheme for embeds
const COLORS = {
  PRIMARY: 0xFF6B6B,    // Main color for important messages
  SUCCESS: 0x00FF00,    // Green for positive/success messages
  INFO: 0x7289DA,       // Blue for information
  WARNING: 0xFFD700,    // Gold for warnings
  ERROR: 0xFF0000,      // Red for errors
  SECONDARY: 0x9B59B6,  // Purple for secondary information
  NEUTRAL: 0x95A5A6     // Gray for neutral information
};

// Auto-post price updates to Twitter
async function postPriceUpdate() {
  try {
    const price = await getALBJPrice();
    const tweet = `📊 ALBJ Token Price Update\n\nCurrent Price: $${price}\n\n#ALBJToken #Crypto #Solana`;
  } catch (error) {
    console.error('Error posting price update to Twitter:', error);
  }
}

// Post announcements to Twitter
async function postAnnouncement(content: string) {
  try {
    const tweet = `${content}\n\n#ALBJToken #Crypto #Solana`;
  } catch (error) {
    console.error('Error posting announcement to Twitter:', error);
  }
}

// Add error handling
client.on('error', error => {
  console.error('Discord client error:', error);
});

client.on('warn', warning => {
  console.warn('Discord client warning:', warning);
});

// Add connection status logging
client.on('disconnect', () => {
  console.log('Bot disconnected from Discord');
});

client.on('reconnecting', () => {
  console.log('Bot attempting to reconnect to Discord...');
});

// Welcome system
client.on(Events.GuildMemberAdd, async (member: GuildMember) => {
  const welcomeChannel = member.guild.channels.cache.find(
    channel => channel.type === ChannelType.GuildText && channel.name === 'welcome'
  ) as TextChannel;

  if (welcomeChannel) {
    const welcomeEmbed = new EmbedBuilder()
      .setColor(COLORS.PRIMARY)
      .setTitle('🌟 Welcome to ALBJ Token! 🌟')
      .setDescription(`Welcome ${member} to our vibrant community! We're excited to have you join us on this journey.`)
      .addFields(
        { 
          name: '📚 Quick Start Guide',
          value: '• Read our rules in #rules\n• Introduce yourself in #introductions\n• Check #announcements for updates\n• Join discussions in #general'
        },
        {
          name: '🎯 Popular Commands',
          value: '• `!help` - View all commands\n• `!info` - Token information\n• `!roadmap` - Project roadmap\n• `!social` - Social media links'
        },
        {
          name: '📢 Important Channels',
          value: '• #announcements - Latest updates\n• #price-updates - Token price\n• #support - Get help\n• #community-events - Join events'
        },
        {
          name: '👥 Community Stats',
          value: `• Members: ${member.guild.memberCount}\n• Server Created: ${member.guild.createdAt.toLocaleDateString()}\n• Active Now: ${member.guild.presences.cache.size}`
        }
      )
      .setImage('https://example.com/albj-banner.png') // Add your banner image URL
      .setFooter({ text: 'Remember to read the rules and have fun! 🎉' })
      .setTimestamp();

    await welcomeChannel.send({ embeds: [welcomeEmbed] });
  }

  // Send DM to new member
  try {
    const dmEmbed = new EmbedBuilder()
      .setColor(COLORS.INFO)
      .setTitle('Welcome to ALBJ Token! 🎉')
      .setDescription('Thank you for joining our community! Here are some quick tips to get started:')
      .addFields(
        {
          name: '🎯 First Steps',
          value: '1. Read the rules in #rules\n2. Introduce yourself in #introductions\n3. Check #announcements for updates\n4. Join the conversation in #general'
        },
        {
          name: '📱 Stay Connected',
          value: '• Follow us on Twitter: [@ALBJToken](https://twitter.com/ALBJToken)\n• Join our Telegram: [Official Channel](https://t.me/AlebrijeToken)\n• Visit our website: Coming Soon'
        },
        {
          name: '❓ Need Help?',
          value: '• Use `!help` for all commands\n• Ask in #support\n• DM our moderators'
        }
      )
      .setFooter({ text: 'We\'re glad to have you with us! 🚀' });

    await member.send({ embeds: [dmEmbed] });
  } catch (error) {
    console.log('Could not send DM to new member');
  }

  // Assign default role
  const defaultRole = member.guild.roles.cache.find(role => role.name === 'Member');
  if (defaultRole) {
    await member.roles.add(defaultRole);
  }
});

// Bot ready event
client.once(Events.ClientReady, (readyClient) => {
  console.log(`✅ Bot is ready! Logged in as ${readyClient.user.tag}`);
  
  // Start price update interval
  setInterval(async () => {
    try {
      const price = await getALBJPrice();
      const channel = client.channels.cache.find(
        ch => ch.type === ChannelType.GuildText && ch.name === 'price-updates'
      ) as TextChannel;
      
      if (channel) {
        const priceEmbed = new EmbedBuilder()
          .setColor('#00FF00')
          .setTitle('ALBJ Price Update')
          .setDescription(`Current Price: $${price}`)
          .setTimestamp();
        
        await channel.send({ embeds: [priceEmbed] });
      }
    } catch (error) {
      console.error('Error updating price:', error);
    }
  }, 3600000); // Update every hour
});

// Message command handler
client.on(Events.MessageCreate, async (message: Message) => {
  if (message.author.bot) return;

  // Handle rules channel interactions
  if (message.channel.type === ChannelType.GuildText && message.channel.name === 'rules') {
    const content = message.content.toLowerCase();

    // Handle rule questions
    if (content.includes('rule') || content.includes('rules')) {
      const rulesEmbed = new EmbedBuilder()
        .setColor(COLORS.PRIMARY)
        .setTitle('ALBJ Token Community Rules')
        .setDescription('Please read and follow these rules to maintain a positive community environment.')
        .addFields(
          {
            name: '1️⃣ Be Respectful',
            value: '• No harassment, hate speech, or discrimination\n• Be kind to all community members\n• Respect different opinions and backgrounds'
          },
          {
            name: '2️⃣ No Spam',
            value: '• No excessive messages or repeated content\n• No unauthorized advertising\n• No phishing or scam attempts'
          },
          {
            name: '3️⃣ Stay On Topic',
            value: '• Keep discussions relevant to ALBJ Token\n• Use appropriate channels for different topics\n• No off-topic spam'
          },
          {
            name: '4️⃣ Trading Rules',
            value: '• No price manipulation discussions\n• No financial advice\n• Report suspicious activities to moderators'
          },
          {
            name: '5️⃣ Content Guidelines',
            value: '• No NSFW content\n• No political discussions\n• No controversial topics'
          }
        )
        .setFooter({ text: 'Breaking these rules may result in warnings, mutes, or bans' });

      await message.reply({ embeds: [rulesEmbed] });
      return;
    }

    // Handle specific rule questions
    if (content.includes('spam') || content.includes('advertising')) {
      await message.reply('**Rule #2: No Spam**\n• No excessive messages or repeated content\n• No unauthorized advertising\n• No phishing or scam attempts\n\nViolations may result in warnings or mutes.');
      return;
    }

    if (content.includes('respect') || content.includes('harassment')) {
      await message.reply('**Rule #1: Be Respectful**\n• No harassment, hate speech, or discrimination\n• Be kind to all community members\n• Respect different opinions and backgrounds\n\nViolations may result in immediate action by moderators.');
      return;
    }

    if (content.includes('trading') || content.includes('price')) {
      await message.reply('**Rule #4: Trading Rules**\n• No price manipulation discussions\n• No financial advice\n• Report suspicious activities to moderators\n\nFor price updates, use the #price-updates channel.');
      return;
    }

    if (content.includes('content') || content.includes('nsfw')) {
      await message.reply('**Rule #5: Content Guidelines**\n• No NSFW content\n• No political discussions\n• No controversial topics\n\nKeep the community family-friendly and focused on ALBJ Token.');
      return;
    }

    if (content.includes('topic') || content.includes('channel')) {
      await message.reply('**Rule #3: Stay On Topic**\n• Keep discussions relevant to ALBJ Token\n• Use appropriate channels for different topics\n• No off-topic spam\n\nNeed help finding the right channel? Use `!help` for channel information.');
      return;
    }

    // Handle general questions in rules channel
    if (content.includes('help') || content.includes('how') || content.includes('what')) {
      const helpEmbed = new EmbedBuilder()
        .setColor('#7289DA')
        .setTitle('Rules Channel Help')
        .setDescription('Need help understanding our rules?')
        .addFields(
          {
            name: '📝 How to Use This Channel',
            value: '• Ask about specific rules (e.g., "what are the spam rules?")\n• Use `!help` for all bot commands\n• Contact moderators for rule clarifications'
          },
          {
            name: '🔍 Quick Rule Lookup',
            value: '• Type "spam" for advertising rules\n• Type "respect" for community guidelines\n• Type "trading" for trading rules\n• Type "content" for content guidelines'
          }
        )
        .setFooter({ text: 'Remember: Rules are here to protect our community' });

      await message.reply({ embeds: [helpEmbed] });
      return;
    }
  }

  // Handle greetings and questions in all channels
  const content = message.content.toLowerCase();
  
  // Handle greetings
  const greetings = ['hello', 'hi', 'hey', 'hola', 'greetings'];
  if (greetings.some(greeting => content.includes(greeting))) {
    const welcomeEmbed = new EmbedBuilder()
      .setColor(COLORS.PRIMARY)
      .setTitle(`Welcome ${message.author}! 👋`)
      .setDescription('Welcome to the ALBJ Token community! Here\'s how to get started:')
      .addFields(
        { 
          name: '📚 Quick Start Guide',
          value: '• Use `!help` to see all available commands\n• Use `!info` for token information\n• Use `!whitepaper` to learn about our project\n• Use `!social` for our social media links'
        },
        {
          name: '📢 Important Channels',
          value: '• #announcements - Latest updates\n• #general - Community chat\n• #price-updates - Token price updates\n• #support - Get help from moderators'
        },
        {
          name: '🎯 Popular Commands',
          value: '• `!price` - Check current price\n• `!market` - View market stats\n• `!roadmap` - Project roadmap\n• `!faq` - Frequently asked questions'
        }
      )
      .setFooter({ text: 'Need help? Ask a moderator or use !help for all commands' });
    
    await message.reply({ embeds: [welcomeEmbed] });
    return;
  }

  // Handle "what is albj" questions
  if (content.includes('what is albj') || content.includes('what is alebrije')) {
    const infoEmbed = new EmbedBuilder()
      .setColor(COLORS.INFO)
      .setTitle('What is ALBJ Token?')
      .setDescription('ALBJ is a culturally inspired meme coin that fuses global folklore, ancestral traditions, dream-world symbology, and decentralized finance into a powerful new digital asset.')
      .addFields(
        { name: 'Learn More', value: 'Use `!info` for token details\nUse `!whitepaper` for full information' }
      );
    await message.reply({ embeds: [infoEmbed] });
    return;
  }

  // Handle "how to buy" questions
  if (content.includes('how to buy') || content.includes('where to buy')) {
    const buyEmbed = new EmbedBuilder()
      .setColor(COLORS.SUCCESS)
      .setTitle('How to Buy ALBJ')
      .setDescription('ALBJ Token will be available for purchase at launch!')
      .addFields(
        { name: 'Launch Date', value: 'June 12, 2025 (VI·XII·MMXXV)', inline: true },
        { name: 'Network', value: 'Solana', inline: true },
        { name: 'More Info', value: 'Use `!info` for detailed token information' }
      );
    await message.reply({ embeds: [buyEmbed] });
    return;
  }

  // Handle "when launch" questions
  if (content.includes('when launch') || content.includes('launch date')) {
    const launchEmbed = new EmbedBuilder()
      .setColor(COLORS.WARNING)
      .setTitle('ALBJ Token Launch')
      .setDescription('Mark your calendars! 🗓️')
      .addFields(
        { name: 'Launch Date', value: 'June 12, 2025 (VI·XII·MMXXV)', inline: true },
        { name: 'Network', value: 'Solana', inline: true },
        { name: 'Stay Updated', value: 'Follow our social media for the latest updates!' }
      );
    await message.reply({ embeds: [launchEmbed] });
    return;
  }

  // Handle "social media" questions
  if (content.includes('social') || content.includes('twitter') || content.includes('telegram') || content.includes('discord')) {
    const socialEmbed = new EmbedBuilder()
      .setColor(COLORS.SECONDARY)
      .setTitle('ALBJ Social Media')
      .setDescription('Connect with us!')
      .addFields(
        { name: 'Twitter', value: '[@ALBJToken](https://twitter.com/ALBJToken)', inline: true },
        { name: 'Discord', value: '[Join our community](https://discord.gg/S54a8Y3h)', inline: true },
        { name: 'Telegram', value: '[Official Channel](https://t.me/AlebrijeToken)', inline: true }
      );
    await message.reply({ embeds: [socialEmbed] });
    return;
  }

  // Command prefix
  const prefix = '!';
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift()?.toLowerCase();

  // Moderation commands
  if (command === 'warn' && message.member?.permissions.has(PermissionFlagsBits.ModerateMembers)) {
    const target = message.mentions.members?.first();
    if (!target) {
      return message.reply('Please mention a user to warn.');
    }
    
    const currentWarnings = warnings.get(target.id) || 0;
    warnings.set(target.id, currentWarnings + 1);
    
    const modLogChannel = message.guild?.channels.cache.find(
      ch => ch.type === ChannelType.GuildText && ch.name === 'mod-logs'
    ) as TextChannel;

    if (modLogChannel) {
      const logEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Warning Issued')
        .addFields(
          { name: 'User', value: target.toString(), inline: true },
          { name: 'Moderator', value: message.author.toString(), inline: true },
          { name: 'Total Warnings', value: (currentWarnings + 1).toString(), inline: true }
        )
        .setTimestamp();

      await modLogChannel.send({ embeds: [logEmbed] });
    }
    
    await message.reply(`Warning issued to ${target}. Total warnings: ${currentWarnings + 1}`);
  }

  if (command === 'mute' && message.member?.permissions.has(PermissionFlagsBits.ModerateMembers)) {
    const target = message.mentions.members?.first();
    const duration = parseInt(args[0]) || 10; // Default 10 minutes

    if (!target) {
      return message.reply('Please mention a user to mute.');
    }

    try {
      await target.timeout(duration * 60 * 1000); // Convert minutes to milliseconds
      mutes.set(target.id, Date.now() + duration * 60 * 1000);
      
      const modLogChannel = message.guild?.channels.cache.find(
        ch => ch.type === ChannelType.GuildText && ch.name === 'mod-logs'
      ) as TextChannel;

      if (modLogChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle('User Muted')
          .addFields(
            { name: 'User', value: target.toString(), inline: true },
            { name: 'Moderator', value: message.author.toString(), inline: true },
            { name: 'Duration', value: `${duration} minutes`, inline: true }
          )
          .setTimestamp();

        await modLogChannel.send({ embeds: [logEmbed] });
      }

      await message.reply(`${target} has been muted for ${duration} minutes.`);
    } catch (error) {
      await message.reply('Error muting user.');
    }
  }

  if (command === 'unmute' && message.member?.permissions.has(PermissionFlagsBits.ModerateMembers)) {
    const target = message.mentions.members?.first();

    if (!target) {
      return message.reply('Please mention a user to unmute.');
    }

    try {
      await target.timeout(null);
      mutes.delete(target.id);
      
      const modLogChannel = message.guild?.channels.cache.find(
        ch => ch.type === ChannelType.GuildText && ch.name === 'mod-logs'
      ) as TextChannel;

      if (modLogChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor('#00FF00')
          .setTitle('User Unmuted')
          .addFields(
            { name: 'User', value: target.toString(), inline: true },
            { name: 'Moderator', value: message.author.toString(), inline: true }
          )
          .setTimestamp();

        await modLogChannel.send({ embeds: [logEmbed] });
      }

      await message.reply(`${target} has been unmuted.`);
    } catch (error) {
      await message.reply('Error unmuting user.');
    }
  }

  // Utility commands
  if (command === 'price') {
    try {
      const price = await getALBJPrice();
      const priceEmbed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('ALBJ Price')
        .setDescription(`Current Price: $${price}`)
        .setTimestamp();
      
      await message.reply({ embeds: [priceEmbed] });
    } catch (error) {
      await message.reply('Error fetching price data.');
    }
  }

  if (command === 'market') {
    try {
      const marketData = await getMarketData();
      const marketEmbed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('ALBJ Market Data')
        .addFields(
          { name: '24h Volume', value: `$${marketData.volume24h}`, inline: true },
          { name: 'Market Cap', value: `$${marketData.marketCap}`, inline: true },
          { name: 'Holders', value: marketData.holders.toString(), inline: true }
        )
        .setTimestamp();
      
      await message.reply({ embeds: [marketEmbed] });
    } catch (error) {
      await message.reply('Error fetching market data.');
    }
  }

  if (command === 'holders') {
    try {
      const marketData = await getMarketData();
      const holdersEmbed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('ALBJ Holders')
        .setDescription(`Total Holders: ${marketData.holders.toLocaleString()}`)
        .addFields(
          { name: 'Top Holders', value: 'Coming Soon', inline: true },
          { name: 'Distribution', value: 'View with !info', inline: true }
        )
        .setTimestamp();
      
      await message.reply({ embeds: [holdersEmbed] });
    } catch (error) {
      await message.reply('Error fetching holder data.');
    }
  }

  if (command === 'airdrop') {
    const airdropEmbed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('ALBJ Airdrop Information')
      .setDescription('Stay tuned for upcoming airdrops!')
      .addFields(
        { name: 'Next Airdrop', value: 'Coming Soon', inline: true },
        { name: 'Requirements', value: 'Hold ALBJ tokens\nBe active in community\nFollow social media', inline: true },
        { name: 'How to Participate', value: 'Details will be announced in announcements channel', inline: true }
      )
      .setTimestamp();
    
    await message.reply({ embeds: [airdropEmbed] });
  }

  // Fun commands
  if (command === 'meme') {
    const randomMeme = memes[Math.floor(Math.random() * memes.length)];
    await message.reply(randomMeme);
  }

  if (command === 'quote') {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    await message.reply(`> ${randomQuote}`);
  }

  if (command === 'fact') {
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    await message.reply(`📚 **Did you know?**\n${randomFact}`);
  }

  if (command === 'roll') {
    const max = parseInt(args[0]) || 100;
    const roll = Math.floor(Math.random() * max) + 1;
    await message.reply(`🎲 You rolled: ${roll}`);
  }

  // Existing commands
  switch (command) {
    case 'help':
      const helpMessage = 
        '🌟 **ALBJ Token Bot Commands**\n\n' +
        '**Basic Commands:**\n' +
        '• `!help` - Show this help message\n' +
        '• `!info` - Show token information\n' +
        '• `!social` - Show social media links\n' +
        '• `!roadmap` - Show project roadmap\n' +
        '• `!whitepaper` - Show whitepaper summary\n' +
        '• `!faq` - View frequently asked questions\n\n' +
        '**Utility Commands:**\n' +
        '• `!price` - Show current ALBJ price\n' +
        '• `!market` - Display market statistics\n' +
        '• `!holders` - Show number of token holders\n' +
        '• `!airdrop` - Information about upcoming airdrops\n' +
        '• `!verify` - User verification system\n\n' +
        '**Twitter Commands:**\n' +
        '• `!twitter` - Show Twitter statistics\n' +
        '• `!tweet [message]` - Post a tweet (Admin only)\n\n' +
        '**Fun Commands:**\n' +
        '• `!meme` - Random ALBJ memes\n' +
        '• `!quote` - Inspirational quotes\n' +
        '• `!fact` - Random facts about Alebrijes\n' +
        '• `!roll` - Random number generator\n\n' +
        '**Moderation Commands:**\n' +
        '• `!warn` - Issue warning to user\n' +
        '• `!mute` - Temporarily mute user\n' +
        '• `!unmute` - Remove user mute\n\n' +
        'Need something else? Just ask! 😊';
      try {
        await message.reply(helpMessage);
      } catch (error) {
        console.error('Error sending help message:', error);
      }
      break;

    case 'info':
      const infoMessage = 
        '💎 **ALBJ Token Information**\n\n' +
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
        '• Discord: [Join our community](https://discord.gg/S54a8Y3h)\n' +
        '• Telegram: [Official Channel](https://t.me/AlebrijeToken)\n\n' +
        'Stay tuned for more information! 🚀';
      try {
        await message.reply(infoMessage);
        console.log('Info message sent successfully');
      } catch (error) {
        console.error('Error sending info message:', error);
      }
      break;

    case 'whitepaper':
      const whitepaperMessage = 
        '📚 **ALBJ Token Whitepaper**\n\n' +
        '**Introduction**\n' +
        'ALBJ is a culturally inspired meme coin that fuses global folklore, ancestral traditions, dream-world symbology, and decentralized finance into a powerful new digital asset. Drawing from the vibrant and inter-dimensional realm of spirit-creatures — beings that combine elemental and animal forms — ALBJ bridges humanity\'s timeless myths with the future-facing realities of Web3 ecosystems.\n\n' +
        'Hybrid and chimera-like creatures have appeared throughout humanity\'s oldest civilizations, from Greek mythology\'s Chimera to Egyptian Sphinxes, Japanese Yōkai, and the colorful spirit-creatures known as Alebrijes in Mexico. By tapping into these universal archetypes, ALBJ becomes a global guide of imagination, resilience, and cultural storytelling for the blockchain era.\n\n' +
        'This token serves as a modern spirit guide for users navigating the ever-shifting landscapes of DeFi, NFTs, digital identity, and the interdimensional layers of blockchain reality.\n\n' +
        '**Vision**\n' +
        '"To become the #1 inter-dimensional spirit coin — guiding humanity through bull runs, bear markets, and multiverse realms with wisdom, resilience, and collective purpose."\n\n' +
        'We aim to not only move markets but to awaken the lost dimensions of human culture, spirit, and exploration.\n\n' +
        '**Tokenomics**\n' +
        '• Total Supply: 9,000,000,000 ALBJ\n' +
        '• Max Wallet: 2% of supply\n' +
        '• Transaction Tax: 5%\n\n' +
        '**Distribution**\n' +
        '• 50% Burn\n' +
        '• 20% Liquidity\n' +
        '• 10% Airdrops\n' +
        '• 10% Marketing\n' +
        '• 5% Ecosystem\n' +
        '• 5% Founders (Locked)\n\n' +
        '**Features**\n' +
        '• NFT Collection\n' +
        '• Community Events\n' +
        '• Trading Competitions\n' +
        '• Charity Initiatives\n\n' +
        '**Roadmap**\n' +
        '• Phase 1: Foundation (Q2 2025)\n' +
        '• Phase 2: Growth (Q3 2025)\n' +
        '• Phase 3: Expansion (Q4 2025)\n\n' +
        'For the full whitepaper, visit our website (Coming Soon)';
      try {
        await message.reply(whitepaperMessage);
        console.log('Whitepaper message sent successfully');
      } catch (error) {
        console.error('Error sending whitepaper message:', error);
      }
      break;

    case 'faq':
      const faqMessage = 
        '❓ **Frequently Asked Questions**\n\n' +
        '**General Questions**\n' +
        'Q: What is ALBJ Token?\n' +
        'A: ALBJ is a community-driven token on Solana, inspired by Mexican Alebrijes.\n\n' +
        'Q: When is the launch?\n' +
        'A: June 12, 2025 (VI·XII·MMXXV)\n\n' +
        '**Technical Questions**\n' +
        'Q: Which blockchain is ALBJ on?\n' +
        'A: Solana blockchain\n\n' +
        'Q: How can I buy ALBJ?\n' +
        'A: Will be available on major DEXs at launch\n\n' +
        '**Community Questions**\n' +
        'Q: How can I participate?\n' +
        'A: Join our community events and trading competitions\n\n' +
        'Q: How to get support?\n' +
        'A: Use the support channel or DM our moderators\n\n' +
        '💡 *Use \`!help\` for more commands*';
      try {
        await message.reply(faqMessage);
        console.log('FAQ message sent successfully');
      } catch (error) {
        console.error('Error sending FAQ message:', error);
      }
      break;

    case 'social':
      const socialMessage = 
        '🌟 **Connect with ALBJ Token!**\n\n' +
        '**Official Social Media Links:**\n' +
        '• Twitter: [@ALBJToken](https://twitter.com/ALBJToken) 🐦\n' +
        '• Discord: [Join our community](https://discord.gg/S54a8Y3h) 🎮\n' +
        '• Telegram: [Official Channel](https://t.me/AlebrijeToken) 📱\n' +
        '• Website: [Coming Soon] 🌐\n\n' +
        'Stay connected for the latest updates and community events! 🚀';
      try {
        await message.reply(socialMessage);
        console.log('Social message sent successfully');
      } catch (error) {
        console.error('Error sending social message:', error);
      }
      break;

    case 'roadmap':
      const roadmapMessage = 
        '🗺️ **ALBJ Token Roadmap**\n\n' +
        '**Phase 1: Foundation** 🏗️\n' +
        '• Token launch on Solana\n' +
        '• Community building\n' +
        '• Website launch\n' +
        '• Social media presence\n\n' +
        '**Phase 2: Growth** 📈\n' +
        '• NFT collection launch\n' +
        '• Community events\n' +
        '• Partnership announcements\n' +
        '• Exchange listings\n\n' +
        '**Phase 3: Expansion** 🌟\n' +
        '• Advanced NFT features\n' +
        '• Global community events\n' +
        '• Major partnerships\n' +
        '• Ecosystem development\n\n' +
        'Stay tuned for more updates! 🚀';
      try {
        await message.reply(roadmapMessage);
        console.log('Roadmap message sent successfully');
      } catch (error) {
        console.error('Error sending roadmap message:', error);
      }
      break;

    case 'tweet':
      if (message.member?.permissions.has(PermissionFlagsBits.Administrator)) {
        const tweetContent = args.join(' ');
        if (!tweetContent) {
          return message.reply('Please provide content for the tweet.');
        }

        try {
          // Placeholder for the removed postToTwitter function
          console.log('Tweet content:', tweetContent);
          const tweetEmbed = new EmbedBuilder()
            .setColor(COLORS.SUCCESS)
            .setTitle('Tweet Posted Successfully')
            .setDescription(`[View Tweet](https://twitter.com/ALBJToken/status/${tweetContent})`)
            .addFields(
              { name: 'Content', value: tweetContent }
            )
            .setTimestamp();

          await message.reply({ embeds: [tweetEmbed] });
        } catch (error) {
          const errorEmbed = new EmbedBuilder()
            .setColor(COLORS.ERROR)
            .setTitle('Error Posting Tweet')
            .setDescription('There was an error posting to Twitter. Please try again later.')
            .setTimestamp();

          await message.reply({ embeds: [errorEmbed] });
        }
      }
      break;

    case 'twitter':
      const twitterEmbed = new EmbedBuilder()
        .setColor(COLORS.INFO)
        .setTitle('ALBJ Token on Twitter')
        .setDescription('Follow us on Twitter for the latest updates!')
        .addFields(
          { name: 'Twitter Profile', value: '[@ALBJToken](https://twitter.com/ALBJToken)', inline: true },
          { name: 'Latest Updates', value: 'Follow us for news, announcements, and community updates!', inline: true }
        )
        .setTimestamp();

      await message.reply({ embeds: [twitterEmbed] });
      return;
  }
});

// Helper functions
async function getALBJPrice(): Promise<number> {
  // Implement price fetching logic here
  return 0.00000123; // Placeholder
}

async function getMarketData() {
  // Implement market data fetching logic here
  return {
    volume24h: '1,234,567',
    marketCap: '9,876,543',
    holders: 1234
  };
}

// Login to Discord
client.login(token); 