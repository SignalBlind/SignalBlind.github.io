#!/usr/bin/env python3
"""
Add permalink front matter to pages with spaces in their filenames.
Replaces spaces with underscores for clean URLs.

Usage: python3 fix_permalinks.py [site_root]

Defaults to the parent directory of the tools/ folder.
"""

import re
import sys
from pathlib import Path

SKIP_DIRS = {'_site', 'assets', 'tools', 'node_modules', 'vendor', '.jekyll-cache', '.sass-cache', 'tags'}


def has_permalink(content):
    """Check if front matter already contains a permalink."""
    match = re.match(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return False
    return 'permalink:' in match.group(1)


def add_permalink(filepath, site_root):
    """Add permalink to a markdown file's front matter."""
    with open(filepath, 'r') as f:
        content = f.read()

    # Must have front matter
    if not content.startswith('---'):
        return False

    if has_permalink(content):
        return False

    # Build permalink from relative path
    rel = filepath.relative_to(site_root)
    # Remove .md extension, replace spaces with underscores
    permalink_path = str(rel.with_suffix('')).replace(' ', '_')
    permalink = f'/{permalink_path}/'

    # Insert permalink into front matter
    content = content.replace('---\n', f'---\npermalink: {permalink}\n', 1)

    with open(filepath, 'w') as f:
        f.write(content)

    return True


def main():
    if len(sys.argv) > 1:
        site_root = Path(sys.argv[1])
    else:
        site_root = Path(__file__).resolve().parent.parent

    count = 0
    for md_file in sorted(site_root.rglob('*.md')):
        # Skip directories we don't care about
        rel = md_file.relative_to(site_root)
        parts = rel.parts
        if any(p in SKIP_DIRS or p.startswith('.') for p in parts):
            continue

        # Only process files with spaces in their path
        if ' ' not in str(rel):
            continue

        if add_permalink(md_file, site_root):
            permalink_path = str(rel.with_suffix('')).replace(' ', '_')
            print(f"  {rel}  ->  /{permalink_path}/")
            count += 1

    if count:
        print(f"\nAdded permalinks to {count} files.")
    else:
        print("No files needed permalink changes.")


if __name__ == '__main__':
    main()
