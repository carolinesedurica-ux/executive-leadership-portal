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

const developerProgrammeContent={
 week1:{
  intro:'Leadership begins before the title. This week focuses on understanding who you are as a leader, recognising the strengths you already bring, and identifying the situations that cause you to hesitate or second-guess yourself.',
  outcomes:['Articulate the leadership qualities and principles you want others to experience consistently.','Recognise the situations that trigger hesitation, over-checking or unnecessary self-doubt.','Distinguish personal worth from a single performance outcome or mistake.','Use evidence, judgement and reasonable risk assessment to make decisions with greater self-trust.','Translate leadership identity into visible workplace behaviour and follow-through.'],
  brief:[['Identity comes before authority','Leadership identity is the internal answer to the question: “Who am I when responsibility increases?” A title can give formal authority, but it cannot create consistency, courage or judgement. People experience your leadership through the way you decide, communicate, handle pressure and take ownership.'],['Self-worth is not the same as performance','A strong leader can take performance seriously without turning every mistake or difficult meeting into a verdict on personal worth. Separating worth from performance creates room for accountability, learning and correction.'],['Confidence should be built from evidence','Past decisions, problems solved, conversations handled, expertise gained and challenges survived create a record of capability. Evidence-based confidence reduces the need for repeated reassurance.'],['Good judgement includes uncertainty','Leadership rarely offers perfect information. Responsible judgement means gathering enough relevant information, identifying risks, applying criteria, deciding and adjusting when new evidence appears.'],['Make your leadership visible','Intentions do not create a leadership reputation; repeated behaviour does. Values become credible when words and actions consistently point in the same direction.']],
  outputs:[['My leadership identity','Complete: “As a leader, I am someone who…”'],['What I stand for','Which principles or standards will guide my decisions?'],['How I want people to experience me','What should colleagues consistently feel or observe when working with me?'],['Strengths I will lead from','Which existing strengths give me evidence that I can lead effectively?'],['My three leadership non-negotiables','Name three behaviours or standards you will protect even when pressure rises.']],
  lab:{title:'Leadership Compass',intro:'Choose the leadership qualities you want people to consistently experience from you.',fields:[['Qualities','Calm · Clear · Decisive · Fair · Courageous · Empathetic · Strategic · Consistent · Curious · Accountable'],['Leadership identity anchor','What behaviour would make your chosen qualities visible in a real leadership moment?']]},
  reflections:reflectionQuestions.week1,
  challenge:'Choose one real workplace situation where you would normally hesitate, hold back or over-explain. Ask: “What does this situation need from me as a leader?” Then deliberately practise one leadership behaviour.'
 },
 week2:{
  intro:'Leadership presence is not about being the loudest person in the room. It is the combination of composure, clarity, communication and personal authority that shapes how others experience your leadership.',
  outcomes:['Regulate pace, posture, voice and response time so you remain composed when pressure rises.','Lead important communication with the key message or recommendation rather than unnecessary background detail.','Reduce over-explaining and use concise evidence to support your position.','Hold your position calmly while remaining open to relevant questions, feedback and new evidence.','Deliver a structured 60–90 second executive update with a clear close and next step.'],
  brief:[['Presence is a leadership signal','Executive presence is the collection of signals people use to decide whether they can trust your judgement, follow your direction and stay confident when pressure rises.'],['Composure creates thinking space','A deliberate pause, controlled breathing and a slower speaking pace create cognitive space to think and protect judgement.'],['Lead with the point','Senior audiences usually need the message before the history. Start with your position, recommendation or decision, then explain the reason, evidence and next step.'],['Personal authority is calm, not rigid','Personal authority means being willing to state what you think, why you think it and what you recommend without becoming defensive or dominating.'],['Contribution matters more than approval','Shift attention from “How am I being judged?” to “What contribution does this situation need from me?”']],
  outputs:[['Situation & audience','What is the context, and who needs to hear this message?'],['My key message','What is the single point, position or decision the audience must understand first?'],['Evidence & rationale','Which two or three facts, risks or reasons support your position?'],['Recommendation / next step','What do you recommend, need approved, or want to happen next?'],['My 60–90 second executive update','Write the spoken version: lead with the point, support it briefly, and close with the next step.']],
  lab:{title:'Presence Lab',intro:'Choose one behaviour to practise in your next important meeting.',fields:[['Presence practice','Pause before answering · Slow my speaking pace · State my recommendation first · Use fewer words · Hold my position calmly'],['Rehearsal cue','Write the sentence you want to remember before the meeting.']]},
  reflections:reflectionQuestions.week2,
  challenge:'At your next important meeting, deliberately practise one presence behaviour and observe how it changes the quality of your communication.'
 },
 week3:{
  intro:'Leadership sometimes requires saying what needs to be said even when the conversation may be uncomfortable. Assertiveness allows you to communicate clearly while maintaining respect and preserving dignity.',
  outcomes:['Distinguish assertive communication from passive avoidance and aggressive confrontation.','Frame a difficult issue using observable facts rather than character judgement.','Use the CLEAR framework to prepare and lead a difficult workplace conversation.','Set a respectful boundary or expectation without apologising for the legitimate need behind it.','Respond to defensiveness while preserving composure, clarity, accountability and follow-up.'],
  brief:[['Clarity reduces unnecessary conflict','Start with observable facts: what happened, what was expected and what impact followed. Clear issue framing reduces argument about interpretation.'],['Assertiveness is respect with a position','Assertive leadership communicates the issue, perspective, boundary or request clearly while recognising the other person’s dignity.'],['Listening does not require surrender','A leader can seek to understand another person without abandoning a justified position. Curiosity and firmness can exist together.'],['Boundaries make expectations usable','Effective boundaries are specific, proportionate and relevant to the work. Their purpose is to protect standards, roles, time, safety or respectful working relationships.'],['Close the accountability loop','A difficult conversation is not complete until action, ownership, standard, deadline and review point are clear.']],
  outputs:[['The issue in observable facts','What happened, what was expected, and what impact has followed?'],['The outcome I need','What needs to be understood, decided, changed or agreed?'],['My opening statement','Write the first 2–3 sentences.'],['Likely resistance & my response','How might the other person react, and how will you stay calm and return to the issue?'],['Boundary, action & follow-up','What expectation or boundary must be clear, who owns the next action, and when will progress be reviewed?']],
  lab:{title:'Conversation Lab · CLEAR Framework',intro:'Prepare one real difficult conversation.',fields:[['Clarify','What is the issue in observable facts?'],['Listen','What do you need to understand from the other person?'],['Explain','What is your position or expectation?'],['Agree','What action or boundary must be agreed?'],['Review','When and how will follow-up happen?']]},
  reflections:reflectionQuestions.week3,
  challenge:'Use the CLEAR framework in one real workplace conversation: Clarify the issue, Listen, Explain your position, Agree the action, Review and follow through.'
 },
 week4:{
  intro:'Senior leadership depends on more than authority. This week develops the ability to build credibility, understand stakeholders, handle resistance and move people toward action through ethical influence.',
  outcomes:['Distinguish positional authority from executive influence.','Identify the credibility, relationship, relevance and clarity factors that strengthen influence.','Adapt the framing of a recommendation to different stakeholder priorities without manipulating the message.','Respond to resistance with curiosity, evidence and composure rather than defensiveness.','Deliver a concise influence statement that makes the decision or action required clear.'],
  brief:[['Authority can secure compliance; influence builds commitment','A title gives formal decision rights, but senior leaders routinely depend on colleagues, boards, clients, regulators and specialists they cannot simply instruct. Influence shapes thinking and action through credibility, trust, reasoning and relevance.'],['Credibility is accumulated before the important meeting','Preparation, competence, consistency, integrity and follow-through affect whether others trust your judgement. Credibility is a leadership account funded over time by reliable behaviour.'],['Relevance makes good ideas easier to hear','Finance may focus on cost and exposure, operations on implementation, employees on workload and certainty, and a board on governance and strategic risk. Ethical influence connects the same truth to the priorities of the audience without changing facts.'],['Resistance is information before it is opposition','Resistance may reflect budget pressure, risk, past experience, workload, loss of control or a flaw in the plan. Become curious before becoming defensive.'],['Influence becomes useful when it leads to action','Executive communication should clarify what is happening, why it matters, what you recommend, the organisational benefit or risk, and what decision or action is required.']],
  outputs:[['The outcome I need','What decision, support or action am I trying to secure?'],['My three critical stakeholders','Who are they, and why does their support matter?'],['What matters to them','What priority, risk, concern or decision criterion matters most to each stakeholder?'],['Likely resistance & response','What may cause resistance, and what question or evidence will help address it?'],['My 60-second influence statement','State the situation, why it matters, your recommendation, the organisational benefit and the decision or action required.']],
  lab:{title:'Influence Lab · Stakeholder, Priority, Resistance, Message',intro:'Use one stakeholder and test the logic of your influence approach.',fields:[['Stakeholder','Whose support do I need?'],['Priority','What matters most to them?'],['Resistance','What concern may block support?'],['Message','What is my clearest decision or action request?']]},
  reflections:reflectionQuestions.week4,
  challenge:'Choose one real proposal or decision you need to advance. Map the key stakeholder, identify what matters to them, anticipate one likely concern, then deliver a 60-second influence statement that ends with a clear decision or action request.'
 },
 week5:{
  intro:'Executive responsibility brings ambiguity, criticism, competing demands and difficult decisions. This week develops the internal discipline to remain effective, thoughtful and behaviourally consistent when pressure rises.',
  outcomes:['Recognise personal pressure patterns and early warning signs.','Use Pause, Name, Evaluate and Respond to create space between emotion and leadership behaviour.','Separate facts, assumptions and emotional reactions before making important decisions.','Use recovery, boundaries and delegation to protect judgement and sustainable performance.','Respond to mistakes and setbacks with accountability, learning and corrective action rather than rumination.'],
  brief:[['Pressure reveals leadership patterns','Under pressure leaders often default to controlling, rushing, withdrawing, over-explaining, procrastinating or impatience. Self-leadership begins by recognising the pattern before it chooses the behaviour for you.'],['Create space between reaction and response','Pause. Name what you are feeling. Evaluate the facts, assumptions and outcome required. Then choose the response that serves the organisation.'],['Resilience is not unlimited absorption','Chronic overload narrows thinking, reduces patience and weakens judgement. Sustainable resilience includes delegation, protected thinking time, boundaries and recovery.'],['Reflection should produce learning','Reflection asks what happened, what was within your control and what you will change. Rumination replays the experience without useful movement.'],['Your regulation becomes part of the team climate','Panic can spread anxiety; blame can make people hide problems; calm accountability can make it safer to surface risk and solve problems.']],
  outputs:[['My three leadership triggers','Which situations most reliably create defensiveness, urgency, impatience, withdrawal or over-control?'],['How I typically react','What changes in my communication, decisions, delegation or relationships?'],['My warning signs','What tells me that my leadership effectiveness is beginning to deteriorate?'],['My regulation strategy','How will I Pause, Name, Evaluate and Respond when triggered?'],['My recovery commitments','Which three practices will protect judgement, energy and sustainable performance?']],
  lab:{title:'Pressure Reset Lab · Pause, Name, Evaluate, Respond',intro:'Use a real pressure moment and work through the four-step reset.',fields:[['Pause','What can wait long enough for you to think?'],['Name','What emotion or reaction is present?'],['Evaluate','What are the facts, assumptions and desired outcome?'],['Respond','What behaviour best serves the leadership outcome?']]},
  reflections:reflectionQuestions.week5,
  challenge:'Use Pause → Name → Evaluate → Respond in one real pressure moment. Record what triggered you, what you initially wanted to do, and what changed when you chose the response deliberately.'
 },
 week6:{
  intro:'Executive leadership is ultimately measured by what changes because the leader was there. This week integrates identity, presence, communication, influence and self-leadership into the ability to move an organisation from intention to sustained behaviour.',
  outcomes:['Build a compelling case for change that explains why action is necessary now.','Identify stakeholder support, resistance and the human impact of change.','Translate broad strategic intentions into specific behaviours, ownership, deadlines and measures.','Align leadership behaviour with the change being requested from others.','Reinforce progress until the new behaviour becomes part of normal organisational practice.'],
  brief:[['Announcing change is not leading change','Statements such as “we need more accountability” describe aspirations, not implementation. Sustainable change requires clarity about why the change matters, what will be different, roles and measures.'],['A credible case for change begins with reality','Name the current reality honestly, explain the consequence of doing nothing and connect that reality to a clear future direction.'],['Resistance can improve the change plan','Resistance may reflect uncertainty, workload, history, trust, competence or personal impact. Listening helps leaders address avoidable barriers while remaining clear on direction.'],['Leadership consistency determines credibility','People pay close attention to what leaders model, reward, tolerate and follow through on. Change becomes credible when leadership behaviour and stated expectations align.'],['Execution needs ownership and reinforcement','Every strategic priority should answer: who owns it, what exactly will happen, by when, how progress will be measured and what happens if progress stalls.']],
  outputs:[['Case for change','What needs to change, why now, and what happens if nothing changes?'],['Desired future','What should people or the organisation experience differently after successful implementation?'],['Stakeholder support & resistance','Who is affected, who may support the change, who may resist, and why?'],['Ownership, actions & measures','Who owns implementation, what are the first three actions, by when, and how will progress be measured?'],['The behaviour I must model','What must people consistently see from me for this change to remain credible?']],
  lab:{title:'Change Lab · Reality, Direction, Ownership, Measure',intro:'Test whether your change idea is clear enough to execute.',fields:[['Reality','What is happening now?'],['Direction','What must be different?'],['Ownership','Who owns the first move?'],['Measure','How will you know progress is real?']]},
  reflections:reflectionQuestions.week6,
  challenge:'Choose one genuine organisational improvement and create a one-page change blueprint: case for change, desired future, key stakeholders, first three actions, owner, deadline, measure and the leadership behaviour you must personally model.'
 }
};

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
 detail=null;
 recordParticipantId='';
 renderWeekWorkspace(view,focus);
}

function developerWeekMeta(key){
 const base=programmeCatalog.find(x=>x.key===key);
 const content=developerProgrammeContent[key];
 return base&&content?{...base,...content}:null;
}
function developerVideo(meta){
 if(!meta?.videoUrl)return `<div class="native-video-missing"><strong>${esc(meta?.video||'Explainer video')}</strong><span>Video link not currently attached in the Developer Portal.</span></div>`;
 return `<div class="native-video"><video controls preload="metadata" playsinline><source src="${meta.videoUrl}" type="video/mp4">Your browser does not support HTML5 video.</video><div><strong>${esc(meta.video)}</strong><span>Developer preview · Vercel Blob</span></div></div>`;
}
function developerTestView(key){
 const test=window.ELRP_WEEKLY_TESTS?.[key];
 if(!test)return '<div class="native-empty">Weekly test configuration is not loaded.</div>';
 return `<div class="native-test">
   <div class="native-section-head"><span>Weekly Test · 10%</span><h2>${esc(test.title)}</h2><p>Developer view only. Answers are not submitted and no participant marks are changed.</p></div>
   <div class="native-test-grid">
    <section><h3>Part A · Multiple choice</h3>${test.mcq.map((q,i)=>`<div class="native-question"><strong>${i+1}. ${esc(q.prompt)}</strong>${q.options.map(opt=>`<label><input type="radio" name="dev-${key}-q${i}"> <span>${esc(opt)}</span></label>`).join('')}</div>`).join('')}</section>
    <section><h3>Part B · Written answers</h3>${test.written.map((q,i)=>`<label class="native-written"><strong>${i+6}. ${esc(q)}</strong><textarea placeholder="Developer test response preview"></textarea></label>`).join('')}</section>
   </div>
  </div>`;
}
function developerAssessmentView(){
 const dimensions=['Confidence in my leadership capability','Trust in my judgement','Leadership presence in meetings','Remaining composed when challenged','Communicating clearly and concisely','Speaking confidently with senior colleagues','Assertiveness','Expressing disagreement respectfully','Having difficult conversations','Setting boundaries and saying no','Handling another person’s defensiveness','Speaking without unnecessary over-explanation'];
 return `<div class="native-lesson">
   <section class="native-lesson-hero"><span>Mid-Course Assessment</span><h2>Leadership Assessment</h2><p>Weeks 1–3 weekly tests contribute 30%. This assessment contributes 70%. Overall pass mark: 80%. Maximum attempts: 3. Passing generates the 7-character Week 4 access credential for participants.</p></section>
   <section class="native-lesson-card"><div class="native-section-head"><span>Assessment dimensions</span><h2>12 leadership capability ratings</h2></div><div class="native-outcomes">${dimensions.map((x,i)=>`<div><span>${String(i+1).padStart(2,'0')}</span><p>${esc(x)}</p></div>`).join('')}</div></section>
   <section class="native-lesson-card"><div class="native-section-head"><span>Evidence of change</span><h2>Written reflection prompts</h2></div>
    <div class="native-fields"><label><strong>Greatest improvement</strong><textarea placeholder="Developer preview"></textarea></label><label><strong>Evidence situation</strong><textarea placeholder="Developer preview"></textarea></label><label><strong>Remaining leadership challenge</strong><textarea placeholder="Developer preview"></textarea></label></div>
   </section>
  </div>`;
}
function developerLessonView(key){
 const w=developerWeekMeta(key);
 if(!w)return '<div class="native-empty">Week content not found.</div>';
 return `<div class="native-lesson" data-native-week="${key}">
   <section class="native-lesson-hero" id="dev-watch"><span>${w.week}</span><h2>${esc(w.title)}</h2><p>${esc(w.intro)}</p></section>
   <section class="native-lesson-card"><div class="native-section-head"><span>01 · Watch</span><h2>${esc(w.video)}</h2></div>${developerVideo(w)}</section>
   <section class="native-lesson-card" id="dev-outcomes"><div class="native-section-head"><span>Learning outcomes</span><h2>By the end of this week, the learner will be able to…</h2></div><div class="native-outcomes">${w.outcomes.map((x,i)=>`<div><span>${String(i+1).padStart(2,'0')}</span><p>${esc(x)}</p></div>`).join('')}</div></section>
   <section class="native-lesson-card" id="dev-brief"><div class="native-section-head"><span>Leadership Brief</span><h2>Core executive learning</h2></div><div class="native-brief-grid">${w.brief.map(([title,body],i)=>`<article><span>0${i+1}</span><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`).join('')}</div></section>
   <section class="native-lesson-card" id="dev-output"><div class="native-section-head"><span>Executive Output</span><h2>${esc(w.output)}</h2><p>Developer preview of the learner deliverable.</p></div><div class="native-fields">${w.outputs.map(([label,prompt])=>`<label><strong>${esc(label)}</strong><small>${esc(prompt)}</small><textarea placeholder="${esc(prompt)}"></textarea></label>`).join('')}</div></section>
   <section class="native-lesson-card" id="dev-lab"><div class="native-section-head"><span>Leadership Lab</span><h2>${esc(w.lab.title)}</h2><p>${esc(w.lab.intro)}</p></div><div class="native-fields native-lab-fields">${w.lab.fields.map(([label,prompt])=>`<label><strong>${esc(label)}</strong><small>${esc(prompt)}</small><textarea placeholder="${esc(prompt)}"></textarea></label>`).join('')}</div></section>
   <section class="native-lesson-card" id="dev-reflect"><div class="native-section-head"><span>02 · Reflect</span><h2>Guided reflection</h2></div><div class="native-fields">${w.reflections.map((q,i)=>`<label><strong>${i+1}. ${esc(q)}</strong><textarea placeholder="Developer reflection preview"></textarea></label>`).join('')}</div></section>
   <section class="native-lesson-split">
    <article class="native-lesson-card" id="dev-coach"><div class="native-section-head"><span>03 · Live coaching</span><h2>Bring a real situation</h2></div><p>Your live session uses the learner’s reflections and an actual leadership situation from work.</p><div class="native-callout"><strong>Coach focus</strong><span>What does this situation need from you as a leader?</span></div></article>
    <article class="native-lesson-card" id="dev-apply"><div class="native-section-head"><span>04 · Apply</span><h2>Leadership challenge</h2></div><p>${esc(w.challenge)}</p></article>
   </section>
   <section class="native-lesson-card" id="dev-checkin"><div class="native-section-head"><span>05 · Check in</span><h2>End-of-week completion check</h2></div><div class="native-checks">${['I watched the explainer','I completed my reflection','I attended live coaching','I completed the workplace challenge'].map(x=>`<label><input type="checkbox"> <span>${x}</span></label>`).join('')}</div></section>
   <section class="native-test-launch"><div><span>06 · Weekly Test</span><h2>10 questions · 5 MCQ + 5 written · 10%</h2></div><button type="button" data-native-test="${key}">Open full ${w.week} Test →</button></section>
  </div>`;
}
function renderWeekWorkspace(view='week1',focus=''){
 const weekMatch=String(view).match(/^(week[1-6])(?:-test)?$/);
 const weekKey=weekMatch?.[1]||null;
 const isTest=/-test$/.test(view);
 const meta=programmeCatalog.find(x=>x.key===weekKey);
 const title=view==='assessment'?'Mid-Course Leadership Assessment':meta?meta.week+' · '+meta.title:'Programme';
 const body=view==='assessment'?developerAssessmentView():isTest?developerTestView(weekKey):developerLessonView(weekKey||'week1');
 document.getElementById('devView').innerHTML=`
   <section class="developer-workspace native-workspace">
    <div class="workspace-toolbar">
     <div class="workspace-title"><button type="button" class="workspace-back" id="workspaceBack">← Programme & Lessons</button><span class="kicker">Developer Week Workspace</span><h1>${esc(title)}</h1></div>
     <div class="workspace-actions"><a href="${previewUrl(view,focus)}" target="_blank" rel="noopener">Open learner-style preview ↗</a></div>
    </div>
    <div class="workspace-week-nav">${programmeCatalog.map(w=>`<button type="button" data-workspace-week="${w.key}" class="${w.key===weekKey?'active':''}">${w.week}</button>`).join('')}<button type="button" data-workspace-week="assessment" class="${view==='assessment'?'active':''}">Mid-Course Assessment</button></div>
    ${meta&&!isTest?`<div class="workspace-lesson-nav">${[['watch','Watch'],['outcomes','Outcomes'],['brief','Brief'],['output','Executive Output'],['lab','Leadership Lab'],['reflect','Reflect'],['coach','Coaching'],['apply','Apply'],['checkin','Check-in']].map(([id,label])=>`<button type="button" data-native-scroll="${id}">${label}</button>`).join('')}<button type="button" data-native-test="${weekKey}">Weekly Test</button></div>`:''}
    <div class="native-workspace-body">${body}</div>
   </section>`;
 document.querySelectorAll('.dev-side [data-section]').forEach(b=>b.classList.toggle('active',b.dataset.section==='programme'));
 document.getElementById('workspaceBack').onclick=()=>{section='programme';programmeView()};
 document.querySelectorAll('[data-workspace-week]').forEach(b=>b.onclick=()=>renderWeekWorkspace(b.dataset.workspaceWeek));
 document.querySelectorAll('[data-native-scroll]').forEach(b=>b.onclick=()=>document.getElementById('dev-'+b.dataset.nativeScroll)?.scrollIntoView({behavior:'smooth',block:'start'}));
 document.querySelectorAll('[data-native-test]').forEach(b=>b.onclick=()=>renderWeekWorkspace(b.dataset.nativeTest+'-test'));
 if(focus&&!isTest)setTimeout(()=>document.getElementById('dev-'+focus)?.scrollIntoView({behavior:'smooth',block:'start'}),50);
 document.getElementById('devStatus').textContent='Developer mode · '+title+' · native lesson workspace · no participant attached';
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
   <article class="programme-week-card clickable-week-card" data-programme-week="${w.key}" role="button" tabindex="0" aria-label="Open full ${w.week}: ${esc(w.title)}">
     <div class="programme-week-head">
       <div><span class="week-chip">${w.week}</span><h2>${esc(w.title)}</h2><p>${esc(w.video)}</p></div>
       <div class="week-statuses"><span class="pill">Unlocked</span>${w.videoUrl?'<span class="pill video-linked">Video linked</span>':''}</div>
     </div>
     <div class="lesson-list">
       ${lessonItems.map(([focus,label,copy])=>`
       <button type="button" class="lesson-row" data-open-week="${focus==='test'?w.key+'-test':w.key}" data-focus="${focus==='test'?'':focus}">
         <span class="lesson-num">${String(lessonItems.findIndex(x=>x[0]===focus)+1).padStart(2,'0')}</span>
         <span class="lesson-copy"><strong>${label}</strong><small>${focus==='watch'?esc(w.video):focus==='output'?esc(w.output):focus==='lab'?esc(w.lab):copy}</small></span>
         <span class="lesson-arrow">Open →</span>
       </button>`).join('')}
     </div>
     <div class="programme-week-actions">
       <a class="primary-dev-btn" href="${previewUrl(w.key)}" data-open-week="${w.key}">Open full ${w.week}</a>
       <button type="button" data-open-week="${w.key}-test">Open weekly test</button>
       ${w.videoUrl?`<a href="${w.videoUrl}" target="_blank" rel="noopener">Open video ↗</a>`:''}
     </div>
   </article>`).join('')}
 </div>
 <section class="card assessment-map">
   <div><span class="week-chip assessment-chip">Mid-Course</span><h2>Leadership Assessment</h2><p>Weeks 1–3 tests contribute 30%; the assessment contributes 70%; 80% overall is required for the Week 4 credential.</p></div>
   <button type="button" class="primary-dev-btn" data-open-week="assessment">Open assessment →</button>
 </section>`;
 document.querySelectorAll('[data-open-week]').forEach(b=>b.onclick=e=>{
   e.preventDefault();
   e.stopPropagation();
   openPreview(b.dataset.openWeek,b.dataset.focus||'');
 });
 document.querySelectorAll('[data-programme-week]').forEach(card=>{
   const open=()=>openPreview(card.dataset.programmeWeek);
   card.onclick=e=>{
     if(e.target.closest('button,a'))return;
     open();
   };
   card.onkeydown=e=>{
     if((e.key==='Enter'||e.key===' ')&&!e.target.closest('button,a')){e.preventDefault();open()}
   };
 });
 document.getElementById('devStatus').textContent='Developer mode · full programme and lessons · click any week card to open the complete lesson';
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