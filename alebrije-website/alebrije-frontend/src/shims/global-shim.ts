// src/shims/global-shim.ts
if (typeof window !== 'undefined') {
  (window as any).global = window;
  (window as any).process = {
    env: {},
    browser: true,
  };
  (window as any).Buffer = (window as any).Buffer || require('buffer').Buffer;
}
