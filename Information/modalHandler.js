import { FRACTAL_INFO } from './info.js';

export function showFractalInfo(fractalType) {
  const modal = document.getElementById('infoModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalContent = document.getElementById('modalContent');

  const info = FRACTAL_INFO[fractalType];

  if (info) {
    modalTitle.textContent = info.title;
    modalContent.innerHTML = `
      <p><strong>Autor:</strong> ${info.author}</p>
      <p><strong>Año:</strong> ${info.year}</p>
      <p>${info.description}</p>
    `;
    modal.style.display = 'flex';
  }
}

export function setupModalClose() {
  const modal = document.getElementById('infoModal');
  const closeBtn = document.getElementById('modalClose');
  closeBtn.onclick = () => modal.style.display = 'none';
  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = 'none';
  };
}
