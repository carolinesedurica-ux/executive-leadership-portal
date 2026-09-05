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
