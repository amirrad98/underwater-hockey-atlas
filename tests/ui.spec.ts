import { test, expect } from '@playwright/test'
import { resources } from '../src/data'
import { suppliers } from '../src/suppliers'

test('shared search opens references and browser history remains usable', async ({ page }) => {
  await page.goto('/underwater-hockey-atlas/#/atlas')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  const search = page.getByRole('textbox', { name: 'Search atlas and wiki' })
  await search.fill('equipment')
  await search.press('Enter')
  await expect(page).toHaveURL(/#\/search\?q=equipment/)
  const article = page.locator('main a[href^="#/wiki/"]').first()
  await expect(article).toBeVisible()
  await article.click()
  await expect(page).toHaveURL(/#\/wiki\//)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.goBack()
  await expect(page).toHaveURL(/#\/search\?q=equipment/)
  await page.locator('main a[href^="#/wiki/"]').first().click()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.goBack()
  await expect(page).toHaveURL(/#\/search\?q=equipment/)
})

test('resources expose functional filters and source links', async ({ page }) => {
  await page.goto('/underwater-hockey-atlas/#/resources')
  for (const label of ['Topic', 'Language', 'Audience', 'Authority', 'Access']) {
    const filter = page.getByLabel(label, { exact: true })
    await expect(filter).toBeVisible()
    const options = await filter.locator('option').all()
    expect(options.length).toBeGreaterThan(1)
    const selected = await options[1].textContent()
    await filter.selectOption({ index: 1 })
    const key = label.toLowerCase() as 'topic' | 'language' | 'audience' | 'authority' | 'access'
    await expect(page.locator('.resource-grid .source')).toHaveCount(resources.filter(resource => resource[key] === selected).length)
    await filter.selectOption({ index: 0 })
  }
  expect(await page.locator('main a[href^="https://"]').count()).toBeGreaterThan(0)
  await page.getByRole('textbox', { name: 'Search resources', exact: true }).fill('definitely-no-resource-zzzz')
  await expect(page.getByRole('heading', { name: 'No matching resources' })).toBeVisible()
  await page.getByRole('button', { name: /Reset filters/ }).click()
  await expect(page.locator('.resource-grid .source')).toHaveCount(resources.length)
})

test('all sections support repeat navigation without overflow', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  for (const route of ['atlas', 'wiki', 'world', 'resources', 'suppliers', 'club', 'atlas']) {
    await page.goto(`/underwater-hockey-atlas/#/${route}`)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const aside = page.locator('main aside')
    if (await aside.count()) {
      const asideBox = await aside.boundingBox()
      const footerBox = await page.locator('footer').boundingBox()
      expect(asideBox!.y + asideBox!.height).toBeLessThanOrEqual(footerBox!.y)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true)
    await page.screenshot({ path: `test-results/${route}-${testInfo.project.name}.png`, fullPage: ['atlas', 'club', 'suppliers'].includes(route) })
  }
  expect(errors).toEqual([])
})

test('world map and list controls switch presentation', async ({ page }) => {
  await page.goto('/underwater-hockey-atlas/#/world')
  await page.getByRole('button', { name: 'List', exact: true }).click()
  await expect(page.locator('.map-panel')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'List', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'Map', exact: true }).click()
  await expect(page.locator('.map-panel')).toBeVisible()
  await page.getByRole('textbox', { name: 'Search places', exact: true }).fill('zzzz-no-place')
  await expect(page.getByText('No matching places. Try a country or community name.')).toBeVisible()
})

test('wiki category controls and article links resolve', async ({ page }) => {
  await page.goto('/underwater-hockey-atlas/#/wiki')
  const category = page.locator('.chips button').nth(1)
  const name = await category.textContent()
  await category.click()
  const labels = await page.locator('.article-card > small').allTextContents()
  expect(labels.length).toBeGreaterThan(0)
  expect(labels.every(label => label === name)).toBe(true)
  await page.getByRole('button', { name: 'All', exact: true }).click()
  const links = await page.locator('.article-card').evaluateAll(elements => elements.map(element => element.getAttribute('href')))
  for (const href of links) {
    await page.goto(`/underwater-hockey-atlas/${href}`)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Article not found' })).toHaveCount(0)
    await expect(page.getByRole('heading', { name: 'Sources & further reading' })).toBeVisible()
  }
})

test('keyboard can reach navigation and open a page', async ({ page }) => {
  await page.goto('/underwater-hockey-atlas/#/atlas')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  const wiki = page.locator('nav').getByRole('link', { name: 'Wiki', exact: true })
  if (!(await wiki.isVisible())) await page.getByRole('button', { name: 'Toggle navigation' }).click()
  await wiki.focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#\/wiki$/)
  await expect(page.locator('main')).toBeFocused()
})


test('supplier directory filters and resets verified records', async ({ page }) => {
  test.skip(suppliers.length === 0, 'Verified supplier research has not been imported')
  await page.goto('/underwater-hockey-atlas/#/suppliers')
  const first = suppliers[0]
  await expect(page.locator('.supplier').first().locator('.shipping-evidence')).toHaveText(first.shippingEvidence)
  const spearmaster = page.locator('.supplier').filter({ hasText: 'Spearmaster' })
  await spearmaster.locator('summary').click()
  await expect(spearmaster.locator('details')).toHaveAttribute('open', '')
  const publicLinks = await spearmaster.locator('a').evaluateAll(elements => elements.map(element => element.getAttribute('href')))
  expect(publicLinks.length).toBeGreaterThan(0)
  expect(publicLinks.every(href => href === 'https://spearmaster.co.za/')).toBe(true)
  await page.getByLabel('Gear category', { exact: true }).selectOption(first.categories[0])
  await expect(page.locator('.supplier')).toHaveCount(suppliers.filter(supplier => supplier.categories.includes(first.categories[0])).length)
  await page.getByLabel('Supplier country', { exact: true }).selectOption(first.country)
  await expect(page.locator('.supplier')).toHaveCount(suppliers.filter(supplier => supplier.categories.includes(first.categories[0]) && supplier.country === first.country).length)
  await page.getByRole('button', { name: 'Reset filters', exact: true }).click()
  await expect(page.locator('.supplier')).toHaveCount(suppliers.length)
  await page.getByRole('textbox', { name: 'Search suppliers', exact: true }).fill('no-supplier-zzzz')
  await expect(page.locator('.supplier')).toHaveCount(0)
})
