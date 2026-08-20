#!/usr/bin/env python3
"""Static checks on the workflow JSON files in ./workflows.

Catches the mistakes that only surface as a silent no-op inside n8n: a
connection pointing at a renamed node, a workflow with no trigger, duplicate
node names, a file shipped with active=true.

Usage: scripts/validate-workflows.py [dir]
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

TRIGGER_HINTS = ("trigger", "webhook", "cron", "interval", "formTrigger")


def is_trigger(node: dict) -> bool:
    node_type = node.get("type", "")
    return any(hint.lower() in node_type.lower() for hint in TRIGGER_HINTS)


def check(path: Path) -> list[str]:
    errors: list[str] = []
    try:
        data = json.loads(path.read_text())
    except json.JSONDecodeError as exc:
        return [f"invalid JSON: {exc}"]

    if not isinstance(data, dict):
        return ["top level must be a JSON object"]

    for field in ("name", "nodes", "connections"):
        if field not in data:
            errors.append(f"missing required field '{field}'")
    if errors:
        return errors

    nodes = data["nodes"]
    if not isinstance(nodes, list) or not nodes:
        return ["'nodes' must be a non-empty list"]

    names: list[str] = []
    for index, node in enumerate(nodes):
        label = node.get("name") or f"<node {index}>"
        names.append(node.get("name", ""))
        for field in ("name", "type", "typeVersion", "position"):
            if field not in node:
                errors.append(f"node {label}: missing '{field}'")
        node_type = node.get("type", "")
        if node_type and not (
            node_type.startswith("n8n-nodes-base.")
            or node_type.startswith("@n8n/")
            or node_type.startswith("n8n-nodes-")
        ):
            errors.append(f"node {label}: suspicious node type '{node_type}'")
        position = node.get("position")
        if not (isinstance(position, list) and len(position) == 2):
            errors.append(f"node {label}: 'position' must be [x, y]")

    duplicates = {n for n in names if names.count(n) > 1 and n}
    for dupe in sorted(duplicates):
        errors.append(f"duplicate node name '{dupe}' - connections cannot address it")

    if not any(is_trigger(node) for node in nodes):
        errors.append("no trigger node: this workflow can never start on its own")

    known = {n for n in names if n}
    connections = data["connections"]
    if not isinstance(connections, dict):
        errors.append("'connections' must be an object")
    else:
        for source, outputs in connections.items():
            if source not in known:
                errors.append(f"connection source '{source}' is not a node in this file")
            for branches in (outputs or {}).values():
                for branch in branches or []:
                    for link in branch or []:
                        target = link.get("node")
                        if target not in known:
                            errors.append(
                                f"connection {source} -> '{target}' targets a node that does not exist"
                            )

    if data.get("active"):
        errors.append("active=true: ship workflows inactive so importing cannot fire them")

    disconnected = [
        node["name"]
        for node in nodes
        if node.get("name")
        and not is_trigger(node)
        and not any(
            link.get("node") == node["name"]
            for outputs in connections.values()
            for branches in (outputs or {}).values()
            for branch in branches or []
            for link in branch or []
        )
    ]
    for name in disconnected:
        errors.append(f"node '{name}' has no incoming connection - it will never run")

    return errors


def main() -> int:
    directory = Path(sys.argv[1] if len(sys.argv) > 1 else "workflows")
    files = sorted(directory.glob("*.json"))
    if not files:
        print(f"fail no workflow JSON found in {directory}/")
        return 1

    failed = 0
    for path in files:
        errors = check(path)
        if errors:
            failed += 1
            print(f"fail {path}")
            for error in errors:
                print(f"       - {error}")
        else:
            data = json.loads(path.read_text())
            print(f"  ok {path}  ({len(data['nodes'])} nodes)")

    print()
    print(f"{len(files) - failed}/{len(files)} workflow file(s) valid")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
