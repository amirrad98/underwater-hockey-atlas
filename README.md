# Underwater Hockey Atlas + Wiki

An integrated visual atlas of underwater hockey, connected to wiki articles and a curated resource library. Explore the sport through skills, equipment, formations and geography, then follow the sources. A dedicated UNBC Timber Whales profile connects the club to the wider sport.

This repository contains a foundational, static content prototype. No account, backend or production secrets are required. It is not an exhaustive encyclopedia or a replacement for qualified coaching and current competition rules.

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

For browser checks, install Chromium with `npx playwright install chromium`, then run `npm run test:ui`. On an environment with system Chromium, set `CHROMIUM_PATH=/usr/bin/chromium`.

## Content and provenance

The original intended scope is preserved: a visual atlas of clubs, venues, regions and competitions, connected to articles about equipment, rules, skills and history, with an attributed external resource library and Timber Whales profile.

The supplied research is preserved under `research/`: four core JSON catalogs, a focused supplier catalog, and the architecture note, transferred through the private project GitHub repository after the initial Library materialization route failed. Raw records retain original editorial copy and source metadata. Importing a catalog does not independently verify its linked sources; checked, indexed, historical and restricted records keep their distinctions. Catalog groups overlap, so displayed source counts must be calculated from deduplicated records. The supplier directory covers 12 suppliers across 10 countries and preserves 36 source records, including qualified Canada-shipping claims and access limitations; it does not verify live stock, checkout, delivered cost, or supplier quality.

Original catalogs live under `research/`. After editing reviewed catalog records, run `python3 scripts/import_research.py` and `python3 scripts/import_suppliers.py` to regenerate `src/research-data.ts` and `src/suppliers.ts`. `src/data.ts` supplies stable starter articles and canonical merging. The application renders the same records across exploration, reference pages and source discovery; do not edit generated modules directly or duplicate editorial copy in components. Keep stable identifiers so links remain valid. See [CONTRIBUTING.md](CONTRIBUTING.md) for editorial rules and [the research backlog](docs/RESEARCH_BACKLOG.md) for future editorial review.

Use public sources only. Record source URL, publisher, date, access restrictions, jurisdiction, language and rights where known. Distinguish verified claims, indexed links, historical records and unresolved conflicts. Paid manuals and third-party images must not be copied without permission. All illustrative diagrams in this prototype are original and conceptual, not official rule diagrams.

## Review and delivery

The foundation was prepared and tested in PR #1. The owner subsequently authorized merging the tested work, making this repository public, and publishing GitHub Pages. No paid-plan upgrade, collaborator changes or new credentials are needed. CI checks production compilation and content integrity. Browser tests cover shared search, navigation, history and mobile layout.

## GitHub Pages

The Vite base path is `/underwater-hockey-atlas/`; use that path in local preview and on the intended project site. The Pages workflow publishes from the protected `main` branch and supports manual runs through GitHub Actions. See [deployment instructions](docs/DEPLOYMENT.md). A checked-in workflow is not evidence that a public deployment has succeeded.

Pages eligibility was confirmed in GitHub Settings and GitHub Actions was enabled as the publishing source. The existing `github-pages` environment permits `main`; its deployment protection is preserved. The successful deployment workflow output is the authoritative public URL.

## Review evidence

See the [desktop/mobile screenshots](docs/SCREENSHOTS.md) and [verification record](docs/VERIFICATION.md). The main JavaScript bundle is approximately 148 kB gzipped because the prototype ships its source metadata; future expansion should split route content or load source details on demand.
