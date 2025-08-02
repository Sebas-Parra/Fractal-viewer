export function enableZoom(app, container) {
  app.view.addEventListener('wheel', (e) => {
    e.preventDefault();

    const zoomSpeed = 0.1;
    const scale = container.scale.x;
    const delta = e.deltaY > 0 ? -zoomSpeed : zoomSpeed;
    const newScale = Math.max(1, scale + delta);

    const rect = app.view.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const worldPos = {
      x: (mouseX - container.x) / scale,
      y: (mouseY - container.y) / scale,
    };

    container.scale.set(newScale);

    container.x = mouseX - worldPos.x * newScale;
    container.y = mouseY - worldPos.y * newScale;
  });
}
