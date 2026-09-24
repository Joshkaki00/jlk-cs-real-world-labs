import { Circle, Line, Node, RichText, Text } from 'scenerystack/scenery';
import type { Stage } from '../model/LessonModel.js';
import { LessonModel } from '../model/LessonModel.js';
import { COLORS, bodyFont, titleFont } from './theme.js';

const STAGE_LABELS = ['A', 'B', 'C'];

/**
 * The lesson's header: a small "O(n)" logo badge, a title, and a 3-node
 * progress tracker whose connecting tracks turn green as each stage is
 * completed — mirroring the reference lesson's header bar.
 */
export class ProgressHeaderNode extends Node {
  public constructor(model: LessonModel, width: number) {
    super();

    const badgeCircle = new Circle(20, { fill: COLORS.indigo });
    const badgeLabel = new Text('O(n)', { font: titleFont(13), fill: COLORS.white });
    badgeLabel.center = badgeCircle.center;
    const badge = new Node({ children: [badgeCircle, badgeLabel] });
    badge.left = 0;
    badge.centerY = 26;

    const title = new RichText(
      'The Real World Cost of Algorithms<br>'
        + `<span style="font-size:12px;font-weight:700;color:${COLORS.muted}">`
        + 'Predict, then reveal, then compare the receipt.</span>',
      { font: bodyFont(16), fill: COLORS.ink, left: badge.right + 12, centerY: badge.centerY },
    );

    const tracker = ProgressHeaderNode.buildTracker(model);
    tracker.right = width;
    tracker.centerY = badge.centerY;

    this.addChild(badge);
    this.addChild(title);
    this.addChild(tracker);
  }

  private static buildTracker(model: LessonModel): Node {
    const tracker = new Node();
    const nodeRadius = 14;
    const spacing = 64;
    const dots: Circle[] = [];
    const tracks: Line[] = [];

    STAGE_LABELS.forEach((label, index) => {
      const dot = new Circle(nodeRadius, {
        fill: COLORS.paper,
        stroke: COLORS.line,
        lineWidth: 3,
        x: index * spacing,
      });
      const dotLabel = new Text(label, {
        font: bodyFont(13),
        fill: COLORS.muted,
        center: dot.center,
      });
      tracker.addChild(dot);
      tracker.addChild(dotLabel);
      dots.push(dot);

      if (index > 0) {
        const track = new Line(
          (index - 1) * spacing + nodeRadius,
          0,
          index * spacing - nodeRadius,
          0,
          { stroke: COLORS.line, lineWidth: 4 },
        );
        tracker.addChild(track);
        tracks.push(track);
      }
    });

    const refresh = (stage: Stage): void => {
      dots.forEach((dotParam, index) => {
        const dot = dotParam;
        const done = model.completedProperty[index]?.value ?? false;
        const active = stage === index;
        let stroke: string = COLORS.line;
        if (done) {
          stroke = COLORS.mint;
        } else if (active) {
          stroke = COLORS.amber;
        }
        dot.fill = done ? COLORS.mint : COLORS.paper;
        dot.stroke = stroke;
        dot.setScaleMagnitude(active && !done ? 1.15 : 1);
      });
      tracks.forEach((trackParam, index) => {
        const track = trackParam;
        const done = model.completedProperty[index]?.value ?? false;
        track.stroke = done ? COLORS.mint : COLORS.line;
      });
    };

    model.stageProperty.link(refresh);
    model.completedProperty.forEach((property) => {
      property.link(() => refresh(model.stageProperty.value));
    });

    return tracker;
  }
}
