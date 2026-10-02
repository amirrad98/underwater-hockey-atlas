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

test('club photo gallery renders every local photograph with natural proportions and source rights', async ({ page }) => {
  test.setTimeout(90_000); // Decode and inspect every photograph in the complete gallery.
  expect(clubProfile.gallery).toHaveLength(27);
  const externalRequests: string[] = [];
  page.on('request', request => { if (!new URL(request.url()).hostname.match(/^(127\.0\.0\.1|localhost)$/)) externalRequests.push(request.url()); });
  await page.goto('/underwater-hockey-atlas/#/club');
  const images = page.locator('.club-gallery img');
  await expect(images).toHaveCount(Math.min(6, clubProfile.gallery.length));
  if (clubProfile.gallery.length > 6) {
    const expand = page.getByRole('button', { name: `Show all ${clubProfile.gallery.length} photos`, exact: true });
    await expand.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('button', { name: 'Show fewer photos', exact: true })).toHaveAttribute('aria-expanded', 'true');
  }
  await expect(images).toHaveCount(clubProfile.gallery.length);
  for (const [index, photo] of clubProfile.gallery.entries()) {
    const figure = page.locator('.club-gallery figure').nth(index);
    const image = figure.locator('img');
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveAttribute('src', `/underwater-hockey-atlas/${photo.src}`);
    await expect(image).toHaveAttribute('alt', photo.alt);
    await image.evaluate(element => (element as HTMLImageElement).decode());
    await expect(image).toHaveJSProperty('naturalWidth', photo.width);
    await expect(image).toHaveJSProperty('naturalHeight', photo.height);
    const bounds = await image.boundingBox();
    expect(bounds!.width / bounds!.height).toBeCloseTo(photo.width / photo.height, 2);
    await expect(figure.getByText(photo.caption, { exact: true })).toBeVisible();
    await expect(figure.getByText(photo.credit, { exact: true })).toBeVisible();
    await expect(figure.getByRole('link', { name: `Open full photograph: ${photo.alt}`, exact: true })).toHaveAttribute('href', `/underwater-hockey-atlas/${photo.originalSrc}`);
    await figure.locator('summary').click();
    await expect(figure.getByText(photo.rights, { exact: true })).toBeVisible();
    await expect(figure.locator(`a[href="${photo.sourcePageUrl}"]`)).toBeVisible();
    await expect(figure.locator(`a[href="${photo.sourceUrl}"]`)).toBeVisible();
  }
  expect(externalRequests).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  if (clubProfile.gallery.length > 6) {
    await page.getByRole('button', { name: 'Show fewer photos', exact: true }).click();
    await expect(images).toHaveCount(6);
    await expect(page.locator('.club-gallery [role="status"]')).toHaveText(`Showing 6 of ${clubProfile.gallery.length} photographs`);
  }
});

test('club hero and published roster show local portraits, explicit logo placeholders and undated labels', async ({ page }) => {
  test.setTimeout(90_000);
  const externalRequests: string[] = [];
  const mediaResponses = new Map<string, string>();
  page.on('request', request => { if (!new URL(request.url()).hostname.match(/^(127\.0\.0\.1|localhost)$/)) externalRequests.push(request.url()); });
  page.on('response', response => { if (response.url().includes('/club/')) mediaResponses.set(new URL(response.url()).pathname, response.headers()['content-type'] ?? ''); });
  await page.goto('/underwater-hockey-atlas/#/club');
  await expect(page.locator('.club-hero-photo')).toContainText('FROM THE 2023–2024 CLUB GALLERY');
  await expect(page.locator('.club-roster .roster-freshness')).toHaveText(clubProfile.roster.note);
  await expect(page.locator('.club-roster')).toContainText('do not establish current membership or office');
  const heroPhotos = [{ selector: '.club-hero-photo img', photo: clubProfile.hero }, { selector: '.club-header-logo', photo: clubProfile.logos[0] }];
  for (const { selector, photo } of heroPhotos) {
    const image = page.locator(selector);
    await image.evaluate(element => (element as HTMLImageElement).decode());
    await expect(image).toHaveJSProperty('naturalWidth', photo.width);
    await expect(image).toHaveJSProperty('naturalHeight', photo.height);
    await expect(image).toHaveAttribute('src', `/underwater-hockey-atlas/${photo.src}`);
  }
  await expect(page.locator('.club-roster-card')).toHaveCount(20);
  expect(clubProfile.roster.people.filter(person => !person.usesLogoPlaceholder)).toHaveLength(12);
  expect(clubProfile.roster.people.filter(person => person.usesLogoPlaceholder)).toHaveLength(8);
  for (const [index, person] of clubProfile.roster.people.entries()) {
    const card = page.locator('.club-roster-card').nth(index);
    const image = card.locator('img');
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(element => (element as HTMLImageElement).decode());
    await expect(image).toHaveJSProperty('naturalWidth', person.photo.width);
    await expect(image).toHaveJSProperty('naturalHeight', person.photo.height);
    await expect(image).toHaveAttribute('src', `/underwater-hockey-atlas/${person.photo.src}`);
    const bounds = await image.boundingBox();
    expect(bounds!.width / bounds!.height).toBeCloseTo(person.photo.width / person.photo.height, 2);
    await expect(card.getByRole('heading', { name: person.name, exact: true })).toBeVisible();
    await expect(card.locator('.club-published-role')).toHaveText(`Published role · undated${person.publishedRole}`);
    if (person.usesLogoPlaceholder) {
      await expect(image).toHaveAttribute('alt', `Club logo placeholder for ${person.name}; no portrait published`);
      await expect(card.getByText('Club logo · no portrait published', { exact: true })).toBeVisible();
    } else await expect(image).toHaveAttribute('alt', person.photo.alt);
    await card.locator('summary').click();
    await expect(card.getByText(person.photo.rights, { exact: true })).toBeVisible();
    await expect(card.locator(`a[href="${person.photo.sourceUrl}"]`)).toBeVisible();
  }
  for (const photo of [...heroPhotos.map(item => item.photo), ...clubProfile.roster.people.map(person => person.photo)]) {
    expect(mediaResponses.get(`/underwater-hockey-atlas/${photo.src}`)).toMatch(photo.src.endsWith('.png') ? /^image\/png/ : /^image\/jpeg/);
  }
  expect(externalRequests).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
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
