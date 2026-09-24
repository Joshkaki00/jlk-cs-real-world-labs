# Module 3: Algorithms & Physical Constraints

_Companion lab for "Module 3: Algorithms & Physical Constraints" in the curriculum (private repo, not linked here)._

**Status: written.** This lab covers the full arc of curriculum section
3.1 ("The 'Drop the Constants' Lie") plus 3.2 ("Hidden Complexity") as one
three-stage, predict-then-reveal experience: constants don't change Big-O
(Stage A), equal Big-O can still mean a very different bill (Stage B), and a
loop that looks linear can hide a quadratic cost (Stage C).

A guide character — using the lab author's own avatar in place of a generic
mascot — narrates each stage in a speech bubble, mirroring the predict/reveal
pattern used throughout the curriculum.

## Scenario

You're pairing with a guide through three back-to-back checks on the same
underlying idea: **Big-O describes shape, not cost.**

- **Stage A — Constant factors.** Drag a slider that multiplies N by a
  bigger and bigger constant. The line gets steeper, but it never stops
  being a straight line. You explain, in your own words, why that's still
  O(N).
- **Stage B — The real bill.** Two O(N) scans — a "Lean Scan" that does a
  simple comparison per row, and a "Service Scan" that calls out to a
  network service per row. Predict which one costs more to run at scale,
  then reveal animated runtime meters and the actual extra bill.
- **Stage C — Hidden complexity.** A loop that builds a report by
  concatenating a string on every iteration looks linear at a glance. You
  count what each `+` really costs and pick the loop's true growth rate.

## Pre-Lab Question

Before opening the lab, look at this loop:

```js
let report = "";
for (const item of items) {
  report = report + item;
}
```

It has one loop, so it looks like O(N). Write down your own guess for its
real growth rate, and *why*, before you open Stage C and check it.

## Golden Path

1. Open the lab (`starter/`, see below). Stage A loads first.
2. **Stage A:** drag the "Constant multiplier" slider and watch the coral
   line get steeper without ever curving. Write a sentence or two in the
   answer box explaining why both lines are still O(N), then click **Check
   my explanation**. (Mentioning growth rate *and* constant factors is what
   the checker looks for.)
3. **Stage B:** read the "Lean Scan" and "Service Scan" cards — both are
   O(N). Predict which one actually costs more, then click **Reveal the
   runtime**. Checkpoint: two meters animate to very different lengths, and
   a `$50` extra bill appears for the Service Scan. If your prediction was
   "Service Scan," the lesson advances automatically; otherwise, try again.
4. **Stage C:** look at the highlighted `report = report + item;` line.
   Each `+` copies everything built so far — 1 copy, then 2, then 3, up to N
   copies. Pick the growth rate that triangular sum implies, then click
   **Check my answer**. Open `src/view/StageCView.ts` and find the `TODO`
   on the `CORRECT_ANSWER` constant — it's deliberately set wrong in the
   starter. Fix it to the choice you just reasoned your way to.
5. Save, reload, and re-run Stage C. Checkpoint: picking O(N²) now advances
   to the finish screen, with all three progress-tracker checks green.
6. Compare your fix against [`solution/`](solution/). The difference should
   be exactly the one constant in `StageCView.ts` — everything else (the
   model/view split, the Bamboo chart, the guide character, the
   predict-then-reveal mechanics for all three stages) is provided as the
   "starter, not blank page" scaffolding.

## Why this is the lesson, not a trick

Every function in this lab really is what it claims to be under Big-O: the
two lines in Stage A are both O(N), the two scans in Stage B are both O(N),
and the loop in Stage C is the one place where the *shape itself* is wrong —
a naive reading says O(N), but the string-copying cost hiding inside `+`
makes it O(N²). The lab isn't showing you that Big-O is wrong; it's showing
you two different ways the gap between "correct asymptotic class" and "what
you'll actually pay for" opens up: a dropped constant (still O(N), just a
different bill) and an accidentally-quadratic method hiding inside ordinary
code (not O(N) at all, once you count correctly).

## Starter

See [`starter/`](starter/) — a working SceneryStack + TypeScript app (Vite
bundler) with all three stages, the guide character, the Bamboo chart, and
the predict-then-reveal mechanics already wired up. The one thing left for
you to fill in is the `CORRECT_ANSWER` constant described in the Golden Path
above.

Run it locally:

```bash
cd starter
npm install
npm run dev
```

## Reference Solution

See [`solution/`](solution/) — same app, with the constant filled in. Run
it the same way (`npm install && npm run dev`) to compare your version
against a working implementation, not just to check whether the lines draw.
