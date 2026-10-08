const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('public/verification.js','utf8');
async function check(code,row,ok=true){
 const nodes=new Map(),get=id=>{if(!nodes.has(id))nodes.set(id,{hidden:false,textContent:''});return nodes.get(id);};
 let calls=0;
 vm.runInNewContext(source,{document:{getElementById:get},location:{search:'?code='+code},URLSearchParams,AbortSignal,Date,window:{print(){}},fetch:async()=>{calls++;return {ok,json:async()=>row};}});
 await new Promise(resolve=>setImmediate(resolve));return {get,calls};
}
(async()=>{
 let r=await check('bad',{});assert.equal(r.calls,0);assert.equal(r.get('verified').hidden,true);
 const code='f6350388-4d7e-4c52-891c-2f98d77d006e';
 r=await check(code,null);assert.equal(r.get('verified').hidden,true);
 r=await check(code,{status:'revoked',serial:101});assert.equal(r.get('verified').hidden,true);assert.match(r.get('verification-status').textContent,/revoked/);
 r=await check(code,null,false);assert.equal(r.get('retry').hidden,false);assert.equal(r.get('verified').hidden,true);
 r=await check(code,{status:'active',serial:101,product_name:'Figure',buyer_name:'<script>unsafe</script>',purchase_date:'2026-10-01',issued_at:'2026-10-08T10:00:00Z'});
 assert.equal(r.get('verified').hidden,false);assert.equal(r.get('buyer-name').textContent,'<script>unsafe</script>');assert.equal(r.get('serial').textContent,'AK-101');
 console.log('PASS: public certificate verification, invalid/revoked codes, service failures and safe buyer text.');
})().catch(e=>{console.error(e);process.exit(1);});
