import catalog from '../../research/uwh_wiki_expansion.json' with { type: 'json' };
import type { Article, Resource } from '../data';

export const wikiCatalog = catalog;
export const articleAliases: Record<string, string> = { 'start-with-a-club': 'first-session', 'equipment-fit': 'equipment', 'passing-receiving': 'passing', 'rules-and-version-guide': 'rules', 'safe-practice-and-emergency-plans': 'safety' };
export const resolveArticleId = (id: string) => articleAliases[id] ?? id;

export function integrateWiki(baseArticles: Article[], baseResources: Resource[], canonical: (url: string) => string) {
  const resources = baseResources.map(source => ({ ...source, sourceRecords: [...(source.sourceRecords ?? [])] }));
  const sourceAliases: Record<string, string> = {};
  for (const source of catalog.sources) {
    const existing = resources.find(item => canonical(item.url) === canonical(source.url));
    if (existing) {
      sourceAliases[source.id] = existing.id;
      existing.sourceRecords.push({ catalog: 'wiki-expansion', ...source });
      // Preserve the original catalog's context as well as the newer inspection.
      existing.note += ` · Lesson source review (${source.checkedAt}): ${source.verificationStatus}. ${source.limitations}`;
    } else {
      const id = `lesson-${source.id}`;
      sourceAliases[source.id] = id;
      resources.push({ id, title: source.title, url: source.url, publisher: source.authority, authority: source.authority, topic: 'Learning', language: 'See source', audience: 'Players & coaches', access: 'See verification notes', status: source.verificationStatus, date: source.versionOrDate ?? source.checkedAt, checkedAt: source.checkedAt, version: source.versionOrDate ?? undefined, rights: source.reuse, jurisdiction: 'See source context', note: source.limitations, sourceRecords: [{ catalog: 'wiki-expansion', ...source }] });
    }
  }
  const expanded: Article[] = catalog.chapters.map(chapter => ({
    id: resolveArticleId(chapter.id), title: chapter.title, category: chapter.category, summary: chapter.summary,
    sections: chapter.sections.map(section => ({ ...section, body: [...section.paragraphs, ...('steps' in section ? section.steps ?? [] : []), ...('bullets' in section ? section.bullets ?? [] : [])].join('\n\n') })),
    sourceIds: chapter.sourceIds.map(id => sourceAliases[id]), related: chapter.related.map(resolveArticleId),
    learningGoals: chapter.learningObjectives, commonMistakes: chapter.commonMistakes, progressions: chapter.progressions,
    practiceSafety: chapter.practiceSafety, linkedConcepts: chapter.linkedConcepts, sourceNotes: chapter.sourceNotes.map(note => ({ ...note, sourceId: sourceAliases[note.sourceId] })),
    readerLevel: chapter.level, estimatedReadingMinutes: chapter.estimatedReadingMinutes, editorialStatus: chapter.authoringNote, updatedAt: chapter.checkedAt,
    originalLesson: chapter,
  }));
  const ids = new Set(expanded.map(article => article.id));
  return { resources, articles: [...baseArticles.filter(article => !ids.has(article.id)), ...expanded], sourceAliases };
}
