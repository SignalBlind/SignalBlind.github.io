#!/usr/bin/env python3
"""
Generate individual tag pages for Jekyll.
Scans all markdown files for tags in front matter and creates a page for each unique tag.
Usage: python3 generate_tag_pages.py <site_directory>
"""

import os
import sys
from pathlib import Path
import yaml
import re

def parse_front_matter(content):
    """Parse YAML front matter from content."""
    if not content.startswith('---\n'):
        return None

    end_match = re.search(r'\n---\n', content[4:])
    if not end_match:
        return None

    end_pos = end_match.end() + 4
    front_matter_text = content[4:end_pos-4]

    try:
        front_matter = yaml.safe_load(front_matter_text)
        return front_matter if front_matter else {}
    except yaml.YAMLError:
        return None

def collect_all_tags(directory):
    """Collect all unique tags from all markdown files."""
    all_tags = set()

    for filepath in Path(directory).rglob('*.md'):
        # Skip generated tag pages
        if filepath.parent.name == 'tags' and filepath.name != 'index.md':
            continue

        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            front_matter = parse_front_matter(content)
            if front_matter and 'tags' in front_matter:
                tags = front_matter['tags']
                if isinstance(tags, list):
                    all_tags.update(tags)
                elif tags:
                    all_tags.add(tags)
        except Exception as e:
            print(f"Warning: Error reading {filepath}: {e}")
            continue

    return sorted(all_tags)

def generate_tag_page(tag, tags_dir):
    """Generate a single tag page."""
    content = f"""---
layout: tag
title: "Tag: {tag}"
tag: {tag}
permalink: /tags/{tag}/
navigation: false
---
"""

    tag_file = tags_dir / f"{tag}.md"
    with open(tag_file, 'w', encoding='utf-8') as f:
        f.write(content)

    return tag_file

def main():
    if len(sys.argv) != 2:
        print("Usage: python3 generate_tag_pages.py <site_directory>")
        sys.exit(1)

    site_dir = Path(sys.argv[1])
    if not site_dir.exists():
        print(f"Error: Directory {site_dir} does not exist")
        sys.exit(1)

    tags_dir = site_dir / 'tags'
    tags_dir.mkdir(exist_ok=True)

    # Collect all tags
    print("Collecting tags from all pages...")
    all_tags = collect_all_tags(site_dir)

    if not all_tags:
        print("No tags found.")
        return

    print(f"Found {len(all_tags)} unique tags: {', '.join(all_tags)}")

    # Remove old tag pages (except index.md)
    for tag_file in tags_dir.glob('*.md'):
        if tag_file.name != 'index.md':
            tag_file.unlink()
            print(f"Removed old tag page: {tag_file.name}")

    # Generate new tag pages
    print("\nGenerating tag pages...")
    for tag in all_tags:
        tag_file = generate_tag_page(tag, tags_dir)
        print(f"Created: {tag_file.relative_to(site_dir)}")

    print(f"\nTotal: Generated {len(all_tags)} tag pages")

if __name__ == '__main__':
    main()
