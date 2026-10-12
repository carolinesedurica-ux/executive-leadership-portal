const { session, setSession, json } = require('./_lib');
const { supabaseClient, supabaseAdminClient, backendConfigured } = require('./_supabase');
const { validateState } = require('./_speaking');

const TABLE = 'speaking_enrolments';
function payload(row) {
  return { participantId: row.user_id, clientName: row.full_name, clientEmail: row.email, updatedAt: row.updated_at,
    elrpState: row.workspace || {}, elrpDailyHabits: {}, elrpPriorityFocus: {}, programme: 'presentation-speaking-skills' };
}

module.exports = async function handler(req, res) {
  try {
    if (!backendConfigured()) return json(res, 503, { error: 'Online programme storage is temporarily unavailable.', cloudAvailable: false });
    const db = supabaseAdminClient();
    if (req.method === 'POST' && req.query?.action === 'session') {
      const token = String(req.body?.accessToken || '');
      if (!token) return json(res, 400, { error: 'Missing access token.' });
      const { data, error } = await supabaseClient().auth.getUser(token);
      const user = data?.user;
      if (error || !user?.email) return json(res, 401, { error: 'Sign in again to continue.' });
      if (!user.email_confirmed_at && !user.confirmed_at) return json(res, 403, { error: 'Confirm your email before entering the programme.' });
      // Separate enrolment: this never creates or updates an ELP profile, milestone or workspace.
      const { error: insertError } = await db.from(TABLE).upsert({ user_id: user.id,
        full_name: String(user.user_metadata?.full_name || user.email.split('@')[0]).slice(0, 120),
        email: user.email.toLowerCase() }, { onConflict: 'user_id', ignoreDuplicates: true });
      if (insertError) throw insertError;
      const { data: row, error: readError } = await db.from(TABLE).select('user_id,full_name,email').eq('user_id', user.id).single();
      if (readError) throw readError;
      setSession(res, 'client', { userId: user.id, email: user.email.toLowerCase() });
      return json(res, 200, { ok: true, participant: { id: row.user_id, fullName: row.full_name, email: row.email } });
    }
    const current = session(req);
    if (!current) return json(res, 401, { error: 'Sign in required.' });
    if (req.method === 'GET' && current.role === 'admin') {
      const { data: rows, error } = await db.from(TABLE).select('user_id,full_name,email,workspace,enrolled_at,updated_at').order('enrolled_at', { ascending: false });
      if (error) throw error;
      const requested = String(req.query?.participantId || '');
      const row = requested ? rows.find(r => r.user_id === requested) : rows[0];
      return json(res, 200, { participants: rows.map(r => ({ id: r.user_id, fullName: r.full_name, email: r.email, completed: r.workspace?.completed || [], updatedAt: r.updated_at })), data: row ? payload(row) : null });
    }
    if (current.role !== 'client' || !current.userId) return json(res, 403, { error: 'Participant access required.' });
    const { data: row, error } = await db.from(TABLE).select('*').eq('user_id', current.userId).maybeSingle();
    if (error) throw error;
    if (!row) return json(res, 403, { error: 'Sign in through the Presentation & Speaking Skills programme to enrol.' });
    if (req.method === 'GET') return json(res, 200, { data: payload(row), cloudAvailable: true });
    if (req.method === 'POST') {
      let state;
      try { state = validateState(req.body?.elrpState); } catch (e) { return json(res, 400, { error: e.message }); }
      const updatedAt = new Date().toISOString();
      const { error: writeError } = await db.from(TABLE).update({ workspace: state, updated_at: updatedAt }).eq('user_id', current.userId);
      if (writeError) throw writeError;
      return json(res, 200, { ok: true, updatedAt, completed: state.completed, cloudAvailable: true });
    }
    return json(res, 405, { error: 'Method not allowed.' });
  } catch (error) {
    console.error('Speaking programme storage failed', error.message);
    return json(res, 500, { error: 'Unable to access online programme data. Please retry.', cloudAvailable: false });
  }
};
