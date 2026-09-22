# JLK's CS: The Real World Edition — Labs

Hands-on lab companion to *JLK's CS: The Real World Edition*, a curriculum bridging academic CS theory and real-world software engineering. (The curriculum itself lives in a private repo, so it isn't linked from here.)

This repo is **scaffolding only** — the Phase/Module directory tree exists and mirrors the curriculum 1:1, but individual labs have not been written yet. Each module directory contains a template (`README.md` + empty `starter/` and `solution/` folders) ready to be filled in.

## Design Principles

Every lab in this repo, once written, should follow the same shape (synthesized from CS-education lab-design research — course design guidelines, "codelab" authoring practice, and lab-pedagogy literature):

1. **One real scenario, one golden path.** Open with an authentic task ("Build a service that handles webhook events from our payment provider"), not an isolated feature demo. Pick the one path that solves the main use case and walk the learner down it — a lab is not reference documentation.
2. **A starter, not a blank page.** The learner should never set up a project from scratch before they can begin. `starter/` carries the boilerplate, deps, and config, with clear placeholders for the actual work.
3. **Incremental checkpoints.** Every step has a single goal and a concrete way to confirm it worked (e.g. "the service now responds to a test webhook with a 200"), not just a wall of instructions to execute blindly.
4. **A pre-lab question.** A short question or prediction, answered *before* starting, that forces engagement with the module's concept and surfaces a hypothesis the lab will confirm or contradict — this repo's version of the curriculum's predict-then-reveal `Objective`/`Check` pattern.
5. **A reference solution.** `solution/` holds a senior-engineer version of the same task to compare against once done — not just "does it run," but "how would this actually be written."
6. **Balance guidance with independent problem-solving.** Don't over-specify; leave room for exploration, debugging, and decisions the learner has to make themselves.
7. **Short and maintainable.** Labs drift when the tools they teach change and the lab doesn't. Each lab should be small enough to actually keep current.

## Structure

- `phase-N-slug/` — one directory per curriculum phase, mirroring the curriculum's phase directories exactly (same slugs, same order).
  - `README.md` — Phase heading + module list (mirrors the curriculum phase README).
  - `module-M-slug/` — one directory per module.
    - `README.md` — lab template (Scenario, Pre-Lab Question, Golden Path steps with checkpoints, Reference Solution note). Currently a placeholder; see Design Principles above for what belongs here once written.
    - `starter/` — placeholder for starter code/boilerplate.
    - `solution/` — placeholder for the reference solution.

Not every module maps naturally to a coding lab — some (e.g. workplace conduct, negotiation, communication modules) are better served by scenario/role-play or document-annotation exercises rather than code. The template is written generically enough to cover both; adapt "Golden Path steps" to "Scenario steps" where there's no code involved.

## Curriculum Index

<!-- Regenerate this list if phases/modules are added, renamed, or reordered in the main curriculum repo. -->

- [Phase 1: Foundations & Real-World Big O](phase-1-foundations-real-world-big-o/README.md)
- [Phase 2: Computer Systems, OS & Hardware](phase-2-computer-systems-os-hardware/README.md)
- [Phase 3: Infrastructure, Networking & Data](phase-3-infrastructure-networking-data/README.md)
- [Phase 4: Applied Engineering & The Brownfield Reality](phase-4-applied-engineering-brownfield-reality/README.md)
- [Phase 4.5: Testing, Process & The Sprint Machine](phase-4-5-testing-process-sprint-machine/README.md)
- [Phase 5: Workplace Conduct, Soft Skills & Leadership](phase-5-workplace-conduct-soft-skills-leadership/README.md)
- [Phase 6: The Business Reality & Cross-Functional Communication](phase-6-business-reality-cross-functional-communication/README.md)
- [Phase 7: AI-Assisted Engineering & Production Operations](phase-7-ai-assisted-engineering-production-operations/README.md)
- [Phase 8: Practical Security & Data Integrity](phase-8-practical-security-data-integrity/README.md)
- [Phase 9: Accessibility, Cloud Economics & Green Computing](phase-9-accessibility-cloud-economics-green-computing/README.md)
- [Phase 10: Career Survival & Job Market Realities](phase-10-career-survival-job-market-realities/README.md)
- [Phase 10.5: Know What You Signed](phase-10-5-know-what-you-signed/README.md)
- [Phase 11: System Integration & Market Differentiation](phase-11-system-integration-market-differentiation/README.md)

## Status

Not yet started. Scaffolding only — no lab content has been written. See each module's `README.md` for the template to fill in.
