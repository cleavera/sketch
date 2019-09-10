import { SKETCH_TEMPLATE_ID } from './sketch.id';

export class SketchElement extends HTMLElement {
    public canvas: HTMLCanvasElement;
    public button: HTMLButtonElement;
    public ctx: CanvasRenderingContext2D;
    public mousedown: boolean = false;

    public get ratio(): [number, number] {
        return [
            this.canvas.width / Number(window.getComputedStyle(this.canvas).getPropertyValue('width').replace(/\D/g, '')),
            this.canvas.height / Number(window.getComputedStyle(this.canvas).getPropertyValue('height').replace(/\D/g, ''))
        ];
    }

    private _dom: ShadowRoot;
    private _lastXY: [number, number] = [0, 0];

    constructor() {
        super();

        this._dom = this.attachShadow({ mode: 'open' });
        const template: HTMLTemplateElement = document.getElementById(SKETCH_TEMPLATE_ID) as any; // tslint:disable-line no-any

        this._dom.appendChild(document.importNode(template.content, true));

        this.canvas = this._dom.querySelector('canvas') as any; // tslint:disable-line no-any

        const ctx: CanvasRenderingContext2D | null = this.canvas.getContext('2d');
        const button: HTMLButtonElement | null = this._dom.querySelector('button');

        if (!ctx) {
            throw new Error('Cannot get the rendering context');
        }

        if (!button) {
            throw new Error('Cannot find the clear button');
        }

        this.ctx = ctx;
        this.button = button;

        this.canvas.addEventListener('mousedown', (e: MouseEvent) => {
            this.mousedown = true;
            this._lastXY = [e.offsetX * this.ratio[0], e.offsetY * this.ratio[1]];
        });

        window.addEventListener('mouseup', () => {
            this.mousedown = false;
        });

        let timeout: number;

        this.canvas.addEventListener('mousemove', (e: MouseEvent) => {
            if (!this.mousedown) {
                return;
            }

            if (timeout) {
                window.cancelAnimationFrame(timeout);
            }

            timeout = window.requestAnimationFrame(() => {
                this.draw(e.offsetX * this.ratio[0], e.offsetY * this.ratio[1]);
                this._lastXY = [e.offsetX * this.ratio[0], e.offsetY * this.ratio[1]];
            });
        });

        this.button.addEventListener('click', () => {
            this.clear();
        });

        this.load();
    }

    public clear(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    public save(): void {
        localStorage.setItem('ac-sketch-canvas', this.canvas.toDataURL());
    }

    public load(): void {
        const dataURL: string | null = localStorage.getItem('ac-sketch-canvas');

        if (!dataURL) {
            return;
        }

        const img: HTMLImageElement = new Image();
        img.src = dataURL;
        img.onload = (): void => {
            this.ctx.drawImage(img, 0, 0);
        };
    }

    public draw(x: number, y: number): void {
        const ratio: [number, number] = this.ratio;

        this.ctx.beginPath();
        this.ctx.moveTo(this._lastXY[0], this._lastXY[1]);
        this.ctx.lineTo(x, y);
        this.ctx.lineWidth = 2 * Math.max(ratio[0], ratio[1]);
        this.ctx.stroke();
        this.ctx.closePath();

        this.save();
    }
}
