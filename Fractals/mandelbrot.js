import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7.2.4/dist/pixi.min.mjs';

export class MandelbrotExplorer {
constructor(container, app, maxIterations = 100) {
  this.container = container;
  this.app = app;

  this.width = app.screen.width;
  this.height = app.screen.height;

  this.maxIterations = maxIterations;
  this.zoom = 250;
  this.offsetX = this.width / 2;
  this.offsetY = this.height / 2;

  this.graphics = new PIXI.Graphics();
this.graphics.x = -this.width / 2 + this.offsetX;
this.graphics.y = -this.height / 2 + this.offsetY;


  this.container.addChild(this.graphics);

  this.render();
}


render(newMaxIterations) {
  if (newMaxIterations) this.maxIterations = newMaxIterations;
  this.graphics.clear();

  for (let x = 0; x < this.width; x++) {
    for (let y = 0; y < this.height; y++) {
      let zx = 0, zy = 0;
      const cx = (x - this.offsetX) / this.zoom;
      const cy = (y - this.offsetY) / this.zoom;
      let i = 0;

      while (zx * zx + zy * zy < 4 && i < this.maxIterations) {
        const temp = zx * zx - zy * zy + cx;
        zy = 2 * zx * zy + cy;
        zx = temp;
        i++;
      }

      const color = i === this.maxIterations
        ? 0x000000
        : PIXI.utils.rgb2hex([
            i / this.maxIterations,
            i / (this.maxIterations * 1.5),
            0.5 + 0.5 * Math.sin(i),
          ]);

      this.graphics.beginFill(color);
this.graphics.drawRect(x, y, 1, 1); 
      this.graphics.endFill();
    }
  }

  let totalR = 0, totalG = 0, totalB = 0, count = 0;

for (let x = 0; x < this.width; x++) {
  for (let y = 0; y < this.height; y++) {
    
    if (i !== this.maxIterations) {
      const r = i / this.maxIterations;
      const g = i / (this.maxIterations * 1.5);
      const b = 0.5 + 0.5 * Math.sin(i);
      totalR += r;
      totalG += g;
      totalB += b;
      count++;
    }
  }
}

const avgR = Math.floor((totalR / count) * 255);
const avgG = Math.floor((totalG / count) * 255);
const avgB = Math.floor((totalB / count) * 255);

const colorHex = `#${avgR.toString(16).padStart(2, '0')}${avgG.toString(16).padStart(2, '0')}${avgB.toString(16).padStart(2, '0')}`;

document.body.style.backgroundColor = colorHex;

}


  destroy() {
    this.container.removeChild(this.graphics);
    this.graphics.destroy(true);
  }
}
