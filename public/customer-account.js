/* Real Supabase email authentication. No service credentials or local fake IDs. */
(() => {
 'use strict';
 const $=id=>document.getElementById(id), endpoint='https://iuftepknrbankwkfdbuc.supabase.co';
 const client=window.supabase?.createClient(endpoint,'sb_publishable_hnpfNcfu6QKRwOdXeRd0FA_Cv34axxK',{auth:{storageKey:'ak-customer-auth-v1',flowType:'pkce',persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
 function status(id,text,error=false){$(id).textContent=text;$(id).className=error?'error':'success';}
 if(!client){$('loading').textContent='Account services could not load. Refresh the page or continue shopping as a guest.';return;}
 const emailDeliveryReady=false; // Enable after a free SMTP sender is connected and delivery is verified.
 if(!emailDeliveryReady){$('email-form').hidden=true;document.querySelector('.intro').textContent='Collector accounts are opening soon. You can explore figures and place orders as a guest.';document.querySelector('#sign-in .fine').hidden=true;document.querySelector('.help').hidden=true;}
 let userId=null,version=0;
 async function show(session){
  const ticket=++version;userId=session?.user?.id||null;$('loading').hidden=true;$('sign-in').hidden=!!userId;$('profile').hidden=!userId;
  $('profile-form').reset();$('customer-id').textContent='Complete your profile';$('verified-email').textContent=session?.user?.email||'';
  if(!userId)return;
  const {data,error}=await client.from('ak_customer_profiles').select('*').eq('id',userId).maybeSingle();
  if(ticket!==version)return;
  if(error){status('profile-status','Your account is verified, but the profile service is unavailable. Please try again later.',true);return;}
  if(data){$('customer-id').textContent='AK–'+data.customer_id;for(const [key,value] of Object.entries(data)){const field=$('profile-form').elements.namedItem(key);if(field)field.value=value||'';}}
 }
 $('email-form').addEventListener('submit',async event=>{
  event.preventDefault();if(!emailDeliveryReady)return;const button=$('send-link');if(button.disabled)return;button.disabled=true;status('email-status','Sending your secure link…');
  try{const {error}=await client.auth.signInWithOtp({email:$('email').value.trim(),options:{emailRedirectTo:location.origin+'/customer-account.html',shouldCreateUser:true}});if(error)throw error;
   status('email-status','Check your inbox. If the address can receive sign-in emails, a link will arrive shortly. Open it in this browser.');
  }catch(error){status('email-status',/rate|limit/i.test(error.message)?'Too many requests. Please wait before trying again.':'Email sign-in is temporarily unavailable. Please try later or shop as a guest.',true);}
  finally{setTimeout(()=>button.disabled=false,30000);}
 });
 $('profile-form').addEventListener('submit',async event=>{
  event.preventDefault();const button=$('save-profile'),owner=userId;if(button.disabled||!owner)return;button.disabled=true;status('profile-status','Saving your profile…');
  const fields=Object.fromEntries(new FormData(event.target));Object.keys(fields).forEach(k=>fields[k]=String(fields[k]).trim());
  try{const {data,error}=await client.rpc('ak_save_customer_profile',fields);if(error)throw error;if(userId!==owner)return;
   const profile=Array.isArray(data)?data[0]:data;if(!profile?.customer_id)throw Error('Profile was not returned');$('customer-id').textContent='AK–'+profile.customer_id;status('profile-status','Profile saved. This Kingdom ID belongs to your verified account.');
  }catch(error){if(userId===owner)status('profile-status','Could not save your profile. Check the fields and try again. If this continues, contact Anime Kingdom.',true);}
  finally{button.disabled=false;}
 });
 $('sign-out').addEventListener('click',async()=>{const {error}=await client.auth.signOut();if(error){status('profile-status','Could not sign out. Please try again.',true);return;}status('email-status','You have signed out.');show(null);});
 client.auth.onAuthStateChange((event,session)=>{if(['SIGNED_IN','SIGNED_OUT','USER_UPDATED'].includes(event))setTimeout(()=>show(session),0);});
 client.auth.getSession().then(({data,error})=>{if(error)throw error;return show(data.session)}).catch(()=>{$('loading').textContent='Could not restore your session. Refresh to retry, or return to the store.';});
})();
