import fs from 'node:fs';
for(const file of ['work/payment-page.js','work/export-pages.js']){
 let s=fs.readFileSync(file,'utf8');
 s=s.replace('Transaction reference (optional)<input name="upiReference" maxlength="80" placeholder="Enter the reference after paying">','UTR / UPI transaction number<input id="upi-utr" name="upiReference" inputmode="numeric" pattern="[0-9]{12}" maxlength="12" placeholder="12-digit UTR from your UPI app" disabled>');
 s=s.replace('<p class="form-help">Payment stays unverified','<label class="payment-reference">Payment screenshot<input id="upi-proof" name="upiScreenshot" type="file" accept="image/png,image/jpeg,image/webp" onchange="previewPaymentProof(this)" disabled></label><p class="form-help">Upload a PNG, JPG or WebP image (maximum 2 MB). Your UTR and screenshot are saved on this device only.</p><img id="upi-proof-preview" hidden alt="Selected payment screenshot" style="max-width:100%;max-height:300px;border-radius:8px"><p class="form-help">Payment stays unverified');
 s=s.replace("function selectPayment(method){", "function selectPayment(method){for(const id of ['upi-utr','upi-proof']){$(id).disabled=method!=='upi';$(id).required=method==='upi'}");
 s=s.replace('function placeOrder(e){','async function placeOrder(e){');
 s=s.replace("delete values.payment;delete values.upiReference;const order=", "let proof='';if(method==='upi'){if(!/^[0-9]{12}$/.test(reference)){toast('Enter the 12-digit UTR from your UPI app.');return}try{proof=await paymentProof(values.upiScreenshot)}catch(error){toast(error.message);return}if(!lines().length)return}delete values.payment;delete values.upiReference;delete values.upiScreenshot;const order=");
 s=s.replace('upiReference:reference,items:', 'upiReference:reference,paymentScreenshot:proof,items:');
 s=s.replace("list.forEach(({p,qty})=>p.stock-=qty);", "const before=structuredClone(state);list.forEach(({p,qty})=>p.stock-=qty);");
 s=s.replace("coupon='';save();badge();go('orders');", "try{localStorage.setItem(KEY,JSON.stringify(state))}catch{state=before;toast('Not enough browser storage. Choose a smaller screenshot and try again.');return}coupon='';badge();go('orders');");
 if(file.endsWith('export-pages.js'))s=s.replace('<div class="steps">${stages', '${/^data:image\\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(o.paymentScreenshot||\'\')?`<details><summary>View payment screenshot</summary><img src="${o.paymentScreenshot}" alt="Payment screenshot for ${E(o.id)}" style="max-width:100%;max-height:400px;margin-top:15px"></details>`:\'\'}<div class="steps">${stages');
 fs.writeFileSync(file,s);
}
