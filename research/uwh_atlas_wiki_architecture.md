# Underwater hockey: atlas + deep wiki blueprint

## Product promise
An independent, visual guide to the sport worldwide, with a transparent evidence layer. A map entry is a sourced claim, never a guarantee that a session is running tonight.

## Main navigation
1. Explore the world: clubs, public pools, national organizations, event venues and historical locations
2. Learn the game: rules overview, equipment anatomy, first session and playing roles
3. Train and coach: skill progressions, diagrams, session planning and coaching-source library
4. Rules and referees: current official editions, local variations, signals and interpretations
5. Watch and compete: event calendar, results archives and contextualized match footage
6. Run a club: pool access, equipment, volunteers, recruitment, safeguarding and tournament operations
7. History and science: primary histories, carefully graded research and unanswered questions
8. Source library: searchable, multilingual bibliography with authority, dates, access and rights

## Atlas behavior
- Use different symbols for countries/organizations, city-level communities, pool venues and tournaments
- Keep club existence, activity status, pool address, geocode precision and schedule date separate
- Present every marker with evidence links, observed date and uncertainty
- Keep un-geocoded but verified-address records searchable in the list
- Hide stopped/historical entries by default; make archive mode available
- Never use an organization's office address as a playing venue
- Avoid inferred player rosters, youth identities, personal contact directories and unlabeled stock photos
- Treat Hong Kong and other geographic entities consistently as countries/territories in the UI without conflating sport membership with sovereign-state status

## Country page
Name and local vocabulary; umbrella federation vs hockey association; official club-finding routes; representative clubs; competition structure; beginner pathway; national language resources; source provenance and unresolved questions.

## Resource cards
Title, original short description, publisher, URL, language, audience, geography, source type, authority, publication/edition date, last checked, access/cost, copyright/licence, topic tags, known limitations.

## Match library
Index organizer-authorized links rather than copying video files. Add event/year, division, teams when explicitly stated, court, language, camera view, timestamps and rules edition. Verify each embed and keep a plain outbound link fallback.

## Research reading guide
Separate descriptive game observations, physiological laboratory studies, intervention studies and medical case reports. Retain sample sizes and limits. Average dive duration is not a safety clearance. No breath-hold training prescription should be inferred from the bibliography.

## Content/data architecture
- Canonical source registry with stable IDs
- Organization graph separating international federation, national umbrella, hockey commission, region, club and organizer
- Locations with source-linked geometry and a precision enum
- Events with separate category, sanctioning and results records
- Articles referencing source IDs at claim level
- Asset manifest for original and explicitly licensed illustrations
- Validation for IDs, URLs, ISO codes, coordinates, dates and missing evidence
- Contribution template asks for the exact changed fact and supporting public source; human review for club status and safety content

## Initial quality cases to surface
- France's widely shared CNHS directory is 2022–2023; a recent crawl is not a recent update
- Brazil: CMAS currently lists CBES for UWH and marks CBPDS suspended
- NOVA Vancouver: crowd map pointed at Vancouver Aquatic Centre; club and CUGA say UBC. Corrected venue evidence is included
- Canada directory contains a duplicate Gatineau-Ottawa listing and a likely mismatched Guelph Instagram link
- UWH Map totals measure directory coverage, not the number of independently verified operating clubs
- Member-use recruitment graphics must not be bundled as freely licensed GitHub assets

## Scope of current research
The accompanying JSON is a curated starter library and global representative sample. It is not a scrape of every club, a current worldwide participation census, or a guarantee of session availability. Local schedules and rights require item-level confirmation before publication.
