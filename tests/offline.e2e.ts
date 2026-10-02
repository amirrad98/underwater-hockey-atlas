import { test, expect } from '@playwright/test';
import { scenarios, drills } from '../src/playbook/data';

test('first load stores all core routes and local assets for offline reload', async ({ page, context }) => {
  const external: string[] = [];
  page.on('request', request => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4197') external.push(request.url()); });
  await page.goto('/underwater-hockey-atlas/#/atlas');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise<void>(resolve => navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true }));
  });
  const scope = await page.evaluate(async () => (await navigator.serviceWorker.ready).scope);
  expect(scope).toBe('http://127.0.0.1:4197/underwater-hockey-atlas/');
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('depth of play');
  for (const route of ['wiki/passing', 'glossary/support', 'world', 'club', 'search?q=passing', `drills/${drills[0].id}`, `board/${scenarios[0].id}`]) {
    await page.goto(`/underwater-hockey-atlas/#/${route}`);
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: /not found/i })).toHaveCount(0);
    if (route.startsWith('board/')) {
      await page.getByRole('button', { name: 'Next', exact: true }).click();
      await expect(page.locator('.step-reading')).toContainText('STEP 1');
    }
    if (route === 'world') {
      const map = page.locator('.world-map');
      await expect(map).toBeVisible();
      await expect(page.locator('.world-basemap')).toHaveJSProperty('naturalWidth', 360);
      await expect(page.locator('.map-pin')).toHaveCount(13);
    }
  }
  await page.evaluate(() => document.fonts.ready);
  const loadedFonts = await page.evaluate(() => Array.from(document.fonts).filter(font => font.status === 'loaded').map(font => font.family.replaceAll('"', '')));
  expect(loadedFonts).toEqual(expect.arrayContaining(['DM Sans', 'Manrope']));
  expect(external).toEqual([]);
});

test('worker updates delete only this project’s old caches', async ({ page }) => {
  await page.goto('/underwater-hockey-atlas/#/wiki');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.evaluate(async () => {
    for (const key of ['unrelated-project-v1', 'uwh-atlas:/other-site/:old', 'uwh-atlas:/underwater-hockey-atlas/:old']) await caches.open(key);
    for (const registration of await navigator.serviceWorker.getRegistrations()) await registration.unregister();
    await navigator.serviceWorker.register('/underwater-hockey-atlas/sw.js?test-update', { scope: '/underwater-hockey-atlas/' });
  });
  await expect.poll(() => page.evaluate(async () => (await caches.keys()).includes('uwh-atlas:/underwater-hockey-atlas/:old'))).toBe(false);
  const keys = await page.evaluate(() => caches.keys());
  expect(keys).toContain('unrelated-project-v1');
  expect(keys).toContain('uwh-atlas:/other-site/:old');
});
