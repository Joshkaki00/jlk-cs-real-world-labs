import { Vector2 } from 'scenerystack/dot';
import { Node, Rectangle, RichText, Text, VBox } from 'scenerystack/scenery';
import { RectangularPushButton, RectangularRadioButtonGroup } from 'scenerystack/sun';
import type { AnswerC } from '../model/LessonModel.js';
import { LessonModel } from '../model/LessonModel.js';
import { COLORS, bodyFont, monoFont } from './theme.js';

const CODE_SNIPPET = [
  'let report = "";',
  'for (const item of items) {',
  '  <b><span style="color:#f6b93b">report = report + item;</span></b>',
  '}',
].join('<br>');

const CHOICE_LABELS: Record<Exclude<AnswerC, ''>, string> = {
  n: 'O(N)',
  nlogn: 'O(N log N)',
  n2: 'O(N²)',
};

// Each `+=` on a string copies everything built so far — 1 copy, then 2,
// then 3 ... up to N copies. That triangular sum grows like O(N^2).
const CORRECT_ANSWER: AnswerC = 'n2';

/**
 * Stage C: a loop that looks linear at a glance, but each `+` on a string
 * copies everything accumulated so far — 1 + 2 + ... + N copies, which is
 * the hidden O(N²) trap.
 */
export class StageCView extends Node {
  private readonly feedbackText: RichText;

  private readonly checkButton: RectangularPushButton;

  private readonly model: LessonModel;

  public constructor(model: LessonModel) {
    super();
    this.model = model;

    const title = new Text('This loop looks linear. Is it?', { font: bodyFont(16), fill: COLORS.ink });

    const codeBox = new Rectangle(0, 0, 460, 90, {
      fill: '#1b2430',
      cornerRadius: 8,
    });
    const codeText = new RichText(CODE_SNIPPET, {
      font: monoFont(13),
      fill: '#e8edf2',
      leftTop: new Vector2(14, 12),
    });
    const codeNode = new Node({ children: [codeBox, codeText] });

    const copiesExplainer = new RichText(
      'Each concatenation copies everything built so far: 1 copy, then 2, then 3 &hellip; up to N copies. '
        + 'That triangular sum grows like N&sup2;/2.',
      { font: bodyFont(13), fill: COLORS.muted, lineWrap: 460 },
    );

    const choices = new RectangularRadioButtonGroup<AnswerC>(
      model.answerCProperty,
      (Object.keys(CHOICE_LABELS) as Exclude<AnswerC, ''>[]).map((value) => ({
        value,
        createNode: () => new Text(CHOICE_LABELS[value], { font: bodyFont(14), fill: COLORS.ink }),
      })),
      {
        orientation: 'horizontal',
        spacing: 10,
        radioButtonOptions: { baseColor: COLORS.paper, xMargin: 14, yMargin: 10 },
      },
    );

    this.feedbackText = new RichText('', { font: bodyFont(13), fill: COLORS.mint, lineWrap: 460 });

    this.checkButton = new RectangularPushButton({
      content: new Text('Check my answer', { font: bodyFont(13), fill: COLORS.white }),
      baseColor: COLORS.indigo,
      listener: () => this.checkAnswer(),
    });

    this.addChild(
      new VBox({
        spacing: 12,
        align: 'left',
        children: [title, codeNode, copiesExplainer, choices, this.checkButton, this.feedbackText],
      }),
    );
  }

  private checkAnswer(): void {
    if (this.model.answerCProperty.value === CORRECT_ANSWER) {
      this.feedbackText.fill = COLORS.mint;
      this.feedbackText.string = 'Correct — string concatenation in a loop hides an O(N&sup2;) copy cost.';
      this.model.completedProperty[2].value = true;
      setTimeout(() => this.model.advanceTo(3), 1300);
    } else {
      this.feedbackText.fill = COLORS.coral;
      this.feedbackText.string = 'Count the copies again: 1 + 2 + 3 + &hellip; + N. What does that sum grow like?';
    }
  }
}
