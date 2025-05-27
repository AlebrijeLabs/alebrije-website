const { Client, GatewayIntentBits, PermissionsBitField, TextChannel, Role, GuildChannel } = require('discord.js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
const envPath = path.resolve(__dirname, '.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

// Debug logging
console.log('Environment variables loaded:');
console.log('BOT_TOKEN exists:', !!process.env.BOT_TOKEN);
console.log('BOT_TOKEN length:', process.env.BOT_TOKEN?.length);
console.log('BOT_TOKEN first 10 chars:', process.env.BOT_TOKEN?.slice(0, 10));
console.log('GUILD_ID:', process.env.GUILD_ID);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

client.once('ready', async () => {
  console.log(`Logged in as ${client.user?.tag}`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID!);
  if (!guild) return console.error('Guild not found.');

  // Check bot permissions
  const botMember = await guild.members.fetch(client.user!.id);
  const requiredPermissions = [
    PermissionsBitField.Flags.ManageChannels,
    PermissionsBitField.Flags.ManageRoles,
    PermissionsBitField.Flags.ViewChannel,
    PermissionsBitField.Flags.SendMessages
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
    console.error('1. Manage Channels');
    console.error('2. Manage Roles');
    console.error('3. View Channels');
    console.error('4. Send Messages');
    console.error('\nYou can fix this by:');
    console.error('1. Going to Server Settings > Roles');
    console.error('2. Selecting the bot\'s role');
    console.error('3. Enabling the required permissions');
    client.destroy();
    process.exit(1);
  }

  // Create roles if they don't exist
  console.log('Setting up roles...');
  const roles = {
    founders: guild.roles.cache.find((r: typeof Role) => r.name === 'Founders') || 
              await guild.roles.create({ name: 'Founders', color: '#FF0000', reason: 'Setup bot initialization' }),
    team: guild.roles.cache.find((r: typeof Role) => r.name === 'Team') || 
          await guild.roles.create({ name: 'Team', color: '#00FF00', reason: 'Setup bot initialization' }),
    everyone: guild.roles.everyone,
  };

  console.log('Roles setup complete:', Object.keys(roles).map(name => roles[name].name).join(', '));

  const channelPermissions = {
    'announcements': [
      { id: roles.founders.id, allow: [PermissionsBitField.Flags.SendMessages] },
      { id: roles.team.id, allow: [PermissionsBitField.Flags.SendMessages] },
      { id: roles.everyone.id, deny: [PermissionsBitField.Flags.SendMessages] },
    ],
    'rules': [
      { id: roles.founders.id, allow: [PermissionsBitField.Flags.SendMessages] },
      { id: roles.team.id, allow: [PermissionsBitField.Flags.SendMessages] },
      { id: roles.everyone.id, deny: [PermissionsBitField.Flags.SendMessages] },
    ],
    'token-info': [
      { id: roles.everyone.id, allow: [PermissionsBitField.Flags.SendMessages] },
    ],
    'nft-preview': [
      { id: roles.team.id, allow: [PermissionsBitField.Flags.SendMessages] },
      { id: roles.everyone.id, deny: [PermissionsBitField.Flags.SendMessages] },
    ],
    'community-events': [
      { id: roles.team.id, allow: [PermissionsBitField.Flags.SendMessages] },
      { id: roles.everyone.id, deny: [PermissionsBitField.Flags.SendMessages] },
    ],
    'support': [
      { id: roles.everyone.id, allow: [PermissionsBitField.Flags.SendMessages] },
    ],
  };

  // Create channels if they don't exist
  console.log('Setting up channels...');
  for (const [name, permissions] of Object.entries(channelPermissions)) {
    let channel = guild.channels.cache.find((c: typeof GuildChannel) => c.name === name);
    
    if (!channel) {
      try {
        console.log(`Creating channel #${name}...`);
        channel = await guild.channels.create({
          name: name,
          type: 0, // Text channel
          reason: 'Setup bot initialization'
        });
      } catch (error) {
        console.error(`❌ Failed to create channel #${name}:`, error.message);
        continue;
      }
    }

    if (!(channel instanceof TextChannel)) {
      console.warn(`Channel ${name} is not a text channel, skipping...`);
      continue;
    }

    try {
      await Promise.all(permissions.map(p => channel.permissionOverwrites.edit(p.id, {
        SendMessages: p.allow?.includes(PermissionsBitField.Flags.SendMessages) ?? undefined,
        ViewChannel: true,
      })));
      console.log(`✅ Permissions set for #${name}`);
    } catch (error) {
      console.error(`❌ Error setting permissions for #${name}:`, error.message);
    }
  }

  console.log('✅ Setup complete.');
  client.destroy();
});

// Add error handlers
client.on('error', (error: Error) => {
  console.error('Discord client error:', error);
});

process.on('unhandledRejection', (error: Error) => {
  console.error('Unhandled promise rejection:', error);
});

// Try to login
try {
  console.log('Attempting to login...');
  client.login(process.env.BOT_TOKEN);
} catch (error) {
  console.error('Login failed:', error);
  process.exit(1);
} 