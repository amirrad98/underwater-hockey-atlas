# Provenance and contribution guide

The atlas is a curated foundation, not an exhaustive encyclopedia. Original research is preserved unchanged in four JSON catalogs and the architecture note under `research/`. The catalogs arrived through the authorized private GitHub research branch after the Library consumer transfer was unavailable; all four JSON files and the architecture note have now been read and integrated. The earlier missing-archive limitation no longer describes the delivered content.

## Reproducible import

Run `python3 scripts/import_research.py` to regenerate `src/research-data.ts` and `research/import-aliases.json`. The importer consumes the 48 coaching/equipment, 62 rules/safety, 80 world and 21 club source records: **211 original source records become 202 canonical research resources**. Additional independently checked starter references are merged by canonical URL in `src/data.ts`. Compute final UI counts from its exported arrays; never add the catalog totals and describe them as unique sources.

All 14 original coaching chapters and eight rules wiki sections are imported with their original editorial summaries, section text, source relationships and caveats. Original Timber Whales short/wiki/freshness copy is included alongside privacy-conscious roster context. Stable starter article routes are retained through an explicit alias map. All 29 national organizations and 27 representative locations are imported. Unknown coordinates remain null; the Timber Whales point uses the club catalog's municipality-linked evidence rather than an old directory venue.

## Preserving evidence

Each normalized `Resource` exposes title, publisher, URL, topic, language, audience, authority, access, status, date, version, rights and jurisdiction. Its `sourceRecords` array preserves **every original source record unchanged**, with an added catalog tag. That includes verification method, copyright limitations, source-specific dates, caveats, access conditions, geography and conflicting snapshots. Merging a URL never discards another catalog's evidence. Original IDs resolve through catalog-qualified aliases because the same source ID can occur in several catalogs.

`date` is a compact display field, not necessarily a publication date. `version` is drawn only from the catalog's version/publication fields; the full source records distinguish checked date from document date. Some original `date_or_version` strings explicitly say “Page checked”; retain that language rather than presenting it as a publication date. A future model can split these display fields further without losing any original metadata.

Status is a conservative display summary, with the exact original verification text retained in annotations and `sourceRecords`. Search-indexed, timeout, outgoing-link and ambiguous page-or-index evidence remain Indexed; explicit snapshot conflicts remain Snapshot conflict; known login gates remain Restricted. Checked means the research records document content inspection, not that every linked document or video was reviewed. Historical context and older editions remain in original notes and version fields. Read those fields together: a recently checked page can still contain old information.

## Source and rights boundaries

International CMAS rules, national amendments, tournament bulletins, coaching interpretation and research are distinct. The research records a concrete quality issue: the CMAS introductory page gives a width of 15–18 m, while v13 rule 1.1.2 specifies 12–15 m. Use the versioned rulebook and clause context for specifications, never an introductory summary.

The original editorial chapters are research synthesis, not copied manuals. Linked paid guides, login-gated documents, member-use assets and third-party media are references only. No photographs, videos, full third-party manuals or commercial documents are mirrored. Diagram artwork is original and conceptual; no governing body endorsement or optimal formation is claimed. Atlantis records explicitly preserve the conflicting Level-2 Block-5 snapshots instead of silently choosing one.

Safety material separates sport guidance, adjacent freediving information and observational research. No solo underwater breath-hold practice, hyperventilation instruction or maximum-duration target is prescribed. An observed average submersion time is not an individual safe limit. Qualified review remains appropriate before public release of technical training material.

## Timber Whales

The imported field-level club research records the 12 September 2026 Instagram schedule: Canfor Leisure Pool, Sundays 17:45–18:45 and Wednesdays 21:00–22:00, Prince George local time. Original URLs and checked dates are now attached. Schedule exceptions and an exact season end remain unknown; visitors should confirm with the club.

Older CUGA Prince George Aquatic Centre times are historical. The 2023 revival is distinguished from an earlier team documented by 2009. A 2025 leadership transition does not establish 2026 officers. The public roster contains 20 undated entries; names are not bundled into production or represented as a current lineup. No identities are inferred from photographs and no private owner information is published. The private research catalog remains the source archive; only appropriate public source records and profile facts enter the application.

## Geography

The directory preserves original coordinate precision, source URL, observed status and caveats. City, suburb and island markers are not pool pins; crowd-geocoded venues do not independently establish current club use. National organizations are unpinned. Do not use office addresses as playing venues. Ungeocoded but named venues remain searchable in the list. The current selection is representative and must not be described as every club worldwide.

## Contributing

1. Record the exact public source, canonical URL, publisher, language, jurisdiction, authority, dates, access and rights. Separate publication date from check date.
2. Deduplicate canonical URLs while retaining each evidence record and document version. Do not silently discard conflicting observations.
3. Preserve the original editorial research, add concise original copy where needed and distinguish coaching interpretation from official rules. Attach clause/page references for precise rules claims.
4. Keep historical schedules and unknown leadership visibly qualified. Do not collect personal rosters, junior identities or private contacts.
5. Add coordinates only with a source and explicit precision; unknowns stay null. Confirm actual pool use separately from a map coordinate.
6. Regenerate content, run build/type/lint/content tests, and review navigation and mobile/keyboard behavior. Restricted sources may be cataloged; their bodies are not automatically licensed for republication.
