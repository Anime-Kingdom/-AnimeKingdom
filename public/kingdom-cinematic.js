/* Anime Kingdom — original scroll-directed collectible showcase. */
(() => {
  'use strict';
  const home=document.querySelector('#home-view'),hero=home?.querySelector('.ak2-hero');
  if(!hero||document.querySelector('.ak-legend-story'))return;
  const base=new URL('.',document.currentScript.src);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const chapters=[
    {id:'gojo',name:'Satoru Gojo',short:'GOJO',series:'JUJUTSU KAISEN',word:'LIMITLESS',title:'Bring legends<br><em>home.</em>',text:'A little infinity. A lot of presence. Find the character your collection has been waiting for.',accent:'#b58aff',rgb:'181,138,255',action:'Shop Gojo figures',query:'Gojo',label:'01 / THE LIMITLESS'},
    {id:'luffy',name:'Monkey D. Luffy',short:'LUFFY',series:'ONE PIECE',word:'FREEDOM',title:'Adventure.<br><em>On display.</em>',text:'For the dreamers. The explorers. The ones with room for one more adventure.',accent:'#ff9a64',rgb:'255,154,100',action:'Shop Luffy figures',query:'Luffy',label:'02 / THE DREAMER'},
    {id:'tanjiro',name:'Tanjiro Kamado',short:'TANJIRO',series:'DEMON SLAYER',word:'RESOLVE',title:'A quiet heart.<br><em>A fierce spirit.</em>',text:'Turn your favourite character into a personal collectible. Tell us the pose, style and details you imagine.',accent:'#69dbc4',rgb:'105,219,196',action:'Request a custom figure',view:'custom',label:'03 / THE UNBREAKABLE'},
    {id:'goku',name:'Son Goku',short:'GOKU',series:'DRAGON BALL',word:'POWER',title:'Power up<br><em>your world.</em>',text:'Big energy deserves a place on your shelf. Start a conversation about your next custom figure.',accent:'#f6c16c',rgb:'246,193,108',action:'Request a custom figure',view:'custom',label:'04 / THE NEXT LEVEL'}
  ];
  const section=document.createElement('section');section.className='ak-legend-story';section.id='legend-showcase';section.setAttribute('aria-label','Anime Kingdom character collection showcase');
  section.innerHTML=`<div class="ak-legend-stage"><div class="ak-legend-grid" aria-hidden="true"></div><div class="ak-legend-top"><span>ANIME KINGDOM <b>/</b> THE LEGEND COLLECTION</span><a href="#shop" data-view="shop">Skip to the store <span aria-hidden="true">↗</span></a></div><div class="ak-legend-worlds">${chapters.map((c,i)=>`<article class="ak-legend-world" data-world="${i}" style="--legend-accent:${c.accent};--legend-rgb:${c.rgb}"${i?' inert aria-hidden="true"':''}><div class="ak-legend-aura" aria-hidden="true"></div><div class="ak-legend-word" aria-hidden="true">${c.word}</div><div class="ak-legend-orbit" aria-hidden="true"><i></i><i></i><i></i></div><div class="ak-legend-figure"><img src="${new URL('legend-'+c.id+'.webp',base)}" alt="Promotional collectible concept of ${c.name}" width="1024" height="1536" decoding="async" ${i?'loading="eager"':'fetchpriority="high"'} draggable="false"></div><div class="ak-legend-copy"><p class="ak-legend-kicker">${c.label}</p><h${i?'2':'1'}>${c.title}</h${i?'2':'1'}><p class="ak-legend-description">${c.text}</p><a class="ak-legend-cta" href="#${c.view||'shop'}" ${c.view?'data-view="custom"':'data-legend-shop="'+c.query+'"'}>${c.action}<span aria-hidden="true">↗</span></a><div class="ak-legend-identity"><span>${c.series}</span><strong>${c.name}</strong></div></div></article>`).join('')}</div><div class="ak-legend-bottom"><div class="ak-legend-controls" role="group" aria-label="Choose an anime character">${chapters.map((c,i)=>`<button type="button" data-legend-chapter="${i}" aria-label="Show ${c.name}" aria-pressed="${i===0}"><small>0${i+1}</small>${c.short}<i aria-hidden="true"></i></button>`).join('')}</div><div class="ak-legend-caption"><span class="ak-legend-scroll">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></span><span>Promotional concept artwork · See catalog for actual products</span></div></div></div>`;
  home.insertBefore(section,hero);
  const stage=section.querySelector('.ak-legend-stage'),worlds=[...section.querySelectorAll('.ak-legend-world')],buttons=[...section.querySelectorAll('[data-legend-chapter]')];
  let frame=0,active=-1,start=0,range=1,current=0,visible=true,manual=0;
  const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
  function geometry(){
    const nav=document.querySelector('.top-nav');const height=Math.round(nav?.getBoundingClientRect().height||72);
    section.style.setProperty('--legend-nav',height+'px');
    const rect=section.getBoundingClientRect();start=scrollY+rect.top-height;range=Math.max(1,section.offsetHeight-stage.offsetHeight);schedule();
  }
  function render(value){
    const next=Math.round(value);
    const focused=document.activeElement;
    // Do not hide a focused control while the visitor is using the keyboard.
    if(next!==active&&worlds[active]?.contains(focused)){buttons[next].focus({preventScroll:true});}
    if(next!==active){
      active=next;section.dataset.chapter=chapters[active].id;
      section.style.setProperty('--legend-active',chapters[active].accent);
      worlds.forEach((world,i)=>{world.inert=i!==active;world.setAttribute('aria-hidden',String(i!==active));});
      buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===active)));
    }
    worlds.forEach((world,i)=>{
      const delta=value-i,weight=clamp(1-Math.abs(delta)),phase=clamp(delta,-1,1);
      world.style.opacity=weight.toFixed(4);world.style.visibility=weight>.001?'visible':'hidden';
      world.style.setProperty('--chapter-travel',phase.toFixed(4));
      world.style.setProperty('--chapter-scale',(1.015+Math.abs(phase)*.055).toFixed(4));
    });
    section.style.setProperty('--legend-progress',(value/3).toFixed(4));
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(update)}
  function update(){
    frame=0;if(home.hidden||!visible)return;
    const target=reduced.matches?manual:clamp((scrollY-start)/range)*3;
    current=reduced.matches?target:(Math.abs(target-current)<.0008?target:current+(target-current)*.18);
    render(current);if(current!==target)schedule();
  }
  buttons.forEach((button,i)=>button.addEventListener('click',()=>{
    if(reduced.matches){manual=i;current=i;render(i);return;}
    window.scrollTo({top:start+range*i/3,behavior:'smooth'});
  }));
  section.querySelectorAll('[data-legend-shop]').forEach(link=>link.addEventListener('click',event=>{
    const input=document.querySelector('.header-search input[name="query"]');
    if(input?.form){event.preventDefault();input.value=link.dataset.legendShop;input.form.requestSubmit();}
  }));
  const first=section.querySelector('img');
  function activate(){section.classList.add('is-ready');home.classList.add('ak-cinematic-ready');geometry();render(0);}
  if(first.complete&&first.naturalWidth)activate();else{first.addEventListener('load',activate,{once:true});first.addEventListener('error',()=>section.remove(),{once:true});}
  worlds.forEach(world=>world.querySelector('img').addEventListener('error',()=>world.classList.add('ak-legend-image-unavailable'),{once:true}));
  if('IntersectionObserver'in window){new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){geometry();schedule();}},{rootMargin:'100px'}).observe(section);}
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',geometry,{passive:true});
  reduced.addEventListener('change',()=>{manual=active<0?0:active;current=manual;geometry();schedule();});
  new MutationObserver(()=>{if(!home.hidden)geometry();}).observe(home,{attributes:true,attributeFilter:['hidden']});
  if('ResizeObserver'in window)new ResizeObserver(geometry).observe(document.querySelector('.top-nav'));
  geometry();render(0);
})();

