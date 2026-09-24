import { Orientation } from 'scenerystack/phet-core';
import { Dimension2, Range, Vector2 } from 'scenerystack/dot';
import { Node, Rectangle, RichText, Text, VBox } from 'scenerystack/scenery';
import { HSlider, RectangularPushButton } from 'scenerystack/sun';
import {
  AxisLine,
  ChartRectangle,
  ChartTransform,
  LinePlot,
  TickMarkSet,
} from 'scenerystack/bamboo';
import { LessonModel } from '../model/LessonModel.js';
import { COLORS, bodyFont, monoFont } from './theme.js';

const CHART_VIEW_WIDTH = 440;
const CHART_VIEW_HEIGHT = 130;
const CHART_N_MAX = 100;
const MIN_ANSWER_LENGTH = 22;

const GROWTH_WORDS = /grow|scale|increase|climb|rise|slope|line|steep/i;
const CONSTANT_WORDS = /constant|factor|multipli|steeper|slope|coefficient|scale factor/i;
const IGNORE_WORDS = /ignore|drop|don't matter|does not matter|big.?o|same (family|shape|order)/i;

/**
 * Stage A: dragging the multiplier slider shows a steeper line, but it is
 * still a *straight* line — same O(N) family as the reference, just with a
 * bigger constant factor. The learner explains why in their own words
 * (checked via a real HTML textarea overlaid on the placeholder rectangle
 * below, since Scenery has no native rich text-entry widget).
 */
export class StageAView extends Node {
  public readonly answerBoxPlaceholder: Rectangle;

  private readonly linePlot: LinePlot;

  private readonly equationText: RichText;

  private readonly feedbackText: RichText;

  private readonly checkButton: RectangularPushButton;

  private readonly model: LessonModel;

  public constructor(model: LessonModel) {
    super();
    this.model = model;

    const title = new Text('Same shape, different steepness', {
      font: bodyFont(16),
      fill: COLORS.ink,
    });

    const chartTransform = new ChartTransform({
      viewWidth: CHART_VIEW_WIDTH,
      viewHeight: CHART_VIEW_HEIGHT,
      modelXRange: new Range(0, CHART_N_MAX),
      modelYRange: new Range(0, CHART_N_MAX * 8),
    });

    const chartRectangle = new ChartRectangle(chartTransform, {
      fill: COLORS.paper,
      stroke: COLORS.line,
    });
    const xAxis = new AxisLine(chartTransform, Orientation.HORIZONTAL, { stroke: COLORS.muted });
    const yAxis = new AxisLine(chartTransform, Orientation.VERTICAL, { stroke: COLORS.muted });
    const xTicks = new TickMarkSet(chartTransform, Orientation.HORIZONTAL, 20, {
      stroke: COLORS.line,
    });
    const yTicks = new TickMarkSet(chartTransform, Orientation.VERTICAL, 100, {
      stroke: COLORS.line,
    });

    const referencePlot = new LinePlot(
      chartTransform,
      Array.from({ length: 21 }, (_unused, i) => {
        const n = (i / 20) * CHART_N_MAX;
        return new Vector2(n, n);
      }),
      { stroke: COLORS.cyan, lineWidth: 3 },
    );
    this.linePlot = new LinePlot(chartTransform, [], { stroke: COLORS.coral, lineWidth: 3 });

    const chartNode = new Node({
      children: [chartRectangle, xTicks, yTicks, xAxis, yAxis, referencePlot, this.linePlot],
    });

    const slider = new HSlider(model.multiplierProperty, new Range(2, 8), {
      trackSize: new Dimension2(220, 4),
      thumbFill: COLORS.indigo,
    });
    const sliderLabel = new Text('Constant multiplier:', { font: bodyFont(13), fill: COLORS.ink });
    this.equationText = new RichText('', { font: monoFont(13), fill: COLORS.indigo });
    const sliderRow = new VBox({
      spacing: 6,
      align: 'left',
      children: [
        new VBox({ spacing: 4, align: 'left', children: [sliderLabel, slider] }),
        this.equationText,
      ],
    });

    const prompt = new RichText(
      'In your own words: why do the cyan line (N) and the coral line'
        + ' (multiplier &times; N) belong to the <b>same</b> Big-O family?',
      { font: bodyFont(13), fill: COLORS.ink, lineWrap: CHART_VIEW_WIDTH },
    );

    this.answerBoxPlaceholder = new Rectangle(0, 0, CHART_VIEW_WIDTH, 64, {
      fill: COLORS.white,
      stroke: COLORS.line,
      lineWidth: 2,
      cornerRadius: 8,
    });

    this.feedbackText = new RichText('', { font: bodyFont(13), fill: COLORS.mint, lineWrap: CHART_VIEW_WIDTH });

    this.checkButton = new RectangularPushButton({
      content: new Text('Check my explanation', { font: bodyFont(13), fill: COLORS.white }),
      baseColor: COLORS.indigo,
      listener: () => this.checkAnswer(),
    });

    this.addChild(
      new VBox({
        spacing: 10,
        align: 'left',
        children: [
          title,
          chartNode,
          sliderRow,
          prompt,
          this.answerBoxPlaceholder,
          this.checkButton,
          this.feedbackText,
        ],
      }),
    );

    model.multiplierProperty.link((multiplier) => this.updateChart(multiplier));
  }

  private updateChart(multiplier: number): void {
    this.equationText.string = `y = ${multiplier}·N  →  still O(N)`;
    this.linePlot.setDataSet(
      Array.from({ length: 21 }, (_unused, i) => {
        const n = (i / 20) * CHART_N_MAX;
        return new Vector2(n, multiplier * n);
      }),
    );
  }

  private checkAnswer(): void {
    const answer = this.model.answerAProperty.value.trim();
    const passesLength = answer.length >= MIN_ANSWER_LENGTH;
    const mentionsGrowth = GROWTH_WORDS.test(answer);
    const mentionsConstant = CONSTANT_WORDS.test(answer) || IGNORE_WORDS.test(answer);

    if (passesLength && mentionsGrowth && mentionsConstant) {
      this.feedbackText.fill = COLORS.mint;
      this.feedbackText.string = 'Exactly — Big-O ignores constant factors, so both lines are O(N).';
      this.model.completedProperty[0].value = true;
      setTimeout(() => this.model.advanceTo(1), 1100);
    } else {
      this.feedbackText.fill = COLORS.coral;
      this.feedbackText.string = 'Try mentioning growth rate <i>and</i> constant factors — a couple more sentences will do it.';
    }
  }
}
