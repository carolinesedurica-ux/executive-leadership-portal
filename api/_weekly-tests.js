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
  }
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
