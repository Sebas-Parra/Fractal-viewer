import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7.2.4/dist/pixi.min.mjs';
import { drawSierpinski } from '../Fractals/sierpinski.js';
import { drawKoch } from '../Fractals/koch.js';
import { drawTree } from '../Fractals/fractalTree.js';
import { MandelbrotExplorer } from '../Fractals/mandelbrot.js';
import { JuliaExplorer } from '../Fractals/julia.js';

import { enableZoom } from '../Interactions/zoom.js';
import { enablePan } from '../Interactions/pan.js';

import { showFractalInfo, setupModalClose } from '../Information/modalHandler.js';


let mandelbrotExplorer = null;
let juliaExplorer = null;

const app = new PIXI.Application({
  resizeTo: window,
  backgroundAlpha: 0
});

document.body.appendChild(app.view);

const fractalContainer = new PIXI.Container();
app.stage.addChild(fractalContainer);



const fractalSelect = document.getElementById('fractalSelect');
const depthSlider = document.getElementById('depthSlider');
const saveBtn = document.getElementById('saveBtn');
const rotationSlider = document.getElementById('rotationSlider');
const depthValue = document.getElementById('depthValue');
const rotationValue = document.getElementById('rotationValue');

depthSlider.addEventListener('input', () => {
  depthValue.textContent = depthSlider.value;
  renderFractal();
});

rotationSlider.addEventListener('input', () => {
  rotationValue.textContent = rotationSlider.value;
  fractalContainer.rotation = parseFloat(rotationSlider.value) * (Math.PI / 180);
});


function toggleZoomPan(enable) {
  if (enable) {
    enableZoom(app, fractalContainer);
    enablePan(app, fractalContainer);
  } else {
    fractalContainer.eventMode = 'none';
    fractalContainer.removeAllListeners();
    fractalContainer.scale.set(1);
    fractalContainer.position.set(0, 0);
  }
}

function renderFractal() {
  if (mandelbrotExplorer) {
    mandelbrotExplorer.destroy();
    mandelbrotExplorer = null;
  }
  if (juliaExplorer) {
    juliaExplorer.destroy();
    juliaExplorer = null;
  }
  fractalContainer.removeChildren();

  const type = fractalSelect.value;
  const depth = parseInt(depthSlider.value);
  const mandelbrotIterations = depth * 50;

  if (type === 'mandelbrot' || type === 'julia') {
    fractalContainer.pivot.set(app.screen.width / 2, app.screen.height / 2);
    fractalContainer.position.set(app.screen.width / 2, app.screen.height / 2);
  } else {
    fractalContainer.pivot.set(0, 0);
    fractalContainer.position.set(0, 0);
  }
  fractalContainer.rotation = 0;

  toggleZoomPan(!(type === 'mandelbrot' || type === 'julia'));

  if (type === 'sierpinski') {
    fractalContainer.pivot.set(app.screen.width / 2, app.screen.height / 2);
    fractalContainer.position.set(app.screen.width / 2, app.screen.height / 2);
    drawSierpinski(fractalContainer, app.screen.width / 2, 200, 400, depth);
  }

  if (type === 'koch') {
    fractalContainer.pivot.set(app.screen.width / 2, app.screen.height / 2);
    fractalContainer.position.set(app.screen.width / 2, app.screen.height / 2);
    const size = Math.min(app.screen.width, app.screen.height) * 0.6;
    const centerX = app.screen.width / 2;
    const centerY = app.screen.height / 2 + size * Math.sqrt(3) / 6;
    drawKoch(fractalContainer, centerX - size / 2, centerY, size, depth);
  }

  if (type === 'fractalTree') {
    fractalContainer.pivot.set(app.screen.width / 2, app.screen.height / 2);
    fractalContainer.position.set(app.screen.width / 2, app.screen.height / 2);
    const trunkLength = app.screen.height / 4;
    const startX = app.screen.width / 2;
    const startY = app.screen.height - 20;
    drawTree(fractalContainer, startX, startY, trunkLength, Math.PI / 2, depth);
  }

  if (type === 'mandelbrot') {
    fractalContainer.pivot.set(app.screen.width / 2, app.screen.height / 2);
    fractalContainer.position.set(app.screen.width / 2, app.screen.height / 2);
    app.renderer.background.color = '#0100ea';

    mandelbrotExplorer = new MandelbrotExplorer(fractalContainer, app, mandelbrotIterations);
  } else if (type === 'julia') {
    app.renderer.background.color = 0xff0c04;
    app.renderer.clear();
  } else {
    app.renderer.background.color = 0x000000;
    app.renderer.clear();
  }



  const juliaIterations = depth * 50;

  if (type === 'julia') {
    fractalContainer.pivot.set(app.screen.width / 2, app.screen.height / 2);
    fractalContainer.position.set(app.screen.width / 2, app.screen.height / 2);
    juliaExplorer = new JuliaExplorer(fractalContainer, app, {
      cRe: -0.70176,
      cIm: -0.3842
    }, juliaIterations);
    document.body.style.backgroundColor = '#ff0c04';
  } else {
    document.body.style.backgroundColor = '#000';
  }



  fractalContainer.rotation = 0;
}

depthSlider.addEventListener('input', renderFractal);
fractalSelect.addEventListener('change', renderFractal);

rotationSlider.addEventListener('input', () => {
  const angle = parseFloat(rotationSlider.value);
  fractalContainer.rotation = angle * (Math.PI / 180);
});

window.addEventListener('keydown', (e) => {
  let angle = parseFloat(rotationSlider.value);
  if (e.key === 'ArrowRight') {
    angle = (angle + 5) % 360;
  } else if (e.key === 'ArrowLeft') {
    angle = (angle - 5 + 360) % 360;
  } else {
    return;
  }
  rotationSlider.value = angle;
  rotationValue.textContent = angle; 
  fractalContainer.rotation = angle * (Math.PI / 180);
});



saveBtn.addEventListener('click', () => {
  const extractedCanvas = app.renderer.extract.canvas(app.stage);
  const link = document.createElement('a');
  link.download = 'fractal.png';
  link.href = extractedCanvas.toDataURL('image/png');
  link.click();
});

setupModalClose();

document.getElementById('infoBtn').addEventListener('click', () => {
  const fractalType = document.getElementById('fractalSelect').value;
  showFractalInfo(fractalType);
});

renderFractal();

