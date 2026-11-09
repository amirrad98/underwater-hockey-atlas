# Reorganization review

This branch implements the approved navigation and usability plan. Review the app
by downloading [preview.html](preview.html) and opening the downloaded file in a
browser. Its application code, styles, favicon and catalogs are embedded. Web
fonts and external source links still require a network connection.

The preview is generated from the production build. It does not deploy the site.

## What changed

- Four main destinations: Learn, Clubs & places, Equipment, and Library.
- A shorter Home page with three starting tasks, beginner reads, and a club spotlight.
- Five Learn groups, with equipment guides and suppliers together under Equipment.
- Shorter Library filters, optional detailed filters, active filter chips, and 20 results per page.
- Global search across all content types with exact selected-record destinations.
- URL-based collection state, preserved browser Back position, and legacy route aliases.
- Mobile List defaults, a keyboard-operable menu, clear focus indicators, and a working skip link.
- Shared navigation, catalog and page components replacing the single large application file.

The original 27 articles, 207 resource records, 57 places and 12 suppliers remain
available. The raw research catalogs, generated source records and equipment data
are unchanged. Source details retain access qualifications, dates, status, rights
and shipping evidence. See [the full implementation notes](../REORGANIZATION.md).

## Screenshots

| View | Preview |
| --- | --- |
| Home on desktop | [home-desktop.png](home-desktop.png) |
| Learn on desktop | [learn-desktop.png](learn-desktop.png) |
| Clubs & places on desktop | [clubs-desktop.png](clubs-desktop.png) |
| Library on mobile | [library-mobile.png](library-mobile.png) |
| Suppliers on mobile | [suppliers-mobile.png](suppliers-mobile.png) |

## Verification

Verified on 2026-11-08:

| Check | Result |
| --- | --- |
| TypeScript | Passed |
| ESLint | Passed |
| Content and catalog tests | 18 passed |
| Production build | Passed |
| Browser suite | 36 passed, 2 intentional skips, 0 failed |
| Standalone downloaded-file preview | Home and Library navigation passed, 20 rows displayed, no page errors |
| Research and generated data diff | No changes |

The UI suite covers all 27 article routes, main navigation, old bookmarks,
exact search destinations, global and scoped search parity, pagination, filters,
directory pins, supplier evidence, browser Back state and scroll restoration,
skip links and mobile keyboard behavior. The map shows all 13 records with
coordinates independently of the 20-row directory page.

Browser checks used Chromium 153 at a 1440 by 1000 desktop viewport and an
emulated 390 by 844 mobile viewport. Additional checks covered 360 and 768 CSS
pixels and a 720 CSS-pixel viewport with 2x pixel density. No horizontal overflow
was detected in the checked layouts. The density check is responsive reflow
coverage, not native browser zoom operation. The two skipped mobile cases are
duplicate executions of reflow checks already run in the desktop project.

Visual review found no blocking layout issue in the captured desktop and mobile
views. This is automated and visual review, not a usability study with visitors.

## Reproduce

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:ui
node scripts/build_review_preview.mjs
```

`CHROMIUM_PATH` can select an existing Chromium executable. The review environment
used a headless Chromium package installed outside the repository, without
changing project dependencies. The existing GitHub Actions workflow installs
Playwright's Chromium for CI.

The build retains Vite's large-chunk advisory because the full source catalog is
bundled. The current JavaScript bundle is about 158 kB gzipped. The map remains a
schematic geographic grid, and records without coordinates remain in the list.
