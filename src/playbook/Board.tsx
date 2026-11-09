import { useId, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, RotateCcw } from 'lucide-react';
import { articles, resources } from '../data';
import { drills, formations, scenarios } from './data';
import { playbookCatalog } from './catalog';
import type { BoardAction, BoardPlayer, BoardState, Point, Scenario } from './types';
import './playbook.css';

const xy = (point: Point) => ({ x: 65 + point.x * 4.7, y: 40 + point.y * 3.5 });

export function TacticalDiagram({ state, actions = [], title, description }: {
  state: BoardState; actions?: BoardAction[]; title: string; description: string;
}) {
  const id = useId().replaceAll(':', '');
  return <svg className="board tactical-diagram" viewBox="0 0 600 440" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
    <title id={`${id}-title`}>{title}</title><desc id={`${id}-desc`}>{description}</desc>
    <defs>
      <pattern id={`${id}-grid`} width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0H0V25" fill="none" stroke="#7fadaf" strokeWidth=".6" opacity=".25" /></pattern>
      {['pass', 'move', 'carry'].map(kind => <marker key={kind} id={`${id}-${kind}`} viewBox="0 0 10 10" refX="30" refY="5" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="12" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill={kind === 'pass' ? '#edc97b' : '#9be8d6'} /></marker>)}
    </defs>
    <rect x="50" y="25" width="500" height="380" rx="5" fill={`url(#${id}-grid)`} stroke="#81c5be" />
    <path d="M50 215H550" stroke="#81c5be" strokeDasharray="5 7" opacity=".35" />
    <path d="M260 26H340M260 404H340" stroke="#edc97b" strokeWidth="6" />
    <text x="300" y="16" textAnchor="middle" fill="#c5dfdc" fontSize="11" letterSpacing="2">TEAM A ATTACKS ↑</text>
    <text x="300" y="430" textAnchor="middle" fill="#c5dfdc" fontSize="11" letterSpacing="2">TEAM B ATTACKS ↓</text>
    {actions.map(action => {
      const points = action.path.map(point => { const mapped = xy(point); return `${mapped.x},${mapped.y}`; }).join(' ');
      const moving = ['pass', 'move', 'carry'].includes(action.kind);
      if (!moving) return null;
      return <g key={action.order} data-action-kind={action.kind} data-actor-id={action.actorId}>
        <title>{action.order}. {action.actorId}: {action.note}</title>
        {action.kind === 'carry' && <polyline points={points} fill="none" stroke="#edc97b" strokeWidth="7" strokeLinejoin="round" />}
        <polyline points={points} fill="none" stroke={action.kind === 'pass' ? '#edc97b' : '#9be8d6'} strokeWidth={action.kind === 'carry' ? 3 : 2.8} strokeLinejoin="round" strokeDasharray={action.kind === 'pass' ? '7 5' : undefined} markerEnd={`url(#${id}-${action.kind})`} />
      </g>;
    })}
    {state.players.map(player => {
      const position = xy(player.position), reference = player.availability !== 'available';
      const color = player.team === 'A' ? '#9be8d6' : '#eaae9c';
      return <g key={player.id} data-player-id={player.id} data-x={player.position.x} data-y={player.position.y} data-availability={player.availability}>
        <title>{player.id} · {player.label} · {player.role} · {player.availability}</title>
        {player.team === 'A' ? <circle cx={position.x} cy={position.y} r="17" fill={reference ? '#0d3944' : color} stroke={color} strokeWidth="2" /> : <rect x={position.x - 16} y={position.y - 16} width="32" height="32" rx="4" fill={reference ? '#0d3944' : color} stroke={color} strokeWidth="2" />}
        <text x={position.x} y={position.y + 4} textAnchor="middle" fill={reference ? color : '#082f39'} fontSize="11" fontWeight="700">{player.id}</text>
        {reference && <g><circle cx={position.x + 16} cy={position.y - 16} r="8" fill="#f0eee1" /><text x={position.x + 16} y={position.y - 13} textAnchor="middle" fill="#123d40" fontSize="9" fontWeight="700">{player.availability === 'surface' ? 'S' : 'R'}</text></g>}
      </g>;
    })}
    <g data-puck-carrier={state.puck.carrierId ?? 'none'}><title>Puck{state.puck.carrierId ? ` controlled by ${state.puck.carrierId}` : ', no current carrier'}</title><circle cx={xy(state.puck.position).x + (state.puck.carrierId ? 20 : 0)} cy={xy(state.puck.position).y + (state.puck.carrierId ? 12 : 0)} r="8" fill="#edc97b" stroke="#052b34" strokeWidth="2" /><text x={xy(state.puck.position).x + (state.puck.carrierId ? 20 : 0)} y={xy(state.puck.position).y + (state.puck.carrierId ? 15 : 3)} textAnchor="middle" fill="#052b34" fontSize="8" fontWeight="700">P</text></g>
  </svg>;
}

function PlayerJobs({ players }: { players: BoardPlayer[] }) {
  return <details className="player-jobs"><summary>Player labels, positions & availability</summary><ul>{players.map(player => <li key={player.id}><strong>{player.id} · {player.label} · {player.role}</strong><span>{player.availability === 'surface' ? 'At the surface — unavailable as a receiver' : player.availability === 'reference' ? 'Reference role — depth unspecified' : 'Available in this decision snapshot'} · x {player.position.x}, y {player.position.y}</span></li>)}</ul></details>;
}

export function PointList({ items }: { items: string[] }) { return <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>; }

export function FormationBoard({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState(formations[0].id);
  const formation = formations.find(item => item.id === selected) ?? formations[0];
  return <div className={`formation-board ${compact ? 'compact' : ''}`}>
    <div className="board-wrap"><div className="board-top"><span>TACTICAL FIELD NOTES</span><span>TEAM SHAPE</span></div>
      <TacticalDiagram state={formation.referenceState} title={`Conceptual ${formation.name} formation, not to scale`} description={formation.textAlternative} />
      <div className="board-bottom"><div className="segmented" aria-label="Formation">{formations.map(item => <button key={item.id} aria-pressed={item.id === formation.id} onClick={() => setSelected(item.id)}>{item.name}</button>)}</div><span>R = role reference · not to scale</span></div>
    </div>
    {compact && <div className="formation-notes"><h3>{formation.name} · Front to back</h3><p>{formation.summary}</p><p>{formation.explanation}</p><p className="diagram-note">{formation.status}</p>
      <details className="formation-details" open><summary>Responsibilities & phase changes</summary><dl>{formation.roleResponsibilities.map(role => <div key={role.actorId}><dt>{role.actorId} · {role.role}</dt><dd>{role.responsibility}</dd></div>)}</dl><h4>In possession</h4><PointList items={formation.inPossession} /><h4>Out of possession</h4><PointList items={formation.outOfPossession} /><h4>On a turnover</h4><PointList items={formation.onTurnover} /><h4>Tradeoffs</h4><PointList items={formation.tradeoffs} /><h4>Coaching cues</h4><PointList items={formation.coachCues} /><h4>Discuss the shape</h4><PointList items={formation.discussionQuestions} /></details>
      <PlayerJobs players={formation.referenceState.players} /><details className="text-alternative"><summary>Read the diagram</summary><p>{formation.textAlternative}</p></details><SourceEvidence sourceIds={formation.sourceIds} editorialStatus={formation.sourceRelationship} />
    </div>}
  </div>;
}

export function SourceEvidence({ sourceIds, editorialStatus }: { sourceIds: string[]; editorialStatus?: string }) {
  return <details className="playbook-sources"><summary>Sources & editorial context ({sourceIds.length})</summary>{editorialStatus && <p>{editorialStatus}</p>}<ul>{sourceIds.map(id => {
    const resource = resources.find(item => item.id === id);
    return resource ? <li key={id}><a href={resource.url} target="_blank" rel="noreferrer">{resource.title} ↗</a><p>{resource.note}</p><small>{resource.publisher} · {resource.status} · {resource.checkedAt ?? resource.date}</small></li> : null;
  })}</ul></details>;
}

export function PracticeLinks({ articleIds = [], drillIds = [], scenarioIds = [] }: { articleIds?: string[]; drillIds?: string[]; scenarioIds?: string[] }) {
  return <div className="practice-links">
    {articleIds.map(id => { const article = articles.find(item => item.id === id); return article && <a key={`article-${id}`} href={`#/wiki/${id}`}><small>READ</small><span>{article.title}</span><ArrowUpRight size={16} /></a>; })}
    {drillIds.map(id => { const drill = drills.find(item => item.id === id); return drill && <a key={`drill-${id}`} href={`#/drills/${id}`}><small>PRACTISE</small><span>{drill.title}</span><ArrowUpRight size={16} /></a>; })}
    {scenarioIds.map(id => { const scenario = scenarios.find(item => item.id === id); return scenario && <a key={`scenario-${id}`} href={`#/board/${id}`}><small>VISUALIZE</small><span>{scenario.title}</span><ArrowUpRight size={16} /></a>; })}
  </div>;
}

export function PlaybookSafety() {
  return <details className="lesson-safety"><summary>Supervision, surfacing & safe practice</summary><p>{playbookCatalog.meta.safety.requiredContext}</p><PointList items={playbookCatalog.meta.safety.nonNegotiables} /><p>{playbookCatalog.meta.safety.trainingFocus}</p></details>;
}

function ScenarioPlayer({ scenario }: { scenario: Scenario }) {
  const [frame, setFrame] = useState(0);
  const [answer, setAnswer] = useState(false);
  const [before, setBefore] = useState(false);
  const step = frame ? scenario.steps[frame - 1] : undefined;
  const state = before || !step ? frame > 1 ? scenario.steps[frame - 2].state : scenario.initialState : step.state;
  const title = step?.title ?? 'Read the starting picture';
  const move = (index: number) => { setFrame(index); setAnswer(false); setBefore(false); };
  return <section className="scenario-player" aria-label={scenario.title}>
    <div className="scenario-heading"><div className="eyebrow">{scenario.level} · {scenario.phase} · {scenario.steps.length} STEPS</div><h2>{scenario.title}</h2><p>{scenario.scenario}</p><p className="scenario-objective"><strong>Objective</strong> {scenario.purpose}</p></div>
    <p className="availability-note">{scenario.surfacingPolicy}</p>
    <div className="scenario-layout"><div>
      <div className="board-wrap"><div className="board-top"><span>{title}</span><span>{frame ? `${frame} / ${scenario.steps.length}` : 'INITIAL FRAME'}</span></div>
        <TacticalDiagram state={state} actions={step?.actions ?? []} title={`${scenario.title}: ${frame ? `step ${frame}` : 'initial frame'}, ${title}`} description={step?.textAlternative ?? scenario.scenario} />
        <div className="board-legend"><span>● Team A</span><span>■ Team B</span><span className="pass-key">⇢ Pass</span><span>→ Move</span><span className="carry-key">⇒ Carry puck</span><span>S = Surface</span><span className="pass-key">P = Puck</span></div>
      </div>
      <p className="frame-state">{step ? before ? 'Positions before these actions' : 'Positions after these actions' : 'Starting positions'} · Puck: {state.puck.carrierId ?? 'no carrier'}</p>
      <div className="board-controls" aria-label="Scenario playback"><button onClick={() => move(frame - 1)} disabled={frame === 0}><ArrowLeft size={16} /> Previous</button><button onClick={() => move(0)} aria-label="Restart scenario"><RotateCcw size={16} /> Restart</button><button onClick={() => move(frame + 1)} disabled={frame === scenario.steps.length}>Next <ArrowRight size={16} /></button></div>
      <ol className="step-progress" aria-label="Scenario steps"><li><button aria-current={frame === 0 ? 'step' : undefined} aria-label="Initial frame" onClick={() => move(0)}>0</button></li>{scenario.steps.map((item, index) => <li key={item.id}><button aria-current={index + 1 === frame ? 'step' : undefined} aria-label={`Step ${index + 1}: ${item.title}`} onClick={() => move(index + 1)}>{index + 1}</button></li>)}</ol>
      {step && <label className="before-toggle"><input type="checkbox" checked={before} onChange={event => setBefore(event.target.checked)} /> Compare starting positions for this step</label>}
      <PlayerJobs players={state.players} />
      <details className="text-alternative"><summary>Read this frame without the diagram</summary><p>{step?.textAlternative ?? scenario.scenario}</p></details>
    </div><div className="step-reading">
      <div aria-live="polite" aria-atomic="true"><small>{frame ? `STEP ${frame} OF ${scenario.steps.length}` : 'INITIAL FRAME'}</small><h3>{title}</h3><p>{step?.description ?? scenario.purpose}</p></div>
      {step ? <><h4>Actions, in order</h4><ol className="action-list">{step.actions.map(action => <li key={action.order}><strong>{action.actorId} · {action.kind}{'targetActorId' in action && action.targetActorId ? ` → ${action.targetActorId}` : ''}</strong><span>{action.note}</span></li>)}</ol><h4>What the coach can observe</h4><p>{step.coachObservable}</p><div className="self-check"><h4>Read the play</h4><p>{step.readCue}</p><button aria-expanded={answer} onClick={() => setAnswer(!answer)}>{answer ? 'Hide alternative' : 'If the option closes'}</button>{answer && <p className="coaching-answer">{step.ifUnavailableOrClosed}</p>}</div></> : <><h4>Recognition cues</h4><PointList items={scenario.recognitionCues} /><h4>Who does what?</h4><dl className="scenario-roles">{Object.entries(scenario.roles).map(([actor, role]) => <div key={actor}><dt>{actor}</dt><dd>{role}</dd></div>)}</dl></>}
    </div></div>
    <p className="diagram-note">{scenario.opponentScope} {playbookCatalog.meta.board.poolScale}</p>
    {'practiceStopNote' in scenario && <p className="availability-note">{scenario.practiceStopNote}</p>}
    {'boardAnnotations' in scenario && scenario.boardAnnotations?.map(note => <p className="diagram-note" key={note.label}>{note.label}</p>)}
    {'branches' in scenario && scenario.branches && <section className="scenario-branches"><h3>Other decisions at step {scenario.branches[0].atStep}</h3>{scenario.branches.map(branch => <div key={branch.cue}><h4>{branch.cue}</h4><p>{branch.choice}</p><small>{branch.illustrated ? 'Shown in the board sequence' : 'Discussion alternative; no coordinate path asserted'}</small></div>)}</section>}
    <div className="scenario-review"><section><h3>What opponents can change</h3><PointList items={scenario.counterplay} /></section><section><h3>Tradeoffs</h3><PointList items={scenario.tradeoffs} /></section><section><h3>Take it back to practice</h3><p>{scenario.takeaway}</p><PointList items={scenario.debriefQuestions} /></section></div>
    <PracticeLinks articleIds={scenario.articleIds} drillIds={scenario.drillIds} />
    <details className="text-alternative"><summary>Read the complete sequence</summary><p>{scenario.textAlternative}</p></details>
    <SourceEvidence sourceIds={scenario.sourceIds} editorialStatus={scenario.sourceRelationship} />
  </section>;
}

export function BoardPage({ id }: { id?: string }) {
  const scenario = id ? scenarios.find(item => item.id === id) : scenarios[0];
  if (!scenario) return <div className="page"><h1>Scenario not found</h1><a href="#/board">Browse the tactical board</a></div>;
  return <div className="page playbook-page">
    <div className="page-heading"><div className="eyebrow">THE TACTICAL BOARD</div><h1>Read the play. Move together.</h1><p>Walk through a play one decision at a time. Follow the puck, compare support positions, and discuss the next move.</p></div>
    <div className="playbook-toolbar"><label>Choose a scenario<select aria-label="Choose a scenario" value={scenario.id} onChange={event => { location.hash = `/board/${event.target.value}`; }}>{scenarios.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label><a className="text-link" href="#/drills">Open the drill library <ArrowUpRight size={17} /></a></div>
    <PlaybookSafety />
    <ScenarioPlayer key={scenario.id} scenario={scenario} />
    <section className="formation-section"><div><div className="eyebrow">THE STARTING SHAPE</div><h2>Compare formations.</h2><p>A formation is a shared starting reference. Read each player’s responsibility, then consider how that shape changes around the puck.</p><a className="text-link" href="#/wiki/formations">Read the formation guide <ArrowUpRight size={17} /></a></div><FormationBoard compact /></section>
    <section className="board-coach-guide"><h2>{playbookCatalog.coachGuide.title}</h2><ol>{playbookCatalog.coachGuide.procedure.map(item => <li key={item}>{item}</li>)}</ol><h3>Discussion prompts</h3><PointList items={playbookCatalog.coachGuide.discussionPrompts} /><p>{playbookCatalog.coachGuide.sessionPlanning}</p></section>
    <section className="board-concepts"><h2>Ideas behind the board</h2>{playbookCatalog.concepts.map(concept => <details key={concept.id}><summary>{concept.title}</summary><p>{concept.body}</p></details>)}</section>
    <section><h2>Explore the playbook</h2><div className="article-grid">{scenarios.map(item => <a className="article-card" href={`#/board/${item.id}`} key={item.id}><small>{item.level} · {item.steps.length} steps</small><h3>{item.title}<ArrowUpRight size={17} /></h3><p>{item.purpose}</p></a>)}</div></section>
  </div>;
}
