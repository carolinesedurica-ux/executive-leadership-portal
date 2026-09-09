(()=>{
const reflectionQuestions={
 week1:['What kind of leader do I want people to experience when they work with me?','Which leadership situations currently cause me to hesitate or second-guess myself?','What would I do differently if I trusted my leadership judgement more?'],
 week2:['When I feel evaluated or challenged at work, what changes in the way I speak, listen or behave?','Which habit most reduces my leadership presence?','If I focused less on how I was being judged and more on contributing effectively, what might I do differently?'],
 week3:['When I anticipate disagreement or confrontation, what do I normally do?','What conversation, boundary or disagreement am I currently avoiding because I am concerned about the other person’s reaction?','What is the cost if I continue avoiding it?'],
 week4:["Think about a recent situation where you needed someone else's support. What approach did you use to influence them, and how effective was it?","Who are the three stakeholders whose support would be most important to your success in a senior executive role, and what matters most to each of them?","When someone strongly disagrees with you, what is your instinctive reaction, and what executive behaviour would strengthen your response?"],
 week5:['What happens to your behaviour when you are under significant pressure?','Identify one situation that regularly triggers a strong emotional reaction in you as a leader. Why does it affect you?','What practice would most improve your ability to remain effective during demanding periods?'],
 week6:['What is one organisational change you believe you would need to lead if you stepped into a CEO or senior executive role today?','Why might people resist this change?','As an executive leader, I want people to experience me as someone who…']
};

const programmeCatalog=[
 {key:'week1',week:'Week 1',title:'Leadership Identity & Confidence',video:'Think Like a Leader Before You Have the Title',lab:'Leadership Compass',output:'My Leadership Identity Statement',videoUrl:null},
 {key:'week2',week:'Week 2',title:'Executive Presence & Personal Authority',video:'Your Presence Speaks Before You Do',lab:'Presence Lab',output:'My 90-Second Executive Communication Brief',videoUrl:null},
 {key:'week3',week:'Week 3',title:'Assertiveness & Difficult Conversations',video:'Speak Clearly When the Conversation Is Difficult',lab:'Conversation Lab · CLEAR Framework',output:'My Difficult Conversation Plan',videoUrl:null},
 {key:'week4',week:'Week 4',title:'Influence & Impact',video:'Influence Without Forcing: How Executives Create Buy-In',lab:'Influence Lab · Stakeholder, Priority, Resistance, Message',output:'My Stakeholder Influence Map',videoUrl:'https://qxqravtajqj1esoa.public.blob.vercel-storage.com/executive-%20leadership%20part%202/Influence_Without_Forcing.mp4'},
 {key:'week5',week:'Week 5',title:'Resilience & Self-Leadership',video:'The Leader Under Pressure: Resilience, Emotional Regulation and Self-Leadership',lab:'Pressure Reset Lab · Pause, Name, Evaluate, Respond',output:'My Personal Leadership Pressure Plan',videoUrl:'https://qxqravtajqj1esoa.public.blob.vercel-storage.com/executive-%20leadership%20part%202/Leader_Under_Pressure.mp4'},
 {key:'week6',week:'Week 6',title:'Leading Sustainable Change',video:'From Vision to Reality: How Executives Lead Sustainable Change',lab:'Change Lab · Reality, Direction, Ownership, Measure',output:'My Executive Change Blueprint',videoUrl:'https://qxqravtajqj1esoa.public.blob.vercel-storage.com/executive-%20leadership%20part%202/Leading_Sustainable_Change.mp4'}
];

const lessonItems=[
 ['watch','Watch','Explainer video'],
 ['outcomes','Outcomes','Weekly learning outcomes'],
 ['brief','Learning brief','Five executive principles'],
 ['output','Executive output','Structured applied deliverable'],
 ['lab','Leadership lab','Interactive practice tool'],
 ['reflect','Reflect','Three guided reflections'],
 ['coach','Live coaching','Coach preparation'],
 ['apply','Apply','Workplace challenge'],
 ['checkin','Check-in','End-of-week completion check'],
 ['test','Weekly test','5 MCQ + 5 written · 10%']
];

const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
let participants=[],detail=null,section='dashboard',recordParticipantId='',week='week4';

const state=()=>detail?.workspace?.elrp_state||{};
const tools=()=>state().tools||{};
const selectedParticipant=()=>participants.find(p=>p.id===recordParticipantId)||null;

async function api(){
 const r=await fetch('/api/data?developer=1',{cache:'no-store'});
 const out=await r.json();
 if(!r.ok)throw new Error(out.error||'Unable to load developer data');
 participants=out.participants||[];
 detail=null;
 recordParticipantId='';
 render();
 document.getElementById('devStatus').textContent='Developer mode · no participant attached · refreshed '+new Date(out.generatedAt).toLocaleTimeString();
}

async function loadParticipant(id){
 recordParticipantId=String(id||'');
 detail=null;
 if(!recordParticipantId){render();return}
 const r=await fetch('/api/data?developer=1&participantId='+encodeURIComponent(recordParticipantId),{cache:'no-store'});
 const out=await r.json();
 if(!r.ok)throw new Error(out.error||'Unable to load participant record');
 detail=out.detail||null;
 render();
 document.getElementById('devStatus').textContent='Developer mode · participant results view · '+new Date(out.generatedAt).toLocaleTimeString();
}

function aggregateStats(){
 const totalTests=participants.reduce((sum,p)=>sum+(p.weeklyTests?.length||0),0);
 const assessmentAttempts=participants.reduce((sum,p)=>sum+Number(p.assessmentAttempts||0),0);
 const completedWeeks=participants.reduce((sum,p)=>sum+Number(p.completedWeeks||0),0);
 const possible=participants.length*6;
 return `<div class="stats">
   <div class="stat"><span>Participants enrolled</span><strong>${participants.length}</strong></div>
   <div class="stat"><span>Weekly tests submitted</span><strong>${totalTests}</strong></div>
   <div class="stat"><span>Assessment attempts</span><strong>${assessmentAttempts}</strong></div>
   <div class="stat"><span>Weeks completed</span><strong>${completedWeeks}${possible?'/'+possible:''}</strong></div>
   <div class="stat"><span>Developer preview</span><strong style="font-size:17px">All unlocked</strong></div>
 </div>`;
}

function participantRecordPicker(copy='Select a participant to view their programme record.'){
 return `<section class="card record-picker">
   <div><span class="kicker">Participant results</span><h2>Choose a participant</h2><p class="muted">${esc(copy)}</p></div>
   <select data-record-participant>
     <option value="">Select participant…</option>
     ${participants.map(p=>`<option value="${esc(p.id)}" ${p.id===recordParticipantId?'selected':''}>${esc(p.full_name||p.email)} · ${esc(p.email)}</option>`).join('')}
   </select>
 </section>`;
}

function previewUrl(view='home',focus=''){
 const u=new URL('/developer-preview.html',location.origin);
 if(view)u.searchParams.set('view',view);
 if(focus)u.searchParams.set('focus',focus);
 return u.pathname+u.search;
}
function openPreview(view,focus=''){
 section='preview';
 detail=null;
 recordParticipantId='';
 document.querySelectorAll('.dev-side [data-section]').forEach(b=>b.classList.toggle('active',b.dataset.section==='preview'));
 preview(view,focus);
}

function bindRecordPicker(){
 document.querySelectorAll('[data-record-participant]').forEach(select=>{
   select.onchange=e=>loadParticipant(e.target.value).catch(showError);
 });
}

function dashboard(){
 document.getElementById('devView').innerHTML=`
 <section class="hero"><div><span class="kicker" style="color:#e2c98f">Development command centre</span><h1>Build and inspect the full programme.</h1><p>The development preview is completely separate from learner progression. Participant data is only loaded when you deliberately open a results area and choose a participant.</p></div><span class="badge">No learner attached</span></section>
 ${aggregateStats()}
 <div class="grid2">
   <section class="card"><h2>Programme development</h2><p class="muted">See the full six-week curriculum, every lesson component, assessment and linked video from one place.</p><div class="preview-tools"><button data-jump="programme">Programme & lessons</button><button data-jump="preview">Open full preview</button></div><div class="danger-note"><strong>Developer Preview:</strong> Weeks 1–6, weekly tests and the mid-course assessment are unlocked. Nothing you do in preview changes participant records.</div></section>
   <section class="card"><h2>Learner records</h2><p class="muted">Participant records are separate from programme development.</p><div class="preview-tools"><button data-jump="results">Results & scores</button><button data-jump="responses">Reflections</button><button data-jump="assessments">Assessments</button></div><p class="muted">A participant is selected only after you enter one of these results areas.</p></section>
 </div>`;
 bindJumps();
}

function preview(initialView='home',initialFocus=''){
 detail=null;
 recordParticipantId='';
 const modules=[
  ['week1','Week 1','Leadership Identity'],
  ['week1-test','Week 1 Test','10% weekly assessment'],
  ['week2','Week 2','Executive Presence'],
  ['week2-test','Week 2 Test','10% weekly assessment'],
  ['week3','Week 3','Speaking with Clarity'],
  ['week3-test','Week 3 Test','10% weekly assessment'],
  ['assessment','Assessment','Mid-Course Assessment'],
  ['week4','Week 4','Influence & Impact'],
  ['week4-test','Week 4 Test','10% weekly assessment'],
  ['week5','Week 5','Resilience & Self-Leadership'],
  ['week5-test','Week 5 Test','10% weekly assessment'],
  ['week6','Week 6','Leading Sustainable Change'],
  ['week6-test','Week 6 Test','10% weekly assessment']
 ];
 document.getElementById('devView').innerHTML=`
 <div class="section-title"><div><span class="kicker">Programme preview</span><h1>All-access developer view</h1></div><span class="pill">No participant attached</span></div>
 <div class="danger-note" style="margin-bottom:12px"><strong>Developer access:</strong> This preview ignores all learner progression, score and credential locks. Participant access rules remain unchanged.</div>
 <div class="tabs dev-module-jump">${modules.map(([view,label,title])=>`<button data-dev-view="${view}"><strong>${label}</strong> · ${title}</button>`).join('')}</div>
 <div class="preview-tools"><a href="/developer-preview.html" target="_blank">Open full programme ↗</a><button id="reloadPreview">Reload preview</button></div>
 <iframe class="preview-frame" id="previewFrame" src="${previewUrl(initialView,initialFocus)}" title="Executive Leadership Developer Preview"></iframe>`;
 document.getElementById('reloadPreview').onclick=()=>document.getElementById('previewFrame').contentWindow.location.reload();
 document.querySelectorAll('[data-dev-view]').forEach(b=>b.onclick=()=>{
   document.getElementById('previewFrame').src=previewUrl(b.dataset.devView);
 });
 document.getElementById('devStatus').textContent='Developer mode · programme preview · no participant attached';
}

function programmeView(){
 detail=null;
 recordParticipantId='';
 document.getElementById('devView').innerHTML=`
 <div class="section-title"><div><span class="kicker">Programme structure</span><h1>Executive Leadership Readiness Programme</h1><p class="muted">6 weeks · 1:1 coaching · real-world application · weekly testing</p></div><span class="pill">Developer only · all lessons visible</span></div>
 <section class="card programme-summary">
   <div><strong>Programme map</strong><span>Every week contains the same practical learning rhythm, with content tailored to the leadership capability being developed.</span></div>
   <div class="programme-sequence"><span>Watch</span><span>Learn</span><span>Build</span><span>Reflect</span><span>Coach</span><span>Apply</span><span>Check-in</span><span>Test</span></div>
 </section>
 <div class="programme-catalog">
   ${programmeCatalog.map((w,i)=>`
   <article class="programme-week-card" data-programme-week="${w.key}">
     <div class="programme-week-head">
       <div><span class="week-chip">${w.week}</span><h2>${esc(w.title)}</h2><p>${esc(w.video)}</p></div>
       <div class="week-statuses"><span class="pill">Unlocked</span>${w.videoUrl?'<span class="pill video-linked">Video linked</span>':''}</div>
     </div>
     <div class="lesson-list">
       ${lessonItems.map(([focus,label,copy])=>`
       <button type="button" class="lesson-row" data-open-week="${w.key}" data-focus="${focus}">
         <span class="lesson-num">${String(lessonItems.findIndex(x=>x[0]===focus)+1).padStart(2,'0')}</span>
         <span class="lesson-copy"><strong>${label}</strong><small>${focus==='watch'?esc(w.video):focus==='output'?esc(w.output):focus==='lab'?esc(w.lab):copy}</small></span>
         <span class="lesson-arrow">Open →</span>
       </button>`).join('')}
     </div>
     <div class="programme-week-actions">
       <button type="button" class="primary-dev-btn" data-open-week="${w.key}">Open full ${w.week}</button>
       <button type="button" data-open-week="${w.key}-test">Open weekly test</button>
       ${w.videoUrl?`<a href="${w.videoUrl}" target="_blank" rel="noopener">Open video ↗</a>`:''}
     </div>
   </article>`).join('')}
 </div>
 <section class="card assessment-map">
   <div><span class="week-chip assessment-chip">Mid-Course</span><h2>Leadership Assessment</h2><p>Weeks 1–3 tests contribute 30%; the assessment contributes 70%; 80% overall is required for the Week 4 credential.</p></div>
   <button type="button" class="primary-dev-btn" data-open-week="assessment">Open assessment →</button>
 </section>`;
 document.querySelectorAll('[data-open-week]').forEach(b=>b.onclick=()=>{
   const view=b.dataset.openWeek;
   const focus=b.dataset.focus||'';
   openPreview(view,focus);
 });
 document.getElementById('devStatus').textContent='Developer mode · full programme and lessons · no participant attached';
}

function results(){
 const body=detail?renderResultsDetail():'<div class="card empty">Choose a participant above to review their results.</div>';
 document.getElementById('devView').innerHTML=`<div class="section-title"><div><span class="kicker">Results</span><h1>Weekly marks & progression</h1></div></div>${participantRecordPicker('Participant selection applies only to this results view and never to Programme Preview.')}${body}`;
 bindRecordPicker();
}

function renderResultsDetail(){
 const tests=detail.weeklyTests||[];
 const progress=detail.progress||[];
 const p=selectedParticipant();
 return `<div class="card"><h2>${esc(p?.full_name||p?.email||'Participant')}</h2><p class="muted">${esc(p?.email||'')}</p></div>
 <div class="grid2"><section class="card"><h2>Weekly test results</h2>${tests.length?tests.map(t=>`<div class="score-row"><strong>${esc((t.milestoneKey||'').replace('week','Week '))}</strong><div class="score-bar"><i style="width:${Math.max(0,Math.min(100,Number(t.score||0)))}%"></i></div><span>${Number(t.score).toFixed(1)}%</span></div><div class="muted" style="margin:-5px 0 10px 172px">MCQ ${Number(t.mcq_score).toFixed(1)}/50 · Written ${Number(t.written_score).toFixed(1)}/50 · contribution ${Number(t.contribution).toFixed(1)}/10</div>`).join(''):'<div class="empty">No weekly tests submitted yet.</div>'}</section>
 <section class="card"><h2>Milestone status</h2>${progress.map(x=>`<div class="answer"><div class="q">${esc(x.milestoneTitle||x.milestoneKey)}</div><div class="a"><span class="pill ${x.status==='completed'?'':'dim'}">${esc(x.status)}</span> ${x.score!=null?' · score '+Number(x.score).toFixed(1)+'%':''}</div></div>`).join('')||'<div class="empty">No milestone progress yet.</div>'}</section></div>`;
}

function responses(){
 const body=detail?renderResponsesDetail():'<div class="card empty">Choose a participant above to review their reflections and outputs.</div>';
 document.getElementById('devView').innerHTML=`<div class="section-title"><div><span class="kicker">Learning evidence</span><h1>Reflections & executive outputs</h1></div></div>${participantRecordPicker()}${body}`;
 bindRecordPicker();
 if(detail)document.querySelectorAll('[data-week]').forEach(b=>b.onclick=()=>{week=b.dataset.week;responses()});
}
function renderResponsesDetail(){
 const s=state(),q=reflectionQuestions[week]||[];
 const outputEntries=Object.entries(tools()).filter(([k,v])=>k.startsWith(week+'-')&&String(v||'').trim());
 return `<div class="tabs">${Object.keys(reflectionQuestions).map(k=>`<button data-week="${k}" class="${k===week?'active':''}">${k.replace('week','Week ')}</button>`).join('')}</div>
 <div class="grid2"><section class="card"><h2>Reflections</h2>${q.map((x,i)=>answer(x,s.reflections?.[week+'-'+i])).join('')}</section><section class="card"><h2>Saved tools & outputs</h2>${outputEntries.length?outputEntries.map(([k,v])=>answer(k.replace(week+'-','').replaceAll('-',' '),v)).join(''):'<div class="empty">No saved output fields for this week yet.</div>'}</section></div>`;
}

function assessments(){
 const body=detail?renderAssessmentDetail():'<div class="card empty">Choose a participant above to review assessment attempts and access history.</div>';
 document.getElementById('devView').innerHTML=`<div class="section-title"><div><span class="kicker">Assessment control</span><h1>Assessment attempts & access credentials</h1></div></div>${participantRecordPicker()}${body}`;
 bindRecordPicker();
}
function renderAssessmentDetail(){
 const attempts=detail.assessmentAttempts||[],creds=detail.credentials||[],results=detail.assessmentResults||[];
 return `<div class="grid2"><section class="card"><h2>Assessment attempts</h2>${attempts.length?attempts.map(a=>`<div class="answer"><div class="q">Attempt ${a.attempt_number} · ${a.passed?'Passed':'Not passed'}</div><div class="a">Final assessment: ${Number(a.final_assessment_percent).toFixed(1)}% · weekly contribution: ${Number(a.weekly_weighted_score).toFixed(1)}/30 · overall: <strong>${Number(a.overall_score).toFixed(1)}%</strong><br>${new Date(a.submitted_at).toLocaleString()}</div></div>`).join(''):'<div class="empty">No assessment attempts yet.</div>'}</section>
 <section class="card"><h2>Access credentials</h2><p class="muted">Secret credential values and hashes are intentionally not exposed.</p>${creds.length?creds.map(c=>`<div class="answer"><div class="q">${esc(c.milestoneTitle||c.milestoneKey)} · ${esc(c.status)}</div><div class="a">Issued: ${new Date(c.issued_at).toLocaleString()}<br>Expires: ${new Date(c.expires_at).toLocaleString()}<br>Used: ${c.used_at?new Date(c.used_at).toLocaleString():'No'}<br>Email sent: ${c.email_sent_at?'Yes':'No'}${c.email_last_error?'<br>Email error: '+esc(c.email_last_error):''}</div></div>`).join(''):'<div class="empty">No credentials issued yet.</div>'}</section></div>
 ${results.length?'<section class="card"><h2>Saved assessment result records</h2><div class="codeish">'+esc(JSON.stringify(results,null,2))+'</div></section>':''}`;
}

function activity(){
 const body=detail?renderActivityDetail():'<div class="card empty">Choose a participant above to review their activity log.</div>';
 document.getElementById('devView').innerHTML=`<div class="section-title"><div><span class="kicker">Audit trail</span><h1>Participant activity</h1></div></div>${participantRecordPicker()}${body}`;
 bindRecordPicker();
}
function renderActivityDetail(){
 const logs=detail.audit||[];
 return `<section class="card"><div class="audit">${logs.length?logs.map(x=>`<div class="audit-item"><span>${new Date(x.created_at).toLocaleString()}</span><strong>${esc(x.event)}</strong><div><span class="muted">${esc(x.milestoneTitle||x.milestoneKey||'Programme')}</span><div class="codeish">${esc(JSON.stringify(x.metadata||{}))}</div></div></div>`).join(''):'<div class="empty">No activity logged yet.</div>'}</div></section>`;
}

function answer(q,a){const has=String(a??'').trim();return `<div class="answer"><div class="q">${esc(q)}</div><div class="a">${has?esc(a):'<span class="muted">No response yet.</span>'}</div></div>`}
function bindJumps(){document.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>setSection(b.dataset.jump))}
function setSection(s){
 section=s;
 if(['preview','programme'].includes(s)){detail=null;recordParticipantId=''}
 document.querySelectorAll('.dev-side [data-section]').forEach(b=>b.classList.toggle('active',b.dataset.section===s));
 render();
}
function render(){({dashboard,preview,programme:programmeView,results,responses,assessments,activity}[section]||dashboard)()}

async function boot(){
 const r=await fetch('/api/session',{cache:'no-store'});const s=await r.json();
 if(!s.authenticated||s.role!=='admin'){location.href='/?admin=1';return}
 await api();
}
document.querySelectorAll('.dev-side [data-section]').forEach(b=>b.onclick=()=>setSection(b.dataset.section));
document.getElementById('refreshBtn').onclick=()=>api().catch(showError);
document.getElementById('signOutBtn').onclick=async()=>{await fetch('/api/logout',{method:'POST'});location.href='/?admin=1'};
function showError(err){document.getElementById('devStatus').textContent=err.message;document.getElementById('devView').innerHTML='<div class="card empty">'+esc(err.message)+'</div>'}
boot().catch(showError);
})();