import { playbookSourceAliases } from '../data';
import { playbookCatalog } from './catalog';
import type { Drill, Formation, Scenario } from './types';

// Local relationships join independently authored lessons and practices by their actual topic.
const sequenceLinks: Record<string, { articles: string[]; drills: string[] }> = {
  'tactic-recycle-triangle': { articles: ['team-support', 'passing'], drills: ['drill-support-visible-triangle', 'drill-pass-receive-release'] },
  'tactic-wall-release': { articles: ['team-support', 'passing', 'formations'], drills: ['drill-wall-open-outlet'] },
  'tactic-two-link-switch': { articles: ['team-support', 'formations', 'passing'], drills: ['drill-width-two-channel-switch'] },
  'tactic-read-two-v-one': { articles: ['small-sided-games', 'team-support', 'passing'], drills: ['drill-two-one-read-defender', 'drill-receive-scan-choose'] },
  'tactic-turn-and-return': { articles: ['puck-control', 'passing'], drills: ['drill-control-two-exits', 'drill-pass-receive-release'] },
  'tactic-pressure-cover': { articles: ['transition', 'formations', 'team-support'], drills: ['drill-pressure-cover-pair'] },
  'tactic-loss-rebuild': { articles: ['transition', 'formations'], drills: ['drill-turnover-first-jobs'] },
  'tactic-regain-outlet': { articles: ['transition', 'team-support', 'passing', 'read-the-strike'], drills: ['drill-turnover-first-jobs', 'drill-start-first-outlet'] },
  'tactic-goal-cutback': { articles: ['passing', 'team-support'], drills: ['drill-finish-clear-lane'] },
  'tactic-availability-handover': { articles: ['team-support', 'formations', 'safety'], drills: ['drill-availability-confirmed-outlet'] },
};
const drillArticles: Record<string, string[]> = {
  'drill-control-two-exits': ['puck-control', 'passing'],
  'drill-pass-receive-release': ['passing', 'puck-control'],
  'drill-support-visible-triangle': ['team-support', 'passing'],
  'drill-wall-open-outlet': ['team-support', 'passing'],
  'drill-width-two-channel-switch': ['team-support', 'formations'],
  'drill-two-one-read-defender': ['small-sided-games', 'team-support'],
  'drill-pressure-cover-pair': ['transition', 'formations'],
  'drill-turnover-first-jobs': ['transition', 'read-the-strike'],
  'drill-receive-scan-choose': ['passing', 'puck-control'],
  'drill-finish-clear-lane': ['passing', 'team-support'],
  'drill-availability-confirmed-outlet': ['team-support', 'safety'],
  'drill-shape-dryland-walkthrough': ['formations', 'coaching-pathways'],
  'drill-review-pause-predict': ['video-review', 'coaching-pathways'],
  'drill-start-first-outlet': ['read-the-strike', 'passing'],
};
const sources = (ids: string[]) => ids.map(id => {
  const resolved = playbookSourceAliases[id];
  if (!resolved) throw new Error(`Unresolved playbook source: ${id}`);
  return resolved;
});
export const formations: Formation[] = playbookCatalog.formations.map(item => ({ ...item, sourceIds: sources(item.sourceIds) }));
export const scenarios: Scenario[] = playbookCatalog.sequences.map(item => ({ ...item, sourceIds: sources(item.sourceIds), articleIds: sequenceLinks[item.id].articles, drillIds: sequenceLinks[item.id].drills }));
export const drills: Drill[] = playbookCatalog.drills.map(item => ({ ...item, sourceIds: sources(item.sourceIds), articleIds: drillArticles[item.id], scenarioIds: scenarios.filter(scenario => scenario.drillIds.includes(item.id)).map(scenario => scenario.id) }));
