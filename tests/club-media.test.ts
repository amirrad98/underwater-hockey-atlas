import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { extname } from 'node:path'
import source from '../research/timber-whales-media/manifest.json' with { type: 'json' }
import manifest from '../public/club/manifest.json' with { type: 'json' }
import { clubProfile } from '../src/club-profile.ts'

test('club media preserve source bytes, public provenance and explicitly published roster associations', () => {
  const media = [...manifest.photos, ...manifest.portraits, ...manifest.logos]
  assert.equal(source.assets.length, 41)
  assert.equal(media.length, source.assets.length)
  assert.equal(new Set(media.map(asset => asset.src)).size, media.length)
  assert.equal(new Set(media.map(asset => asset.sha256)).size, media.length)
  assert.deepEqual([manifest.photos.length, manifest.portraits.length, manifest.logos.length], [27, 12, 2])
  assert.deepEqual(clubProfile.media.map(asset => asset.id).sort(), media.map(asset => asset.id).sort())

  for (const original of source.assets) {
    const asset = media.find(item => item.sourceRecord.filename === original.filename)
    assert.ok(asset, `Source asset omitted: ${original.filename}`)
    assert.equal(asset.src, `club/${original.filename}`)
    assert.equal(asset.originalSrc, asset.src, `${asset.id}: do not relabel a derivative as the downloaded rendition`)
    const downloaded = readFileSync(new URL(`../research/timber-whales-media/${original.filename}`, import.meta.url))
    const published = readFileSync(new URL(`../public/${asset.src}`, import.meta.url))
    assert.ok(published.equals(downloaded), `${asset.id}: public bytes differ from source transfer`)
    assert.equal(published.length, original.bytes, asset.id)
    assert.equal(asset.bytes, original.bytes, asset.id)
    assert.equal(createHash('sha256').update(published).digest('hex'), original.sha256, asset.id)
    assert.equal(asset.sha256, original.sha256, asset.id)
    const detectedMime = published.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      ? 'image/png'
      : published.subarray(0, 3).equals(Buffer.from([255, 216, 255])) ? 'image/jpeg' : null
    assert.ok(detectedMime, `${asset.id}: unexpected or invalid image signature`)
    assert.equal(asset.mimeType, detectedMime, asset.id)
    assert.equal(original.mime_type, detectedMime, asset.id)
    assert.equal(extname(asset.src), detectedMime === 'image/png' ? '.png' : '.jpg', asset.id)
    assert.deepEqual([asset.width, asset.height], [original.width, original.height], asset.id)
    assert.deepEqual(asset.sourceRecord, original, `${asset.id}: retain the complete source record`)
    assert.equal(asset.sourceUrl, original.source_image_url, asset.id)
    assert.equal(asset.sourcePageUrl, original.source_page_url, asset.id)
    for (const [value, hostname] of [[asset.sourceUrl, 'static.wixstatic.com'], [asset.sourcePageUrl, 'timberwhales.wixsite.com']]) {
      const url = new URL(value)
      assert.equal(url.protocol, 'https:')
      assert.equal(url.hostname, hostname)
      assert.equal(url.search, '', `${asset.id}: do not publish transport credentials as provenance`)
    }
  }

  const portraitLabels = source.assets.filter(asset => asset.media_type === 'roster-portrait').map(asset => asset.published_person_label!)
  const placeholderLabels = source.not_included.find(item => item.type === 'roster-logo-placeholder')!.published_person_labels!
  assert.deepEqual(clubProfile.roster.people.map(person => person.name).sort(), [...portraitLabels, ...placeholderLabels].sort())
  assert.equal(clubProfile.roster.people.filter(person => person.usesLogoPlaceholder).length, 8)
  for (const person of clubProfile.roster.people) {
    assert.match(person.freshness, /undated.*unconfirmed/i)
    if (person.usesLogoPlaceholder) {
      assert.ok(placeholderLabels.includes(person.name), `${person.name}: not a published logo-placeholder entry`)
      assert.equal(person.photo.id, 'club-logo-2024')
    } else {
      const original = source.assets.find(asset => asset.published_person_label === person.name)
      assert.ok(original, `${person.name}: no adjacent published portrait label`)
      assert.equal(original.media_type, 'roster-portrait')
      assert.equal(person.photo.src, `club/${original.filename}`, `${person.name}: portrait association changed`)
    }
  }
})
