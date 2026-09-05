(()=>{
const qs=new URLSearchParams(location.search);
let role=qs.get('admin')==='1'?'admin':'client';
let clientMode='signin';
let lastSnapshot='';
let syncing=false;
let cloudAvailable=true;
let supabaseClient=null;
let currentParticipant=null;
const recoveryMode=qs.get('recovery')==='1'||location.hash.includes('type=recovery');
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

function authVisual(){
 return `<section class="wrv-auth-visual">
   <div class="wrv-auth-brand"><div class="wrv-auth-logo"><img src="assets/fca-logo.webp" alt="Foundations Counselling Academy"></div><small>Executive Leadership Coaching</small></div>
   <div class="wrv-auth-copy"><span class="kicker">Reflect · Grow · Lead</span><h1>Build the leader your next chapter requires.</h1><p>A private coaching space for deliberate practice, reflection, communication growth and measurable leadership development.</p></div>
 </section>`;
}

function recoveryOverlay(){
 const el=document.createElement('div');
 el.className='wrv-auth-overlay';
 el.innerHTML=`${authVisual()}
 <section class="wrv-auth-panel">
   <form class="wrv-auth-card" id="wrvRecovery">
     <h2>Create a new password</h2>
     <p>Choose a password for future sign-ins. Once saved, you can return with your email and password without another sign-in link.</p>
     <label class="wrv-auth-field"><span>New password</span><input type="password" name="password" autocomplete="new-password" minlength="8" required placeholder="At least 8 characters"></label>
     <label class="wrv-auth-field"><span>Confirm new password</span><input type="password" name="confirmPassword" autocomplete="new-password" minlength="8" required placeholder="Repeat your password"></label>
     <button class="wrv-auth-submit" type="submit">Save password & continue →</button>
     <p class="wrv-auth-success" id="wrvAuthSuccess"></p>
     <p class="wrv-auth-error" id="wrvAuthError"></p>
     <p class="wrv-auth-foot">Foundations Counselling Academy · Executive Leadership Coaching</p>
   </form>
 </section>`;
 document.body.prepend(el);

 $('#wrvRecovery',el).onsubmit=async e=>{
   e.preventDefault();
   const error=$('#wrvAuthError',el),success=$('#wrvAuthSuccess',el),btn=$('.wrv-auth-submit',el);
   error.textContent='';success.textContent='';
   const password=String(e.target.password.value||'');
   const confirmPassword=String(e.target.confirmPassword.value||'');
   if(password.length<8){error.textContent='Use at least 8 characters.';return}
   if(password!==confirmPassword){error.textContent='The passwords do not match.';return}
   btn.disabled=true;btn.textContent='Saving password…';
   try{
     const client=getSupabase();
     const {data:{session}}=await client.auth.getSession();
     if(!session)throw new Error('This password-reset session has expired. Request a new reset email.');
     const {error:updateError}=await client.auth.updateUser({password});
     if(updateError)throw updateError;
     success.textContent='Password saved. Opening your coaching portal…';
     history.replaceState({},document.title,location.pathname);
     const authState=await establishPortalSessionFromSupabase();
     if(authState==='reloading')return;
     if(authState!=='authenticated')throw new Error('Password saved, but the portal session could not be established.');
     await activateClient(el);
   }catch(err){
     error.textContent=err.message||'Unable to save your new password.';
     btn.disabled=false;btn.textContent='Save password & continue →';
   }
 };
 return el;
}

function overlay(){
 const el=document.createElement('div');
 el.className='wrv-auth-overlay';
 el.innerHTML=`${authVisual()}
 <section class="wrv-auth-panel">
   <form class="wrv-auth-card" id="wrvLogin">
     <h2>Welcome</h2>
     <p>Access your Executive Leadership Readiness Programme.</p>
     <div class="wrv-role-toggle"><button type="button" data-role="client">Participant</button><button type="button" data-role="admin">Administrator</button></div>
     <div class="wrv-client-mode wrv-client-field">
       <button type="button" data-client-mode="signin">Sign in</button>
       <button type="button" data-client-mode="signup">Create account</button>
     </div>
     <label class="wrv-auth-field wrv-client-field wrv-signup-only"><span>Full name</span><input type="text" name="fullName" autocomplete="name" maxlength="120" placeholder="Your full name"></label>
     <label class="wrv-auth-field wrv-client-field"><span>Email address</span><input type="email" name="email" autocomplete="email" placeholder="you@example.com"></label>
     <label class="wrv-auth-field wrv-client-field"><span>Password</span><input type="password" name="clientPassword" autocomplete="current-password" minlength="8" placeholder="Your password"></label>
     <label class="wrv-auth-field wrv-client-field wrv-signup-only"><span>Confirm password</span><input type="password" name="confirmPassword" autocomplete="new-password" minlength="8" placeholder="Repeat your password"></label>
     <p class="wrv-auth-helper wrv-client-field wrv-signin-only">Returning participants sign in with email and password. No verification or magic-link email is sent.</p>
     <p class="wrv-auth-helper wrv-client-field wrv-signup-only">New participants confirm their email once after creating an account. Future sign-ins use email and password.</p>
     <button type="button" class="wrv-auth-link wrv-client-field wrv-signin-only" id="wrvForgotPassword">Forgot or need to create your password?</button>
     <label class="wrv-auth-field wrv-admin-field"><span>Access code</span><input type="password" name="adminPassword" autocomplete="current-password" placeholder="Enter your private access code"></label>
     <button class="wrv-auth-submit" type="submit">Sign in →</button>
     <p class="wrv-auth-success" id="wrvAuthSuccess"></p>
     <p class="wrv-auth-error" id="wrvAuthError"></p>
     <p class="wrv-auth-foot">Foundations Counselling Academy · Executive Leadership Coaching</p>
   </form>
 </section>`;
 document.body.prepend(el);

 const paint=()=>{
   el.querySelectorAll('[data-role]').forEach(b=>b.classList.toggle('active',b.dataset.role===role));
   el.querySelectorAll('[data-client-mode]').forEach(b=>b.classList.toggle('active',b.dataset.clientMode===clientMode));
   el.querySelectorAll('.wrv-client-field').forEach(x=>x.hidden=role!=='client');
   el.querySelectorAll('.wrv-admin-field').forEach(x=>x.hidden=role!=='admin');
   el.querySelectorAll('.wrv-signup-only').forEach(x=>x.hidden=role!=='client'||clientMode!=='signup');
   el.querySelectorAll('.wrv-signin-only').forEach(x=>x.hidden=role!=='client'||clientMode!=='signin');

   const email=$('input[name="email"]',el);
   const fullName=$('input[name="fullName"]',el);
   const clientPassword=$('input[name="clientPassword"]',el);
   const confirmPassword=$('input[name="confirmPassword"]',el);
   const adminPassword=$('input[name="adminPassword"]',el);
   const submit=$('.wrv-auth-submit',el);

   if(email)email.required=role==='client';
   if(fullName)fullName.required=role==='client'&&clientMode==='signup';
   if(clientPassword){
     clientPassword.required=role==='client';
     clientPassword.autocomplete=clientMode==='signup'?'new-password':'current-password';
   }
   if(confirmPassword)confirmPassword.required=role==='client'&&clientMode==='signup';
   if(adminPassword)adminPassword.required=role==='admin';

   submit.textContent=role==='admin'?'Sign in securely →':clientMode==='signup'?'Create account →':'Sign in →';
   $('#wrvAuthError',el).textContent='';
   $('#wrvAuthSuccess',el).textContent='';
 };
 paint();

 el.querySelectorAll('[data-role]').forEach(b=>b.onclick=()=>{role=b.dataset.role;paint()});
 el.querySelectorAll('[data-client-mode]').forEach(b=>b.onclick=()=>{clientMode=b.dataset.clientMode;paint()});

 $('#wrvForgotPassword',el).onclick=async()=>{
   const error=$('#wrvAuthError',el),success=$('#wrvAuthSuccess',el);
   const email=String($('input[name="email"]',el)?.value||'').trim().toLowerCase();
   error.textContent='';success.textContent='';
   if(!email||!email.includes('@')){error.textContent='Enter your email address first.';return}
   const btn=$('#wrvForgotPassword',el);btn.disabled=true;btn.textContent='Sending password email…';
   try{
     const client=getSupabase();
     const {error:resetError}=await client.auth.resetPasswordForEmail(email,{
       redirectTo:location.origin+'/?recovery=1'
     });
     if(resetError)throw resetError;
     success.textContent='Check your inbox for the password-reset email. This is only needed when you forget or have not yet created a password.';
   }catch(err){
     error.textContent=err.message||'Unable to send the password-reset email.';
   }finally{
     btn.disabled=false;btn.textContent='Forgot or need to create your password?';
   }
 };

 $('#wrvLogin',el).onsubmit=async e=>{
   e.preventDefault();
   const error=$('#wrvAuthError',el),success=$('#wrvAuthSuccess',el),btn=$('.wrv-auth-submit',el);
   error.textContent='';success.textContent='';
   btn.disabled=true;
   try{
     if(role==='admin'){
       btn.textContent='Signing in…';
       const r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({role:'admin',password:e.target.adminPassword.value})});
       const data=await r.json();
       if(!r.ok)throw new Error(data.error||'Unable to sign in');
       location.href='/admin.html';
       return;
     }

     const client=getSupabase();
     if(!client)throw new Error('Participant authentication is temporarily unavailable.');
     const email=String(e.target.email.value||'').trim().toLowerCase();
     const password=String(e.target.clientPassword.value||'');

     if(clientMode==='signup'){
       btn.textContent='Creating account…';
       const fullName=String(e.target.fullName.value||'').trim();
       const confirmPassword=String(e.target.confirmPassword.value||'');
       if(!fullName)throw new Error('Enter your full name.');
       if(password.length<8)throw new Error('Use a password with at least 8 characters.');
       if(password!==confirmPassword)throw new Error('The passwords do not match.');

       const {data,error:signupError}=await client.auth.signUp({
         email,
         password,
         options:{
           data:{full_name:fullName},
           emailRedirectTo:location.origin+'/'
         }
       });
       if(signupError)throw signupError;

       if(data?.session){
         const authState=await establishPortalSessionFromSupabase();
         if(authState==='reloading')return;
         if(authState==='authenticated'){await activateClient(el);return}
       }
       success.textContent='Account created. Check your inbox once to confirm your email. After confirmation, future sign-ins use your email and password.';
       btn.textContent='Create account →';
       return;
     }

     btn.textContent='Signing in…';
     const {error:signinError}=await client.auth.signInWithPassword({email,password});
     if(signinError){
       const msg=String(signinError.message||'');
       if(/invalid login credentials/i.test(msg)){
         throw new Error('Email or password is incorrect. If you previously used an email sign-in link and have not created a password yet, use “Forgot or need to create your password?” once.');
       }
       throw signinError;
     }

     const authState=await establishPortalSessionFromSupabase();
     if(authState==='reloading')return;
     if(authState!=='authenticated')throw new Error('Signed in, but the portal session could not be established.');
     await activateClient(el);
   }catch(err){
     error.textContent=err.message||'Unable to sign in.';
   }finally{
     btn.disabled=false;
     if(role==='admin')btn.textContent='Sign in securely →';
     else btn.textContent=clientMode==='signup'?'Create account →':'Sign in →';
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
     history.replaceState({},document.title,location.pathname+(recoveryMode?'?recovery=1':''));
   }
   return 'authenticated';
 }catch(err){
   console.error('Supabase portal session failed',err);
   return 'none';
 }
}

async function boot(){
 if(recoveryMode){
   recoveryOverlay();
   return;
 }
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
