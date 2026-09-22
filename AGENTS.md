# Repo Instructions

Hands-on lab companion to the `jlk-cs-real-world` curriculum (a separate, private repo — not linked from here since this repo is public). Read this before editing.

## Structure

- `README.md` — repo homepage: purpose, Design Principles (the shape every lab must follow), and the Phase/Module index.
- `phase-N-slug/` — mirrors the main curriculum's phase directories exactly: same slugs, same order. Sourced from that repo's `scripts/_manifest.json`, not hand-maintained separately.
  - `README.md` — Phase heading + module list.
  - `module-M-slug/` — one per module.
    - `README.md` — the lab itself (Scenario, Pre-Lab Question, Golden Path, links to `starter/`/`solution/`). Currently a placeholder template; see root `README.md`'s Design Principles for what belongs in each section.
    - `starter/` — boilerplate/config the learner starts from. Currently empty.
    - `solution/` — reference solution to compare against. Currently empty.
- `scripts/scaffold.py` — regenerates the `phase-N-slug/module-M-slug/` tree from the main repo's manifest. Re-run this (don't hand-create directories) if the main curriculum adds, renames, or reorders phases/modules. **Warning: it overwrites every `README.md` it generates** (phase READMEs and module lab READMEs), so don't re-run it after a module's lab content has actually been written, or you'll wipe that work back to the placeholder template. If the curriculum changes after labs exist, add new phases/modules by hand instead of re-running wholesale.

## Editing labs

- Writing an actual lab means replacing a module's placeholder `README.md` (Scenario/Pre-Lab Question/Golden Path, no more `TODO`s) and populating `starter/` and `solution/` with real files — see root `README.md`'s Design Principles first.
- Not every module maps to a coding lab. Workplace-conduct / communication / negotiation modules are usually better served by a scenario or document-annotation exercise than by code — adapt the template's language ("Golden Path" → "Scenario steps") rather than forcing code where it doesn't fit.
- Keep a lab's Scenario tied to the *real* task framing from research on codelab authoring: one authentic problem, one golden path through it, not a tour of every option.
- This repo doesn't duplicate the curriculum's own module content (`.md` files in the main repo) — each lab's `README.md` links back to the matching module there instead of restating it.

## Status

Scaffolding phase. No lab content has been written yet — every module directory is still the placeholder template from `scripts/scaffold.py`. Don't describe any lab here as "done" or "ready" until its `README.md`, `starter/`, and `solution/` have real content, not `TODO`s.

## Git workflow

No remote yet. Once one exists, follow the same conventions as the main curriculum repo (`jlk-cs-real-world/AGENTS.md`): branch from `main`, one ticket/branch/PR, small commits, review before merging.
