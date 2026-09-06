const test = require('node:test');
const assert = require('node:assert/strict');

process.env.SESSION_SECRET = 'unit-test-secret-that-is-not-used-in-production';

const { generateAccessToken, hashAccessToken } = require('../api/_tokens');
const { validateWeekEvidence, validateAssessmentPayload, nextMilestoneKey } = require('../api/_milestones');
const { WEEKLY_TESTS, scoreWeeklyTest } = require('../api/_weekly-tests');

test('milestone access tokens are random, human-readable and hashable', () => {
  const a = generateAccessToken();
  const b = generateAccessToken();
  assert.match(a, /^[A-HJ-NP-Z2-9]{7}$/);
  assert.notEqual(a, b);
  assert.equal(hashAccessToken(a).length, 64);
  assert.notEqual(hashAccessToken(a), a);
});

test('week completion requires reflections and all existing check-in items', () => {
  const evidence = {
    reflections: ['one', 'two', 'three'],
    checks: { watch: true, reflect: true, coach: true, apply: true }
  };
  assert.equal(validateWeekEvidence('week1', evidence).ok, true);
  assert.equal(validateWeekEvidence('week1', { ...evidence, checks: { ...evidence.checks, apply: false } }).ok, false);
});

test('assessment validates the existing submit-to-unlock fields', () => {
  const payload = {
    scores: Array(12).fill(7),
    reflections: {
      greatestImprovement: 'Confidence',
      evidenceSituation: 'A meeting',
      remainingChallenge: 'Difficult conversations'
    }
  };
  const result = validateAssessmentPayload(payload);
  assert.equal(result.ok, true);
  assert.equal(result.average, 7);
});

test('milestone order matches the programme progression', () => {
  assert.equal(nextMilestoneKey('week1'), 'week2');
  assert.equal(nextMilestoneKey('week2'), 'week3');
  assert.equal(nextMilestoneKey('week3'), 'assessment');
  assert.equal(nextMilestoneKey('assessment'), 'week4');
});


test('weekly tests contain five multiple-choice and five written questions', () => {
  for (const key of ['week1','week2','week3']) {
    assert.equal(WEEKLY_TESTS[key].mcq.length, 5);
    assert.equal(WEEKLY_TESTS[key].written.length, 5);
  }
});

test('a fully correct weekly test scores 100 and contributes 10 percent', () => {
  const key = 'week1';
  const answers = {
    mcq: WEEKLY_TESTS[key].mcq.map(q => q.answer),
    written: [
      'As a leader, I want people and my team to experience me as calm, clear and accountable. I will demonstrate those qualities through visible behaviour by making decisions clearly and following through on commitments.',
      'I would gather the available evidence and facts, define the decision criteria, use my judgement to decide, identify the risk and uncertainty, then review and adjust if new information becomes available.',
      'My personal worth and self-esteem do not depend on one performance result or mistake. I can own the outcome, review what happened, learn from it, correct the issue and remain accountable.',
      'I tend to hesitate and over-explain when challenged. I would decide on my position and communicate it clearly and concisely: “My recommendation is that we proceed with option A because it best meets the agreed criteria.”',
      'My leadership non-negotiable is accountability. The observable behaviour is taking ownership and following through on commitments; under pressure I will remain consistent and address any missed standard directly.'
    ]
  };
  const result = scoreWeeklyTest(key, answers);
  assert.equal(result.mcqScore, 50);
  assert.equal(result.score, 100);
  assert.equal(result.contribution, 10);
});

test('weighted assessment uses 30 percent weekly tests and 70 percent final assessment', () => {
  const weeklyScores = [80, 90, 100];
  const weeklyWeighted = weeklyScores.reduce((sum, score) => sum + score * 0.1, 0);
  const finalAssessmentPercent = 80;
  const overall = weeklyWeighted + finalAssessmentPercent * 0.7;
  assert.equal(weeklyWeighted, 27);
  assert.equal(overall, 83);
  assert.equal(overall >= 80, true);
});


test('Week 2 executive communication assessment can award the full 10 percent contribution', () => {
  const key = 'week2';
  const answers = {
    mcq: WEEKLY_TESTS[key].mcq.map(q => q.answer),
    written: [
      'My key message is that the project is two weeks late. The evidence shows supplier delay and testing risk. My recommendation is to approve the revised delivery date and the next step is to confirm it today. I will keep the update concise and clear.',
      'I would pause, breathe and slow my pace so I regain composure. I would clarify the question before responding. My first sentence would be: The figure you are asking about is based on the latest verified data, and I can explain the assumption behind it.',
      'I over-explain by giving too much background detail. I will lead with the key point and recommendation, add only the evidence and reason that support it, and keep the message concise with fewer words.',
      'Personal authority means I listen to understand the disagreement, hold my position calmly and respectfully when the reasoning is sound, and adjust or reconsider if better evidence changes the decision.',
      'I will prepare a clear structure and rehearse it. I will lead with the key point, slow my pace, pause rather than fill silence, use fewer words, and close with the next step or decision needed.'
    ]
  };
  const result = scoreWeeklyTest(key, answers);
  assert.equal(result.score, 100);
  assert.equal(result.contribution, 10);
});

test('Week 3 difficult-conversation assessment can award the full 10 percent contribution', () => {
  const key = 'week3';
  const answers = {
    mcq: WEEKLY_TESTS[key].mcq.map(q => q.answer),
    written: [
      'The last two agreed deadlines were missed, and the delay affected the team handover. I want us to discuss what happened and understand the issue so we can agree a clear way forward respectfully and specifically.',
      'I will Clarify the issue using facts, Listen to understand their perspective, Explain my position and the impact, Agree the action and owner, and Review the follow-up at the agreed check-in.',
      'My boundary is that requests received after the agreed cut-off need at least one working day of notice unless they are genuine emergencies. I will state that expectation clearly and professionally, and if it is not respected I will move the request to the next available slot and confirm that action.',
      'I would acknowledge the concern and listen to understand it, stay calm and composed, then restate the specific fact, impact and expectation. I would hold the position and return to the required action or next step.',
      'The next action is for the manager to revise the report. The owner is the manager, the required standard is the agreed template and complete data, the deadline is Thursday at 15:00, and we will review it together Friday morning.'
    ]
  };
  const result = scoreWeeklyTest(key, answers);
  assert.equal(result.score, 100);
  assert.equal(result.contribution, 10);
});
