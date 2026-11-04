import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const root = fileURLToPath(new URL('../', import.meta.url));
const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (['.git', 'dist', 'node_modules'].includes(entry.name)) continue;
    const filename = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(filename); else files.push(filename);
  }
}
await walk(root);
let failures = [];
for (const filename of files) {
  if (/\.(png|gif|zip|mp4)$/.test(filename)) continue;
  const text = await readFile(filename, 'utf8');
  if (filename.endsWith('.mjs')) {
    try { execFileSync(process.execPath, ['--check', filename], { stdio: 'pipe' }); }
    catch { failures.push(path.relative(root, filename) + ': JavaScript syntax error'); }
  }
  // Credential patterns and known private-project identifiers must never enter this clean repository.
  const patterns = [/\b\d{8,12}:[A-Za-z0-9_-]{30,}\b/, /\bgh[pousr]_[A-Za-z0-9]{20,}\b/,
    new RegExp(['db-ice1008', '-price-watch'].join(''))];
  for (const expression of patterns) if (expression.test(text)) failures.push(path.relative(root, filename) + ': private data pattern');
}
for (const page of ['index.html', 'demo-video.html']) {
  const html = await readFile(path.join(root, page), 'utf8');
  for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
    const link = match[1];
    if (link.includes('://')) { failures.push('External page dependency: ' + link); continue; }
    const local = link.split('#')[0].split('?')[0];
    try { await readFile(path.join(root, local)); } catch { failures.push('Missing local asset: ' + link); }
  }
}
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log(`Checked ${files.length} files: local assets present, no private-project or credential patterns found.`);
