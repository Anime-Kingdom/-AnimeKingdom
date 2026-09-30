/* Public catalog only. Customer orders are never fetched by the storefront. */
async function loadLiveCatalog(){
 try{
  const response=await fetch(AK_SUPABASE_URL+'/rest/v1/ak_products?select=id,data&order=id.asc&limit=1000',{headers:{apikey:AK_PUBLIC_KEY},signal:AbortSignal.timeout(8000)});
  if(!response.ok)return;
  const rows=await response.json();if(!Array.isArray(rows)||!rows.length)return;
  const products=rows.map(row=>{
   const p=row.data;
   if(!p||!/^[-a-zA-Z0-9_]+$/.test(row.id)||p.id!==row.id||typeof p.name!=='string'||typeof p.anime!=='string'||typeof p.category!=='string'||!Number.isFinite(p.price)||p.price<=0||!Number.isInteger(p.stock)||p.stock<0)throw Error('Invalid catalog product');
   const urls=(p.imageUrls||[p.imageUrl]).filter(Boolean).map(value=>{const u=new URL(value);if(u.protocol!=='https:'||!['www.animekingdom.in','animekingdom.in','iuftepknrbankwkfdbuc.supabase.co'].includes(u.hostname))throw Error('Invalid catalog photo');return u.href.replaceAll('"','%22');});
   if(!urls.length)throw Error('Missing catalog photo');
   const images=urls.map((url,i)=>{const key='live-'+row.id+'-'+i;ASSETS[key]=url;return key;});
   return {...p,id:row.id,image:images[0],images};
  });
  state.products=products;
  if(activeView==='home')featured();else if(['shop','wishlist'].includes(activeView))results();
 }catch(error){console.warn('Live catalog unavailable; using bundled catalog.');}
}
loadLiveCatalog();
async function loadLiveCoupons(){
 try{
  const response=await fetch(AK_SUPABASE_URL+'/rest/v1/ak_coupons?select=code,minimum,percent,amount,enabled&limit=1000',{headers:{apikey:AK_PUBLIC_KEY},signal:AbortSignal.timeout(8000)});
  if(!response.ok)return;
  const rows=await response.json();if(!Array.isArray(rows))return;
  const offers={};for(const r of rows){if(!/^[A-Z0-9_-]{3,40}$/.test(r.code)||!Number.isFinite(r.minimum)||r.minimum<0||!(Number.isFinite(r.percent)&&r.percent>0&&r.percent<=100||Number.isFinite(r.amount)&&r.amount>0))throw Error('Invalid coupon');if(r.enabled)offers[r.code]={minimum:r.minimum,...(r.percent?{percent:r.percent}:{amount:r.amount})};}
  for(const code of Object.keys(COUPONS))delete COUPONS[code];Object.assign(COUPONS,offers);
 }catch{console.warn('Live coupons unavailable; using bundled coupons.');}
}
loadLiveCoupons();

// Refresh open storefronts as well as newly opened pages.
if(typeof document!=="undefined"){setInterval(()=>{if(!document.hidden){loadLiveCatalog();loadLiveCoupons();}},15000);document.addEventListener("visibilitychange",()=>{if(!document.hidden){loadLiveCatalog();loadLiveCoupons();}});}
