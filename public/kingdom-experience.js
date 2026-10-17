/* Original anime direction inspired by the supplied motion and editorial references. */
(() => {
 'use strict';
 const home=document.querySelector('#home-view');if(!home)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),canPoint=matchMedia('(hover:hover) and (pointer:fine)');
 document.body.classList.add('kingdom-v3');
 const account=document.createElement('a');account.className='kingdom-account-link';account.href='/customer-account.html';account.textContent='Kingdom ID ↗';document.querySelector('.top-nav-actions')?.prepend(account);
 document.addEventListener('click',event=>{if(event.target.closest('[data-view="account"]')){event.preventDefault();event.stopImmediatePropagation();location.href='/customer-account.html';}},true);
 if(location.hash==='#account')location.replace('/customer-account.html');
 const story=document.querySelector('.ak-legend-story');
 if(story){
  const chips=document.createElement('div');chips.className='kingdom-energy';chips.setAttribute('aria-hidden','true');chips.innerHTML='<i>✦</i><i>無限</i><i>✧</i><i>夢</i><i>✦</i><i>魂</i>';story.querySelector('.ak-legend-stage').append(chips);
  const goku=story.querySelector('[data-world="3"]');if(goku){goku.querySelector('.ak-legend-description').textContent='Golden hair. Unmistakable energy. Super Saiyan 3 Goku joins your collection for ₹1,299.';const cta=goku.querySelector('.ak-legend-cta');cta.removeAttribute('data-view');cta.href='#product/goku-ssj3';cta.innerHTML='Shop Goku · ₹1,299 <span aria-hidden="true">↗</span>';cta.addEventListener('click',e=>{e.preventDefault();go('product/goku-ssj3')});}
  let pointerFrame=0,px=0,py=0;
  story.addEventListener('pointermove',event=>{if(reduce.matches||!canPoint.matches)return;const r=story.querySelector('.ak-legend-stage').getBoundingClientRect();px=(event.clientX-r.left)/r.width-.5;py=(event.clientY-r.top)/r.height-.5;if(!pointerFrame)pointerFrame=requestAnimationFrame(()=>{story.style.setProperty('--pointer-x',px.toFixed(3));story.style.setProperty('--pointer-y',py.toFixed(3));pointerFrame=0;});},{passive:true});
  story.addEventListener('pointerleave',()=>{story.style.setProperty('--pointer-x',0);story.style.setProperty('--pointer-y',0)});
 }
 const portal=document.createElement('section');portal.className='kingdom-universe';portal.setAttribute('aria-labelledby','universe-heading');portal.innerHTML='<div class="kingdom-rail"><span>01 / CHOOSE YOUR UNIVERSE</span><span>COLLECT WHAT MOVES YOU ↙</span></div><h2 id="universe-heading">FANDOM.<br><em>IN REAL LIFE.</em></h2><p>From the Grand Line to a world beyond limits.<br>Find the figure that feels like you.</p><div class="kingdom-marquees"></div><div class="kingdom-universe-footer"><span>Actual product photography</span><button data-view="collections">Explore every collection ↗</button></div>';
 const anchor=home.querySelector('.ak2-collection-strip')||home.querySelector('.ak2-hero');anchor?.after(portal);
 const edit=document.createElement('section');edit.className='kingdom-editorial';edit.setAttribute('aria-labelledby','edit-heading');edit.innerHTML='<div class="kingdom-rail"><span>02 / THE COLLECTOR’S EDIT</span><span>CHARACTER / FORM / PRESENCE</span></div><h2 id="edit-heading">Shelf.<br><em>Expression.</em></h2><div class="kingdom-stack"></div>';
 home.querySelector('#shop-section')?.before(edit);
 const studio=document.createElement('section');studio.className='kingdom-studio';studio.setAttribute('aria-labelledby','studio-heading');studio.innerHTML='<div class="kingdom-rail"><span>03 / MADE PERSONAL</span><span>YOUR IMAGINATION. OUR STARTING POINT.</span></div><div class="kingdom-studio-intro"><h2 id="studio-heading">YOUR<br><em>MAIN CHARACTER.</em></h2><p>A favourite pose. An original character. A person you love. Start a custom figure with an idea that belongs to you.</p></div><div class="kingdom-studio-rows">'+[['01','The character','Tell us who you have in mind: Gojo, Tanjiro, an original character, or a personalized miniature.'],['02','The details','Share a pose, reference photos you have permission to use, and the style you imagine.'],['03','The conversation','Discuss size, finish, price and timing with the store before confirming an order.']].map(([n,h,p])=>'<div><span>'+n+'</span><h3>'+h+'</h3><p>'+p+'</p><b aria-hidden="true">↗</b></div>').join('')+'</div><button class="kingdom-pill" data-view="custom">Create your own chapter ↗</button>';
 home.querySelector('.ak2-custom')?.before(studio);home.querySelector('.ak2-custom')?.classList.add('kingdom-replaced');
 const club=document.createElement('section');club.className='kingdom-club';club.innerHTML='<p>THE COLLECTOR’S PASSPORT</p><h2>You belong<br><em>in this kingdom.</em></h2><a href="/customer-account.html" class="kingdom-pill">Get your Kingdom ID ↗</a><span>Verified email · Personal collector profile</span>';
 home.append(club);
 let signature='';
 function catalog(){
  if(typeof state==='undefined'||!state.products?.length)return;
  const products=state.products.filter(p=>p.stock>0&&/Anime Figures|Collectibles/i.test(p.category));const next=products.map(p=>[p.id,p.price,p.image,p.stock].join(':')).join('|');if(next===signature)return;signature=next;
  const selected=['gojo','luffy','goku-ssj3'].map(id=>products.find(p=>p.id===id)||products.find(p=>p.name.toLowerCase().includes(id.split('-')[0]))).filter(Boolean);
  function productLink(p,className){const button=document.createElement('button');button.type='button';button.className=className;const image=document.createElement('img');image.src=photo(p);image.alt=p.name;image.loading='lazy';image.decoding='async';button.append(image);button.addEventListener('click',()=>details(p.id));return button;}
  const lanes=portal.querySelector('.kingdom-marquees');lanes.replaceChildren();
  for(let row=0;row<2;row++){const lane=document.createElement('div');lane.className='kingdom-lane';const track=document.createElement('div');track.className='kingdom-lane-track';const subset=products.slice(row*3,row*3+6);if(!subset.length)continue;
   for(let copy=0;copy<2;copy++)for(const p of subset){const button=productLink(p,'kingdom-marquee-card');if(copy){button.setAttribute('aria-hidden','true');button.tabIndex=-1;}const name=document.createElement('span');name.textContent=p.name;button.append(name);track.append(button);}lane.append(track);lanes.append(lane);}
  const stack=edit.querySelector('.kingdom-stack');stack.replaceChildren();
  selected.forEach((p,i)=>{const article=document.createElement('article');article.className='kingdom-stack-card';article.style.setProperty('--stack-index',i);article.style.setProperty('--card-accent',['#bba0ff','#ffb28b','#eed08c'][i]);const figure=productLink(p,'kingdom-stack-image');const text=document.createElement('div');text.className='kingdom-stack-copy';const number=document.createElement('small');number.textContent='0'+(i+1)+' / '+p.anime.toUpperCase();const title=document.createElement('h3');title.textContent=p.name;const description=document.createElement('p');description.textContent=i===2?'Super Saiyan energy, ready for your display. Explore both product photos.':'A character with presence. A place in your collection. Explore the actual product, price and details.';const price=document.createElement('strong');price.textContent=INR(p.price);const button=document.createElement('button');button.className='kingdom-pill';button.textContent='Meet your next figure ↗';button.onclick=()=>details(p.id);text.append(number,title,description,price,button);article.append(text,figure);stack.append(article);});
 }
 catalog();const updates=setInterval(catalog,1500);addEventListener('pagehide',()=>clearInterval(updates),{once:true});
 // Replace preview labels without changing product prices, inventory or checkout.
 const clean=root=>root.querySelectorAll('.product-badge').forEach(el=>{const text=el.textContent.replace(/DEMO\s*·?\s*/g,'').trim()||'COLLECTIBLE';if(el.textContent!==text)el.textContent=text;});
 clean(document);let cleaning=false;new MutationObserver(()=>{if(cleaning)return;cleaning=true;queueMicrotask(()=>{clean(document);cleaning=false;});}).observe(document.querySelector('.main-wrapper'),{childList:true,subtree:true});
})();
