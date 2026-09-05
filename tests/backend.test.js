const test = require('node:test');
const assert = require('node:assert/strict');

process.env.SESSION_SECRET = 'unit-test-secret-that-is-not-used-in-production';

const { generateAccessToken, hashAccessToken } = require('../api/_tokens');
const { validateWeekEvidence, validateAssessmentPayload, nextMilestoneKey } = require('../api/_milestones');

test('milestone access tokens are random, human-readable and hashable', () => {
  const a = generateAccessToken();
  const b = generateAccessToken();
  assert.match(a, /^ELR-(?:[A-Z2-9]{4}-){4}[A-Z2-9]{4}$/);
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
