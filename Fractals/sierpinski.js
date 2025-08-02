import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7.2.4/dist/pixi.min.mjs';


export function drawSierpinski(container, x, y, size, depth) {
  const height = (Math.sqrt(3) / 2) * size;

  function drawFilledTriangle(g, x, y, size) {
    const h = (Math.sqrt(3) / 2) * size;
    g.beginFill(0x00FF00);
    g.moveTo(x, y);
    g.lineTo(x + size / 2, y + h);
    g.lineTo(x - size / 2, y + h);
    g.lineTo(x, y);
    g.endFill();
  }


  function recursiveDraw(x, y, size, depth) {
    if (depth === 0) {
      const graphics = new PIXI.Graphics();
      drawFilledTriangle(graphics, x, y, size);
      container.addChild(graphics);
    } else {
      const newSize = size / 2;
      const h = (Math.sqrt(3) / 2) * newSize;
      recursiveDraw(x, y, newSize, depth - 1);
      recursiveDraw(x - newSize / 2, y + h, newSize, depth - 1);
      recursiveDraw(x + newSize / 2, y + h, newSize, depth - 1);
    }
  }

  recursiveDraw(x, y, size, depth);
}
