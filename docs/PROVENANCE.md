# Provenance and contribution guide

The atlas is a curated learning site, not an exhaustive encyclopedia. The original four core JSON catalogs and architecture note are preserved under `research/`, alongside the supplier catalog and expanded learning catalog. The earlier authorized repository transfer resolved the initial archive-access limitation. The repository is now public, including its research archive: the records contain public-source information and original editorial synthesis, not private owner information. Repository publication does not change the copyright or access terms of linked material.

## Reproducible import

Run `python3 scripts/import_research.py` to regenerate `src/research-data.ts` and `research/import-aliases.json`. The importer consumes the 48 coaching/equipment, 62 rules/safety, 80 world and 21 club source records: **211 original source records become 202 canonical research resources**. Additional independently checked starter references are merged by canonical URL in `src/data.ts`. Compute final UI counts from its exported arrays; never add the catalog totals and describe them as unique sources.

All 14 original coaching chapters and eight rules wiki sections are imported with their original editorial summaries, section text, source relationships and caveats. Original Timber Whales short/wiki/freshness copy is included alongside privacy-conscious roster context. Stable starter article routes are retained through an explicit alias map. All 29 national organizations and 27 representative locations are imported, plus the separately researched Timber Whales venue. Unknown coordinates remain null; the Timber Whales point uses the club catalog's municipality-linked evidence rather than an old directory venue.

## Expanded local lessons and teaching tools

`research/uwh_wiki_expansion.json` is the source for 14 complete lessons with 54 sections, 6,343 instructional words, 13 glossary concepts, three reading paths and 20 source records. `src/wiki/catalog.ts` integrates the catalog into the common article/resource arrays, preserving canonical source merging and explicit aliases for stable article routes. The renderer presents explanations, objectives, mistakes and corrections, practice progressions, safety context and claim-specific source notes locally. Source records retain what was inspected, what supports the lesson and what is not established by that evidence.

The instructional word count includes summaries, objectives, body paragraphs/lists, mistakes and corrections, progressions and exercise-specific safety. It excludes headings, source notes and authoring metadata. It is a content measure, not a claim of professional validation. Original teaching examples and glossary definitions are editorial synthesis; they are not reproduced official exercises or an official training programme. The 20 expansion records overlap with other catalogs and must not simply be added to unique-resource totals.

`research/uwh_playbook_expansion.json` contains five six-player formation studies, ten tactical sequences with 36 steps, 14 original drill cards, six concepts, a coach guide and 12 source records. Its schema retains formation role responsibilities, counterplay, selected-opponent scope, surfacing assumptions, resets and rotation, easier/harder adaptations, observations and debriefs. All board coordinates are conceptual; Team A attacks toward the top and Team B toward the bottom even when possession changes. The material is original educational interpretation, not an official CMAS coaching programme or a claim that one formation is optimal.

The stepped board and drill library now render this final catalog through the lossless adapter in `src/playbook/data.ts`. The UI retains movement, carry and pass distinctions, phase explanations, source relationships, selected-opponent and surfacing notes, formation responsibilities, drill resets and adaptations. Full state snapshots support manual previous/next navigation without reverse-animation arithmetic. The focused content checks independently replay ordered actions, compare every resulting snapshot and validate all source, article, drill and return links. Technical validation and qualified coaching review remain separate checks.

## Preserving evidence

Each normalized `Resource` exposes title, publisher, URL, topic, language, audience, authority, access, status, date, version, rights and jurisdiction. Its `sourceRecords` array preserves **every original source record unchanged**, with an added catalog tag. That includes verification method, copyright limitations, source-specific dates, caveats, access conditions, geography and conflicting snapshots. Merging a URL never discards another catalog's evidence. Original IDs resolve through catalog-qualified aliases because the same source ID can occur in several catalogs.

`date` is a compact display field, not necessarily a publication date. `version` is drawn only from the catalog's version/publication fields; the full source records distinguish checked date from document date. Some original `date_or_version` strings explicitly say “Page checked”; retain that language rather than presenting it as a publication date. A future model can split these display fields further without losing any original metadata.

Status is a conservative display summary, with the exact original verification text retained in annotations and `sourceRecords`. Search-indexed, timeout, outgoing-link and ambiguous page-or-index evidence remain Indexed; explicit snapshot conflicts remain Snapshot conflict; known login gates remain Restricted. Other methods retain See source notes unless inspection is explicit. Checked means the research records document content inspection, not that every linked document or video was reviewed. Historical context and older editions remain in original notes and version fields. Read those fields together: a recently checked page can still contain old information.

## Source and rights boundaries

International CMAS rules, national amendments, tournament bulletins, coaching interpretation and research are distinct. The research records a concrete quality issue: the CMAS introductory page gives a width of 15–18 m, while v13 rule 1.1.2 specifies 12–15 m. Use the versioned rulebook and clause context for specifications, never an introductory summary.

The original editorial chapters are research synthesis, not copied manuals. Linked paid guides, login-gated documents, member-use assets and third-party media are references only unless separately authorized. No videos, full third-party manuals or commercial documents are mirrored. Club photographs have a specific project permission described below, but their files have not yet been transferred. Diagram artwork is original and conceptual; no governing body endorsement or optimal formation is claimed. Atlantis records explicitly preserve the conflicting Level-2 Block-5 snapshots instead of silently choosing one.

Safety material separates sport guidance, adjacent freediving information and observational research. No solo underwater breath-hold practice, hyperventilation instruction or maximum-duration target is prescribed. An observed average submersion time is not an individual safe limit. Qualified review remains appropriate before public release of technical training material.

## Timber Whales

The imported field-level club research records the 12 September 2026 Instagram schedule: Canfor Leisure Pool, Sundays 17:45–18:45 and Wednesdays 21:00–22:00, Prince George local time. Original URLs and checked dates are now attached. Schedule exceptions and an exact season end remain unknown; visitors should confirm with the club.

Older CUGA Prince George Aquatic Centre times are historical. The 2023 revival is distinguished from an earlier team documented by 2009. A 2025 leadership transition does not establish 2026 officers. The public-source research catalog retains 20 undated website roster entries; the rendered club profile uses their count and role categories rather than reproducing a named lineup. The source archive is public and must never be described as a private store. No identities are inferred from photographs and no private owner information is published.

`src/club-profile.ts` supplies eight profile sections, 30 facts and 21 cited sources. Practice, newcomer contact, trial offers, published fees, waiver information, equipment, club history, national competition and socials are readable locally. Undated or contradictory website pricing remains qualified, and the profile does not invent eligibility, loan-kit availability, current officers or holiday exceptions.

The user explicitly confirmed permission to reuse the Timber Whales website photographs in this atlas. `public/club/RIGHTS.txt` and `public/club/manifest.json` record the question, answer and project-specific scope: the official Wix website and its linked club gallery. This is not a Creative Commons license, public-domain declaration or permission for unrelated social-media/third-party images. The older catalog's recommendation to seek permission records the earlier state; this later permission addresses that condition only. Native browser transfer of the actual photographs remains pending because the workspace could not access the source site and an exact-site image search returned no results. No gallery photograph, guessed CDN asset or placeholder has been added.

When the actual assets arrive, preserve the exact observed source URL and page, downloaded source bytes, retrieval date, dimensions, sizes, hashes, credit and caption basis. View each image before describing it. Display derivatives must preserve the complete composition and aspect ratio; never infer a name from a face. Keep the manifest's coverage status honest about inaccessible or omitted items.

## Geography

The directory preserves original coordinate precision, source URL, observed status and caveats. City, suburb and island markers are not pool pins; crowd-geocoded venues do not independently establish current club use. National organizations are unpinned. Do not use office addresses as playing venues. Ungeocoded but named venues remain searchable in the list. The current selection is representative and must not be described as every club worldwide.

The local World basemap derives from Natural Earth's public-domain `ne_110m_land` layer, version 4.1.0 from the v5.1.2 repository snapshot. The original GeoJSON, license, exact URLs and hashes are retained under `vendor/natural-earth/`. Its 127 polygons use the same equirectangular projection as directory coordinates. Reproduction and limitations are documented in [the dataset notes](../vendor/natural-earth/README.md); `npm run map:check` checks the generated SVG without a network request. A generalized coastline does not add precision to a club coordinate or verify a venue.

## Local assets and offline scope

DM Sans and Manrope are bundled with their SIL Open Font License files under `public/fonts/`. No runtime font service is needed. The production build generates a service worker from the emitted local assets; registration and cache cleanup are scoped to the application's base path. A browser must first load the site online and finish cache installation before offline reading can work. External source pages, contacts and videos are not mirrored into that cache. Feature-branch build and browser evidence belongs in `docs/VERIFICATION.md`; implementation alone is not evidence that an offline test passed.

## Contributing

1. Record the exact public source, canonical URL, publisher, language, jurisdiction, authority, dates, access and rights. Separate publication date from check date.
2. Deduplicate canonical URLs while retaining each evidence record and document version. Do not silently discard conflicting observations.
3. Preserve the original editorial research, add concise original copy where needed and distinguish coaching interpretation from official rules. Attach clause/page references for precise rules claims.
4. Keep historical schedules and unknown leadership visibly qualified. Do not collect personal rosters, junior identities or private contacts.
5. Add coordinates only with a source and explicit precision; unknowns stay null. Confirm actual pool use separately from a map coordinate.
6. Regenerate content, run build/type/lint/content tests, and review navigation and mobile/keyboard behavior. Restricted sources may be cataloged; their bodies are not automatically licensed for republication.
