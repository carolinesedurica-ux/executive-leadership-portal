const { supabaseAdminClient, backendConfigured, configuredEmails } = require('./_supabase');
const { MILESTONES, nextMilestoneKey, validateWeekEvidence, validateAssessmentPayload } = require('./_milestones');
const { generateAccessToken, hashAccessToken, tokenExpiry } = require('./_tokens');
const { storeCredential, readCredential, deleteCredential } = require('./_credential-store');
const { sendMilestoneAccessToken } = require('./_email');

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

  const fullName = user.user_metadata?.full_name || user.user_metadata?.name || String(user.email).split('@')[0];
  const { data: profile, error: profileError } = await db().from('profiles').upsert({
    user_id: user.id,
    full_name: fullName,
    email: String(user.email).toLowerCase(),
    role: 'client',
    email_verified_at: user.email_confirmed_at || user.confirmed_at || new Date().toISOString()
  }, { onConflict: 'user_id' }).select('*').single();
  if (profileError) throw profileError;

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

async function adminParticipantContext() {
  if (!backendConfigured()) return null;
  const emails = configuredEmails();
  let profile;

  if (emails.length) {
    const { data } = await db().from('profiles').select('*').eq('email', emails[0]).maybeSingle();
    profile = data || null;
  }

  if (!profile) {
    const { data } = await db().from('profiles').select('*').eq('role', 'client')
      .order('created_at', { ascending: true }).limit(1).maybeSingle();
    profile = data || null;
  }

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

  const assessmentMilestone = milestoneByKey.get('assessment');
  let assessment = null;
  if (assessmentMilestone) {
    const { data } = await db().from('assessment_results')
      .select('scores,reflections,average_score,submitted_at')
      .eq('participant_id', context.profile.id)
      .eq('milestone_id', assessmentMilestone.id)
      .maybeSingle();
    assessment = data || null;
  }

  const now = new Date().toISOString();
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
    assessmentComplete: completedKeys.includes('assessment'),
    midScores: Array.isArray(assessment?.scores) ? assessment.scores : null,
    assessmentReflection: assessment?.reflections || null,
    activeCredential,
    needsMigration: firstHalfCompleted.length === 0 && !assessment
  };
}

function applySummaryToState(elrpState = {}, summary) {
  return {
    ...elrpState,
    completed: (summary.completed || []).filter(key => /^week\d+$/.test(key)),
    assessmentComplete: Boolean(summary.assessmentComplete),
    midScores: summary.midScores || elrpState.midScores,
    assessmentReflection: summary.assessmentReflection || elrpState.assessmentReflection
  };
}

async function transition(context, currentKey, options = {}) {
  const nextKey = nextMilestoneKey(currentKey);
  const generatedToken = nextKey ? generateAccessToken() : null;
  const credentialReference = nextKey ? await storeCredential(generatedToken) : null;
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

async function completeMilestone(context, key, evidence, options = {}) {
  const validation = validateWeekEvidence(key, evidence);
  if (!validation.ok) throw new Error(validation.error);
  return transition(context, key, options);
}

async function submitAssessment(context, payload, options = {}) {
  const validation = validateAssessmentPayload(payload);
  if (!validation.ok) throw new Error(validation.error);

  const summary = await getSummary(context);
  if (!summary.completed.includes('week3')) {
    throw new Error('Complete Week 3 before submitting the mandatory mid-course assessment.');
  }
  if (!summary.entitlements.assessment) {
    throw new Error('The Mid-Course Assessment is not yet unlocked.');
  }

  return transition(context, 'assessment', {
    sendEmail: options.sendEmail,
    score: validation.average,
    assessmentScores: payload.scores.map(Number),
    assessmentReflections: payload.reflections
  });
}

async function importLegacyState(context, elrpState = {}) {
  let imported = false;
  let summary = await getSummary(context);
  const declared = Array.isArray(elrpState.completed) ? elrpState.completed : [];

  for (const key of ['week1', 'week2', 'week3']) {
    if (summary.completed.includes(key)) continue;
    if (!declared.includes(key)) break;
    if (!summary.entitlements[key]) break;

    const evidence = {
      reflections: [0, 1, 2].map(i => elrpState.reflections?.[key + '-' + i] || ''),
      checks: {
        watch: elrpState[key + '-watch'] === true,
        reflect: elrpState[key + '-reflect'] === true,
        coach: elrpState[key + '-coach'] === true,
        apply: elrpState[key + '-apply'] === true
      }
    };

    const validation = validateWeekEvidence(key, evidence);
    if (!validation.ok) break;
    await completeMilestone(context, key, evidence, { sendEmail: false });
    imported = true;
    summary = await getSummary(context);
  }

  if (
    elrpState.assessmentComplete &&
    summary.completed.includes('week3') &&
    !summary.assessmentComplete &&
    summary.entitlements.assessment
  ) {
    const payload = { scores: elrpState.midScores, reflections: elrpState.assessmentReflection || {} };
    const validation = validateAssessmentPayload(payload);
    if (validation.ok) {
      await submitAssessment(context, payload, { sendEmail: false });
      imported = true;
      summary = await getSummary(context);
    }
  }

  if (imported) {
    await recordAudit(context.profile.id, 'legacy_progress_imported', null, {
      source: 'browser-localStorage',
      completed: summary.completed
    });
    try {
      await resendCurrentCredential(context, { bypassRateLimit: true, event: 'migration_credential_email' });
      summary = await getSummary(context);
    } catch {}
  }

  return { imported, summary };
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
  getSummary,
  applySummaryToState,
  completeMilestone,
  submitAssessment,
  importLegacyState,
  resendCurrentCredential,
  validateCredential
};
