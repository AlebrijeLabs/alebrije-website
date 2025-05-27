# ALBJ Token Frontend

A React application for interacting with ALBJ tokens on the Solana blockchain.

## Features

- Connect to Solana wallet (Phantom, Solflare)
- View token and SOL balances
- Transfer ALBJ tokens
- View transaction history
- Token information display

## Tech Stack

- React 19
- TypeScript
- Solana Web3.js
- Vite

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000.

## Building for Production

```bash
# Build the application
npm run build
```

The build output will be in the `dist` directory.

## Deployment

The application is configured for deployment on Netlify. See `DEPLOYMENT-INSTRUCTIONS.md` for detailed steps.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

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

## Test Deployment
Testing CI/CD pipeline with Netlify deployment.

## Development
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Test
```bash
npm test
```
