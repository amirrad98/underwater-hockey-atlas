# GitHub Pages

Public website publication was requested. The repository remains private and the review PR remains unmerged.

The app builds for `/underwater-hockey-atlas/`, uses hash routes (no server rewrites), and the workflow publishes only `dist/`. Original research files and contributor docs are not copied into the web root. The rendered public content includes source metadata, but no roster names or private owner information.

## Current blocker

The connected GitHub app supports repository content and PR/CI operations but exposes no Pages administration or account-plan inspection. The shell GitHub API token fails authentication. Git transport works through the configured connection. Therefore the account's private-repository Pages eligibility and Pages configuration could not be confirmed or enabled.

GitHub Pages supports private repositories on existing Pro, Team or Enterprise plans; eligibility is unknown here, not proven unavailable. Do not change repository visibility, purchase a plan or create credentials to work around this.

The official `actions/configure-pages` action states that automatic enablement requires a token other than `GITHUB_TOKEN`, with the corresponding Pages/administration permissions. No new token has been requested or created.

## Resume publication without merging the draft

1. In the existing repository's Settings → Pages, confirm the existing plan permits Pages and select GitHub Actions as the source.
2. Ensure the `github-pages` environment allows the dedicated `pages-release` branch, retaining any required human review rules.
3. Push the tested review commit to `pages-release`. The workflow runs on that branch and can publish without merging the draft PR. Do not force-push over unrelated work.
4. Check the workflow's deployment URL and verify the live site, assets, suppliers and article navigation. Do not report the site live before deployment succeeds.

The manual `workflow_dispatch` trigger is also provided for future use once the workflow is present on the default branch. GitHub does not expose that manual trigger for a workflow existing only on a feature branch.

Official references: [Pages plans and custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [configure-pages permissions](https://github.com/actions/configure-pages/blob/main/action.yml).
