import test from 'node:test';
import assert from 'node:assert/strict';
import { articles, resources, lessonSourceAliases } from '../src/data.ts';
import { wikiCatalog, resolveArticleId } from '../src/wiki/catalog.ts';
import { clubProfile } from '../src/club-profile.ts';

test('expanded lessons preserve every paragraph, list, example and bounded source note', () => {
  assert.equal(wikiCatalog.chapters.length, 14);
  for (const chapter of wikiCatalog.chapters) {
    const article = articles.find(item => item.id === resolveArticleId(chapter.id));
    assert.ok(article, chapter.id);
    assert.deepEqual(article.originalLesson, chapter);
    assert.deepEqual(article.learningGoals, chapter.learningObjectives);
    assert.deepEqual(article.commonMistakes, chapter.commonMistakes);
    assert.deepEqual(article.progressions, chapter.progressions);
    assert.equal(article.practiceSafety, chapter.practiceSafety);
    for (const [index, section] of chapter.sections.entries()) {
      const rendered = article.sections[index];
      assert.deepEqual(rendered.paragraphs, section.paragraphs);
      if ('steps' in section) assert.deepEqual(rendered.steps, section.steps);
      if ('bullets' in section) assert.deepEqual(rendered.bullets, section.bullets);
    }
    for (const note of chapter.sourceNotes) {
      const source = resources.find(item => item.id === lessonSourceAliases[note.sourceId]);
      assert.ok(source, `${chapter.id}: ${note.sourceId}`);
      assert.ok(source.sourceRecords?.some(record => record.catalog === 'wiki-expansion' && record.id === note.sourceId));
      assert.ok(article.sourceNotes?.some(item => item.supports === note.supports && item.notClaimed === note.notClaimed));
    }
  }
});

test('reading paths, glossary relationships and shared safety sources resolve locally', () => {
  for (const path of wikiCatalog.readingPaths) for (const id of path.chapterIds) assert.ok(articles.some(item => item.id === resolveArticleId(id)), id);
  for (const article of articles) for (const id of article.linkedConcepts ?? []) assert.ok(wikiCatalog.conceptGlossary.some(item => item.id === id), `${article.id}: ${id}`);
  for (const note of wikiCatalog.safetyNotice.sourceNotes) assert.ok(resources.some(item => item.id === lessonSourceAliases[note.sourceId]));
});

test('club facts keep date and source context, and local gallery assets have provenance', () => {
  assert.ok(clubProfile.sections.length >= 8);
  for (const section of clubProfile.sections) for (const fact of section.facts) {
    assert.ok(fact.text && fact.status && fact.sourceIds.length);
    for (const id of fact.sourceIds) assert.ok(clubProfile.sources.some(source => source.id === id), `${section.id}: ${id}`);
  }
  assert.match(clubProfile.roster.note, /without a season|undated/i);
  for (const photo of clubProfile.gallery) {
    assert.ok(photo.src.startsWith('club/') && photo.originalSrc.startsWith('club/'));
    assert.ok(photo.alt && photo.caption && photo.credit && photo.rights && photo.sourcePageUrl && photo.sourceUrl);
  }
});
