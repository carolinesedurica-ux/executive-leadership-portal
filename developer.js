(()=>{
const reflectionQuestions={
 week1:['What kind of leader do I want people to experience when they work with me?','Which leadership situations currently cause me to hesitate or second-guess myself?','What would I do differently if I trusted my leadership judgement more?'],
 week2:['When I feel evaluated or challenged at work, what changes in the way I speak, listen or behave?','Which habit most reduces my leadership presence?','If I focused less on how I was being judged and more on contributing effectively, what might I do differently?'],
 week3:['When I anticipate disagreement or confrontation, what do I normally do?','What conversation, boundary or disagreement am I currently avoiding because I am concerned about the other person’s reaction?','What is the cost if I continue avoiding it?'],
 week4:["Think about a recent situation where you needed someone else's support. What approach did you use to influence them, and how effective was it?","Who are the three stakeholders whose support would be most important to your success in a senior executive role, and what matters most to each of them?","When someone strongly disagrees with you, what is your instinctive reaction, and what executive behaviour would strengthen your response?"],
 week5:['What happens to your behaviour when you are under significant pressure?','Identify one situation that regularly triggers a strong emotional reaction in you as a leader. Why does it affect you?','What practice would most improve your ability to remain effective during demanding periods?'],
 week6:['What is one organisational change you believe you would need to lead if you stepped into a CEO or senior executive role today?','Why might people resist this change?','As an executive leader, I want people to experience me as someone who…']
};
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
let participants=[],detail=null,section='dashboard',participantId='',week='week4';

const state=()=>detail?.workspace?.elrp_state||{};
const tools=()=>state().tools||{};

async function api(){
 const suffix=participantId?'?participantId='+encodeURIComponent(participantId):'';
 const r=await fetch('/api/data?developer=1'+(selectedParticipantId?'&participantId='+encodeURIComponent(selectedParticipantId):''),{cache:'no-store'});
 const out=await r.json();
 if(!r.ok)throw new Error(out.error||'Unable to load developer data');
 participants=out.participants||[];
 detail=out.detail||null;
 if(!participantId&&participants[0]){participantId=participants[0].id;return api()}
 renderPicker();render();
 document.getElementById('devStatus').textContent='Administrator · live Supabase data · refreshed '+new Date(out.generatedAt).toLocaleTimeString();
}
function renderPicker(){
 const s=document.getElementById('participantSelect');
 s.innerHTML='<option value="">Select participant</option>'+participants.map(p=>`<option value="${esc(p.id)}" ${p.id===participantId?'selected':''}>${esc(p.full_name||p.email)} · ${esc(p.email)}</option>`).join('');
}
function participant(){return participants.find(p=>p.id===participantId)||null}
function stats(){
 const p=participant();
 const completed=p?.completedWeeks||0;
 const tests=detail?.weeklyTests||[];
 const avg=tests.length?tests.reduce((a,b)=>a+Number(b.score||0),0)/tests.length:0;
 const attempts=detail?.assessmentAttempts||[];
 const latest=attempts[attempts.length-1];
 return `<div class="stats">
 <div class="stat"><span>Participants</span><strong>${participants.length}</strong></div>
 <div class="stat"><span>Weeks completed</span><strong>${completed}/6</strong></div>
 <div class="stat"><span>Tests submitted</span><strong>${tests.length}/6</strong></div>
 <div class="stat"><span>Average test score</span><strong>${tests.length?avg.toFixed(1)+'%':'—'}</strong></div>
 <div class="stat"><span>Latest overall</span><strong>${latest?Number(latest.overall_score).toFixed(1)+'%':'—'}</strong></div>
 </div>`;
}
function dashboard(){
 const p=participant();
 const completed=(detail?.progress||[]).filter(x=>x.status==='completed');
 const current=(detail?.progress||[]).filter(x=>['unlocked','in_progress'].includes(x.status)).sort((a,b)=>(b.milestoneKey||'').localeCompare(a.milestoneKey||''))[0];
 document.getElementById('devView').innerHTML=`
 <section class="hero"><div><span class="kicker" style="color:#e2c98f">Development command centre</span><h1>Build, inspect and monitor the programme.</h1><p>Preview the complete learner portal without progression restrictions, then switch to real participant records to review learning evidence and results.</p></div><span class="badge">Non-destructive preview enabled</span></section>
 ${stats()}
 <div class="grid2">
  <section class="card"><h2>Selected participant</h2>${p?`<p><strong>${esc(p.full_name||p.email)}</strong><br><span class="muted">${esc(p.email)}</span></p><div class="answer"><div class="q">Current progression</div><div class="a">${esc(current?.milestoneTitle||'No active milestone')} · ${completed.length} milestones completed</div></div><div class="answer"><div class="q">First-half test contribution</div><div class="a">${Number(detail?.firstHalfWeighted||0).toFixed(1)} / 30</div></div><div class="answer"><div class="q">Second-half test contribution</div><div class="a">${Number(detail?.secondHalfWeighted||0).toFixed(1)} / 30</div></div>`:'<div class="empty">No participant selected.</div>'}</section>
  <section class="card"><h2>Developer shortcuts</h2><p class="muted">These links are for programme development and review.</p><div class="preview-tools"><button data-jump="preview">Open full preview</button><button data-jump="results">Review scores</button><button data-jump="responses">Read reflections</button></div><div class="danger-note">Participant records are read-only here. Use learner accounts for genuine submissions; use Developer Preview for inspection and testing.</div></section>
 </div>`;
 bindJumps();
}
function preview(){
 document.getElementById('devView').innerHTML=`<div class="section-title"><div><span class="kicker">Programme preview</span><h1>All-access learner view</h1></div><span class="pill">No participant writes</span></div><div class="preview-tools"><a href="/?developer=1" target="_blank">Open in new tab ↗</a><button id="reloadPreview">Reload preview</button></div><iframe class="preview-frame" id="previewFrame" src="/?developer=1" title="Executive Leadership Developer Preview"></iframe>`;
 document.getElementById('reloadPreview').onclick=()=>document.getElementById('previewFrame').contentWindow.location.reload();
}
function participantsView(){
 document.getElementById('devView').innerHTML=`<div class="section-title"><div><span class="kicker">Participants</span><h1>Enrolment & progression</h1></div></div><section class="card table-wrap"><table class="dev-table"><thead><tr><th>Participant</th><th>Enrolled</th><th>Weeks</th><th>Current</th><th>First-half</th><th>Second-half</th><th>Latest overall</th></tr></thead><tbody>${participants.map(p=>`<tr><td><strong>${esc(p.full_name||'—')}</strong><br><span class="muted">${esc(p.email)}</span></td><td>${p.enrollment?.enrolled_at?new Date(p.enrollment.enrolled_at).toLocaleDateString():'—'}</td><td>${p.completedWeeks}/6</td><td><span class="pill dim">${esc(p.currentMilestone||'—')}</span></td><td>${Number(p.firstHalfWeighted||0).toFixed(1)}/30</td><td>${Number(p.secondHalfWeighted||0).toFixed(1)}/30</td><td>${p.latestOverallScore!=null?Number(p.latestOverallScore).toFixed(1)+'%':'—'}</td></tr>`).join('')}</tbody></table></section>`;
}
function results(){
 if(!detail)return empty();
 const tests=detail.weeklyTests||[];
 const progress=detail.progress||[];
 document.getElementById('devView').innerHTML=`<div class="section-title"><div><span class="kicker">Results</span><h1>Weekly marks & progression</h1></div></div>${stats()}
 <div class="grid2"><section class="card"><h2>Weekly test results</h2>${tests.length?tests.map(t=>`<div class="score-row"><strong>${esc((t.milestoneKey||'').replace('week','Week '))}</strong><div class="score-bar"><i style="width:${Math.max(0,Math.min(100,Number(t.score||0)))}%"></i></div><span>${Number(t.score).toFixed(1)}%</span></div><div class="muted" style="margin:-5px 0 10px 172px">MCQ ${Number(t.mcq_score).toFixed(1)}/50 · Written ${Number(t.written_score).toFixed(1)}/50 · contribution ${Number(t.contribution).toFixed(1)}/10</div>`).join(''):'<div class="empty">No weekly tests submitted yet.</div>'}</section>
 <section class="card"><h2>Milestone status</h2>${progress.map(x=>`<div class="answer"><div class="q">${esc(x.milestoneTitle||x.milestoneKey)}</div><div class="a"><span class="pill ${x.status==='completed'?'':'dim'}">${esc(x.status)}</span> ${x.score!=null?' · score '+Number(x.score).toFixed(1)+'%':''}</div></div>`).join('')||'<div class="empty">No milestone progress yet.</div>'}</section></div>`;
}
function responses(){
 if(!detail)return empty();
 const s=state();const q=reflectionQuestions[week]||[];
 const outputEntries=Object.entries(tools()).filter(([k,v])=>k.startsWith(week+'-')&&String(v||'').trim());
 document.getElementById('devView').innerHTML=`<div class="section-title"><div><span class="kicker">Learning evidence</span><h1>Reflections & executive outputs</h1></div></div><div class="tabs">${Object.keys(reflectionQuestions).map(k=>`<button data-week="${k}" class="${k===week?'active':''}">${k.replace('week','Week ')}</button>`).join('')}</div>
 <div class="grid2"><section class="card"><h2>Reflections</h2>${q.map((x,i)=>answer(x,s.reflections?.[week+'-'+i])).join('')}</section><section class="card"><h2>Saved tools & outputs</h2>${outputEntries.length?outputEntries.map(([k,v])=>answer(k.replace(week+'-','').replaceAll('-',' '),v)).join(''):'<div class="empty">No saved output fields for this week yet.</div>'}</section></div>`;
 document.querySelectorAll('[data-week]').forEach(b=>b.onclick=()=>{week=b.dataset.week;responses()});
}
function assessments(){
 if(!detail)return empty();
 const attempts=detail.assessmentAttempts||[],creds=detail.credentials||[],results=detail.assessmentResults||[];
 document.getElementById('devView').innerHTML=`<div class="section-title"><div><span class="kicker">Assessment control</span><h1>Assessment attempts & access credentials</h1></div></div>
 <div class="grid2"><section class="card"><h2>Assessment attempts</h2>${attempts.length?attempts.map(a=>`<div class="answer"><div class="q">Attempt ${a.attempt_number} · ${a.passed?'Passed':'Not passed'}</div><div class="a">Final assessment: ${Number(a.final_assessment_percent).toFixed(1)}% · weekly contribution: ${Number(a.weekly_weighted_score).toFixed(1)}/30 · overall: <strong>${Number(a.overall_score).toFixed(1)}%</strong><br>${new Date(a.submitted_at).toLocaleString()}</div></div>`).join(''):'<div class="empty">No assessment attempts yet.</div>'}</section>
 <section class="card"><h2>Access credentials</h2><p class="muted">Secret credential values and hashes are intentionally not exposed.</p>${creds.length?creds.map(c=>`<div class="answer"><div class="q">${esc(c.milestoneTitle||c.milestoneKey)} · ${esc(c.status)}</div><div class="a">Issued: ${new Date(c.issued_at).toLocaleString()}<br>Expires: ${new Date(c.expires_at).toLocaleString()}<br>Used: ${c.used_at?new Date(c.used_at).toLocaleString():'No'}<br>Email sent: ${c.email_sent_at?'Yes':'No'}${c.email_last_error?'<br>Email error: '+esc(c.email_last_error):''}</div></div>`).join(''):'<div class="empty">No credentials issued yet.</div>'}</section></div>
 ${results.length?'<section class="card"><h2>Saved assessment result records</h2><div class="codeish">'+esc(JSON.stringify(results,null,2))+'</div></section>':''}`;
}
function activity(){
 if(!detail)return empty();
 const logs=detail.audit||[];
 document.getElementById('devView').innerHTML=`<div class="section-title"><div><span class="kicker">Audit trail</span><h1>Participant activity</h1></div></div><section class="card"><div class="audit">${logs.length?logs.map(x=>`<div class="audit-item"><span>${new Date(x.created_at).toLocaleString()}</span><strong>${esc(x.event)}</strong><div><span class="muted">${esc(x.milestoneTitle||x.milestoneKey||'Programme')}</span><div class="codeish">${esc(JSON.stringify(x.metadata||{}))}</div></div></div>`).join(''):'<div class="empty">No activity logged yet.</div>'}</div></section>`;
}
function answer(q,a){const has=String(a??'').trim();return `<div class="answer"><div class="q">${esc(q)}</div><div class="a">${has?esc(a):'<span class="muted">No response yet.</span>'}</div></div>`}
function empty(){document.getElementById('devView').innerHTML='<div class="card empty">Select a participant to review their record.</div>'}
function bindJumps(){document.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>setSection(b.dataset.jump))}
function setSection(s){section=s;document.querySelectorAll('.dev-side [data-section]').forEach(b=>b.classList.toggle('active',b.dataset.section===s));render()}
function render(){({dashboard,preview,participants:participantsView,results,responses,assessments,activity}[section]||dashboard)()}
async function boot(){
 const r=await fetch('/api/session',{cache:'no-store'});const s=await r.json();
 if(!s.authenticated||s.role!=='admin'){location.href='/?admin=1';return}
 await api();
}
document.querySelectorAll('.dev-side [data-section]').forEach(b=>b.onclick=()=>setSection(b.dataset.section));
document.getElementById('participantSelect').onchange=e=>{participantId=e.target.value;detail=null;api().catch(showError)};
document.getElementById('refreshBtn').onclick=()=>api().catch(showError);
document.getElementById('signOutBtn').onclick=async()=>{await fetch('/api/logout',{method:'POST'});location.href='/?admin=1'};
function showError(err){document.getElementById('devStatus').textContent=err.message;document.getElementById('devView').innerHTML='<div class="card empty">'+esc(err.message)+'</div>'}
boot().catch(showError);
})();