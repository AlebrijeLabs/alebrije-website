const { REST, Routes } = require('discord.js');
const config = require('./config');
require('dotenv').config();

const commands = [
  {
    name: 'help',
    description: 'Show all available ALBJ bot commands'
  },
  {
    name: 'info',
    description: 'Get detailed ALBJ token information'
  },
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
        description: 'Name of the Alebrije spirit (e.g. dragon-jaguar)',
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
  {
    name: 'countdown',
    description: 'View the countdown to ALBJ token launch (June 12, 2025)'
  },
  {
    name: 'price',
    description: 'Check ALBJ token price and market data (post-launch)'
  },
  {
    name: 'roadmap',
    description: 'View the ALBJ token development roadmap'
  },
  {
    name: 'community',
    description: 'Get links to all ALBJ community platforms and social media'
  },
  {
    name: 'nft',
    description: 'Learn about the ALBJ Alebrije NFT collection'
  },
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
    name: 'daily',
    description: 'Get today\'s daily update and featured spirit'
  },
  {
    name: 'setup',
    description: '[ADMIN] Set up ALBJ channels and roles in this server',
    default_member_permissions: '8' // Administrator permission
  },
  {
    name: 'announce',
    description: '[ADMIN] Send an announcement to the community',
    default_member_permissions: '8', // Administrator permission
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
  },
  {
    name: 'funfact',
    description: 'Learn a random fun fact about ALBJ or Alebrije spirits'
  },
  {
    name: 'holders',
    description: 'Check current ALBJ token holder statistics'
  },
  {
    name: 'tokenomics',
    description: 'View detailed ALBJ token distribution and mechanics'
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
  {
    name: 'staking',
    description: 'Learn about ALBJ staking rewards and mechanisms'
  },
  {
    name: 'events',
    description: 'View upcoming ALBJ community events and activities'
  }
];

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(config.DISCORD_BOT_TOKEN);

// Deploy commands
(async () => {
  try {
    console.log(`🚀 Started refreshing ${commands.length} application (/) commands.`);

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationCommands('1372048526871232623'),
      { body: commands },
    );

    console.log(`✅ Successfully reloaded ${data.length} application (/) commands.`);
    console.log('🎭 ALBJ Discord bot commands are ready!');
    
    // List deployed commands
    console.log('\n📋 Deployed commands:');
    commands.forEach(cmd => {
      console.log(`   /${cmd.name} - ${cmd.description}`);
    });

  } catch (error) {
    console.error('❌ Error deploying commands:', error);
  }
})(); 