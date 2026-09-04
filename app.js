const programme = {
  week1: {
    title: 'Week 1 — Leadership Identity & Confidence',
    subtitle: 'Think Like a Leader Before You Have the Title',
    intro: 'Leadership begins before the title. This week focuses on understanding who you are as a leader, recognising the strengths you already bring, and identifying the situations that cause you to hesitate or second-guess yourself.',
    reflections: [
      'What kind of leader do I want people to experience when they work with me?',
      'Which leadership situations currently cause me to hesitate or second-guess myself?',
      'What would I do differently if I trusted my leadership judgement more?'
    ],
    challenge: 'Choose one real workplace situation where you would normally hesitate, hold back or over-explain. Before it happens, ask: “What does this situation need from me as a leader?” Then deliberately practise one leadership behaviour.'
  },
  week2: {
    title: 'Week 2 — Executive Presence & Personal Authority',
    subtitle: 'Your Presence Speaks Before You Do',
    intro: 'Leadership presence is not about being the loudest person in the room. It is the combination of composure, clarity, communication and personal authority that shapes how others experience your leadership.',
    reflections: [
      'When I feel evaluated or challenged at work, what changes in the way I speak, listen or behave?',
      'Which habit most reduces my leadership presence — rushing, becoming quiet, over-explaining, avoiding disagreement, filling silence, or something else?',
      'If I focused less on how I was being judged and more on contributing effectively, what might I do differently?'
    ],
    challenge: 'At your next important meeting or conversation, choose one presence behaviour to practise: pause before answering, slow your pace, state your recommendation first, maintain comfortable eye contact, or remove unnecessary detail.'
  },
  week3: {
    title: 'Week 3 — Assertiveness & Difficult Conversations',
    subtitle: 'Speak Clearly When the Conversation Is Difficult',
    intro: 'Leadership sometimes requires saying what needs to be said even when the conversation may be uncomfortable. Assertiveness allows you to communicate clearly while maintaining respect and preserving dignity.',
    reflections: [
      'When I anticipate disagreement or confrontation, what do I normally do?',
      'What conversation, boundary or disagreement am I currently avoiding because I am concerned about the other person’s reaction?',
      'What is the cost — to me, the other person, the team or the organisation — if I continue avoiding it?'
    ],
    challenge: 'Use the CLEAR framework in one real workplace conversation: Clarify the issue, Listen, Explain your position, Agree the action, Review and follow through.'
  }
};

const assessmentDimensions = [
  'Confidence in my leadership capability',
  'Trust in my judgement',
  'Leadership presence in meetings',
  'Remaining composed when challenged',
  'Communicating clearly and concisely',
  'Speaking confidently with senior colleagues',
  'Assertiveness',
  'Expressing disagreement respectfully',
  'Having difficult conversations',
  'Setting boundaries and saying no',
  'Handling another person’s defensiveness',
  'Speaking without unnecessary over-explanation'
];

const baselineDefaults = [5,5,5,5,5,5,5,5,5,5,5,5];
const state = JSON.parse(localStorage.getItem('elrpState') || '{}');
state.completed = state.completed || [];
state.reflections = state.reflections || {};
state.baseline = state.baseline || baselineDefaults;
state.assessmentComplete = !!state.assessmentComplete;

function saveState(){ localStorage.setItem('elrpState', JSON.stringify(state)); updateProgress(); }

function renderWeeks(){
  Object.entries(programme).forEach(([key, w]) => {
    const el = document.getElementById(key);
    el.innerHTML = `
      <div class="page-hero compact"><span class="eyebrow">${key.replace('week','Week ')}</span><h1>${w.title.replace(/^Week \d — /,'')}</h1><p>${w.intro}</p></div>
      <div class="week-layout">
        <div class="week-main">
          <article class="card step-card">
            <span class="eyebrow dark">01 · Watch</span><h2>${w.subtitle}</h2>
            <div class="video-placeholder">
              <div><div class="play">▶</div><h3>Explainer video coming here</h3><small>Upload your NotebookLM video and replace this placeholder with its embed link.</small></div>
            </div>
          </article>
          <article class="card step-card">
            <span class="eyebrow dark">02 · Reflect</span><h2>Take 5–10 minutes before your live session</h2>
            <div class="reflection-list">
              ${w.reflections.map((q,i)=>`<label>${i+1}. ${q}<textarea data-reflection="${key}-${i}">${state.reflections[`${key}-${i}`]||''}</textarea></label>`).join('')}
            </div>
          </article>
          <article class="card step-card challenge"><span class="eyebrow dark">04 · Apply</span><h2>Your leadership challenge</h2><p>${w.challenge}</p></article>
        </div>
        <aside class="week-side">
          <div class="card"><span class="eyebrow dark">03 · Live coaching</span><h3>Bring a real situation</h3><p>Your live session will use your reflections and an actual leadership situation from your work. Come ready for a conversation, not a performance.</p></div>
          <div class="card"><span class="eyebrow dark">05 · Check in</span><h3>End-of-week reflection</h3><div class="checklist"><label><input type="checkbox" data-check="${key}-watch"> I watched the explainer</label><label><input type="checkbox" data-check="${key}-reflect"> I completed my reflection</label><label><input type="checkbox" data-check="${key}-coach"> I attended live coaching</label><label><input type="checkbox" data-check="${key}-apply"> I completed the workplace challenge</label></div><button class="btn btn-primary complete-week" data-week="${key}">${state.completed.includes(key)?'✓ Week completed':'Mark week complete'}</button></div>
        </aside>
      </div>`;
  });
}

function renderAssessment(){
  const rows = document.getElementById('assessmentRows');
  rows.innerHTML = assessmentDimensions.map((d,i)=>`
    <div class="assessment-row"><label for="score-${i}">${d}</label><div class="score-control"><input id="score-${i}" type="range" min="1" max="10" value="${state.midScores?.[i] || 5}" required><span class="score-badge" id="badge-${i}">${state.midScores?.[i] || 5}</span></div></div>`).join('');
  assessmentDimensions.forEach((_,i)=>document.getElementById(`score-${i}`).addEventListener('input',e=>document.getElementById(`badge-${i}`).textContent=e.target.value));
}

function renderWeek4(){
  const el = document.getElementById('week4');
  if(!state.assessmentComplete){
    el.innerHTML = `<div class="page-hero compact"><span class="eyebrow">Week 4</span><h1>Leading People with Confidence</h1><p>From personal leadership to people leadership.</p></div><div class="card locked-preview"><h2>🔒 Complete your progress review first</h2><p>The first three weeks strengthened how you show up as a leader. Week 4 shifts toward leading others effectively.</p><ul><li>Set expectations clearly.</li><li>Delegate without micromanaging.</li><li>Hold people accountable.</li><li>Address underperformance constructively.</li><li>Adapt to different personalities without becoming inconsistent.</li><li>Balance empathy with accountability.</li><li>Build trust while maintaining leadership boundaries.</li></ul><p><strong>Your Week 4 challenge preview:</strong> bring one real people-management situation to live coaching and ask: “What does this person need from me — and what does the situation require from me as their leader?”</p><button class="btn btn-gold" data-go="assessment">Complete mid-course assessment →</button></div>`;
  } else {
    el.innerHTML = `<div class="page-hero compact"><span class="eyebrow">Week 4</span><h1>Leading People with Confidence</h1><p>Your next phase is unlocked.</p></div><div class="status-banner">✓ Mid-Course Assessment complete. Week 4 is now available.</div><div class="card coming-soon"><h2>Module content is being added</h2><p>Your personalised Week 4 content will appear here next.</p></div>`;
  }
  attachGoButtons();
}

function renderComingSoon(id,title,copy){
  document.getElementById(id).innerHTML = `<div class="page-hero compact"><span class="eyebrow">Coming next</span><h1>${title}</h1><p>${copy}</p></div><div class="card coming-soon"><h2>Next-stage content is in development</h2><p>This module will be added as your programme continues.</p></div>`;
}

function showView(id){
  if(id === 'week4' && !state.assessmentComplete){ /* preview is allowed */ }
  if((id === 'week5' || id === 'week6')) { /* visible preview only */ }
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
  document.querySelectorAll('.nav-link').forEach(n=>n.classList.toggle('active', n.dataset.view===id));
  window.scrollTo({top:0,behavior:'smooth'});
  document.getElementById('sidebar').classList.remove('open');
}

function attachGoButtons(){ document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>showView(b.dataset.go)); }

function updateProgress(){
  const completedWeeks = state.completed.filter(x=>['week1','week2','week3'].includes(x)).length;
  const units = completedWeeks + (state.assessmentComplete ? 1 : 0);
  const percent = Math.round((units/7)*100);
  const deg = percent * 3.6;
  const ring = document.getElementById('progressRing');
  if(ring) ring.style.background = `conic-gradient(var(--green) ${deg}deg,#e3e9ee ${deg}deg)`;
  if(document.getElementById('progressPercent')) document.getElementById('progressPercent').textContent=`${percent}%`;
  if(document.getElementById('progressBar')) document.getElementById('progressBar').style.width=`${percent}%`;
  if(document.getElementById('progressText')) document.getElementById('progressText').textContent = state.assessmentComplete ? 'Mid-course assessment complete. Week 4 is unlocked.' : `${completedWeeks} of 3 first-half modules completed.`;
  const nav = document.getElementById('week4Nav');
  if(nav){ nav.classList.toggle('locked',!state.assessmentComplete); nav.firstChild.textContent = state.assessmentComplete ? '✓ ' : '🔒 '; }
  if(document.getElementById('week4Status')) document.getElementById('week4Status').textContent = state.assessmentComplete ? 'Unlocked.' : 'Complete the assessment to unlock.';
}

function setupEvents(){
  document.querySelectorAll('.nav-link').forEach(n=>n.addEventListener('click',()=>{
    if(n.dataset.view==='week5'||n.dataset.view==='week6') return showView(n.dataset.view);
    showView(n.dataset.view);
  }));
  document.getElementById('menuBtn').addEventListener('click',()=>document.getElementById('sidebar').classList.toggle('open'));
  document.addEventListener('input',e=>{
    if(e.target.matches('[data-reflection]')){ state.reflections[e.target.dataset.reflection]=e.target.value; saveState(); }
  });
  document.addEventListener('change',e=>{
    if(e.target.matches('[data-check]')){ state[e.target.dataset.check]=e.target.checked; saveState(); }
  });
  document.addEventListener('click',e=>{
    const btn=e.target.closest('.complete-week'); if(!btn) return;
    if(!state.completed.includes(btn.dataset.week)) state.completed.push(btn.dataset.week);
    btn.textContent='✓ Week completed'; saveState();
  });
  document.getElementById('assessmentForm').addEventListener('submit',e=>{
    e.preventDefault();
    if(!state.completed.includes('week3')){
      document.getElementById('assessmentMessage').textContent='Complete Week 3 before submitting the mandatory mid-course assessment.';
      return;
    }
    const scores=assessmentDimensions.map((_,i)=>Number(document.getElementById(`score-${i}`).value));
    state.midScores=scores;
    state.assessmentComplete=true;
    state.assessmentReflection={
      greatestImprovement:e.target.greatestImprovement.value,
      evidenceSituation:e.target.evidenceSituation.value,
      remainingChallenge:e.target.remainingChallenge.value
    };
    saveState(); renderAssessmentResults(); renderWeek4();
    document.getElementById('assessmentMessage').textContent='Assessment submitted successfully. Week 4 is now unlocked.';
  });
}

function renderAssessmentResults(){
  if(!state.assessmentComplete || !state.midScores) return;
  const result=document.getElementById('assessmentResults'); result.classList.remove('hidden');
  const avg=state.midScores.reduce((a,b)=>a+b,0)/state.midScores.length;
  const base=state.baseline.reduce((a,b)=>a+b,0)/state.baseline.length;
  document.getElementById('averageScore').textContent=`${avg.toFixed(1)} / 10`;
  const movement=avg-base; document.getElementById('scoreMovement').textContent=`${movement>=0?'+':''}${movement.toFixed(1)}`;
  const priorities=assessmentDimensions.map((d,i)=>({d,s:state.midScores[i]})).sort((a,b)=>a.s-b.s).slice(0,3);
  document.getElementById('priorityList').innerHTML=priorities.map(p=>`<div class="priority-item"><span>${p.d}</span><strong>${p.s}/10</strong></div>`).join('');
}

renderWeeks();
renderAssessment();
renderWeek4();
renderComingSoon('week5','Workplace Dynamics, Influence & Executive Communication','Navigate organisational dynamics ethically, understand stakeholder interests and communicate strategically.');
renderComingSoon('week6','Leadership Integration & Personal Action Plan','Bring the programme together into a practical leadership approach and forward action plan.');
attachGoButtons();
setupEvents();
renderAssessmentResults();
updateProgress();
