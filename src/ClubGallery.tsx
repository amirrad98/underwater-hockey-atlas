import { clubProfile } from './club-profile';

const localAsset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export function ClubGallery() {
  if (!clubProfile.gallery.length) return null;
  return <section className="club-gallery" aria-label="Club photo gallery">
    <p className="club-gallery-count" role="status">{clubProfile.gallery.length} photographs</p>
    <div className="club-photo-grid" id="club-photo-grid">
      {clubProfile.gallery.map(photo => <figure key={photo.id}>
        <a href={localAsset(photo.originalSrc)} target="_blank" rel="noreferrer" aria-label={`Open full photograph: ${photo.alt}`}><img src={localAsset(photo.src)} width={photo.width} height={photo.height} alt={photo.alt} loading="lazy" decoding="async" /></a>
        <figcaption><p>{photo.caption}</p><small>{photo.credit}</small><details><summary>Photo source & reuse</summary><p>{photo.rights}</p><a href={photo.sourcePageUrl} target="_blank" rel="noreferrer">{photo.sourcePageTitle} ↗</a><br /><a href={photo.sourceUrl} target="_blank" rel="noreferrer">Original published image ↗</a></details></figcaption>
      </figure>)}
    </div>
  </section>;
}
