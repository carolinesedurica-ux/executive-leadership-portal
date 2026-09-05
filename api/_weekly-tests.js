const WEEKLY_TESTS = {
  week1: {
    title: 'Week 1 Knowledge & Application Test',
    mcq: [
      {
        prompt: 'Leadership identity is best understood as:',
        options: [
          'The title printed on your job description',
          'The consistent experience people have of your leadership',
          'How often you speak in meetings',
          'How senior your position is'
        ],
        answer: 1
      },
      {
        prompt: 'When you notice yourself hesitating in a leadership situation, the most useful question is:',
        options: [
          'How can I avoid making a mistake?',
          'What will people think of me?',
          'What does this situation need from me as a leader?',
          'Who else can make the decision?'
        ],
        answer: 2
      },
      {
        prompt: 'A practical way to strengthen leadership confidence is to:',
        options: [
          'Wait until you feel completely certain',
          'Build evidence by making prepared decisions and reflecting on outcomes',
          'Avoid difficult situations',
          'Speak more than everyone else'
        ],
        answer: 1
      },
      {
        prompt: 'Healthy self-esteem in leadership means:',
        options: [
          'Your worth depends on every result being successful',
          'You never doubt yourself',
          'You can separate your personal worth from a single performance outcome',
          'You do not need feedback'
        ],
        answer: 2
      },
      {
        prompt: 'The main purpose of a Leadership Compass is to:',
        options: [
          'Choose the leadership title you want',
          'Create an identity anchor around the qualities you want to demonstrate consistently',
          'Measure how popular you are',
          'Replace performance objectives'
        ],
        answer: 1
      }
    ],
    written: [
      {
        prompt: 'In your own words, explain what leadership identity means and how other people should experience it.',
        concepts: [
          ['values','qualities','principles'],
          ['behaviour','behavior','actions','conduct'],
          ['experience','others','people','team']
        ]
      },
      {
        prompt: 'Explain how self-trust supports better leadership decisions.',
        concepts: [
          ['judgement','judgment','decision'],
          ['evidence','preparation','experience'],
          ['act','action','confidence','decisive']
        ]
      },
      {
        prompt: 'Describe what you should do when you notice yourself hesitating in a leadership situation.',
        concepts: [
          ['pause','notice','recognise','recognize'],
          ['situation','need','requires'],
          ['leader','leadership','action','decide']
        ]
      },
      {
        prompt: 'Explain the difference between self-esteem and confidence in a leadership context.',
        concepts: [
          ['self-esteem','self esteem','worth','value'],
          ['confidence','ability','capability'],
          ['performance','outcome','result','task']
        ]
      },
      {
        prompt: 'Give one example of a behaviour that demonstrates accountability as a leader and explain why it matters.',
        concepts: [
          ['ownership','responsibility','accountability'],
          ['follow','action','deliver','commit'],
          ['trust','result','outcome','team']
        ]
      }
    ]
  },

  week2: {
    title: 'Week 2 Knowledge & Application Test',
    mcq: [
      {
        prompt: 'Executive presence is primarily built through:',
        options: [
          'Being the loudest person in the room',
          'Composure, clarity, communication and personal authority',
          'Using technical language',
          'Speaking first in every meeting'
        ],
        answer: 1
      },
      {
        prompt: 'A deliberate pause before answering can communicate:',
        options: [
          'Uncertainty',
          'Disinterest',
          'Composure and authority',
          'Lack of preparation'
        ],
        answer: 2
      },
      {
        prompt: 'When giving an executive update, the strongest structure usually begins with:',
        options: [
          'Every detail in chronological order',
          'Your recommendation or key point',
          'An apology for taking time',
          'A long background explanation'
        ],
        answer: 1
      },
      {
        prompt: 'When you feel evaluated or challenged, a useful leadership response is to:',
        options: [
          'Rush your words',
          'Over-explain to prove yourself',
          'Slow down and focus on contributing effectively',
          'Avoid eye contact'
        ],
        answer: 2
      },
      {
        prompt: 'Personal authority is strengthened when you:',
        options: [
          'Hold your position calmly while remaining open to evidence',
          'Refuse all feedback',
          'Use a louder voice',
          'Avoid disagreement'
        ],
        answer: 0
      }
    ],
    written: [
      {
        prompt: 'Describe what executive presence looks like in a high-pressure meeting.',
        concepts: [
          ['calm','composed','composure'],
          ['clear','clarity','concise'],
          ['authority','presence','confidence']
        ]
      },
      {
        prompt: 'Explain why pausing before answering can strengthen your leadership presence.',
        concepts: [
          ['pause','time','think'],
          ['calm','composure','control'],
          ['response','clarity','deliberate']
        ]
      },
      {
        prompt: 'Explain how to make an executive update more concise and influential.',
        concepts: [
          ['point','recommendation','message'],
          ['concise','brief','fewer','clear'],
          ['evidence','detail','support']
        ]
      },
      {
        prompt: 'What does personal authority mean, and how can a leader demonstrate it respectfully?',
        concepts: [
          ['authority','position','judgement','judgment'],
          ['calm','respect','respectful'],
          ['hold','boundary','position','decision']
        ]
      },
      {
        prompt: 'Describe one practical behaviour you can use when you feel judged or evaluated at work.',
        concepts: [
          ['slow','pause','breathe','composure'],
          ['focus','contribute','message'],
          ['clear','recommendation','response']
        ]
      }
    ]
  },

  week3: {
    title: 'Week 3 Knowledge & Application Test',
    mcq: [
      {
        prompt: 'Assertiveness means:',
        options: [
          'Avoiding disagreement to preserve harmony',
          'Expressing your position clearly while respecting the other person',
          'Winning the conversation',
          'Speaking aggressively when challenged'
        ],
        answer: 1
      },
      {
        prompt: 'In the CLEAR framework, the first step is to:',
        options: [
          'Agree the action',
          'Clarify the issue',
          'Review the outcome',
          'Explain your position'
        ],
        answer: 1
      },
      {
        prompt: 'A healthy workplace boundary should be:',
        options: [
          'Vague so nobody feels uncomfortable',
          'Clear, respectful and connected to an expectation or action',
          'Delivered only by email',
          'Used only after conflict'
        ],
        answer: 1
      },
      {
        prompt: 'When someone becomes defensive, an assertive leader should:',
        options: [
          'Become more aggressive',
          'Withdraw immediately',
          'Listen, stay calm and restate the issue or expectation clearly',
          'Change the subject'
        ],
        answer: 2
      },
      {
        prompt: 'Avoiding a necessary difficult conversation usually:',
        options: [
          'Removes the issue permanently',
          'Reduces accountability and allows the cost of the issue to continue',
          'Builds trust',
          'Makes expectations clearer'
        ],
        answer: 1
      }
    ],
    written: [
      {
        prompt: 'Explain the five steps of the CLEAR framework in your own words.',
        concepts: [
          ['clarify','issue'],
          ['listen','understand'],
          ['explain','position'],
          ['agree','action'],
          ['review','follow']
        ]
      },
      {
        prompt: 'Describe how you can disagree respectfully while still being assertive.',
        concepts: [
          ['clear','position','view'],
          ['respect','listen'],
          ['calm','boundary','evidence']
        ]
      },
      {
        prompt: 'Explain one cost of avoiding a necessary difficult conversation.',
        concepts: [
          ['avoid','delay','unresolved'],
          ['accountability','performance','trust','team'],
          ['cost','impact','continue','worse']
        ]
      },
      {
        prompt: 'Write an example of a clear workplace boundary and explain why it is assertive rather than aggressive.',
        concepts: [
          ['boundary','expectation','need'],
          ['clear','specific','action'],
          ['respect','calm','aggressive']
        ]
      },
      {
        prompt: 'Describe how you should respond when the other person becomes defensive during a difficult conversation.',
        concepts: [
          ['listen','understand'],
          ['calm','composed'],
          ['restate','issue','expectation','position']
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

  if (mcq.length !== 5 || mcq.some(v => !Number.isInteger(Number(v)) || Number(v) < 0 || Number(v) > 3)) {
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
