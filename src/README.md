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
| `pnpm run build:vercel` | Fetches registered sources using Vercel Connect where required, removes the deployment OIDC identity, then builds the Vercel output. |
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
| `DOCS_REMOTE_SOURCE_REPOSITORY` | CI-derived repository that owns the preview SHA. It defaults to the registered repository and differs only for a fork PR. |
| `DOCS_REMOTES_PREFETCHED=1` | Requires the remote mounts and fetch-state files supplied by the credentialed CI fetch job. |
| `DOCS_PREVIEW_ALIAS` | Lowercase Cloudflare alias used by `pnpm run deploy:preview`. |
| `DOCS_GITHUB_CONNECTOR` | Vercel Connect GitHub connector UID, for example `github/clickhouse-docs`. Configure it only for `production` and the `remote-preview` Custom Environment. |
| `DOCS_OUT_DIR`, `DOCS_CACHE_DIR` | Isolated output and cache directories (parallel builds never share `dist/`). |
| `NODE_OPTIONS=--max-old-space-size=8192` | Recommended for full builds (peak RSS ~3 GB). |

## Layout

- `astro.config.ts`: Nimbus config, Sätteri processor (heading attributes + math), URL rebaser, mermaid, compat Vite plugin.
- `src/content.config.ts`: `docs` (English, path-derived ids) and one collection per locale (`es`, `pt-br`, ...).
- `src/pages/[...slug].astro`, `src/pages/[locale]/[...slug].astro`: page routes (locale pages fall back to English).
- `src/pages/nav/[...key].astro`: lazy sidebar fragments; `src/lib/sidebar-lazy.ts`.
- `src/pages/**/llms*.txt.ts`, `**/index.md.ts`: agent surfaces. The root `llms-full.txt` links to full-text, top-level-section `llms.txt` files; `src/lib/corpus.ts` recursively subdivides any corpus that reaches 24 MiB.
- `src/components/compat/`: Mintlify component names on Nimbus components; `react/` shims for snippet JSX.
- `bin/`: generators and measurement scripts; `worker/`: Cloudflare Worker; `wrangler.jsonc`.
- `src/generated/` (gitignored): sidebar items, import index, island wrappers.

Production source topology lives only in `remotes.json`; production fetches each
registered repository from `main`. Remote CI supplies the registered name,
repository, and exceptional immutable SHA only when requesting a preview.

Remote repositories create previews through
`.github/workflows/remote-docs-preview.yml`. The caller invokes the reusable
workflow manually with a pull request number. It uses a repository-scoped
GitHub App token only to resolve the immutable head SHA and the branch or fork
repository that owns it, then deploys trusted Nimbus `main` to the
`remote-preview` Vercel environment. The Vercel build uses
its OIDC identity to request a short-lived, `contents:read` token from Vercel
Connect for the branch or fork repository. Public repositories are fetched
anonymously. `bin/fetch-remotes.ts` exits before
`bin/vercel-build.ts` removes `VERCEL_OIDC_TOKEN` and starts any Markdown or MDX
processing. The Actions token never enters Vercel. Maintainers can also run the
workflow directly from the `mintlify-docs-dev` Actions page by providing the
registered source, repository, and open pull request number.

Standard Vercel Preview deployments are deliberately tokenless. They fetch
public sources anonymously and omit private sources. Trusted branch previews
that need the complete site must target the `remote-preview` Custom Environment.

Nimbus application pull requests use `.github/workflows/site-preview.yml`.
The manually invoked workflow resolves the current head SHA without running
pull-request code in Actions. A branch in the primary repository is sent to the
Connect-enabled `remote-preview` environment. A fork is sent to standard
Preview, where the connector is not attached and private sources are omitted.

Vercel must be provisioned as follows:

1. Enable automatic System Environment Variables for the project.
2. Create the `remote-preview` Custom Environment.
3. Create a Vercel-managed GitHub connector named `clickhouse-docs` and install
   it only for the private repositories registered in `remotes.json` and any
   private forks that are explicitly allowed to receive previews.
4. Attach `github/clickhouse-docs` to `production` and `remote-preview`. Do not
   attach it to standard `preview`.
5. Set `DOCS_GITHUB_CONNECTOR=github/clickhouse-docs` in `production` and
   `remote-preview`, but not in standard `preview`.
6. Keep standard Preview free of secrets and privileged integrations: a fork
   pull request controls the uploaded build source in that environment.
7. Keep the Vercel build command as `pnpm run build:vercel` and the output
   directory as `dist`.

The website Worker routes `/docs/<locale>/*` and
`/docs/_astro-<locale>/*` to `clickhouse-docs-<locale>`. The English Worker
handles the remaining `/docs/*` paths, including shared images and Nimbus assets.
