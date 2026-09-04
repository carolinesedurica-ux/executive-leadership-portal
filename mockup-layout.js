(()=>{
const cfg={
 week1:{week:'WEEK 1',title:'Leadership Identity & Confidence',subtitle:'Think Like a Leader Before You Have the Title',heroQuote:'A stronger leadership you starts here.',rail:'The way you lead tomorrow starts with the questions you ask yourself today.'},
 week2:{week:'WEEK 2',title:'Executive Presence & Personal Authority',subtitle:'Your Presence Speaks Before You Do',heroQuote:'Presence is the message before the words.',rail:'How you enter the room shapes how your contribution is received.'},
 week3:{week:'WEEK 3',title:'Assertiveness & Difficult Conversations',subtitle:'Speak Clearly When the Conversation Is Difficult',heroQuote:'Clarity and courage can coexist.',rail:'Respectful leadership means saying what matters without losing yourself or the relationship.'}
};
function enhanceWeek(key){
 const root=document.getElementById(key),c=cfg[key]; if(!root||!c)return;
 const hero=root.querySelector('.page-hero');
 if(hero&&!hero.dataset.mockup){hero.dataset.mockup='1';hero.classList.add('mockup-week-hero');hero.innerHTML=`<div class="mockup-hero-copy"><div class="mockup-week-kicker">${c.week}<span></span></div><h1>${c.title}</h1><p>${c.subtitle}</p></div><div class="mockup-hero-quote">${c.heroQuote}</div>`;}
 const host=root.querySelector('.reflection-card-shell'); if(!host||host.dataset.mockup)return;
 const header=host.querySelector('.reflection-card-header'),stage=host.querySelector('.reflection-card-stage'),nav=host.querySelector('.reflection-nav-row'),summary=host.querySelector('.reflection-summary');
 if(!header||!stage||!nav||!summary)return; host.dataset.mockup='1';
 const strip=document.createElement('div');strip.className='mockup-step-strip';strip.innerHTML=`<button type="button" data-target="watch"><span class="step-icon">▶</span><div><strong>1. Watch</strong><small>Explainer video</small></div><i>✓</i></button><button type="button" class="active"><span class="step-icon">▣</span><div><strong>2. Reflect</strong><small>Question 1 of 3</small></div></button><button type="button" data-target="prepare"><span class="step-icon">♟</span><div><strong>3. Prepare</strong><small>Bring it to coaching</small></div><b>›</b></button>`;
 host.parentNode.insertBefore(strip,host);
 strip.querySelector('[data-target="watch"]').onclick=()=>root.querySelector('.premium-video')?.scrollIntoView({behavior:'smooth',block:'center'});
 strip.querySelector('[data-target="prepare"]').onclick=()=>root.querySelector('.interactive-card')?.scrollIntoView({behavior:'smooth',block:'center'});
 const grid=document.createElement('div');grid.className='mockup-reflection-grid';
 const rail=document.createElement('aside');rail.className='mockup-quote-rail';rail.innerHTML=`<strong>01</strong><span>/ 03</span><i></i><blockquote>“${c.rail}”</blockquote>`;
 const center=document.createElement('div');center.className='mockup-reflection-center';
 center.append(header,stage,nav);
 const side=document.createElement('aside');side.className='mockup-reflection-side';
 const progress=document.createElement('div');progress.className='mockup-mini-progress';progress.innerHTML=`<h3>Your Progress</h3><p class="mockup-progress-copy">0 of 3 reflections completed</p><div><span></span></div><strong>0%</strong>`;
 side.append(progress,summary); grid.append(rail,center,side);host.append(grid);
 const observer=new MutationObserver(()=>{const txt=header.querySelector('.reflection-progress > span')?.textContent||'';const m=txt.match(/(\d+) of (\d+)/);if(!m)return;const done=+m[1],total=+m[2],pct=Math.round(done/total*100);progress.querySelector('.mockup-progress-copy').textContent=`${done} of ${total} reflections completed`;progress.querySelector('div span').style.width=pct+'%';progress.querySelector(':scope > strong').textContent=pct+'%';strip.querySelector('.active small').textContent=`Question ${Math.min(done+1,total)} of ${total}`;});
 observer.observe(header,{childList:true,subtree:true,characterData:true});
 const prompt=()=>{const active=stage.querySelector('.reflection-card.active');if(!active)return;const num=+active.dataset.index+1;rail.querySelector(':scope > strong').textContent=String(num).padStart(2,'0');strip.querySelector('.active small').textContent=`Question ${num} of 3`;};
 new MutationObserver(prompt).observe(stage,{attributes:true,subtree:true,attributeFilter:['class']});prompt();
}
function enhance(){['week1','week2','week3'].forEach(enhanceWeek)}
let t;new MutationObserver(()=>{clearTimeout(t);t=setTimeout(enhance,80)}).observe(document.body,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance);else enhance();
})();