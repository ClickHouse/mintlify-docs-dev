#!/usr/bin/env python3
"""
Wrapper around lychee that preprocesses MDX files so lychee can resolve
{#anchor} syntax in headings. Converts:
  ## Heading Text {#anchor-id}
to:
  ## Heading Text <a id="anchor-id"></a>
so lychee's HTML id scanner finds the fragment.

Also inlines snippet imports so anchors defined inside snippets are visible
to lychee when checking the parent file.

Usage:
  python _migration/lychee-check.py [extra lychee args]
"""
import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
# Dirs to skip when collecting files to CHECK (but still copy as link targets)
EXCLUDE_CHECK = {"ja", "ko", "ru", "zh", "es", "pt-BR", "_migration"}
# Dirs to skip entirely — not copied and not checked
EXCLUDE_COPY = {"node_modules", ".git", ".mintlify", "_specs"}

HEADING_RE = re.compile(r"^(#{1,6} .*?)\s*\{#([^}]+)\}", re.MULTILINE)
# Matches: import Foo from '/snippets/...' or "../snippets/..."
IMPORT_RE = re.compile(
    r"""^import\s+(\w+)\s+from\s+['"]([^'"]*snippets[^'"]*)['"]\s*;?""",
    re.MULTILINE,
)
# Matches a self-closing JSX component use: <Foo /> or <Foo/>
COMPONENT_USE_RE = re.compile(r"<(\w+)\s*/>")


def collect_anchors(text: str) -> str:
    """Extract all anchor IDs from a snippet and return as hidden <a> tags."""
    anchors = []
    for m in HEADING_RE.finditer(text):
        anchors.append(f'<a id="{m.group(2)}"></a>')
    # Also find existing <a id="..."> tags
    for m in re.finditer(r'<a\s+id="([^"]+)"', text):
        anchors.append(f'<a id="{m.group(1)}"></a>')
    return "\n".join(anchors)


def preprocess(text: str, snippets_dir: Path) -> str:
    # Convert {#anchor} in headings to <a id="anchor">
    text = HEADING_RE.sub(lambda m: f'{m.group(1)} <a id="{m.group(2)}"></a>', text)

    # Find snippet imports and append their anchors to the file so lychee
    # can resolve fragment links that target content inside snippets.
    imports: dict[str, Path] = {}
    for m in IMPORT_RE.finditer(text):
        var_name, src = m.group(1), m.group(2)
        # Resolve path: /snippets/foo.mdx -> ROOT/snippets/foo.mdx
        if src.startswith("/"):
            candidate = ROOT / src.lstrip("/")
        else:
            candidate = snippets_dir / src
        if candidate.exists():
            imports[var_name] = candidate

    if imports:
        extra = []
        for var_name, snippet_path in imports.items():
            try:
                snippet_text = snippet_path.read_text(encoding="utf-8", errors="replace")
                anchors = collect_anchors(snippet_text)
                if anchors:
                    extra.append(f"<!-- anchors from {snippet_path.name} -->\n{anchors}")
            except OSError:
                pass
        if extra:
            text += "\n" + "\n".join(extra)

    return text


def main():
    snippets_dir = ROOT / "snippets"

    with tempfile.TemporaryDirectory() as tmpdir:
        tmproot = Path(tmpdir)

        # Symlink non-MDX top-level dirs (images, assets, etc.) so lychee
        # can resolve asset links without us having to copy gigabytes of files.
        for child in ROOT.iterdir():
            if child.is_dir() and child.name not in EXCLUDE_COPY and child.suffix == "":
                (tmproot / child.name).symlink_to(child)

        files = []
        for mdx in sorted(ROOT.rglob("*.mdx")):
            rel = mdx.relative_to(ROOT)
            if any(p in EXCLUDE_COPY for p in rel.parts):
                continue
            dest = tmproot / rel
            dest.parent.mkdir(parents=True, exist_ok=True)
            # Unlink any symlink created above for this dir, replace with real files
            if dest.is_symlink():
                dest.unlink()
            text = mdx.read_text(encoding="utf-8", errors="replace")
            dest.write_text(preprocess(text, snippets_dir), encoding="utf-8")
            # Only add to checked files if not in an excluded-from-check dir
            if not any(p in EXCLUDE_CHECK for p in rel.parts):
                files.append(str(dest))

        result = subprocess.run(
            ["lychee", f"--root-dir={tmpdir}", "--config", str(ROOT / "lychee.toml"), *sys.argv[1:], *files],
            cwd=tmpdir,
        )
        sys.exit(result.returncode)


if __name__ == "__main__":
    main()