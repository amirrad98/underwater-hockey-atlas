# Navigation and usability reorganization

The approved structure organizes the existing atlas around four visitor tasks.
The Atlas logo returns to `#/atlas`, and the mobile menu also includes an explicit Home link.

| Section | Canonical route | Primary content |
| --- | --- | --- |
| Learn | `#/atlas/learn` | Getting started, skills and tactics, rules and safety, coaching, history and research |
| Clubs & places | `#/atlas/clubs` | Searchable directory, Map/List views, organization and place evidence |
| Equipment | `#/atlas/equipment` | Equipment guide, care, DIY boundaries, and suppliers |
| Library | `#/atlas/library` | External references, readable filters, full source context |

Suppliers use `#/atlas/equipment/suppliers`. The featured Timber Whales profile uses
`#/atlas/clubs/timber-whales`. Article records retain their IDs and `#/atlas/wiki/{id}` URLs,
except the duplicate Timber Whales article route resolves to the canonical profile.

## Existing bookmarks

| Existing route | Destination |
| --- | --- |
| `#/`, `#/club` | Club homepage at `#/` |
| `#/atlas` | Redesigned Atlas homepage |
| `#/wiki`, `#/atlas/wiki` | `#/atlas/learn` |
| `#/world` | `#/atlas/clubs` |
| `#/atlas/world` | `#/atlas/clubs?view=map` |
| `#/resources`, `#/atlas/resources` | `#/atlas/library` |
| `#/suppliers`, `#/atlas/suppliers` | `#/atlas/equipment/suppliers` |
| `#/wiki/timber-whales` | `#/atlas/clubs/timber-whales` |

The short URLs from the design preview also resolve under `#/atlas`.
The club’s Join, Team, Gallery, and About pages keep their site-root URLs.

Aliases retain query strings. Each article activates its primary section and uses
that section in its breadcrumb. Contextual links can expose it elsewhere without
duplicating the record.

## Browsing behavior

- Queries, filters, learning group, result page, Map/List view, and selected records
  are reflected in URLs. Typing replaces the current query entry instead of
  creating a history entry for every character.
- Back and Forward restore the collection state and saved scroll position.
- Normal page navigation begins at the top and focuses the main content.
- An exact search result reveals and focuses its selected record independently of
  pagination. Changing a filter clears the selection.
- Library and directory pagination applies after searching the complete dataset,
  with 20 results per page. All matching records with coordinates remain on the local Natural Earth map.
- The directory starts with List on every viewport unless the URL explicitly selects Map.
- Global and scoped searches share token, case, whitespace, and accent matching.

## Content and source preservation

The original `research/` catalogs and generated `src/research-data.ts` and
`src/suppliers.ts` records are unchanged. `src/catalog.ts` supplies presentation
facets and content ownership. It does not rewrite evidence.

Source type is separate from publisher identity. Multilingual sources match each
explicit language. Unspecified languages and unconfirmed access remain qualified.
When merged access evidence includes a restriction, a generic public label does
not override it. Expanded source context retains the original access description,
review status, dates, edition, geography, and rights.

Supplier cards retain the qualified shipping statement. Full shipping evidence,
custom and club order details, notes, and public source links remain expandable.
Directory entries preserve coordinate precision and dated evidence. The club
schedule retains its original date and confirmation notice.

## Code organization

- `src/navigation.ts`: route aliases, URL state, history and scroll restoration.
- `src/catalog.ts`: article ownership, display facets, shared search and pagination.
- `src/components/ui.tsx`: headings, search, source rows, pagination and shared controls.
- `src/components/Diagrams.tsx`: original equipment and formation illustrations.
- `src/pages/LearningPages.tsx`: Home, Learn, Equipment, article and club pages.
- `src/pages/CatalogPages.tsx`: Library, directory and supplier pages.
- `src/components/TimberwhalesLogo.tsx`: the unchanged supplied club artwork.
- `src/editorial.css`: forest/gold visual system, bundled fonts, and responsive layouts.
- `src/main.tsx`: Atlas navigation, grouped global search, and section selection.
- `src/ClubSite.tsx`: club homepage, navigation, roster, gallery, and joining information.

## Review preview

Run `npm run build`, then `node scripts/build_review_preview.mjs` to generate
`dist/preview.html`. Download and open that file in a browser to review the
app without a development server. Its code, styles, favicon and catalog are
embedded, including both sets of fonts, the basemap, and club photographs. External source links require the network;
the preview itself opens offline.

This preview is a review artifact. The production Pages configuration continues
to build from `main` through the existing workflow.
