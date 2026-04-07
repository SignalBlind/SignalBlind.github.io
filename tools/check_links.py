#!/usr/bin/env python3
"""
Check for broken internal markdown links.
Scans all .md files for links like [text](Something.md) and reports
any that point to files that don't exist.

Usage: python3 check_links.py <directory>
"""

import os
import re
import sys
from pathlib import Path
from urllib.parse import unquote


# Directories to skip
SKIP_DIRS = {'_site', '.jekyll-cache', 'vendor', 'node_modules', '.git', '.obsidian', '.claude'}


def find_all_md_files(directory):
    """Build a set of all .md file paths relative to the directory."""
    md_files = set()
    for filepath in directory.rglob('*.md'):
        if any(part in SKIP_DIRS for part in filepath.parts):
            continue
        md_files.add(filepath)
    return md_files


def check_file(filepath, directory):
    """Check all internal links in a file. Returns list of (line_num, link_text, target) tuples."""
    broken = []
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Match [text](target) but skip external URLs
    link_pattern = re.compile(r'\[([^\]]*)\]\(([^)]+)\)')

    for line_num, line in enumerate(lines, 1):
        # Skip lines inside front matter
        for match in link_pattern.finditer(line):
            display = match.group(1)
            target = match.group(2)

            # Skip external links
            if target.startswith(('http://', 'https://', 'mailto:', '#')):
                continue

            # Strip anchor fragments
            target = target.split('#')[0]
            if not target:
                continue

            # URL-decode (e.g. %20 -> space)
            target = unquote(target)

            # Resolve relative to the file's directory
            target_path = (filepath.parent / target).resolve()

            if not target_path.exists():
                rel_source = filepath.relative_to(directory)
                broken.append((rel_source, line_num, display, target))

    return broken


def main():
    if len(sys.argv) != 2:
        print("Usage: python3 check_links.py <directory>")
        sys.exit(1)

    directory = Path(sys.argv[1]).resolve()
    if not directory.exists():
        print(f"Error: Directory {directory} does not exist")
        sys.exit(1)

    md_files = find_all_md_files(directory)
    all_broken = []

    for filepath in sorted(md_files):
        broken = check_file(filepath, directory)
        all_broken.extend(broken)

    if not all_broken:
        print("No broken links found.")
        sys.exit(0)

    # Group by source file
    by_file = {}
    for source, line_num, display, target in all_broken:
        by_file.setdefault(source, []).append((line_num, display, target))

    for source in sorted(by_file):
        print(f"\n{source}:")
        for line_num, display, target in by_file[source]:
            print(f"  line {line_num}: [{display}]({target}) -> NOT FOUND")

    print(f"\nTotal: {len(all_broken)} broken link(s) in {len(by_file)} file(s)")
    sys.exit(1)


if __name__ == '__main__':
    main()
