const { setSession, json } = require('./_lib');
const { supabaseClient, backendConfigured } = require('./_supabase');
const { ensureParticipantFromAuthUser } = require('./_progress');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  try {
    const accessToken = String(req.body?.accessToken || '');
    if (!accessToken) return json(res, 400, { error: 'Missing Supabase access token.' });

    const supabase = supabaseClient();
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error || !data?.user) {
      return json(res, 401, { error: 'Email session could not be verified.' });
    }

    const email = String(data.user.email || '').trim().toLowerCase();
    if (!email) return json(res, 401, { error: 'Verified email address is missing.' });

    if (!data.user.email_confirmed_at && !data.user.confirmed_at) {
      return json(res, 403, { error: 'Confirm your email before entering the coaching portal.' });
    }

    let participant = null;
    if (backendConfigured()) participant = await ensureParticipantFromAuthUser(data.user);

    setSession(res, 'client', {
      userId: data.user.id,
      email,
      participantId: participant?.profile?.id || null
    });

    return json(res, 200, {
      ok: true,
      role: 'client',
      email,
      participant: participant ? {
        id: participant.profile.id,
        fullName: participant.profile.full_name,
        email: participant.profile.email
      } : null,
      backendAvailable: backendConfigured()
    });
  } catch (error) {
    return json(res, 500, { error: error.message || 'Unable to establish portal session.' });
  }
};
