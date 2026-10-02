# Underwater Hockey Atlas + Wiki

An integrated visual atlas of underwater hockey, connected to wiki articles and a curated resource library. Explore the sport through skills, equipment, formations and geography, then follow the sources. A dedicated UNBC Timber Whales profile connects the club to the wider sport.

This private repository contains a foundational, static content prototype. No account, backend or production secrets are required. It is not an exhaustive encyclopedia or a replacement for qualified coaching and current competition rules.

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

The supplied research is preserved under `research/`: four structured JSON catalogs and the architecture note, transferred through the private project GitHub repository after the initial Library materialization route failed. Raw records retain original editorial copy and source metadata. Importing a catalog does not independently verify its linked sources; checked, indexed, historical and restricted records keep their distinctions. Catalog groups overlap, so displayed source counts must be calculated from deduplicated records.

Editorial content lives in `src/data.ts`, supplier records in `src/suppliers.ts`, and the original catalogs under `research/`; the application renders the same records across exploration, reference pages and source discovery. Add records and references there instead of duplicating editorial copy in components. Keep stable identifiers so links remain valid. See [CONTRIBUTING.md](CONTRIBUTING.md) for editorial rules and [the research backlog](docs/RESEARCH_BACKLOG.md) for future editorial review.

Use public sources only. Record source URL, publisher, date, access restrictions, jurisdiction, language and rights where known. Distinguish verified claims, indexed links, historical records and unresolved conflicts. Paid manuals and third-party images must not be copied without permission. All illustrative diagrams in this prototype are original and conceptual, not official rule diagrams.

## Review and delivery

Changes are prepared on a review branch and may be proposed through a draft pull request. GitHub Pages publication is authorized separately from repository visibility: keep the repository private and do not upgrade a paid plan or add collaborators. CI checks production compilation and content integrity. Browser tests cover shared search, navigation, history and mobile layout.

## GitHub Pages

The Vite base path is `/underwater-hockey-atlas/`; use that path in local preview and on the intended project site. The manual Pages workflow prepares publication through GitHub Actions. A checked-in workflow is not evidence that a public deployment has succeeded.

[GitHub documents](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) that Pages from a private repository requires GitHub Pro, Team or Enterprise. The connected account's plan and this repository's Pages configuration were not exposed by the available connector during initial setup, and shell API authentication was unavailable. Keep visibility private; if eligibility or enabling Pages is blocked, report the exact GitHub response rather than changing visibility or buying a plan.
