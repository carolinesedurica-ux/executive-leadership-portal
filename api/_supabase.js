const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  'https://kretjuxsrviqrmnthfwe.supabase.co';

const SUPABASE_PUBLISHABLE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_Qo0LCtmN1ldesHqGIykZOA_AiPcgbYM';

function supabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
}

function configuredEmails() {
  return String(process.env.CLIENT_LOGIN_EMAILS || '')
    .split(',')
    .map(value => value.trim().toLowerCase())
    .filter(Boolean);
}

function isAllowedEmail(email) {
  const allowed = configuredEmails();
  if (!allowed.length) return false;
  return allowed.includes(String(email || '').trim().toLowerCase());
}

module.exports = {
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  supabaseClient,
  configuredEmails,
  isAllowedEmail
};
