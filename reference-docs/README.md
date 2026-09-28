# ClickHouse reference docs microfrontend

This is a deliberately small Vercel microfrontend for `/docs/reference/*`.
It has two separate content lifecycles: **Head** is rendered as static output
from a snapshot fetched during the Vercel build; released versions read only a
rendered page body from the `sites/` Cloudflare R2 archive at request time.

## Local flow

Set `REFERENCE_HEAD_R2_ORIGIN` to the private R2 build-input origin. The
build downloads its `manifest.json` and listed catalogs before Astro renders
the Head pages. For example, first export a snapshot from the ClickHouse
prototype worktree:

```sh
python3 ci/jobs/scripts/docs/reference_snapshot/export_reference_snapshot.py \
  --binary /path/to/clickhouse \
  --output tmp/reference-snapshot
```

Then either publish that snapshot to the configured build input, or run the
renderer against it locally:

```sh
cd reference-docs
REFERENCE_SNAPSHOT_DIR=/absolute/path/to/reference-snapshot pnpm dev
```

`pnpm build` has no fixture fallback. Until the Head build origin exists it
emits the intentional unavailable Head landing page and no Head content pages.
The fixture under `fixtures/` is only for unit tests.

## Archived-version contract

An archived release does **not** preserve this application's HTML, CSS, or
JavaScript. Release CI builds the reference site for the released snapshot,
extracts only each rendered `article.docs-content` body, and uploads these
inputs to object storage:

```
sites/<version>/<locale>/manifest.json
sites/<version>/<locale>/navigation.json
sites/<version>/<locale>/<route>/body.html
sites/versions.json
```

The deployed reference microfrontend builds only `head`. The dynamic archived
route fetches its selected `body.html` at runtime from
`REFERENCE_ARCHIVE_R2_ORIGIN`; adding 26.9, 26.10, and later releases does not
add routes or Markdown to the Vercel build. Until that origin exists, the
route deliberately returns an unavailable state instead of docs content.

`navigation.json` and `versions.json` are snapshot data, not archived UI. The
live shell owns the header, sidebar styling, search, language control, theme,
footer, and any UI improvements made after a release. `body.html` is likewise
normalized at archive time: Astro scope IDs are stripped and callouts become
stable semantic markers such as `data-reference-callout="note"`. That lets a
future shell redesign apply to every archived release without republishing its
content.

## Local archive proof

The Nimbus prototype currently contains the body-only shell and archiver. From
the repository root, make a release-only static build, publish it to the local
object-store-shaped directory, and serve that directory:

```sh
DOCS_REFERENCE=off \
DOCS_INCLUDE='reference-prototype/26.9/**/*.mdx' \
DOCS_OUT_DIR=/private/tmp/reference-26.9-build \
DOCS_CACHE_DIR=/private/tmp/reference-26.9-cache \
DOCS_SKIP_PUBLIC=1 \
pnpm exec astro build

REFERENCE_ARCHIVE_BUILD_DIR=/private/tmp/reference-26.9-build \
node bin/archive-reference-bodies.ts

node bin/serve-reference-artifacts.ts
```

In another terminal, start the normal head-only preview with the local artifact
origin:

```sh
DOCS_REFERENCE=off \
DOCS_INCLUDE='reference-prototype/latest/**/*.mdx' \
PUBLIC_REFERENCE_ARCHIVE_ORIGIN=http://localhost:4323 \
pnpm exec astro dev --host 127.0.0.1 --port 4321
```

Then open the historical route (local Astro middleware rewrites it internally
to the body-only shell without changing the address bar):

```
http://localhost:4321/docs/reference/26-9/functions/regular-functions/arithmetic-functions
```

The head preview has no 26.9 content routes. If that URL renders the
Arithmetic Functions article, it came solely from the local archive artifact.
