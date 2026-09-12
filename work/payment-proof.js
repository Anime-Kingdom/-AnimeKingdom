async function paymentProof(file){
 if(!file||!file.size)throw Error('Upload your payment screenshot.');
 if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>2*1024*1024)throw Error('Choose a PNG, JPG or WebP screenshot no larger than 2 MB.');
 const data=await readFile(file);
 await new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve();img.onerror=()=>reject(Error('This image could not be opened. Choose another screenshot.'));img.src=data});
 return data;
}
async function previewPaymentProof(input){
 const preview=$('upi-proof-preview');preview.hidden=true;preview.removeAttribute('src');
 const file=input.files[0];if(!file)return;
 try{const data=await paymentProof(file);if(input.files[0]!==file)return;preview.src=data;preview.hidden=false}catch(error){input.value='';toast(error.message)}
}
