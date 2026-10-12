(() => {
  const section = document.querySelector('.work-phases');
  if (!section) return;
  const viewport = section.querySelector('.phases-viewport');
  const cards = [...section.querySelectorAll('.phase-card')];
  const prev = section.querySelector('.phase-prev');
  const next = section.querySelector('.phase-next');
  const position = section.querySelector('.phase-position');
  const progress = section.querySelector('.phase-progress i');
  const announcement = section.querySelector('.phase-announcement');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0, direction = 1, timer = null, inView = false, seen = false;
  let manuallyStopped = false, scrollFrame = 0, suppressScroll = false;
  const pitch = () => cards[1].offsetLeft - cards[0].offsetLeft;
  const maxScroll = () => Math.max(0, viewport.scrollWidth - viewport.clientWidth);
  const maxIndex = () => Math.ceil(maxScroll() / pitch());
  const clearTimer = () => { clearTimeout(timer); timer = null; };
  const closeTips = () => section.querySelectorAll('.phase-video-button').forEach(button => {
    button.setAttribute('aria-expanded', 'false');
    document.getElementById(button.getAttribute('aria-describedby')).hidden = true;
  });
  const update = () => {
    const atEnd = viewport.scrollLeft >= maxScroll() - 2;
    prev.disabled = viewport.scrollLeft <= 2;
    next.disabled = atEnd;
    const firstVisible = Math.min(cards.length - 1, Math.round(viewport.scrollLeft / pitch()));
    position.textContent = `${String(firstVisible + 1).padStart(2, '0')} / ${cards.length}`;
    progress.style.width = `${atEnd ? 100 : ((firstVisible + 1) / cards.length) * 100}%`;
  };
  const move = (target, immediate = false) => {
    index = Math.max(0, Math.min(maxIndex(), target));
    closeTips();
    viewport.scrollTo({left:Math.min(index * pitch(), maxScroll()), behavior:immediate || reduceMotion.matches ? 'instant' : 'smooth'});
    if (immediate) update();
  };
  const schedule = () => {
    clearTimer();
    if (!inView || manuallyStopped || reduceMotion.matches || document.hidden || section.querySelector('[aria-expanded="true"]')) return;
    timer = setTimeout(() => {
      if (index >= maxIndex()) direction = -1;
      else if (index <= 0) direction = 1;
      move(index + direction);
      schedule();
    }, 7000);
  };
  const stopByUser = () => { manuallyStopped = true; clearTimer(); };
  const manualMove = delta => {
    stopByUser();
    index = viewport.scrollLeft >= maxScroll() - 2 ? maxIndex() : Math.round(viewport.scrollLeft / pitch());
    move(index + delta);
    announcement.textContent = cards[Math.min(index, cards.length - 1)].querySelector('h3').textContent;
  };
  prev.addEventListener('click', () => manualMove(-1));
  next.addEventListener('click', () => manualMove(1));
  viewport.addEventListener('keydown', event => {
    if (event.target !== viewport) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); manualMove(event.key === 'ArrowRight' ? 1 : -1); }
    if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); stopByUser(); move(event.key === 'Home' ? 0 : maxIndex()); }
  });
  viewport.addEventListener('pointerdown', stopByUser, {passive:true});
  viewport.addEventListener('wheel', event => { if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) stopByUser(); }, {passive:true});
  viewport.addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      update();
      if (manuallyStopped && !suppressScroll) index = viewport.scrollLeft >= maxScroll() - 2 ? maxIndex() : Math.round(viewport.scrollLeft / pitch());
      scrollFrame = 0;
    });
  }, {passive:true});
  new IntersectionObserver(entries => {
    const entry = entries[0];
    inView = entry.isIntersecting && entry.intersectionRatio >= .15;
    if (inView) seen = true;
    if (!entry.isIntersecting && seen && entry.boundingClientRect.bottom <= 0) {
      suppressScroll = true; move(0, true); direction = 1; closeTips();
      requestAnimationFrame(() => { suppressScroll = false; });
    }
    schedule();
  }, {threshold:[0,.15]}).observe(section);
  new ResizeObserver(() => { move(Math.min(index, maxIndex()), true); update(); }).observe(viewport);
  document.addEventListener('visibilitychange', schedule);
  reduceMotion.addEventListener('change', schedule);
  section.querySelectorAll('.phase-video-button').forEach(button => {
    const tip = document.getElementById(button.getAttribute('aria-describedby'));
    const open = () => { closeTips(); tip.hidden = false; button.setAttribute('aria-expanded','true'); clearTimer(); };
    const close = () => { tip.hidden = true; button.setAttribute('aria-expanded','false'); schedule(); };
    button.addEventListener('mouseenter', () => { if (matchMedia('(hover:hover)').matches) open(); });
    button.addEventListener('mouseleave', close);
    button.addEventListener('focus', () => { if (button.matches(':focus-visible')) open(); });
    button.addEventListener('blur', close);
    button.addEventListener('click', () => {
      stopByUser();
      if (matchMedia('(hover:hover)').matches || tip.hidden) open(); else close();
    });
    button.addEventListener('keydown', event => { if (event.key === 'Escape') { close(); event.stopPropagation(); } });
  });
  document.addEventListener('pointerdown', event => { if (!event.target.closest('.phase-video-tip')) closeTips(); });
  // Run illustration timelines only while their card is actually visible.
  const sceneObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('is-animating', entry.isIntersecting && entry.intersectionRatio > .35));
  }, {threshold: [0, .35]});
  cards.forEach(card => sceneObserver.observe(card));
  update();
})();
