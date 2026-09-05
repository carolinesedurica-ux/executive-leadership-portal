(()=>{
const questions={
week1:['What kind of leader do I want people to experience when they work with me?','Which leadership situations currently cause me to hesitate or second-guess myself?','What would I do differently if I trusted my leadership judgement more?'],
week2:['When I feel evaluated or challenged at work, what changes in the way I speak, listen or behave?','Which habit most reduces my leadership presence?','If I focused less on how I was being judged and more on contributing effectively, what might I do differently?'],
week3:['When I anticipate disagreement or confrontation, what do I normally do?','What conversation, boundary or disagreement am I currently avoiding because I am concerned about the other person’s reaction?','What is the cost if I continue avoiding it?']};
const dayTitles={week1:['Self-esteem: worth beyond performance','Confidence: build evidence','Assertiveness: notice hesitation','Communication: make leadership visible','Presentation: speak with self-trust'],week2:['Self-esteem: take up appropriate space','Confidence: pause is authority','Communication: lead with the point','Presentation: deliver a 60–90 second update','Assertiveness: hold your position calmly'],week3:['Assertiveness: name the real issue','Communication: listen without surrendering','Confidence: make a clear request','Self-esteem: disagree without shrinking','Presentation: answer a challenging question clearly']};

let data=null,participants=[],selectedParticipantId='',section='overview',week='week1';
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const state=()=>data?.elrpState||{};
const habits=()=>data?.elrpDailyHabits||{};
const priority=()=>data?.elrpPriorityFocus||{};

function countReflections(){return Object.values(state().reflections||{}).filter(v=>String(v).trim()).length}
function countNotes(){let n=0;Object.values(habits()).forEach(w=>Object.values(w||{}).forEach(d=>{if(d?.note?.trim())n++}));return n}

function participantLabel(){
  if(!data)return 'No participant selected';
  return data.clientName?data.clientName:(data.clientEmail||'Participant');
}

function stats(){
 const s=state();
 const completed=(s.completed||[]).length;
 document.getElementById('adminStats').innerHTML=
   `<div class="wrv-stat"><span>Participant</span><strong style="font-size:17px">${esc(participantLabel())}</strong></div>
    <div class="wrv-stat"><span>Reflections captured</span><strong>${countReflections()}/9</strong></div>
    <div class="wrv-stat"><span>Daily notes</span><strong>${countNotes()}/15</strong></div>
    <div class="wrv-stat"><span>Weeks completed</span><strong>${completed}/6</strong></div>
    <div class="wrv-stat"><span>Weekly test marks</span><strong style="font-size:17px">${Number(s.weeklyWeightedScore||0).toFixed(1)}/30</strong></div>
    <div class="wrv-stat"><span>Last online sync</span><strong style="font-size:17px">${data?.updatedAt?new Date(data.updatedAt).toLocaleString():'No activity yet'}</strong></div>`;
}

function renderParticipantPicker(){
 const select=document.getElementById('participantSelect');
 if(!select)return;
 select.innerHTML=participants.length
   ? participants.map(p=>`<option value="${esc(p.id)}" ${p.id===selectedParticipantId?'selected':''}>${esc(p.full_name||p.email)} · ${esc(p.email)}</option>`).join('')
   : '<option value="">No participants yet</option>';
 select.disabled=!participants.length;
}

function answer(q,a){
 const has=String(a||'').trim();
 return `<div class="wrv-answer ${has?'':'empty'}"><div class="q">${esc(q)}</div><div class="a">${has?esc(a):'No response yet.'}</div></div>`;
}

function overview(){
 const s=state();
 const priorities=[
   ['Self-esteem','selfEsteem'],['Confidence','confidence'],['Assertiveness','assertiveness'],
   ['Communication','communication'],['Presentation skills','presentation']
 ];
 const scores=priority();
 document.getElementById('adminView').innerHTML=
   `<h2>${esc(participantLabel())} · Coaching overview</h2>
    <p class="wrv-admin-meta">${esc(data?.clientEmail||'')} · Read-only participant record stored in Supabase.</p>
    <div class="wrv-answer-grid">${priorities.map(([label,key])=>answer(label,typeof scores[key]==='number'?`${scores[key]}/10`:scores[key]||'')).join('')}</div>`;
}

function responses(){
 const s=state();
 document.getElementById('adminView').innerHTML=
   `<h2>${esc(participantLabel())} · Reflections</h2>
    <div class="wrv-week-tabs">${Object.keys(questions).map(k=>`<button class="${k===week?'active':''}" data-week="${k}">${k.replace('week','Week ')}</button>`).join('')}</div>
    <div class="wrv-answer-grid">${questions[week].map((q,i)=>answer(q,s.reflections?.[`${week}-${i}`])).join('')}</div>`;
 document.querySelectorAll('[data-week]').forEach(b=>b.onclick=()=>{week=b.dataset.week;responses()});
}

function daily(){
 const h=habits();
 document.getElementById('adminView').innerHTML=
   `<h2>${esc(participantLabel())} · Daily leadership practice notes</h2>
    <div class="wrv-week-tabs">${Object.keys(dayTitles).map(k=>`<button class="${k===week?'active':''}" data-week="${k}">${k.replace('week','Week ')}</button>`).join('')}</div>
    <div class="wrv-note-list">${dayTitles[week].map((t,i)=>{const entry=h?.[week]?.[i]||{};return `<div class="wrv-note"><strong>Day ${i+1} · ${esc(t)} ${entry.done?'✓':''}</strong><p>${entry.note?.trim()?esc(entry.note):'<span style="color:#9aa5aa;font-style:italic">No note yet.</span>'}</p></div>`}).join('')}</div>`;
 document.querySelectorAll('[data-week]').forEach(b=>b.onclick=()=>{week=b.dataset.week;daily()});
}

function assessment(){
 const s=state(),a=s.assessmentReflection||{};
 const dims=['Confidence in leadership capability','Trust in judgement','Leadership presence in meetings','Remaining composed when challenged','Communicating clearly and concisely','Speaking confidently with senior colleagues','Assertiveness','Expressing disagreement respectfully','Having difficult conversations','Setting boundaries and saying no','Handling defensiveness','Avoiding over-explanation'];
 document.getElementById('adminView').innerHTML=
   `<h2>${esc(participantLabel())} · Mid-course assessment</h2>
    <div class="wrv-answer-grid">
      ${answer('Assessment status',s.assessmentComplete?'Passed':'Not yet passed')}
      ${answer('Weekly tests contribution',`${Number(s.weeklyWeightedScore||0).toFixed(1)}/30`)}
      ${answer('Latest overall mark',s.overallScore!=null?`${Number(s.overallScore).toFixed(1)}%`:'—')}
      ${answer('Assessment attempts used',`${Number(s.assessmentAttemptCount||0)}/3`)}
      ${s.midScores?dims.map((d,i)=>answer(d,`${s.midScores[i]??'—'}/10`)).join(''):''}
      ${answer('Where has the participant noticed the greatest improvement?',a.greatestImprovement)}
      ${answer('Evidence of handling a situation differently',a.evidenceSituation)}
      ${answer('Leadership situation that still feels uncomfortable',a.remainingChallenge)}
    </div>`;
}

function render(){
 renderParticipantPicker();
 stats();
 if(!data){
   document.getElementById('adminView').innerHTML='<div class="wrv-admin-empty">No participant data is available yet.</div>';
   return;
 }
 ({overview,responses,daily,assessment}[section]||overview)();
}

async function loadData(){
 const suffix=selectedParticipantId?'?participantId='+encodeURIComponent(selectedParticipantId):'';
 const r=await fetch('/api/data'+suffix,{cache:'no-store'});
 const out=await r.json();
 if(!r.ok)throw new Error(out.error||'Unable to load participant data');
 participants=out.participants||participants;
 selectedParticipantId=out.selectedParticipantId||selectedParticipantId||participants[0]?.id||'';
 data=out.data||null;
 render();
}

async function boot(){
 const r=await fetch('/api/session',{cache:'no-store'});
 const s=await r.json();
 if(!s.authenticated||s.role!=='admin'){location.href='/?admin=1';return}
 document.getElementById('adminStatus').textContent='Administrator';
 await loadData();
}

document.querySelectorAll('.wrv-admin-sidebar [data-section]').forEach(b=>b.onclick=()=>{
 document.querySelectorAll('.wrv-admin-sidebar [data-section]').forEach(x=>x.classList.remove('active'));
 b.classList.add('active');section=b.dataset.section;render();
});
document.getElementById('participantSelect').addEventListener('change',async e=>{
 selectedParticipantId=e.target.value;data=null;render();try{await loadData()}catch(err){document.getElementById('adminView').innerHTML='<div class="wrv-admin-empty">'+esc(err.message)+'</div>'}
});
document.getElementById('adminLogout').onclick=async()=>{await fetch('/api/logout',{method:'POST'});location.href='/?admin=1'};
boot().catch(err=>{document.getElementById('adminView').innerHTML='<div class="wrv-admin-empty">'+esc(err.message)+'</div>'});
setInterval(()=>loadData().catch(()=>{}),30000);
})();
