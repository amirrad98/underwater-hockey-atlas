import { clubProfile, type ClubPhoto } from './club-profile';

export const localClubAsset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export function ClubPhotoSource({ photo }: { photo: ClubPhoto }) {
  return <details className="club-photo-source"><summary>Image source & reuse</summary><p>{photo.credit}</p><p>{photo.rights}</p><a href={photo.sourcePageUrl} target="_blank" rel="noreferrer">{photo.sourcePageTitle} ↗</a><br /><a href={photo.sourceUrl} target="_blank" rel="noreferrer">Original published image ↗</a></details>;
}

export function ClubHero() {
  const photo = clubProfile.hero;
  const logo = clubProfile.logos[0];
  return <section className="club-hero club-photo-hero">
    <div className="club-hero-copy">
      <img className="club-header-logo" src={localClubAsset(logo.src)} width={logo.width} height={logo.height} alt={logo.alt} />
      <div className="eyebrow">CLUB FIELD NOTES / CANADA</div>
      <h1>From the north.<br />Below the surface.</h1><p>{clubProfile.name} · Prince George, British Columbia</p>
      <ClubPhotoSource photo={logo} />
    </div>
    <figure className="club-hero-photo"><a href={localClubAsset(photo.originalSrc)} target="_blank" rel="noreferrer" aria-label="Open full 2023–2024 club gallery photograph"><img src={localClubAsset(photo.src)} width={photo.width} height={photo.height} alt={photo.alt} fetchPriority="high" /></a><figcaption><strong>FROM THE 2023–2024 CLUB GALLERY</strong><p>{photo.caption}</p><ClubPhotoSource photo={photo} /></figcaption></figure>
  </section>;
}

export function ClubRoster() {
  return <section className="club-roster" aria-label="Published website roster">
    <h2>{clubProfile.roster.label}</h2><p className="roster-freshness">{clubProfile.roster.note}</p>
    <div className="club-roster-grid">{clubProfile.roster.people.map(person => <article className="club-roster-card" key={person.name}>
      <a href={localClubAsset(person.photo.originalSrc)} target="_blank" rel="noreferrer" aria-label={person.usesLogoPlaceholder ? `Open club logo used for ${person.name}` : `Open published portrait of ${person.name}`}><img src={localClubAsset(person.photo.src)} width={person.photo.width} height={person.photo.height} alt={person.usesLogoPlaceholder ? `Club logo placeholder for ${person.name}; no portrait published` : person.photo.alt} loading="lazy" decoding="async" /></a>
      <div className="club-roster-caption"><h3>{person.name}</h3><p className="club-published-role"><span>Published role · undated</span>{person.publishedRole}</p>{person.usesLogoPlaceholder && <p className="club-placeholder-note">Club logo · no portrait published</p>}<small>{person.freshness}</small><ClubPhotoSource photo={person.photo} /></div>
    </article>)}</div>
  </section>;
}
