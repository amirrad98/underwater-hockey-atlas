import catalog from '../../research/uwh_playbook_expansion.json' with { type: 'json' };
import type { Resource } from '../data';
export const playbookCatalog = catalog;

export function integratePlaybookSources(baseResources: Resource[], canonical: (url: string) => string) {
  const resources = baseResources.map(source => ({ ...source, sourceRecords: [...(source.sourceRecords ?? [])] }));
  const sourceAliases: Record<string, string> = {};
  for (const source of catalog.sources) {
    const existing = resources.find(item => canonical(item.url) === canonical(source.url));
    const note = [source.use, source.catalogVerification, 'checkedThisPass' in source ? source.checkedThisPass : ''].filter(Boolean).join(' · ');
    if (existing) {
      sourceAliases[source.id] = existing.id;
      existing.sourceRecords.push({ catalog: 'playbook-expansion', ...source });
      existing.note += ` · Playbook source context: ${note}`;
    } else {
      const id = `playbook-${source.id}`;
      sourceAliases[source.id] = id;
      resources.push({ id, title: source.title, url: source.url, publisher: source.authority, authority: source.authority, topic: 'Coaching', language: 'See source', audience: 'Players & coaches', access: 'See verification notes', status: source.catalogVerification, date: source.dateOrVersion ?? source.catalogCheckedAt, checkedAt: source.catalogCheckedAt, version: source.dateOrVersion ?? undefined, rights: 'rights' in source ? source.rights : 'No reuse license established; linked for context', jurisdiction: 'See source context', note, sourceRecords: [{ catalog: 'playbook-expansion', ...source }] });
    }
  }
  return { resources, sourceAliases };
}
