import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const source=fs.readFileSync('public/storefront/live-catalog.js','utf8');
const c=vm.createContext({AK_SUPABASE_URL:'https://example.com',AK_PUBLIC_KEY:'public',AbortSignal,URL,console,ASSETS:{},state:{products:[{id:'fallback'}],cart:{gojo:2}},COUPONS:{OLD:{amount:50}},activeView:'home',featured(){},results(){},fetch:async()=>({ok:false})});
vm.runInContext(source,c);const run=s=>vm.runInContext(s,c);
c.fetch=async()=>({ok:true,json:async()=>[{id:'gojo',data:{id:'gojo',name:'Gojo',anime:'JJK',category:'Figures',price:699,stock:10,imageUrls:['https://www.animekingdom.in/photo.webp']}}]});await run('loadLiveCatalog()');assert.equal(c.state.products[0].price,699);assert.equal(c.state.cart.gojo,2);assert.equal(c.ASSETS['live-gojo-0'],'https://www.animekingdom.in/photo.webp');
c.fetch=async()=>({ok:true,json:async()=>[{id:"bad'code",data:{}}]});await run('loadLiveCatalog()');assert.equal(c.state.products[0].id,'gojo');
c.fetch=async()=>({ok:true,json:async()=>[{code:'BICA20OFF',minimum:0,percent:20,amount:null,enabled:true},{code:'OLD',minimum:0,percent:null,amount:50,enabled:false}]});await run('loadLiveCoupons()');assert.equal(c.COUPONS.BICA20OFF.percent,20);assert.equal(c.COUPONS.OLD,undefined);
const html=fs.readFileSync('index.html','utf8');assert.match(html,/<script src="\.\/storefront\/live-catalog.js" defer>/);
console.log('PASS: live catalog updates prices and images without clearing carts; malformed products rejected; disabled coupons removed; deferred script order verified.');
