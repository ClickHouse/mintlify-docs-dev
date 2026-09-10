# Nimbus site (Project Nimbus POC)

Astro 7 + `@cloudflare/nimbus-docs` build of the ClickHouse docs, living next to the
Mintlify content it renders. Content files are untouched: a compatibility layer makes the
Mintlify-flavoured MDX build (see `src/plugins/vite-mintlify-snippets.ts` and
`src/components/compat/`). Findings and measurements: `../reports/nimbus-poc-notes.md`.

## Commands (run in `docs/`)

| Command | What it does |
|---|---|
| `pnpm install` | Node 24, pnpm 10. |
| `pnpm build` | Fetches registered sources, builds the selected locale scope, rebases URLs, generates `__redirects`, nests under `dist/docs`, and enforces the Worker asset limits. |
| `pnpm run build:vercel` | Fetches registered sources using Vercel Connect where required, removes the deployment OIDC identity, and builds the English, translations, or legacy combined Vercel artifact selected by `DOCS_DEPLOY_TARGET`. |
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
| `DOCS_DEPLOY_TARGET` | Vercel artifact to assemble: `english`, `translations`, or the backward-compatible `combined` default. |
| `DOCS_INCLUDE` | Comma-separated globs restricting the English collection (spikes, scoped previews). |
| `DOCS_LOCALE` | A singular locale build (`en`, `es`, `pt-BR`, and so on); normally set only by the Vercel shard orchestrator. |
| `DOCS_LOCALES` | Translations included in a `translations` or legacy `combined` artifact: `none`, `all`, or a comma-separated list such as `es,fr`. The translations project uses `all`. |
| `DOCS_REMOTES` | Registered remote-source scope: `none` for a base-repository preview and `all` for source previews and production. |
| `DOCS_REMOTE_NAME`, `DOCS_REMOTE_REPOSITORY`, `DOCS_REMOTE_REF` | CI-only tuple selecting one registered remote at an immutable commit for an English pull-request preview. |
| `DOCS_REMOTE_SOURCE_REPOSITORY` | CI-derived repository that owns the preview SHA. It defaults to the registered repository and differs only for a fork PR. |
| `DOCS_REMOTES_PREFETCHED=1` | Requires the remote mounts and fetch-state files supplied by the credentialed CI fetch job. |
| `DOCS_PREVIEW_ALIAS` | Lowercase Cloudflare alias used by `pnpm run deploy:preview`. |
| `DOCS_GITHUB_CONNECTOR` | Vercel Connect GitHub connector UID, for example `github/clickhouse-docs`. Configure it only for `production` and the `connect-preview` Custom Environment. |
| `DOCS_OUT_DIR`, `DOCS_CACHE_DIR` | Isolated output and cache directories. Vercel uses one persistent Astro cache per deployment target and locale under `node_modules/.astro/`. |
| `NODE_OPTIONS=--max-old-space-size=8192` | Recommended for full builds. Locale processes run sequentially, so memory is bounded to one content tree at a time. |

## Layout

- `astro.config.ts`: Nimbus config, Sätteri processor (heading attributes + math), URL rebaser, mermaid, compat Vite plugin.
- `src/content.config.ts`: `docs` (English, path-derived ids) and one collection per locale (`es`, `pt-br`, ...).
- `src/pages/[...slug].astro`, `src/pages/[locale]/[...slug].astro`: page routes (locale pages fall back to English).
- `src/pages/nav/[...key].astro`: lazy sidebar fragments; `src/lib/sidebar-lazy.ts`.
- `src/pages/[...slug].md.ts`, `src/pages/**/llms*.txt.ts`: English-only agent surfaces. Every human-language route points to the same canonical English `<page>.md`; no generated `.mdx` or localized agent copies are emitted. The root `llms-full.txt` links to full-text, top-level-section `llms.txt` files; `src/lib/corpus.ts` recursively subdivides any corpus that reaches 24 MiB.
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
repository that owns it, then asks Vercel to build trusted Nimbus `main` in the
`connect-preview` environment. The Vercel build uses
its OIDC identity to request a short-lived, `contents:read` token from Vercel
Connect for the branch or fork repository. Public repositories are fetched
anonymously. `bin/fetch-remotes.ts` exits before
`bin/vercel-build.ts` removes `VERCEL_OIDC_TOKEN` and starts any Markdown or MDX
processing. The Actions token never enters Vercel. Maintainers can also run the
workflow directly from the `mintlify-docs-dev` Actions page by providing the
registered source, repository, and open pull request number.

Standard Vercel Preview deployments are deliberately tokenless. Base-repository
pull requests use this environment and set `DOCS_REMOTES=none`, regardless of
whether their head branch belongs to the primary repository or a fork.

Nimbus application pull requests use `.github/workflows/site-preview.yml`.
The base-branch workflow resolves GitHub's immutable
`refs/pull/<number>/merge` revision without checking out or running
pull-request code in Actions. It asks Vercel to fetch that revision through the
project's Git connection and updates one preview comment on the pull request.
Both primary-repository branches and forks use standard Preview and omit every
registered remote source.

Source-repository pull requests use
`.github/workflows/remote-docs-preview.yml`. Vercel builds trusted Nimbus
`main`, selects exactly one registered source with `DOCS_REMOTE_*`, and fetches
the pull request's immutable head revision. Trusted branches and forks have the
same source-only build scope. They use `connect-preview` so private registered
sources can obtain a short-lived token; public sources remain anonymously
fetchable.

After a source-repository change reaches its trusted production branch, that
repository calls `.github/workflows/site-production.yml`. The reusable workflow
builds the latest trusted Nimbus `main` with every registered remote and every
translation, rather than promoting the source-only preview.

Pull-request previews build the English project only by default. The Vercel
Microfrontends production fallback serves the last promoted translation
deployment for locale routes. Add `docs-translations-all` (or any legacy
`docs-translations-<locale>` label) to build the catch-all translations project
as well. Because all translations are one application, a translation-labelled
preview always builds every locale; a partial locale artifact would hide the
other locales rather than falling them back individually.

`.github/workflows/site-production.yml` selects applications from the merged
paths. English content deploys only the English project, locale-only changes
deploy only the translations project, and shared renderer or build changes
deploy both. Reusable invocations from a remote source repository default to
English. A maintainer can also dispatch `english`, `translations`, or `all`
manually. Both projects build the same immutable `mintlify-docs-dev` revision.
When both participate, the workflow creates both Vercel deployments before it
waits, so their builds run concurrently.

`bin/vercel-build.ts` compiles each requested locale in an isolated sequential
Astro child process and merges only `/docs/<locale>`, its namespaced
`/docs/_astro-<locale>` assets, and `/docs/nav/<locale>`. The translations
project loads English MDX so it can own localized fallback pages, but it does
not emit English routes or copy the shared image corpus. Consequently a
translation deployment contains every locale route—including English fallback
content—and the English deployment owns `/docs`, `/docs/_astro`,
`/docs/images`, and `/docs/img`.

Vercel must be provisioned as follows:

1. Keep the existing `clickhouse-docs` project and create a second project
   named exactly `clickhouse-docs-i18n`. Connect both to
   `ClickHouse/mintlify-docs-dev`; `vercel.json` disables automatic Git
   deployments because GitHub Actions creates the Git-backed deployments.
2. Give both projects the same build command (`pnpm run build:vercel`), output
   directory (`dist`), Node version, and automatic System Environment Variables.
3. Create a Microfrontends group containing both projects. Select
   `clickhouse-docs` as the default application, set `/docs` as its default
   route, and set the Preview fallback environment to Production. The routing
   source of truth is `microfrontends.json`; the existing website Worker needs
   to route only to the default project.
4. Create the `connect-preview` Custom Environment on the English project.
5. Create a Vercel-managed GitHub connector named `clickhouse-docs` and install
   it only for the private repositories registered in `remotes.json` and any
   private forks that are explicitly allowed to receive previews.
6. Attach `github/clickhouse-docs` to Production on both projects and to
   `connect-preview` on the English project. Set
   `DOCS_GITHUB_CONNECTOR=github/clickhouse-docs` in those environments, but
   not in standard Preview.
7. Keep standard Preview free of secrets and privileged integrations. Every
   base-repository pull request builds from the primary repository's synthetic
   merge ref in this environment and omits registered remotes.
8. Add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` as repository
   secrets under GitHub Actions. Add the translations project's ID as the
   repository variable `VERCEL_TRANSLATIONS_PROJECT_ID`; project IDs are not
   credentials. Remote repositories need no new Vercel secret because their
   reusable production calls deploy English only.
9. For the initial rollout, manually deploy `translations` first, then deploy
   `english`. After the translations project has a Production deployment,
   ordinary English previews can safely use it as their Production fallback.
