#!/usr/bin/env python3
"""Populate redirect files from slug-map.csv and vercel.json.

Source files (edit these):
  _site/redirects-en.json    — English redirects
  _site/redirects-ru.json    — Russian locale
  _site/redirects-jp.json    — Japanese locale (jp -> ja code rename)
  _site/redirects-ko.json    — Korean locale
  _site/redirects-zh.json    — Chinese locale

Deployable output (generated, do not edit directly):
  _site/redirects.json       — merged from all locale source files

Run from repo root or _migration/:
    python _migration/add_slug_redirects.py
"""
import csv
import json
import os
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
SLUG_MAP = REPO_ROOT / "_migration/slug-map.csv"
# Path to the upstream Docusaurus repo's vercel.json. Defaults to a sibling
# `clickhouse-docs` checkout next to this repo; override with CLICKHOUSE_DOCS
# (repo root) or VERCEL_JSON (direct file path) env vars.
VERCEL_JSON = Path(
    os.environ.get("VERCEL_JSON")
    or (Path(os.environ["CLICKHOUSE_DOCS"]) / "vercel.json" if os.environ.get("CLICKHOUSE_DOCS") else "")
    or (REPO_ROOT.parent / "clickhouse-docs/vercel.json")
)
SITE = REPO_ROOT / "_site"
REDIRECTS_EN = SITE / "redirects-en.json"
REDIRECTS_OUT = SITE / "redirects.json"
MINTLIFY_DOMAIN = "https://private-7c7dfe99.mintlify.app"

LOCALES = [("ru", "ru"), ("jp", "ja"), ("ko", "ko"), ("zh", "zh")]


def to_destination(new_url: str) -> str:
    path = new_url.removeprefix(MINTLIFY_DOMAIN)
    if path.endswith("/index"):
        path = path[:-6]
    return path


def normalize_vercel(path: str) -> str:
    """Strip /docs/en or /docs prefix from a Vercel path."""
    for prefix in ("/docs/en", "/docs"):
        if path.startswith(prefix):
            remainder = path[len(prefix):]
            return remainder if remainder else "/"
    return path


def write_json(path: Path, data: list) -> None:
    path.write_text(json.dumps(data, indent=2) + "\n")


def main() -> None:
    existing_en = json.loads(REDIRECTS_EN.read_text()) if REDIRECTS_EN.exists() else []
    existing_by_source = {r["source"]: r for r in existing_en}

    # --- Phase 1: slug-map ---
    slug_map: dict[str, str] = {}  # docusaurus_slug -> mintlify_destination
    new_en: list[dict] = []
    conflicts: list[dict] = []
    skipped_no_dest = 0
    skipped_ambiguous = 0
    skipped_self = 0

    with open(SLUG_MAP, newline="") as f:
        for row in csv.DictReader(f):
            status = row["status"].strip()

            if status == "ambiguous":
                skipped_ambiguous += 1
                continue

            if status != "matched":
                skipped_no_dest += 1
                continue

            new_url = row["new_url"].strip()
            if not new_url:
                skipped_no_dest += 1
                continue

            source = row["docusaurus_slug"].strip()
            destination = to_destination(new_url)
            slug_map[source] = destination

            if source == destination:
                skipped_self += 1
                continue

            if source in existing_by_source:
                conflicts.append({
                    "source": source,
                    "existing": existing_by_source[source]["destination"],
                    "slugmap": destination,
                })
            else:
                new_en.append({"source": source, "destination": destination})

    all_en = existing_en + new_en
    all_en.sort(key=lambda r: r["source"])
    all_en = [{"source": r["source"], "destination": r["destination"]} for r in all_en]

    # Build lookup over all English redirects for chain resolution
    en_by_source = {r["source"]: r["destination"] for r in all_en}

    # --- Phase 2: vercel.json chain resolution ---
    vercel_new: list[dict] = []
    vercel_unresolvable: list[str] = []

    if not VERCEL_JSON.exists():
        raise SystemExit(
            f"ERROR: vercel.json not found at {VERCEL_JSON}\n"
            "Set CLICKHOUSE_DOCS (repo root) or VERCEL_JSON (file path) env var "
            "to point at the upstream Docusaurus checkout. Refusing to regenerate "
            "redirects without it — doing so would silently drop Vercel-sourced redirects."
        )

    vercel_redirects = json.loads(VERCEL_JSON.read_text()).get("redirects", [])
    for r in vercel_redirects:
        src_raw = r.get("source", "")
        dst_raw = r.get("destination", "")

        # Skip wildcards, has-conditions, and non-/docs entries
        if ":path*" in src_raw or r.get("has") or not src_raw.startswith("/docs"):
            continue

        src = normalize_vercel(src_raw)
        dst = normalize_vercel(dst_raw)

        # Already covered
        if src in en_by_source or src in existing_by_source:
            continue

        # Resolve destination: slug-map first, then existing Mintlify redirects
        mintlify_dest = slug_map.get(dst) or en_by_source.get(dst)

        if not mintlify_dest:
            vercel_unresolvable.append(src_raw)
            continue

        if src != mintlify_dest:
            vercel_new.append({"source": src, "destination": mintlify_dest})

    # Full English redirect set (existing + slug-map + vercel), deduped by source.
    en_seen: dict[str, dict] = {}
    for e in all_en + vercel_new:
        en_seen.setdefault(e["source"], e)
    all_en_final = sorted(en_seen.values(), key=lambda r: r["source"])
    all_en_final = [{"source": r["source"], "destination": r["destination"]} for r in all_en_final]
    write_json(REDIRECTS_EN, all_en_final)

    # --- Per-locale redirect files ---
    # The old->new path mapping is locale-independent, so every internal English
    # redirect gets a locale-prefixed counterpart. External destinations (full
    # URLs) and wildcard sources are left to English only.
    locale_files: list[tuple[str, Path, list[dict]]] = []
    for old_code, new_code in LOCALES:
        entries = []
        for r in all_en_final:
            eng_src, eng_dst = r["source"], r["destination"]
            if not eng_dst.startswith("/") or ":path*" in eng_src:
                continue
            src = f"/{old_code}{eng_src}"
            dst = f"/{new_code}{eng_dst}"
            if src != dst:
                entries.append({"source": src, "destination": dst})
        if old_code == "jp":
            entries.append({"source": "/jp/:path*", "destination": "/ja/:path*"})
        entries.sort(key=lambda r: r["source"])
        path = SITE / f"redirects-{old_code}.json"
        locale_files.append((old_code, path, entries))
        write_json(path, entries)

    all_entries = all_en_final + [e for _, _, entries in locale_files for e in entries]

    # Deduplicate by source (keep first)
    seen: dict[str, dict] = {}
    for e in all_entries:
        seen.setdefault(e["source"], e)
    all_entries = sorted(seen.values(), key=lambda r: r["source"])
    all_entries = [{"source": r["source"], "destination": r["destination"]} for r in all_entries]
    write_json(REDIRECTS_OUT, all_entries)

    # --- Report ---
    print(f"\nSlug-map:  added {len(new_en)}, total English {len(all_en)}")
    print(f"Vercel:    added {len(vercel_new)}, unresolvable {len(vercel_unresolvable)}")
    for old_code, path, entries in locale_files:
        new_code = next(n for o, n in LOCALES if o == old_code)
        print(f"/{old_code}/ -> /{new_code}/: {len(entries)}")
    print(f"Merged total: {len(all_entries)}")
    if vercel_unresolvable:
        print(f"\nUnresolvable vercel sources ({len(vercel_unresolvable)}):")
        for s in vercel_unresolvable:
            print(f"  {s}")
    if conflicts:
        print(f"\nConflicts kept (existing wins): {len(conflicts)}")
        for c in conflicts:
            if c["existing"] != c["slugmap"]:
                print(f"  {c['source']}: {c['existing']!r} vs {c['slugmap']!r}")
    print(f"\nSkipped (no dest): {skipped_no_dest}  ambiguous: {skipped_ambiguous}  self: {skipped_self}")


if __name__ == "__main__":
    main()
