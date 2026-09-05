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
      'Leadership identity is built from values and qualities shown through behaviour so other people experience consistent leadership.',
      'Self-trust uses judgement supported by preparation and experience so a leader can act with confidence and make a decision.',
      'I notice hesitation, pause, ask what the situation needs, and choose the leadership action required.',
      'Self-esteem is personal worth beyond one performance result, while confidence is belief in ability and capability for a task.',
      'Accountability means taking ownership and responsibility, following through on commitments and actions, and building team trust through results.'
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
