const { supabaseAdminClient, backendConfigured } = require('./_supabase');
const { MILESTONES, nextMilestoneKey, validateWeekEvidence, validateAssessmentPayload } = require('./_milestones');
const { generateAccessToken, hashAccessToken, tokenExpiry } = require('./_tokens');
const { storeCredential, readCredential, deleteCredential } = require('./_credential-store');
const { sendMilestoneAccessToken } = require('./_email');
const { scoreWeeklyTest } = require('./_weekly-tests');

const PROGRAMME_SLUG = 'executive-leadership-readiness';

function db() { return supabaseAdminClient(); }

async function recordAudit(participantId, event, milestoneId = null, metadata = {}) {
  const { error } = await db().from('audit_logs').insert({
    participant_id: participantId,
    event,
    milestone_id: milestoneId,
    metadata
  });
  if (error) console.error('Audit log failed', error.message);
}

async function programme() {
  const { data, error } = await db().from('programmes').select('*').eq('slug', PROGRAMME_SLUG).single();
  if (error || !data) throw new Error('Supabase programme seed is missing. Apply the backend migration first.');
  return data;
}

async function ensureParticipantFromAuthUser(user) {
  if (!backendConfigured()) return null;
  if (!user?.id || !user?.email) throw new Error('Verified Supabase user is required');
  if (!user.email_confirmed_at && !user.confirmed_at) throw new Error('Confirm your email before entering the coaching portal.');

  const email = String(user.email).trim().toLowerCase();
  const metadataName = String(user.user_metadata?.full_name || user.user_metadata?.name || '').trim();
  const fallbackName = email.split('@')[0];

  const { data: existingProfile, error: existingError } = await db().from('profiles')
    .select('*').eq('user_id', user.id).maybeSingle();
  if (existingError) throw existingError;

  let profile;
  if (existingProfile) {
    const updates = {
      email,
      role: 'client',
      email_verified_at: user.email_confirmed_at || user.confirmed_at || existingProfile.email_verified_at || new Date().toISOString()
    };
    if (metadataName) updates.full_name = metadataName;
    else if (!String(existingProfile.full_name || '').trim()) updates.full_name = fallbackName;

    const { data, error } = await db().from('profiles')
      .update(updates).eq('id', existingProfile.id).select('*').single();
    if (error) throw error;
    profile = data;
  } else {
    const { data, error } = await db().from('profiles').insert({
      user_id: user.id,
      full_name: metadataName || fallbackName,
      email,
      role: 'client',
      email_verified_at: user.email_confirmed_at || user.confirmed_at || new Date().toISOString()
    }).select('*').single();
    if (error) throw error;
    profile = data;
  }

  const prog = await programme();
  const { data: enrollment, error: enrollmentError } = await db().from('participant_programmes').upsert({
    participant_id: profile.id,
    programme_id: prog.id,
    status: 'active'
  }, { onConflict: 'participant_id,programme_id' }).select('*').single();
  if (enrollmentError) throw enrollmentError;

  const { data: week1, error: week1Error } = await db().from('milestones').select('id')
    .eq('programme_id', prog.id).eq('milestone_key', 'week1').single();
  if (week1Error || !week1) throw new Error('Week 1 milestone seed is missing.');

  const { data: existing } = await db().from('milestone_progress').select('id')
    .eq('participant_id', profile.id).eq('milestone_id', week1.id).maybeSingle();

  if (!existing) {
    const { error } = await db().from('milestone_progress').insert({
      participant_id: profile.id,
      milestone_id: week1.id,
      status: 'unlocked'
    });
    if (error) throw error;
    await recordAudit(profile.id, 'programme_enrolled', week1.id, { programme: PROGRAMME_SLUG });
  }

  return { profile, programme: prog, enrollment };
}

async function contextFromSession(current) {
  if (!backendConfigured()) return null;
  if (!current || current.role !== 'client') throw new Error('Client session required');

  let query = db().from('profiles').select('*');
  if (current.participantId) query = query.eq('id', current.participantId);
  else if (current.userId) query = query.eq('user_id', current.userId);
  else if (current.email) query = query.eq('email', String(current.email).toLowerCase());
  else throw new Error('Client session is not linked to a Supabase participant');

  const { data: profile, error } = await query.single();
  if (error || !profile) throw new Error('Participant profile was not found');

  const prog = await programme();
  const { data: enrollment, error: enrollmentError } = await db().from('participant_programmes').select('*')
    .eq('participant_id', profile.id).eq('programme_id', prog.id).single();
  if (enrollmentError || !enrollment) throw new Error('Programme enrollment was not found');

  return { profile, programme: prog, enrollment };
}

async function listParticipants() {
  if (!backendConfigured()) return [];
  const { data, error } = await db().from('profiles')
    .select('id,full_name,email,created_at')
    .eq('role', 'client')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function adminParticipantContext(participantId = null) {
  if (!backendConfigured()) return null;

  let query = db().from('profiles').select('*').eq('role', 'client');
  if (participantId) query = query.eq('id', participantId);
  else query = query.order('created_at', { ascending: false }).limit(1);

  const { data: profile, error } = await query.maybeSingle();
  if (error) throw error;
  if (!profile) return null;

  const prog = await programme();
  const { data: enrollment } = await db().from('participant_programmes').select('*')
    .eq('participant_id', profile.id).eq('programme_id', prog.id).maybeSingle();
  return enrollment ? { profile, programme: prog, enrollment } : null;
}

async function getMilestones(programmeId) {
  const { data, error } = await db().from('milestones')
    .select('id,milestone_key,milestone_number,title')
    .eq('programme_id', programmeId).order('milestone_number');
  if (error) throw error;
  return data || [];
}

async function getSummary(context) {
  const milestones = await getMilestones(context.programme.id);
  const milestoneById = new Map(milestones.map(item => [item.id, item]));
  const milestoneByKey = new Map(milestones.map(item => [item.milestone_key, item]));

  const { data: progressRows, error: progressError } = await db().from('milestone_progress')
    .select('milestone_id,status,score,started_at,completed_at')
    .eq('participant_id', context.profile.id);
  if (progressError) throw progressError;

  const entitlements = {};
  const completedKeys = [];
  for (const row of progressRows || []) {
    const milestone = milestoneById.get(row.milestone_id);
    if (!milestone) continue;
    entitlements[milestone.milestone_key] = ['unlocked', 'in_progress', 'completed'].includes(row.status);
    if (row.status === 'completed') completedKeys.push(milestone.milestone_key);
  }

  const { data: weeklyRows, error: weeklyError } = await db().from('weekly_test_results')
    .select('milestone_id,mcq_score,written_score,score,submitted_at')
    .eq('participant_id', context.profile.id);
  if (weeklyError) throw weeklyError;

  const weeklyTests = {};
  for (const row of weeklyRows || []) {
    const key = milestoneById.get(row.milestone_id)?.milestone_key;
    if (!['week1','week2','week3'].includes(key)) continue;
    weeklyTests[key] = {
      score: Number(row.score),
      mcqScore: Number(row.mcq_score),
      writtenScore: Number(row.written_score),
      contribution: Math.round(Number(row.score) * 0.1 * 100) / 100,
      submittedAt: row.submitted_at
    };
  }
  const weeklyWeightedScore = Math.round(
    ['week1','week2','week3'].reduce((sum, key) => sum + (weeklyTests[key]?.score || 0) * 0.1, 0) * 100
  ) / 100;
  const weeklyTestsComplete = ['week1','week2','week3'].every(key => weeklyTests[key]);

  const assessmentMilestone = milestoneByKey.get('assessment');
  let assessment = null;
  let attempts = [];
  if (assessmentMilestone) {
    const { data } = await db().from('assessment_results')
      .select('scores,reflections,average_score,submitted_at')
      .eq('participant_id', context.profile.id)
      .eq('milestone_id', assessmentMilestone.id)
      .maybeSingle();
    assessment = data || null;

    const { data: attemptRows, error: attemptError } = await db().from('assessment_attempts')
      .select('attempt_number,scores,reflections,final_assessment_percent,weekly_weighted_score,overall_score,passed,submitted_at')
      .eq('participant_id', context.profile.id)
      .eq('milestone_id', assessmentMilestone.id)
      .order('attempt_number', { ascending: true });
    if (attemptError) throw attemptError;
    attempts = (attemptRows || []).map(row => ({
      attemptNumber: row.attempt_number,
      finalAssessmentPercent: Number(row.final_assessment_percent),
      weeklyWeightedScore: Number(row.weekly_weighted_score),
      overallScore: Number(row.overall_score),
      passed: Boolean(row.passed),
      submittedAt: row.submitted_at,
      scores: row.scores,
      reflections: row.reflections
    }));
  }

  const latestAttempt = attempts.length ? attempts[attempts.length - 1] : null;
  const now = new Date().toISOString();

  const { data: validatedRows, error: validatedError } = await db().from('milestone_access_tokens')
    .select('milestone_id,used_at,revoked_at')
    .eq('participant_id', context.profile.id)
    .not('used_at', 'is', null)
    .is('revoked_at', null);
  if (validatedError) throw validatedError;
  const validatedCredentials = [...new Set((validatedRows || [])
    .map(row => milestoneById.get(row.milestone_id)?.milestone_key)
    .filter(Boolean))];

  const { data: credentials } = await db().from('milestone_access_tokens')
    .select('id,milestone_id,issued_at,expires_at,used_at,status,email_sent_at,email_last_error')
    .eq('participant_id', context.profile.id)
    .eq('status', 'active')
    .is('revoked_at', null)
    .gt('expires_at', now)
    .order('issued_at', { ascending: false })
    .limit(1);

  let activeCredential = null;
  if (credentials?.[0]) {
    const milestone = milestoneById.get(credentials[0].milestone_id);
    activeCredential = {
      milestoneKey: milestone?.milestone_key || null,
      milestoneTitle: milestone?.title || null,
      issuedAt: credentials[0].issued_at,
      expiresAt: credentials[0].expires_at,
      emailSent: Boolean(credentials[0].email_sent_at),
      emailError: credentials[0].email_last_error || null
    };
  }

  const firstHalfCompleted = ['week1', 'week2', 'week3'].filter(key => completedKeys.includes(key));
  return {
    backendAvailable: true,
    participant: {
      id: context.profile.id,
      email: context.profile.email,
      fullName: context.profile.full_name,
      emailVerified: Boolean(context.profile.email_verified_at)
    },
    completed: completedKeys,
    entitlements,
    weeklyTests,
    weeklyTestsComplete,
    weeklyWeightedScore,
    assessmentComplete: completedKeys.includes('assessment'),
    assessmentAttempts: attempts.map(({ scores, reflections, ...attempt }) => attempt),
    assessmentAttemptCount: attempts.length,
    assessmentAttemptsRemaining: Math.max(0, 3 - attempts.length),
    passMark: 80,
    overallScore: latestAttempt?.overallScore ?? null,
    finalAssessmentPercent: latestAttempt?.finalAssessmentPercent ?? null,
    assessmentPassed: Boolean(latestAttempt?.passed || completedKeys.includes('assessment')),
    midScores: Array.isArray(latestAttempt?.scores) ? latestAttempt.scores : (Array.isArray(assessment?.scores) ? assessment.scores : null),
    assessmentReflection: latestAttempt?.reflections || assessment?.reflections || null,
    validatedCredentials,
    activeCredential,
    needsMigration: firstHalfCompleted.length === 0 && !assessment
  };
}

function applySummaryToState(elrpState = {}, summary) {
  return {
    ...elrpState,
    completed: (summary.completed || []).filter(key => /^week\d+$/.test(key)),
    weeklyTests: summary.weeklyTests || elrpState.weeklyTests || {},
    weeklyWeightedScore: summary.weeklyWeightedScore ?? elrpState.weeklyWeightedScore,
    assessmentComplete: Boolean(summary.assessmentComplete),
    assessmentAttemptCount: summary.assessmentAttemptCount ?? 0,
    assessmentAttemptsRemaining: summary.assessmentAttemptsRemaining ?? 3,
    overallScore: summary.overallScore ?? null,
    finalAssessmentPercent: summary.finalAssessmentPercent ?? null,
    midScores: summary.midScores || elrpState.midScores,
    assessmentReflection: summary.assessmentReflection || elrpState.assessmentReflection
  };
}

async function transition(context, currentKey, options = {}) {
  const nextKey = nextMilestoneKey(currentKey);
  const issueCredential = Boolean(options.issueCredential && nextKey);
  const generatedToken = issueCredential ? generateAccessToken() : null;
  const credentialReference = issueCredential ? await storeCredential(generatedToken) : null;
  const tokenHash = generatedToken ? hashAccessToken(generatedToken) : null;
  const expiresAt = generatedToken ? tokenExpiry().toISOString() : null;

  try {
    const { data, error } = await db().rpc('complete_milestone_transition', {
      p_participant_id: context.profile.id,
      p_current_key: currentKey,
      p_next_key: nextKey,
      p_token_hash: tokenHash,
      p_credential_reference: credentialReference,
      p_expires_at: expiresAt,
      p_score: options.score ?? null,
      p_assessment_scores: options.assessmentScores ?? null,
      p_assessment_reflections: options.assessmentReflections ?? null
    });
    if (error) throw error;

    const row = Array.isArray(data) ? data[0] : data;
    if (!row) throw new Error('Milestone transition did not return a result');

    let emailSent = false;
    let emailError = null;

    if (!row.credential_created && credentialReference) await deleteCredential(credentialReference);

    if (row.credential_created && nextKey && options.sendEmail !== false) {
      try {
        await sendMilestoneAccessToken({
          to: context.profile.email,
          participantName: context.profile.full_name,
          completedTitle: MILESTONES[currentKey]?.title || currentKey,
          nextTitle: MILESTONES[nextKey]?.title || nextKey,
          token: generatedToken
        });
        emailSent = true;
        await db().from('milestone_access_tokens').update({
          email_sent_at: new Date().toISOString(),
          email_last_error: null
        }).eq('id', row.token_id);
        await recordAudit(context.profile.id, 'credential_email_sent', row.next_milestone_id, { tokenId: row.token_id });
      } catch (error) {
        emailError = error.message || 'Email delivery failed';
        await db().from('milestone_access_tokens').update({ email_last_error: emailError }).eq('id', row.token_id);
        await recordAudit(context.profile.id, 'credential_email_failed', row.next_milestone_id, {
          tokenId: row.token_id,
          error: emailError
        });
      }
    }

    return {
      summary: await getSummary(context),
      credentialIssued: Boolean(row.credential_created),
      emailSent,
      emailError
    };
  } catch (error) {
    if (credentialReference) await deleteCredential(credentialReference);
    throw error;
  }
}

async function completeMilestone(context, key, evidence, testAnswers, options = {}) {
  const validation = validateWeekEvidence(key, evidence);
  if (!validation.ok) throw new Error(validation.error);
  if (!['week1','week2','week3'].includes(key)) throw new Error('This weekly test is not configured.');

  const summaryBefore = await getSummary(context);
  if (summaryBefore.weeklyTests?.[key]) {
    throw new Error('This weekly test has already been submitted. Weekly tests can only be taken once.');
  }

  const testScore = scoreWeeklyTest(key, testAnswers || {});
  const milestones = await getMilestones(context.programme.id);
  const milestone = milestones.find(item => item.milestone_key === key);
  if (!milestone) throw new Error('Weekly milestone was not found.');

  const { data: inserted, error: insertError } = await db().from('weekly_test_results').insert({
    participant_id: context.profile.id,
    milestone_id: milestone.id,
    answers: testAnswers || {},
    mcq_score: testScore.mcqScore,
    written_score: testScore.writtenScore,
    score: testScore.score
  }).select('id').single();
  if (insertError) throw insertError;

  await recordAudit(context.profile.id, 'weekly_test_submitted', milestone.id, {
    milestoneKey: key,
    score: testScore.score,
    contribution: testScore.contribution
  });

  if (summaryBefore.completed.includes(key)) {
    await db().from('milestone_progress').update({ score: testScore.score })
      .eq('participant_id', context.profile.id)
      .eq('milestone_id', milestone.id);
    return {
      summary: await getSummary(context),
      weeklyTest: testScore,
      credentialIssued: false,
      emailSent: false,
      emailError: null,
      legacyCompletionPreserved: true
    };
  }

  try {
    const result = await transition(context, key, {
      ...options,
      score: testScore.score,
      issueCredential: false,
      sendEmail: false
    });
    return { ...result, weeklyTest: testScore };
  } catch (error) {
    await db().from('weekly_test_results').delete().eq('id', inserted.id);
    throw error;
  }
}

async function submitAssessment(context, payload, options = {}) {
  const validation = validateAssessmentPayload(payload);
  if (!validation.ok) throw new Error(validation.error);

  const summary = await getSummary(context);
  if (summary.assessmentComplete) {
    throw new Error('The Mid-Course Assessment has already been passed.');
  }
  if (!summary.completed.includes('week3')) {
    throw new Error('Complete Week 3 before submitting the Mid-Course Assessment.');
  }
  if (!summary.weeklyTestsComplete) {
    throw new Error('Complete the Week 1, Week 2 and Week 3 tests before submitting the Mid-Course Assessment.');
  }
  if (!summary.entitlements.assessment) {
    throw new Error('The Mid-Course Assessment is not yet unlocked.');
  }
  if (summary.assessmentAttemptCount >= 3) {
    throw new Error('All three assessment attempts have been used. Please contact your facilitator for the next step.');
  }

  const milestones = await getMilestones(context.programme.id);
  const assessmentMilestone = milestones.find(item => item.milestone_key === 'assessment');
  if (!assessmentMilestone) throw new Error('Assessment milestone was not found.');

  const attemptNumber = summary.assessmentAttemptCount + 1;
  const finalAssessmentPercent = Math.round(validation.average * 10 * 100) / 100;
  const weeklyWeightedScore = summary.weeklyWeightedScore;
  const overallScore = Math.round((weeklyWeightedScore + finalAssessmentPercent * 0.7) * 100) / 100;
  const passed = overallScore >= 80;

  const { error: attemptError } = await db().from('assessment_attempts').insert({
    participant_id: context.profile.id,
    milestone_id: assessmentMilestone.id,
    attempt_number: attemptNumber,
    scores: payload.scores.map(Number),
    reflections: payload.reflections,
    final_assessment_percent: finalAssessmentPercent,
    weekly_weighted_score: weeklyWeightedScore,
    overall_score: overallScore,
    passed
  });
  if (attemptError) throw attemptError;

  const { error: resultError } = await db().from('assessment_results').upsert({
    participant_id: context.profile.id,
    milestone_id: assessmentMilestone.id,
    scores: payload.scores.map(Number),
    reflections: payload.reflections,
    average_score: validation.average,
    submitted_at: new Date().toISOString()
  }, { onConflict: 'participant_id,milestone_id' });
  if (resultError) throw resultError;

  if (!passed) {
    const now = new Date().toISOString();
    await db().from('milestone_progress').update({
      status: 'in_progress',
      score: overallScore,
      started_at: now
    }).eq('participant_id', context.profile.id).eq('milestone_id', assessmentMilestone.id);

    await recordAudit(context.profile.id, 'assessment_attempt_failed', assessmentMilestone.id, {
      attemptNumber,
      finalAssessmentPercent,
      weeklyWeightedScore,
      overallScore,
      passMark: 80,
      attemptsRemaining: Math.max(0, 3 - attemptNumber)
    });

    return {
      summary: await getSummary(context),
      passed: false,
      attemptNumber,
      attemptsRemaining: Math.max(0, 3 - attemptNumber),
      finalAssessmentPercent,
      weeklyWeightedScore,
      overallScore,
      passMark: 80,
      credentialIssued: false,
      emailSent: false,
      emailError: null
    };
  }

  const transitionResult = await transition(context, 'assessment', {
    sendEmail: options.sendEmail,
    score: overallScore,
    issueCredential: true
  });

  await recordAudit(context.profile.id, 'assessment_passed', assessmentMilestone.id, {
    attemptNumber,
    finalAssessmentPercent,
    weeklyWeightedScore,
    overallScore,
    passMark: 80
  });

  return {
    ...transitionResult,
    passed: true,
    attemptNumber,
    attemptsRemaining: Math.max(0, 3 - attemptNumber),
    finalAssessmentPercent,
    weeklyWeightedScore,
    overallScore,
    passMark: 80
  };
}

async function importLegacyState(context, elrpState = {}) {
  const summary = await getSummary(context);
  return { imported: false, summary };
}

async function resendCurrentCredential(context, options = {}) {
  const now = new Date();
  const since = new Date(now.getTime() - 5 * 60 * 1000).toISOString();

  if (!options.bypassRateLimit) {
    const { count, error } = await db().from('audit_logs')
      .select('id', { count: 'exact', head: true })
      .eq('participant_id', context.profile.id)
      .eq('event', 'credential_resend_requested')
      .gte('created_at', since);
    if (error) throw error;
    if (count > 0) throw new Error('Please wait a few minutes before requesting another credential email.');
  }

  const { data: tokens, error } = await db().from('milestone_access_tokens')
    .select('id,milestone_id,credential_reference,expires_at')
    .eq('participant_id', context.profile.id)
    .eq('status', 'active')
    .is('revoked_at', null)
    .gt('expires_at', now.toISOString())
    .order('issued_at', { ascending: false })
    .limit(1);
  if (error) throw error;
  const tokenRow = tokens?.[0];
  if (!tokenRow) throw new Error('There is no active access credential to resend.');

  const milestones = await getMilestones(context.programme.id);
  const milestone = milestones.find(item => item.id === tokenRow.milestone_id);
  if (!milestone) throw new Error('Credential milestone was not found.');

  if (!options.bypassRateLimit) await recordAudit(context.profile.id, 'credential_resend_requested', milestone.id);

  const rawToken = await readCredential(tokenRow.credential_reference);
  try {
    await sendMilestoneAccessToken({
      to: context.profile.email,
      participantName: context.profile.full_name,
      completedTitle: 'Your previous programme milestone',
      nextTitle: milestone.title,
      token: rawToken
    });
    await db().from('milestone_access_tokens').update({
      email_sent_at: new Date().toISOString(),
      email_last_error: null
    }).eq('id', tokenRow.id);
    await recordAudit(context.profile.id, options.event || 'credential_email_resent', milestone.id, { tokenId: tokenRow.id });
    return { ok: true, emailSent: true, summary: await getSummary(context) };
  } catch (sendError) {
    await db().from('milestone_access_tokens').update({
      email_last_error: sendError.message || 'Email delivery failed'
    }).eq('id', tokenRow.id);
    await recordAudit(context.profile.id, 'credential_email_failed', milestone.id, {
      tokenId: tokenRow.id,
      error: sendError.message || 'Email delivery failed'
    });
    throw sendError;
  }
}

async function validateCredential(context, milestoneKey, rawToken) {
  const now = new Date();
  const since = new Date(now.getTime() - 10 * 60 * 1000).toISOString();

  const { count: recentFailures, error: failureError } = await db().from('audit_logs')
    .select('id', { count: 'exact', head: true })
    .eq('participant_id', context.profile.id)
    .eq('event', 'credential_validation_failed')
    .gte('created_at', since);
  if (failureError) throw failureError;
  if (recentFailures >= 5) {
    throw new Error('Too many incorrect credential attempts. Please wait 10 minutes and try again.');
  }

  const milestones = await getMilestones(context.programme.id);
  const milestone = milestones.find(item => item.milestone_key === milestoneKey);
  if (!milestone) throw new Error('Milestone was not found.');

  const hash = hashAccessToken(rawToken);
  const { data: tokenRow, error } = await db().from('milestone_access_tokens')
    .select('id,expires_at,revoked_at,status')
    .eq('participant_id', context.profile.id)
    .eq('milestone_id', milestone.id)
    .eq('token_hash', hash)
    .maybeSingle();
  if (error) throw error;

  const valid = Boolean(
    tokenRow &&
    tokenRow.status === 'active' &&
    !tokenRow.revoked_at &&
    new Date(tokenRow.expires_at).getTime() > Date.now()
  );

  if (valid) {
    await db().from('milestone_access_tokens').update({ used_at: new Date().toISOString() }).eq('id', tokenRow.id);
    await recordAudit(context.profile.id, 'credential_validated', milestone.id, { tokenId: tokenRow.id });
  } else {
    await recordAudit(context.profile.id, 'credential_validation_failed', milestone.id);
  }

  return { valid };
}

module.exports = {
  backendConfigured,
  ensureParticipantFromAuthUser,
  contextFromSession,
  adminParticipantContext,
  listParticipants,
  getSummary,
  applySummaryToState,
  completeMilestone,
  submitAssessment,
  importLegacyState,
  resendCurrentCredential,
  validateCredential
};
