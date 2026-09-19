/* Dimensional storefront motion, shared by the HTML and Vite editions. */
(function kingdomMotion(){
  if(typeof matchMedia!=='function'||typeof IntersectionObserver!=='function')return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const hero=document.querySelector('.hero-section');
  if(hero){
    const scene=document.createElement('div');scene.className='kingdom-orbit';scene.setAttribute('aria-hidden','true');
    scene.innerHTML='<div class="orbit-halo"></div><div class="orbit-ring ring-one"></div><div class="orbit-ring ring-two"></div><div class="orbit-ring ring-three"></div><div class="orbit-pedestal"></div><img class="orbit-figure" src="'+ASSETS.gojo+'" alt=""><span class="orbit-spark spark-one"></span><span class="orbit-spark spark-two"></span><span class="orbit-spark spark-three"></span>';
    hero.appendChild(scene);
    scene.style.setProperty('--reference-art','url('+ASSETS.reference+')');
    document.querySelector('.ak-custom-art')?.style.setProperty('--reference-art','url('+ASSETS.reference+')');
    const label=document.createElement('p');label.className='kingdom-eyebrow';label.textContent='THE COLLECTOR’S DIMENSION / 01';hero.querySelector('.hero-content')?.prepend(label);
  }
  const progress=document.createElement('div');progress.className='kingdom-scroll-progress';progress.setAttribute('aria-hidden','true');document.body.appendChild(progress);
  const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-revealed');observer.unobserve(entry.target)}},{threshold:0.08});
  function enhance(){document.querySelectorAll('.ak2-category,.ak2-custom,.ak2-living,.ak2-benefits article,.ak2-heading,.glass-card,.product-card,#about-section,#drops-section,.section-header,.ak-category,.ak-custom,.ak-value-grid article,.ak-community,.ak-final').forEach((el,i)=>{if(el.dataset.motionReady)return;el.dataset.motionReady='yes';el.style.setProperty('--reveal-delay',Math.min(i%4,3)*70+'ms');el.classList.add('kingdom-reveal');observer.observe(el)});}
  enhance();
  const mutation=new MutationObserver(enhance);for(const id of ['page-view','featured-grid']){const root=document.getElementById(id);if(root)mutation.observe(root,{childList:true,subtree:true})}
  let frame=0;
  function scrollMotion(){if(frame)return;frame=requestAnimationFrame(()=>{frame=0;const range=document.documentElement.scrollHeight-innerHeight;progress.style.transform='scaleX('+(range>0?scrollY/range:0)+')';if(hero&&!reduced.matches)hero.style.setProperty('--scroll-drift',Math.min(scrollY*.12,65)+'px')})}
  addEventListener('scroll',scrollMotion,{passive:true});scrollMotion();
  let activeCard=null,tiltFrame=0;
  document.addEventListener('pointermove',event=>{
    if(reduced.matches||event.pointerType==='touch'||!matchMedia('(hover: hover) and (pointer: fine)').matches)return;
    const card=event.target.closest('.product-card,.glass-card');
    if(activeCard&&activeCard!==card){activeCard.style.removeProperty('--tilt-x');activeCard.style.removeProperty('--tilt-y')}
    activeCard=card;if(!card||tiltFrame)return;
    tiltFrame=requestAnimationFrame(()=>{tiltFrame=0;const r=card.getBoundingClientRect();card.style.setProperty('--tilt-x',((.5-(event.clientY-r.top)/r.height)*7)+'deg');card.style.setProperty('--tilt-y',(((event.clientX-r.left)/r.width-.5)*9)+'deg')});
  },{passive:true});
  document.addEventListener('pointerout',event=>{if(activeCard&&!activeCard.contains(event.relatedTarget)){activeCard.style.removeProperty('--tilt-x');activeCard.style.removeProperty('--tilt-y');activeCard=null}});
})();

