(() => {
  const hero = document.querySelector('.journal-hero');
  const selection = document.querySelector('.journal-selection');
  const cursor = document.querySelector('.journal-cursor');
  if (!hero || !selection || !cursor) return;
  const positionCursor = () => {
    const heroBounds = hero.getBoundingClientRect();
    const bounds = selection.getBoundingClientRect();
    cursor.style.setProperty('--cursor-start-x', `${bounds.left - heroBounds.left}px`);
    cursor.style.setProperty('--cursor-start-y', `${bounds.top - heroBounds.top}px`);
    cursor.style.setProperty('--cursor-end-x', `${bounds.right - heroBounds.left}px`);
    cursor.style.setProperty('--cursor-end-y', `${bounds.bottom - heroBounds.top + 4}px`);
    cursor.classList.add('is-positioned');
  };
  positionCursor();
  document.fonts.ready.then(positionCursor);
  new ResizeObserver(positionCursor).observe(hero);
})();
