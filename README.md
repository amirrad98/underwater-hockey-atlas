# Underwater Hockey Atlas + Wiki

An integrated visual atlas of underwater hockey, connected to wiki articles and a curated resource library. Explore the sport through skills, equipment, formations and geography, then follow the sources. A dedicated UNBC Timber Whales profile connects the club to the wider sport.

This repository contains a static, locally readable learning site. No account, backend or production secrets are required. It is not an exhaustive encyclopedia or a replacement for qualified coaching and current competition rules.

## Run locally

Use Node.js 22 or newer:

```sh
npm ci
npm run dev -- --host 0.0.0.0
```

Open the local URL printed by Vite. Local preview access depends on your development environment; this project does not publish the site automatically.

```sh
npm run build
npm run preview -- --host 0.0.0.0
npm run test
```

For browser checks, install Chromium with `npx playwright install chromium`, then run `npm run test:ui`. Run `npm run test:offline` for the separate production-build offline checks. On an environment with system Chromium, set `CHROMIUM_PATH=/usr/bin/chromium`.

## Content and provenance

The original intended scope is preserved: a visual atlas of clubs, venues, regions and competitions, connected to articles about equipment, rules, skills and history, with an attributed external resource library and Timber Whales profile.

The supplied research is preserved under `research/`: four core JSON catalogs, a focused supplier catalog, the architecture note, expanded local lessons and the tactical playbook. This repository and its research archive are public; they contain public-source information and original editorial synthesis, not private owner information. Raw records retain original copy and source metadata. Importing a catalog does not independently verify its linked sources; checked, indexed, historical and restricted records keep their distinctions. Catalog groups overlap, so displayed source counts must be calculated from deduplicated records. The supplier directory covers 12 suppliers across 10 countries and preserves 36 source records, including qualified Canada-shipping claims and access limitations; it does not verify live stock, checkout, delivered cost, or supplier quality.

After editing reviewed core or supplier catalog records, run `python3 scripts/import_research.py` and `python3 scripts/import_suppliers.py` to regenerate `src/research-data.ts` and `src/suppliers.ts`. The separate `research/uwh_wiki_expansion.json` is integrated through `src/wiki/catalog.ts`: **14 complete lessons, 54 sections, 6,343 instructional words, 13 glossary concepts and 20 source records with explicit evidence limits**. Three reading paths connect the lessons. Each lesson includes local explanations, learning objectives, common mistakes, progressions, safety context and source notes; external links support the text rather than replacing it. The word-count definition is retained in the catalog's `validation` object.

`src/data.ts` supplies stable routes and canonical source merging. The application renders the same records across exploration, reference pages and source discovery; do not edit generated modules directly or duplicate editorial copy in components. Keep stable identifiers so links remain valid. See [CONTRIBUTING.md](CONTRIBUTING.md) for editorial rules and [the research backlog](docs/RESEARCH_BACKLOG.md) for remaining review.

Use public sources only. Record source URL, publisher, date, access restrictions, jurisdiction, language and rights where known. Distinguish verified claims, indexed links, historical records and unresolved conflicts. Paid manuals and third-party images must not be copied without permission. All illustrative diagrams in this prototype are original and conceptual, not official rule diagrams.

The World map uses a locally hosted SVG derived from Natural Earth's public-domain 1:110 million land polygons. The [full source, license and reproducible generation notes](vendor/natural-earth/README.md) are checked in. Run `npm run map:build` after an intentional source or projection change; `npm test` checks the generated asset. See the [map verification and screenshots](docs/WORLD_MAP.md).

The TimberWhales page renders a substantive local profile from `src/club-profile.ts`: eight sections, 30 facts and 23 source entries cover practices, joining, fees, equipment, history, activities, contacts and gallery provenance. Fall 2026 hours at Canfor Leisure Pool remain distinct from older Aquatic Centre listings. At the user's explicit request, the 20-entry public website roster includes its published names and roles, 12 portraits and eight shared-logo placeholders, all marked undated and unconfirmed for current membership or office.

All 27 still photographs from the official 2023–2024 gallery and both website logos are hosted locally. The 41 unique media files preserve the downloaded bytes exactly (40 JPEGs and one PNG, 10,310,768 bytes in total); hero and roster-logo uses share existing files. These are observed Wix responsive renditions, not camera originals. Every image was viewed before its neutral description was written. Individual gallery events and identities are not inferred. The source gallery's six videos are excluded, and the 2024–2025 page contains no photographs. [The permission record](public/club/RIGHTS.txt) and [asset manifest](public/club/manifest.json) retain project-specific permission, source URLs, dimensions, hashes, credits and caption bases. Acquisition used the supported cloud browser `downloadMedia` route followed by the authorized repository transfer; no private browser transport URLs are published.

The stepped tactical board and drill library render `research/uwh_playbook_expansion.json`: five six-player formation studies, ten tactical sequences with 36 steps, 14 drill cards, six concepts and 12 source records. Readers can inspect each decision frame, follow distinct movement, carry and pass paths, and move between related lessons, scenarios and drills. The examples are original coaching interpretations with explicit opponent, surfacing and supervision assumptions. The content checks independently replay every ordered action into its recorded next state and validate possession, availability and linked references.

Local DM Sans and Manrope fonts and a production-only, project-scoped offline cache are implemented. Offline availability requires an initial online load and a successful browser cache installation; development mode does not install the service worker. Final production and browser verification is recorded separately when complete.

## Review and delivery

The foundation was prepared and tested in PR #1. The owner subsequently authorized merging the tested work, making this repository public, and publishing GitHub Pages. No paid-plan upgrade, collaborator changes or new credentials are needed. CI checks production compilation and content integrity. Browser tests cover shared search, navigation, history and mobile layout.

The local-wiki, tactical-playbook, map and club enhancements are under review in feature PR #3 on `feat/local-wiki-tactical-playbook`. They have not been merged or deployed; the existing live `main` site is unchanged by this branch. The completed media transfer is included in that review; actual browser and offline evidence is recorded in the verification log.

## GitHub Pages

The Vite base path is `/underwater-hockey-atlas/`; use that path in local preview and on the intended project site. The Pages workflow publishes from the protected `main` branch and supports manual runs through GitHub Actions. See [deployment instructions](docs/DEPLOYMENT.md). A checked-in workflow is not evidence that a public deployment has succeeded.

Pages eligibility was confirmed in GitHub Settings and GitHub Actions was enabled as the publishing source. The existing `github-pages` environment permits `main`; its deployment protection is preserved. The successful deployment workflow output is the authoritative public URL.

## Review evidence

See the [desktop/mobile screenshots](docs/SCREENSHOTS.md) and [verification record](docs/VERIFICATION.md). Evidence from the foundation is historical until replaced or supplemented by feature-branch checks. The site bundles its reading material and source metadata; report bundle sizes from the final build rather than carrying forward an earlier measurement.
