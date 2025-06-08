const fs = require('fs');
const { Keypair } = require('@solana/web3.js');

const airdropTarget = 'GviehEcGycFk8W9v6Ft3hysGd42iMPYtRT2KABKWXNph';
const foundersTarget = 'F121WYj8S8MkRirXr7bHWRUAY6vHCekd2k7EGpURD1aN';

const keypairFiles = [
  './new-token-keypair.json',
  './alebrije-website/secure-keys/wallet2.json',
  './alebrije-website/secure-keys/wallet3.json', 
  './alebrije-website/secure-keys/dev-wallet-keypair.json',
  './alebrije-website/secure-keys/dev-mint-authority-keypair.json',
  './alebrije-website/alebrije-wallet/alebrije-keypair.json',
  './alebrije-wallet/alebrije-keypair.json'
];

console.log('🔍 Searching for Airdrop wallet keypair...\n');
console.log(`Target Airdrop address: ${airdropTarget}`);
console.log(`Target Founders address: ${foundersTarget}\n`);

let foundAirdrop = false;

for (const file of keypairFiles) {
  try {
    if (!fs.existsSync(file)) {
      console.log(`❌ ${file} - File not found`);
      continue;
    }
    
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const keypair = Keypair.fromSecretKey(new Uint8Array(data));
    const publicKey = keypair.publicKey.toString();
    
    console.log(`📂 ${file}`);
    console.log(`   Public Key: ${publicKey}`);
    
    if (publicKey === airdropTarget) {
      console.log(`   🎯 ✅ FOUND AIRDROP WALLET KEYPAIR! 🎉`);
      foundAirdrop = true;
    } else if (publicKey === foundersTarget) {
      console.log(`   👥 ✅ Founders wallet (already known)`);
    } else {
      console.log(`   ❓ Different wallet`);
    }
    console.log();
    
  } catch (error) {
    console.log(`❌ ${file} - Error: ${error.message}\n`);
  }
}

if (foundAirdrop) {
  console.log('🎉 SUCCESS! Found the Airdrop wallet keypair!');
  console.log('✅ You can now proceed with the full rebalancing script.');
} else {
  console.log('❌ Airdrop wallet keypair not found in any of the checked files.');
  console.log('💡 You may need to:');
  console.log('   1. Check for other keypair files');
  console.log('   2. Regenerate the Airdrop wallet keypair');
  console.log('   3. Use a different distribution strategy');
} 