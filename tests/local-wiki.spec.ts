import { test, expect } from '@playwright/test';
import { wikiCatalog, resolveArticleId } from '../src/wiki/catalog';
import { clubProfile } from '../src/club-profile';

test('expanded lessons render their full teaching body and optional evidence locally', async ({ page }) => {
  const external: string[] = [];
  page.on('request', request => { if (!new URL(request.url()).hostname.match(/^(127\.0\.0\.1|localhost)$/)) external.push(request.url()); });
  for (const chapter of wikiCatalog.chapters) {
    await page.goto(`/underwater-hockey-atlas/#/wiki/${resolveArticleId(chapter.id)}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(chapter.title);
    for (const section of chapter.sections) {
      for (const paragraph of section.paragraphs) await expect(page.getByText(paragraph, { exact: true })).toBeVisible();
      for (const item of ('steps' in section ? section.steps ?? [] : [])) await expect(page.getByText(item, { exact: true })).toBeVisible();
      for (const item of ('bullets' in section ? section.bullets ?? [] : [])) await expect(page.getByText(item, { exact: true })).toBeVisible();
    }
    for (const item of chapter.commonMistakes) await expect(page.getByText(item.correction, { exact: true })).toBeVisible();
    for (const item of chapter.progressions) await expect(page.getByText(item, { exact: true })).toBeVisible();
    await page.locator('.lesson-safety summary').click();
    await expect(page.locator('.lesson-safety')).toContainText(chapter.practiceSafety);
    await page.locator('.article-sources > summary').click();
    for (const note of chapter.sourceNotes) await expect(page.getByText(note.supports, { exact: true })).toBeVisible();
    await expect(page.locator('.article-sources a').first()).toHaveAttribute('href', /^https:\/\//);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
  expect(external).toEqual([]);
});

test('reading paths, keyboard contents and concept links stay on local routes', async ({ page }) => {
  await page.goto('/underwater-hockey-atlas/#/wiki');
  await page.getByRole('button', { name: 'Intermediate', exact: true }).click();
  await expect(page.locator('.page > .article-grid .article-card')).toHaveCount(wikiCatalog.chapters.filter(chapter => chapter.level === 'Intermediate').length);
  await page.locator('.reading-paths a[href="#/wiki/first-session"]').first().click();
  const section = wikiCatalog.chapters[0].sections[1];
  const tocButton = page.locator('.article-contents').getByRole('button', { name: section.heading });
  await tocButton.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: section.heading, exact: true })).toBeFocused();
  await page.locator('.lesson-concepts summary').first().click();
  await page.locator('.lesson-concepts a').first().click();
  await expect(page).toHaveURL(/#\/glossary\//);
  await expect(page.getByRole('heading', { level: 1 })).not.toHaveText('Concept not found');
  await expect(page.locator('main')).toBeFocused();
});

test('club profile shows full local facts with dated source context', async ({ page }) => {
  await page.goto('/underwater-hockey-atlas/#/club');
  for (const section of clubProfile.sections) {
    await expect(page.getByRole('heading', { name: section.title, exact: true })).toBeVisible();
    for (const fact of section.facts) await expect(page.getByText(fact.text, { exact: true })).toBeVisible();
  }
  await expect(page.getByText(clubProfile.roster.note, { exact: true })).toBeVisible();
});

test('club photo gallery renders actual local photographs when supplied', async ({ page }) => {
  test.skip(clubProfile.gallery.length === 0, 'Club photograph files are pending verified asset transfer; no photo-rendering claim is made.');
  await page.goto('/underwater-hockey-atlas/#/club');
  const images = page.locator('.club-gallery img');
  await expect(images).toHaveCount(clubProfile.gallery.length);
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveAttribute('src', /^\/underwater-hockey-atlas\/club\//);
    expect(await image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  }
});


test('skip link is hidden until focused and moves focus without changing the route', async ({ page }) => {
  await page.goto('/underwater-hockey-atlas/#/wiki');
  const skip = page.getByRole('link', { name: 'Skip to content', exact: true });
  expect(await skip.evaluate(element => getComputedStyle(element).clipPath)).toBe('inset(50%)');
  await skip.focus();
  await expect(skip).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await expect(page).toHaveURL(/#\/wiki$/);
});
