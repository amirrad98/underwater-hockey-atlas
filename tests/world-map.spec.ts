import { test, expect } from '@playwright/test'
import { places } from '../src/data'

const mapped = places.filter((place) => place.lat !== null && place.lon !== null)
const worldRoute = '/underwater-hockey-atlas/#/world'

test('world overview renders real land and keeps every pin on the same projection', async ({ page }, testInfo) => {
  await page.goto(worldRoute)
  const basemap = page.getByRole('img', { name: 'World land outlines, including the continents and major islands' })
  await expect(basemap).toBeVisible()
  await expect(basemap).toHaveJSProperty('complete', true)
  const source = await basemap.getAttribute('src')
  expect(new URL(source!, page.url()).origin).toBe(new URL(page.url()).origin)

  // Inspect the actual rendered SVG, not just an image element or a path count.
  // Interior samples on every continent must be land; open-ocean samples must
  // stay transparent. This catches missing, decorative, or flipped geography.
  const samples = await basemap.evaluate((element) => {
    const canvas = document.createElement('canvas')
    canvas.width = 1440
    canvas.height = 720
    const context = canvas.getContext('2d')!
    context.drawImage(element as HTMLImageElement, 0, 0, 1440, 720)
    const locations = [
      { name: 'North America', lon: -100, lat: 40, land: true },
      { name: 'South America', lon: -55, lat: -15, land: true },
      { name: 'Europe', lon: 2, lat: 47, land: true },
      { name: 'Africa', lon: 20, lat: 5, land: true },
      { name: 'Asia', lon: 90, lat: 45, land: true },
      { name: 'Australia', lon: 135, lat: -25, land: true },
      { name: 'Antarctica', lon: 0, lat: -85, land: true },
      { name: 'Greenland', lon: -42, lat: 73, land: true },
      { name: 'New Zealand', lon: 175, lat: -39, land: true },
      { name: 'Pacific', lon: -140, lat: 0, land: false },
      { name: 'Atlantic', lon: -35, lat: 10, land: false },
      { name: 'Indian Ocean', lon: 80, lat: -20, land: false },
    ]
    return locations.map((location) => ({
      ...location,
      alpha: context.getImageData((location.lon + 180) * 4, (90 - location.lat) * 4, 1, 1).data[3],
    }))
  })
  for (const sample of samples) {
    expect(sample.alpha, sample.name).toBe(sample.land ? 255 : 0)
  }

  const bounds = await basemap.boundingBox()
  expect(bounds).not.toBeNull()
  expect(bounds!.width / bounds!.height).toBeCloseTo(2, 2)
  await expect(page.locator('.map-pin')).toHaveCount(mapped.length)
  for (const place of mapped) {
    const pin = page.getByRole('button', { name: `${place.name}: ${place.precision}`, exact: true })
    const point = await pin.boundingBox()
    expect(point).not.toBeNull()
    // Use the rendered land image as the frame, including its actual responsive
    // dimensions, rather than checking CSS percentages against themselves.
    expect(Math.abs(point!.x + point!.width / 2 - (bounds!.x + (place.lon! + 180) / 360 * bounds!.width)), place.name).toBeLessThan(0.75)
    expect(Math.abs(point!.y + point!.height / 2 - (bounds!.y + (90 - place.lat!) / 180 * bounds!.height)), place.name).toBeLessThan(0.75)
  }
  await page.locator('.map-panel').screenshot({ path: `test-results/world-basemap-${testInfo.project.name}.png` })
})

test('map and list preserve filters, unknown locations, precision and keyboard selection', async ({ page }) => {
  await page.goto(worldRoute)
  await expect(page.getByRole('button', { name: 'Map', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.place-card')).toHaveCount(places.length)
  for (const id of ['us-chicago', 'au-act', 'hk-uwh']) {
    const place = places.find((entry) => entry.id === id)!
    await expect(page.getByRole('button', { name: `${place.name}: ${place.precision}`, exact: true })).toHaveClass(/\bcity\b/)
  }

  const selected = places.find((place) => place.id === 'timber-whales')!
  const pin = page.getByRole('button', { name: `${selected.name}: ${selected.precision}`, exact: true })
  await pin.focus()
  await page.keyboard.press('Enter')
  await expect(pin).toBeFocused()
  await expect(pin).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('status')).toContainText(selected.name)
  await expect(page.getByRole('status')).toContainText(selected.precision)
  await expect(page.locator('.place-card').first()).toContainText(selected.name)
  await expect(page.locator('.place-card').first()).toHaveClass(/selected/)

  const unknown = places.find((place) => place.id === 'ca-camo')!
  await page.getByRole('textbox', { name: 'Search places', exact: true }).fill(unknown.name)
  await expect(page.locator('.map-pin')).toHaveCount(0)
  await expect(page.getByRole('img', { name: /World land outlines/ })).toBeVisible()
  await expect(page.locator('.place-card')).toHaveCount(1)
  await expect(page.locator('.place-card')).toContainText(unknown.precision)
  await expect(page.getByText('These records have no mapped coordinates.', { exact: false })).toBeVisible()
  await expect(page.getByRole('status')).not.toContainText(selected.name)
  const list = page.getByRole('button', { name: 'List', exact: true })
  await list.focus()
  await page.keyboard.press('Space')
  await expect(list).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.map-panel')).toHaveCount(0)
  await expect(page.locator('.place-card')).toHaveCount(1)
  await expect(page.getByRole('textbox', { name: 'Search places', exact: true })).toHaveValue(unknown.name)
  await page.getByRole('button', { name: 'Map', exact: true }).click()
  await expect(page.locator('.map-pin')).toHaveCount(0)
  await page.getByRole('textbox', { name: 'Search places', exact: true }).fill('')
  await expect(page.locator('.map-pin')).toHaveCount(mapped.length)
  await expect(page.locator('.place-card')).toHaveCount(places.length)
})

test('map, edge pins and long selected names remain inside narrow screens', async ({ page }) => {
  await page.goto(worldRoute)
  // Test below the standard mobile project's 390px viewport as well as tablet.
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 900 })
    const map = await page.locator('.world-map').boundingBox()
    expect(map!.width / map!.height).toBeCloseTo(2, 2)
    const panel = await page.locator('.map-panel').boundingBox()
    for (const pin of await page.locator('.map-pin').all()) {
      const bounds = await pin.boundingBox()
      expect(bounds!.x).toBeGreaterThanOrEqual(panel!.x)
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(panel!.x + panel!.width)
      await pin.focus()
      await page.keyboard.press('Enter')
      const selection = await page.getByRole('status').boundingBox()
      expect(selection!.x).toBeGreaterThanOrEqual(0)
      expect(selection!.x + selection!.width).toBeLessThanOrEqual(width)
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
    }
  }
})

test('local basemap loads with external requests blocked and remains usable offline', async ({ page, context }) => {
  const externalRequests: string[] = []
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url())
    if (url.hostname === '127.0.0.1') await route.continue()
    else {
      externalRequests.push(url.href)
      await route.abort()
    }
  })
  await page.goto(worldRoute)
  const basemap = page.locator('.world-basemap')
  await expect(basemap).toBeVisible()
  await expect(basemap).toHaveJSProperty('naturalWidth', 360)
  await expect(page.locator('.map-pin')).toHaveCount(mapped.length)
  // Existing global font requests are unrelated to map data. No map tile,
  // geocoding service, CDN geography, or other third-party request is permitted.
  expect(externalRequests.filter((url) => !/^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(url))).toEqual([])
  await context.setOffline(true)
  const search = page.getByRole('textbox', { name: 'Search places', exact: true })
  await search.fill('FINS')
  await expect(page.locator('.map-pin')).toHaveCount(1)
  await page.locator('.map-pin').click()
  await expect(page.getByRole('status')).toContainText('FINS')
  await page.getByRole('button', { name: 'List', exact: true }).click()
  await expect(page.locator('.place-card')).toHaveCount(1)
  await page.getByRole('button', { name: 'Map', exact: true }).click()
  await expect(page.locator('.map-pin')).toHaveCount(1)
  await expect(basemap).toHaveJSProperty('naturalWidth', 360)
})
