/* Native scrolling and progressive, one-time section entrances. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.querySelector('.ak2-hero-copy');
  const destination = document.querySelector('.collection-carousel');
  if (hero && destination) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ak-scroll-cue';
    button.innerHTML = 'Scroll to explore <span aria-hidden="true">↓</span>';
    button.addEventListener('click', () => {
      destination.scrollIntoView({behavior: reduced.matches ? 'instant' : 'smooth', block: 'start'});
    });
    hero.append(button);
  }
  if (!('IntersectionObserver' in window) || reduced.matches) return;
  const running = new Set();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (reduced.matches || !entry.target.animate) continue;
      const animation = entry.target.animate([
        {opacity: 0.25, transform: 'translateY(24px)'},
        {opacity: 1, transform: 'translateY(0)'}
      ], {duration: 750, easing: 'cubic-bezier(.22,1,.36,1)'});
      running.add(animation);
      animation.onfinish = () => running.delete(animation);
    }
  }, {threshold: 0, rootMargin: '0px 0px -40px 0px'});
  // Content remains visible if scripting fails; existing card animations are retained.
  document.querySelectorAll('.collection-carousel,.ak2-finale,.ak2-ribbon').forEach(section => observer.observe(section));
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      observer.disconnect();
      running.forEach(animation => animation.cancel());
      running.clear();
    }
  });
})();
