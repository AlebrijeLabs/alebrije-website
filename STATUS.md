### 🛡 bigint-buffer Vulnerability Patch

> **Note**: The `bigint-buffer` package (used by `@solana/web3.js`) has a known high-severity vulnerability (`toBigIntLE()` buffer overflow).  
> As of April 2025, the vulnerability affects `@solana/web3.js` versions `1.43.1` through `1.98.0`, which are dependencies of:
> - `@coral-xyz/anchor`
> - `@solana/wallet-adapter-*`
> - `@toruslabs/solana-embed`

To mitigate this without breaking compatibility:

1. We applied a forced resolution to patch `bigint-buffer` to version `1.1.5` (safe version).

```json
"resolutions": {
  "bigint-buffer": "1.1.5"
}
```

2. Applied using:
```bash
npm install -g npm-force-resolutions
npx npm-force-resolutions
npm install
```

3. Confirmed via:
```bash
npm ls bigint-buffer
```

This ensures security during development and early deployment, while we await an official fix from the Solana ecosystem.
