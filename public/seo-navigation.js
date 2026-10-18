/* Crawlable page URLs, per-view metadata and real internal links. */
(async()=>{
 const pages=await fetch('/seo-pages.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Metadata unavailable');return r.json()}).catch(()=>null);if(!pages)return;
 const originalGo=go,originalDetails=details;
 const routeURL=v=>pages[v]?.path||'/404.html';
 const meta=(key,value,property=false)=>{let el=document.head.querySelector(`meta[${property?'property':'name'}="${key}"]`);if(!el){el=document.createElement('meta');el.setAttribute(property?'property':'name',key);document.head.append(el)}el.content=value};
 function update(v){const c=pages[v];if(!c)return;document.title=c.title;meta('description',c.description);meta('robots',c.private?'noindex,follow':'index,follow');for(const [k,value] of Object.entries({title:c.title,description:c.description,url:'https://animekingdom.in'+c.path,image:c.image,type:v.startsWith('product/')?'product':'website'}))meta('og:'+k,value,true);meta('twitter:title',c.title);meta('twitter:description',c.description);meta('twitter:image',c.image);document.querySelector('link[rel="canonical"]').href='https://animekingdom.in'+c.path;}
 function links(){document.querySelectorAll('a[data-view]').forEach(a=>{if(pages[a.dataset.view])a.setAttribute('href',routeURL(a.dataset.view))});document.querySelectorAll('.product-title').forEach(h=>{if(h.querySelector('a'))return;const p=state.products.find(p=>p.name===h.textContent);if(!p)return;const a=document.createElement('a');a.href=routeURL('product/'+p.id);a.textContent=h.textContent;a.style.color='inherit';a.style.textDecoration='none';a.addEventListener('click',e=>{e.preventDefault();details(p.id)});h.replaceChildren(a)});}
 go=function(v,change=true){if(!pages[v]){location.href='/404.html';return}if(v.startsWith('product/')){openProduct(v);return}originalGo(v,false);if(change&&location.pathname!==routeURL(v))history.pushState(null,'',routeURL(v));update(v);links()};
 details=function(id){originalDetails(id);const v='product/'+id;if(!pages[v])return;if(location.pathname!==routeURL(v))history.pushState(null,'',routeURL(v));update(v)};
 shareProduct=async function(id){const p=state.products.find(p=>p.id===id);if(!p)return;const url='https://animekingdom.in'+routeURL('product/'+id);if(navigator.share){try{await navigator.share({title:p.name+' | Anime Kingdom',text:p.name+' — '+INR(p.price),url});return}catch(e){if(e.name==='AbortError')return}}try{await navigator.clipboard.writeText(url);toast('Product link copied!')}catch{window.prompt('Copy this product link:',url)}};
 async function openProduct(v){await loadLiveCatalog();originalGo('home',false);const id=v.slice(8);for(let i=0;i<24;i++){if(state.products.some(p=>p.id===id)){details(id);return}await new Promise(r=>setTimeout(r,350))}location.href='/404.html'}
 function current(){if(location.hash){const v=decodeURIComponent(location.hash.slice(1));if(pages[v])return v}return Object.keys(pages).find(v=>pages[v].path===location.pathname)||'home'}
 window.addEventListener('popstate',()=>{if(document.getElementById('modal').open)closeModal();go(current(),false)});
 new MutationObserver(links).observe(document.getElementById('page-view'),{childList:true,subtree:true});new MutationObserver(links).observe(document.getElementById('featured-grid'),{childList:true,subtree:true});
 go(current());links();
})();
