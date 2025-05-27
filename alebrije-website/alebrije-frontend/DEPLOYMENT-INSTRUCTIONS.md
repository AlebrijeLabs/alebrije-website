# ALBJ Token Website Deployment Instructions

This guide provides comprehensive instructions for deploying the ALBJ Token website to Netlify, including both manual and automated deployment options.

## Prerequisites

1. Node.js 18+ installed
2. npm or yarn installed
3. Netlify CLI installed (`npm install -g netlify-cli`)
4. Netlify account with site created
5. GitHub account with repository access

## Environment Variables

Set the following environment variables in your Netlify dashboard:

```bash
SOLANA_NETWORK=mainnet
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
TOKEN_MINT_ADDRESS=<your_token_mint_address>
TOKEN_DECIMALS=9
TOKEN_TOTAL_SUPPLY=9000000000
```

## Deployment Options

### 1. Automated Deployment (Recommended)

The project uses GitHub Actions for automated deployment. To set up:

1. Add the following secrets to your GitHub repository:
   - `NETLIFY_AUTH_TOKEN`: Your Netlify authentication token
   - `NETLIFY_SITE_ID`: Your Netlify site ID
   - `SOLANA_NETWORK`: The Solana network to use
   - `SOLANA_RPC_URL`: RPC URL for the Solana network
   - `TOKEN_MINT_ADDRESS`: The ALBJ token mint address
   - `TOKEN_DECIMALS`: Number of decimals for the token
   - `TOKEN_TOTAL_SUPPLY`: Total supply of the token

2. Push to the main branch to trigger deployment:
```bash
git push origin main
```

### 2. Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to Netlify:
```bash
netlify deploy --prod --dir=dist
```

## Deployment Checklist

### Pre-deployment
- [ ] All environment variables are set
- [ ] Build process completes successfully
- [ ] All tests pass
- [ ] Documentation is up to date
- [ ] Whitepaper is properly formatted

### During Deployment
- [ ] Verify build output in Netlify dashboard
- [ ] Check for any deployment errors
- [ ] Verify environment variables are loaded
- [ ] Test the deployed site

### Post-deployment
- [ ] Verify all features work on production
- [ ] Check mobile responsiveness
- [ ] Test wallet connections
- [ ] Verify token transfers
- [ ] Check staking functionality
- [ ] Test whitepaper downloads

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Environment Variables**
   - Ensure all required variables are set
   - Verify variable values are correct
   - Check for typos in variable names

3. **Deployment Errors**
   - Check Netlify build logs
   - Verify Netlify CLI is up to date
   - Check for file size limits

### Support

For deployment support:
1. Check the [GitHub Issues](https://github.com/your-repo/issues)
2. Contact the development team
3. Join our [Discord community](https://discord.gg/alebrijetoken)

## Monitoring

After deployment, monitor:
- Site performance
- Error rates
- User interactions
- Token transactions
- Staking activities

## Rollback Procedure

If issues are detected:
1. Identify the problematic deployment
2. Use Netlify's rollback feature
3. Deploy the last known good version
4. Document the issue and resolution 