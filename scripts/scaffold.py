#!/usr/bin/env python3
"""Scaffold phase-N-slug/module-M-slug/ directories from the main curriculum's
scripts/_manifest.json, so this repo's structure always matches
jlk-cs-real-world's phase/module tree exactly (same slugs, same order).

Scaffolding only: writes placeholder README.md lab templates plus empty
starter/ and solution/ folders. Does not write any actual lab content.

Usage: python3 scripts/scaffold.py [path/to/main/repo/scripts/_manifest.json]
Defaults to ../jlk-cs-real-world/scripts/_manifest.json (sibling checkout).
"""
import json
import os
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_MANIFEST = os.path.join(
    REPO_ROOT, "..", "jlk-cs-real-world", "scripts", "_manifest.json"
)

MODULE_README_TEMPLATE = """# {module_title}

_Companion lab for "{module_title}" in the curriculum (private repo, not linked here)._

> **Status: not yet written.** This is a placeholder. See the repo root
> [README.md](../../README.md#design-principles) for what belongs in each
> section below.

## Scenario

<!-- One real, authentic task framing this lab - not an isolated feature demo. -->

TODO

## Pre-Lab Question

<!-- A short question/prediction the learner answers before starting. -->

TODO

## Golden Path

<!-- One path through the task, broken into steps. Each step: one goal, one
     way to confirm it worked. Adapt to "Scenario steps" if this module is a
     role-play/document-annotation exercise rather than code. -->

1. TODO
2. TODO

## Starter

See [`starter/`](starter/) — currently empty.

## Reference Solution

See [`solution/`](solution/) — currently empty. Compare your work against
this once done, not just to check it runs, but to see how it's actually
written.
"""

PLACEHOLDER = "Placeholder — starter code/reference solution for this lab has not been written yet.\n"


def slugify_module_dir(module_slug: str) -> str:
    return module_slug


def main():
    manifest_path = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_MANIFEST
    with open(manifest_path, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    for phase in manifest:
        phase_dir = os.path.join(REPO_ROOT, phase["phase_slug"])
        os.makedirs(phase_dir, exist_ok=True)

        module_links = "\n".join(
            f"- [{m['title']}]({m['slug']}/README.md)" for m in phase["modules"]
        )
        phase_readme = f"# {phase['phase_title']}\n\n## Modules\n\n{module_links}\n"
        with open(os.path.join(phase_dir, "README.md"), "w", encoding="utf-8") as f:
            f.write(phase_readme)

        for m in phase["modules"]:
            module_dir = os.path.join(phase_dir, slugify_module_dir(m["slug"]))
            starter_dir = os.path.join(module_dir, "starter")
            solution_dir = os.path.join(module_dir, "solution")
            os.makedirs(starter_dir, exist_ok=True)
            os.makedirs(solution_dir, exist_ok=True)

            with open(os.path.join(module_dir, "README.md"), "w", encoding="utf-8") as f:
                f.write(
                    MODULE_README_TEMPLATE.format(
                        module_title=m["title"],
                        phase_slug=phase["phase_slug"],
                        module_slug=m["slug"],
                    )
                )
            with open(os.path.join(starter_dir, "README.md"), "w", encoding="utf-8") as f:
                f.write(PLACEHOLDER)
            with open(os.path.join(solution_dir, "README.md"), "w", encoding="utf-8") as f:
                f.write(PLACEHOLDER)

    n_modules = sum(len(p["modules"]) for p in manifest)
    print(f"Scaffolded {len(manifest)} phases, {n_modules} modules.")


if __name__ == "__main__":
    main()
