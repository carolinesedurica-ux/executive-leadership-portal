(()=>{
const prompts={
 week1:{title:'Working Notes · Leadership Identity',prompt:'Capture the leadership qualities, evidence, examples or questions that stand out as you work through Week 1.',cue:'What do I want to remember or discuss in coaching about the leader I am becoming?'},
 week2:{title:'Working Notes · Executive Presence',prompt:'Note what you observe about your pace, message structure, composure and personal authority.',cue:'Where do I most need to simplify, slow down or become more deliberate?'},
 week3:{title:'Working Notes · Difficult Conversations',prompt:'Capture the facts, boundaries, reactions and wording you may need for a real difficult conversation.',cue:'What do I need to say clearly without becoming passive, defensive or aggressive?'},
 week4:{title:'Working Notes · Influence & Impact',prompt:'Record stakeholder priorities, possible resistance, useful evidence and the language that may create genuine buy-in.',cue:'Whose support do I need, what matters to them, and what would make my recommendation easier to act on?'},
 week5:{title:'Working Notes · Resilience & Self-Leadership',prompt:'Notice pressure triggers, emotional reactions, warning signs and the regulation practices that help you stay capable of leadership.',cue:'What happens to my leadership under pressure, and what response do I want to choose instead?'},
 week6:{title:'Working Notes · Leading Sustainable Change',prompt:'Capture the current reality, desired change, stakeholder reactions, ownership, measures and leadership behaviours required.',cue:'What must become visibly different because I led this change well?'}
};
function add(){
 const lesson=document.querySelector('[data-native-week]');
 if(!lesson||document.getElementById('dev-notes'))return;
 const key=lesson.dataset.nativeWeek,cfg=prompts[key];if(!cfg)return;
 const reflect=document.getElementById('dev-reflect');if(!reflect)return;
 const notes=document.createElement('section');
 notes.className='native-lesson-card developer-native-notes';notes.id='dev-notes';
 notes.innerHTML=`<div class="native-section-head"><span>Working Notes</span><h2>${cfg.title}</h2><p>${cfg.prompt}</p></div><div class="native-callout"><strong>Working prompt</strong><span>${cfg.cue}</span></div><div class="native-fields"><label><strong>Your notes</strong><small>Developer preview of the learner’s autosaving working-notes space.</small><textarea maxlength="2500" placeholder="Capture key ideas, examples, questions or coaching notes here…"></textarea></label></div>`;
 reflect.before(notes);
 const nav=document.querySelector('.workspace-lesson-nav');
 if(nav&&!nav.querySelector('[data-native-notes]')){
  const reflectBtn=[...nav.querySelectorAll('button')].find(b=>b.textContent.trim()==='Reflect');
  const btn=document.createElement('button');btn.type='button';btn.dataset.nativeNotes='1';btn.textContent='Working Notes';btn.onclick=()=>notes.scrollIntoView({behavior:'smooth',block:'start'});
  if(reflectBtn)nav.insertBefore(btn,reflectBtn);else nav.appendChild(btn);
 }
}
let t;new MutationObserver(()=>{clearTimeout(t);t=setTimeout(add,50)}).observe(document.body,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add);else add();
})();