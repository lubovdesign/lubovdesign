(() => {
  const canvas = document.querySelector('.sticker-canvas');
  const layer = document.querySelector('.sticker-layer');
  canvas.addEventListener('click', event => {
    const rect = canvas.getBoundingClientRect();
    const x = event.detail === 0 ? rect.width / 2 : event.clientX - rect.left;
    const y = event.detail === 0 ? rect.height / 2 : event.clientY - rect.top;
    const sticker = document.createElement('i');
    sticker.className = 'demo-sticker';
    sticker.style.left = `${x}px`;
    sticker.style.top = `${y}px`;
    layer.append(sticker);
    if (layer.childElementCount > 24) layer.firstElementChild.remove();
    requestAnimationFrame(() => requestAnimationFrame(() => sticker.classList.add('is-visible')));
    setTimeout(() => {
      sticker.classList.remove('is-visible');
      setTimeout(() => sticker.remove(), 260);
    }, 1000);
  });
  const copy = document.querySelector('.copy-code');
  const status = document.querySelector('.copy-status');
  let copyTimer;
  copy.addEventListener('click', async () => {
    clearTimeout(copyTimer);
    const code = document.getElementById(copy.dataset.copy);
    try {
      await navigator.clipboard.writeText(code.textContent);
      copy.textContent = 'Скопировано ✓';
      status.textContent = 'Код скопирован. Вставьте его в блок T123.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(code);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'Код выделен — скопируйте его вручную или скачайте файлом ниже.';
    }
    copyTimer = setTimeout(() => {
      copy.textContent = 'Скопировать код';
      status.textContent = '';
    }, 4500);
  });
  if ('IntersectionObserver' in window) {
    const links = Array.from(document.querySelectorAll('.article-sidebar a'));
    const observer = new IntersectionObserver(entries => {
      const active = entries.find(entry => entry.isIntersecting);
      if (!active) return;
      links.forEach(link => {
        if (link.hash === `#${active.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, {rootMargin: '-15% 0px -65% 0px', threshold: 0});
    document.querySelectorAll('.article-section').forEach(section => observer.observe(section));
  }
})();
