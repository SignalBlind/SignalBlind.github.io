#!/usr/bin/env python3
"""
Extract inline #hashtags from markdown content and add them to front matter.
Usage: python3 extract_tags.py <directory>
"""

import os
import re
import sys
from pathlib import Path
import yaml

def extract_hashtags(content):
    """Extract all #hashtags from markdown content (not in code blocks)."""
    # Remove code blocks first to avoid matching hashtags in code
    content_no_code = re.sub(r'```.*?```', '', content, flags=re.DOTALL)
    content_no_code = re.sub(r'`.*?`', '', content_no_code)

    # Find all hashtags (word boundaries before and after)
    # Match #word but not ##heading or #123
    hashtags = re.findall(r'(?:^|[\s])#([a-zA-Z][a-zA-Z0-9_-]*)', content_no_code)

    # Remove duplicates and sort
    return sorted(set(hashtags))

def parse_front_matter(content):
    """Parse YAML front matter from content."""
    # Check if content starts with ---
    if not content.startswith('---\n'):
        return None, content

    # Find the closing ---
    end_match = re.search(r'\n---\n', content[4:])
    if not end_match:
        return None, content

    end_pos = end_match.end() + 4
    front_matter_text = content[4:end_pos-4]
    body = content[end_pos:]

    try:
        front_matter = yaml.safe_load(front_matter_text)
        if front_matter is None:
            front_matter = {}
    except yaml.YAMLError:
        return None, content

    return front_matter, body

def serialize_front_matter(front_matter):
    """Convert front matter dict back to YAML string."""
    if not front_matter:
        return ""

    # Use block style for lists
    yaml_str = yaml.dump(front_matter, default_flow_style=False, allow_unicode=True, sort_keys=False)
    return f"---\n{yaml_str}---\n"

def process_file(filepath, dry_run=False):
    """Extract hashtags and add to front matter."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Parse existing front matter
    front_matter, body = parse_front_matter(content)

    # Extract hashtags from body
    hashtags = extract_hashtags(body)

    if not hashtags:
        return 0, []

    # Create front matter if it doesn't exist
    if front_matter is None:
        front_matter = {}

    # Get existing tags
    existing_tags = front_matter.get('tags', [])
    if not isinstance(existing_tags, list):
        existing_tags = [existing_tags] if existing_tags else []

    # Merge with extracted hashtags (avoid duplicates)
    existing_tags_lower = [t.lower() for t in existing_tags]
    new_tags = [tag for tag in hashtags if tag.lower() not in existing_tags_lower]

    if not new_tags:
        return 0, []

    # Add new tags
    all_tags = existing_tags + new_tags
    front_matter['tags'] = all_tags

    # Reconstruct file
    new_content = serialize_front_matter(front_matter) + body

    if not dry_run:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

    return len(new_tags), new_tags

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 extract_tags.py <directory> [--dry-run]")
        sys.exit(1)

    directory = Path(sys.argv[1])
    dry_run = '--dry-run' in sys.argv

    if not directory.exists():
        print(f"Error: Directory {directory} does not exist")
        sys.exit(1)

    if dry_run:
        print("DRY RUN MODE - no files will be modified\n")

    total_tags = 0
    files_modified = 0
    all_tags_found = set()

    # Process all .md files recursively
    for filepath in sorted(directory.rglob('*.md')):
        count, tags = process_file(filepath, dry_run)
        if count > 0:
            rel_path = filepath.relative_to(directory)
            print(f"{'[DRY RUN] ' if dry_run else ''}Added {count} tags to {rel_path}: {', '.join(tags)}")
            total_tags += count
            files_modified += 1
            all_tags_found.update(tags)

    print(f"\n{'[DRY RUN] ' if dry_run else ''}Total: Added {total_tags} tags to {files_modified} files")
    print(f"\nUnique tags found: {', '.join(sorted(all_tags_found))}")

if __name__ == '__main__':
    main()
