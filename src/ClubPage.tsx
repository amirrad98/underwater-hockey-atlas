import { ArrowUpRight } from 'lucide-react';
import { clubProfile } from './club-profile';
import { ClubGallery } from './ClubGallery';
import { ClubHero, ClubRoster } from './ClubMedia';
import './club-profile.css';

function ClubEvidence({ ids }: { ids: string[] }) {
  return <details className="club-evidence"><summary>Supporting source notes</summary><ul>{[...new Set(ids)].map(id => {
    const source = clubProfile.sources.find(item => item.id === id);
    return source && <li key={id}><a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a><p>{source.note}</p><small>{source.publishedDate ? `Published ${source.publishedDate}` : 'Publication date not established'} · Checked {source.checkedAt}</small></li>;
  })}</ul></details>;
}

export function Club() {
  return <>
    <ClubHero />
    <div className="page club-body club-profile">
      <div className="schedule"><div><small>FALL 2026 · CHECKED OCTOBER 2</small><h2>Meet at Canfor Leisure Pool.</h2><p>{clubProfile.freshnessNote} Times are local to Prince George; confirm changes before attending.</p></div><div><strong>Sunday</strong><span>17:45–18:45</span></div><div><strong>Wednesday</strong><span>21:00–22:00</span></div></div>
      <div className="article-layout"><article>
        <section className="club-intro"><h2>{clubProfile.fullName}</h2>{clubProfile.intro.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<ClubEvidence ids={clubProfile.introSourceIds} /></section>
        <ClubGallery />
        {clubProfile.sections.map(section => <section key={section.id} id={`club-${section.id}`}><h2>{section.title}</h2><p>{section.summary}</p><dl className="club-facts">{section.facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd><p>{fact.text}</p><small>{fact.status}</small></dd></div>)}</dl><ClubEvidence ids={[...section.sourceIds, ...section.facts.flatMap(fact => fact.sourceIds)]} /></section>)}
        <ClubRoster /><ClubEvidence ids={clubProfile.roster.sourceIds} />
        <section><h2>Sources & further reading</h2><p>Source notes retain their publication dates, access limits and unresolved details.</p><ClubEvidence ids={clubProfile.sources.map(source => source.id)} /></section>
      </article><aside><div className="eyebrow">CONNECT WITH THE CLUB</div>{clubProfile.contacts.map(contact => <a key={contact.url} href={contact.url} target={contact.url.startsWith('https:') ? '_blank' : undefined} rel="noreferrer">{contact.label}<ArrowUpRight size={16} /></a>)}<div className="eyebrow club-aside-label">BEFORE YOUR FIRST SESSION</div><a href="#/wiki/first-session">Your first club session <ArrowUpRight size={16} /></a><a href="#/wiki/equipment">Equipment essentials <ArrowUpRight size={16} /></a><a href="#/wiki/safety">Safe participation <ArrowUpRight size={16} /></a><a href="#/world">More communities <ArrowUpRight size={16} /></a></aside></div>
    </div>
  </>;
}
