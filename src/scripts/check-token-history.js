const { Connection, PublicKey } = require('@solana/web3.js');
const { TOKEN_PROGRAM_ID } = require('@solana/spl-token');

async function checkTokenHistory() {
  try {
    // Connect to Solana Devnet
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
    // Token mint addresses
    const firstTokenMint = new PublicKey('G8xNrjfTBTMASoUox7TgBn2wq6aGLJ5U78qY5JdEJKhN');
    const secondTokenMint = new PublicKey('6cADm55k89hs4YvGXMac9Q8EAXEtTe16ZqeBk7GHA83w');
    
    console.log('Checking First Token (ALB) History:');
    console.log('--------------------------------');
    
    // Get signatures for the first token
    const firstTokenSignatures = await connection.getSignaturesForAddress(firstTokenMint, { limit: 10 });
    
    for (const sig of firstTokenSignatures) {
      const tx = await connection.getTransaction(sig.signature, {
        maxSupportedTransactionVersion: 0
      });
      
      console.log(`\nTransaction: ${sig.signature}`);
      console.log(`Time: ${new Date(tx.blockTime * 1000).toLocaleString()}`);
      console.log(`Status: ${tx.meta.status === 'Ok' ? 'Success' : 'Failed'}`);
      
      // Get token transfers
      const tokenTransfers = tx.meta.postTokenBalances.map((post, index) => {
        const pre = tx.meta.preTokenBalances[index];
        if (pre && post.mint === firstTokenMint.toString()) {
          const change = Number(post.uiTokenAmount.uiAmount) - Number(pre.uiTokenAmount.uiAmount);
          return {
            account: post.owner,
            change: change
          };
        }
        return null;
      }).filter(t => t !== null);
      
      if (tokenTransfers.length > 0) {
        console.log('Token Transfers:');
        tokenTransfers.forEach(t => {
          console.log(`  Account: ${t.account}`);
          console.log(`  Change: ${t.change > 0 ? '+' : ''}${t.change} tokens`);
        });
      }
    }
    
    console.log('\nChecking Second Token (ALBJ) History:');
    console.log('----------------------------------');
    
    // Get signatures for the second token
    const secondTokenSignatures = await connection.getSignaturesForAddress(secondTokenMint, { limit: 10 });
    
    for (const sig of secondTokenSignatures) {
      const tx = await connection.getTransaction(sig.signature, {
        maxSupportedTransactionVersion: 0
      });
      
      console.log(`\nTransaction: ${sig.signature}`);
      console.log(`Time: ${new Date(tx.blockTime * 1000).toLocaleString()}`);
      console.log(`Status: ${tx.meta.status === 'Ok' ? 'Success' : 'Failed'}`);
      
      // Get token transfers
      const tokenTransfers = tx.meta.postTokenBalances.map((post, index) => {
        const pre = tx.meta.preTokenBalances[index];
        if (pre && post.mint === secondTokenMint.toString()) {
          const change = Number(post.uiTokenAmount.uiAmount) - Number(pre.uiTokenAmount.uiAmount);
          return {
            account: post.owner,
            change: change
          };
        }
        return null;
      }).filter(t => t !== null);
      
      if (tokenTransfers.length > 0) {
        console.log('Token Transfers:');
        tokenTransfers.forEach(t => {
          console.log(`  Account: ${t.account}`);
          console.log(`  Change: ${t.change > 0 ? '+' : ''}${t.change} tokens`);
        });
      }
    }
    
  } catch (error) {
    console.error('Error checking token history:', error);
  }
}

checkTokenHistory(); 