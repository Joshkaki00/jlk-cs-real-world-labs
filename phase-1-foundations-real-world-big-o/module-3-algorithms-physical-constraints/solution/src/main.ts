import { Display, Node } from 'scenerystack/scenery';
import { PredictionModel } from './model/AlgorithmCostModel.js';
import { BillingChartNode } from './view/BillingChartNode.js';

const container = document.querySelector<HTMLDivElement>('#app');
if (container === null) {
  throw new Error('Missing #app container element');
}

const model = new PredictionModel();
const rootNode = new Node({ children: [new BillingChartNode(model)] });

const display = new Display(rootNode, {
  width: 760,
  height: 560,
  container,
});

display.initializeEvents();
display.updateOnRequestAnimationFrame();
