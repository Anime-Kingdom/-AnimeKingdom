(() => {
  const home = document.querySelector('#home-view');
  const hero = home?.querySelector('.ak2-hero');
  if (!hero || document.querySelector('.ak-character-story')) return;
  const characters = [
    ['GOJO', 'Satoru Gojo', 'Beyond the limits.', 'Jujutsu Kaisen'],
    ['LUFFY', 'Monkey D. Luffy', 'Dream without limits.', 'One Piece'],
    ['TANJIRO', 'Tanjiro Kamado', 'Strength with a heart.', 'Demon Slayer'],
    ['NARUTO', 'Naruto Uzumaki', 'Never give up.', 'Naruto'],
    ['GOKU', 'Son Goku', 'Reach your next level.', 'Dragon Ball']
  ];
  const section = document.createElement('section');
  section.className = 'ak-character-story';
  section.setAttribute('aria-label', 'Anime icons scroll showcase');
  section.innerHTML = `<div class="ak-story-stage"><div class="ak-story-art"><img src="/anime-icons-story.png" alt="Promotional concept artwork of Gojo, Luffy, Tanjiro, Naruto and Goku collectible figures" loading="lazy" decoding="async"></div><div class="ak-story-shade"></div><div class="ak-story-top"><span>ANIME KINGDOM / ICON SERIES</span><a href="#shop" data-view="shop">Explore the store ↗</a></div><div class="ak-story-copy"><small class="ak-story-series"></small><h2></h2><p></p></div><div class="ak-story-bottom"><div class="ak-story-steps">${characters.map((c,i)=>`<button type="button" data-character="${i}" aria-label="Show ${c[1]}"><span>0${i+1}</span>${c[0]}</button>`).join('')}</div><div class="ak-story-track"><i></i></div><small>SCROLL TO DISCOVER ↓ <span>Concept artwork · Browse the catalog for available products</span></small></div></div>`;
  hero.after(section);
  const image = section.querySelector('img');
  const title = section.querySelector('h2');
  const series = section.querySelector('.ak-story-series');
  const caption = section.querySelector('.ak-story-copy p');
  const progress = section.querySelector('.ak-story-track i');
  const buttons = [...section.querySelectorAll('[data-character]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const cue = document.querySelector('.ak-scroll-cue');
  cue?.addEventListener('click', event => {
    event.stopImmediatePropagation();
    section.scrollIntoView({behavior: reduced.matches ? 'instant' : 'smooth', block:'start'});
  }, true);
  let frame = 0, last = -1;
  function show(p) {
    const index = Math.min(4, Math.round(p * 4));
    image.style.transform = `translateX(${-p * (image.offsetWidth - section.clientWidth)}px)`;
    progress.style.transform = `scaleX(${.02 + p * .98})`;
    if (index !== last) {
      last = index;
      series.textContent = characters[index][3];
      title.textContent = characters[index][0];
      caption.textContent = characters[index][2];
      buttons.forEach((button,i) => button.setAttribute('aria-pressed', String(i === index)));
    }
  }
  function update() {
    frame = 0;
    if (home.hidden || reduced.matches) return;
    const rect = section.getBoundingClientRect();
    const distance = section.offsetHeight - section.querySelector('.ak-story-stage').offsetHeight;
    show(Math.max(0, Math.min(1, (90 - rect.top) / Math.max(1, distance))));
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  buttons.forEach((button,i) => button.addEventListener('click', () => {
    if (reduced.matches) { show(i / 4); return; }
    const distance = section.offsetHeight - section.querySelector('.ak-story-stage').offsetHeight;
    scrollTo({top: scrollY + section.getBoundingClientRect().top - 90 + distance * i / 4, behavior: 'smooth'});
  }));
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule);
  reduced.addEventListener('change', () => { show(0); schedule(); });
  show(0); schedule();
})();

