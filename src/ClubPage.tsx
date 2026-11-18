import { ArrowUpRight, Mail, Instagram } from 'lucide-react';
import { clubProfile } from './club-profile';
import { clubSectionPage } from './club-pages';
import { ClubGallery } from './ClubGallery';
import { ClubHero, ClubRoster, localClubAsset } from './ClubMedia';
import './club-profile.css';

function ClubEvidence({ ids }: { ids: string[] }) {
  return <details className="club-evidence"><summary>Supporting source notes</summary><ul>{[...new Set(ids)].map(id => {
    const source = clubProfile.sources.find(item => item.id === id);
    return source && <li key={id}><a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a><p>{source.note}</p><small>{source.publishedDate ? `Published ${source.publishedDate}` : 'Publication date not established'} · Checked {source.checkedAt}</small></li>;
  })}</ul></details>;
}

function Schedule() {
  return <div className="schedule" id="club-practice-times">
    <div><small>FALL 2026 / CANFOR LEISURE POOL</small><h2>Practice times</h2><p>Times are local to Prince George. Checked October 2, 2026; confirm changes with the club before attending.</p></div>
    <div><strong>Sunday</strong><span>17:45–18:45</span></div>
    <div><strong>Wednesday</strong><span>21:00–22:00</span></div>
  </div>;
}

function Sections({ page }: { page: 'join' | 'about' }) {
  return <>{clubProfile.sections.filter(section => clubSectionPage[section.id] === page).map(section => <section key={section.id} id={`club-${section.id}`}>
    <h2>{section.title}</h2><p>{section.summary}</p>
    <dl className="club-facts">{section.facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd><p>{fact.text}</p><small>{fact.status}</small></dd></div>)}</dl>
    <ClubEvidence ids={[...section.sourceIds, ...section.facts.flatMap(fact => fact.sourceIds)]} />
  </section>)}</>;
}

function Contacts() {
  return <>{clubProfile.contacts.map(contact => <a key={contact.url} href={contact.url} target={contact.url.startsWith('https:') ? '_blank' : undefined} rel="noreferrer">{contact.label}<ArrowUpRight size={16} /></a>)}</>;
}

function ClubHeading({ tag, title, body }: { tag: string; title: string; body: string }) {
  return <div className="club-heading"><div className="eyebrow">{tag}</div><h1>{title}</h1><p>{body}</p></div>;
}

function ContactBand() {
  return <section className="contact-band">
    <div><div className="eyebrow">LET’S TALK</div><h2>Join a practice</h2><p>New and returning players are welcome. Send a message before your first session so someone can meet you on deck.</p></div>
    <div className="contact-actions">
      <a className="button aqua" href="mailto:timberwhales@unbc.ca"><Mail size={17} /> timberwhales@unbc.ca</a>
      <a className="text-link" href="https://www.instagram.com/unbctimberwhales/" target="_blank" rel="noreferrer"><Instagram size={17} /> @unbctimberwhales</a>
      <a className="text-link" href="#/join">How joining works <ArrowUpRight size={17} /></a>
    </div>
  </section>;
}

export function ClubHome() {
  const photos = clubProfile.gallery.slice(1, 5);
  return <>
    <ClubHero />
    <section className="practice-strip" aria-label="Practice times">
      <div><small>FALL 2026 / PRACTICES</small><strong>Canfor Leisure Pool</strong></div>
      <div><small>SUNDAY</small><strong>17:45–18:45</strong></div>
      <div><small>WEDNESDAY</small><strong>21:00–22:00</strong></div>
      <a className="text-link" href="#/join">How to join <ArrowUpRight size={17} /></a>
    </section>
    <section className="home-about">
      <div><div className="eyebrow">THE CLUB</div><h2>Hockey, at the bottom of the pool.</h2></div>
      <div>{clubProfile.intro.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<a className="text-link" href="#/about">About the club <ArrowUpRight size={17} /></a></div>
    </section>
    <section className="home-doors">
      {[
        ['join', '01', 'Join a practice', 'Practice times, what a first session looks like, membership and the gear the club lends.'],
        ['team', '02', 'Meet the team', 'The players and roles published on the club roster.'],
        ['gallery', '03', 'See the club', `${clubProfile.gallery.length} photographs from the 2023–2024 season.`],
      ].map(([id, n, title, body]) => <a key={id} href={`#/${id}`}><span>{n}</span><h3>{title} <ArrowUpRight size={20} /></h3><p>{body}</p></a>)}
    </section>
    <section className="home-photos" aria-label="Photographs from the club gallery">
      {photos.map(photo => <a key={photo.id} href="#/gallery" aria-label={`Open the gallery: ${photo.alt}`}><img src={localClubAsset(photo.src)} width={photo.width} height={photo.height} alt={photo.alt} loading="lazy" decoding="async" /></a>)}
    </section>
    <section className="home-atlas">
      <div>
        <div className="eyebrow">NEW TO UNDERWATER HOCKEY?</div>
        <h2>Start with the atlas.</h2>
        <p>Our field guide to the sport itself: how the game works, the kit, the rules, tactics and drills, and where it is played around the world.</p>
        <a className="button aqua" href="#/atlas">Open the UWH atlas <ArrowUpRight size={17} /></a>
      </div>
      <div className="home-atlas-links">
        {[
          ['#/atlas/wiki/first-session', 'Your first session', 'What to expect when you arrive.'],
          ['#/atlas/wiki/equipment', 'Know your kit', 'From mask to fins.'],
          ['#/atlas/wiki/rules', 'Understand the game', 'Rules and how they vary.'],
          ['#/atlas/board', 'Tactical board', 'Walk through a play, step by step.'],
        ].map(([href, title, body]) => <a key={href} href={href}><h3>{title}</h3><p>{body}</p><ArrowUpRight size={18} /></a>)}
      </div>
    </section>
    <ContactBand />
  </>;
}

export function ClubJoin() {
  return <div className="page club-body club-profile">
    <ClubHeading tag="JOIN / PRACTICES" title="Join a practice" body="Everything published about getting in the water with the TimberWhales: when and where the club practises, what a first session involves, membership and equipment." />
    <Schedule />
    <div className="article-layout"><article><Sections page="join" /></article>
      <aside><div className="eyebrow">CONNECT WITH THE CLUB</div><Contacts /><div className="eyebrow club-aside-label">BEFORE YOUR FIRST SESSION</div><a href="#/atlas/wiki/first-session">Your first club session <ArrowUpRight size={16} /></a><a href="#/atlas/wiki/equipment">Equipment essentials <ArrowUpRight size={16} /></a><a href="#/atlas/wiki/safety">Safe participation <ArrowUpRight size={16} /></a></aside>
    </div>
  </div>;
}

export function ClubTeam() {
  return <div className="page club-body club-profile">
    <ClubHeading tag="THE TEAM" title="Meet the team" body="The roster as published on the club website. Names and roles are shown as published and are not dated." />
    <ClubRoster /><ClubEvidence ids={clubProfile.roster.sourceIds} />
  </div>;
}

export function ClubGalleryPage() {
  return <div className="page club-body club-profile">
    <ClubHeading tag="GALLERY / 2023–2024" title="The club in pictures" body={clubProfile.galleryNote} />
    <ClubGallery />
  </div>;
}

export function ClubAbout() {
  return <div className="page club-body club-profile">
    <ClubHeading tag="ABOUT THE CLUB" title={clubProfile.name} body="A student-led underwater hockey club at the University of Northern British Columbia in Prince George." />
    <div className="article-layout"><article>
      <section className="club-intro"><h2>{clubProfile.fullName}</h2>{clubProfile.intro.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<ClubEvidence ids={clubProfile.introSourceIds} /></section>
      <Sections page="about" />
      <section><h2>Sources & further reading</h2><p>{clubProfile.freshnessNote} Source notes retain their publication dates, access limits and unresolved details.</p><ClubEvidence ids={clubProfile.sources.map(source => source.id)} /></section>
    </article>
      <aside><div className="eyebrow">CONNECT WITH THE CLUB</div><Contacts /><div className="eyebrow club-aside-label">MORE</div><a href="#/join">Join a practice <ArrowUpRight size={16} /></a><a href="#/team">Meet the team <ArrowUpRight size={16} /></a><a href="#/atlas/world">Other UWH communities <ArrowUpRight size={16} /></a></aside>
    </div>
  </div>;
}
