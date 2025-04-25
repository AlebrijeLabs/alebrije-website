# XOLO Token Frontend

A React application for interacting with XOLO tokens on the Solana blockchain.

## Features

- Token burning
- Token transfers
- Whitepaper access
- Wallet connection with Phantom

## Tech Stack

- React 19
- TypeScript
- Solana Web3.js
- Vite

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Running Locally

```bash
# Start development server
npm run dev
```

The application will be available at http://localhost:3000.

## Building for Production

```bash
# Build the application
npm run build
```

The build output will be in the `dist` directory.

## Deploying to Netlify

This project includes a custom deployment script to ensure large files like the whitepaper are handled correctly.

### Using the Deployment Script

```bash
# Make the script executable (if needed)
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

### Manual Deployment

1. Build the project: `npm run build`
2. Install Netlify CLI: `npm install -g netlify-cli`
3. Deploy to Netlify: `netlify deploy --prod`

## Whitepaper Access

The application includes multiple ways to access the whitepaper:

1. Main download button in the application
2. Alternative download options via the "Whitepaper Alternatives" button
3. Direct access via `/whitepaper.html` for a lightweight version
4. Direct access via `/whitepaper.pdf` for the full PDF

## Troubleshooting

### PDF Not Loading

If the PDF whitepaper is not loading:

1. Check that the file exists in the `public` directory
2. Make sure Netlify is configured to handle large files (see `netlify.toml`)
3. Try the HTML version of the whitepaper as a fallback

### Development Server Showing Blank Page

If the development server shows a blank page:

1. Check the browser console for errors
2. Make sure you're using the correct URL (default is http://localhost:3000)
3. Try clearing your browser cache or using incognito mode
4. Restart the development server with `npm run dev`

## License

MIT
