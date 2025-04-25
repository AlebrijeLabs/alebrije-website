// src/shims/global-shim.ts
import { Buffer } from 'buffer';
(window as any).Buffer = Buffer;
