(() => {
  const card = document.querySelector('.service-web');
  const cursor = card?.querySelector('.visitor-cursor');
  if (!card || !cursor) return;
  const finePointer = matchMedia('(hover:hover) and (pointer:fine)');
  // Keep the fixed cursor outside reveal/3D transform containers.
  document.body.append(cursor);
  let frame = 0;
  let x = 0;
  let y = 0;
  const place = () => {
    cursor.style.transform = `translate3d(${x}px,${y}px,0)`;
    frame = 0;
  };
  const hide = () => {
    card.classList.remove('has-custom-cursor');
    cursor.classList.remove('is-visible');
  };
  card.addEventListener('pointermove', event => {
    if (!finePointer.matches || event.pointerType === 'touch') return;
    x = event.clientX; y = event.clientY;
    card.classList.add('has-custom-cursor');
    cursor.classList.add('is-visible');
    if (!frame) frame = requestAnimationFrame(place);
  });
  card.addEventListener('pointerleave', hide);
  card.addEventListener('pointercancel', hide);
  window.addEventListener('blur', hide);
  window.addEventListener('resize', hide);
  window.addEventListener('scroll', hide, {passive:true});
  finePointer.addEventListener('change', hide);
})();
