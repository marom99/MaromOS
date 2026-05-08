#!/usr/bin/env python3
"""Small parser-safety check for docs/solutions frontmatter."""

from __future__ import annotations

import re
import sys
from pathlib import Path


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: validate-frontmatter.py <markdown-file>", file=sys.stderr)
        return 1

    path = Path(sys.argv[1])
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()

    if len(lines) < 3 or lines[0] != "---":
        print(f"{path}: missing opening frontmatter delimiter", file=sys.stderr)
        return 1

    try:
        end = lines[1:].index("---") + 1
    except ValueError:
        print(f"{path}: missing closing frontmatter delimiter", file=sys.stderr)
        return 1

    errors: list[str] = []
    for index, line in enumerate(lines[1:end], start=2):
        stripped = line.strip()
        if not stripped or stripped.startswith("- ") or stripped.startswith("#"):
            continue

        match = re.match(r"^([A-Za-z0-9_-]+):\s*(.*)$", stripped)
        if not match:
            continue

        key, value = match.groups()
        if not value or value[0] in "\"'[{":
            continue

        if " #" in value:
            errors.append(f"line {index}: quote {key} because value contains ' #'")
        if ": " in value:
            errors.append(f"line {index}: quote {key} because value contains ': '")

    if errors:
        print(f"{path}: unsafe frontmatter", file=sys.stderr)
        for error in errors:
            print(f"  {error}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
