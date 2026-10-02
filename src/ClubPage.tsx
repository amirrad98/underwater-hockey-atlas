import { ArrowUpRight, Waves } from 'lucide-react';
import { clubProfile } from './club-profile';
import './club-profile.css';

const localAsset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

function ClubEvidence({ ids }: { ids: string[] }) {
  return <details className="club-evidence"><summary>Supporting source notes</summary><ul>{[...new Set(ids)].map(id => {
    const source = clubProfile.sources.find(item => item.id === id);
    return source && <li key={id}><a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a><p>{source.note}</p><small>{source.publishedDate ? `Published ${source.publishedDate}` : 'Publication date not established'} · Checked {source.checkedAt}</small></li>;
  })}</ul></details>;
}

export function Club() {
  return <>
    <section className="club-hero"><div><div className="eyebrow">CLUB FIELD NOTES / CANADA</div><h1>From the north.<br />Below the surface.</h1><p>{clubProfile.name} · Prince George, British Columbia</p></div><div className="club-mark large"><Waves size={85} /><span>TW</span></div></section>
    <div className="page club-body club-profile">
      <div className="schedule"><div><small>FALL 2026 · CHECKED OCTOBER 2</small><h2>Meet at Canfor Leisure Pool.</h2><p>{clubProfile.freshnessNote} Times are local to Prince George; confirm changes before attending.</p></div><div><strong>Sunday</strong><span>17:45–18:45</span></div><div><strong>Wednesday</strong><span>21:00–22:00</span></div></div>
      <div className="article-layout"><article>
        <section className="club-intro"><h2>{clubProfile.fullName}</h2>{clubProfile.intro.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<ClubEvidence ids={clubProfile.introSourceIds} /></section>
        {clubProfile.gallery.length > 0 && <section className="club-gallery" aria-label="Club photo gallery"><h2>At the pool, together.</h2><p>{clubProfile.galleryNote}</p><div className="club-photo-grid">{clubProfile.gallery.map(photo => <figure key={photo.id}><a href={localAsset(photo.originalSrc)} target="_blank" rel="noreferrer" aria-label={`Open full photograph: ${photo.alt}`}><img src={localAsset(photo.src)} width={photo.width} height={photo.height} alt={photo.alt} loading="lazy" /></a><figcaption><p>{photo.caption}</p><small>{photo.credit}</small><details><summary>Photo source & reuse</summary><p>{photo.rights}</p><a href={photo.sourcePageUrl} target="_blank" rel="noreferrer">{photo.sourcePageTitle} ↗</a><br /><a href={photo.sourceUrl} target="_blank" rel="noreferrer">Original published image ↗</a></details></figcaption></figure>)}</div></section>}
        {clubProfile.sections.map(section => <section key={section.id} id={`club-${section.id}`}><h2>{section.title}</h2><p>{section.summary}</p><dl className="club-facts">{section.facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd><p>{fact.text}</p><small>{fact.status}</small></dd></div>)}</dl><ClubEvidence ids={[...section.sourceIds, ...section.facts.flatMap(fact => fact.sourceIds)]} /></section>)}
        <section><h2>{clubProfile.roster.label}</h2><p>{clubProfile.roster.note}</p><p>The public page lists {clubProfile.roster.count} players and staff across these roles:</p><ul>{clubProfile.roster.roleCategories.map(role => <li key={role}>{role}</li>)}</ul><ClubEvidence ids={clubProfile.roster.sourceIds} /></section>
        <section><h2>Sources & further reading</h2><p>Source notes retain their publication dates, access limits and unresolved details.</p><ClubEvidence ids={clubProfile.sources.map(source => source.id)} /></section>
      </article><aside><div className="eyebrow">CONNECT WITH THE CLUB</div>{clubProfile.contacts.map(contact => <a key={contact.url} href={contact.url} target={contact.url.startsWith('https:') ? '_blank' : undefined} rel="noreferrer">{contact.label}<ArrowUpRight size={16} /></a>)}<div className="eyebrow club-aside-label">BEFORE YOUR FIRST SESSION</div><a href="#/wiki/first-session">Your first club session <ArrowUpRight size={16} /></a><a href="#/wiki/equipment">Equipment essentials <ArrowUpRight size={16} /></a><a href="#/wiki/safety">Safe participation <ArrowUpRight size={16} /></a><a href="#/world">More communities <ArrowUpRight size={16} /></a></aside></div>
    </div>
  </>;
}
