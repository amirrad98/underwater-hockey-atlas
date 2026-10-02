import { useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import { drills } from './data';
import { PracticeLinks, SourceEvidence, PlaybookSafety, PointList } from './Board';

export function DrillsPage({ id }: { id?: string }) {
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('All');
  if (id) {
    const drill = drills.find(item => item.id === id);
    if (!drill) return <div className="page"><h1>Drill not found</h1><a href="#/drills">Browse drills</a></div>;
    return <div className="page article-page drill-page">
      <a className="breadcrumb" href="#/drills">Drills / {drill.level}</a>
      <div className="page-heading"><div className="eyebrow">{drill.level} · ORIGINAL PRACTICE CARD</div><h1>{drill.title}</h1><p>{drill.purpose}</p></div>
      <div className="drill-safety"><strong>Supervised practice</strong><p>{drill.people.supervision}</p><PointList items={drill.safety} /></div><PlaybookSafety />
      <div className="article-layout"><article>
        <section><h2>Set up</h2><dl className="drill-kit"><dt>Players</dt><dd>{drill.people.activePlayers} active participants · {drill.people.roles.join(' · ')}</dd><dt>Equipment</dt><dd>{drill.equipment.join(' · ')}</dd></dl><p>{drill.setup}</p></section>
        <section><h2>Run the drill</h2><ol>{drill.procedure.map(item => <li key={item}>{item}</li>)}</ol></section>
        <section><h2>Reset & rotate</h2><p>{drill.resetAndRotation}</p></section>
        <section><h2>What to observe</h2><PointList items={drill.coachObservations} /></section>
        <section><h2>Adapt the practice</h2><div className="adaptations"><div><h3>Make it easier</h3><p>{drill.adaptations.easier}</p></div><div><h3>Add a challenge</h3><p>{drill.adaptations.harder}</p></div></div></section>
        <section><h2>Talk it through</h2><PointList items={drill.debriefQuestions} /></section>
        <SourceEvidence sourceIds={drill.sourceIds} editorialStatus={drill.sourceNote} />
      </article><aside><div className="eyebrow">CONNECT THE PRACTICE</div><PracticeLinks articleIds={drill.articleIds} scenarioIds={drill.scenarioIds} /><a href="#/drills">All drills <ArrowUpRight size={16} /></a><a href="#/board">Tactical board <ArrowUpRight size={16} /></a></aside></div>
    </div>;
  }
  const result = drills.filter(drill => (level === 'All' || drill.level === level) && JSON.stringify(drill).toLowerCase().includes(query.trim().toLowerCase()));
  return <div className="page">
    <div className="page-heading"><div className="eyebrow">THE LOCAL DRILL LIBRARY</div><h1>Take the idea into practice.</h1><p>Purpose, setup, teaching cues, and adaptations in one place. Choose a drill with your coach and connect it to the reading and tactical board.</p></div>
    <div className="playbook-toolbar"><label className="resource-search"><Search size={18} /><input aria-label="Search drills" placeholder="Search drills or coaching cues" value={query} onChange={event => setQuery(event.target.value)} /></label><a className="text-link" href="#/board">Explore tactical sequences <ArrowUpRight size={17} /></a></div>
    <div className="chips" aria-label="Drill levels">{['All', ...new Set(drills.map(drill => drill.level))].map(item => <button key={item} onClick={() => setLevel(item)} aria-pressed={item === level}>{item}</button>)}</div>
    <p className="results-line">{result.length} drills</p>
    <div className="article-grid">{result.map(drill => <a className="article-card" href={`#/drills/${drill.id}`} key={drill.id}><small>{drill.level} · {drill.people.activePlayers} participants</small><h3>{drill.title}<ArrowUpRight size={17} /></h3><p>{drill.purpose}</p><span>{drill.people.roles.join(' · ')}</span></a>)}</div>
    {!result.length && <div className="empty"><h2>No matching drills</h2><button onClick={() => { setQuery(''); setLevel('All'); }}>Reset drill filters</button></div>}
  </div>;
}
