// Use the publisher's browser bundle, never bundle Node inference into Next.js.
import { copyFile, mkdir } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
await mkdir(new URL('public/voice/', root), { recursive: true });
await copyFile(new URL('node_modules/kokoro-js/dist/kokoro.web.js', root), new URL('public/voice/kokoro-1.2.1.mjs', root));
await copyFile(new URL('node_modules/kokoro-js/LICENSE', root), new URL('public/voice/KOKORO-LICENSE.txt', root));
console.log('Heart browser runtime prepared. Models load only when voice is requested.');
