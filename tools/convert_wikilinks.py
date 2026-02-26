#!/usr/bin/env python3
"""
Convert Obsidian wikilinks to standard markdown links.
Usage: python3 convert_wikilinks.py <directory>
"""

import os
import re
import sys
from pathlib import Path

def convert_wikilink(match):
    """Convert a single wikilink to markdown format."""
    content = match.group(1)

    # Handle aliased links: [[Page|Alias]] or [[Page|display text]]
    if '|' in content:
        target, display = content.split('|', 1)
    else:
        target = content
        display = content

    # Convert to filename (add .md if not present)
    if not target.endswith('.md'):
        target = target + '.md'

    # URL encode spaces
    target_url = target.replace(' ', '%20')

    return f'[{display}]({target_url})'

def convert_file(filepath):
    """Convert all wikilinks in a file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Count matches before conversion
    matches = re.findall(r'\[\[(.+?)\]\]', content)
    if not matches:
        return 0

    # Convert wikilinks to markdown links
    new_content = re.sub(r'\[\[(.+?)\]\]', convert_wikilink, content)

    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    return len(matches)

def main():
    if len(sys.argv) != 2:
        print("Usage: python3 convert_wikilinks.py <directory>")
        sys.exit(1)

    directory = Path(sys.argv[1])
    if not directory.exists():
        print(f"Error: Directory {directory} does not exist")
        sys.exit(1)

    total_converted = 0
    files_modified = 0

    # Process all .md files recursively
    for filepath in directory.rglob('*.md'):
        count = convert_file(filepath)
        if count > 0:
            print(f"Converted {count} links in {filepath.relative_to(directory)}")
            total_converted += count
            files_modified += 1

    print(f"\nTotal: Converted {total_converted} wikilinks in {files_modified} files")

if __name__ == '__main__':
    main()
