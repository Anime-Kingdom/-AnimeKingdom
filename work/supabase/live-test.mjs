import fs from 'node:fs';import vm from 'node:vm';import {webcrypto} from 'node:crypto';
const c=vm.createContext({fetch,crypto:webcrypto,AbortSignal,console});vm.runInContext(fs.readFileSync('work/export-supabase.js','utf8'),c);
const data={address:{name:'TEST ONLY - Integration',phone:'9000000000',email:'test@example.com',address:'Test address - DO NOT SHIP',city:'Test city',state:'Test state',pin:'110001'},items:[{id:'gojo',name:'TEST ONLY figure',qty:1,price:0}],total:0,source:'integration-test',test_only:true};
c.data=data;
for(const method of ['cod','upi']){c.method=method;c.proof=method==='upi'?'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a3ioAAAAASUVORK5CYII=':'';console.log(method,await vm.runInContext("sendSubmission({},'checkout',{...data,paymentScreenshot:proof,upiId:method==='upi'?'7081201212@fam':'',paymentStatus:'TEST ONLY - no payment made'},data.address,{method,utr:method==='upi'?'000000000000':''})",c));}
const headers={apikey:'sb_publishable_hnpfNcfu6QKRwOdXeRd0FA_Cv34axxK'};
const r=await fetch('https://iuftepknrbankwkfdbuc.supabase.co/rest/v1/AK%20orders?select=id',{headers});console.log('Anonymous read:',r.status,await r.text());
