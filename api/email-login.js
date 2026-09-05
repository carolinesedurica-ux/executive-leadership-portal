const { json } = require('./_lib');
const { supabaseClient } = require('./_supabase');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    if (!email || !email.includes('@')) {
      return json(res, 400, { error: 'Enter a valid email address.' });
    }

    const supabase = supabaseClient();
    const redirectTo =
      process.env.SUPABASE_EMAIL_REDIRECT ||
      'https://coaching.workreadyvault.com/';

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: redirectTo
      }
    });

    if (error) {
      const status = error.status === 429 ? 429 : 400;
      return json(res, status, { error: error.message || 'Unable to send sign-in email.' });
    }

    return json(res, 200, {
      ok: true,
      message: 'Check your email for a secure sign-up or sign-in link.'
    });
  } catch (error) {
    return json(res, 500, { error: error.message || 'Unable to send sign-in email.' });
  }
};
