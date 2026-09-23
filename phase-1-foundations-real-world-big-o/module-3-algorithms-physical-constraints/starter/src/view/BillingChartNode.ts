import { Orientation } from 'scenerystack/phet-core';
import { Range, Vector2 } from 'scenerystack/dot';
import { Node, RichText, Text, VBox, HBox } from 'scenerystack/scenery';
import { RectangularPushButton, RectangularRadioButtonGroup } from 'scenerystack/sun';
import {
  AxisLine,
  ChartRectangle,
  ChartTransform,
  LinePlot,
  TickLabelSet,
  TickMarkSet,
} from 'scenerystack/bamboo';
import type { AlgorithmId } from '../model/AlgorithmCostModel.js';
import { MAX_N, PredictionModel, costOf } from '../model/AlgorithmCostModel.js';

const CHART_VIEW_WIDTH = 620;
const CHART_VIEW_HEIGHT = 260;
const REVEAL_STEPS = 60; // how many animation frames the reveal takes

const ALGORITHM_LABELS: Record<AlgorithmId, string> = {
  A: 'Algorithm A',
  B: 'Algorithm B',
};

const ALGORITHM_SNIPPETS: Record<AlgorithmId, string> = {
  A: 'for (let i = 0; i &lt; n; i++) {<br>&nbsp;&nbsp;sum += arr[i];<br>}',
  B: 'for (let i = 0; i &lt; n; i++) {<br>&nbsp;&nbsp;sum += lookup(arr[i]);<br>}',
};

const ALGORITHM_COLORS: Record<AlgorithmId, string> = {
  A: '#4caf50',
  B: '#e57373',
};

function makeAlgorithmCardLabel(algorithm: AlgorithmId): Node {
  return new VBox({
    spacing: 6,
    align: 'left',
    children: [
      new Text(ALGORITHM_LABELS[algorithm], {
        font: 'bold 15px sans-serif',
        fill: '#222',
      }),
      new RichText(ALGORITHM_SNIPPETS[algorithm], {
        font: '12px monospace',
        fill: '#222',
      }),
      new Text('O(N) — same Big-O as the other one', {
        font: 'italic 11px sans-serif',
        fill: '#555',
      }),
    ],
  });
}

/**
 * The full predict-then-reveal interactive for Module 3, Step B: two
 * algorithms that are "equal" under Big-O (both O(N)) but have different
 * real-world costs. The learner predicts which one is more expensive at
 * N = 1,000,000 operations before the chart is revealed.
 */
export class BillingChartNode extends Node {
  private readonly model: PredictionModel;

  private readonly chartTransform: ChartTransform;

  private readonly linePlots: Record<AlgorithmId, LinePlot>;

  private readonly feedbackText: RichText;

  private readonly revealButton: RectangularPushButton;

  private revealFrame = 0;

  private revealAnimationId: number | null = null;

  public constructor(model: PredictionModel) {
    super();
    this.model = model;

    const instructions = new Text(
      'Both functions below are O(N). Predict which one actually costs more to run at scale — then reveal the chart.',
      { font: '15px sans-serif', fill: '#ddd' },
    );

    const cardGroup = new RectangularRadioButtonGroup<AlgorithmId | null>(
      model.predictionProperty,
      (['A', 'B'] as AlgorithmId[]).map((algorithm) => ({
        value: algorithm,
        createNode: () => makeAlgorithmCardLabel(algorithm),
      })),
      {
        orientation: 'horizontal',
        spacing: 16,
        radioButtonOptions: {
          baseColor: '#f5f5f5',
          xMargin: 12,
          yMargin: 10,
        },
      },
    );

    this.chartTransform = new ChartTransform({
      viewWidth: CHART_VIEW_WIDTH,
      viewHeight: CHART_VIEW_HEIGHT,
      modelXRange: new Range(0, MAX_N),
      modelYRange: new Range(0, 60),
    });

    const chartRectangle = new ChartRectangle(this.chartTransform, {
      fill: '#0f0f12',
      stroke: '#555',
    });

    const xAxis = new AxisLine(this.chartTransform, Orientation.HORIZONTAL, { stroke: '#888' });
    const yAxis = new AxisLine(this.chartTransform, Orientation.VERTICAL, { stroke: '#888' });

    const xTickMarks = new TickMarkSet(this.chartTransform, Orientation.HORIZONTAL, 200_000, {
      stroke: '#666',
    });
    const yTickMarks = new TickMarkSet(this.chartTransform, Orientation.VERTICAL, 10, {
      stroke: '#666',
    });
    const xTickLabels = new TickLabelSet(this.chartTransform, Orientation.HORIZONTAL, 200_000, {
      createLabel: (value: number) =>
        new Text(`${(value / 1000).toFixed(0)}k`, { font: '10px sans-serif', fill: '#aaa' }),
    });
    const yTickLabels = new TickLabelSet(this.chartTransform, Orientation.VERTICAL, 10, {
      createLabel: (value: number) => new Text(`$${value}`, { font: '10px sans-serif', fill: '#aaa' }),
    });

    this.linePlots = {
      A: new LinePlot(this.chartTransform, [], { stroke: ALGORITHM_COLORS.A, lineWidth: 3 }),
      B: new LinePlot(this.chartTransform, [], { stroke: ALGORITHM_COLORS.B, lineWidth: 3 }),
    };

    const chartNode = new Node({
      children: [
        chartRectangle,
        xTickMarks,
        yTickMarks,
        xTickLabels,
        yTickLabels,
        xAxis,
        yAxis,
        this.linePlots.A,
        this.linePlots.B,
      ],
    });

    this.feedbackText = new RichText('', {
      font: '14px sans-serif',
      fill: '#ffd54f',
      align: 'center',
    });

    this.revealButton = new RectangularPushButton({
      content: new Text('Reveal', { font: 'bold 14px sans-serif', fill: '#222' }),
      baseColor: '#ffd54f',
      enabled: false,
      listener: () => this.reveal(),
    });

    const resetButton = new RectangularPushButton({
      content: new Text('Reset', { font: '13px sans-serif', fill: '#222' }),
      baseColor: '#cfd8dc',
      listener: () => this.resetInteraction(),
    });

    model.predictionProperty.link((prediction: AlgorithmId | null) => {
      this.revealButton.enabled = prediction !== null && !model.revealedProperty.value;
    });

    const buttonRow = new HBox({ spacing: 12, children: [this.revealButton, resetButton] });

    const legend = new HBox({
      spacing: 24,
      children: (['A', 'B'] as AlgorithmId[]).map(
        (algorithm) =>
          new Text(`— ${ALGORITHM_LABELS[algorithm]}`, {
            font: '12px sans-serif',
            fill: ALGORITHM_COLORS[algorithm],
          }),
      ),
    });

    this.addChild(
      new VBox({
        spacing: 14,
        align: 'left',
        children: [instructions, cardGroup, buttonRow, chartNode, legend, this.feedbackText],
        x: 20,
        y: 20,
      }),
    );
  }

  private reveal(): void {
    if (this.model.revealedProperty.value) {
      return;
    }
    this.model.revealedProperty.value = true;
    this.revealButton.enabled = false;
    this.revealFrame = 0;
    this.animateReveal();
  }

  private animateReveal(): void {
    this.revealFrame += 1;
    const fraction = Math.min(1, this.revealFrame / REVEAL_STEPS);
    const currentN = MAX_N * fraction;
    const steps = 40;

    (['A', 'B'] as AlgorithmId[]).forEach((algorithm) => {
      const dataSet: Vector2[] = [];
      for (let i = 0; i <= steps; i += 1) {
        const n = (currentN * i) / steps;
        dataSet.push(new Vector2(n, costOf(algorithm, n)));
      }
      this.linePlots[algorithm].setDataSet(dataSet);
    });

    if (fraction < 1) {
      this.revealAnimationId = requestAnimationFrame(() => this.animateReveal());
    } else {
      this.showFeedback();
    }
  }

  private showFeedback(): void {
    const costA = costOf('A', MAX_N);
    const costB = costOf('B', MAX_N);
    const moreExpensive: AlgorithmId = costB > costA ? 'B' : 'A';
    const prediction = this.model.predictionProperty.value;
    const wasCorrect = prediction === moreExpensive;
    const difference = Math.abs(costB - costA);

    this.feedbackText.string = [
      `At N = 1,000,000 operations: Algorithm A costs $${costA.toFixed(2)}, Algorithm B costs $${costB.toFixed(2)}.`,
      `That's a difference of $${difference.toFixed(2)} — same Big-O, very different bill.`,
      wasCorrect
        ? "Your prediction was correct."
        : "Your prediction was off — Big-O said they were equal, the invoice disagreed.",
    ].join('<br>');
  }

  private resetInteraction(): void {
    if (this.revealAnimationId !== null) {
      cancelAnimationFrame(this.revealAnimationId);
      this.revealAnimationId = null;
    }
    this.model.reset();
    this.feedbackText.string = '';
    (['A', 'B'] as AlgorithmId[]).forEach((algorithm) => this.linePlots[algorithm].setDataSet([]));
  }
}
