import catalog from '../../research/uwh_playbook_expansion.json' with { type: 'json' };

// Types retain the complete research schema, including full snapshots and ordered paths.
export interface Point { x: number; y: number }
export type Formation = (typeof catalog.formations)[number];
export type BoardPlayer = (typeof catalog.sequences)[number]['initialState']['players'][number];
export interface BoardState { players: BoardPlayer[]; puck: { position: Point; carrierId: string | null } }
export type BoardStep = (typeof catalog.sequences)[number]['steps'][number];
export type BoardAction = BoardStep['actions'][number];
export type Scenario = (typeof catalog.sequences)[number] & { articleIds: string[]; drillIds: string[] };
export type Drill = (typeof catalog.drills)[number] & { articleIds: string[]; scenarioIds: string[] };
