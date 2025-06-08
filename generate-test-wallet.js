const { Keypair } = require('@solana/web3.js');

console.log('🎯 GENERATING TEST WALLET FOR DASHBOARD TESTING...\n');

const testWallet = Keypair.generate();

console.log('📋 TEST WALLET GENERATED:');
console.log('Address:', testWallet.publicKey.toString());
console.log('');
console.log('💾 SAVE THIS ADDRESS - You\'ll use it for transfer testing!');
console.log('✅ Ready for wallet dashboard tests'); 