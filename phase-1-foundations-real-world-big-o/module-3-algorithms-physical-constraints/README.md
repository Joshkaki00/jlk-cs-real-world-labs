# Module 3: Algorithms & Physical Constraints

_Companion lab for "Module 3: Algorithms & Physical Constraints" in the curriculum (private repo, not linked here)._

**Status: written.** This lab covers Step B of curriculum section 3.1 ("The
'Drop the Constants' Lie"): once a learner has the correct mental model that
Big-O deliberately ignores constants, this lab shows why that's a dangerous
assumption to carry unexamined into a job.

## Scenario

Your team is choosing between two implementations of the same feature — a
per-row transform that runs over every record in a nightly batch job. Both
implementations are O(N). A teammate says "it doesn't matter which one we
ship, they're the same Big-O." Your job is to find out whether that's true
once the job runs against a real, million-row table — and to be able to
explain the answer in dollars, not just complexity class, before your team
picks one.

## Pre-Lab Question

Before opening the lab: **Algorithm A** and **Algorithm B** below are both
O(N). Algorithm B does one extra thing per iteration — a lookup call — that
doesn't change its Big-O classification at all.

```
// Algorithm A
for (let i = 0; i < n; i++) {
  sum += arr[i];
}

// Algorithm B
for (let i = 0; i < n; i++) {
  sum += lookup(arr[i]);
}
```

Predict: at 1,000,000 iterations, which one actually costs more to run, and
roughly how much more? Write your answer down before starting — you'll check
it against the lab's reveal.

## Golden Path

1. Open the lab (`starter/`, see below) and read the two algorithm cards.
   Confirm for yourself that both are O(N) — same shape, same growth class.
2. Select your prediction (Algorithm A or Algorithm B) using the radio
   cards. This mirrors the Pre-Lab Question — you're committing to an answer
   before you see the chart.
3. Click **Reveal**. Nothing will happen yet — that's expected. Open
   `src/model/AlgorithmCostModel.ts` and find the `TODO` on
   `COST_PER_OPERATION.B`. Fill in a real per-operation dollar constant such
   that Algorithm B costs about $50 more than Algorithm A at
   N = 1,000,000 operations (Algorithm A is already fixed at $0.20 for that
   N — the hint in the code comment walks you through the arithmetic).
4. Save, reload, select a prediction again, and click **Reveal**. Checkpoint:
   you should see two lines diverge on the chart — Algorithm A staying flat
   near $0, Algorithm B climbing to roughly $50 — and a feedback line below
   the chart stating the exact dollar figures and whether your prediction
   was correct.
5. Compare your implementation against [`solution/`](solution/). The
   difference should be exactly the one constant in
   `AlgorithmCostModel.ts` — everything else (the model/view split, the
   Bamboo chart setup, the predict-then-reveal interaction) is provided as
   the "starter, not blank page" scaffolding.

## Why this is the lesson, not a trick

Both functions really are O(N). Big-O was never designed to capture the
constant — that's correct, standard theory, not a lie to debunk. The lab
isn't showing you that Big-O is wrong; it's showing you what Big-O
deliberately leaves out, and why that gap is exactly where a real invoice
lives. See curriculum section 3.2 ("Hidden Complexity") for the related but
distinct failure mode: an accidentally-quadratic method hiding inside a
utility library, where the *shape* itself is wrong, not just the constant.

## Starter

See [`starter/`](starter/) — a working SceneryStack + TypeScript app (Vite
bundler) with the chart, radio-card prediction UI, and reveal/reset buttons
already wired up. The one thing left for you to fill in is the cost
constant described in the Golden Path above.

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
