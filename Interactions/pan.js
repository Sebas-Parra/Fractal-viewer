export function enablePan(app, container) {
  let dragging = false;
  let lastPosition = { x: 0, y: 0 };

  app.view.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastPosition = { x: e.clientX, y: e.clientY };
  });

  app.view.addEventListener('pointermove', (e) => {
    if (!dragging) return;

    const dx = e.clientX - lastPosition.x;
    const dy = e.clientY - lastPosition.y;

    const newX = container.position.x + dx;
    const newY = container.position.y + dy;

    const minX = app.screen.width * -0.25;
    const maxX = app.screen.width * 1.25;
    const minY = app.screen.height * -0.25;
    const maxY = app.screen.height;

    container.position.x = Math.max(minX, Math.min(maxX, newX));
    container.position.y = Math.max(minY, Math.min(maxY, newY));

    lastPosition = { x: e.clientX, y: e.clientY };
  });

  app.view.addEventListener('pointerup', () => {
    dragging = false;
  });

  app.view.addEventListener('pointerleave', () => {
    dragging = false;
  });
}
