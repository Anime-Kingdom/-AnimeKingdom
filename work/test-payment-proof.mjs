import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import {webcrypto} from 'node:crypto';
const html=fs.readFileSync('outputs/anime-kingdom.html','utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const nodes=new Map();const node=()=>({innerHTML:'',textContent:'',value:'',hidden:false,open:false,style:{setProperty(){}},classList:{add(){},remove(){},toggle(){return false}},setAttribute(){},addEventListener(){},showModal(){this.open=true},close(){this.open=false},focus(){},appendChild(){},replaceChildren(){},remove(){},click(){}});
const get=id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id)};
const context=vm.createContext({console,Intl,Date,Math,JSON,Number,String,Object,Array,Set,Map,Promise,RegExp,Uint8Array,DataView,structuredClone,crypto:webcrypto,ASSETS:{},localStorage:{getItem(){return null},setItem(){}},document:{getElementById:get,querySelectorAll(){return []},querySelector(){return node()},addEventListener(){},createElement:node,documentElement:node(),body:node(),activeElement:node()},window:{addEventListener(){},scrollTo(){}},history:{replaceState(){}},location:{hash:''},setTimeout(){return 1},clearTimeout(){},setInterval(){},URL,Blob,FormData:class{constructor(value){this.data=value}entries(){return Object.entries(this.data)}[Symbol.iterator](){return this.entries()[Symbol.iterator]()}}});
vm.runInContext(script,context);
const run=s=>vm.runInContext(s,context);
assert.equal(run('state.products.length'),4);
run("add('gojo',2)");assert.equal(run('state.cart.gojo'),2);
run("add('gojo',100)");assert.equal(run('state.cart.gojo'),2);
run("wish('gojo')");assert.equal(run("state.wishlist.includes('gojo')"),true);
run("coupon='KINGDOM10'");assert.equal(run('totals().discount'),499.8);assert.equal(run('totals().total'),4498.2);
run("placeOrder({preventDefault(){},target:{name:'Test Collector',email:'test@example.test',phone:'9876543210',address:'Sample address',city:'Mumbai',state:'Maharashtra',pin:'400001'}})");
assert.equal(run('state.orders.length'),1);assert.equal(run('state.products[0].stock'),10);assert.equal(run('Object.keys(state.cart).length'),0);
run("setStatus(state.orders[0].id,'Cancelled')");assert.equal(run('state.products[0].stock'),12);run("setStatus(state.orders[0].id,'Cancelled')");assert.equal(run('state.products[0].stock'),12);
for(const page of ['home','shop','collections','wishlist','custom','drops','kingdom','account','orders','track','about','workshop','contact','faq','shipping','privacy','terms','editor','missing'])run(`go('${page}')`);
run('openCart()');
for(const match of (html.split('<script>')[0]+[...nodes.values()].map(n=>n.innerHTML).join('')).matchAll(/\bon(?:click|change|input|submit)="([^"]*)"/g))new vm.Script('(function(event){'+match[1]+'})');
assert.equal((html.match(/<script>/g)||[]).length,1);assert.equal((html.match(/<\/script>/g)||[]).length,1);
console.log('PASS: JavaScript syntax, inline handlers, 19 view render functions, cart stock limit, wishlist, coupon totals, test checkout, inventory decrement and cancellation restoration. Browser visual and supplied-model tests not performed.');



run("add('gojo',1);go('checkout');selectPayment('upi')");
assert.equal(get('upi-proof').required,true);assert.equal(get('upi-utr').required,true);
const count=run('state.orders.length');
await run("placeOrder({preventDefault(){},target:{payment:'upi',upiReference:'bad'}})");assert.equal(run('state.orders.length'),count);
await run("placeOrder({preventDefault(){},target:{payment:'upi',upiReference:'123456789012'}})");assert.equal(run('state.orders.length'),count);
run("paymentProof=async()=> 'data:image/png;base64,dGVzdA=='");
await run("placeOrder({preventDefault(){},target:{payment:'upi',upiReference:'123456789012',upiScreenshot:{size:1}}})");
assert.equal(run('state.orders[0].upiReference'),'123456789012');assert.equal(run('state.orders[0].paymentScreenshot'),'data:image/png;base64,dGVzdA==');assert.equal(run('state.orders[0].paymentStatus'),'Awaiting manual verification');
run("selectPayment('cod')");assert.equal(get('upi-proof').required,false);assert.equal(get('upi-proof').disabled,true);
console.log('PASS: UTR validation, missing screenshot rejection, proof persistence, unverified status, and COD fields disabled.');
