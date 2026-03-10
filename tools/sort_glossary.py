#!/usr/bin/env python3
"""
Sort glossary entries alphabetically by term (case-insensitive).
Usage: python3 sort_glossary.py [path/to/glossary.yml]

Defaults to _data/glossary.yml relative to the script's parent directory.
"""

import sys
from pathlib import Path

import yaml


def sort_glossary(filepath):
    with open(filepath, 'r') as f:
        entries = yaml.safe_load(f)

    if not isinstance(entries, list):
        print(f"Error: Expected a list of glossary entries in {filepath}", file=sys.stderr)
        sys.exit(1)

    sorted_entries = sorted(entries, key=lambda e: e.get('term', '').lower())

    with open(filepath, 'w') as f:
        for i, entry in enumerate(sorted_entries):
            if i > 0:
                f.write('\n')
            yaml.dump([entry], f, default_flow_style=False, allow_unicode=True, sort_keys=False)

    print(f"Sorted {len(sorted_entries)} glossary entries in {filepath}")


if __name__ == '__main__':
    if len(sys.argv) > 1:
        path = Path(sys.argv[1])
    else:
        path = Path(__file__).resolve().parent.parent / '_data' / 'glossary.yml'

    if not path.exists():
        print(f"Error: {path} not found", file=sys.stderr)
        sys.exit(1)

    sort_glossary(path)
