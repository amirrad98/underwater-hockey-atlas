# Natural Earth land data

This directory retains the complete, unmodified source used for the World map's locally hosted geographic basemap. It contains physical land polygons, including major islands; no political boundaries are displayed.

- Publisher: Natural Earth; original authors Tom Patterson, Nathaniel Vaughn Kelso, and contributors.
- Dataset: `ne_110m_land`, 1:110 million land, layer version **4.1.0** from the Natural Earth Vector repository's **v5.1.2** release snapshot.
- Retrieved: 2 October 2026.
- [Dataset description](https://www.naturalearthdata.com/downloads/110m-physical-vectors/110m-land/).
- [Exact GeoJSON source](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_110m_land.geojson).
- [Layer version source](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/110m_physical/ne_110m_land.VERSION.txt).
- [Upstream license file](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/LICENSE.md), retained in full as [LICENSE.md](LICENSE.md).
- [Publisher's public-domain terms](https://www.naturalearthdata.com/about/terms-of-use/), checked on the retrieval date. Natural Earth permits reuse, modification and redistribution of its map data without permission or required attribution. The UI nevertheless credits the publisher.

SHA-256 of the original files:

```text
9e0729ee253ca7d7a5c4ae9395fb1902264c5377c52e224d13dd85010e2835d9  ne_110m_land.geojson
2631b5b39b6d1acc56de75235109b5af2dbb4b0ac5a127b6f06185977247fd4b  LICENSE.md
```

The publisher's web download page currently advertises version 4.0.0; the checked-in repository release explicitly records 4.1.0. The release-specific source and hashes above identify the version actually used here.

## Local derivation

Run `npm run map:build` from the repository root to regenerate `src/assets/natural-earth-land.svg`; `npm run map:check` verifies that the generated file matches this source without changing files. Both commands work without network access. The generator checks the source hash before processing it.

All 127 polygons and their rings are retained. Longitude/latitude coordinates use the same equirectangular projection as directory markers: `x = longitude + 180`, `y = 90 - latitude`, with a `360 × 180` viewBox. Only projected coordinate rounding to three decimal places, SVG styling, and attribution metadata are added. No additional geometry simplification, cropping, or invented coastlines are applied. The 180° longitude edges already follow the upstream geometry; Antarctica's polar closure runs along the bottom of the frame.

Vite emits the SVG as a local asset under the configured application base path. The application makes no runtime requests to Natural Earth, map tiles, geocoders, or map APIs. The unmodified GeoJSON is retained for reproducibility, not loaded into the application bundle.

This scale is for geographic orientation. Small islands and coastlines are generalized; proximity to a drawn coastline does not verify a venue. Directory coordinates, precision labels, and source evidence remain independent of the basemap.
