(()=>{
function readState(){try{return JSON.parse(localStorage.getItem('elrpState')||'{}')}catch{return {}}}

function emit(summary){
  if(!summary)return;
  const participant=summary.participant||{};
  const name=String(participant.fullName||participant.email||'Participant').trim();
  const label=document.querySelector('.user-name');
  if(label)label.textContent='Hello, '+(name.includes('@')?name.split('@')[0]:name)+'⌄';
  document.dispatchEvent(new CustomEvent('wrv:progress-authoritative',{detail:summary}));
  updateResend(summary);
}

function updateResend(summary){
  const host=document.querySelector('.user-chip');
  if(!host)return;
  let btn=host.querySelector('.wrv-credential-resend');
  const needsResend=Boolean(summary.activeCredential&&!summary.activeCredential.emailSent);
  if(!needsResend){btn?.remove();return}
  if(!btn){
    btn=document.createElement('button');
    btn.className='wrv-credential-resend';
    btn.type='button';
    btn.textContent='Resend access email';
    btn.onclick=async()=>{
      btn.disabled=true;btn.textContent='Sending…';
      try{
        const r=await fetch('/api/credentials/resend',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});
        const out=await r.json();
        if(!r.ok)throw new Error(out.error||'Unable to resend credential email');
        emit(out.summary);
        btn.textContent='Sent ✓';
        setTimeout(()=>btn.remove(),1200);
      }catch(err){
        btn.textContent='Resend access email';
        alert(err.message);
      }finally{btn.disabled=false}
    };
    host.appendChild(btn);
  }
}

async function getProgress(){
  const r=await fetch('/api/progress',{cache:'no-store'});
  let out={};try{out=await r.json()}catch{}
  if(r.status===503||out.backendAvailable===false)return {backendAvailable:false};
  if(!r.ok)throw new Error(out.error||'Unable to load authoritative progress');
  return out;
}

async function sync(){
  let out=await getProgress();
  if(out.backendAvailable===false)return out;
  if(out.summary?.needsMigration){
    const r=await fetch('/api/progress/import',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({elrpState:readState()})
    });
    const imported=await r.json();
    if(r.ok&&imported.summary)out={...out,summary:imported.summary};
  }
  emit(out.summary);
  return out;
}

async function completeWeek(milestoneKey,state){
  const evidence={
    reflections:[0,1,2].map(i=>state.reflections?.[milestoneKey+'-'+i]||''),
    checks:{
      watch:state[milestoneKey+'-watch']===true,
      reflect:state[milestoneKey+'-reflect']===true,
      coach:state[milestoneKey+'-coach']===true,
      apply:state[milestoneKey+'-apply']===true
    }
  };
  const r=await fetch('/api/milestones/complete',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({milestoneKey,evidence})
  });
  let out={};try{out=await r.json()}catch{}
  if(r.status===503||out.backendAvailable===false)return {backendAvailable:false};
  if(!r.ok)throw new Error(out.error||'Unable to complete milestone');
  emit(out.summary);
  return out;
}

async function validateCredential(milestoneKey,token){
  const r=await fetch('/api/credentials/validate',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({milestoneKey,token})
  });
  let out={};try{out=await r.json()}catch{}
  if(!r.ok)throw new Error(out.error||'Unable to validate access credential');
  if(!out.valid)throw new Error('That access credential is not valid.');
  await sync();
  return out;
}

async function submitAssessment(scores,reflections){
  const r=await fetch('/api/assessment/submit',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({scores,reflections})
  });
  let out={};try{out=await r.json()}catch{}
  if(r.status===503||out.backendAvailable===false)return {backendAvailable:false};
  if(!r.ok)throw new Error(out.error||'Unable to submit assessment');
  emit(out.summary);
  return out;
}

window.ELRP_PROGRESS={sync,completeWeek,submitAssessment,validateCredential};
document.addEventListener('wrv:client-authenticated',()=>sync().catch(err=>console.error('Progress sync failed',err)));
})();
