# Repository Settings

## Basic Settings

### Visibility
- [x] Public

### Description
"ALBJ Token – Spirit-powered meme coin on Solana with staking & lore."

### Topics
- solana
- token
- meme-coin
- staking
- anchor
- web3
- alebrije

## Branch Protection

### Main Branch
- [x] Require pull request reviews before merging
  - Required approving reviews: 1
  - Dismiss stale pull request approvals
  - Require review from Code Owners
- [x] Require status checks to pass before merging
  - Require branches to be up to date
  - Required status checks:
    - Build and Test workflow
    - Linting
    - TypeScript compilation
- [x] Require signed commits
- [x] Include administrators

### Develop Branch
- [x] Require pull request reviews before merging
  - Required approving reviews: 1
  - Dismiss stale pull request approvals
- [x] Require status checks to pass before merging
  - Required status checks:
    - Build and Test workflow
    - Linting

## GitHub Actions

### Workflows
1. Build and Test (`build-test.yml`)
   - Runs on push to main/develop
   - Runs on pull requests
   - Executes:
     - Linting
     - Unit tests
     - Build process

2. Deploy (`deploy.yml`)
   - Runs on push to main
   - Deploys to Netlify
   - Requires successful build and test

## Repository Secrets

### Required Secrets
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`
- `SOLANA_NETWORK`
- `SOLANA_RPC_URL`
- `TOKEN_MINT_ADDRESS`
- `TOKEN_DECIMALS`
- `TOKEN_TOTAL_SUPPLY`

## GitHub Pages

### Configuration
- Source: GitHub Actions
- Branch: gh-pages
- Custom domain: (if applicable)

## Team Structure

### Teams
1. `alebrije-admin`
   - Full repository access
   - Manages repository settings
   - Handles security-sensitive files

2. `alebrije-frontend-team`
   - Frontend development
   - UI/UX implementation
   - Frontend testing

3. `alebrije-contract-team`
   - Smart contract development
   - Solana program implementation
   - Contract testing

4. `alebrije-docs-team`
   - Documentation maintenance
   - Whitepaper updates
   - Technical writing

5. `alebrije-bot-team`
   - Bot development
   - Bot maintenance
   - Bot testing

6. `alebrije-test-team`
   - Test implementation
   - Test maintenance
   - Quality assurance

## Labels

### Issue Labels
- `bug`: Something isn't working
- `documentation`: Improvements or updates to documentation
- `enhancement`: New feature or request
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `priority: high`: High priority
- `priority: low`: Low priority
- `priority: medium`: Medium priority
- `security`: Security related
- `stake`: Staking related
- `token`: Token related
- `web3`: Web3 integration related

### Pull Request Labels
- `breaking`: Breaking changes
- `dependencies`: Dependency updates
- `ready for review`: Ready for review
- `work in progress`: Not ready for review
- `needs testing`: Requires testing
- `needs documentation`: Requires documentation 