const AK_SUPABASE_URL='https://iuftepknrbankwkfdbuc.supabase.co';
const AK_PUBLIC_KEY='sb_publishable_hnpfNcfu6QKRwOdXeRd0FA_Cv34axxK';
const pendingForms=new WeakMap();
async function sendSubmission(form,type,data,customer,payment={}) {
  const contents=JSON.stringify({type,data,customer,payment});
  let pending=pendingForms.get(form);
  if(!pending||pending.contents!==contents){pending={contents,id:crypto.randomUUID()};pendingForms.set(form,pending)}
  const row={id:pending.id,form_type:type,customer_name:customer.name||'',email:customer.email||'',phone:customer.phone||null,form_data:data,status:'pending',payment_method:payment.method||null,utr_number:payment.utr||null};
  let response;
  try{response=await fetch(AK_SUPABASE_URL+'/rest/v1/AK%20orders',{method:'POST',headers:{apikey:AK_PUBLIC_KEY,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(row),signal:AbortSignal.timeout(45000)})}
  catch{throw Error('Could not confirm submission. Keep this page open and retry with the same details when connected.')}
  if(!response.ok){const error=await response.json().catch(()=>({}));console.error('Submission rejected',response.status,error.code);throw Error('Supabase did not accept this submission ('+response.status+'). Your form has been kept; please retry or contact the store.')}
  return pending.id;
}
async function busyForm(form,action){
  if(form.dataset.submitting==='yes')return;
  if(!form.reportValidity())return;
  form.dataset.submitting='yes';const buttons=[...form.querySelectorAll('button')];buttons.forEach(b=>b.disabled=true);
  try{await action()}catch(error){toast(error.message)}finally{delete form.dataset.submitting;buttons.forEach(b=>b.disabled=false)}
}
async function placeOrder(e){
 e.preventDefault();const form=e.target;
 await busyForm(form,async()=>{
  const list=lines();if(!list.length)throw Error('Your cart is empty.');
  if(list.some(({p,qty})=>qty>p.stock))throw Error('Update your cart: availability has changed.');
  const values=Object.fromEntries(new FormData(form));const method=values.payment||'cod';
  if(!['cod','upi'].includes(method))throw Error('Choose a payment method.');
  const reference=method==='upi'?String(values.upiReference||'').trim():'';
  if(method==='upi'&&!/^[0-9]{12}$/.test(reference))throw Error('Enter the 12-digit UTR from your UPI app.');
  const proof=method==='upi'?await paymentProof(values.upiScreenshot):'';
  delete values.payment;delete values.upiReference;delete values.upiScreenshot;
  const order={address:values,paymentMethod:method,paymentStatus:method==='upi'?'Awaiting manual verification':'Due on delivery',upiId:method==='upi'?UPI_ID:'',upiReference:reference,paymentScreenshot:proof,items:list.map(({p,qty})=>orderItem(p,qty)),...totals(),status:'Order Placed',source:'website'};
  const id=await sendSubmission(form,'checkout',order,values,{method,utr:reference});
  order.id=id;order.date=new Date().toISOString();order.cloudSaved=true;
  if(!state.orders.some(o=>o.id===id))state.orders.unshift(order);
  state.cart={};coupon='';save();badge();go('orders');toast('Order received by Anime Kingdom. Payment and delivery await seller confirmation.');
 });
}
async function contactDraft(e){e.preventDefault();await busyForm(e.target,async()=>{const data=Object.fromEntries(new FormData(e.target));await sendSubmission(e.target,'contact',data,data);e.target.reset();toast('Message received by Anime Kingdom.');})}
async function saveProfile(e){e.preventDefault();await busyForm(e.target,async()=>{const data=Object.fromEntries(new FormData(e.target));await sendSubmission(e.target,'profile',data,data);state.profile=data;save();toast('Customer details sent to Anime Kingdom.');})}
async function saveCustom(e){e.preventDefault();await busyForm(e.target,async()=>{const f=new FormData(e.target),file=f.get('reference');const data=Object.fromEntries([...f.entries()].filter(([key])=>key!=='reference'));if(file?.size)data.reference=await paymentProof(file);data.id=await sendSubmission(e.target,'custom_figure',data,data);data.created=new Date().toISOString();data.cloudSaved=true;state.requests.unshift(data);save();renderPage();toast('Custom figure request received by Anime Kingdom.');})}

