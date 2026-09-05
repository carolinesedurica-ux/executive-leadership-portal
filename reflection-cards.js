(()=>{
const cues={
 week1:[
  'Think about the qualities you want colleagues to experience consistently when they work with you.',
  'Notice the situations, people or pressures that most often trigger hesitation or second-guessing.',
  'Imagine the same situation with greater self-trust. What would change in your behaviour or decision-making?'
 ],
 week2:[
  'Pay attention to what happens in your body, thoughts and speech when your credibility feels tested.',
  'Shift from proving yourself to contributing. What would useful, grounded leadership look like here?',
  'Choose one small behaviour you can practise in a real meeting: pause, slow down, structure your point or use fewer words.'
 ],
 week3:[
  'Identify your usual pattern when disagreement feels uncomfortable: avoid, soften, over-explain, defend or push harder.',
  'Name the real conversation or boundary you have been postponing because of the other person’s possible reaction.',
  'Consider the cost of continued avoidance for you, the relationship, the team and the organisation.'
 ]
};

function getState(){try{return JSON.parse(localStorage.getItem('elrpState')||'{}')}catch{return {}}}
function esc(s=''){return s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function snippet(v){const t=v.trim().replace(/\s+/g,' ');return t.length>120?t.slice(0,117)+'…':t}
function isComplete(v){return v.trim().length>=20}

function enhanceWeek(week){
 const root=document.getElementById(week); if(!root)return;
 const list=root.querySelector('.reflection-list'); if(!list||list.dataset.cardified==='1')return;
 const host=list.closest('.step-card'); if(!host)return;
 const labels=[...list.querySelectorAll(':scope > label')]; if(!labels.length)return;
 list.dataset.cardified='1'; host.classList.add('reflection-card-shell');
 const title=host.querySelector('h2'); if(title)title.textContent='Reflect one question at a time';
 const eyebrow=host.querySelector('.eyebrow');
 if(eyebrow)eyebrow.textContent='02 · Reflect';
 const header=document.createElement('div'); header.className='reflection-card-header';
 header.innerHTML=`<div><h2>Reflect one question at a time</h2><p class="tool-copy">Take a few focused minutes. Your responses save automatically to your secure online coaching profile.</p></div><div class="reflection-progress"><span>Reflection progress</span><div class="reflection-progress-bar"><span></span></div></div>`;
 if(title)title.replaceWith(header); else host.prepend(header);
 const stage=document.createElement('div'); stage.className='reflection-card-stage';
 const cards=[];
 labels.forEach((label,i)=>{
   const textarea=label.querySelector('textarea'); if(!textarea)return;
   const raw=[...label.childNodes].filter(n=>n!==textarea).map(n=>n.textContent).join(' ').trim().replace(/^\d+\.\s*/,'');
   const card=document.createElement('section'); card.className='reflection-card'; card.dataset.index=String(i);
   card.innerHTML=`<div class="reflection-card-number">${i+1}</div><div class="reflection-question">${esc(raw)}</div><div class="reflection-cue">${esc((cues[week]||[])[i]||'Write what is most true for you right now. Keep it practical and specific.')}</div>`;
   textarea.remove(); textarea.maxLength=1000; textarea.placeholder='Take a few moments to reflect and write your thoughts here…'; card.appendChild(textarea); const count=document.createElement('span');count.className='reflection-char-count';count.textContent=`${textarea.value.length}/1000`;card.appendChild(count);
   const state=document.createElement('div'); state.className='reflection-save-state';
   state.innerHTML='<span>Autosaves as you type</span><strong></strong>'; card.appendChild(state);
   stage.appendChild(card); cards.push(card);
 });
 list.replaceWith(stage);
 const nav=document.createElement('div'); nav.className='reflection-nav-row';
 nav.innerHTML=`<button type="button" class="reflection-nav-btn prev">← Previous</button><div class="reflection-dots"></div><button type="button" class="reflection-nav-btn next">Next →</button>`;
 host.appendChild(nav);
 const summary=document.createElement('aside'); summary.className='reflection-summary';
 summary.innerHTML=`<div class="reflection-summary-head"><strong>What I’m noticing</strong><span>Reflection snapshot</span></div><div class="reflection-summary-list"></div>`; host.appendChild(summary);
 let active=0;
 const dots=nav.querySelector('.reflection-dots');
 cards.forEach((_,i)=>{const b=document.createElement('button');b.type='button';b.className='reflection-dot';b.setAttribute('aria-label',`Reflection ${i+1}`);b.addEventListener('click',()=>{active=i;render()});dots.appendChild(b)});
 function render(){
   const state=getState();
   cards.forEach((card,i)=>{const ta=card.querySelector('textarea'); const val=ta?.value||state.reflections?.[`${week}-${i}`]||''; if(ta&&ta.value!==val)ta.value=val; const done=isComplete(val); card.classList.toggle('active',i===active);card.classList.toggle('complete',done); const counter=card.querySelector('.reflection-char-count');if(counter)counter.textContent=`${val.length}/1000`; const save=card.querySelector('.reflection-save-state strong'); if(save)save.textContent=done?'✓ Reflection captured':val.trim()?'Saving…':''; const dot=dots.children[i]; if(dot){dot.classList.toggle('active',i===active);dot.classList.toggle('complete',done)}});
   nav.querySelector('.prev').disabled=active===0; nav.querySelector('.next').textContent=active===cards.length-1?'Review reflections ✓':'Next →';
   const completed=cards.filter(c=>isComplete(c.querySelector('textarea')?.value||'')).length;
   const bar=header.querySelector('.reflection-progress-bar span'); if(bar)bar.style.width=`${Math.round(completed/cards.length*100)}%`;
   const p=header.querySelector('.reflection-progress > span'); if(p)p.textContent=`${completed} of ${cards.length} reflections captured`;
   const sum=summary.querySelector('.reflection-summary-list'); const items=cards.map((c,i)=>{const v=c.querySelector('textarea')?.value||'';return v.trim()?`<div class="reflection-summary-item"><strong>${i+1}.</strong> ${esc(snippet(v))}</div>`:''}).filter(Boolean);sum.innerHTML=items.join('')||'<div class="reflection-summary-item empty">Your key thoughts will appear here as you reflect.</div>';
 }
 nav.querySelector('.prev').addEventListener('click',()=>{if(active>0){active--;render();cards[active].scrollIntoView({behavior:'smooth',block:'center'})}});
 nav.querySelector('.next').addEventListener('click',()=>{if(active<cards.length-1){active++;render();cards[active].scrollIntoView({behavior:'smooth',block:'center'})}else{summary.scrollIntoView({behavior:'smooth',block:'center'})}});
 cards.forEach(card=>card.querySelector('textarea')?.addEventListener('input',()=>{render()}));
 render();
}
function enhanceAll(){['week1','week2','week3'].forEach(enhanceWeek)}
let timer; const observer=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(enhanceAll,40)}); observer.observe(document.body,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhanceAll);else enhanceAll();
})();