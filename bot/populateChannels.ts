const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
const envPath = path.resolve(__dirname, '.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

const channelContent = {
  'announcements': [
    {
      content: '📢 **Welcome to ALBJ Token Official Announcements**\n\n' +
               'This channel is where we\'ll post important updates about:\n' +
               '• Token launches\n' +
               '• Partnership announcements\n' +
               '• Major milestones\n' +
               '• Community events\n\n' +
               'Launch Date: June 12, 2025 (VI·XII·MMXXV)\n' +
               'Stay tuned for exciting news! 🚀'
    }
  ],
  'rules': [
    {
      content: '📜 **ALBJ Token Community Rules**\n\n' +
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
    }
  ],
  'token-info': [
    {
      content: '💎 **ALBJ Token Information**\n\n' +
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
    }
  ],
  'nft-preview': [
    {
      content: '🎨 **ALBJ NFT Collection Preview**\n\n' +
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
    }
  ],
  'community-events': [
    {
      content: '🎉 **ALBJ Community Events**\n\n' +
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
    }
  ],
  'support': [
    {
      content: '🆘 **ALBJ Support Channel**\n\n' +
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
  ]
};

client.once('ready', async () => {
  console.log(`Logged in as ${client.user?.tag}`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID!);
  if (!guild) return console.error('Guild not found.');

  // Check bot permissions
  const botMember = await guild.members.fetch(client.user!.id);
  const requiredPermissions = [
    PermissionsBitField.Flags.ManageMessages,
    PermissionsBitField.Flags.SendMessages,
    PermissionsBitField.Flags.ViewChannel
  ];

  const missingPermissions = requiredPermissions.filter(
    permission => !botMember.permissions.has(permission)
  );

  if (missingPermissions.length > 0) {
    console.error('❌ Bot is missing required permissions:');
    missingPermissions.forEach(permission => {
      console.error(`   - ${permission}`);
    });
    console.error('\nPlease ensure the bot has the following permissions:');
    console.error('1. Manage Messages');
    console.error('2. Send Messages');
    console.error('3. View Channels');
    console.error('\nYou can fix this by:');
    console.error('1. Going to Server Settings > Roles');
    console.error('2. Selecting the bot\'s role');
    console.error('3. Enabling the required permissions');
    client.destroy();
    process.exit(1);
  }

  console.log('Starting to populate channels...');

  for (const [channelName, messages] of Object.entries(channelContent)) {
    const channel = guild.channels.cache.find(c => c.name === channelName);
    if (!channel) {
      console.error(`❌ Channel #${channelName} not found`);
      continue;
    }

    try {
      // Clear existing messages
      if (channel.isTextBased()) {
        try {
          const messages = await channel.messages.fetch({ limit: 100 });
          await Promise.all(messages.map(msg => msg.delete()));
        } catch (error) {
          console.warn(`⚠️ Could not clear messages in #${channelName}, continuing with new messages...`);
        }
      }

      // Send new messages
      for (const message of messages) {
        await channel.send(message);
      }
      console.log(`✅ Populated #${channelName}`);
    } catch (error) {
      console.error(`❌ Error populating #${channelName}:`, error.message);
    }
  }

  console.log('✅ Channel population complete!');
  client.destroy();
});

// Add error handlers
client.on('error', (error: Error) => {
  console.error('Discord client error:', error);
});

process.on('unhandledRejection', (reason: unknown) => {
  console.error('Unhandled promise rejection:', reason);
});

// Try to login
try {
  console.log('Attempting to login...');
  client.login(process.env.BOT_TOKEN);
} catch (error) {
  console.error('Login failed:', error);
  process.exit(1);
} 