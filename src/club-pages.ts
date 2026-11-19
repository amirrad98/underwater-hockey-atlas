// Which club page each profile section is published on.
export const clubSectionPage: Record<string, 'join' | 'about'> = {
  practice: 'join',
  join: 'join',
  membership: 'join',
  equipment: 'join',
  contact: 'join',
  history: 'about',
  activities: 'about',
  'schedule-history': 'about',
};
export const clubPageIds = ['join', 'team', 'gallery', 'about'] as const;
