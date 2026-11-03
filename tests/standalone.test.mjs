import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

test('the one-file presentation contains a runnable module with no remaining imports', () => {
  execFileSync(process.execPath, [fileURLToPath(new URL('../scripts/standalone.mjs', import.meta.url))]);
  const html = readFileSync(new URL('../fare-signal-demo.html', import.meta.url), 'utf8');
  const code = html.match(/<script type="module">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(code);
  assert.doesNotMatch(code, /^import /m);
  assert.match(code, /class JourneyDemo/);
  assert.doesNotMatch(html, /src="assets\//);
  assert.match(html, /src="data:image\/svg\+xml,/);
  execFileSync(process.execPath, ['--input-type=module', '--check'], { input: code });
});
