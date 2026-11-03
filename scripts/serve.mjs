import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const port = Number(process.env.PORT || 8765);
const mime = { '.html': 'text/html', '.css': 'text/css', '.mjs': 'text/javascript', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.md': 'text/plain', '.json': 'application/json' };
const server = http.createServer(async (req, res) => {
  try {
    let name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (name === '/') name = '/index.html';
    const filename = path.resolve(root, '.' + name);
    if (!filename.startsWith(root + path.sep) || !(await stat(filename)).isFile()) throw new Error('Not found');
    const bytes = await readFile(filename);
    res.writeHead(200, { 'Content-Type': (mime[path.extname(filename)] || 'text/plain') + '; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    res.end(bytes);
  } catch { res.writeHead(404); res.end('Not found'); }
});
server.listen(port, '127.0.0.1', () => console.log(`Fare Signal preview: http://127.0.0.1:${port}`));
