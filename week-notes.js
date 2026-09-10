(()=>{
const prompts={
 week1:{title:'Working Notes · Leadership Identity',prompt:'Capture the leadership qualities, evidence, examples or questions that stand out as you work through Week 1.',cue:'What do I want to remember or discuss in coaching about the leader I am becoming?'},
 week2:{title:'Working Notes · Executive Presence',prompt:'Note what you observe about your pace, message structure, composure and personal authority.',cue:'Where do I most need to simplify, slow down or become more deliberate?'},
 week3:{title:'Working Notes · Difficult Conversations',prompt:'Capture the facts, boundaries, reactions and wording you may need for a real difficult conversation.',cue:'What do I need to say clearly without becoming passive, defensive or aggressive?'},
 week4:{title:'Working Notes · Influence & Impact',prompt:'Record stakeholder priorities, possible resistance, useful evidence and the language that may create genuine buy-in.',cue:'Whose support do I need, what matters to them, and what would make my recommendation easier to act on?'},
 week5:{title:'Working Notes · Resilience & Self-Leadership',prompt:'Notice pressure triggers, emotional reactions, warning signs and the regulation practices that help you stay capable of leadership.',cue:'What happens to my leadership under pressure, and what response do I want to choose instead?'},
 week6:{title:'Working Notes · Leading Sustainable Change',prompt:'Capture the current reality, desired change, stakeholder reactions, ownership, measures and leadership behaviours required.',cue:'What must become visibly different because I led this change well?'}
};
function stateKey(){return window.ELRP_DEVELOPER_PREVIEW===true?'elrpDeveloperPreviewState':'elrpState'}
function readState(){try{return JSON.parse(localStorage.getItem(stateKey())||'{}')}catch{return {}}}
function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function enhanceWeek(key){
 const root=document.getElementById(key),cfg=prompts[key];
 if(!root||!cfg||root.querySelector('.week-working-notes'))return;
 const main=root.querySelector('.week-main');
 if(!main)return;
 const reflectionHost=main.querySelector('.reflection-list')?.closest('.step-card')||main.querySelector('.reflection-card-shell');
 if(!reflectionHost)return;
 const state=readState();
 const saved=state.tools?.[`${key}-working-notes`]||'';
 const card=document.createElement('article');
 card.className='card step-card week-working-notes';
 card.innerHTML=`<div class="working-notes-head"><div><span class="eyebrow dark">Working Notes</span><h2>${esc(cfg.title)}</h2><p>${esc(cfg.prompt)}</p></div><span class="working-notes-status">Autosaves as you type</span></div><div class="working-notes-cue"><strong>Working prompt</strong><span>${esc(cfg.cue)}</span></div><label class="working-notes-field"><span>Your notes</span><textarea data-toolfield="${key}-working-notes" maxlength="2500" placeholder="Capture key ideas, examples, questions or coaching notes here…">${esc(saved)}</textarea><small><span data-note-count>0</span>/2500 characters · Bring these notes into your live coaching session.</small></label>`;
 reflectionHost.before(card);
 const ta=card.querySelector('textarea'),count=card.querySelector('[data-note-count]'),status=card.querySelector('.working-notes-status');
 const update=()=>{count.textContent=String(ta.value.length);status.textContent=ta.value.trim()?'✓ Notes saved':'Autosaves as you type'};
 ta.addEventListener('input',update); update();
}
function enhanceAll(){Object.keys(prompts).forEach(enhanceWeek)}
let timer;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(enhanceAll,60)}).observe(document.body,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhanceAll);else enhanceAll();
})();

(()=>{
if(window.ELRP_DEVELOPER_PREVIEW===true)return;
function load(src,done){
 if(document.querySelector(`script[src^="${src.split('?')[0]}"]`)){done?.();return}
 const s=document.createElement('script');s.src=src;s.onload=()=>done?.();document.body.appendChild(s);
}
load('midcourse-assessment-config.js?v=20260910-app1',()=>load('midcourse-assessment-ui.js?v=20260910-app1'));
})();
