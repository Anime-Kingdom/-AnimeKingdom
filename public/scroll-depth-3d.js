/* Progressive 3D scroll enhancement shared by HTML and Vite. */
(function kingdomMotion(){
  if(typeof matchMedia!=='function'||typeof IntersectionObserver!=='function')return;
  if(document.documentElement.dataset.kingdomDepth3d)return;document.documentElement.dataset.kingdomDepth3d='ready';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(hover: hover) and (pointer: fine)');
  const pending=new Set(),scenes=new Set(),visible=new Set(),depths=new WeakMap();
  const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('is-revealed');pending.delete(e.target);observer.unobserve(e.target)}},{threshold:0,rootMargin:'0px 0px -24px 0px'});
  const depthObserver=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting)visible.add(e.target);else visible.delete(e.target)}schedule()});
  const progress=document.querySelector('.kingdom-scroll-progress')||document.createElement('div');progress.className='kingdom-scroll-progress';progress.setAttribute('aria-hidden','true');if(!progress.isConnected)document.body.appendChild(progress);
  let frame=0,activeCard=null,pointer=null;
  function schedule(){if(!frame)frame=requestAnimationFrame(update)}
  function enhance(){
    for(const el of pending)if(!el.isConnected){observer.unobserve(el);pending.delete(el)}
    for(const el of scenes)if(!el.isConnected){depthObserver.unobserve(el);scenes.delete(el);visible.delete(el)}
    document.querySelectorAll('.ak2-category,.ak2-heading,.ak2-custom-copy,.ak2-custom figure,.ak2-living>div,.ak2-living figure,.lithophane-copy,.lithophane-gallery,.ak2-benefits article,.ak2-finale,.product-card,.glass-card,#page-view .section-header').forEach(el=>{
      if(el.dataset.depthReady)return;el.dataset.depthReady='yes';
      const index=Array.prototype.indexOf.call(el.parentElement.children,el);
      el.style.setProperty('--reveal-delay',Math.min(index%4,3)*65+'ms');el.classList.add('kingdom-reveal');
      if(reduced.matches||el.contains(document.activeElement))el.classList.add('is-revealed');else{pending.add(el);observer.observe(el)}
    });
    document.querySelectorAll('.ak2-hero,.ak2-custom figure,.ak2-living figure,.lithophane-gallery').forEach(el=>{
      if(scenes.has(el))return;scenes.add(el);el.classList.add('kingdom-depth');depths.set(el,0);depthObserver.observe(el)
    });schedule();
  }
  function update(){
    frame=0;const range=document.documentElement.scrollHeight-innerHeight;
    progress.style.transform='scaleX('+(range>0?Math.max(0,Math.min(1,scrollY/range)):0)+')';
    if(reduced.matches)return;
    const amplitude=innerWidth<=600?8:18;
    const measurements=Array.from(visible,el=>[el,el.getBoundingClientRect()]);let moving=false;
    for(const [el,r] of measurements){
      const target=r.height?Math.max(-1,Math.min(1,(innerHeight/2-r.top-r.height/2)/((innerHeight+r.height)/2))):0;
      const previous=depths.get(el)||0;
      const next=Math.abs(target-previous)<.001?target:previous+(target-previous)*.14;
      depths.set(el,next);el.style.setProperty('--depth-y',(next*amplitude).toFixed(2)+'px');el.style.setProperty('--depth-angle',(next*-1.6).toFixed(3)+'deg');
      if(next!==target)moving=true;
    }
    if(activeCard&&pointer){const r=activeCard.getBoundingClientRect();if(r.width&&r.height){activeCard.style.setProperty('--tilt-x',((.5-(pointer.y-r.top)/r.height)*5)+'deg');activeCard.style.setProperty('--tilt-y',(((pointer.x-r.left)/r.width-.5)*6)+'deg')}pointer=null}
    if(moving)schedule();
  }
  function resetCard(){if(activeCard){activeCard.style.removeProperty('--tilt-x');activeCard.style.removeProperty('--tilt-y')}activeCard=null;pointer=null}
  document.addEventListener('pointermove',e=>{
    if(reduced.matches||!fine.matches||e.pointerType==='touch')return;
    const card=e.target.closest('.product-card,.glass-card,.ak2-category');if(card!==activeCard)resetCard();activeCard=card;
    if(card){pointer={x:e.clientX,y:e.clientY};schedule()}
  },{passive:true});
  document.addEventListener('pointerout',e=>{if(activeCard&&!activeCard.contains(e.relatedTarget))resetCard()});
  document.addEventListener('focusin',e=>{const el=e.target.closest('.kingdom-reveal');if(el){el.classList.add('is-revealed');pending.delete(el);observer.unobserve(el)}});
  reduced.addEventListener('change',()=>{
    if(reduced.matches){resetCard();for(const el of pending){el.classList.add('is-revealed');observer.unobserve(el)}pending.clear();for(const el of scenes){depths.set(el,0);el.style.removeProperty('--depth-y');el.style.removeProperty('--depth-angle')}}schedule();
  });
  fine.addEventListener('change',resetCard);
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});addEventListener('blur',resetCard);
  enhance();const mutation=new MutationObserver(enhance);for(const id of ['home-view','page-view']){const el=document.getElementById(id);if(el)mutation.observe(el,{childList:true,subtree:true})}
})();

