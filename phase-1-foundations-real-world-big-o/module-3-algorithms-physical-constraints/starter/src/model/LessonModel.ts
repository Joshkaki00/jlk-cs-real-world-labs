import { BooleanProperty, NumberProperty, Property, StringProperty } from 'scenerystack/axon';

export type Stage = 0 | 1 | 2 | 3;

export type AnswerB = '' | 'lean' | 'same' | 'service';
export type AnswerC = '' | 'n' | 'nlogn' | 'n2';

export const LEAN_SCAN_SECONDS = 0.8;
export const SERVICE_SCAN_SECONDS = 11.6;
export const SERVICE_SCAN_EXTRA_BILL = 50;

/**
 * The full multi-stage state for the Module 3 lab, mirroring the reference
 * lesson's `LessonState`: a constant-factor demo (Stage A), a predict-then-
 * reveal cost comparison (Stage B), and a hidden-complexity trap (Stage C).
 */
export class LessonModel {
  public readonly stageProperty = new Property<Stage>(0);

  public readonly completedProperty = [
    new BooleanProperty(false),
    new BooleanProperty(false),
    new BooleanProperty(false),
  ] as const;

  // Stage A: dragging this slider shows that a bigger constant factor still
  // grows in a straight line — same Big-O family as N, just steeper.
  public readonly multiplierProperty = new NumberProperty(4);

  public readonly answerAProperty = new StringProperty('');

  // Stage B: which algorithm the learner predicts is more expensive before
  // the runtime meters and dollar bill are revealed.
  public readonly answerBProperty = new Property<AnswerB>('');

  public readonly revealedBProperty = new BooleanProperty(false);

  // Stage C: what growth rate the naive string-concatenation loop hides.
  public readonly answerCProperty = new Property<AnswerC>('');

  public reset(): void {
    this.stageProperty.reset();
    this.completedProperty.forEach((property) => property.reset());
    this.multiplierProperty.reset();
    this.answerAProperty.reset();
    this.answerBProperty.reset();
    this.revealedBProperty.reset();
    this.answerCProperty.reset();
  }

  public get checksPassed(): number {
    return this.completedProperty.filter((property) => property.value).length;
  }

  public advanceTo(stage: Stage): void {
    this.stageProperty.value = stage;
  }
}
