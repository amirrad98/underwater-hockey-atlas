# Geographic basemap verification — 2 October 2026

The World view previously displayed ten grid lines and thirteen pins with no geographic layer. It now displays Natural Earth's public-domain land polygons, generated into a local SVG. [Source data, full license, exact version and hashes](../vendor/natural-earth/README.md) are retained in the repository.

The basemap and pins share a full-world equirectangular projection. A fixed 2:1 aspect ratio preserves geographic proportions at desktop, tablet and mobile widths. The map does not modify directory coordinates or pin records with unknown coordinates. Circle markers identify city, suburb, island or area points; square markers identify venue records, with the original precision/evidence text available on selection and in directory cards. The map is an overview, not a venue locator.

Selected names and precision appear below the map in a status region rather than in overflowing labels. All points remain keyboard buttons, with selection exposed through `aria-pressed`; selection highlights the matching directory card. Search and the List view retain access to all records, including unpinned organizations.

## Checks

- `npm run map:check`: reproduced all 127 source polygons exactly from the retained GeoJSON using the shared projection.
- TypeScript, ESLint, seven existing content tests and production build passed.
- Eight map browser cases passed across Chromium desktop (1440px) and mobile (390px). Tests inspect actual rendered SVG pixels on all seven continents, Greenland and New Zealand, plus three ocean areas; compare all thirteen rendered marker centres to the basemap's geographic frame; exercise filters, unknown locations, list switching, and keyboard selection; and check all marker/selection bounds at 320px, 390px and 768px.
- All fourteen existing browser cases also passed, for 22 passing cases in the combined map and application suite.
- The full build, lint, type, content and 22-case browser checks were repeated against an isolated copy of the staged map change. A production preview served the emitted SVG with HTTP 200 under `/underwater-hockey-atlas/assets/`, displayed thirteen pins, and reported no page errors or failed local responses.
- Browser checks block external requests while loading the local map and then disconnect the browser to exercise search, selection and Map/List switching. No third-party geography, tile, geocoding or map API requests are made. This verifies local operation after app loading, not an offline installation or service-worker cache.
- The generated SVG is approximately 78 kB (33 kB gzip). It is a separate local asset; the raw GeoJSON is excluded from the application bundle.

## Browser evidence

- [Desktop map](screenshots/world-basemap-desktop.png)
- [Mobile map](screenshots/world-basemap-mobile.png)

These screenshots are captured from the running local application and visually reviewed. The map change is prepared for review locally; this record does not claim a production deployment.
