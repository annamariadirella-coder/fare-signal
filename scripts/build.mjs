import { mkdir, cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
// Only the generated dist directory inside this repository is replaced.
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const name of ['index.html', 'demo', 'src', 'assets', 'docs', 'README.md', 'LICENSE']) {
  await cp(new URL(name, root), new URL(name, dist), { recursive: true });
}
console.log(`Static site built: ${fileURLToPath(dist)}`);
