(()=>{
const priorities=[
 {key:'selfEsteem',label:'Self-esteem',copy:'Recognising your value, contribution and capability without depending on constant external reassurance.'},
 {key:'confidence',label:'Confidence',copy:'Trusting your judgement, speaking up and acting despite uncertainty or evaluation.'},
 {key:'assertiveness',label:'Assertiveness',copy:'Expressing needs, boundaries and disagreement clearly while maintaining respect.'},
 {key:'communication',label:'Communication',copy:'Making your message clear, concise, purposeful and easy for others to act on.'},
 {key:'presentation',label:'Presentation skills',copy:'Speaking with structure, composure, credibility and audience awareness in higher-stakes settings.'}
];
function read(){try{return JSON.parse(localStorage.getItem('elrpPriorityFocus')||'{}')}catch{return {}}}
function save(s){localStorage.setItem('elrpPriorityFocus',JSON.stringify(s))}
function injectHome(){
 const home=document.getElementById('home'); if(!home||home.querySelector('.priority-focus-card'))return;
 const benefits=home.querySelector('.benefits'); if(!benefits)return;
 const card=document.createElement('section'); card.className='card priority-focus-card';
 card.innerHTML=`<div class="priority-focus-head"><div><span class="eyebrow dark">Your priority development areas</span><h2>Five capabilities we will keep in focus throughout the programme</h2><p>These are not one-off topics. They are recurring development threads built into weekly reflection, daily practice, coaching and progress reviews.</p></div><div class="priority-focus-mark">5</div></div><div class="priority-pill-grid">${priorities.map(p=>`<div class="priority-pill"><strong>${p.label}</strong><span>${p.copy}</span></div>`).join('')}</div>`;
 benefits.parentNode.insertBefore(card,benefits);
}
function injectAssessment(){
 const form=document.getElementById('assessmentForm'); if(!form||form.querySelector('.priority-checkin'))return;
 const intro=form.querySelector('.assessment-intro'); if(!intro)return;
 const s=read();
 const wrap=document.createElement('section'); wrap.className='priority-checkin';
 wrap.innerHTML=`<div class="priority-checkin-head"><div><span class="eyebrow dark">Priority concern check-in</span><h2>How are these five development areas shifting?</h2><p>Rate where you are now. This gives your coach a focused snapshot alongside the broader leadership assessment.</p></div><span class="priority-equal-weight">Equal priority</span></div><div class="priority-rating-grid">${priorities.map(p=>`<label class="priority-rating"><div><strong>${p.label}</strong><small>${p.copy}</small></div><div class="priority-rating-control"><input type="range" min="1" max="10" value="${s[p.key]||5}" data-priority="${p.key}"><span>${s[p.key]||5}/10</span></div></label>`).join('')}</div><p class="priority-note">All five areas carry equal weight. Your live coaching can still spend more time on whichever area is most relevant in a particular week.</p>`;
 intro.insertAdjacentElement('afterend',wrap);
 wrap.querySelectorAll('[data-priority]').forEach(input=>input.addEventListener('input',e=>{const v=read();v[e.target.dataset.priority]=Number(e.target.value);save(v);e.target.nextElementSibling.textContent=`${e.target.value}/10`;}));
}
function enhance(){injectHome();injectAssessment()}
let timer;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(enhance,50)}).observe(document.body,{childList:true,subtree:true});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance);else enhance();
})();