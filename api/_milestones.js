const MILESTONES = {
  week1: { number: 1, title: 'Leadership Identity & Confidence', next: 'week2' },
  week2: { number: 2, title: 'Executive Presence & Personal Authority', next: 'week3' },
  week3: { number: 3, title: 'Assertiveness & Difficult Conversations', next: 'assessment' },
  assessment: { number: 4, title: 'Mid-Course Leadership Assessment', next: 'week4' },
  week4: { number: 5, title: 'Leading People with Confidence', next: 'week5' },
  week5: { number: 6, title: 'Workplace Dynamics, Influence & Executive Communication', next: 'week6' },
  week6: { number: 7, title: 'Leadership Integration & Personal Action Plan', next: null }
};

function nextMilestoneKey(key) {
  return MILESTONES[key]?.next || null;
}

function validateWeekEvidence(key, evidence = {}) {
  if (!['week1', 'week2', 'week3'].includes(key)) {
    return { ok: false, error: 'This milestone is not yet configured for server completion.' };
  }

  const reflections = Array.isArray(evidence.reflections) ? evidence.reflections : [];
  if (reflections.length < 3 || reflections.some(value => !String(value || '').trim())) {
    return { ok: false, error: 'Complete all three reflection questions before finishing this week.' };
  }

  const checks = evidence.checks || {};
  const required = ['watch', 'reflect', 'coach', 'apply'];
  const missing = required.filter(name => checks[name] !== true);
  if (missing.length) {
    return { ok: false, error: 'Complete all four end-of-week check-in items before finishing this week.' };
  }

  return { ok: true };
}

function validateAssessmentPayload(payload = {}) {
  const scores = Array.isArray(payload.scores) ? payload.scores.map(Number) : [];
  if (scores.length !== 12 || scores.some(score => !Number.isFinite(score) || score < 1 || score > 10)) {
    return { ok: false, error: 'Complete all assessment scores from 1 to 10.' };
  }

  const reflections = payload.reflections || {};
  const required = ['greatestImprovement', 'evidenceSituation', 'remainingChallenge'];
  const missing = required.filter(key => !String(reflections[key] || '').trim());
  if (missing.length) {
    return { ok: false, error: 'Complete all assessment reflection questions before submitting.' };
  }

  return { ok: true, average: scores.reduce((sum, score) => sum + score, 0) / scores.length };
}

module.exports = { MILESTONES, nextMilestoneKey, validateWeekEvidence, validateAssessmentPayload };
