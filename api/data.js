const { session, json } = require('./_lib');
const { supabaseAdminClient, backendConfigured } = require('./_supabase');
const {
  contextFromSession,
  adminParticipantContext,
  listParticipants,
  getSummary,
  applySummaryToState
} = require('./_progress');

function db() {
  return supabaseAdminClient();
}

async function readParticipantWorkspace(context) {
  const { data: row, error } = await db().from('participant_workspace')
    .select('elrp_state,daily_habits,priority_focus,updated_at')
    .eq('participant_id', context.profile.id)
    .maybeSingle();
  if (error) throw error;

  const summary = await getSummary(context);
  const elrpState = applySummaryToState(row?.elrp_state || {}, summary);

  return {
    participantId: context.profile.id,
    clientName: context.profile.full_name,
    clientEmail: context.profile.email,
    updatedAt: row?.updated_at || null,
    elrpState,
    elrpDailyHabits: row?.daily_habits || {},
    elrpPriorityFocus: row?.priority_focus || {},
    source: 'supabase-participant-workspace'
  };
}

function contribution(score) {
  return Math.round(Number(score || 0) * 0.1 * 100) / 100;
}

async function developerOverview() {
  const { data: profiles, error: profileError } = await db().from('profiles')
    .select('id,full_name,email,role,email_verified_at,created_at')
    .eq('role', 'client')
    .order('created_at', { ascending: true });
  if (profileError) throw profileError;

  const [milestoneQ, progressQ, testQ, attemptQ, enrollmentQ] = await Promise.all([
    db().from('milestones').select('id,milestone_key,title,milestone_number').order('milestone_number'),
    db().from('milestone_progress').select('participant_id,milestone_id,status,score,started_at,completed_at,updated_at'),
    db().from('weekly_test_results').select('participant_id,milestone_id,score,mcq_score,written_score,submitted_at'),
    db().from('assessment_attempts').select('participant_id,attempt_number,overall_score,passed,submitted_at'),
    db().from('participant_programmes').select('participant_id,status,enrolled_at,completed_at')
  ]);
  for (const query of [milestoneQ, progressQ, testQ, attemptQ, enrollmentQ]) {
    if (query.error) throw query.error;
  }

  const milestones = milestoneQ.data || [];
  const byMilestone = new Map(milestones.map(item => [item.id, item]));

  return (profiles || []).map(profile => {
    const progress = (progressQ.data || []).filter(item => item.participant_id === profile.id);
    const tests = (testQ.data || []).filter(item => item.participant_id === profile.id).map(item => ({
      ...item,
      milestoneKey: byMilestone.get(item.milestone_id)?.milestone_key || null
    }));
    const attempts = (attemptQ.data || []).filter(item => item.participant_id === profile.id)
      .sort((a, b) => a.attempt_number - b.attempt_number);
    const latestAttempt = attempts[attempts.length - 1] || null;
    const active = progress.filter(item => ['unlocked', 'in_progress'].includes(item.status))
      .sort((a, b) => (byMilestone.get(b.milestone_id)?.milestone_number || 0) - (byMilestone.get(a.milestone_id)?.milestone_number || 0))[0];

    return {
      ...profile,
      enrollment: (enrollmentQ.data || []).find(item => item.participant_id === profile.id) || null,
      completedWeeks: progress.filter(item => item.status === 'completed' && /^week/.test(byMilestone.get(item.milestone_id)?.milestone_key || '')).length,
      currentMilestone: active ? byMilestone.get(active.milestone_id)?.milestone_key || null : null,
      weeklyTests: tests,
      firstHalfWeighted: Math.round(['week1','week2','week3'].reduce((sum, key) => sum + (tests.find(item => item.milestoneKey === key)?.score || 0) * 0.1, 0) * 100) / 100,
      secondHalfWeighted: Math.round(['week4','week5','week6'].reduce((sum, key) => sum + (tests.find(item => item.milestoneKey === key)?.score || 0) * 0.1, 0) * 100) / 100,
      assessmentAttempts: attempts.length,
      latestOverallScore: latestAttempt ? Number(latestAttempt.overall_score) : null,
      assessmentPassed: Boolean(latestAttempt?.passed)
    };
  });
}

async function developerDetail(participantId) {
  const { data: profile, error: profileError } = await db().from('profiles')
    .select('id,full_name,email,role,email_verified_at,created_at,updated_at')
    .eq('id', participantId)
    .eq('role', 'client')
    .maybeSingle();
  if (profileError) throw profileError;
  if (!profile) return null;

  const { data: milestones, error: milestoneError } = await db().from('milestones')
    .select('id,milestone_key,title,milestone_number')
    .order('milestone_number');
  if (milestoneError) throw milestoneError;
  const byMilestone = new Map((milestones || []).map(item => [item.id, item]));

  const [workspaceQ, enrollmentQ, progressQ, testsQ, resultQ, attemptsQ, credentialsQ, auditQ] = await Promise.all([
    db().from('participant_workspace').select('elrp_state,daily_habits,priority_focus,updated_at').eq('participant_id', participantId).maybeSingle(),
    db().from('participant_programmes').select('status,enrolled_at,completed_at').eq('participant_id', participantId).maybeSingle(),
    db().from('milestone_progress').select('milestone_id,status,score,started_at,completed_at,updated_at').eq('participant_id', participantId),
    db().from('weekly_test_results').select('milestone_id,answers,mcq_score,written_score,score,submitted_at').eq('participant_id', participantId).order('submitted_at'),
    db().from('assessment_results').select('milestone_id,scores,reflections,average_score,submitted_at,updated_at').eq('participant_id', participantId),
    db().from('assessment_attempts').select('milestone_id,attempt_number,scores,reflections,final_assessment_percent,weekly_weighted_score,overall_score,passed,submitted_at').eq('participant_id', participantId).order('attempt_number'),
    db().from('milestone_access_tokens').select('milestone_id,issued_at,expires_at,used_at,revoked_at,status,email_sent_at,email_last_error').eq('participant_id', participantId).order('issued_at', { ascending: false }),
    db().from('audit_logs').select('event,milestone_id,created_at,metadata').eq('participant_id', participantId).order('created_at', { ascending: false }).limit(100)
  ]);
  for (const query of [workspaceQ, enrollmentQ, progressQ, testsQ, resultQ, attemptsQ, credentialsQ, auditQ]) {
    if (query.error) throw query.error;
  }

  const addMilestone = row => ({
    ...row,
    milestoneKey: byMilestone.get(row.milestone_id)?.milestone_key || null,
    milestoneTitle: byMilestone.get(row.milestone_id)?.title || null
  });

  const tests = (testsQ.data || []).map(addMilestone).map(item => ({
    ...item,
    contribution: contribution(item.score)
  }));

  return {
    profile,
    enrollment: enrollmentQ.data || null,
    workspace: workspaceQ.data || { elrp_state: {}, daily_habits: {}, priority_focus: {}, updated_at: null },
    milestones: milestones || [],
    progress: (progressQ.data || []).map(addMilestone),
    weeklyTests: tests,
    firstHalfWeighted: Math.round(['week1','week2','week3'].reduce((sum, key) => sum + (tests.find(item => item.milestoneKey === key)?.score || 0) * 0.1, 0) * 100) / 100,
    secondHalfWeighted: Math.round(['week4','week5','week6'].reduce((sum, key) => sum + (tests.find(item => item.milestoneKey === key)?.score || 0) * 0.1, 0) * 100) / 100,
    assessmentResults: (resultQ.data || []).map(addMilestone),
    assessmentAttempts: (attemptsQ.data || []).map(addMilestone),
    credentials: (credentialsQ.data || []).map(addMilestone),
    audit: (auditQ.data || []).map(addMilestone)
  };
}

module.exports = async function handler(req, res) {
  try {
    const current = session(req);
    if (!current) return json(res, 401, { error: 'Sign in required.' });
    if (!backendConfigured()) {
      return json(res, 503, {
        error: 'Online participant storage is not configured.',
        cloudAvailable: false,
        backendAvailable: false
      });
    }

    if (req.method === 'GET') {
      const developerMode = current.role === 'admin' && String(req.query?.developer || '') === '1';
      if (developerMode) {
        const participants = await developerOverview();
        const requestedId = String(req.query?.participantId || '').trim();
        const detail = requestedId ? await developerDetail(requestedId) : null;
        return json(res, 200, {
          developer: true,
          participants,
          detail,
          selectedParticipantId: requestedId || null,
          generatedAt: new Date().toISOString(),
          cloudAvailable: true,
          backendAvailable: true
        });
      }

      if (current.role === 'admin') {
        const participants = await listParticipants();
        const requestedId = String(req.query?.participantId || '');
        const selectedId = requestedId || participants[0]?.id || null;
        const context = selectedId ? await adminParticipantContext(selectedId) : null;
        const data = context ? await readParticipantWorkspace(context) : null;
        return json(res, 200, {
          data,
          participants,
          selectedParticipantId: context?.profile?.id || null,
          cloudAvailable: true,
          backendAvailable: true
        });
      }

      const context = await contextFromSession(current);
      const data = await readParticipantWorkspace(context);
      return json(res, 200, {
        data,
        cloudAvailable: true,
        backendAvailable: true
      });
    }

    if (req.method === 'POST') {
      if (current.role !== 'client') {
        return json(res, 403, { error: 'Only the client portal can update coaching responses.' });
      }

      const context = await contextFromSession(current);
      const body = req.body || {};
      const summary = await getSummary(context);
      const elrpState = applySummaryToState(body.elrpState || {}, summary);
      const updatedAt = new Date().toISOString();

      const { error } = await db().from('participant_workspace').upsert({
        participant_id: context.profile.id,
        elrp_state: elrpState,
        daily_habits: body.elrpDailyHabits || {},
        priority_focus: body.elrpPriorityFocus || {},
        updated_at: updatedAt
      }, { onConflict: 'participant_id' });
      if (error) throw error;

      return json(res, 200, {
        ok: true,
        updatedAt,
        participantId: context.profile.id,
        cloudAvailable: true,
        backendAvailable: true
      });
    }

    return json(res, 405, { error: 'Method not allowed' });
  } catch (error) {
    return json(res, 500, {
      error: error.message || 'Unable to access participant coaching data.',
      cloudAvailable: false
    });
  }
};