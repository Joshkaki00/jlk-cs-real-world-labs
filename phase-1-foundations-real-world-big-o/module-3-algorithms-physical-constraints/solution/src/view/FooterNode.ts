import { Circle, HBox, Node, RichText, Text } from 'scenerystack/scenery';
import type { Stage } from '../model/LessonModel.js';
import { LessonModel } from '../model/LessonModel.js';
import { COLORS, bodyFont } from './theme.js';

const STAGE_NAMES: Record<Stage, string> = {
  0: 'Stage A · Constant factors',
  1: 'Stage B · The real bill',
  2: 'Stage C · Hidden complexity',
  3: 'Lesson complete',
};

function legendDot(color: string, label: string): Node {
  return new HBox({
    spacing: 6,
    children: [
      new Circle(5, { fill: color }),
      new Text(label, { font: bodyFont(12), fill: COLORS.muted }),
    ],
  });
}

/**
 * The lesson's footer: which stage is active, a small color legend, and how
 * many of the three checks have been passed so far.
 */
export class FooterNode extends Node {
  public constructor(model: LessonModel, width: number) {
    super();

    const stageLabel = new RichText('', { font: bodyFont(13), fill: COLORS.ink });
    stageLabel.left = 0;
    stageLabel.centerY = 12;

    const legend = new HBox({
      spacing: 16,
      children: [
        legendDot(COLORS.cyan, 'Reference'),
        legendDot(COLORS.coral, 'Comparison / cost'),
      ],
    });
    legend.centerX = width / 2;
    legend.centerY = 12;

    const checksLabel = new RichText('', { font: bodyFont(13), fill: COLORS.ink });
    checksLabel.right = width;
    checksLabel.centerY = 12;

    this.addChild(stageLabel);
    this.addChild(legend);
    this.addChild(checksLabel);

    const refresh = (): void => {
      const { value: stage } = model.stageProperty;
      stageLabel.string = STAGE_NAMES[stage];
      stageLabel.left = 0;
      checksLabel.string = `${model.checksPassed}/3 checks passed`;
      checksLabel.right = width;
    };

    model.stageProperty.link(refresh);
    model.completedProperty.forEach((property) => property.link(refresh));
    refresh();
  }
}
