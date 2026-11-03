import { mkdir, cp, rm, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
// Only the generated dist directory inside this repository is replaced.
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const name of ['index.html', 'demo', 'src', 'assets', 'docs', 'README.md', 'LICENSE']) {
  await cp(new URL(name, root), new URL(name, dist), { recursive: true });
}
// A new page must not reuse an older cached controller or stylesheet after publication.
let html = await readFile(new URL('index.html', dist), 'utf8');
for (const asset of ['demo/app.mjs', 'demo/styles.css', 'assets/telegram-example.svg']) {
  const hash = createHash('sha256').update(await readFile(new URL(asset, dist))).digest('hex').slice(0, 12);
  html = html.replaceAll(`"${asset}"`, `"${asset}?v=${hash}"`);
}
await writeFile(new URL('index.html', dist), html);
console.log(`Static site built: ${fileURLToPath(dist)}`);
