const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');

const TOKEN = 'MTM3MjA0ODUyNjg3MTIzMjYyMw.GVZX_M.KXzYmHRExvs8OvDSIZLL7lZKMbKibr9ORSCjig';
const CLIENT_ID = '1372048526871232623';

// Create client with message content intent
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Function to get time-based greeting
function getTimeBasedGreeting() {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
        return "Good morning";
    } else if (hour >= 12 && hour < 17) {
        return "Good afternoon";
    } else if (hour >= 17 && hour < 22) {
        return "Good evening";
    } else {
        return "Good night";
    }
}

// Function to get random greeting variation
function getGreetingVariation() {
    const greetings = [
        "Hello there",
        "Hey",
        "Hi",
        "Greetings",
        "Welcome",
        "Salutations"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
}

// Commands
const commands = [
    new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show ALBJ bot commands'),
    new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get ALBJ token information'),
    new SlashCommandBuilder()
        .setName('countdown')
        .setDescription('Time until ALBJ launch (June 12, 2025)')
];

// Deploy commands
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log('🚀 Deploying slash commands...');
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands.map(cmd => cmd.toJSON()) }
        );
        console.log('✅ Commands deployed!');
    } catch (error) {
        console.error('❌ Command deployment error:', error.message);
    }
})();

// Bot ready
client.once('ready', () => {
    console.log('🎭 ✅ ALBJ Discord Bot is ONLINE!');
    console.log(`🤖 Logged in as: ${client.user.tag}`);
    console.log('🔗 Bot is ready to serve the ALBJ community!');
    console.log('💬 Greeting system activated!');
    
    client.user.setActivity('🎭 ALBJ Token | /help or just say hi!', { type: 'WATCHING' });
});

// Handle regular messages (greeting system)
client.on('messageCreate', async message => {
    // Ignore bot messages and system messages
    if (message.author.bot || message.system) return;
    
    // Don't respond to slash commands (they start with /)
    if (message.content.startsWith('/')) return;
    
    // Get user's display name (nickname or username)
    const userName = message.member?.displayName || message.author.displayName || message.author.username;
    
    // Get time-based greeting
    const timeGreeting = getTimeBasedGreeting();
    const casualGreeting = getGreetingVariation();
    
    // Create personalized greeting
    const greeting = `${casualGreeting}, ${userName}! ${timeGreeting}! 🎭✨
    
How can I help you today? You can:
• Use \`/help\` to see all my commands
• Use \`/info\` for ALBJ token details  
• Use \`/countdown\` for launch countdown
• Or just chat with me! 😊

🐉 Welcome to the ALBJ community! 🐉`;

    try {
        await message.reply(greeting);
    } catch (error) {
        console.error('Error sending greeting:', error);
    }
});

// Handle commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'help') {
        await interaction.reply({
            content: `🎭 **ALBJ Discord Bot Commands:**
            
📊 \`/info\` - Get detailed ALBJ token information
⏰ \`/countdown\` - Days until launch (June 12, 2025)
🎨 \`/help\` - Show this help message

💬 **New Feature:**
• Just type any message and I'll greet you personally!

🌟 **Coming Soon:**
• 12 ALBJ Spirit creatures
• Daily updates & community features
• NFT collection integration
• Cross-platform Telegram sync

🔗 **Links:**
• Website: https://albj.io
• Telegram: @ALBJTokenBot

🎭 ALBJ - Where folklore meets the future! ✨`
        });
    }

    if (commandName === 'info') {
        await interaction.reply({
            content: `🎭💎 **ALBJ Token Information** 💎🎭

📋 **Details:**
• **Name**: ALBJ Token
• **Symbol**: ALBJ
• **Blockchain**: Solana ⚡
• **Launch**: June 12, 2025 📅
• **Supply**: 9,000,000,000 ALBJ

🔥 **Tokenomics:**
• 50% Burn at Launch (4.5B tokens)
• 20% Liquidity Pool
• 10% Community Airdrops
• 10% Marketing & Growth
• 5% Ecosystem Development
• 5% Team & Advisors

✨ **Special Features:**
• 🐉 12 ALBJ Spirit Creatures
• 🎨 Cultural folklore inspiration
• 🌆 Cyberpunk aesthetic
• 👥 Community-driven ecosystem
• 🔄 Cross-platform Discord/Telegram integration

🌟 **Get Ready for the Future of Folklore Finance!** 🌟`
        });
    }

    if (commandName === 'countdown') {
        const launchDate = new Date('2025-06-12T00:00:00Z');
        const now = new Date();
        const timeDiff = launchDate.getTime() - now.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

        await interaction.reply({
            content: `⏰🚀 **ALBJ Token Launch Countdown** 🚀⏰

📅 **Launch Date**: June 12, 2025
⏳ **Days Remaining**: ${daysLeft} days

🎭 **What's Coming:**
• 🔥 50% token burn event
• 💧 Liquidity pool launch
• 🎁 Community airdrops
• 🎨 ALBJ NFT collection
• 🌟 Ecosystem activation

🚀 **Are you ready for the future of folklore finance?** 🚀

Stay tuned for daily updates and spirit reveals! 🐉✨`
        });
    }
});

// Login
client.login(TOKEN); 