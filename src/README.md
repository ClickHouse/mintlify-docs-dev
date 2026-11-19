# Nimbus site (Project Nimbus POC)

Astro 7 + `@cloudflare/nimbus-docs` build of the ClickHouse docs, living next to the
Mintlify content it renders. Content files are untouched: a compatibility layer makes the
Mintlify-flavoured MDX build (see `src/plugins/vite-mintlify-snippets.ts` and
`src/components/compat/`). Findings and measurements: `../reports/nimbus-poc-notes.md`.

## Commands (run in `docs/`)

| Command                          | What it does                                                                                                                                                                                                             |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm install`                   | Node 24, pnpm 10.                                                                                                                                                                                                        |
| `pnpm build`                     | Resolves registered Nimbus sources, builds the selected locale scope, rebases URLs, generates `__redirects`, nests under `dist/docs`, and enforces the Worker asset limits.                                              |
| `pnpm run build:vercel`          | Resolves registered Nimbus sources using Vercel Connect where required, removes the deployment OIDC identity, and builds the English, translations, or legacy combined Vercel artifact selected by `DOCS_DEPLOY_TARGET`. |
| `pnpm dev`                       | Astro dev server (`/docs/...`).                                                                                                                                                                                          |
| `pnpm check:mdx`                 | Compiles every MDX file with Sätteri and reports undefined components; seconds, no build.                                                                                                                                |
| `pnpm measure`                   | Page weight, anchor parity, base-path check, URL parity vs the live Mintlify sitemap (needs a nested build in `$DOCS_OUT_DIR`).                                                                                          |
| `pnpm preview:cf`                | `wrangler dev` on the docs Worker (`worker/index.ts`) serving `dist/`.                                                                                                                                                   |
| `pnpm run deploy`                | Deploys `dist/` to the production Worker selected by `DOCS_LOCALE`.                                                                                                                                                      |
| `pnpm run deploy:preview`        | Uploads `dist/` as an aliased Worker version selected by `DOCS_PREVIEW_ALIAS`.                                                                                                                                           |
| `pnpm exec astro sync`           | Resolves the `remotes.json` repositories into native Nimbus source snapshots.                                                                                                                                            |
| `pnpm exec nimbus-docs outdated` | Compares `nimbus.json` against the Nimbus registry; run before bumping `@cloudflare/nimbus-docs`. Starter-file drift stays unavailable until `templatesTag` is set in `nimbus.json`.                                     |

## Environment variables

| Variable                                                        | Effect                                                                                                                                                                                                                                              |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DOCS_DEPLOY_TARGET`                                            | Vercel artifact to assemble: `english`, `translations`, or the backward-compatible `combined` default.                                                                                                                                              |
| `DOCS_INCLUDE`                                                  | Comma-separated globs restricting the English collection (spikes, scoped previews).                                                                                                                                                                 |
| `DOCS_LOCALE`                                                   | A singular locale build (`en`, `es`, `pt-BR`, and so on); normally set only by the Vercel shard orchestrator.                                                                                                                                       |
| `DOCS_LOCALES`                                                  | Translations included in a `translations` or legacy `combined` artifact: `none`, `all`, or a comma-separated list such as `es,fr`. The translations project uses `all`.                                                                             |
| `DOCS_REMOTES`                                                  | Registered remote-source scope: `none` for an ordinary base-repository preview and `all` for source previews, production, and a base preview carrying `docs-preview-show-remotes`.                                                                  |
| `DOCS_REMOTE_NAME`, `DOCS_REMOTE_REPOSITORY`, `DOCS_REMOTE_REF` | CI-only tuple selecting one registered remote at an immutable commit for an English source pull-request preview. Required for that `connect-preview` mode; a trusted base preview with `docs-preview-show-remotes` instead uses `DOCS_REMOTES=all`. |
| `DOCS_REMOTE_SOURCE_REPOSITORY`                                 | CI-derived PR-head repository, retained only for preview attribution and edit links. It defaults to the registered repository.                                                                                                                      |
| `DOCS_REMOTE_PULL_REQUEST_REF`                                  | CI-only base-repository PR ref (`refs/pull/<number>/head`) to fetch and verify against `DOCS_REMOTE_REF`.                                                                                                                                           |
| `DOCS_PREVIEW_ALIAS`                                            | Lowercase Cloudflare alias used by `pnpm run deploy:preview`.                                                                                                                                                                                       |
| `DOCS_GITHUB_CONNECTOR`                                         | Vercel Connect GitHub connector UID, for example `github/clickhouse-docs`. Configure it only for `production` and the `connect-preview` Custom Environment.                                                                                         |
| `DOCS_OUT_DIR`, `DOCS_CACHE_DIR`                                | Isolated output and cache directories. Vercel uses one persistent Astro cache per deployment target and locale under `node_modules/.astro/`.                                                                                                        |
| `NODE_OPTIONS=--max-old-space-size=8192`                        | Recommended for full builds. Locale processes run sequentially, so memory is bounded to one content tree at a time.                                                                                                                                 |

## Layout

- `astro.config.ts`: Nimbus config, Sätteri processor (heading attributes + math), URL rebaser, mermaid, compat Vite plugin.
- `src/content.config.ts`: `docs` (English, path-derived ids) and one collection per locale (`es`, `pt-br`, ...).
- `src/pages/[...slug].astro`, `src/pages/[locale]/[...slug].astro`: page routes (locale pages fall back to English).
- `src/pages/nav/[...key].astro`: lazy sidebar fragments; `src/lib/sidebar-lazy.ts`.
- `src/pages/[...slug]/index.md.ts`, `src/pages/[...section]/llms.txt.ts`, `src/pages/llms*.txt.ts`: Nimbus agent surfaces. Every human-language route points to the same canonical English `<page>/index.md`; no generated `.mdx` or localized agent copies are emitted. Nimbus emits source-aware section indexes and partitions large corpora.
- `src/components/compat/`: Mintlify component names on Nimbus components; `react/` shims for snippet JSX.
- `bin/`: generators and measurement scripts; `worker/`: Cloudflare Worker; `wrangler.jsonc`.
- `nimbus.json`: CLI-maintained provenance of the registry components under `src/components/ui/` (slug, registry release, content hash, `modified` flag). Written by `nimbus-docs init`; `nimbus-docs add` appends to it. Starter provenance is `null` because the site was adopted, not scaffolded. `lastReviewedNimbusVersion` is the upgrade baseline: after bumping `@cloudflare/nimbus-docs`, run `pnpm exec nimbus-docs migrate --from <previous version>` and review its entries, or the build refuses to start.
- `src/generated/` (gitignored): sidebar items, import index, island wrappers.

Nimbus sources are configured in `astro.config.ts`. The shared repository,
mount, and preview metadata it consumes lives in `remotes.json`; it contains no
copied source pages or source-owned navigation. Remote CI supplies a registered
name, repository, and exceptional immutable SHA only when requesting a preview.

## Multisource repository operations

`astro.config.ts` is the Nimbus configuration authority. It constructs native
Nimbus sources from the shared metadata in `remotes.json` and mounts each one
below `/docs`. A registered upstream repository owns the canonical **English**
pages _and its navigation slice_. The primary English collection deliberately
excludes source mounts, so neither pages nor a central navigation mirror can
shadow the upstream owner.

Nimbus resolves each source snapshot during `astro sync`. Sidebar generation
then reads the source's `docs.json`, following its `$ref` files, or its
`navigation.json` directly for the existing integration repositories. The main
repository controls only the source's placement among global site sections;
the source repository controls its labels, groups, and page order.

| Registered source     | Canonical repository and directory                    | Published below `/docs`                                | Access  |
| --------------------- | ----------------------------------------------------- | ------------------------------------------------------ | ------- |
| `clickhouse-operator` | `ClickHouse/clickhouse-operator` — `docs`             | `products/kubernetes-operator`                         | Public  |
| `clickhouse-private`  | `ClickHouse/airgap-docs` — repository root            | `products/clickhouse-private`                          | Private |
| `clickhouse-cpp`      | `ClickHouse/clickhouse-cpp` — `docs`                  | `integrations/language-clients/cpp`                    | Public  |
| `clickhouse-rs`       | `ClickHouse/clickhouse-rs` — `docs`                   | `integrations/language-clients/rust`                   | Public  |
| `clickhouse-go`       | `ClickHouse/clickhouse-go` — `docs`                   | `integrations/language-clients/go`                     | Public  |
| `clickhouse-c`        | `ClickHouse/clickhouse-c` — `docs`                    | `integrations/language-clients/c`                      | Public  |
| `clickhouse-cs`       | `ClickHouse/clickhouse-cs` — `docs`                   | `integrations/language-clients/csharp`                 | Public  |
| `clickhouse-java`     | `ClickHouse/clickhouse-java` — `docs/clickhouse-docs` | `integrations/language-clients/java`                   | Public  |
| `clickhouse-odbc`     | `ClickHouse/clickhouse-odbc` — `docs`                 | `concepts/features/interfaces/odbc`                    | Public  |
| `chdb`                | `chdb-io/chdb` — `docs`                               | `chdb`                                                 | Public  |
| `dbt-clickhouse`      | `ClickHouse/dbt-clickhouse` — `docs`                  | `integrations/connectors/data-ingestion/etl-tools/dbt` | Public  |

### Authentication and source resolution

Public sources are fetched anonymously. For a build that includes the private
`clickhouse-private` source, `bin/vercel-build.ts` uses the deployment's Vercel
OIDC identity and `DOCS_GITHUB_CONNECTOR` to request a short-lived,
read-only GitHub App installation token from Vercel Connect. The credential is
scoped to `ClickHouse/airgap-docs.git` and is exposed only to the `astro sync`
process that resolves the Nimbus snapshot. No GitHub credential is stored in
the repository or forwarded from GitHub Actions into Vercel.

### Base-repository previews and labels

The English and translations artifacts are separate Vercel projects. The
following labels apply to a pull request in `ClickHouse/mintlify-docs-dev`:

| Labels on the pull request                                                    | English preview                                                                                                                                                                        | Translation preview                                                                                          |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| None                                                                          | Standard Preview; builds this repository only and omits every remote source.                                                                                                           | The currently promoted translations deployment is used as the fallback.                                      |
| `docs-preview-show-remotes`                                                   | Trusted branches only. Uses the `connect-preview` Custom Environment and resolves every registered source, including the private source through Vercel Connect. Fork PRs are rejected. | Production fallback unless a translations label is also present.                                             |
| `docs-translations-all`                                                       | Same English behavior as the other labels on the PR.                                                                                                                                   | Builds the translations project with every supported locale.                                                 |
| `docs-translations-ar`, `-es`, `-fr`, `-ja`, `-ko`, `-pt-BR`, `-ru`, or `-zh` | Same English behavior as the other labels on the PR.                                                                                                                                   | Backward-compatible aliases; each still builds **all** locales because they share one translations artifact. |

Labels are case-insensitive. A translations preview intentionally has
`DOCS_REMOTES=none`: it validates localized content in this repository and
links remote areas to their production location. Add
`docs-preview-show-remotes` when the English preview must validate remote
navigation or upstream English content.

### Upstream source pull-request previews

Changes made in one of the registered upstream repositories use the manually
dispatched reusable workflow `.github/workflows/remote-docs-preview.yml`, with
the registered `remote_name`, source repository, and open pull-request number.
It builds trusted `mintlify-docs-dev` `main` plus that one upstream pull request
at its verified immutable SHA. The source preview is English-only; other remote
areas link to their production location. It runs in `connect-preview` so the
private source can obtain its Vercel Connect token if needed. A fork is fetched
through the registered repository's pull-request ref and is verified against
the approved head SHA; the fork itself is never given access to the connected
environment.

### Production and translations

Production builds always set `DOCS_REMOTES=all`. A push to this repository's
`main` deploys English, translations, or both according to the changed paths:
source and renderer configuration changes deploy both, an English-content change
deploys English, and a locale-only change deploys translations. A production
call from an upstream source repository defaults to English, which publishes
the newly canonical upstream English content without waiting for translated
copies.

Nimbus does not fetch localized content from any remote source. Translations
belong in this repository at `<locale>/<mount>/…`, using the same path below the
source mount; for example, a French C++ page belongs at
`fr/integrations/language-clients/cpp/…`. The supported locale roots are `ar`,
`es`, `fr`, `ja`, `ko`, `pt-BR`, `ru`, and `zh`. They remain generated output:
update the English source and use the established translation workflow rather
than manually editing a locale file. When a localized page is absent, the
translations deployment emits the corresponding English fallback. Updating
those generated locale files then triggers the translations project on the next
`main` deployment.

Remote repositories create previews through
`.github/workflows/remote-docs-preview.yml`. The caller invokes the reusable
workflow manually with a pull request number. It uses a repository-scoped
GitHub App token only to resolve the immutable head SHA and the branch or fork
repository that owns it, then asks Vercel to build trusted Nimbus `main` in the
`connect-preview` environment. The Vercel build uses
its OIDC identity to request a short-lived, `contents:read` token from Vercel
Connect for the registered source repository. For a fork, it fetches the
base repository's `refs/pull/<number>/head` ref and verifies it resolves to the
approved SHA; the fork repository is metadata only. Public repositories are
resolved anonymously. `bin/vercel-build.ts` runs credentialed `astro sync`, then
removes `VERCEL_OIDC_TOKEN` before any Markdown or MDX processing. The Actions
token never enters Vercel. Maintainers can also run the
workflow directly from the `mintlify-docs-dev` Actions page by providing the
registered source, repository, and open pull request number.

Standard Vercel Preview deployments are deliberately tokenless. Base-repository
pull requests use this environment and set `DOCS_REMOTES=none`, regardless of
whether their head branch belongs to the primary repository or a fork. To inspect
remote navigation and content in a base-repository preview, apply the
`docs-preview-show-remotes` label to a pull request from a trusted
`ClickHouse/mintlify-docs-dev` branch. The preview then runs in the
`connect-preview` environment with `DOCS_REMOTES=all`. The workflow rejects that
label on fork pull requests, because the connected environment may read private
remote repositories.

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
the pull request's immutable head revision from the registered repository's PR
ref. Trusted branches and forks have the same source-only build scope. They use
`connect-preview` so private registered sources can obtain a short-lived token;
public sources remain anonymously fetchable.

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
   merge ref in this environment and omits registered remotes by default. A
   trusted-branch pull request with the `docs-preview-show-remotes` label instead
   uses `connect-preview` to fetch all registered remotes.
8. Add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` as repository
   secrets under GitHub Actions. Add the translations project's ID as the
   repository variable `VERCEL_TRANSLATIONS_PROJECT_ID`; project IDs are not
   credentials. Remote repositories need no new Vercel secret because their
   reusable production calls deploy English only.
9. For the initial rollout, manually deploy `translations` first, then deploy
   `english`. After the translations project has a Production deployment,
   ordinary English previews can safely use it as their Production fallback.
