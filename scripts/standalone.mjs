import { readFile, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const text = file => readFile(new URL(file, root), 'utf8');
let html = await text('index.html');
const css = await text('demo/styles.css');
const stripExports = code => code.replace(/^export /gm, '');
const stripImports = code => code.replace(/^import .*;\r?\n/gm, '');
const engine = stripExports(await text('src/monitor.mjs'));
const fixtures = stripExports(stripImports(await text('demo/fixtures.mjs'))).replace(/\bsettings\b/g, 'defaults');
const app = stripImports(await text('demo/app.mjs'));
const journey = stripExports(await text('demo/journey.mjs'));
const icon = 'data:image/svg+xml,' + encodeURIComponent(await text('assets/favicon.svg'));
html = html.replace('<link rel="stylesheet" href="demo/styles.css">', `<style>${css}</style>`)
  .replace('<script type="module" src="demo/app.mjs"></script>', `<script type="module">\n${engine}\n${fixtures}\n${journey}\n${app}\n</script>`)
  .replace('href="assets/favicon.svg"', `href="${icon}"`)
  .replace(/href="(?:README\.md|LICENSE|docs\/[^\"]+)"/g, 'href="#principles"');
await writeFile(new URL('fare-signal-demo.html', root), html);
console.log('Self-contained, offline demo created: fare-signal-demo.html');
