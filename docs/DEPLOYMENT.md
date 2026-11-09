# GitHub Pages

The owner explicitly authorized merging the tested foundation, making this repository public, and publishing the website. GitHub Pages eligibility is confirmed and GitHub Actions is enabled as the publishing source. The existing `github-pages` environment allows `main`; no release-branch exception is added and existing review rules remain in force.

## Publishing

`.github/workflows/pages.yml` builds and publishes on pushes to `main`, with a manual trigger also available. It checks types, lint, source integrity and production build before uploading `dist/`. After a merge, inspect the workflow and use its actual deployment URL; do not infer a domain from the account or repository name.

The app builds for `/underwater-hockey-atlas/` and uses hash routes, so article navigation does not need server rewrites. The workflow publishes only `dist/`. Original research files and contributor docs are not copied into the web root. The feature enhancement includes the explicitly requested public website roster labels, portraits and logos as an undated snapshot, with current membership and roles unconfirmed. Authorized club media and their public provenance are local production assets. No private owner information or inferred photo identities are published. These feature-branch changes still require review and have not been merged or deployed.

## Operational boundaries

Retain main-only environment protection and any required human approval rules. No new credentials, paid plan, collaborator or environment-policy changes are required. Repository visibility is managed separately through the owner's GitHub Settings session. Do not report publication complete until the workflow succeeds and the actual live URL and assets have been checked.

The initial cloud connection could read/write repository content and PRs but could not administer Pages. That setup was completed through the owner's existing GitHub UI session; this is no longer an eligibility blocker.

Official reference: [custom GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
