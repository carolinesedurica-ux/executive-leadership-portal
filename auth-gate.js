(()=>{
const qs=new URLSearchParams(location.search);
let role=qs.get('admin')==='1'?'admin':'client';
let lastSnapshot='';
let syncing=false;
let cloudAvailable=true;
let supabaseClient=null;
let currentParticipant=null;
const $=(s,r=document)=>r.querySelector(s);

function getSupabase(){
  if(supabaseClient)return supabaseClient;
  const cfg=window.ELRP_SUPABASE||{};
  if(!window.supabase?.createClient||!cfg.url||!cfg.publishableKey)return null;
  supabaseClient=window.supabase.createClient(cfg.url,cfg.publishableKey,{
    auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
  });
  return supabaseClient;
}

function displayName(participant){
  const raw=String(participant?.fullName||'').trim();
  if(raw)return raw;
  const email=String(participant?.email||'').trim();
  return email?email.split('@')[0]:'Participant';
}

function paintIdentity(participant){
  if(!participant)return;
  currentParticipant=participant;
  const name=document.querySelector('.user-name');
  if(name)name.textContent='Hello, '+displayName(participant)+'⌄';
}

function isolateParticipant(participant){
  const id=String(participant?.id||'');
  if(!id)return false;
  const previous=localStorage.getItem('elrpActiveParticipantId');
  if(previous===id)return false;

  ['elrpState','elrpDailyHabits','elrpPriorityFocus'].forEach(key=>localStorage.removeItem(key));
  localStorage.setItem('elrpActiveParticipantId',id);
  return true;
}

function overlay(){
 const el=document.createElement('div');
 el.className='wrv-auth-overlay';
 el.innerHTML=`<section class="wrv-auth-visual">
   <div class="wrv-auth-brand"><div class="wrv-auth-logo">Foundations Counselling Academy</div><small>Executive Leadership Coaching</small></div>
   <div class="wrv-auth-copy"><span class="kicker">Reflect · Grow · Lead</span><h1>Build the leader your next chapter requires.</h1><p>A private coaching space for deliberate practice, reflection, communication growth and measurable leadership development.</p></div>
 </section>
 <section class="wrv-auth-panel">
   <form class="wrv-auth-card" id="wrvLogin">
     <h2>Welcome</h2>
     <p>Sign up or sign in to continue your Executive Leadership Readiness Programme.</p>
     <div class="wrv-role-toggle"><button type="button" data-role="client">Participant</button><button type="button" data-role="admin">Administrator</button></div>
     <label class="wrv-auth-field wrv-client-field"><span>Full name <small>(new participants)</small></span><input type="text" name="fullName" autocomplete="name" maxlength="120" placeholder="Your full name"></label>
     <label class="wrv-auth-field wrv-client-field"><span>Email address</span><input type="email" name="email" autocomplete="email" placeholder="you@example.com"></label>
     <p class="wrv-auth-helper wrv-client-field">First time here? Add your name and email. Returning participants can use the same email address to sign in. No password is required.</p>
     <label class="wrv-auth-field wrv-admin-field"><span>Access code</span><input type="password" name="password" autocomplete="current-password" placeholder="Enter your private access code"></label>
     <button class="wrv-auth-submit" type="submit">Email me a secure access link →</button>
     <p class="wrv-auth-success" id="wrvAuthSuccess"></p>
     <p class="wrv-auth-error" id="wrvAuthError"></p>
     <p class="wrv-auth-foot">Foundations Counselling Academy · Executive Leadership Coaching</p>
   </form>
 </section>`;
 document.body.prepend(el);

 const paint=()=>{
   el.querySelectorAll('[data-role]').forEach(b=>b.classList.toggle('active',b.dataset.role===role));
   el.querySelectorAll('.wrv-client-field').forEach(x=>x.hidden=role!=='client');
   el.querySelectorAll('.wrv-admin-field').forEach(x=>x.hidden=role!=='admin');
   const email=$('input[name="email"]',el),password=$('input[name="password"]',el),submit=$('.wrv-auth-submit',el);
   if(email)email.required=role==='client';
   if(password)password.required=role==='admin';
   submit.textContent=role==='client'?'Email me a secure access link →':'Sign in securely →';
   $('#wrvAuthError',el).textContent='';
   $('#wrvAuthSuccess',el).textContent='';
 };
 paint();

 el.querySelectorAll('[data-role]').forEach(b=>b.onclick=()=>{role=b.dataset.role;paint()});

 $('#wrvLogin',el).onsubmit=async e=>{
   e.preventDefault();
   const error=$('#wrvAuthError',el),success=$('#wrvAuthSuccess',el),btn=$('.wrv-auth-submit',el);
   error.textContent='';success.textContent='';
   btn.disabled=true;
   btn.textContent=role==='client'?'Sending secure link…':'Signing in…';
   try{
     if(role==='client'){
       const email=String(e.target.email.value||'').trim().toLowerCase();
       const fullName=String(e.target.fullName.value||'').trim();
       const r=await fetch('/api/email-login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,fullName})});
       const data=await r.json();
       if(!r.ok)throw new Error(data.error||'Unable to send sign-in email');
       success.textContent='Check your inbox. New participants will confirm their email; returning participants will sign in with the same secure link.';
       btn.textContent='Send access link again';
       return;
     }

     const r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({role:'admin',password:e.target.password.value})});
     const data=await r.json();
     if(!r.ok)throw new Error(data.error||'Unable to sign in');
     location.href='/admin.html';
   }catch(err){
     error.textContent=err.message;
   }finally{
     btn.disabled=false;
     if(role==='admin')btn.textContent='Sign in securely →';
     else if(!success.textContent)btn.textContent='Email me a secure access link →';
   }
 };
 return el;
}

function readLocal(){
 let a={},b={},c={};
 try{a=JSON.parse(localStorage.getItem('elrpState')||'{}')}catch{}
 try{b=JSON.parse(localStorage.getItem('elrpDailyHabits')||'{}')}catch{}
 try{c=JSON.parse(localStorage.getItem('elrpPriorityFocus')||'{}')}catch{}
 return{elrpState:a,elrpDailyHabits:b,elrpPriorityFocus:c}
}
function snapshot(){return JSON.stringify(readLocal())}
function isEmptyPayload(payload){
 return !Object.keys(payload.elrpState||{}).length&&
        !Object.keys(payload.elrpDailyHabits||{}).length&&
        !Object.keys(payload.elrpPriorityFocus||{}).length
}

async function push(force=false){
 if(syncing||!cloudAvailable)return false;
 const current=snapshot();
 if(!force&&current===lastSnapshot)return true;
 syncing=true;markSync('Syncing…');
 try{
   const payload=JSON.parse(current);
   const r=await fetch('/api/data',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
   let out={};try{out=await r.json()}catch{}
   if(!r.ok)throw new Error(out.error||'Online sync failed');
   lastSnapshot=current;markSync('Online');return true;
 }catch(err){
   console.error('FCA sync failed',err);
   markSync('Sync error');
   return false;
 }finally{syncing=false}
}

function markSync(text){
 const host=document.querySelector('.user-chip');if(!host)return;
 let chip=host.querySelector('.wrv-sync-chip');
 if(!chip){chip=document.createElement('span');chip.className='wrv-sync-chip';host.appendChild(chip)}
 chip.textContent=`● ${text}`;
}

function addLogout(){
 const host=document.querySelector('.user-chip');if(!host||host.querySelector('.wrv-logout'))return;
 const b=document.createElement('button');b.className='wrv-logout';b.textContent='Sign out';
 b.onclick=async()=>{
   await push(true);
   try{await getSupabase()?.auth.signOut()}catch{}
   await fetch('/api/logout',{method:'POST'});
   location.href='/';
 };
 host.appendChild(b)
}

async function activateClient(el){
 try{
   const r=await fetch('/api/data',{cache:'no-store'});
   const out=await r.json();
   if(!r.ok)throw new Error(out.error||'Unable to load online participant data');

   if(out.data){
     const server=out.data;
     paintIdentity({
       id:server.participantId,
       fullName:server.clientName,
       email:server.clientEmail
     });
     const local=readLocal();
     const serverPayload={
       elrpState:server.elrpState||{},
       elrpDailyHabits:server.elrpDailyHabits||{},
       elrpPriorityFocus:server.elrpPriorityFocus||{}
     };
     const serverSnap=JSON.stringify(serverPayload);
     const localSnap=JSON.stringify(local);
     if(serverSnap!==localSnap&&!qs.has('cloud')){
       localStorage.setItem('elrpState',JSON.stringify(serverPayload.elrpState));
       localStorage.setItem('elrpDailyHabits',JSON.stringify(serverPayload.elrpDailyHabits));
       localStorage.setItem('elrpPriorityFocus',JSON.stringify(serverPayload.elrpPriorityFocus));
       const u=new URL(location.href);u.searchParams.set('cloud','1');location.replace(u.toString());return;
     }
     lastSnapshot=serverSnap;
   }else{
     const local=readLocal();
     if(isEmptyPayload(local))lastSnapshot=JSON.stringify(local);else await push(true);
   }
   markSync('Online');
 }catch(err){
   console.error('FCA online load failed',err);
   cloudAvailable=false;
   markSync('Sync error');
 }
 el.remove();
 document.dispatchEvent(new CustomEvent('wrv:client-authenticated'));
 setTimeout(()=>{if(!document.querySelector('.wrv-sync-chip'))markSync('Online');addLogout()},100);
 setInterval(()=>{if(cloudAvailable)push(false)},5000);
 document.addEventListener('visibilitychange',()=>{if(cloudAvailable&&document.visibilityState==='hidden')push(true)});
 window.addEventListener('beforeunload',()=>{if(!cloudAvailable)return;const payload=snapshot();try{navigator.sendBeacon('/api/data',new Blob([payload],{type:'application/json'}))}catch{push(true)}})
}

async function establishPortalSessionFromSupabase(){
 const client=getSupabase();if(!client)return 'none';
 try{
   const {data}=await client.auth.getSession();
   const accessToken=data?.session?.access_token;
   if(!accessToken)return 'none';
   const r=await fetch('/api/supabase-session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({accessToken})});
   const out=await r.json();
   if(!r.ok)throw new Error(out.error||'Unable to verify email session');

   if(out.participant){
     if(isolateParticipant(out.participant)){
       location.reload();
       return 'reloading';
     }
     paintIdentity(out.participant);
   }

   if(location.hash||qs.has('code')){
     history.replaceState({},document.title,location.pathname);
   }
   return 'authenticated';
 }catch(err){
   console.error('Supabase portal session failed',err);
   return 'none';
 }
}

async function boot(){
 const gate=overlay();
 try{
   const authState=await establishPortalSessionFromSupabase();
   if(authState==='reloading')return;
   if(authState==='authenticated'){
     await activateClient(gate);
     return;
   }
   const r=await fetch('/api/session',{cache:'no-store'});
   const s=await r.json();
   if(s.authenticated){
     if(s.role==='admin'){location.href='/admin.html';return}
     await activateClient(gate);
   }
 }catch{}
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
