import { Vector2 } from 'scenerystack/dot';
import { Node, RichText, Text, VBox, HBox } from 'scenerystack/scenery';
import { RectangularPushButton } from 'scenerystack/sun';
import { LessonModel } from '../model/LessonModel.js';
import { CardPanel } from './CardPanel.js';
import { COLORS, bodyFont, titleFont } from './theme.js';

const SUMMARY_CELLS: Array<{ title: string; body: string }> = [
  { title: 'Theory', body: 'Big-O describes growth rate, not runtime in seconds.' },
  { title: 'Reality', body: 'Equal Big-O can still mean a very different bill.' },
  { title: 'Code review', body: 'String concatenation in a loop hides O(N&sup2;).' },
  { title: 'Practice', body: 'Predict, measure, then compare against the invoice.' },
];

function summaryCell(title: string, body: string): Node {
  const panel = new CardPanel({ width: 216, height: 84, fill: COLORS.paper, cornerRadius: 10 });
  const content = new VBox({
    spacing: 4,
    align: 'left',
    children: [
      new Text(title, { font: bodyFont(13), fill: COLORS.cyanDark }),
      new RichText(body, { font: bodyFont(11), fill: COLORS.ink, lineWrap: 190 }),
    ],
  });
  content.leftTop = new Vector2(12, 10);
  panel.contentLayer.addChild(content);
  return panel;
}

/**
 * The finish screen: a completion badge, a 4-cell recap grid, and a button
 * to restart the whole lesson from Stage A.
 */
export class FinishView extends Node {
  public constructor(model: LessonModel) {
    super();

    const badge = new Text('🏁', { font: titleFont(40) });
    const heading = new Text('Module 3 complete', { font: titleFont(20), fill: COLORS.ink });
    const subheading = new Text('You predicted, revealed, and compared the receipt three times.', {
      font: bodyFont(13),
      fill: COLORS.muted,
    });

    const row1 = new HBox({
      spacing: 12,
      children: [
        summaryCell(SUMMARY_CELLS[0]?.title ?? '', SUMMARY_CELLS[0]?.body ?? ''),
        summaryCell(SUMMARY_CELLS[1]?.title ?? '', SUMMARY_CELLS[1]?.body ?? ''),
      ],
    });
    const row2 = new HBox({
      spacing: 12,
      children: [
        summaryCell(SUMMARY_CELLS[2]?.title ?? '', SUMMARY_CELLS[2]?.body ?? ''),
        summaryCell(SUMMARY_CELLS[3]?.title ?? '', SUMMARY_CELLS[3]?.body ?? ''),
      ],
    });

    const restartButton = new RectangularPushButton({
      content: new Text('Run the lab again', { font: bodyFont(14), fill: COLORS.white }),
      baseColor: COLORS.indigo,
      listener: () => model.reset(),
    });

    this.addChild(
      new VBox({
        spacing: 14,
        align: 'center',
        children: [badge, heading, subheading, row1, row2, restartButton],
      }),
    );
  }
}
