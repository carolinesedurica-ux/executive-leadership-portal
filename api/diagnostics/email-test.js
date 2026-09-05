const crypto = require('crypto');
const { json } = require('../_lib');
const { supabaseClient } = require('../_supabase');
const { smtpConfigured, sendAssessmentResult } = require('../_email');

const EXPECTED_HASH = '53d580820dad31c3cba6b4e6349dfe54d84753485b2ba17a28cc7783aa06e3ed';
const EXPIRES_AT = Date.parse('2026-09-05T13:47:31.738809Z');
const TEST_EMAIL = 'training@academyfoundations.com';

function authorized(req) {
  const token = String(req.query?.token || '');
  if (!token || Date.now() > EXPIRES_AT) return false;
  const actual = crypto.createHash('sha256').update(token).digest('hex');
  const a = Buffer.from(actual);
  const b = Buffer.from(EXPECTED_HASH);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' });
  if (!authorized(req)) return json(res, 403, { error: 'Diagnostic authorization failed or expired.' });

  const mode = String(req.query?.mode || '');

  try {
    if (mode === 'supabase') {
      const supabase = supabaseClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: TEST_EMAIL,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: process.env.SUPABASE_EMAIL_REDIRECT || 'https://coaching.workreadyvault.com/'
        }
      });
      if (error) return json(res, 502, { ok: false, mode, error: error.message });
      return json(res, 200, { ok: true, mode, recipient: TEST_EMAIL, message: 'Supabase accepted the magic-link email request.' });
    }

    if (mode === 'vercel') {
      if (!smtpConfigured()) {
        return json(res, 503, { ok: false, mode, error: 'Vercel SMTP environment variables are incomplete.' });
      }
      const info = await sendAssessmentResult({
        to: TEST_EMAIL,
        participantName: 'FCA SMTP Test',
        message: 'This is a Vercel/Titan SMTP configuration test for the Executive Leadership Coaching Portal.'
      });
      return json(res, 200, {
        ok: true,
        mode,
        recipient: TEST_EMAIL,
        accepted: info?.accepted || [],
        rejected: info?.rejected || [],
        messageId: info?.messageId || null
      });
    }

    return json(res, 400, { error: 'Use mode=supabase or mode=vercel.' });
  } catch (error) {
    return json(res, 502, { ok: false, mode, error: error.message || 'Email diagnostic failed.' });
  }
};
