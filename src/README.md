# Nimbus site (Project Nimbus POC)

Astro 7 + `@cloudflare/nimbus-docs` build of the ClickHouse docs, living next to the
Mintlify content it renders. Content files are untouched: a compatibility layer makes the
Mintlify-flavoured MDX build (see `src/plugins/vite-mintlify-snippets.ts` and
`src/components/compat/`). Findings and measurements: `../reports/nimbus-poc-notes.md`.

## Commands (run in `docs/`)

| Command | What it does |
|---|---|
| `pnpm install` | Node 24, pnpm 10. |
| `pnpm build` | Fetches registered sources, builds one locale, then prunes `.mdx` twins, rebases URLs, generates `__redirects`, nests under `dist/docs`, and enforces the Worker asset limits. |
| `pnpm dev` | Astro dev server (`/docs/...`). |
| `pnpm check:mdx` | Compiles every MDX file with Sätteri and reports undefined components; seconds, no build. |
| `pnpm measure` | Page weight, anchor parity, base-path check, URL parity vs the live Mintlify sitemap (needs a nested build in `$DOCS_OUT_DIR`). |
| `pnpm preview:cf` | `wrangler dev` on the docs Worker (`worker/index.ts`) serving `dist/`. |
| `pnpm run deploy` | Deploys `dist/` to the production Worker selected by `DOCS_LOCALE`. |
| `pnpm run deploy:preview` | Uploads `dist/` as an aliased Worker version selected by `DOCS_PREVIEW_ALIAS`. |
| `node bin/fetch-remotes.ts` | Pulls remote-repo docs (`remotes.json`) into their mount directories. |

## Environment variables

| Variable | Effect |
|---|---|
| `DOCS_INCLUDE` | Comma-separated globs restricting the English collection (spikes, scoped previews). |
| `DOCS_LOCALE` | The one locale Worker to build (`en`, `es`, `pt-BR`, and so on); unset = English. |
| `DOCS_REMOTE_NAME`, `DOCS_REMOTE_REPOSITORY`, `DOCS_REMOTE_REF` | CI-only tuple selecting one registered remote at an immutable commit for an English pull-request preview. |
| `DOCS_REMOTES_PREFETCHED=1` | Requires the remote mounts and fetch-state files supplied by the credentialed CI fetch job. |
| `DOCS_PREVIEW_ALIAS` | Lowercase Cloudflare alias used by `pnpm run deploy:preview`. |
| `DOCS_OUT_DIR`, `DOCS_CACHE_DIR` | Isolated output and cache directories (parallel builds never share `dist/`). |
| `NODE_OPTIONS=--max-old-space-size=8192` | Recommended for full builds (peak RSS ~3 GB). |

## Layout

- `astro.config.ts`: Nimbus config, Sätteri processor (heading attributes + math), URL rebaser, mermaid, compat Vite plugin.
- `src/content.config.ts`: `docs` (English, path-derived ids) and one collection per locale (`es`, `pt-br`, ...).
- `src/pages/[...slug].astro`, `src/pages/[locale]/[...slug].astro`: page routes (locale pages fall back to English).
- `src/pages/nav/[...key].astro`: lazy sidebar fragments; `src/lib/sidebar-lazy.ts`.
- `src/pages/**/llms*.txt.ts`, `**/index.md.ts`: agent surfaces (chunked corpora in `src/lib/corpus.ts`).
- `src/components/compat/`: Mintlify component names on Nimbus components; `react/` shims for snippet JSX.
- `bin/`: generators and measurement scripts; `worker/`: Cloudflare Worker; `wrangler.jsonc`.
- `src/generated/` (gitignored): sidebar items, import index, island wrappers.

Production source topology lives only in `remotes.json`; production fetches each
registered repository from `main`. Remote CI supplies the registered name,
repository, and exceptional immutable SHA only when requesting a preview.

The website Worker routes `/docs/<locale>/*` and
`/docs/_astro-<locale>/*` to `clickhouse-docs-<locale>`. The English Worker
handles the remaining `/docs/*` paths, including shared images and Nimbus assets.
