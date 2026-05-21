#!/usr/bin/env python3
"""
Script to fetch GitHub releases for ClickHouse language clients and generate
Mintlify <Update> components in the corresponding release-notes.mdx files.

Uses only Python stdlib (no pip dependencies required).

Usage:
    GITHUB_TOKEN=ghp_... python scripts/update_release_notes.py
"""

import json
import os
import re
import sys
import urllib.request
import urllib.error
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple


# Mapping: GitHub repo -> release-notes.mdx path (relative to project root)
REPO_CONFIG: List[Dict[str, str]] = [
    {
        "repo": "ClickHouse/clickhouse-js",
        "file": "docs/language-clients/javascript/release-notes.mdx",
    },
    {
        "repo": "ClickHouse/clickhouse-connect",
        "file": "docs/language-clients/python/release-notes.mdx",
    },
    {
        "repo": "ClickHouse/clickhouse-go",
        "file": "docs/language-clients/go/release-notes.mdx",
    },
    # Java is skipped for now (versioned structure)
    {
        "repo": "ClickHouse/clickhouse-rs",
        "file": "docs/language-clients/rust/release-notes.mdx",
    },
    {
        "repo": "ClickHouse/clickhouse-cpp",
        "file": "docs/language-clients/cpp/release-notes.mdx",
    },
    {
        "repo": "ClickHouse/clickhouse-cs",
        "file": "docs/language-clients/csharp/release-notes.mdx",
    },
]


def get_github_token() -> Optional[str]:
    """Return the GitHub token from the environment."""
    return os.environ.get("GITHUB_TOKEN")


def fetch_all_releases(repo: str, token: Optional[str]) -> List[Dict[str, Any]]:
    """
    Fetch all releases from a GitHub repo using pagination.

    Args:
        repo: GitHub repo in "owner/repo" format.
        token: GitHub personal access token (or Actions token).

    Returns:
        List of release dicts from the GitHub API.
    """
    releases: List[Dict[str, Any]] = []
    page = 1
    per_page = 100

    while True:
        url = (
            f"https://api.github.com/repos/{repo}/releases"
            f"?per_page={per_page}&page={page}"
        )
        req = urllib.request.Request(url)
        req.add_header("Accept", "application/vnd.github+json")
        req.add_header("X-GitHub-Api-Version", "2022-11-28")
        if token:
            req.add_header("Authorization", f"Bearer {token}")

        try:
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            print(f"  Error fetching {url}: {e.code} {e.reason}")
            break

        if not data:
            break

        releases.extend(data)

        if len(data) < per_page:
            break

        page += 1

    return releases


def format_date(published_at: str) -> str:
    """
    Format an ISO-8601 date string as 'YYYY-MM-DD'.

    Args:
        published_at: ISO-8601 datetime string from the GitHub API.

    Returns:
        Date formatted as 'YYYY-MM-DD'.
    """
    dt = datetime.fromisoformat(published_at.replace("Z", "+00:00"))
    return dt.strftime("%Y-%m-%d")


def sanitize_body_for_mdx(body: str) -> str:
    """
    Sanitize a GitHub release body so it is safe inside an MDX <Update> component.

    Handles:
    - HTML comments (stripped — unsupported inside JSX children)
    - Bare JSX-breaking characters ({, }) outside of code spans/blocks
    - Angle brackets that look like JSX tags (e.g. List<T>)
    - Setext-style headings (text\\n---) converted to ATX headings

    Args:
        body: Raw markdown body from a GitHub release.

    Returns:
        Sanitized markdown string safe for MDX.
    """
    if not body:
        return ""

    # Strip HTML comments (not supported inside JSX children)
    body = re.sub(r"<!--.*?-->", "", body, flags=re.DOTALL)

    # Convert Setext headings (text\n--- or text\n===) to ATX headings
    # This prevents --- from being misinterpreted in MDX
    body = re.sub(r"^(.+)\n===+\s*$", r"# \1", body, flags=re.MULTILINE)
    body = re.sub(r"^(.+)\n---+\s*$", r"## \1", body, flags=re.MULTILINE)

    lines = body.splitlines()
    result: List[str] = []
    in_code_block = False

    for line in lines:
        # Track fenced code blocks
        stripped = line.lstrip()
        if stripped.startswith("```"):
            in_code_block = not in_code_block
            result.append(line)
            continue

        if in_code_block:
            result.append(line)
            continue

        # Outside code blocks: escape { } and JSX-like <tags>
        line = _escape_outside_inline_code(line)
        result.append(line)

    return "\n".join(result)


def _escape_outside_inline_code(line: str) -> str:
    """
    Escape MDX-breaking characters that appear outside of inline code spans.

    Handles:
    - { and } → {'{'} and {'}'}
    - <Word> patterns that look like JSX tags → &lt;Word&gt;

    Args:
        line: A single line of markdown.

    Returns:
        Line with problematic characters escaped outside inline code.
    """
    # Split line by inline code spans (backtick-delimited)
    parts = re.split(r"(`[^`]*`)", line)
    escaped_parts: List[str] = []

    for i, part in enumerate(parts):
        if i % 2 == 1:
            # This is an inline code span — leave it alone
            escaped_parts.append(part)
        else:
            # Outside code — escape curly braces in a single pass
            part = re.sub(r"[{}]", lambda m: "{'{'}" if m.group() == "{" else "{'}'}", part)
            # Escape angle brackets that look like JSX tags but aren't
            # standard HTML elements (e.g. <T>, <SomeType>)
            part = _escape_jsx_like_tags(part)
            escaped_parts.append(part)

    return "".join(escaped_parts)


# Standard HTML elements that are safe in MDX
_SAFE_HTML_TAGS = {
    "a", "abbr", "address", "area", "article", "aside", "audio",
    "b", "base", "bdi", "bdo", "blockquote", "body", "br", "button",
    "canvas", "caption", "cite", "code", "col", "colgroup",
    "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt",
    "em", "embed",
    "fieldset", "figcaption", "figure", "footer", "form",
    "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html",
    "i", "iframe", "img", "input", "ins",
    "kbd",
    "label", "legend", "li", "link",
    "main", "map", "mark", "menu", "meta", "meter",
    "nav", "noscript",
    "object", "ol", "optgroup", "option", "output",
    "p", "param", "picture", "pre", "progress",
    "q",
    "rp", "rt", "ruby",
    "s", "samp", "script", "section", "select", "slot", "small", "source", "span",
    "strong", "style", "sub", "summary", "sup",
    "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time",
    "title", "tr", "track",
    "u", "ul",
    "var", "video",
    "wbr",
}


def _escape_jsx_like_tags(text: str) -> str:
    """
    Escape <Word> patterns that MDX would parse as JSX components.

    Standard HTML tags (e.g. <br>, <div>, <details>) are left alone.
    Non-standard tags (e.g. <T>, <SomeType>, <MyComponent>) are escaped.

    Args:
        text: Text outside of inline code spans.

    Returns:
        Text with non-HTML angle-bracket patterns escaped.
    """

    def _replace(m: re.Match) -> str:
        tag_name = m.group(2)
        if tag_name.lower() in _SAFE_HTML_TAGS:
            return m.group(0)
        return "&lt;" + m.group(0)[1:-1] + "&gt;"

    # Match < followed by optional /, a word (tag name), optional attrs, optional /, >
    return re.sub(r"<(/?)([A-Za-z]\w*)((?:\s[^>]*)?)(/?)>", _replace, text)


def parse_frontmatter(content: str) -> Tuple[str, str]:
    """
    Split an MDX file into its frontmatter block and the rest.

    Args:
        content: Full file content.

    Returns:
        Tuple of (frontmatter_block_including_delimiters, remainder).
    """
    match = re.match(r"^(---\s*\n.*?\n---\s*\n)", content, re.DOTALL)
    if match:
        return match.group(1), content[match.end() :]
    return "", content


def build_update_component(tag_name: str, published_at: str, body: str) -> str:
    """
    Build a single Mintlify <Update> component string.

    Args:
        tag_name: The release tag (e.g. 'v0.9.1').
        published_at: ISO-8601 published date.
        body: Release body markdown (already sanitized).

    Returns:
        An <Update>...</Update> MDX block.
    """
    label = format_date(published_at)
    safe_body = sanitize_body_for_mdx(body or "")

    # Trim trailing whitespace from body
    safe_body = safe_body.rstrip()

    return f'<Update label="{label}" description="{tag_name}">\n{safe_body}\n</Update>'


def generate_release_notes_body(releases: List[Dict[str, Any]]) -> str:
    """
    Generate the full body (below frontmatter) for a release-notes.mdx file.

    Releases are sorted newest-first by published_at.

    Args:
        releases: List of GitHub release dicts.

    Returns:
        MDX string with all <Update> components.
    """
    # Filter out drafts; keep pre-releases
    releases = [r for r in releases if not r.get("draft", False)]

    # Sort newest-first
    releases.sort(key=lambda r: r.get("published_at", ""), reverse=True)

    components: List[str] = []
    for release in releases:
        tag = release.get("tag_name", "unknown")
        published = release.get("published_at", "")
        body = release.get("body", "") or ""
        if not published:
            continue
        components.append(build_update_component(tag, published, body))

    return "\n\n".join(components) + "\n"


def update_release_notes_file(
    file_path: Path, releases: List[Dict[str, Any]]
) -> bool:
    """
    Rewrite a release-notes.mdx file, preserving frontmatter.

    Args:
        file_path: Absolute path to the .mdx file.
        releases: List of GitHub release dicts.

    Returns:
        True if the file was changed, False otherwise.
    """
    if not file_path.exists():
        print(f"  Warning: {file_path} does not exist, skipping")
        return False

    original = file_path.read_text(encoding="utf-8")
    frontmatter, _ = parse_frontmatter(original)

    if not frontmatter:
        print(f"  Warning: no frontmatter found in {file_path.name}, skipping")
        return False

    body = generate_release_notes_body(releases)
    new_content = frontmatter + "\n" + body

    if new_content == original:
        return False

    file_path.write_text(new_content, encoding="utf-8")
    return True


def main() -> int:
    """Main entry point."""
    token = get_github_token()
    if not token:
        print("Warning: GITHUB_TOKEN not set. API rate limits will be very low.")

    project_root = Path(__file__).resolve().parent.parent

    any_changed = False

    for cfg in REPO_CONFIG:
        repo = cfg["repo"]
        rel_path = cfg["file"]
        file_path = project_root / rel_path

        print(f"Fetching releases for {repo} ...")
        releases = fetch_all_releases(repo, token)
        print(f"  Found {len(releases)} release(s)")

        if not releases:
            print(f"  No releases found, skipping {rel_path}")
            continue

        changed = update_release_notes_file(file_path, releases)
        if changed:
            print(f"  Updated {rel_path}")
            any_changed = True
        else:
            print(f"  No changes for {rel_path}")

    if any_changed:
        print("\nDone — files were updated.")
    else:
        print("\nDone — no changes needed.")

    return 0


if __name__ == "__main__":
    sys.exit(main())
