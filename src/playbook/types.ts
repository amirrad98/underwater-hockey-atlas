export interface Point { x: number; y: number }
export interface BoardPlayer extends Point { id: string; label: string; team: 'us' | 'them'; job: string }
export interface BoardArrow { from: Point; to: Point; kind: 'pass' | 'swim' | 'option' }
export interface BoardStep { id: string; title: string; explanation: string; players: BoardPlayer[]; puck: Point; arrows: BoardArrow[]; focus: string[]; question: string; answer: string }
export interface Scenario { id: string; title: string; level: string; summary: string; objective: string; articleIds: string[]; drillIds: string[]; sourceIds: string[]; steps: BoardStep[]; editorialStatus: string }
export interface Formation { id: string; title: string; summary: string; strengths: string; tradeoffs: string; discussion: string; players: BoardPlayer[]; sourceIds: string[] }
export interface Drill { id: string; title: string; level: string; format: string; purpose: string; players: string; equipment: string[]; setup: string[]; steps: string[]; cues: string[]; observe: string[]; easier: string; harder: string; debrief: string[]; safety: string; articleIds: string[]; scenarioIds: string[]; sourceIds: string[]; editorialStatus: string }
