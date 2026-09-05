const { setSession, json } = require('./_lib');
const { supabaseClient, configuredEmails, isAllowedEmail } = require('./_supabase');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  try {
    const accessToken = String(req.body?.accessToken || '');
    if (!accessToken) return json(res, 400, { error: 'Missing Supabase access token.' });

    if (!configuredEmails().length) {
      return json(res, 503, {
        error: 'Email login is not fully configured yet. Add CLIENT_LOGIN_EMAILS in Vercel.'
      });
    }

    const supabase = supabaseClient();
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error || !data?.user) return json(res, 401, { error: 'Email session could not be verified.' });

    const email = String(data.user.email || '').toLowerCase();
    if (!isAllowedEmail(email)) return json(res, 403, { error: 'This email is not authorised for this coaching portal.' });

    setSession(res, 'client');
    return json(res, 200, { ok: true, role: 'client', email });
  } catch (error) {
    return json(res, 500, { error: error.message || 'Unable to establish portal session.' });
  }
};
