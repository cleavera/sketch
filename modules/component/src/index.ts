import { SketchElement } from './component/sketch';
import { SKETCH_TEMPLATE_ID } from './component/sketch.id';

const templateHTML: string = require('./component/sketch.html');
const templateStyles: string = require('./component/sketch.scss');

const template: HTMLTemplateElement = document.createElement('template');

template.id = SKETCH_TEMPLATE_ID;
template.innerHTML = templateHTML + `<style>${templateStyles}</style>`;

window.document.body.appendChild(template);

customElements.define('ac-sketch', SketchElement);
