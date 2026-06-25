#!/usr/bin/env python3
"""Populate _site/redirects.json (English) and per-locale redirect files.

Outputs:
  _site/redirects.json       — English redirects (referenced by docs.json)
  _site/redirects-ru.json
  _site/redirects-jp.json    (jp -> ja locale code rename)
  _site/redirects-ko.json
  _site/redirects-zh.json

docs.json references all five files as separate $ref array elements.

Run from repo root or _migration/:
    python _migration/add_slug_redirects.py
"""
import csv
import json
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
SLUG_MAP = REPO_ROOT / "_migration/slug-map.csv"
REDIRECTS_EN = REPO_ROOT / "_site/redirects.json"
MINTLIFY_DOMAIN = "https://private-7c7dfe99.mintlify.app"

# (docusaurus_locale_code, mintlify_locale_code)
LOCALES = [("ru", "ru"), ("jp", "ja"), ("ko", "ko"), ("zh", "zh")]


def to_destination(new_url: str) -> str:
    path = new_url.removeprefix(MINTLIFY_DOMAIN)
    if path.endswith("/index"):
        path = path[:-6]
    return path


def write_json(path: Path, data: list) -> None:
    path.write_text(json.dumps(data, indent=2) + "\n")


def main() -> None:
    existing_en = json.loads(REDIRECTS_EN.read_text())
    existing_by_source = {r["source"]: r for r in existing_en}

    slug_pairs: list[tuple[str, str]] = []  # (source, destination) for matched rows
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
                print(f"  [ambiguous] {row['docusaurus_slug']!r} — skipped")
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

            if source == destination:
                skipped_self += 1
                continue

            slug_pairs.append((source, destination))

            if source in existing_by_source:
                conflicts.append({
                    "source": source,
                    "existing": existing_by_source[source]["destination"],
                    "slugmap": destination,
                })
            else:
                new_en.append({"source": source, "destination": destination})

    # --- English redirects ---
    all_en = existing_en + new_en
    all_en.sort(key=lambda r: r["source"])
    all_en = [{"source": r["source"], "destination": r["destination"]} for r in all_en]

    # --- Per-locale redirect files ---
    locale_files: list[tuple[str, Path, list[dict]]] = []
    for old_code, new_code in LOCALES:
        entries = []
        for eng_src, eng_dst in slug_pairs:
            src = f"/{old_code}{eng_src}"
            dst = f"/{new_code}{eng_dst}"
            if src != dst:
                entries.append({"source": src, "destination": dst})
        # jp catch-all wildcard for paths not explicitly mapped
        if old_code == "jp":
            entries.append({"source": "/jp/:path*", "destination": "/ja/:path*"})
        entries.sort(key=lambda r: r["source"])
        path = REPO_ROOT / f"_site/redirects-{old_code}.json"
        locale_files.append((old_code, path, entries))
        write_json(path, entries)

    write_json(REDIRECTS_EN, all_en)

    # --- Report ---
    print()
    print(f"English added:  {len(new_en)}")
    print(f"English total:  {len(all_en)}")
    for old_code, path, entries in locale_files:
        _, new_code = next((o, n) for o, n in LOCALES if o == old_code)
        print(f"/{old_code}/ -> /{new_code}/: {len(entries)}  ({path.name})")
    print()
    if conflicts:
        print(f"Conflicts (existing kept — review manually): {len(conflicts)}")
        for c in conflicts:
            same = " [same]" if c["existing"] == c["slugmap"] else ""
            print(f"  {c['source']}")
            print(f"    existing:  {c['existing']}")
            print(f"    slug-map:  {c['slugmap']}{same}")
        print()
    print(f"Skipped (no dest / unmatched): {skipped_no_dest}")
    print(f"Skipped (ambiguous):           {skipped_ambiguous}")
    print(f"Skipped (self-redirect):       {skipped_self}")


if __name__ == "__main__":
    main()
