# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
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

```
