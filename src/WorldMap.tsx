import { Globe2 } from "lucide-react";
import type { Place } from "./data";
import { WORLD_EXTENT, projectWorldPoint } from "./map-projection";

const basemapUrl = new URL("./assets/natural-earth-land.svg", import.meta.url).href;

export function WorldMap({
  places,
  selected,
  onSelect,
}: {
  places: Place[];
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const pinned = places.filter(
    (place): place is Place & { lat: number; lon: number } =>
      place.lat !== null && place.lon !== null,
  );
  const selectedPlace = pinned.find((place) => place.id === selected);

  return (
    <section className="map-panel" aria-label="Community world map">
      <div className="map-caption">
        <Globe2 size={20} aria-hidden="true" />
        <span>
          COMMUNITY COORDINATES
          <br />
          <small>World overview · equirectangular</small>
        </span>
        <span className="map-count">{pinned.length} mapped</span>
      </div>
      <div className="world-map" role="group" aria-label="Community map points" aria-describedby="map-guidance">
        <img
          className="world-basemap"
          src={basemapUrl}
          alt="World land outlines, including the continents and major islands"
          width={WORLD_EXTENT.width}
          height={WORLD_EXTENT.height}
          draggable={false}
        />
        <div className="map-graticule" aria-hidden="true">
          {[-60, -30, 0, 30, 60].map((latitude) => (
            <div
              className={`latitude ${latitude === 0 ? "equator" : ""}`}
              style={{ top: `${projectWorldPoint(latitude, 0).y / WORLD_EXTENT.height * 100}%` }}
              key={latitude}
            >
              <span>{latitude === 0 ? "0°" : `${Math.abs(latitude)}°${latitude > 0 ? "N" : "S"}`}</span>
            </div>
          ))}
          {[-120, -60, 0, 60, 120].map((longitude) => (
            <div
              className="longitude"
              style={{ left: `${projectWorldPoint(0, longitude).x / WORLD_EXTENT.width * 100}%` }}
              key={longitude}
            />
          ))}
        </div>
        {pinned.map((place) => {
          const point = projectWorldPoint(place.lat, place.lon);
          const approximate = /\b(city|town|area|suburb|island)\b/i.test(place.precision);
          return (
            <button
              key={place.id}
              className={`map-pin ${approximate ? "city" : "venue"} ${selected === place.id ? "selected" : ""}`}
              style={{ left: `${point.x / WORLD_EXTENT.width * 100}%`, top: `${point.y / WORLD_EXTENT.height * 100}%` }}
              onClick={() => onSelect(place.id)}
              aria-label={`${place.name}: ${place.precision}`}
              aria-pressed={selected === place.id}
              title={`${place.name}: ${place.precision}`}
            >
              <span aria-hidden="true" />
            </button>
          );
        })}
      </div>
      <div className="map-legend" aria-label="Map marker legend">
        <span><i className="legend-city" aria-hidden="true" /> City / area point</span>
        <span><i className="legend-venue" aria-hidden="true" /> Venue record</span>
      </div>
      <div className="map-selection" role="status" aria-live="polite" aria-atomic="true">
        {selectedPlace ? (
          <><strong>{selectedPlace.name}</strong><span>{selectedPlace.precision}</span></>
        ) : (
          <span>Select a point to highlight its directory entry below.</span>
        )}
      </div>
      <p id="map-guidance">
        Only records with known coordinates appear. All {places.length} matching directory records remain available below.
        {!pinned.length && places.length > 0 && " These records have no mapped coordinates."}
      </p>
      <p className="map-attribution">
        Land: <a href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noreferrer">Natural Earth</a> · public domain · 1:110m overview, not venue-level detail.
      </p>
    </section>
  );
}
