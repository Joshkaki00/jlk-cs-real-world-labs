import { Vector2 } from 'scenerystack/dot';
import { Shape } from 'scenerystack/kite';
import { Circle, Image, Node } from 'scenerystack/scenery';
import { COLORS } from './theme.js';
import { SpeechBubbleNode } from './SpeechBubbleNode.js';

// Source photo is a tall portrait (447x1024): a speech bubble fills the top
// third, the face/hair sits roughly in the middle, and shoulders fill the
// bottom. We crop tightly around the face so the lesson's own
// SpeechBubbleNode (with real dialogue text) is what the learner reads.
const FACE_CENTER = new Vector2(300, 550);
const FACE_RADIUS = 142;

export type MascotOptions = {
  avatarDiameter?: number;
  // Total width available for the mascot (avatar + speech bubble below it).
  // The bubble is sized to fill this width so longer dialogue wraps into a
  // comfortable paragraph instead of a single narrow, tall column.
  panelWidth?: number;
};

/**
 * The lesson's guide character: the learner's own avatar (instead of a
 * "Byte Buddy" style mascot image), framed in a colored ring, stacked above
 * a full-width speech bubble whose tail points straight up at the avatar —
 * so the tail always points at the speaker, and dialogue gets enough room
 * to wrap without overflowing its card.
 */
export class MascotNode extends Node {
  public readonly bubble: SpeechBubbleNode;

  public constructor(avatarImageSource: HTMLCanvasElement, options: MascotOptions = {}) {
    super();
    const avatarDiameter = options.avatarDiameter ?? 64;
    const panelWidth = options.panelWidth ?? 196;

    const scale = avatarDiameter / (FACE_RADIUS * 2);
    const portrait = new Image(avatarImageSource, {
      clipArea: Shape.circle(FACE_CENTER.x, FACE_CENTER.y, FACE_RADIUS),
    });
    portrait.scale(scale);
    // Shift so the face center lands at the middle of the avatarDiameter x
    // avatarDiameter box, matching where the backdrop/ring circles are centered.
    portrait.translation = new Vector2(
      avatarDiameter / 2 - FACE_CENTER.x * scale,
      avatarDiameter / 2 - FACE_CENTER.y * scale,
    );

    const backdrop = new Circle(avatarDiameter / 2, {
      fill: COLORS.paper,
      x: avatarDiameter / 2,
      y: avatarDiameter / 2,
    });
    const ring = new Circle(avatarDiameter / 2 + 3, {
      stroke: COLORS.cyanDark,
      lineWidth: 4,
      x: avatarDiameter / 2,
      y: avatarDiameter / 2,
    });
    const avatarLayer = new Node({ children: [backdrop, portrait, ring] });
    avatarLayer.centerX = panelWidth / 2;
    avatarLayer.top = 0;

    this.bubble = new SpeechBubbleNode({
      width: panelWidth,
      tailSide: 'top',
      tailFraction: 0.5,
    });
    this.bubble.top = avatarLayer.bottom + 12;
    this.bubble.left = 0;

    this.addChild(avatarLayer);
    this.addChild(this.bubble);
  }

  public say(text: string): void {
    this.bubble.setText(text);
  }
}
