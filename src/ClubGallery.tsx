import { useState } from 'react';
import { clubProfile } from './club-profile';

const localAsset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
const initialPhotoCount = 6;

export function ClubGallery() {
  const [expanded, setExpanded] = useState(false);
  if (!clubProfile.gallery.length) return null;
  const photos = expanded ? clubProfile.gallery : clubProfile.gallery.slice(0, initialPhotoCount);
  return <section className="club-gallery" aria-label="Club photo gallery">
    <h2>The club in pictures.</h2>
    <p>{clubProfile.galleryNote}</p>
    <div className="club-gallery-controls">
      <p role="status">Showing {photos.length} of {clubProfile.gallery.length} photographs</p>
      {clubProfile.gallery.length > initialPhotoCount && <button className="gallery-toggle" aria-expanded={expanded} aria-controls="club-photo-grid" onClick={() => setExpanded(!expanded)}>{expanded ? 'Show fewer photos' : `Show all ${clubProfile.gallery.length} photos`}</button>}
    </div>
    <div className="club-photo-grid" id="club-photo-grid">
      {photos.map(photo => <figure key={photo.id}>
        <a href={localAsset(photo.originalSrc)} target="_blank" rel="noreferrer" aria-label={`Open full photograph: ${photo.alt}`}><img src={localAsset(photo.src)} width={photo.width} height={photo.height} alt={photo.alt} loading="lazy" decoding="async" /></a>
        <figcaption><p>{photo.caption}</p><small>{photo.credit}</small><details><summary>Photo source & reuse</summary><p>{photo.rights}</p><a href={photo.sourcePageUrl} target="_blank" rel="noreferrer">{photo.sourcePageTitle} ↗</a><br /><a href={photo.sourceUrl} target="_blank" rel="noreferrer">Original published image ↗</a></details></figcaption>
      </figure>)}
    </div>
  </section>;
}
