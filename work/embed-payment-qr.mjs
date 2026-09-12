import fs from 'node:fs';
const svg=fs.readFileSync('outputs/anime-kingdom-upi.svg');
const block=`<div style="text-align:center;margin:22px 0"><img src="data:image/svg+xml;base64,${svg.toString('base64')}" alt="Scan to pay Anime Kingdom at 7081201212@fam using UPI" width="280" height="280" style="display:block;background:white;border:12px solid white;border-radius:12px;margin:0 auto;max-width:100%;height:auto"><p><strong>SCAN & PAY WITH UPI</strong><br>Enter the checkout total shown above in your UPI app.</p></div>`;
for(const file of ['work/payment-page.js','work/export-pages.js']){
 let s=fs.readFileSync(file,'utf8');
 const marker='<a class="btn-primary" href="${E(\'upi://pay?';
 if(!s.includes(marker))throw Error('Payment link missing');
 s=s.replace(marker,block+marker);
 fs.writeFileSync(file,s);
}
