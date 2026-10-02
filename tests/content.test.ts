import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { importedResources } from '../src/research-data.ts'
import { articles, resources, places, canonicalSourceUrl } from '../src/data.ts'

test('catalog identities and canonical resource URLs are unique', () => {
  for (const records of [articles, resources, places]) {
    assert.equal(new Set(records.map(record => record.id)).size, records.length)
    assert.ok(records.every(record => /^[A-Za-z0-9_-]+$/.test(record.id)))
  }
  assert.equal(new Set(resources.map(record => canonicalSourceUrl(record.url))).size, resources.length)
})

test('article source and related links resolve, and articles have substantive sections', () => {
  for (const article of articles) {
    assert.ok(article.sections.length >= 2, article.id)
    assert.ok(article.sourceIds.length > 0, article.id)
    for (const section of article.sections) assert.ok(section.heading && section.body.length > 60, article.id)
    for (const id of article.sourceIds) assert.ok(resources.some(resource => resource.id === id), `${article.id} missing source ${id}`)
    for (const id of article.related) assert.ok(articles.some(other => other.id === id), `${article.id} missing related article ${id}`)
  }
})

test('source metadata and internal resource routes remain explicit', () => {
  for (const resource of resources) {
    for (const key of ['publisher', 'topic', 'language', 'audience', 'authority', 'access', 'status', 'date', 'note'] as const) assert.ok(resource[key], `${resource.id} missing ${key}`)
    if (resource.url.startsWith('#/')) {
      assert.ok(resource.url.startsWith('#/wiki/'), `${resource.id}: unsupported internal route`)
      assert.ok(articles.some(article => resource.url === `#/wiki/${article.id}`))
    } else assert.equal(new URL(resource.url).protocol, 'https:')
  }
})

test('geography never guesses unknown coordinates', () => {
  for (const place of places) {
    assert.equal(place.lat === null, place.lon === null, place.id)
    if (place.lat !== null && place.lon !== null) {
      assert.ok(Math.abs(place.lat) <= 90 && Math.abs(place.lon) <= 180, place.id)
      assert.match(place.precision, /city|approximate|venue|suburb|island/i)
    } else assert.match(place.precision, /unknown|unpin|not pinned|not geocoded|national|no /i)
  }
})


test('all original source records survive the deduplicated import', () => {
  const catalogs = [
    ['uwh_coaching_equipment.json', 'sources'],
    ['uwh_rules_safety.json', 'resources'],
    ['uwh_world_directory.json', 'sources'],
    ['uwh_timber_whales.json', 'sources'],
  ]
  const count = catalogs.reduce((total, [file, key]) => total + JSON.parse(readFileSync(new URL(`../research/${file}`, import.meta.url), 'utf8'))[key].length, 0)
  const preserved = importedResources.flatMap(resource => resource.sourceRecords ?? [])
  assert.equal(preserved.length, count)
  assert.ok(importedResources.every(resource => resource.sourceRecords?.length && resource.rights && resource.jurisdiction))
})
