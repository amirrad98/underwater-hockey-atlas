# Verification record — 2 October 2026

This record covers the local `feat/local-wiki-tactical-playbook` implementation. It does not assert a remote CI result, merge or deployment. The previously published `main` site is unchanged by this branch.

## Content and build

- TypeScript, ESLint, reproducible map generation and the production build pass.
- Fourteen content tests pass. They preserve every expanded lesson paragraph/list/example, all source observations and relationships, and replay every playbook action against its complete recorded next state, including possession and availability.
- The site contains 27 article routes, including 14 expanded lessons with 54 sections and 6,343 instructional words; 13 local glossary concepts and three reading paths; five formations; ten sequences with 36 steps; 14 complete drills; 208 canonical reference resources preserving 243 catalog observations; 57 directory entries with 13 sourced map points; and 12 suppliers with 36 separate supplier-source records.
- The expanded TimberWhales profile includes eight sections, 30 facts and 21 contextual source entries. The website roster remains explicitly undated.
- Vite reports one large, deliberately local content/application bundle: about 1,066 kB uncompressed / 219 kB gzip, plus 34.6 kB CSS and the 78 kB local world map. This is a bundle-size notice, not a compilation failure. Fonts and their OFL licenses are locally stored.

## Browser and accessibility checks

The desktop/mobile UI suite passes 41 cases, with three explicit skips: the two photo-rendering cases await actual files, and the desktop project skips the mobile-menu-only case. Coverage includes every lesson body, every drill procedure and adaptation, all 36 tactical step snapshots and complete path vertices, five formation studies, source links, local cross-links, search/filter/reset flows, browser history, keyboard contents/playback, the focusable skip link, mobile menu focus/Escape and 320/390-pixel touch targets. Map checks cover actual polygon geometry, every sourced pin, narrow layouts, selection and offline filtering.

An independent rendered-geometry review matched 92 initial/result snapshots, 72 before-state comparisons, 188 movement polylines and ten formation states across desktop/mobile with zero errors. See [the machine-readable count record](evidence/tactical-geometry-review.json). Arrowheads were moved clear of destination markers without changing any source coordinates; visible directions and mobile menu focus behavior were then visually rechecked.

[Review screenshots](SCREENSHOTS.md) show full lessons, tactical steps, formations, drills, the expanded club profile and the geographic map. The nonfocused skip link is clipped to prevent screenshot artifacts while remaining keyboard reachable.

## Production offline and update checks

Six production browser cases pass across desktop and mobile:

- Load online, await successful worker installation, then reload offline and open/reload lessons, the glossary, map, club profile, local search, drills and tactical steps. Actual local map imagery, all 13 map points, and both font families remain available. Core browsing makes no external requests.
- Install two complete production asset sets at the same local origin. The second version changes shell content, JS/CSS URLs and content, and the worker cache revision. After worker update and refresh, verify the new shell, new script marker and new CSS marker; then repeat those assertions after an offline reload. Only the new project cache remains.
- Verify the worker scope is `/underwater-hockey-atlas/`, its static-file allowlist stays within that path, and activation deletes only old `uwh-atlas:/underwater-hockey-atlas/:` caches. Unrelated site caches, including another atlas scope, survive.

The static asset lookup accounts for `Vary: Origin` on production script/style responses; this fixed an independently reproduced blank offline reload despite the files being cached. Offline availability requires an initial online load and successful browser storage installation. Development mode does not install the worker; external source websites are optional online destinations and are not mirrored.

## Remaining delivery item

Club photo reuse is authorized, but verified image URLs or original files have not been transferred from the browser session. The local manifest is empty, the gallery is hidden, and the photo tests explicitly skip with that reason. No substitute images or photo-rendering success are claimed. The research backlog records this limitation.

CI runs the same type, lint, content, build, UI and production-offline commands. Check the feature PR’s actual status for the current remote commit.
