import { Vector2 } from 'scenerystack/dot';
import { Shape } from 'scenerystack/kite';
import { Node, Path, RichText } from 'scenerystack/scenery';
import { COLORS, bodyFont } from './theme.js';

export type TailSide = 'top' | 'bottom';

export type SpeechBubbleOptions = {
  width: number;
  minHeight?: number;
  // Fraction (0-1) of the bubble's width where the tail is centered.
  // Defaults to the middle, which keeps the tail pointing at a speaker
  // centered above/below the bubble regardless of how wide it grows.
  tailFraction?: number;
  tailSide?: TailSide;
};

/**
 * A rounded speech bubble with a small triangular tail on either the top
 * or bottom edge, pointing toward whichever side the speaker sits on. Text
 * is set via `setText`, wraps to the bubble's width, and the bubble grows
 * taller (never wider) to fit.
 */
export class SpeechBubbleNode extends Node {
  private readonly bubbleWidth: number;

  private readonly minHeight: number;

  private readonly tailFraction: number;

  private readonly tailSide: TailSide;

  private readonly bubblePath: Path;

  private readonly textNode: RichText;

  public constructor(options: SpeechBubbleOptions) {
    super();
    this.bubbleWidth = options.width;
    this.minHeight = options.minHeight ?? 90;
    this.tailFraction = options.tailFraction ?? 0.5;
    this.tailSide = options.tailSide ?? 'bottom';

    this.bubblePath = new Path(null, {
      fill: COLORS.white,
      stroke: COLORS.ink,
      lineWidth: 3,
    });
    this.textNode = new RichText('', {
      font: bodyFont(15),
      fill: COLORS.ink,
      align: 'left',
      lineWrap: this.bubbleWidth - 32,
    });

    this.addChild(this.bubblePath);
    this.addChild(this.textNode);
    this.setText('');
  }

  public setText(text: string): void {
    this.textNode.string = text;
    const tailHeight = 14;
    const topInset = this.tailSide === 'top' ? tailHeight : 0;
    const height = Math.max(this.minHeight, this.textNode.height + 28 + tailHeight);
    this.textNode.leftTop = new Vector2(16, topInset + 14);
    this.bubblePath.shape = this.buildShape(this.bubbleWidth, height);
  }

  private buildShape(width: number, height: number): Shape {
    const r = 20;
    const tailWidth = 22;
    const tailHeight = 14;
    const tailCenter = width * this.tailFraction;
    const tailLeft = Math.max(r + tailWidth / 2, Math.min(width - r - tailWidth / 2, tailCenter))
      - tailWidth / 2;

    // A standard speech-bubble tail: straight sides (so it still reads as
    // an unambiguous pointer), but with the very apex softened by a small
    // rounded corner — the same "step back, curve through the corner"
    // technique used for the bubble's own rounded corners above — so it
    // doesn't end in a needle-sharp point.
    const tailTip = tailLeft + tailWidth / 2;
    const tipRound = 4;
    const sideLength = Math.hypot(tailWidth / 2, tailHeight);
    const inX = (tailWidth / 2 / sideLength) * tipRound;
    const inY = (tailHeight / sideLength) * tipRound;

    if (this.tailSide === 'top') {
      return new Shape()
        .moveTo(r, tailHeight)
        .lineTo(tailLeft, tailHeight)
        .lineTo(tailTip - inX, inY)
        .quadraticCurveTo(tailTip, 0, tailTip + inX, inY)
        .lineTo(tailLeft + tailWidth, tailHeight)
        .lineTo(width - r, tailHeight)
        .quadraticCurveTo(width, tailHeight, width, tailHeight + r)
        .lineTo(width, height - r)
        .quadraticCurveTo(width, height, width - r, height)
        .lineTo(r, height)
        .quadraticCurveTo(0, height, 0, height - r)
        .lineTo(0, tailHeight + r)
        .quadraticCurveTo(0, tailHeight, r, tailHeight)
        .close();
    }

    return new Shape()
      .moveTo(r, 0)
      .lineTo(width - r, 0)
      .quadraticCurveTo(width, 0, width, r)
      .lineTo(width, height - tailHeight - r)
      .quadraticCurveTo(width, height - tailHeight, width - r, height - tailHeight)
      .lineTo(tailLeft + tailWidth, height - tailHeight)
      .lineTo(tailTip + inX, height - inY)
      .quadraticCurveTo(tailTip, height, tailTip - inX, height - inY)
      .lineTo(tailLeft, height - tailHeight)
      .lineTo(r, height - tailHeight)
      .quadraticCurveTo(0, height - tailHeight, 0, height - tailHeight - r)
      .lineTo(0, r)
      .quadraticCurveTo(0, 0, r, 0)
      .close();
  }
}
