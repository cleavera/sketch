import { SketchElement } from './component/sketch';
import { SKETCH_TEMPLATE_ID } from './component/sketch.id';

const templateHTML: string = require('./component/sketch.html'); // tslint:disable-line no-require-imports no-var-requires
const templateStyles: string = require('./component/sketch.scss'); // tslint:disable-line no-require-imports no-var-requires

const template: HTMLTemplateElement = document.createElement('template');

template.id = SKETCH_TEMPLATE_ID;
template.innerHTML = templateHTML + `<style>${templateStyles}</style>`;

window.document.body.appendChild(template);

customElements.define('ac-sketch', SketchElement);
