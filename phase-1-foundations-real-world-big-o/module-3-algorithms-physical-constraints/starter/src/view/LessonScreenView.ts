import { Node } from 'scenerystack/scenery';
import { LessonModel } from '../model/LessonModel.js';
import { CardPanel } from './CardPanel.js';
import { FinishView } from './FinishView.js';
import { FooterNode } from './FooterNode.js';
import { LAYOUT, WORKSPACE_HEIGHT, WORKSPACE_WIDTH } from './layout.js';
import { MascotNode } from './MascotNode.js';
import { ProgressHeaderNode } from './ProgressHeaderNode.js';
import { StageAView } from './StageAView.js';
import { StageBView } from './StageBView.js';
import { StageCView } from './StageCView.js';

const GUIDE_HEIGHT = 260;
const GUIDE_PANEL_INSET = 12;

function guideText(model: LessonModel): string {
  switch (model.stageProperty.value) {
    case 0:
      return "Drag the slider. The line gets steeper, but it's still straight — "
        + 'same growth family as N, just a bigger constant.';
    case 1:
      return model.revealedBProperty.value
        ? "Same Big-O, different invoice. That's the gap between theory and the bill."
        : 'Both scans are O(N) on paper. Which one do you think actually costs more to run?';
    case 2:
      return 'This loop looks linear. Count what each "+" really does before you answer.';
    default:
      return 'Nice work — you found the gap between Big-O and the real bill three times over.';
  }
}

/**
 * The top-level view: a header with progress tracker, a persistent guide
 * (mascot) panel on the left, a workspace panel on the right that swaps
 * between the three stages, and a footer with stage/status text.
 */
export class LessonScreenView extends Node {
  public readonly answerBoxPlaceholder: Node;

  private readonly mascot: MascotNode;

  private readonly stageNodes: readonly [Node, Node, Node, Node];

  public constructor(model: LessonModel, avatarImageSource: HTMLCanvasElement) {
    super();

    const header = new ProgressHeaderNode(model, LAYOUT.displayWidth - LAYOUT.margin * 2);
    header.left = LAYOUT.margin;
    header.top = 8;

    const guidePanel = new CardPanel({
      width: LAYOUT.guideWidth,
      height: GUIDE_HEIGHT,
      cornerRadius: 14,
    });
    guidePanel.left = LAYOUT.margin;
    guidePanel.top = LAYOUT.headerHeight + LAYOUT.margin;

    this.mascot = new MascotNode(avatarImageSource, {
      avatarDiameter: 64,
      panelWidth: LAYOUT.guideWidth - GUIDE_PANEL_INSET * 2,
    });
    this.mascot.left = GUIDE_PANEL_INSET;
    this.mascot.top = 14;
    guidePanel.contentLayer.addChild(this.mascot);

    const workspacePanel = new CardPanel({
      width: WORKSPACE_WIDTH,
      height: WORKSPACE_HEIGHT,
      cornerRadius: 14,
    });
    workspacePanel.left = guidePanel.right + LAYOUT.gap;
    workspacePanel.top = guidePanel.top;

    const stageA = new StageAView(model);
    const stageB = new StageBView(model);
    const stageC = new StageCView(model);
    const finish = new FinishView(model);
    this.stageNodes = [stageA, stageB, stageC, finish] as const;
    this.stageNodes.forEach((nodeParam) => {
      const node = nodeParam;
      node.left = 16;
      node.top = 12;
      workspacePanel.contentLayer.addChild(node);
    });

    const footer = new FooterNode(model, LAYOUT.displayWidth - LAYOUT.margin * 2);
    footer.left = LAYOUT.margin;
    footer.top = LAYOUT.displayHeight - LAYOUT.footerHeight;

    this.addChild(header);
    this.addChild(guidePanel);
    this.addChild(workspacePanel);
    this.addChild(footer);

    this.answerBoxPlaceholder = stageA.answerBoxPlaceholder;

    const refreshStageVisibility = (): void => {
      const { value: stage } = model.stageProperty;
      this.stageNodes.forEach((nodeParam, index) => {
        const node = nodeParam;
        node.visible = index === stage;
      });
      this.mascot.say(guideText(model));
    };

    model.stageProperty.link(refreshStageVisibility);
    model.revealedBProperty.link(refreshStageVisibility);
    refreshStageVisibility();
  }
}
