# Verification record — 2 October 2026

- Production build (`npm run build`): passed. Vite notes a large catalog bundle (about 148 kB gzip); no compilation errors.
- TypeScript (`npm run typecheck`) and ESLint (`npm run lint`): passed.
- Seven content tests: passed. Covers IDs and canonical URLs, article/source links, coordinate precision, every original research observation, supplier categories, qualified Canada claims and exact supplier evidence preservation.
- Fourteen browser cases across desktop and mobile: passed. Covers shared search, repeated/back navigation, all article routes, source filters/reset/empty results, geographic map/list, keyboard navigation, all section layouts, supplier country/category filters and evidence links.
- Production base-path smoke check: `/underwater-hockey-atlas/` loads with working article navigation and no failed HTTP responses.
- Screenshots are in `docs/screenshots/`.

The full foundation contains 27 articles, 207 deduplicated reference resources preserving 211 original observations, 57 directory entries (13 sourced map points), and 12 suppliers with 36 supplier-source observations. Supplier source details respect homepage-only public citation instructions.

CI runs the production/type/lint/content/browser checks. Check the PR's status for the exact current commit; this document does not substitute for a successful remote run. Pages eligibility and the Actions publishing source have since been confirmed in GitHub Settings. The owner authorized merge, public repository visibility and publication. The workflow uses the existing main-only environment protection; see DEPLOYMENT.md. No purchase or credentials were created.
