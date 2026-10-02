# Public-content audit — 2 October 2026

Before the requested visibility change, all fetched repository branch history was audited: 10 reachable commits, 61 unique blobs (50 text blobs and 11 PNG screenshots). All text blob versions were scanned, not just the current checkout.

No credential tokens, private-key blocks, JWTs, AWS access keys, signed storage/download URLs, secret assignments, private owner email addresses, environment dumps or work-mail content were found. Commit author addresses use GitHub noreply domains. The only contact address in file content is the club's public `timberwhales@unbc.ca` address. PNG screenshots contain no text/EXIF metadata chunks and show the application rather than browser/account chrome.

The raw club catalog includes expressly published, undated club roster display names with provenance and uncertainty labels. These are public-source research, not inferred identities, current-officer assertions or private contacts. Roster names are excluded from the production site. No identity match between a roster display name and the project owner is inferred.

The original coaching, rules, world, club, supplier and architecture files are byte-for-byte identical to the completed research branch. They are already included in the implementation branch, so a separate merge of that source-transfer branch is unnecessary.

Generated source code, original research, documentation, workflows and screenshots were the complete tracked-file inventory. Local dependency caches, materialization helpers, downloaded transfer responses and environment files are outside tracked content. Secret-pattern scanning has practical limits; future contributions must receive the same source and privacy review.
