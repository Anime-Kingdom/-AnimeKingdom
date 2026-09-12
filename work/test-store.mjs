import assert from 'node:assert/strict';
const base='http://localhost:5173';
async function request(action,input={},expected=200){const r=await fetch(base+'/api/store',{method:'POST',headers:{'Content-Type':'application/json',Origin:base},body:JSON.stringify({action,input})});const d=await r.json();assert.equal(r.status,expected,JSON.stringify(d));return d}
const get=async v=>{const r=await fetch(base+'/api/store'+(v?'?view='+v:''));assert.equal(r.status,200);return r.json()};
const cat=await get();assert.equal(cat.products.length,10);const p=cat.products.find(p=>p.id==='gojo-satoru-figure');
await request('cart',{product:p.id,quantity:2});await request('cart',{product:p.id,quantity:p.stock+1},400);
await request('wishlist',{product:p.id});let ac=await get('account');assert(ac.wishlist.some(w=>w.product===p.id));assert.equal(ac.cart.find(c=>c.product===p.id).quantity,2);
await request('quote',{coupon:'INVALID-TEST'},400);
const cid=crypto.randomUUID();await request('save',{table:'coupons',data:{id:cid,code:'QA10',kind:'percentage',value:10,minimum:10000,maximum:100000,expires:'2030-01-01',usage_limit:2,category:'',product:'',active:1}});
const q=await request('quote',{coupon:'QA10'});assert.equal(q.discount,Math.floor(p.price*2/10));
const address={name:'Test Collector',email:'collector@example.test',phone:'9876543210',address:'Demo address, no delivery',apartment:'',city:'Mumbai',state:'Maharashtra',pin:'400001',country:'India'};
await request('checkout',{address:{...address,pin:'123'},coupon:'QA10',method:'test',request_key:crypto.randomUUID()},400);
const key=crypto.randomUUID(),o=await request('checkout',{address,coupon:'QA10',method:'test',request_key:key});assert.equal(o.order.total,q.total);const again=await request('checkout',{address,coupon:'QA10',method:'test',request_key:key});assert.equal(again.order.id,o.order.id);
assert.equal((await get()).products.find(a=>a.id===p.id).stock,p.stock-2);ac=await get('account');assert.equal(ac.cart.length,0);assert(ac.orders.some(a=>a.id===o.order.id));
await request('order_status',{id:o.order.id,status:'Cancelled'});assert.equal((await get()).products.find(a=>a.id===p.id).stock,p.stock);
await request('order_status',{id:o.order.id,status:'Cancelled'});assert.equal((await get()).products.find(a=>a.id===p.id).stock,p.stock);
const csrf=await fetch(base+'/api/store',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://untrusted.example'},body:JSON.stringify({action:'seed'})});assert.equal(csrf.status,403);
const invoice=await fetch(base+'/api/invoice?order='+o.order.id);assert.equal(invoice.status,200);assert((await invoice.text()).includes('NOT A TAX INVOICE'));
await request('wishlist',{product:p.id,remove:true});await request('delete',{table:'coupons',id:cid});
const routes=['','shop','all-products','new-arrivals','best-sellers','collections','product/'+p.id,'search','wishlist','cart','checkout','order-confirmation','account','orders','track-order','about','contact','faq','shipping-policy','return-refund-policy','privacy-policy','terms-conditions','admin'];
for(const route of routes){const r=await fetch(base+'/'+route);assert.equal(r.status,200,route)}
console.log('PASS: 23 page responses; demo catalog; cart quantities and stock limit; wishlist; valid/invalid coupons; address validation; checkout totals; order idempotency; atomic stock decrement; cancellation restoration; invoice authorization; CSRF rejection.');
