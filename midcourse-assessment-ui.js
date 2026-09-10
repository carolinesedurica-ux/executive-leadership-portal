(()=>{
if(window.ELRP_DEVELOPER_PREVIEW===true)return;
const cfg=window.ELRP_MIDCOURSE_ASSESSMENT;
if(!cfg)return;
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
let summary=null,lastResult=null,rendering=false;

function ensureCss(){
 if(document.querySelector('link[data-midcourse-css]'))return;
 const l=document.createElement('link');l.rel='stylesheet';l.href='midcourse-assessment.css?v=20260910-app1';l.dataset.midcourseCss='1';document.head.appendChild(l);
}
async function loadSummary(){
 try{const r=await fetch('/api/progress',{cache:'no-store'});const out=await r.json();if(r.ok)summary=out.summary||null;}catch{}
 render();
}
function groupQuestions(){
 const groups={};cfg.questions.forEach((q,i)=>{(groups[q.week]??=[]).push({...q,index:i})});return groups;
}
function currentAnswers(){
 const saved=summary?.assessmentReflection?.applicationAnswers;
 return Array.isArray(saved)&&saved.length===12?saved:null;
}
function questionHtml(q){
 const saved=currentAnswers();
 return `<article class="midcourse-question"><div class="midcourse-qmeta"><span>${esc(q.week)}</span><span>${esc(q.competency)}</span></div><strong>${q.index+1}. ${esc(q.prompt)}</strong><div class="midcourse-options">${q.options.map((opt,oi)=>`<label class="midcourse-option"><input type="radio" name="application-${q.index}" value="${oi}" ${saved?.[q.index]===oi?'checked':''} required><span>${esc(opt)}</span></label>`).join('')}</div></article>`;
}
function renderResult(out){
 const host=document.getElementById('midcourseResult');if(!host)return;
 const result=out||lastResult;
 if(!result){host.innerHTML='';return}
 const breakdown=result.breakdown||summary?.assessmentReflection?.applicationBreakdown||{};
 const appScore=Number(result.applicationScore??summary?.finalAssessmentPercent??0);
 const weekly=Number(result.weeklyWeightedScore??summary?.weeklyWeightedScore??0);
 const overall=Number(result.overallScore??summary?.overallScore??0);
 const passed=Boolean(result.passed??summary?.assessmentPassed);
 host.innerHTML=`<section class="midcourse-result"><span class="eyebrow">${passed?'Assessment passed':'Assessment result'}</span><h3>${passed?'You demonstrated the required mid-course standard.':'Review the indicated weeks before your next attempt.'}</h3><div class="midcourse-result-grid"><div><strong>${appScore.toFixed(1)}%</strong><span>Application assessment</span></div><div><strong>${weekly.toFixed(1)} / 30</strong><span>Weekly-test contribution</span></div><div><strong>${overall.toFixed(1)}%</strong><span>Overall stage mark</span></div></div><div class="midcourse-breakdown">${['week1','week2','week3'].map((k,i)=>`<span>Week ${i+1}: ${Number(breakdown[k]?.correct||0)}/${Number(breakdown[k]?.total||4)} scenarios</span>`).join('')}</div></section>`;
}
function render(){
 if(rendering)return;
 const section=document.getElementById('assessment'),form=document.getElementById('assessmentForm'),rows=document.getElementById('assessmentRows');
 if(!section||!form||!rows)return;
 if(rows.querySelector('#midcourseApplicationQuestions'))return;
 rendering=true;ensureCss();
 section.querySelector('.page-hero .eyebrow').textContent='70% application assessment · Up to 3 attempts';
 section.querySelector('.page-hero h1').textContent='Mid-Course Leadership Application Assessment';
 section.querySelector('.page-hero p').textContent='Apply what you learned in Weeks 1–3 to realistic executive situations. Your weekly tests contribute 30% and this application assessment contributes 70%. An overall mark of 80% is required to receive the Week 4 access credential.';
 form.dataset.midcourseApplication='1';
 const intro=form.querySelector('.assessment-intro');
 if(intro){intro.querySelector('h2').textContent='Demonstrate your leadership judgement';intro.querySelector('p').textContent='Choose the strongest leadership response in each scenario. Correct answers are scored securely on the server and are not shown after submission.';}
 const weekly=Number(summary?.weeklyWeightedScore||0),remaining=Number(summary?.assessmentAttemptsRemaining??3),attempts=Number(summary?.assessmentAttemptCount||0);
 const groups=groupQuestions();
 rows.innerHTML=`<div id="midcourseApplicationQuestions" class="midcourse-application"><div class="midcourse-overview"><div><strong>${weekly.toFixed(1)} / 30</strong><span>Saved weekly-test contribution</span></div><div><strong>70%</strong><span>Application assessment weighting</span></div><div><strong>80%</strong><span>Overall pass mark</span></div></div><div class="midcourse-instructions"><strong>Assessment standard:</strong> 12 scenario questions test judgement and application across Leadership Identity & Confidence, Executive Presence & Personal Authority, and Assertiveness & Difficult Conversations. The three written reflections are required evidence but do not add marks.</div>${Object.entries(groups).map(([wk,qs])=>`<section class="midcourse-section"><div class="midcourse-section-head"><div><span>${esc(wk)}</span><h3>${wk==='Week 1'?'Leadership Identity & Confidence':wk==='Week 2'?'Executive Presence & Personal Authority':'Assertiveness & Difficult Conversations'}</h3></div><small>4 application scenarios</small></div>${qs.map(questionHtml).join('')}</section>`).join('')}</div>`;
 const ref=form.querySelector('.reflection-block');
 if(ref){ref.innerHTML=`<h2>Evidence of change</h2><p class="midcourse-ungraded">Required coaching evidence · not included in the 70% assessment score</p><div class="midcourse-evidence">${cfg.reflections.map(r=>`<label><strong>${esc(r.label)}</strong><small>${esc(r.prompt)}</small><textarea name="${esc(r.name)}" required>${esc(summary?.assessmentReflection?.[r.name]||'')}</textarea></label>`).join('')}</div>`;}
 let resultHost=document.getElementById('midcourseResult');if(!resultHost){resultHost=document.createElement('div');resultHost.id='midcourseResult';form.appendChild(resultHost);}
 const submit=form.querySelector('[type="submit"]');
 if(submit){
   if(summary?.assessmentComplete){submit.disabled=true;submit.textContent='✓ Assessment passed'}
   else if(remaining<=0){submit.disabled=true;submit.textContent='All 3 assessment attempts used'}
   else{submit.disabled=false;submit.textContent=`Submit application assessment · attempt ${attempts+1} of 3 →`}
 }
 const oldResults=document.getElementById('assessmentResults');if(oldResults)oldResults.classList.add('hidden');
 if(lastResult||summary?.assessmentComplete)renderResult(lastResult);
 rendering=false;
}

async function submit(e){
 if(e.target?.id!=='assessmentForm')return;
 e.preventDefault();e.stopImmediatePropagation();
 const form=e.target,msg=document.getElementById('assessmentMessage');
 const answers=cfg.questions.map((_,i)=>{const el=form.querySelector(`input[name="application-${i}"]:checked`);return el?Number(el.value):null});
 if(answers.some(v=>v===null)){msg.textContent='Answer all 12 application scenarios before submitting.';return}
 const reflections={};for(const r of cfg.reflections){const value=String(form.elements[r.name]?.value||'').trim();if(!value){msg.textContent='Complete all three evidence reflections before submitting.';return}reflections[r.name]=value;}
 const btn=form.querySelector('[type="submit"]');btn.disabled=true;btn.textContent='Scoring application assessment…';msg.textContent='';
 try{
   const response=await fetch('/api/assessment/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({answers,reflections})});
   const out=await response.json();if(!response.ok)throw new Error(out.error||'Unable to submit assessment');
   lastResult=out;summary=out.summary||summary;
   document.dispatchEvent(new CustomEvent('wrv:progress-authoritative',{detail:out.summary}));
   setTimeout(()=>{rendering=false;const rows=document.getElementById('assessmentRows');if(rows)rows.innerHTML='';render();renderResult(out);},40);
   if(out.passed){msg.textContent=`Passed: ${Number(out.overallScore).toFixed(1)}% overall. Your Week 4 access credential has been issued and sent by email.`;}
   else{msg.textContent=`Attempt ${out.attemptNumber} recorded: ${Number(out.overallScore).toFixed(1)}% overall. ${out.attemptsRemaining} attempt${out.attemptsRemaining===1?'':'s'} remaining.`;}
 }catch(err){msg.textContent=err.message||'Assessment could not be submitted.';btn.disabled=false;btn.textContent='Submit application assessment →';}
}

document.addEventListener('submit',submit,true);
document.addEventListener('wrv:progress-authoritative',e=>{summary=e.detail||summary;setTimeout(()=>{const rows=document.getElementById('assessmentRows');if(rows&&!rows.querySelector('#midcourseApplicationQuestions'))render();},0)});
let t;new MutationObserver(()=>{clearTimeout(t);t=setTimeout(()=>{const rows=document.getElementById('assessmentRows');if(rows&&!rows.querySelector('#midcourseApplicationQuestions'))render();},35)}).observe(document.body,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{render();loadSummary()});else{render();loadSummary()}
})();
