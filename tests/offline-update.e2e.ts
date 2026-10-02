import { test, expect } from '@playwright/test';
import { createServer } from 'node:http';
import { cpSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { extname, join, resolve } from 'node:path';

// Serve two complete local production asset sets from the same origin. Version two
// changes the actual shell, JS and CSS URLs and service-worker revision together.
test('a worker update and refresh use the new shell and assets, including offline', async ({ page, context }) => {
  const directory = mkdtempSync(join(tmpdir(), 'atlas-offline-update-'));
  const v1 = join(directory, 'v1'), v2 = join(directory, 'v2');
  cpSync(resolve('dist'), v1, { recursive: true });
  cpSync(resolve('dist'), v2, { recursive: true });
  const originalHtml = readFileSync(join(v1, 'index.html'), 'utf8');
  writeFileSync(join(v1, 'index.html'), originalHtml.replace('<body>', '<body data-test-build="v1">'));
  const script = originalHtml.match(/src="\/underwater-hockey-atlas\/(assets\/[^" ]+\.js)"/)![1];
  const style = originalHtml.match(/href="\/underwater-hockey-atlas\/(assets\/[^" ]+\.css)"/)![1];
  const nextScript = script.replace('.js', '-upgrade.js'), nextStyle = style.replace('.css', '-upgrade.css');
  writeFileSync(join(v2, nextScript), `${readFileSync(join(v2, script), 'utf8')}\nwindow.__atlasUpgrade = 'v2';`);
  writeFileSync(join(v2, nextStyle), `${readFileSync(join(v2, style), 'utf8')}\n:root { --atlas-upgrade: v2; }`);
  writeFileSync(join(v2, 'index.html'), originalHtml.replace('<body>', '<body data-test-build="v2">').replace(script, nextScript).replace(style, nextStyle));
  const worker = readFileSync(join(v2, 'sw.js'), 'utf8').replace(/const CACHE = PREFIX \+ "([a-z0-9]+)";/, 'const CACHE = PREFIX + "$1-upgrade";').replaceAll(script, nextScript).replaceAll(style, nextStyle);
  writeFileSync(join(v2, 'sw.js'), worker);
  let active = v1;
  const mime: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.ttf': 'font/ttf', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
  const server = createServer((request, response) => {
    const url = new URL(request.url!, 'http://localhost');
    const path = url.pathname.replace(/^\/underwater-hockey-atlas\//, '') || 'index.html';
    const file = resolve(active, path);
    if (!file.startsWith(active + '/')) { response.writeHead(404).end(); return; }
    try { response.writeHead(200, { 'Content-Type': mime[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store', Vary: 'Origin' }); response.end(readFileSync(file)); }
    catch { response.writeHead(404).end(); }
  });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Expected a local HTTP port');
  const url = `http://127.0.0.1:${address.port}/underwater-hockey-atlas/#/wiki/passing`;
  try {
    await page.goto(url);
    await page.evaluate(async () => { await navigator.serviceWorker.ready; if (!navigator.serviceWorker.controller) await new Promise<void>(resolve => navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true })); });
    await expect(page.locator('body')).toHaveAttribute('data-test-build', 'v1');
    active = v2;
    await page.evaluate(async () => {
      const changed = new Promise<void>(resolve => navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true }));
      await (await navigator.serviceWorker.ready).update();
      await changed;
    });
    await page.reload();
    await expect(page.locator('body')).toHaveAttribute('data-test-build', 'v2');
    await expect.poll(() => page.evaluate(() => (window as unknown as { __atlasUpgrade?: string }).__atlasUpgrade)).toBe('v2');
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--atlas-upgrade').trim())).toBe('v2');
    await context.setOffline(true);
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Make a pass usable');
    await expect(page.locator('body')).toHaveAttribute('data-test-build', 'v2');
    await expect.poll(() => page.evaluate(() => (window as unknown as { __atlasUpgrade?: string }).__atlasUpgrade)).toBe('v2');
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--atlas-upgrade').trim())).toBe('v2');
    const owned = await page.evaluate(async () => (await caches.keys()).filter(key => key.startsWith('uwh-atlas:/underwater-hockey-atlas/:')));
    expect(owned).toHaveLength(1);
    expect(owned[0]).toMatch(/-upgrade$/);
  } finally {
    await context.setOffline(false);
    await new Promise<void>(resolve => server.close(() => resolve()));
    rmSync(directory, { recursive: true, force: true });
  }
});
