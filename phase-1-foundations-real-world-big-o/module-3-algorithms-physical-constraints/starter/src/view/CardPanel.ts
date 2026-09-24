import { Node, Rectangle } from 'scenerystack/scenery';
import type { NodeOptions } from 'scenerystack/scenery';
import { COLORS } from './theme.js';

export type CardPanelOptions = {
  width: number;
  height: number;
  fill?: string;
  cornerRadius?: number;
  shadowOffset?: number;
} & NodeOptions;

/**
 * A rounded card with a flat, hand-drawn-style drop shadow (an offset ink
 * rectangle behind the card) — the "notebook" look used throughout this
 * lesson, instead of a soft blurred box-shadow.
 */
export class CardPanel extends Node {
  public readonly contentLayer: Node;

  public constructor(providedOptions: CardPanelOptions) {
    const {
      width,
      height,
      fill = COLORS.white,
      cornerRadius = 18,
      shadowOffset = 6,
      ...nodeOptions
    } = providedOptions;

    const shadow = new Rectangle(0, shadowOffset, width, height, {
      cornerRadius,
      fill: COLORS.ink,
      opacity: 0.14,
    });
    const card = new Rectangle(0, 0, width, height, {
      cornerRadius,
      fill,
      stroke: COLORS.ink,
      lineWidth: 3,
    });
    const contentLayer = new Node();

    super({
      children: [shadow, card, contentLayer],
      ...nodeOptions,
    });

    this.contentLayer = contentLayer;
  }
}
