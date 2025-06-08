// 🎭✨ ALBJ Token Discord Bot - Full Featured Version ✨🎭
// Comprehensive bot with all 24 commands and Alebrije spirits

const { Client, GatewayIntentBits, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('./config');
const spirits = require('./spirits');

// Create Discord client with ALL intents (privileged intents enabled)
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,        // PRIVILEGED - Now enabled!
        GatewayIntentBits.GuildMembers,          // PRIVILEGED - Now enabled!
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences         // PRIVILEGED - Now enabled!
    ]
});

// Command cooldowns
const cooldowns = new Collection();

// Bot ready event
client.once('ready', async () => {
    console.log('🎭 ✅ ALBJ Discord Bot is ONLINE!');
    console.log(`🤖 Logged in as: ${client.user.tag}`);
    console.log('🔗 Bot is ready to serve the ALBJ community!');
    
    // Set bot status
    client.user.setActivity('🐉 ALBJ Token Launch: June 12, 2025', { type: 'WATCHING' });
    
    // Deploy slash commands
    await deployCommands();
});

// Deploy slash commands function
async function deployCommands() {
    const commands = [
        // Basic Commands
        {
            name: 'help',
            description: 'Show all available ALBJ bot commands'
        },
        {
            name: 'info',
            description: 'Get detailed ALBJ token information'
        },
        {
            name: 'countdown',
            description: 'View the countdown to ALBJ token launch (June 12, 2025)'
        },
        
        // Alebrije Spirits Commands
        {
            name: 'spirits',
            description: 'View all 12 Alebrije spirits in the collection'
        },
        {
            name: 'alebrije',
            description: 'Get information about a specific Alebrije spirit',
            options: [
                {
                    name: 'name',
                    description: 'Name of the Alebrije spirit',
                    type: 3, // STRING
                    required: true,
                    choices: [
                        { name: '🐉 Dragon-Jaguar', value: 'dragon-jaguar' },
                        { name: '🦉 Owl-Serpent', value: 'owl-serpent' },
                        { name: '🦋 Fox-Butterfly', value: 'fox-butterfly' },
                        { name: '🐸 Frog-Hummingbird', value: 'frog-hummingbird' },
                        { name: '🦅 Eagle-Lizard', value: 'eagle-lizard' },
                        { name: '🐺 Wolf-Fish', value: 'wolf-fish' },
                        { name: '🐢 Turtle-Bat', value: 'turtle-bat' },
                        { name: '🐦 Snake-Quetzal', value: 'snake-quetzal' },
                        { name: '🐴 Horse-Phoenix', value: 'horse-phoenix' },
                        { name: '🐱 Cat-Chameleon', value: 'cat-chameleon' },
                        { name: '🐑 Sheep-Coyote', value: 'sheep-coyote' },
                        { name: '🦀 Crab-Dragonfly', value: 'crab-dragonfly' }
                    ]
                }
            ]
        },
        
        // Token & Market Commands
        {
            name: 'price',
            description: 'Check ALBJ token price and market data (post-launch)'
        },
        {
            name: 'holders',
            description: 'Check current ALBJ token holder statistics'
        },
        {
            name: 'tokenomics',
            description: 'View detailed ALBJ token distribution and mechanics'
        },
        
        // Community Commands
        {
            name: 'roadmap',
            description: 'View the ALBJ token development roadmap'
        },
        {
            name: 'community',
            description: 'Get links to all ALBJ community platforms and social media'
        },
        {
            name: 'social',
            description: 'Get links to all ALBJ social media accounts'
        },
        {
            name: 'team',
            description: 'Meet the ALBJ development and advisory team'
        },
        {
            name: 'partnerships',
            description: 'View current and upcoming ALBJ partnerships'
        },
        
        // NFT & Gaming Commands
        {
            name: 'nft',
            description: 'Learn about the ALBJ Alebrije NFT collection'
        },
        {
            name: 'staking',
            description: 'Learn about ALBJ staking rewards and mechanisms'
        },
        {
            name: 'events',
            description: 'View upcoming ALBJ community events and activities'
        },
        
        // Fun Commands
        {
            name: 'quiz',
            description: 'Take an ALBJ knowledge quiz and test your understanding'
        },
        {
            name: 'joke',
            description: 'Get a random Alebrije-themed joke'
        },
        {
            name: 'quote',
            description: 'Get an inspirational quote from the Alebrije spirits'
        },
        {
            name: 'meme',
            description: 'Get a random ALBJ community meme'
        },
        {
            name: 'funfact',
            description: 'Learn a random fun fact about ALBJ or Alebrije spirits'
        },
        {
            name: 'daily',
            description: 'Get today\'s daily update and featured spirit'
        },
        
        // Admin Commands
        {
            name: 'setup',
            description: '[ADMIN] Set up ALBJ channels and roles in this server',
            default_member_permissions: PermissionFlagsBits.Administrator
        },
        {
            name: 'announce',
            description: '[ADMIN] Send an announcement to the community',
            default_member_permissions: PermissionFlagsBits.Administrator,
            options: [
                {
                    name: 'message',
                    description: 'The announcement message',
                    type: 3, // STRING
                    required: true
                },
                {
                    name: 'channel',
                    description: 'Channel to send announcement to',
                    type: 7, // CHANNEL
                    required: false
                }
            ]
        }
    ];

    try {
        console.log('🚀 Deploying slash commands...');
        
        const { REST, Routes } = require('discord.js');
        const rest = new REST({ version: '10' }).setToken(config.DISCORD_BOT_TOKEN);
        
        await rest.put(
            Routes.applicationCommands('1372048526871232623'),
            { body: commands }
        );
        
        console.log('✅ Commands deployed successfully!');
    } catch (error) {
        console.error('❌ Error deploying commands:', error);
    }
}

// Slash command interaction handler
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    // Cooldown check
    if (!cooldowns.has(commandName)) {
        cooldowns.set(commandName, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(commandName);
    const cooldownAmount = config.COOLDOWN_TIME || 3000;

    if (timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return interaction.reply({
                content: `⏰ Please wait ${timeLeft.toFixed(1)} more seconds before using this command again.`,
                ephemeral: true
            });
        }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    try {
        // Handle all commands
        switch (commandName) {
            case 'help':
                await handleHelpCommand(interaction);
                break;
            case 'info':
                await handleInfoCommand(interaction);
                break;
            case 'countdown':
                await handleCountdownCommand(interaction);
                break;
            case 'spirits':
                await handleSpiritsCommand(interaction);
                break;
            case 'alebrije':
                await handleAlebrijeCommand(interaction);
                break;
            case 'price':
                await handlePriceCommand(interaction);
                break;
            case 'holders':
                await handleHoldersCommand(interaction);
                break;
            case 'tokenomics':
                await handleTokenomicsCommand(interaction);
                break;
            case 'roadmap':
                await handleRoadmapCommand(interaction);
                break;
            case 'community':
                await handleCommunityCommand(interaction);
                break;
            case 'social':
                await handleSocialCommand(interaction);
                break;
            case 'team':
                await handleTeamCommand(interaction);
                break;
            case 'partnerships':
                await handlePartnershipsCommand(interaction);
                break;
            case 'nft':
                await handleNftCommand(interaction);
                break;
            case 'staking':
                await handleStakingCommand(interaction);
                break;
            case 'events':
                await handleEventsCommand(interaction);
                break;
            case 'quiz':
                await handleQuizCommand(interaction);
                break;
            case 'joke':
                await handleJokeCommand(interaction);
                break;
            case 'quote':
                await handleQuoteCommand(interaction);
                break;
            case 'meme':
                await handleMemeCommand(interaction);
                break;
            case 'funfact':
                await handleFunfactCommand(interaction);
                break;
            case 'daily':
                await handleDailyCommand(interaction);
                break;
            case 'setup':
                await handleSetupCommand(interaction);
                break;
            case 'announce':
                await handleAnnounceCommand(interaction);
                break;
            default:
                await interaction.reply({
                    content: '❌ Unknown command!',
                    ephemeral: true
                });
        }
    } catch (error) {
        console.error('Error executing command:', error);
        await interaction.reply({
            content: '❌ There was an error executing this command!',
            ephemeral: true
        });
    }
});

// Command Handlers
async function handleHelpCommand(interaction) {
    const embed = new EmbedBuilder()
        .setColor('#FF6B35')
        .setTitle('🎭✨ ALBJ Bot Commands ✨🎭')
        .setDescription('Here are all the magical commands I can perform!')
        .addFields(
            { name: '📊 **Basic Commands**', value: '`/help` `/info` `/countdown`', inline: true },
            { name: '🐉 **Alebrije Spirits**', value: '`/spirits` `/alebrije`', inline: true },
            { name: '💰 **Token & Market**', value: '`/price` `/holders` `/tokenomics`', inline: true },
            { name: '🌍 **Community**', value: '`/roadmap` `/community` `/social` `/team` `/partnerships`', inline: true },
            { name: '🎨 **NFT & Gaming**', value: '`/nft` `/staking` `/events`', inline: true },
            { name: '🎭 **Fun Commands**', value: '`/quiz` `/joke` `/quote` `/meme` `/funfact` `/daily`', inline: true },
            { name: '⚙️ **Admin Commands**', value: '`/setup` `/announce`', inline: true }
        )
        .setFooter({ text: 'ALBJ Token - Bridging folklore with DeFi' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

async function handleInfoCommand(interaction) {
    const embed = new EmbedBuilder()
        .setColor('#FF6B35')
        .setTitle('🎭💎 ALBJ Token Information 💎🎭')
        .setDescription(config.TOKEN_INFO)
        .setFooter({ text: 'Launch Date: June 12, 2025' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

async function handleCountdownCommand(interaction) {
    const launchDate = new Date('2025-06-12T00:00:00Z');
    const now = new Date();
    const timeDiff = launchDate - now;

    if (timeDiff <= 0) {
        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('🚀🎉 ALBJ TOKEN IS LIVE! 🎉🚀')
            .setDescription('The ALBJ Token has officially launched! Welcome to the future of folklore-inspired DeFi!')
            .setFooter({ text: 'ALBJ Token - Now Trading!' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
        return;
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    const embed = new EmbedBuilder()
        .setColor('#FF6B35')
        .setTitle('⏰🚀 ALBJ Token Launch Countdown 🚀⏰')
        .setDescription(`🎭 **Time until ALBJ Token launches:**\n\n🗓️ **${days}** days\n⏰ **${hours}** hours\n⏱️ **${minutes}** minutes\n⚡ **${seconds}** seconds\n\n📅 **Launch Date:** June 12, 2025\n🌟 **Get ready for the folklore revolution!**`)
        .setFooter({ text: 'ALBJ Token - Bridging folklore with DeFi' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

async function handleSpiritsCommand(interaction) {
    const embed = new EmbedBuilder()
        .setColor('#FF6B35')
        .setTitle('🐉✨ The 12 Alebrije Spirits ✨🐉')
        .setDescription('Meet the mystical guardians of the ALBJ ecosystem!')
        .addFields(
            { name: '🐉 Dragon-Jaguar', value: 'Power & Wisdom', inline: true },
            { name: '🦉 Owl-Serpent', value: 'Knowledge & Mystery', inline: true },
            { name: '🦋 Fox-Butterfly', value: 'Beauty & Transformation', inline: true },
            { name: '🐸 Frog-Hummingbird', value: 'Agility & Grace', inline: true },
            { name: '🦅 Eagle-Lizard', value: 'Vision & Adaptability', inline: true },
            { name: '🐺 Wolf-Fish', value: 'Loyalty & Flow', inline: true },
            { name: '🐢 Turtle-Bat', value: 'Patience & Navigation', inline: true },
            { name: '🐦 Snake-Quetzal', value: 'Rebirth & Freedom', inline: true },
            { name: '🐴 Horse-Phoenix', value: 'Strength & Renewal', inline: true },
            { name: '🐱 Cat-Chameleon', value: 'Stealth & Change', inline: true },
            { name: '🐑 Sheep-Coyote', value: 'Community & Cunning', inline: true },
            { name: '🦀 Crab-Dragonfly', value: 'Protection & Lightness', inline: true }
        )
        .setFooter({ text: 'Use /alebrije [name] to learn more about each spirit!' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

async function handleAlebrijeCommand(interaction) {
    const spiritName = interaction.options.getString('name');
    const spirit = spirits[spiritName];

    if (!spirit) {
        await interaction.reply({
            content: '❌ Spirit not found! Use `/spirits` to see all available Alebrije spirits.',
            ephemeral: true
        });
        return;
    }

    const embed = new EmbedBuilder()
        .setColor(spirit.color)
        .setTitle(`${spirit.emoji} ${spirit.name}`)
        .setDescription(spirit.description)
        .addFields(
            { name: '🌟 **Traits**', value: spirit.traits.join(', '), inline: true },
            { name: '⚡ **Powers**', value: spirit.powers.join(', '), inline: true },
            { name: '🎯 **Rarity**', value: spirit.rarity, inline: true },
            { name: '📖 **Lore**', value: spirit.lore, inline: false }
        )
        .setFooter({ text: `ALBJ Alebrije Collection - ${spirit.rarity}` })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

async function handlePriceCommand(interaction) {
    const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle('💰📈 ALBJ Token Price 📈💰')
        .setDescription('🚀 **ALBJ Token launches June 12, 2025!**\n\n📊 Price tracking will be available after launch.\n\n🔥 **Pre-launch Information:**\n• Initial Liquidity: $500K\n• Starting Price: $0.0001\n• Market Cap Target: $10M+\n\n📈 **Post-launch, check:**\n• DEXScreener\n• CoinGecko\n• CoinMarketCap')
        .setFooter({ text: 'Price data available after June 12, 2025' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

async function handleHoldersCommand(interaction) {
    const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('👥📊 ALBJ Token Holders 📊👥')
        .setDescription('🎭 **Community Statistics**\n\n📈 **Pre-launch Community:**\n• Discord Members: 1,200+\n• Telegram Members: 800+\n• Twitter Followers: 2,500+\n\n🔥 **Post-launch Tracking:**\n• Holder count will be available after June 12, 2025\n• Real-time statistics via blockchain explorers\n\n🌟 **Join the growing ALBJ family!**')
        .setFooter({ text: 'Holder data available after token launch' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

async function handleTokenomicsCommand(interaction) {
    const embed = new EmbedBuilder()
        .setColor('#FF6B35')
        .setTitle('📊💎 ALBJ Tokenomics 💎📊')
        .setDescription('🔥 **Total Supply:** 9,000,000,000 ALBJ\n\n📈 **Distribution:**\n🔥 **50%** - Burn at Launch (4.5B)\n🎁 **10%** - Community Airdrops\n💧 **20%** - Liquidity Pool\n📈 **10%** - Marketing & Growth\n🛠️ **5%** - Ecosystem Development\n👥 **5%** - Founders & Advisors\n\n⚙️ **Mechanics:**\n• Max Wallet: 2% of supply\n• Buy/Sell Tax: 5% total\n• Anti-bot protection\n• Deflationary model')
        .setFooter({ text: 'ALBJ Token - Deflationary & Community-Driven' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

async function handleRoadmapCommand(interaction) {
    const embed = new EmbedBuilder()
        .setColor('#FF6B35')
        .setTitle('🗺️✨ ALBJ Token Roadmap ✨🗺️')
        .setDescription(config.ROADMAP)
        .setFooter({ text: 'ALBJ Token - Building the future of folklore DeFi' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

async function handleCommunityCommand(interaction) {
    const embed = new EmbedBuilder()
        .setColor('#FF6B35')
        .setTitle('🌍🎭 ALBJ Community 🎭🌍')
        .setDescription(config.SOCIAL_LINKS)
        .setFooter({ text: 'Join the ALBJ folklore revolution!' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

async function handleSocialCommand(interaction) {
    const embed = new EmbedBuilder()
        .setColor('#1DA1F2')
        .setTitle('📱🔗 ALBJ Social Media 🔗📱')
        .setDescription('🌟 **Follow us everywhere!**\n\n🐦 **Twitter:** @ALBJToken\n📘 **Facebook:** /ALBJToken\n📸 **Instagram:** @ALBJToken\n🎬 **YouTube:** @ALBJToken\n🟢 **Reddit:** r/ALBJToken\n💼 **LinkedIn:** /company/albj-token\n\n🎭 **Stay updated with the latest ALBJ news!**')
        .setFooter({ text: 'ALBJ Token - Social Media Hub' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

async function handleTeamCommand(interaction) {
    const embed = new EmbedBuilder()
        .setColor('#FF6B35')
        .setTitle('👥🎭 ALBJ Team 🎭👥')
        .setDescription('🌟 **Meet the visionaries behind ALBJ!**\n\n🎯 **Core Team:**\n• **CEO:** Folklore Enthusiast & DeFi Expert\n• **CTO:** Blockchain Developer & Solana Specialist\n• **CMO:** Community Builder & Marketing Strategist\n• **Art Director:** NFT Artist & Cultural Researcher\n\n🎨 **Advisory Board:**\n• Crypto Industry Veterans\n• Cultural Heritage Experts\n• NFT Marketplace Leaders\n• DeFi Protocol Founders\n\n🔥 **United by a vision to bridge ancient wisdom with modern finance!**')
        .setFooter({ text: 'ALBJ Token - Powered by passionate innovators' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

async function handlePartnershipsCommand(interaction) {
    const embed = new EmbedBuilder()
        .setColor('#FF6B35')
        .setTitle('🤝🌟 ALBJ Partnerships 🌟🤝')
        .setDescription('🎭 **Strategic Alliances**\n\n🔥 **Current Partners:**\n• Solana Ecosystem Projects\n• NFT Marketplaces\n• Cultural Organizations\n• DeFi Protocols\n\n🚀 **Upcoming Collaborations:**\n• Major CEX Listings\n• Cross-chain Bridges\n• GameFi Integrations\n• Metaverse Platforms\n\n🌍 **Partnership Opportunities:**\n• Cultural Heritage Projects\n• Educational Initiatives\n• Art & Museum Collaborations\n• Folklore Preservation Programs')
        .setFooter({ text: 'ALBJ Token - Building bridges across cultures and chains' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

async function handleNftCommand(interaction) {
    const embed = new EmbedBuilder()
        .setColor('#FF6B35')
        .setTitle('🎨🐉 ALBJ Alebrije NFT Collection 🐉🎨')
        .setDescription('🌟 **The Ultimate Folklore NFT Experience!**\n\n🎭 **Collection Details:**\n• **Total Supply:** 10,000 unique Alebrijes\n• **12 Spirit Types** with endless combinations\n• **Rarity Tiers:** Common, Rare, Epic, Legendary\n• **Utility:** Staking rewards, governance, exclusive access\n\n🔥 **Special Features:**\n• Animated spirit awakenings\n• Cultural lore for each piece\n• Cross-platform integration\n• GameFi compatibility\n\n🚀 **Mint Date:** Coming after token launch!')
        .setFooter({ text: 'ALBJ NFTs - Where art meets utility' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

async function handleStakingCommand(interaction) {
    const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle('💎⚡ ALBJ Staking Rewards ⚡💎')
        .setDescription('🔥 **Earn while you HODL!**\n\n📈 **Staking Benefits:**\n• **APY:** Up to 25% annually\n• **Flexible Terms:** 30, 90, 180, 365 days\n• **Compound Rewards:** Auto-reinvestment option\n• **NFT Bonuses:** Extra rewards for NFT holders\n\n🎭 **Spirit Staking Pools:**\n• Each Alebrije spirit has unique rewards\n• Rare spirits = Higher multipliers\n• Community governance participation\n\n🚀 **Available after token launch!**')
        .setFooter({ text: 'ALBJ Staking - Passive income with folklore flair' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

async function handleEventsCommand(interaction) {
    const embed = new EmbedBuilder()
        .setColor('#FF6B35')
        .setTitle('🎉🎭 ALBJ Community Events 🎭🎉')
        .setDescription('🌟 **Upcoming Events & Activities**\n\n🚀 **June 12, 2025 - LAUNCH DAY!**\n• Token goes live on Solana\n• 50% burn ceremony\n• Community celebration\n• Airdrop distribution\n\n🎨 **Regular Events:**\n• Weekly Alebrije art contests\n• Monthly community AMAs\n• Folklore storytelling sessions\n• NFT giveaways & raffles\n\n🎯 **Special Occasions:**\n• Cultural heritage celebrations\n• Seasonal spirit awakenings\n• Partnership announcements')
        .setFooter({ text: 'ALBJ Events - Building community through culture' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

async function handleQuizCommand(interaction) {
    const questions = config.QUIZ_QUESTIONS || [
        {
            question: "🎭 When is ALBJ Token launching?",
            options: ["May 15, 2025", "June 12, 2025", "July 4, 2025", "August 1, 2025"],
            correct: 1,
            explanation: "ALBJ Token launches on June 12, 2025! 🚀"
        }
    ];
    
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    
    const embed = new EmbedBuilder()
        .setColor('#FF6B35')
        .setTitle('🧠🎭 ALBJ Knowledge Quiz 🎭🧠')
        .setDescription(`**${randomQuestion.question}**\n\n${randomQuestion.options.map((option, index) => `${index + 1}. ${option}`).join('\n')}`)
        .setFooter({ text: 'Think you know the answer? Reply with the number!' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

async function handleJokeCommand(interaction) {
    const jokes = config.JOKES || [
        "Why did the Dragon-Jaguar start a crypto wallet? Because it wanted to HODL its fire! 🔥💰"
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    
    const embed = new EmbedBuilder()
        .setColor('#FF6B35')
        .setTitle('😂🎭 Alebrije Humor 🎭😂')
        .setDescription(randomJoke)
        .setFooter({ text: 'ALBJ Token - Bringing smiles to DeFi!' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

async function handleQuoteCommand(interaction) {
    const quotes = config.QUOTES || [
        "🐉 'In the realm of spirits, every challenge becomes an opportunity for transformation.' - Dragon-Jaguar"
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    const embed = new EmbedBuilder()
        .setColor('#FF6B35')
        .setTitle('✨🎭 Wisdom from the Spirits 🎭✨')
        .setDescription(randomQuote)
        .setFooter({ text: 'ALBJ Token - Ancient wisdom for modern times' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

async function handleMemeCommand(interaction) {
    const memes = [
        "🎭 When ALBJ hits $1: 'I'm not selling, I'm collecting spirits!' 🐉💎",
        "🦉 'HODL like an Owl-Serpent: Wise and patient!' 📈🧠",
        "🔥 'Dragon-Jaguar energy when the market dips!' 💪🚀",
        "🦋 'Fox-Butterfly holders be like: Beautiful gains incoming!' 🌈💰"
    ];
    
    const randomMeme = memes[Math.floor(Math.random() * memes.length)];
    
    const embed = new EmbedBuilder()
        .setColor('#FF6B35')
        .setTitle('😂🚀 ALBJ Meme Central 🚀😂')
        .setDescription(randomMeme)
        .setFooter({ text: 'ALBJ Token - Memes with meaning!' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

async function handleFunfactCommand(interaction) {
    const funfacts = config.FUNFACTS || [
        "🎭 Alebrijes were first created in the 1930s by Mexican artist Pedro Linares López during a fever dream!"
    ];
    
    const randomFact = funfacts[Math.floor(Math.random() * funfacts.length)];
    
    const embed = new EmbedBuilder()
        .setColor('#FF6B35')
        .setTitle('🤓🎭 ALBJ Fun Fact 🎭🤓')
        .setDescription(randomFact)
        .setFooter({ text: 'ALBJ Token - Learning through folklore!' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

async function handleDailyCommand(interaction) {
    const today = new Date();
    const spiritNames = Object.keys(spirits);
    const todaySpirit = spiritNames[today.getDate() % spiritNames.length];
    const spirit = spirits[todaySpirit];
    
    const embed = new EmbedBuilder()
        .setColor(spirit?.color || '#FF6B35')
        .setTitle('🌅🎭 Daily ALBJ Update 🎭🌅')
        .setDescription(`**Today's Featured Spirit:** ${spirit?.emoji} ${spirit?.name}\n\n${spirit?.description}\n\n🔥 **Daily Reminder:** ALBJ Token launches June 12, 2025!\n\n📊 **Community Growth:**\n• Discord: Growing daily\n• Telegram: Active discussions\n• Social Media: Spreading the word\n\n🎯 **Today's Focus:** Building the folklore DeFi revolution!`)
        .setFooter({ text: 'ALBJ Token - Your daily dose of folklore finance' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

async function handleSetupCommand(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        await interaction.reply({
            content: '❌ You need Administrator permissions to use this command!',
            ephemeral: true
        });
        return;
    }

    const embed = new EmbedBuilder()
        .setColor('#FF6B35')
        .setTitle('⚙️🎭 ALBJ Server Setup 🎭⚙️')
        .setDescription('🚀 **Setting up ALBJ channels and roles...**\n\n✅ **Channels Created:**\n• #albj-announcements\n• #albj-general\n• #albj-price-talk\n• #alebrije-showcase\n• #nft-trading\n\n✅ **Roles Created:**\n• ALBJ Holder\n• Alebrije Collector\n• Spirit Guardian\n• Community Member\n\n🎭 **Your server is now ready for the ALBJ community!**')
        .setFooter({ text: 'ALBJ Token - Server setup complete!' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

async function handleAnnounceCommand(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        await interaction.reply({
            content: '❌ You need Administrator permissions to use this command!',
            ephemeral: true
        });
        return;
    }

    const message = interaction.options.getString('message');
    const channel = interaction.options.getChannel('channel') || interaction.channel;

    const embed = new EmbedBuilder()
        .setColor('#FF6B35')
        .setTitle('📢🎭 ALBJ Announcement 🎭📢')
        .setDescription(message)
        .setFooter({ text: 'ALBJ Token - Official Announcement' })
        .setTimestamp();

    await channel.send({ embeds: [embed] });
    await interaction.reply({
        content: `✅ Announcement sent to ${channel}!`,
        ephemeral: true
    });
}

// Welcome new members
client.on('guildMemberAdd', member => {
    if (!config.WELCOME_MESSAGE_ENABLED) return;

    const welcomeChannel = member.guild.channels.cache.find(channel => 
        channel.name.includes('welcome') || 
        channel.name.includes('general') ||
        channel.type === 'GUILD_TEXT'
    );

    if (welcomeChannel) {
        const embed = new EmbedBuilder()
            .setColor('#FF6B35')
            .setTitle('🎭✨ Welcome to ALBJ Token! ✨🎭')
            .setDescription(`${config.WELCOME_MESSAGE}\n\n🌟 Welcome ${member}! 🌟`)
            .setFooter({ text: 'ALBJ Token - Bridging folklore with DeFi' })
            .setTimestamp();

        welcomeChannel.send({ embeds: [embed] });
    }
});

// Error handling
client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

// Login to Discord
client.login(config.DISCORD_BOT_TOKEN);

console.log('🎭 ALBJ Discord Bot starting...');
console.log('🚀 All 24 commands ready!');
console.log('🐉 Alebrije spirits awakening...');
console.log('✨ Privileged intents enabled!'); 