const { Client, GatewayIntentBits } = require('discord.js');

console.log('🔍 Testing Discord Bot Connection with hardcoded token...');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.once('ready', () => {
  console.log('✅ SUCCESS! Bot connected as:', client.user.tag);
  console.log('🆔 Bot ID:', client.user.id);
  console.log('🔗 Invite URL: https://discord.com/oauth2/authorize?client_id=' + client.user.id + '&permissions=8&scope=bot%20applications.commands');
  process.exit(0);
});

client.on('error', (error) => {
  console.log('❌ Client Error:', error.message);
  process.exit(1);
});

setTimeout(() => {
  console.log('⏰ Connection timeout after 15 seconds');
  process.exit(1);
}, 15000);

console.log('🚀 Attempting to login with new token...');
client.login('MTM3MjA0ODUyNjg3MTIzMjYyMw.GKtDVk.MzZmW7Altyq5DmnAAhQkQjSh7YhVZCGRg8MPvc').catch(err => {
  console.log('❌ Login failed:', err.message);
  console.log('📝 Error code:', err.code);
  process.exit(1);
}); 