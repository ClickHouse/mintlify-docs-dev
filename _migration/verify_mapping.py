#!/usr/bin/env python3
"""
Verify mapping from Docusaurus to Mintlify docs.

Compares two doc trees by matching on the `slug` frontmatter field,
then produces an interactive color-coded report.

Usage:
    python scripts/verify_mapping.py --mintlify /path/to/mintlify/docs --docusaurus /path/to/docusaurus/docs
"""

import argparse
import csv
import json
import os
import re
import sys
from pathlib import Path


# ANSI colors
GREEN = "\033[92m"
RED = "\033[91m"
BLUE = "\033[94m"
YELLOW = "\033[93m"
BOLD = "\033[1m"
RESET = "\033[0m"


def parse_frontmatter(content: str) -> dict:
    match = re.match(r"^---\s*\n(.*?)\n---\s*\n", content, re.DOTALL)
    if not match:
        return {}
    fm = {}
    for line in match.group(1).splitlines():
        # Simple key: value parsing (handles quoted and unquoted values)
        m = re.match(r"^(\w[\w_-]*)\s*:\s*(.+)$", line)
        if m:
            key = m.group(1).strip()
            value = m.group(2).strip().strip("'\"")
            fm[key] = value
    return fm


def normalize_slug(slug: str) -> str:
    return slug.strip().strip("/").lower()


# Specific files (relative to scan root) that should be skipped even if they
# have a slug. Vale lint fixtures contain intentionally-invalid content with
# placeholder slugs and shouldn't show up in the mapping report.
SKIP_FILES = (
    "scripts/vale/test/test_headings_must_fail.md",
)


def scan_docs(root: Path, skip_dirs: tuple = ("snippets", "_snippets", "__pycache__", "en", "i18n", "src")) -> dict:
    """Scan a docs directory and return {normalized_slug: {slug, title, path}}."""
    pages = {}
    duplicates = []

    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in skip_dirs]

        for fname in filenames:
            if not fname.endswith((".md", ".mdx")):
                continue

            filepath = Path(dirpath) / fname
            rel_path = str(filepath.relative_to(root))
            if rel_path in SKIP_FILES:
                continue

            try:
                content = filepath.read_text(encoding="utf-8")
            except Exception as e:
                print(f"{YELLOW}Warning: Could not read {filepath}: {e}{RESET}")
                continue

            fm = parse_frontmatter(content)
            slug = fm.get("slug")
            if not slug:
                continue

            title = fm.get("title", filepath.stem)
            norm = normalize_slug(slug)

            if norm in pages:
                duplicates.append((norm, pages[norm]["path"], rel_path))
            else:
                pages[norm] = {"slug": slug, "title": title, "path": rel_path}

    for norm, path1, path2 in duplicates:
        print(f"{YELLOW}Warning: Duplicate slug '{norm}' in {path1} and {path2}{RESET}")

    return pages


def print_summary(docusaurus: dict, mintlify: dict, mapped: list, unmapped: list, new_additions: list, deleted: dict = None):
    total_docu = len(docusaurus)
    total_mint = len(mintlify)
    n_mapped = len(mapped)
    n_unmapped = len(unmapped)
    n_new = len(new_additions)
    n_deleted = len(deleted) if deleted else 0

    pct = (n_mapped / total_docu * 100) if total_docu > 0 else 0
    bar_width = 40
    filled = int(bar_width * pct / 100)

    print(f"\n{BOLD}=== Docusaurus to Mintlify Mapping Report ==={RESET}\n")
    print(f"  Docusaurus pages:  {total_docu}")
    print(f"  Mintlify pages:    {total_mint}")
    print(f"  Mapped:            {GREEN}{n_mapped}{RESET}")
    print(f"  Unmapped:          {RED}{n_unmapped}{RESET}")
    print(f"  New additions:     {BLUE}{n_new}{RESET}")
    if n_deleted:
        print(f"  Deleted (retired): {YELLOW}{n_deleted}{RESET}")
    print()
    print(f"  Migration progress: [{GREEN}{'█' * filled}{RESET}{'░' * (bar_width - filled)}] {pct:.1f}%")
    print()


def print_page_list(pages: list, color: str, label: str, source_key: str):
    print(f"\n{BOLD}{color}--- {label} ({len(pages)}) ---{RESET}")
    for slug, info in sorted(pages, key=lambda x: x[0]):
        print(f"  {color}{info[source_key]:60s}{RESET}  slug: {slug}")
    print()


def export_csv(docusaurus: dict, mintlify: dict, mapped: list, unmapped: list, new_additions: list, output_path: str):
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["slug", "title", "docusaurus_path", "mintlify_path", "status"])
        for slug, _ in sorted(mapped, key=lambda x: x[0]):
            d = docusaurus[slug]
            m = mintlify[slug]
            writer.writerow([d["slug"], d["title"], d["path"], m["path"], "mapped"])
        for slug, info in sorted(unmapped, key=lambda x: x[0]):
            writer.writerow([info["slug"], info["title"], info["path"], "", "unmapped"])
        for slug, info in sorted(new_additions, key=lambda x: x[0]):
            writer.writerow([info["slug"], info["title"], "", info["path"], "new_addition"])
    print(f"\n  Exported to {output_path}")


def interactive_menu(docusaurus: dict, mintlify: dict, mapped: list, unmapped: list, new_additions: list, deleted_pages: dict = None):
    while True:
        print(f"{BOLD}Options:{RESET}")
        print("  1) Show unmapped pages (Docusaurus only)")
        print("  2) Show new addition pages (Mintlify only)")
        print("  3) Show deleted/retired pages")
        print("  4) Export to CSV")
        print("  5) Quit")
        print()

        try:
            choice = input("Choose an option: ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            break

        if choice == "1":
            print_page_list(unmapped, RED, "Unmapped pages", "path")
        elif choice == "2":
            print_page_list(new_additions, BLUE, "New addition pages", "path")
        elif choice == "3":
            print(f"\n{BOLD}{YELLOW}--- Deleted / Retired Pages ({len(deleted_pages or {})}) ---{RESET}")
            for slug, info in sorted((deleted_pages or {}).items()):
                print(f"  {YELLOW}{info['docusaurus_slug']:55s}{RESET}  → {info['redirect_to']}")
            print()
        elif choice == "4":
            try:
                path = input("  Output file path [mapping.csv]: ").strip() or "mapping.csv"
            except (EOFError, KeyboardInterrupt):
                print()
                continue
            export_csv(docusaurus, mintlify, mapped, unmapped, new_additions, path)
            print()
        elif choice == "5":
            break
        else:
            print(f"  {YELLOW}Invalid option.{RESET}\n")


def load_deleted_pages(mintlify_root: Path) -> dict:
    """Load pages with status=deleted from slug-map.csv.

    Returns {normalized_docusaurus_slug: {mintlify_path, redirect_to}} so
    verify_mapping can (a) exclude them from the unmapped list and (b) check
    that a redirect exists from the old Mintlify path to the declared destination.
    """
    deleted = {}
    slug_map = mintlify_root / "_migration" / "slug-map.csv"
    if not slug_map.is_file():
        return deleted
    try:
        with open(slug_map, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row.get("status") != "deleted":
                    continue
                docu_slug = normalize_slug(row.get("docusaurus_slug", ""))
                mintlify_file = row.get("mintlify_file", "").strip()
                # Derive the old Mintlify URL path from the file path
                # e.g. get-started/about/olap.mdx -> /get-started/about/olap
                mintlify_path = "/" + re.sub(r"\.mdx?$", "", mintlify_file) if mintlify_file else ""
                redirect_to = row.get("new_url", "").strip()
                if docu_slug:
                    deleted[docu_slug] = {
                        "mintlify_path": mintlify_path,
                        "redirect_to": redirect_to,
                        "docusaurus_slug": row.get("docusaurus_slug", ""),
                    }
    except Exception as e:
        print(f"{YELLOW}Warning: Could not load deleted pages from {slug_map}: {e}{RESET}")
    return deleted


def load_redirects(mintlify_root: Path) -> set:
    """Load redirects and return normalized source slugs.

    Redirects are composable: docs.json references them via
    `"redirects": {"$ref": "_site/redirects.json"}`. The canonical
    definitions live in _site/redirects.json as a flat list of
    {source, destination} objects, which we read directly.
    """
    redirects = set()
    redirects_json = mintlify_root / "_site" / "redirects.json"
    if not redirects_json.is_file():
        return redirects
    try:
        entries = json.loads(redirects_json.read_text(encoding="utf-8"))
        for r in entries:
            source = r.get("source", "")
            # Strip leading /docs/ prefix to match slug format
            slug = re.sub(r"^/?docs/", "", source.strip("/"))
            redirects.add(normalize_slug(slug))
    except Exception as e:
        print(f"{YELLOW}Warning: Could not parse redirects from {redirects_json}: {e}{RESET}")
    return redirects


def scan_unlisted_pages(mintlify_root: Path, skip_dirs: tuple = ("snippets", "_snippets", "__pycache__")) -> set:
    """Scan directories containing pages that exist but aren't in the nav (e.g. quickstarts).
    Returns normalized slugs for these pages."""
    unlisted_slugs = set()

    # Quickstarts directory: pages are rendered via a component, not nav entries
    quickstarts_dir = mintlify_root / "get-started" / "quickstarts"
    if quickstarts_dir.is_dir():
        for filepath in quickstarts_dir.glob("**/*"):
            if not filepath.suffix in (".md", ".mdx"):
                continue
            if filepath.name == "home.mdx":
                continue
            if any(part.startswith("_") for part in filepath.relative_to(quickstarts_dir).parts[:-1]):
                continue
            try:
                content = filepath.read_text(encoding="utf-8")
            except Exception:
                continue
            fm = parse_frontmatter(content)
            slug = fm.get("slug")
            if slug:
                unlisted_slugs.add(normalize_slug(slug))

    return unlisted_slugs


def main():
    parser = argparse.ArgumentParser(description="Verify mapping from Docusaurus to Mintlify docs.")
    parser.add_argument("--mintlify", required=True, type=str, help="Path to the Mintlify docs folder")
    parser.add_argument("--docusaurus", required=True, type=str, help="Path to the Docusaurus docs folder")
    args = parser.parse_args()

    mintlify_root = Path(args.mintlify).resolve()
    docusaurus_root = Path(args.docusaurus).resolve()

    if not mintlify_root.is_dir():
        print(f"{RED}Error: Mintlify path does not exist: {mintlify_root}{RESET}", file=sys.stderr)
        sys.exit(1)
    if not docusaurus_root.is_dir():
        print(f"{RED}Error: Docusaurus path does not exist: {docusaurus_root}{RESET}", file=sys.stderr)
        sys.exit(1)

    print(f"Scanning Docusaurus docs: {docusaurus_root}")
    docusaurus = scan_docs(docusaurus_root)
    print(f"  Found {len(docusaurus)} pages with slugs")

    print(f"Scanning Mintlify docs: {mintlify_root}")
    mintlify = scan_docs(mintlify_root)
    print(f"  Found {len(mintlify)} pages with slugs")

    # Load redirects from _site/redirects.json to treat redirect sources as mapped
    redirect_slugs = load_redirects(mintlify_root)
    if redirect_slugs:
        print(f"  Found {len(redirect_slugs)} redirects in _site/redirects.json")

    # Scan for unlisted pages (e.g. quickstarts) that exist but aren't in the nav
    unlisted_slugs = scan_unlisted_pages(mintlify_root)
    if unlisted_slugs:
        print(f"  Found {len(unlisted_slugs)} unlisted pages (quickstarts, etc.)")

    # Load intentionally deleted/retired pages from slug-map.csv
    deleted_pages = load_deleted_pages(mintlify_root)
    if deleted_pages:
        print(f"  Found {len(deleted_pages)} deleted pages in slug-map.csv")

    docu_slugs = set(docusaurus.keys())
    # Exclude deleted pages from unmapped — they are intentionally retired
    accounted_slugs = set(mintlify.keys()) | redirect_slugs | unlisted_slugs | set(deleted_pages.keys())
    mint_slugs = set(mintlify.keys()) | redirect_slugs | unlisted_slugs

    mapped = [(s, docusaurus[s]) for s in sorted(docu_slugs & accounted_slugs - set(deleted_pages.keys()))]
    unmapped = [(s, docusaurus[s]) for s in sorted(docu_slugs - accounted_slugs)]
    new_additions = [(s, mintlify[s]) for s in sorted((set(mintlify.keys())) - docu_slugs)]

    # Verify each deleted page has a redirect in _site/redirects.json
    all_redirect_sources = set()
    redirects_json = mintlify_root / "_site" / "redirects.json"
    if redirects_json.is_file():
        try:
            for r in json.loads(redirects_json.read_text(encoding="utf-8")):
                all_redirect_sources.add(r.get("source", "").rstrip("/"))
        except Exception:
            pass

    print(f"\n{BOLD}=== Deleted / Retired Pages ==={RESET}")
    all_ok = True
    for slug, info in sorted(deleted_pages.items()):
        path = info["mintlify_path"]
        dest = info["redirect_to"]
        has_redirect = path in all_redirect_sources
        icon = f"{GREEN}✓{RESET}" if has_redirect else f"{RED}✗{RESET}"
        status = "redirect verified" if has_redirect else f"{RED}MISSING REDIRECT{RESET}"
        print(f"  {icon}  {info['docusaurus_slug']:55s} → {dest}  [{status}]")
        if not has_redirect:
            all_ok = False
    if not deleted_pages:
        print("  (none)")
    if not all_ok:
        print(f"\n  {RED}Some deleted pages are missing redirects in _site/redirects.json!{RESET}")
    print()

    print_summary(docusaurus, mintlify, mapped, unmapped, new_additions, deleted_pages)

    # Translation summary
    scan_translations(docusaurus_root, mintlify_root)

    interactive_menu(docusaurus, mintlify, mapped, unmapped, new_additions, deleted_pages)


# Docusaurus uses "jp", Mintlify uses "ja"; others match
LANG_MAP_DOCU_TO_MINT = {"jp": "ja", "ko": "ko", "ru": "ru", "zh": "zh"}


def scan_translations(docusaurus_root: Path, mintlify_root: Path):
    docu_i18n = docusaurus_root / "i18n"
    mint_i18n = mintlify_root / "i18n"

    if not docu_i18n.is_dir():
        return

    print(f"{BOLD}=== Translation Migration Summary ==={RESET}\n")

    for docu_lang, mint_lang in sorted(LANG_MAP_DOCU_TO_MINT.items()):
        docu_lang_dir = docu_i18n / docu_lang / "docusaurus-plugin-content-docs"
        mint_lang_dir = mint_i18n / mint_lang

        if not docu_lang_dir.is_dir():
            continue

        docu_pages = scan_docs(docu_lang_dir, skip_dirs=("snippets", "_snippets", "__pycache__"))
        mint_pages = scan_docs(mint_lang_dir, skip_dirs=("snippets", "_snippets", "__pycache__")) if mint_lang_dir.is_dir() else {}

        total = len(docu_pages)
        matched = len(set(docu_pages.keys()) & set(mint_pages.keys()))
        pct = (matched / total * 100) if total > 0 else 0
        bar_width = 30
        filled = int(bar_width * pct / 100)

        color = GREEN if pct > 80 else YELLOW if pct > 40 else RED
        print(f"  {mint_lang}: [{color}{'█' * filled}{RESET}{'░' * (bar_width - filled)}] {pct:5.1f}%  ({matched}/{total})")

    print()


if __name__ == "__main__":
    main()