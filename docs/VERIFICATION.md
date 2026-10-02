# Verification record — 2 October 2026

This record covers the local `feat/local-wiki-tactical-playbook` implementation. It does not assert a remote CI result, merge or deployment. The previously published `main` site is unchanged by this branch.

## Content and build

- TypeScript, ESLint, reproducible map generation and the production build pass.
- Fifteen content and source-contract tests pass. They preserve every expanded lesson paragraph/list/example, all source observations and relationships, replay every playbook action against its complete recorded next state, and verify all 41 transferred media files against their byte/hash/dimension/source records and exact published portrait-label mappings.
- The site contains 27 article routes, including 14 expanded lessons with 54 sections and 6,343 instructional words; 13 local glossary concepts and three reading paths; five formations; ten sequences with 36 steps; 14 complete drills; 208 canonical reference resources preserving 243 catalog observations; 57 directory entries with 13 sourced map points; and 12 suppliers with 36 separate supplier-source records.
- The expanded TimberWhales profile includes eight sections, 30 facts and 23 contextual source entries. The published website roster renders 20 entries, 12 corresponding portraits and eight explicitly marked club-logo placeholders. Its names and role labels remain explicitly undated and do not establish current members or officers.
- Vite reports one large, deliberately local content/application bundle: about 1,170 kB uncompressed / 230 kB gzip, plus 36.8 kB CSS and the 78 kB local world map. This is a bundle-size notice, not a compilation failure. Fonts and their OFL licenses are locally stored.

## Browser and accessibility checks

The desktop/mobile UI suite passes 45 cases, with one explicit skip: the desktop project skips the mobile-menu-only case. No photo cases are skipped. Coverage includes every lesson body, every drill procedure and adaptation, all 36 tactical step snapshots and complete path vertices, five formation studies, source links, local cross-links, search/filter/reset flows, browser history, keyboard contents/playback, the focusable skip link, mobile menu focus/Escape and 320/390-pixel touch targets. Map checks cover actual polygon geometry, every sourced pin, narrow layouts, selection and offline filtering.

The actual club-media checks decode all 27 gallery photographs, 12 published roster portraits and two logos. They verify manifest dimensions, natural rendered proportions, JPEG/PNG response types, source and reuse disclosures, exact published names/roles, the eight logo placeholders, and six-photo/show-all keyboard behavior. All image requests stay local. The hero visibly carries the 2023–2024 gallery season label, separate from the fall 2026 practice schedule.

An independent club review verified all 49 rendered image uses at 1440, 390 and 320 pixels, including natural aspect ratios, keyboard expansion/collapse with retained focus, source disclosures and no overflow or external requests. Its final visual review includes the rights disclosure and a portrait beside a clearly labeled logo placeholder. See [the image-review record](evidence/club-media-review.json); it reports no findings.

An independent rendered-geometry review matched 92 initial/result snapshots, 72 before-state comparisons, 188 movement polylines and ten formation states across desktop/mobile with zero errors. See [the machine-readable count record](evidence/tactical-geometry-review.json). Arrowheads were moved clear of destination markers without changing any source coordinates; visible directions and mobile menu focus behavior were then visually rechecked.

[Review screenshots](SCREENSHOTS.md) show full lessons, tactical steps, formations, drills, the expanded club profile and the geographic map. The nonfocused skip link is clipped to prevent screenshot artifacts while remaining keyboard reachable.

## Production offline and update checks

Six production browser cases pass across desktop and mobile:

- Load online at the atlas, await successful worker installation, then reload offline and open/reload lessons, the glossary, map, club profile, local search, drills and tactical steps. Actual local map imagery, all 13 map points, both font families and all 41 unique club images remain available. Every club image decodes with its exact manifest dimensions and correct JPEG/PNG MIME after going offline, even though the initial online route did not display them. Core browsing makes no external requests.
- Install two complete production asset sets at the same local origin. The second version changes shell content, JS/CSS URLs and content, and the worker cache revision. After worker update and refresh, verify the new shell, new script marker and new CSS marker; then repeat those assertions after an offline reload. Only the new project cache remains.
- Verify the worker scope is `/underwater-hockey-atlas/`, its static-file allowlist stays within that path, and activation deletes only old `uwh-atlas:/underwater-hockey-atlas/:` caches. Unrelated site caches, including another atlas scope, survive.

The static asset lookup accounts for `Vary: Origin` on production script/style responses; this fixed an independently reproduced blank offline reload despite the files being cached. Offline availability requires an initial online load and successful browser storage installation. Development mode does not install the worker; external source websites are optional online destinations and are not mirrored.

## Media delivery and scope

The supported dot CLOUD browser `downloadMedia` route recovered 41 actual files: 40 JPEGs and one PNG, totaling 10,310,768 bytes. Local display files preserve the transferred bytes without cropping, conversion or other pixel edits. The media manifest records hashes, dimensions, original image/page URLs, rights and neutral caption provenance. Project-specific authorization is retained without asserting a public reuse license. The official gallery has 27 stills and six videos; the videos are excluded. The 2024–2025 page publishes no photos, and none are fabricated. The former photo-transfer blocker is resolved.

CI runs the same type, lint, content, build, UI and production-offline commands. Check the feature PR’s actual status for the current remote commit.
