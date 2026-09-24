import { Display, Node } from 'scenerystack/scenery';
import { LessonModel } from './model/LessonModel.js';
import guideAvatarUrl from './assets/guide-avatar.jpg';
import { loadChromaKeyedImage } from './view/avatarProcessing.js';
import { LAYOUT } from './view/layout.js';
import { LessonScreenView } from './view/LessonScreenView.js';

const MIN_ANSWER_LENGTH = 22;

function createAnswerTextarea(container: HTMLDivElement): HTMLTextAreaElement {
  const textarea = document.createElement('textarea');
  textarea.placeholder = `Write at least ${MIN_ANSWER_LENGTH} characters...`;
  textarea.style.position = 'absolute';
  textarea.style.boxSizing = 'border-box';
  textarea.style.resize = 'none';
  textarea.style.border = 'none';
  textarea.style.outline = 'none';
  textarea.style.background = 'transparent';
  textarea.style.font = '600 13px Nunito, system-ui, sans-serif';
  textarea.style.color = '#17324d';
  textarea.style.padding = '8px 10px';
  container.appendChild(textarea);
  return textarea;
}

async function main(): Promise<void> {
  const container = document.querySelector<HTMLDivElement>('#app');
  if (container === null) {
    throw new Error('Missing #app container element');
  }
  container.style.position = 'relative';

  const avatarCanvas = await loadChromaKeyedImage(guideAvatarUrl);

  const model = new LessonModel();
  const screenView = new LessonScreenView(model, avatarCanvas);
  const rootNode = new Node({ children: [screenView] });

  const display = new Display(rootNode, {
    width: LAYOUT.displayWidth,
    height: LAYOUT.displayHeight,
    backgroundColor: '#f7f4e9',
    container,
  });
  display.initializeEvents();
  display.updateOnRequestAnimationFrame();

  const textarea = createAnswerTextarea(container);
  textarea.addEventListener('input', () => {
    model.answerAProperty.value = textarea.value;
  });
  model.stageProperty.link((stage) => {
    if (stage !== 0) {
      textarea.value = '';
    }
  });

  const syncTextareaBounds = (): void => {
    const visible = model.stageProperty.value === 0;
    textarea.style.display = visible ? 'block' : 'none';
    if (!visible) {
      return;
    }
    const bounds = screenView.answerBoxPlaceholder.getGlobalBounds();
    textarea.style.left = `${bounds.minX}px`;
    textarea.style.top = `${bounds.minY}px`;
    textarea.style.width = `${bounds.width}px`;
    textarea.style.height = `${bounds.height}px`;
    requestAnimationFrame(syncTextareaBounds);
  };
  requestAnimationFrame(syncTextareaBounds);
  model.stageProperty.link(() => requestAnimationFrame(syncTextareaBounds));
}

main().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error(error);
});
