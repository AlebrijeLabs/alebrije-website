const express = require('express');
const cors = require('cors');
const { Connection, PublicKey } = require('@solana/web3.js');
const { TOKEN_PROGRAM_ID } = require('@solana/spl-token');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Solana connection
const connection = new Connection(process.env.SOLANA_RPC_URL);

// Token endpoints
app.get('/api/token/info', async (req, res) => {
    try {
        const mintAddress = new PublicKey(process.env.TOKEN_MINT_ADDRESS);
        const tokenInfo = await connection.getParsedAccountInfo(mintAddress);
        res.json(tokenInfo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/token/balance/:address', async (req, res) => {
    try {
        const walletAddress = new PublicKey(req.params.address);
        const mintAddress = new PublicKey(process.env.TOKEN_MINT_ADDRESS);
        
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
            walletAddress,
            { mint: mintAddress }
        );
        
        res.json(tokenAccounts.value);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 