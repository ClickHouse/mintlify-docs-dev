---
name: migrate-docusaurus-to-mintlify
description: Use when migrating ClickHouse docs pages from Docusaurus (clickhouse-docs) to Mintlify format in this repo, or when wiring up the migration script. Covers frontmatter rewrites, body transforms, component mapping, link normalization, and redirect generation. Slugs are canonical and must never be rewritten.
---

# Migrate Docusaurus pages to Mintlify

This skill describes the deterministic rules for converting a Docusaurus `.md`/`.mdx` page (source: `~/Desktop/clickhouse-docs/docs/**`) into a Mintlify page in this repo. The reference implementation lives at `~/Desktop/clickhouse-main` (a Mintlify-mapped snapshot Mintlify produced) — when in doubt, diff against it.

The migration is driven by a script at `_migration/migrate.py` (see the "Script" section). When the script can't decide, it leaves the original content with a `<!-- MIGRATE: ... -->` marker; resolve those by hand using the rules below.

## Hard rules

1. **Docusaurus is the source of truth for content.** Always read content from `~/Desktop/clickhouse-docs/<docusaurus_file>` (looked up via `slug-map.csv`'s `docusaurus_file` column). The in-repo Mintlify file's path tells you *where* the migrated output goes (docs have a new navigation layout in Mintlify) — its current contents may be mangled by the initial mapping pass and must be overwritten with a fresh transformation of the upstream source. The aim is complete preservation; the only changes are the Mintlify-necessary transforms in this skill (frontmatter, components, links, extension).
2. **Never rewrite a `slug:`**. Slugs are canonical Docusaurus URLs. If a Docusaurus page's slug differs from where Mintlify placed the file, that's a redirect, not a rename. (See [feedback_never_rename_slugs](../../../memory/feedback_never_rename_slugs.md).)
3. **Mintlify ignores `slug:` at build time** — URLs come from file paths. Keep `slug:` in frontmatter as legacy documentation; never write code that resolves Mintlify pages via that field.
4. Mintlify menu items use `root:`, not `href:`, for landing-page links.

## 1. Frontmatter

| Docusaurus | Mintlify | Notes |
| --- | --- | --- |
| `sidebar_label:` | `sidebarTitle:` | rename, preserve value |
| `slug:` | `slug:` | keep |
| `title:` / `description:` / `doc_type:` / `keywords:` | same | keep |
| `sidebar_position:` | — | drop |
| `sidebar_class_name:` | — | drop |
| `pagination_*` | — | drop |
| `hide_table_of_contents:` | — | drop |
| `tags:` | — | drop unless intentionally used |

Preserve quoting style. Don't touch keys you don't recognize — flag them.

## 2. File extension

- `.md` → `.mdx` if the body contains JSX (any `import` line, any `<Component>`, or any admonition/details that will be rewritten into JSX).
- Pure-prose `.md` stays `.md`.

## 3. Body transforms

- Delete the leading `# Title` line if it duplicates `title:` in frontmatter (it almost always does).
- Heading anchors `## Foo {#foo}` are preserved verbatim.
- Do **not** blanket-shift heading levels. Only remove the redundant H1.

## 4. Imports

Rewrite, don't blindly delete:

| Docusaurus import | Mintlify equivalent |
| --- | --- |
| `from '@site/docs/<path>/_snippets/_x.md'` | `from '/snippets/<actual-location-of-x.mdx>'` (snippets are flattened in this repo — look up the `.mdx` file by basename in the `snippets/` tree; **do not** assume the same nested path) |
| `from '@site/static/images/...'` (image var) | **delete the import**; inline the path string into the component (see Image rule) |
| `from '@theme/IdealImage'` | `from '/snippets/components/Image.jsx'` (named: `import { Image } from ...`) |
| `from '@theme/Tabs'`, `from '@theme/TabItem'` | **delete** (Tabs/Tab are first-class) |
| `from '@theme/<Component>'` | `from '/snippets/components/<Component>.jsx'` if that file exists in `snippets/components/`, else flag |
| `from '@docusaurus/...'` | **delete + flag** (e.g. `useBrokenLinks` has no Mintlify analogue) |
| `from '@site/src/components/<X>'` | map to `/snippets/components/<X>.jsx` if present, else flag |

Always check `snippets/components/` before assuming a component is missing.

## 5. Component rewrites

### Admonitions
```
:::note      → <Note>...</Note>
:::tip       → <Tip>...</Tip>
:::info      → <Info>...</Info>
:::warning   → <Warning>...</Warning>
:::caution   → <Warning>...</Warning>
:::danger    → <Warning>...</Warning>   (or <Danger> if the design system has it)
```
Titled admonitions appear in two forms — `:::tip Title` (space) and `:::tip[Title]` (square brackets). Treat both the same way: extract the title, wrap in the chosen tag, inject `**Title**` followed by a blank line as the first body line:
```
:::note Conclusion        →  <Info>
Body text.                     **Conclusion**
:::                            
                               Body text.
                               </Info>
```

### Details / Summary
```
<details>
  <summary>X</summary>
  body
</details>
```
→
```
<Accordion title="X">
body
</Accordion>
```
The summary may span multiple lines or include indentation — strip it to a single string for the `title=` attribute.

### Tabs
- `<Tabs groupId="...">` → `<Tabs>` (drop `groupId`)
- `<TabItem value="x" label="Y">` → `<Tab title="Y">` (drop `value`, rename `label`→`title`)
- `</TabItem>` → `</Tab>`

### Runnable code blocks
Docusaurus marks runnable SQL with a second info-string token. There are two variants — they migrate differently:

- ` ```sql runnable ` (token = `runnable`) → **wrap in `<RunnableCode>`** (this is an actually-runnable example).
- ` ```sql runnable=false ` (token = `runnable=false`) → **drop the token, leave a plain ` ```sql ` fence**. This is a non-runnable example explicitly opting out.

For the runnable case (component at `snippets/components/RunnableCode/RunnableCode.jsx`):
````
<RunnableCode>
```sql
SELECT 1
```
</RunnableCode>
````
Add the import once near the top of the file (matching the `<Image>` import convention):
```
import { RunnableCode } from "/snippets/components/RunnableCode/RunnableCode.jsx";
```
Preserve any other props/tokens on the original fence.

### Image
- `<Image img={someVar} ... />` → `<Image img="/static/images/<original-path>.<ext>" ... />`
  - The `<original-path>` is whatever the deleted `import someVar from '@site/static/images/<...>'` pointed at.
- Bare `![alt](path)` markdown images: leave alone unless they reference `@site/...`, in which case rewrite to a root-relative `/static/images/...` path.

## 6. Internal link normalization

Mintlify's URL for any page is its **file path relative to `docs.json`**, with the extension stripped (and a trailing `/index` collapsed to the parent). That single fact drives every link rewrite. There is no `/docs/` prefix to add and there are no slugs to preserve in URLs — the file's location IS its URL.

Build two lookups once before rewriting, both walking this repo:

- `slug_to_url`: from each page's frontmatter `slug:` (the legacy Docusaurus slug) to its Mintlify URL = `"/" + relpath_without_extension` (with `/index` collapsed).
- `path_to_url`: from each page's filesystem path to the same URL.

Then rewrite every link found in markdown (`[x](...)`), HTML (`<a href="...">`), and JSX URL-ish props:

### Case A — relative file link
Input looks like `[x](../../page.md)`, `[x](./page.mdx#frag)`, `[x](page.md)`.
1. Resolve the relative path against the **Docusaurus source file's** directory (not the Mintlify destination's). Walk up the slug map: from the page's current `slug:` find the row in `slug-map.csv`, take its `docusaurus_file`, and resolve `href` against that path.
2. Strip the trailing `.md` / `.mdx` (or treat `dir/index.md` and `dir/` as equivalent).
3. Look up the resolved Docusaurus path in `slug-map.csv` to get the page's slug, then map slug → Mintlify URL.
4. Rewrite to `[x](<mintlify_url>#frag)`. Preserve the fragment.

If the resolved file isn't a known page, leave the link with a `<!-- MIGRATE: unresolved relative link -->` marker.

### Case B — absolute Docusaurus slug link
Input looks like `[x](/some/docusaurus/slug)` or `[x](/some/docusaurus/slug#frag)`.
1. Strip any trailing `.md`/`.mdx` and `/index.md`/`/index.mdx` (Docusaurus accepts these forms in absolute links).
2. Try the slug map both with and without a trailing `/` — Docusaurus permits both, and frontmatter slugs occasionally include the trailing slash (e.g. `/sql-reference/data-types/`).
3. Rewrite to `[x](<mintlify_url>#frag)`.

If no slug matches either form, leave the original with a `<!-- MIGRATE: unknown slug -->` marker.

### Case C — on-domain absolute URL
Input `https://clickhouse.com/docs/<path>` (with or without fragment).
- Strip `https://clickhouse.com/docs` to get a slug-shaped path, then run Case B.

### Case D — external URL
Leave alone.

Do **not** strip `.md` and add `/docs/` as a generic step — that was the wrong mental model. The lookups handle every case.

## 7. Snippets (`_snippets/`)

Snippet partials live at `docs/**/_snippets/*.md` in Docusaurus and migrate to `snippets/**/_snippets/*.mdx` in Mintlify. They use the same body-transform rules as pages. They have no frontmatter / slug.

## 8. Redirects

- File: top-level `redirects.json` (already exists in `clickhouse-main`).
- Format: a JSON list of `{"source": "/docs/<old>", "destination": "/docs/<new>"}`.
- Mintlify also supports a `redirects` array in `docs.json`; the source-of-truth here is `redirects.json`.
- Emit a redirect when:
  - A Docusaurus slug has no matching Mintlify slug — destination is the closest current page (script may need a fallback or a `<!-- MIGRATE: pick-destination -->` marker).
  - A page existed in Docusaurus at slug A and its Mintlify counterpart now uses slug B (rare; do not invent these).
- Never write redirects that cause cycles or that point at the same source path.

## 9. Slug map CSV (QA aid)

`_migration/generate-slug-map.py` writes `_migration/slug-map.csv`. It pairs every Docusaurus slug with its Mintlify URL so a reviewer can open both pages side-by-side.

How it builds rows:
1. Walk the Docusaurus repo (`--docusaurus`, default `~/Desktop/clickhouse-docs`) and collect every `slug:`.
2. Walk this repo (the Mintlify side) and index pages by their frontmatter `slug:`.
3. For each Docusaurus slug, find the file in this repo with the same slug. The Mintlify URL is `<mintlify-base>` + that file's path without extension (with `/index` collapsed).

Columns: `docusaurus_slug, docusaurus_file, mintlify_file, old_url, new_url, status, migrated, manually_checked`.

Statuses:
- `matched` — exactly one Mintlify file carries that slug.
- `ambiguous` — multiple Mintlify files share the slug (a real bug to fix).
- `unmatched` — no Mintlify file has that slug (page deleted, or slug typo).

Tracking columns:
- `source_hash` — recomputed every time `generate-slug-map.py` runs. SHA-256 of the Docusaurus source file (first 16 hex chars). Reflects the current source content.
- `migrated` (default `false`) — `true` once the page has been transformed end-to-end per this skill. The migration script writes this; humans flip it for manual migrations.
- `migrated_hash` — the `source_hash` value at the moment the page was last migrated. The migration script writes this on every successful run.
- `migrated_at` — UTC ISO timestamp of the last migration. Diagnostic only.
- `manually_checked` (default `false`) — flip to `true` once a human has opened `old_url` and `new_url` side-by-side and confirmed parity. Never written by tools.

**Staleness rule:** a page is up-to-date iff `migrated == true` AND `migrated_hash == source_hash`. Any drift means the Docusaurus source has changed since the last migration → the page should be re-migrated. `_migration/migrate.py` enforces this by default; pass `--force` to override.

The generator preserves all tracking columns (`migrated`, `migrated_hash`, `migrated_at`, `manually_checked`) when re-run, so it's safe to regenerate at any time without losing progress.

Regenerate any time pages move or slugs change:
```
python _migration/generate-slug-map.py
python _migration/generate-slug-map.py --docusaurus ~/Desktop/clickhouse-docs \
    --mintlify-base https://private-7c7dfe99.mintlify.app
```

The same slug-keyed lookup that powers this CSV is what the migration script uses to rewrite Case-B links (see section 6).

## 10. Out of scope for the page-content script

Do not change these inside the migration pass:

- `docs.json` navigation registration — pages must still be added to nav by hand or by a separate tool.
- Image binary copying — already handled in `clickhouse-main/static/images/`.
- Anything in `openapi/`, `styles/`, `logo/`, `links/`.

## Script

The migration script is `_migration/migrate.py`. Invocation:

```
python _migration/migrate.py <path>          # one file or dir
python _migration/migrate.py --all           # whole repo
python _migration/migrate.py <path> --dry-run
python _migration/migrate.py --all --force   # re-migrate even up-to-date pages
```

**Standard workflow (incremental):**
```
python _migration/generate-slug-map.py       # refresh source_hash for all pages
python _migration/migrate.py --all           # process only pages whose source changed
```

`generate-slug-map.py` recomputes every page's `source_hash`; `migrate.py` skips any page where `migrated=true` AND `migrated_hash == source_hash`. After a Docusaurus repo pull, run both in sequence and only the changed pages are re-touched.

It builds the slug map by:
1. Walking this repo's `**/*.{md,mdx}` and recording every frontmatter `slug:` → file path.
2. Walking `~/Desktop/clickhouse-docs/docs/**/*.{md,mdx}` and recording every Docusaurus `slug:`.
3. Diffing (2) against (1) to emit `redirects.json` entries.

Unresolvable cases (missing snippet target, unknown `@theme/X` import, ambiguous redirect destination) get `<!-- MIGRATE: <reason> -->` in the output and are listed in the script's exit summary. Resolve them by hand using the rules above.

## When applying this skill

1. Read the source page in `clickhouse-docs`.
2. Read the destination page in this repo (it currently holds the unmodified Docusaurus content).
3. If a Mintlify counterpart exists in `clickhouse-main`, diff against it — that's the ground truth for ambiguous cases.
4. Apply rules 1–8 above. Don't refactor or re-word; mechanical translation only.
5. After editing, grep the file for leftover `:::`, `<details>`, `@site/`, `@theme/`, and `.md)` / `.md#` to catch missed transforms.
6. **Mark the row migrated.** In `slug-map.csv`, find the row whose `mintlify_file` matches the file you just migrated and flip `migrated` from `false` to `true`. The migration script does this automatically; if you migrate by hand, do it yourself.
