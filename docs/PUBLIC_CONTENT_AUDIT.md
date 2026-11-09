# Public-content audit — 2 October 2026

Before the requested visibility change, all fetched repository branch history was audited: 10 reachable commits, 61 unique blobs (50 text blobs and 11 PNG screenshots). All text blob versions were scanned, not just the current checkout.

No credential tokens, private-key blocks, JWTs, AWS access keys, signed storage/download URLs, secret assignments, private owner email addresses, environment dumps or work-mail content were found. Commit author addresses use GitHub noreply domains. The only contact address in file content is the club's public `timberwhales@unbc.ca` address. PNG screenshots contain no text/EXIF metadata chunks and show the application rather than browser/account chrome.

The raw club catalog includes expressly published, undated club roster display names with provenance and uncertainty labels. These are public-source research, not inferred identities, current-officer assertions or private contacts. At this baseline audit, roster names were excluded from the production site. No identity match between a roster display name and the project owner is inferred.

The original coaching, rules, world, club, supplier and architecture files are byte-for-byte identical to the completed research branch. They are already included in the implementation branch, so a separate merge of that source-transfer branch is unnecessary.

Generated source code, original research, documentation, workflows and screenshots were the complete tracked-file inventory. Local dependency caches, materialization helpers, downloaded transfer responses and environment files are outside tracked content. Secret-pattern scanning has practical limits; future contributions must receive the same source and privacy review.

## Feature PR #3: scoped media and roster delta

The subsequent request explicitly includes the club website's public, undated roster and media. This addition contains 27 still photographs from its 2023–2024 gallery, 12 roster portraits and two logos. The 20 roster entries use the exact published display labels (mostly abbreviated surnames), with eight entries sharing the same website logo placeholder. Labels are associated with portraits only through adjacent published text preserved in the source manifest. No identity is inferred from a face, no person is linked to the project owner, and no current membership or leadership is asserted.

The 41 incoming files were decoded and matched to their recorded SHA-256, byte count, dimensions and JPEG/PNG type; their public copies preserve the same bytes. The media and manifest review covers this transferred inventory and its profile mappings, not a new audit of all Git history. Public provenance uses publicly accessible club-page and Wix-image URLs. Temporary cloud-browser download/storage URLs and tokens are not included. Reuse is based on the user's project-specific permission; public accessibility is not a public-domain or general-license claim.

The original audit above remains a historical record of the baseline. This delta does not revise the main-only deployment policy or establish that the feature has been published. Real browser/offline image checks and screenshots are recorded separately in the feature verification evidence.
