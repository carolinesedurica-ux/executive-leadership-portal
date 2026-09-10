(()=>{
const weeks={
 week1:'Leadership Identity & Confidence',
 week2:'Executive Presence & Personal Authority',
 week3:'Assertiveness & Difficult Conversations',
 week4:'Influence & Impact',
 week5:'Resilience & Self-Leadership',
 week6:'Leading Sustainable Change'
};
let participants=[];
let selectedId='';
let selectedDetail=null;
let selectedWeek='week1';

const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const notesFromDetail=()=>selectedDetail?.workspace?.elrp_state?.tools||{};
const noteFor=key=>String(notesFromDetail()?.[`${key}-working-notes`]||'').trim();

function addNav(){
 const nav=document.querySelector('.dev-side nav');
 if(!nav||nav.querySelector('[data-section="working-notes"]'))return;
 const btn=document.createElement('button');
 btn.type='button';
 btn.dataset.section='working-notes';
 btn.innerHTML='▧ <span>Working Notes</span>';
 const responses=nav.querySelector('[data-section="responses"]');
 if(responses)responses.after(btn);else nav.appendChild(btn);
 btn.addEventListener('click',openNotesReview);
}

async function loadParticipants(){
 const r=await fetch('/api/data?developer=1',{cache:'no-store'});
 const out=await r.json();
 if(!r.ok)throw new Error(out.error||'Unable to load participant list.');
 participants=out.participants||[];
}

async function loadParticipant(id){
 selectedId=String(id||'');
 selectedDetail=null;
 if(!selectedId){render();return}
 const r=await fetch('/api/data?developer=1&participantId='+encodeURIComponent(selectedId),{cache:'no-store'});
 const out=await r.json();
 if(!r.ok)throw new Error(out.error||'Unable to load participant working notes.');
 selectedDetail=out.detail||null;
 render();
}

function participantPicker(){
 return `<section class="card dev-notes-picker">
   <div><span class="kicker">Private participant notes</span><h2>Select a participant</h2><p class="muted">Working Notes are visible only to the participant and authorised developer/admin access. Other participants cannot view them.</p></div>
   <select id="devNotesParticipant">
     <option value="">Choose participant…</option>
     ${participants.map(p=>`<option value="${esc(p.id)}" ${p.id===selectedId?'selected':''}>${esc(p.full_name||p.email)} · ${esc(p.email)}</option>`).join('')}
   </select>
 </section>`;
}

function weekTabs(){
 return `<div class="dev-notes-week-tabs">${Object.entries(weeks).map(([key,title])=>{
   const has=Boolean(noteFor(key));
   return `<button type="button" data-notes-week="${key}" class="${key===selectedWeek?'active':''}"><span>${key.replace('week','Week ')}</span><small>${has?'Notes captured':'No notes yet'}</small></button>`;
 }).join('')}</div>`;
}

function allWeeksOverview(){
 return `<section class="card dev-notes-overview"><div class="dev-notes-section-head"><div><span class="kicker">Course insight</span><h2>Working Notes across the programme</h2></div><span class="pill">Read-only review</span></div>
 <div class="dev-notes-overview-grid">${Object.entries(weeks).map(([key,title])=>{
   const note=noteFor(key);
   return `<button type="button" data-notes-week="${key}" class="dev-note-overview-card ${note?'has-note':'empty-note'}"><span>${key.replace('week','Week ')}</span><strong>${esc(title)}</strong><p>${note?esc(note.slice(0,180))+(note.length>180?'…':''):'No working notes captured yet.'}</p><small>${note?note.length+' characters':'Awaiting participant notes'}</small></button>`;
 }).join('')}</div></section>`;
}

function weekNote(){
 const title=weeks[selectedWeek];
 const note=noteFor(selectedWeek);
 const reflections=selectedDetail?.workspace?.elrp_state?.reflections||{};
 const reflectionList=[0,1,2].map(i=>String(reflections[`${selectedWeek}-${i}`]||'').trim()).filter(Boolean);
 return `<div class="dev-notes-detail-grid">
   <section class="card dev-note-reader"><div class="dev-notes-section-head"><div><span class="kicker">${selectedWeek.replace('week','Week ')}</span><h2>${esc(title)} · Working Notes</h2></div><span class="privacy-chip">Private participant note</span></div>
     ${note?`<div class="dev-note-content">${esc(note).replace(/\n/g,'<br>')}</div><div class="dev-note-meta">${note.length} characters · Read-only in Developer Mode</div>`:'<div class="empty">This participant has not entered Working Notes for this week yet.</div>'}
   </section>
   <aside class="card dev-note-context"><span class="kicker">Reflection context</span><h2>What the learner is reflecting on</h2>
     ${reflectionList.length?reflectionList.map((x,i)=>`<div class="dev-note-reflection"><strong>Reflection ${i+1}</strong><p>${esc(x)}</p></div>`).join(''):'<div class="empty">No reflection responses captured for this week yet.</div>'}
   </aside>
 </div>`;
}

function bind(){
 const picker=document.getElementById('devNotesParticipant');
 if(picker)picker.onchange=e=>loadParticipant(e.target.value).catch(showError);
 document.querySelectorAll('[data-notes-week]').forEach(btn=>btn.onclick=()=>{selectedWeek=btn.dataset.notesWeek;render()});
}

function render(){
 const view=document.getElementById('devView');
 if(!view)return;
 const participant=participants.find(p=>p.id===selectedId);
 view.innerHTML=`<div class="section-title"><div><span class="kicker">Participant insight</span><h1>Working Notes Review</h1><p class="muted">Use participant working notes to spot unclear instructions, difficult exercises, recurring questions and areas of the programme that may need refinement.</p></div><span class="pill">Developer/Admin only</span></div>
 ${participantPicker()}
 ${selectedDetail?`<section class="dev-notes-person"><strong>${esc(participant?.full_name||participant?.email||'Participant')}</strong><span>${esc(participant?.email||'')}</span></section>${weekTabs()}${weekNote()}${allWeeksOverview()}`:'<div class="card empty">Select a participant to review their private Working Notes across Weeks 1–6.</div>'}`;
 const status=document.getElementById('devStatus');
 if(status)status.textContent=selectedDetail?'Developer mode · private Working Notes review · '+(participant?.full_name||participant?.email||'participant'):'Developer mode · private Working Notes review';
 bind();
}

function showError(err){
 const status=document.getElementById('devStatus');
 if(status)status.textContent=err.message||'Unable to load Working Notes.';
}

async function openNotesReview(){
 document.querySelectorAll('.dev-side [data-section]').forEach(b=>b.classList.toggle('active',b.dataset.section==='working-notes'));
 try{
  if(!participants.length)await loadParticipants();
  render();
 }catch(err){showError(err)}
}

function boot(){
 addNav();
 const nav=document.querySelector('.dev-side nav');
 if(nav&&!nav.dataset.notesObserver){
   nav.dataset.notesObserver='1';
   new MutationObserver(addNav).observe(nav,{childList:true});
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();