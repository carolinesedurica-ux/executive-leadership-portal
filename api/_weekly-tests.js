const WEEKLY_TESTS = {
  week1: {
    title: 'Week 1 Leadership Judgement & Application Test',
    mcq: [
      {
        prompt: 'You are asked to lead a project meeting and a more senior colleague openly challenges your recommendation. Which response best demonstrates leadership identity and self-trust?',
        options: [
          'Withdraw the recommendation until you can check privately with your manager.',
          'Defend the recommendation forcefully so your authority is not questioned.',
          'Pause, state your recommendation and reasoning clearly, invite relevant evidence, then decide the next step.',
          'Give a longer explanation so everyone can see how much preparation you did.'
        ],
        answer: 2
      },
      {
        prompt: 'A decision you made produces a poor outcome. Which response best separates self-worth from performance while maintaining accountability?',
        options: [
          'Avoid discussing it until the team has moved on.',
          'Treat the result as proof that you are not ready to lead.',
          'Own the outcome, review what happened factually, correct what you can and identify the lesson for the next decision.',
          'Explain that the circumstances were outside your control.'
        ],
        answer: 2
      },
      {
        prompt: 'You have enough information to make a routine leadership decision, but you keep asking your manager for reassurance. What is the strongest confidence-building response?',
        options: [
          'Wait until you feel completely certain.',
          'Define the decision criteria, make the reasoned decision, record your assumptions and review the outcome afterwards.',
          'Ask several colleagues what they would do and choose the most popular option.',
          'Delay the decision so more information can arrive.'
        ],
        answer: 1
      },
      {
        prompt: 'Your Leadership Compass includes Calm, Clear and Accountable. Which behaviour most strongly makes those qualities visible after a missed deadline?',
        options: [
          'Stay quiet so the team does not become anxious.',
          'Acknowledge the delay calmly, clarify the impact and next action, take ownership and follow through.',
          'Send a detailed explanation of every factor that caused the delay.',
          'Focus on keeping everyone positive rather than discussing accountability.'
        ],
        answer: 1
      },
      {
        prompt: 'Two stakeholders want different outcomes and both are pressuring you for an immediate answer. Which action best reflects values-based leadership judgement?',
        options: [
          'Choose the option supported by the most senior stakeholder.',
          'Avoid making a decision until both stakeholders agree.',
          'Use your role responsibilities and stated leadership principles to evaluate the trade-offs, decide and communicate the reasoning clearly.',
          'Choose the option that is least likely to create conflict.'
        ],
        answer: 2
      }
    ],
    written: [
      {
        prompt: 'Write a 3–5 sentence leadership identity statement. Name at least two qualities you want people to experience from you and one behaviour that will make those qualities visible.',
        concepts: [
          ['quality','qualities','calm','clear','decisive','fair','courageous','empathetic','strategic','consistent','curious','accountable'],
          ['experience','people','team','colleagues','others'],
          ['behaviour','behavior','action','demonstrate','show','visible']
        ]
      },
      {
        prompt: 'You need to make an important decision with incomplete information and you are worried about being criticised. Explain how you would use evidence and self-trust to decide responsibly without becoming reckless.',
        concepts: [
          ['evidence','information','facts','criteria'],
          ['judgement','judgment','decision','decide'],
          ['risk','assumption','uncertainty','trade-off','tradeoff'],
          ['review','adjust','adapt','new information','follow-up']
        ]
      },
      {
        prompt: 'Explain the difference between personal worth and performance. Then describe how that distinction should affect your response after making a mistake.',
        concepts: [
          ['worth','value','self-esteem','self esteem'],
          ['performance','result','outcome','mistake'],
          ['learn','review','correct','accountability','own']
        ]
      },
      {
        prompt: 'Choose one leadership situation in which you usually hesitate, over-check or over-explain. Describe what you would do differently and write one concise sentence you could actually say in that situation.',
        concepts: [
          ['hesitate','over-check','overcheck','over-explain','over explain','doubt'],
          ['action','decide','recommend','position','boundary'],
          ['clear','concise','sentence','say','communicate']
        ]
      },
      {
        prompt: 'Name one leadership non-negotiable you want to protect. Describe the observable behaviour that proves it and what you will do when pressure makes that standard difficult to maintain.',
        concepts: [
          ['principle','value','standard','non-negotiable','non negotiable'],
          ['behaviour','behavior','action','observable','demonstrate'],
          ['pressure','consistent','accountability','follow-through','follow through']
        ]
      }
    ]
  },

  week2: {
    title: 'Week 2 Executive Presence & Communication Test',
    mcq: [
      {
        prompt: 'You have three minutes to update an executive committee on a delayed project. Which opening best demonstrates executive presence and message discipline?',
        options: [
          'Begin with the full project history so everyone understands the background.',
          'Apologise for the delay, then explain every factor that contributed to it.',
          'State the current position, the key impact and your recommendation, then provide only the evidence needed for the decision.',
          'Wait for the committee to ask questions before offering a recommendation.'
        ],
        answer: 2
      },
      {
        prompt: 'A senior leader unexpectedly challenges your figures in a meeting. What is the strongest first response?',
        options: [
          'Answer immediately so you do not appear uncertain.',
          'Pause, clarify the point being challenged, then respond with the relevant evidence or say what you will verify.',
          'Give a longer explanation to demonstrate how much work went into the analysis.',
          'Defer automatically to the senior leader because of their position.'
        ],
        answer: 1
      },
      {
        prompt: 'You notice that your updates become less clear when you are nervous. Which structure is most useful for a concise executive message?',
        options: [
          'Background → history → detail → conclusion.',
          'Position or recommendation → reason → evidence → next step.',
          'Question → apology → context → several alternatives.',
          'Evidence → more evidence → caveats → open discussion.'
        ],
        answer: 1
      },
      {
        prompt: 'A stakeholder disagrees with your recommendation but has not presented new evidence. Which response best demonstrates personal authority?',
        options: [
          'Change your recommendation to preserve the relationship.',
          'Repeat your position more loudly so the stakeholder knows you are confident.',
          'Acknowledge the disagreement, restate your reasoning calmly and remain open to relevant evidence without abandoning a sound position.',
          'End the discussion because further questions weaken your authority.'
        ],
        answer: 2
      },
      {
        prompt: 'Before presenting to senior colleagues, you become preoccupied with how they may judge you. Which mental shift is most likely to strengthen your presence?',
        options: [
          'Focus on sounding impressive enough to gain approval.',
          'Focus on what useful contribution, decision or clarity the situation needs from you.',
          'Memorise every sentence so there is no possibility of hesitation.',
          'Avoid making a recommendation until you know everyone agrees.'
        ],
        answer: 1
      }
    ],
    written: [
      {
        prompt: 'Write a 60–90 second executive update for a real or realistic issue. Lead with the key message, include concise evidence and finish with a recommendation or next step.',
        concepts: [
          ['key message','position','recommendation','main point'],
          ['evidence','reason','fact','data','risk'],
          ['next step','action','decision','approve','recommend'],
          ['concise','clear','brief','60','90']
        ]
      },
      {
        prompt: 'You are challenged unexpectedly in a senior meeting and feel yourself beginning to rush. Describe the physical and communication reset you would use, then write the first sentence of your response.',
        concepts: [
          ['pause','breathe','breathing','slow'],
          ['composure','calm','pace','posture'],
          ['clarify','question','understand'],
          ['response','sentence','evidence','point']
        ]
      },
      {
        prompt: 'Describe one habit that causes you to over-explain. Explain how you would restructure the same message so the audience hears the important point first.',
        concepts: [
          ['over-explain','over explain','detail','background','rush'],
          ['point','position','recommendation','message'],
          ['evidence','reason','support'],
          ['concise','short','fewer','structure']
        ]
      },
      {
        prompt: 'Explain what personal authority looks like when someone disagrees with you. Include how you would listen, hold your position and respond if genuinely better evidence appears.',
        concepts: [
          ['listen','understand','question'],
          ['position','hold','recommendation','view'],
          ['calm','respect','authority'],
          ['evidence','adjust','change','reconsider']
        ]
      },
      {
        prompt: 'A senior colleague tells you that your updates are accurate but too long. Write a practical improvement plan for your next update, including how you will prepare, deliver and close.',
        concepts: [
          ['prepare','rehearse','structure'],
          ['key point','recommendation','position'],
          ['pace','pause','concise','fewer words'],
          ['close','next step','action','decision']
        ]
      }
    ]
  },

  week3: {
    title: 'Week 3 Assertiveness & Difficult Conversations Test',
    mcq: [
      {
        prompt: 'A team member has missed two agreed deadlines and becomes defensive when you raise it. Which opening best demonstrates assertive leadership?',
        options: [
          '“You are becoming unreliable and this attitude needs to stop.”',
          '“I do not want this to become uncomfortable, so let us leave it for now.”',
          '“The last two agreed deadlines were missed, which delayed the handover. I want us to understand what is happening and agree how the next deadline will be met.”',
          '“Everyone is frustrated with you, so you need to fix this immediately.”'
        ],
        answer: 2
      },
      {
        prompt: 'A colleague repeatedly sends urgent work late in the day and expects you to absorb it. Which response is the clearest professional boundary?',
        options: [
          'Say nothing and hope they notice the impact.',
          'Refuse all future requests from that colleague.',
          'Explain that same-day requests after the agreed cut-off cannot routinely be completed, state what notice you need and agree how true emergencies will be handled.',
          'Complete the work but send a frustrated message afterwards.'
        ],
        answer: 2
      },
      {
        prompt: 'You disagree with a senior executive’s proposed approach. What best demonstrates respectful assertiveness?',
        options: [
          'Remain silent because challenging a senior leader is inappropriate.',
          'State your concern clearly, explain the evidence and impact, and offer a recommendation while remaining open to discussion.',
          'Tell colleagues privately that the proposal is wrong.',
          'Challenge the executive aggressively so your confidence is visible.'
        ],
        answer: 1
      },
      {
        prompt: 'During a difficult conversation, the other person says, “You are blaming me for everything.” What is the strongest response?',
        options: [
          'Defend yourself immediately and list more examples.',
          'End the conversation until they are less emotional.',
          'Acknowledge the reaction, listen briefly, then return to the specific behaviour, impact and expectation that need to be addressed.',
          'Withdraw the concern so the relationship is preserved.'
        ],
        answer: 2
      },
      {
        prompt: 'Which ending best closes the accountability loop after a difficult conversation?',
        options: [
          '“Let us see how things go.”',
          '“I think we understand each other now.”',
          '“You will send the revised report by Thursday at 15:00, using the agreed format, and we will review progress together Friday morning.”',
          '“Please try harder next time.”'
        ],
        answer: 2
      }
    ],
    written: [
      {
        prompt: 'Write the first 2–3 sentences you would use to open a real difficult workplace conversation. Use observable facts, name the impact and explain the purpose of the conversation without attacking the person.',
        concepts: [
          ['fact','happened','observed','specific','deadline','behaviour','behavior'],
          ['impact','effect','result','delay','team','work'],
          ['purpose','understand','address','discuss','agree'],
          ['respect','clear','calm','specific']
        ]
      },
      {
        prompt: 'Use the CLEAR framework to outline a difficult conversation: Clarify the issue, Listen, Explain your position, Agree the action and Review the follow-up.',
        concepts: [
          ['clarify','issue'],
          ['listen','understand'],
          ['explain','position'],
          ['agree','action'],
          ['review','follow','follow-up','follow up']
        ]
      },
      {
        prompt: 'Write one respectful workplace boundary you need or could realistically need. State the expectation clearly and explain what you will do if the boundary is not respected.',
        concepts: [
          ['boundary','expectation','need','standard'],
          ['clear','specific','notice','deadline','time'],
          ['action','will','response','next step'],
          ['respect','calm','professional']
        ]
      },
      {
        prompt: 'The other person becomes defensive and says your concern is unfair. Describe how you would respond without surrendering the issue or escalating the conflict.',
        concepts: [
          ['listen','acknowledge','understand'],
          ['calm','composed','pause'],
          ['restate','issue','fact','expectation','impact'],
          ['position','boundary','action','next step']
        ]
      },
      {
        prompt: 'Write the closing agreement for a difficult conversation, including the action, owner, standard or result, deadline and follow-up point.',
        concepts: [
          ['action','task','next step'],
          ['owner','responsible','who'],
          ['standard','result','outcome','quality'],
          ['deadline','date','time'],
          ['review','follow-up','follow up','check-in','check in']
        ]
      }
    ]
  },
week4:{"title":"Week 4 Influence & Impact Test","mcq":[{"prompt":"You need support from a finance executive who is concerned about the cost of your proposal. Which response best demonstrates executive influence?","options":["Repeat the proposal more forcefully because the strategic benefit should be obvious.","Acknowledge the financial concern, connect the proposal to cost, risk and return, ask what evidence would address the concern, then clarify the decision needed.","Ask your manager to instruct the finance executive to cooperate.","Avoid discussing cost and focus only on the benefits."],"answer":1},{"prompt":"You are leading a cross-functional initiative and most team members do not report to you. What is the strongest way to create commitment?","options":["Rely on your executive title to set the direction.","Build a shared case for the outcome, understand stakeholder priorities, clarify roles and create visible follow-through.","Send more frequent instructions so nobody can claim they were uninformed.","Wait until everyone agrees before moving."],"answer":1},{"prompt":"A senior stakeholder strongly resists your recommendation in a meeting. What should you do first?","options":["Interpret the resistance as disrespect and defend your position.","Withdraw the proposal to protect the relationship.","Become curious about the concern behind the resistance, then address it with relevant evidence and clarity.","Escalate the matter immediately."],"answer":2},{"prompt":"Why is it appropriate to frame the same recommendation differently for different stakeholders?","options":["Because different stakeholders have different responsibilities, risks and decision criteria.","Because leaders should tell each person whatever they want to hear.","Because evidence matters less than personality.","Because executive communication should hide difficult information."],"answer":0},{"prompt":"Which behaviour most strengthens long-term executive credibility?","options":["Speaking first in every meeting.","Being consistent, prepared, evidence-based and reliable in follow-through.","Avoiding disagreement with senior colleagues.","Using authority whenever resistance appears."],"answer":1}],"written":[{"prompt":"Write a 60–90 second influence statement for a real or realistic proposal. Include the situation, why it matters, your recommendation, the organisational benefit and the action or decision required.","concepts":[["situation","context","issue"],["matter","impact","risk","benefit"],["recommend","recommendation","propose"],["organisational","organizational","benefit","value"],["action","decision","approve","next step"]]},{"prompt":"Identify three stakeholders whose support would matter for an important initiative. For each, explain one priority or concern you would need to understand before trying to influence them.","concepts":[["stakeholder","finance","board","operations","employee","client","executive"],["priority","concern","interest","risk"],["understand","listen","ask","perspective"],["support","influence","buy-in","buy in"]]},{"prompt":"Describe how you would respond when an influential colleague resists your proposal. Show how you would remain composed, explore the concern and return to the decision that needs to be made.","concepts":[["calm","composed","pause"],["concern","understand","ask","listen"],["evidence","reason","fact","risk"],["decision","action","recommendation","next step"]]},{"prompt":"Explain the difference between ethical influence and manipulation in executive leadership.","concepts":[["influence","persuade","shape"],["transparent","clear","honest","intention"],["agency","choice","respect"],["manipulation","hide","pressure","deceive"]]},{"prompt":"Name two behaviours that would strengthen your credibility before you need to influence a high-stakes decision, and explain how you will practise them.","concepts":[["credibility","trust"],["prepare","prepared","competence","evidence"],["consistent","follow-through","follow through","reliable"],["practice","action","behaviour","behavior"]]}]},
week5:{"title":"Week 5 Resilience & Self-Leadership Test","mcq":[{"prompt":"You receive a strongly critical email immediately before an important meeting. What response best demonstrates self-leadership?","options":["Reply immediately so the criticism does not go unanswered.","Ignore the message permanently.","Pause, name your reaction, separate facts from assumptions and choose a response that serves the leadership outcome.","Forward the email to colleagues to confirm that the sender is being unreasonable."],"answer":2},{"prompt":"Which sequence best supports emotional regulation under executive pressure?","options":["React → defend → explain → escalate.","Pause → Name → Evaluate → Respond.","Decide → justify → delegate → forget.","Suppress → work harder → avoid → recover."],"answer":1},{"prompt":"Which statement about executive resilience is most accurate?","options":["Resilient leaders do not experience stress.","Resilience means absorbing unlimited workload without support.","Resilience is the capacity to remain effective, recover and adapt while pressure is present.","Resilience requires avoiding situations where failure is possible."],"answer":2},{"prompt":"What is the clearest difference between reflection and rumination after a mistake?","options":["Reflection produces learning and a next action; rumination repeatedly replays the experience without useful movement.","Rumination is more strategic than reflection.","Reflection means ignoring emotion.","There is no meaningful difference."],"answer":0},{"prompt":"Why does a leader's emotional regulation matter beyond the leader personally?","options":["Because employees should never know a leader is under pressure.","Because leader behaviour can spread anxiety, blame, calm or constructive problem-solving through the team.","Because leaders are responsible for everyone else's emotions.","Because regulation makes difficult decisions unnecessary."],"answer":1}],"written":[{"prompt":"Describe one pressure pattern that appears in your leadership when demands increase. Explain the warning signs and the behaviour you want to replace it with.","concepts":[["pressure","stress","trigger"],["warning","sign","notice"],["behaviour","behavior","react","pattern"],["replace","change","instead","response"]]},{"prompt":"A senior colleague criticises a decision you made. Describe how you would use Pause, Name, Evaluate and Respond before answering.","concepts":[["pause","wait","breathe"],["name","feeling","emotion"],["evaluate","fact","assumption","outcome"],["respond","response","leadership","action"]]},{"prompt":"Create a short recovery plan for a demanding work period. Include at least three practices that protect judgement, energy or emotional regulation.","concepts":[["recovery","rest","sleep","break"],["delegate","delegation","boundary"],["thinking time","reflection","pause"],["energy","judgement","judgment","regulation"]]},{"prompt":"A major project has failed. Explain how a resilient executive should respond in the first 48 hours.","concepts":[["accountability","own","responsibility"],["facts","review","analyse","analyze"],["learn","lesson"],["correct","action","next step"],["communicate","team","stakeholder"]]},{"prompt":"Identify one boundary you need in order to sustain executive performance. Explain how the boundary supports performance rather than simply reducing workload.","concepts":[["boundary","limit","protect"],["performance","judgement","judgment","focus"],["sustainable","sustain","energy"],["communicate","expectation","action"]]}]},
week6:{"title":"Week 6 Leading Sustainable Change Test","mcq":[{"prompt":"What is the main purpose of a compelling case for change?","options":["To identify who caused the problem.","To help people understand why change is necessary now and what is at stake if nothing changes.","To prevent employees from questioning leadership.","To make implementation appear easier than it is."],"answer":1},{"prompt":"A group of employees resist a new operating model. What is the strongest leadership interpretation?","options":["Resistance proves they are disloyal.","Resistance may contain information about uncertainty, trust, workload, history or personal impact that leadership needs to understand.","Resistance means the change should be abandoned.","Resistance should be ignored until implementation is complete."],"answer":1},{"prompt":"Which leadership behaviour most undermines organisational change?","options":["Reviewing progress regularly.","Inviting relevant stakeholder input.","Asking employees to adopt new behaviours while senior leaders continue modelling the old behaviours.","Clarifying roles and ownership."],"answer":2},{"prompt":"A strategic priority has no named owner, deadline or measure. What is most likely to happen?","options":["It will become more collaborative.","It may remain an intention rather than an executed priority.","People will naturally take ownership.","The lack of structure will increase innovation."],"answer":1},{"prompt":"What helps organisational change become sustainable after the initial launch?","options":["One strong announcement from the CEO.","Continuous reinforcement, measurement, obstacle removal and accountability until the new behaviour becomes normal.","Avoiding discussion of setbacks.","Changing the message frequently to maintain attention."],"answer":1}],"written":[{"prompt":"Choose one organisational change you would lead. Explain the case for change: what needs to change, why now and what happens if nothing changes.","concepts":[["change","improve","issue"],["why now","urgent","now","timing"],["nothing changes","risk","consequence","cost"],["future","opportunity","outcome"]]},{"prompt":"Identify three stakeholder groups affected by your change and explain one likely source of support or resistance for each.","concepts":[["stakeholder","employee","manager","board","customer","client","team"],["support","benefit","opportunity"],["resistance","concern","fear","uncertainty"],["impact","role","workload","trust"]]},{"prompt":"Write a short executive change message using Reality, Direction, Reason, Role and Confidence.","concepts":[["reality","current","happening"],["direction","future","going"],["reason","why","matter"],["role","action","need"],["confidence","believe","possible"]]},{"prompt":"Translate one strategic change into an accountability plan. State the owner, first action, deadline, measure of progress and response if progress stalls.","concepts":[["owner","responsible"],["action","first step"],["deadline","date","time"],["measure","metric","progress"],["stall","review","correct","escalate"]]},{"prompt":"Name one behaviour you personally must demonstrate for a change initiative to remain credible, and explain how you will make it visible consistently.","concepts":[["behaviour","behavior","model"],["credible","credibility","trust"],["consistent","consistency","repeated"],["visible","action","example"]]}]}
};

function publicWeeklyTest(key) {
  const test = WEEKLY_TESTS[key];
  if (!test) return null;
  return {
    title: test.title,
    mcq: test.mcq.map(({ prompt, options }) => ({ prompt, options })),
    written: test.written.map(({ prompt }) => ({ prompt }))
  };
}

function validateTestAnswers(key, answers = {}) {
  const test = WEEKLY_TESTS[key];
  if (!test) return { ok: false, error: 'Weekly test is not configured.' };

  const mcq = Array.isArray(answers.mcq) ? answers.mcq : [];
  const written = Array.isArray(answers.written) ? answers.written : [];

  if (mcq.length !== 5 || mcq.some(v => v === null || v === undefined || v === '' || !Number.isInteger(Number(v)) || Number(v) < 0 || Number(v) > 3)) {
    return { ok: false, error: 'Answer all five multiple-choice questions.' };
  }
  if (written.length !== 5 || written.some(v => String(v || '').trim().length < 20)) {
    return { ok: false, error: 'Answer all five written questions with a complete response.' };
  }
  return { ok: true };
}

function conceptMatched(text, alternatives) {
  const value = String(text || '').toLowerCase();
  return alternatives.some(term => value.includes(term.toLowerCase()));
}

function scoreWeeklyTest(key, answers = {}) {
  const validation = validateTestAnswers(key, answers);
  if (!validation.ok) throw new Error(validation.error);

  const test = WEEKLY_TESTS[key];
  let mcqScore = 0;
  test.mcq.forEach((question, index) => {
    if (Number(answers.mcq[index]) === question.answer) mcqScore += 10;
  });

  let writtenScore = 0;
  test.written.forEach((question, index) => {
    const text = String(answers.written[index] || '').trim();
    const matched = question.concepts.filter(group => conceptMatched(text, group)).length;
    const conceptScore = question.concepts.length ? (matched / question.concepts.length) * 8 : 0;
    const completeness = text.length >= 60 ? 2 : text.length >= 35 ? 1 : 0;
    writtenScore += Math.min(10, conceptScore + completeness);
  });

  writtenScore = Math.round(writtenScore * 100) / 100;
  const score = Math.round((mcqScore + writtenScore) * 100) / 100;

  return {
    mcqScore,
    writtenScore,
    score,
    contribution: Math.round(score * 0.1 * 100) / 100
  };
}

module.exports = {
  WEEKLY_TESTS,
  publicWeeklyTest,
  validateTestAnswers,
  scoreWeeklyTest
};
