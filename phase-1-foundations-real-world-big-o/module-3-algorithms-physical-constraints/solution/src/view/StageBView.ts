import { Node, Rectangle, RichText, Text, VBox } from 'scenerystack/scenery';
import { RectangularPushButton, RectangularRadioButtonGroup } from 'scenerystack/sun';
import type { AnswerB } from '../model/LessonModel.js';
import { LEAN_SCAN_SECONDS, LessonModel, SERVICE_SCAN_EXTRA_BILL, SERVICE_SCAN_SECONDS } from '../model/LessonModel.js';
import { COLORS, bodyFont, monoFont } from './theme.js';

const METER_WIDTH = 300;
const METER_MAX_SECONDS = SERVICE_SCAN_SECONDS;

function makeChoiceLabel(text: string): Node {
  return new Text(text, { font: bodyFont(13), fill: COLORS.ink });
}

function makeAlgorithmCard(title: string, snippet: string): Node {
  return new VBox({
    spacing: 4,
    align: 'left',
    children: [
      new Text(title, { font: bodyFont(14), fill: COLORS.ink }),
      new RichText(snippet, { font: monoFont(11), fill: COLORS.muted }),
      new Text('O(N)', { font: bodyFont(11), fill: COLORS.cyanDark }),
    ],
  });
}

/**
 * Stage B: two algorithms that are Big-O equal (both O(N)) but wildly
 * different in real-world cost. The learner predicts which one is more
 * expensive, then reveals animated runtime meters and a dollar bill.
 */
export class StageBView extends Node {
  private readonly leanMeterFill: Rectangle;

  private readonly serviceMeterFill: Rectangle;

  private readonly billText: RichText;

  private readonly feedbackText: RichText;

  private readonly revealButton: RectangularPushButton;

  private readonly model: LessonModel;

  public constructor(model: LessonModel) {
    super();
    this.model = model;

    const title = new Text('Two O(N) scans. One quiet bill, one loud one.', {
      font: bodyFont(16),
      fill: COLORS.ink,
    });

    const cards = new RectangularRadioButtonGroup<AnswerB>(
      model.answerBProperty,
      [
        {
          value: 'lean',
          createNode: () => makeAlgorithmCard('⚡ Lean Scan', 'if (row.score &gt; 80) count++;'),
        },
        {
          value: 'same',
          createNode: () => makeChoiceLabel('They cost about the same'),
        },
        {
          value: 'service',
          createNode: () => makeAlgorithmCard('☁️ Service Scan', 'await scoreService(row);'),
        },
      ],
      {
        orientation: 'vertical',
        spacing: 6,
        radioButtonOptions: { baseColor: COLORS.paper, xMargin: 10, yMargin: 6 },
      },
    );

    this.revealButton = new RectangularPushButton({
      content: new Text('Reveal the runtime', { font: bodyFont(13), fill: COLORS.white }),
      baseColor: COLORS.indigo,
      enabled: false,
      listener: () => this.reveal(),
    });

    const leanTrack = new Rectangle(0, 0, METER_WIDTH, 16, {
      fill: COLORS.line,
      cornerRadius: 8,
    });
    this.leanMeterFill = new Rectangle(0, 0, 0, 16, { fill: COLORS.mint, cornerRadius: 8 });
    const serviceTrack = new Rectangle(0, 0, METER_WIDTH, 16, {
      fill: COLORS.line,
      cornerRadius: 8,
    });
    this.serviceMeterFill = new Rectangle(0, 0, 0, 16, { fill: COLORS.coral, cornerRadius: 8 });

    const meters = new VBox({
      spacing: 8,
      align: 'left',
      children: [
        new Text('Lean Scan', { font: bodyFont(12), fill: COLORS.ink }),
        new Node({ children: [leanTrack, this.leanMeterFill] }),
        new Text('Service Scan', { font: bodyFont(12), fill: COLORS.ink }),
        new Node({ children: [serviceTrack, this.serviceMeterFill] }),
      ],
    });

    this.billText = new RichText('', {
      font: bodyFont(14),
      fill: COLORS.ink,
    });

    this.feedbackText = new RichText('', { font: bodyFont(13), fill: COLORS.mint, lineWrap: 460 });

    model.answerBProperty.link((answer) => {
      this.revealButton.enabled = answer !== '' && !model.revealedBProperty.value;
    });

    this.addChild(
      new VBox({
        spacing: 12,
        align: 'left',
        children: [title, cards, this.revealButton, meters, this.billText, this.feedbackText],
      }),
    );
  }

  private reveal(): void {
    if (this.model.revealedBProperty.value) {
      return;
    }
    this.model.revealedBProperty.value = true;
    this.revealButton.enabled = false;
    this.animateMeters(0);
  }

  private animateMeters(frame: number): void {
    const fraction = Math.min(1, frame / 60);
    const leanFraction = (LEAN_SCAN_SECONDS / METER_MAX_SECONDS) * METER_WIDTH;
    const serviceFraction = (SERVICE_SCAN_SECONDS / METER_MAX_SECONDS) * METER_WIDTH;
    this.leanMeterFill.rectWidth = leanFraction * fraction;
    this.serviceMeterFill.rectWidth = serviceFraction * fraction;

    if (fraction < 1) {
      requestAnimationFrame(() => this.animateMeters(frame + 1));
    } else {
      this.showBillAndFeedback();
    }
  }

  private showBillAndFeedback(): void {
    this.billText.string = [
      `Lean Scan: ${LEAN_SCAN_SECONDS}s of compute.`,
      `Service Scan: ${SERVICE_SCAN_SECONDS}s of network + compute.`,
      `<b>Extra bill for Service Scan: $${SERVICE_SCAN_EXTRA_BILL}</b>`,
    ].join('<br>');

    const wasCorrect = this.model.answerBProperty.value === 'service';
    if (wasCorrect) {
      this.feedbackText.fill = COLORS.mint;
      this.feedbackText.string = 'Right — same Big-O, but Service Scan pays for a network call on every row.';
      this.model.completedProperty[1].value = true;
      setTimeout(() => this.model.advanceTo(2), 2400);
    } else {
      this.feedbackText.fill = COLORS.coral;
      this.feedbackText.string = 'Look at the meters again — Big-O said "equal," the invoice disagreed.';
    }
  }
}
