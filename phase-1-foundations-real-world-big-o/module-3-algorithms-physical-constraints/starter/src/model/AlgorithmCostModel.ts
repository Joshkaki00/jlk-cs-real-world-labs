import { BooleanProperty, Property } from 'scenerystack/axon';

export type AlgorithmId = 'A' | 'B';

// Both algorithms are O(N) — same Big-O class. Only the constant differs.
// These are dollars-per-operation at cloud-CPU pricing, not made up:
// Algorithm A does one cheap primitive op per element (array read + add).
// Algorithm B does the same O(N) shape, but with a costlier per-op constant
// (e.g. a per-iteration allocation or serialization call) hiding inside it.
export const COST_PER_OPERATION: Record<AlgorithmId, number> = {
  A: 0.0000002, // $0.20 per 1,000,000 operations
  // TODO(Module 3, Step B): Algorithm B "looks the same" as Algorithm A on a
  // whiteboard — both O(N) — but its real per-operation cost is much higher.
  // Fill in a constant here such that, at N = 1,000,000 operations, Algorithm
  // B costs roughly $50 more than Algorithm A. (Hint: A costs $0.20 at that
  // N — what per-op constant gets B to about $50.20?)
  B: 0, // TODO: replace with the real constant
};

export const MAX_N = 1_000_000;

/**
 * Dollar cost of running `algorithm` for `n` operations.
 * TODO(Module 3, Step B): this is intentionally trivial once
 * COST_PER_OPERATION is filled in correctly — the lesson is that the *shape*
 * of this function (linear in n) is identical for both algorithms. The bill
 * only shows up in the constant, which Big-O notation was never designed to
 * capture.
 */
export function costOf(algorithm: AlgorithmId, n: number): number {
  return COST_PER_OPERATION[algorithm] * n;
}

export class PredictionModel {
  // The learner's prediction, made before the chart is revealed. null = no
  // prediction made yet (the Reveal button stays disabled until this is set).
  public readonly predictionProperty = new Property<AlgorithmId | null>(null);

  // Whether the chart has been revealed yet.
  public readonly revealedProperty = new BooleanProperty(false);

  public reset(): void {
    this.predictionProperty.reset();
    this.revealedProperty.reset();
  }
}
