import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7.2.4/dist/pixi.min.mjs';

export class JuliaExplorer {
    constructor(container, app, options = {}, maxIter = 150) {
        this.container = container;
        this.app = app;
        this.width = app.screen.width;
        this.height = app.screen.height;

        this.cRe = options.cRe ?? -0.8;
        this.cIm = options.cIm ?? 0.156;

        this.zoom = 1.0;
        this.maxIter = maxIter;

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d');

        this.texture = null;
        this.sprite = null;

        this.attachControls();
        this.render();
    }


    render() {
        const imageData = this.ctx.createImageData(this.width, this.height);
        const pixels = imageData.data;

        const scale = 3.0 / this.zoom;

        let totalR = 0, totalG = 0, totalB = 0, count = 0;

        for (let py = 0; py < this.height; py++) {
            for (let px = 0; px < this.width; px++) {
                let zx = (px - this.width / 2) * scale / this.width;
                let zy = (py - this.height / 2) * scale / this.width;
                let iter = 0;

                while (zx * zx + zy * zy < 4 && iter < this.maxIter) {
                    const xtemp = zx * zx - zy * zy + this.cRe;
                    zy = 2 * zx * zy + this.cIm;
                    zx = xtemp;
                    iter++;
                }

                const i = (py * this.width + px) * 4;

                const hue = Math.floor(360 * iter / this.maxIter);
                const saturation = 1;
                const value = iter < this.maxIter ? 1 : 0;

                const c = value * saturation;
                const x = c * (1 - Math.abs((hue / 60) % 2 - 1));
                const m = value - c;

                let r1 = 0, g1 = 0, b1 = 0;
                if (hue < 60) [r1, g1, b1] = [c, x, 0];
                else if (hue < 120) [r1, g1, b1] = [x, c, 0];
                else if (hue < 180) [r1, g1, b1] = [0, c, x];
                else if (hue < 240) [r1, g1, b1] = [0, x, c];
                else if (hue < 300) [r1, g1, b1] = [x, 0, c];
                else[r1, g1, b1] = [c, 0, x];

                const R = Math.floor((r1 + m) * 255);
                const G = Math.floor((g1 + m) * 255);
                const B = Math.floor((b1 + m) * 255);

                pixels[i] = R;
                pixels[i + 1] = G;
                pixels[i + 2] = B;
                pixels[i + 3] = 255;

                if (value > 0) {
                    totalR += R;
                    totalG += G;
                    totalB += B;
                    count++;
                }
            }
        }

        this.ctx.putImageData(imageData, 0, 0);
        this.updateTexture();


    }



    updateTexture() {
        if (this.sprite) this.container.removeChild(this.sprite);

        this.sprite = PIXI.Sprite.from(this.canvas);
        this.sprite.x = -this.width / 2 + this.container.x;
        this.sprite.y = -this.height / 2 + this.container.y;

        this.sprite.width = this.width;
        this.sprite.height = this.height;
        this.container.addChild(this.sprite);
    }

    attachControls() {
        this._onWheel = (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            this.zoom *= delta;
            this.render();
            this.render();
        };

        this.app.view.addEventListener('wheel', this._onWheel);
    }

    destroy() {
        this.app.view.removeEventListener('wheel', this._onWheel);

        if (this.sprite) {
            this.container.removeChild(this.sprite);
            this.sprite.destroy();
        }
    }
}
