/* Front photos only. Catalog, stock, prices, cart and checkout remain authoritative. */
(() => {
 'use strict';
 const previousCard=card;
 card=function(product){
  const template=document.createElement('template');template.innerHTML=previousCard(product);
  const image=template.content.querySelector('.product-thumb');
  if(image){image.src=photo(product);image.loading='eager';image.decoding='async';}
  return template.innerHTML;
 };
 function loadFronts(root){root.querySelectorAll('img.product-thumb').forEach(img=>{if(img.loading!=='eager')img.loading='eager';});}
 const home=document.getElementById('home-view'),page=document.getElementById('page-view');
 [home,page].filter(Boolean).forEach(root=>{loadFronts(root);new MutationObserver(()=>loadFronts(root)).observe(root,{childList:true,subtree:true});});
 if(typeof activeView!=='undefined'){if(activeView==='home')featured();else if(['shop','wishlist'].includes(activeView))results();}
})();
