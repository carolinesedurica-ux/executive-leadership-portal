const crypto = require('crypto');
const { json } = require('./_lib');
const { supabaseClient, supabaseAdminClient } = require('./_supabase');
const { adminParticipantContext, submitAssessment, validateCredential, getSummary } = require('./_progress');
const { readCredential } = require('./_credential-store');

const TRAINING_PROFILE_ID = '6fb8c10f-867f-45f6-bd33-aedca4d599f2';
const TEST_HASH = '7c36ea56a86ab6b29e85b458af10cc869fec539320440621eb07188483d2ecc5';
const TEST_EXPIRES = Date.parse('2026-09-05T16:30:00Z');

function authorized(req) {
  const token = String(req.query?.token || '');
  if (!token || Date.now() > TEST_EXPIRES) return false;
  const actual = crypto.createHash('sha256').update(token).digest('hex');
  const a = Buffer.from(actual);
  const b = Buffer.from(TEST_HASH);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function runSevenCharacterWeek4Test() {
  const context = await adminParticipantContext(TRAINING_PROFILE_ID);
  if (!context) throw new Error('Training participant context was not found.');

  const result = await submitAssessment(context, {
    scores: [8,8,8,7,8,8,8,8,7,8,7,8],
    reflections: {
      greatestImprovement: 'Training verification of confidence, clarity and leadership presence.',
      evidenceSituation: 'Training verification used the programme tools to communicate clearly and hold a boundary.',
      remainingChallenge: 'Continue developing confidence in people-leadership and accountability conversations.'
    }
  }, { sendEmail: true });

  const db = supabaseAdminClient();
  const { data: week4, error: milestoneError } = await db.from('milestones')
    .select('id,title')
    .eq('programme_id', context.programme.id)
    .eq('milestone_key', 'week4')
    .single();
  if (milestoneError) throw milestoneError;

  const { data: tokenRow, error: tokenError } = await db.from('milestone_access_tokens')
    .select('id,credential_reference,expires_at,status,email_sent_at,email_last_error')
    .eq('participant_id', context.profile.id)
    .eq('milestone_id', week4.id)
    .eq('status','active')
    .is('revoked_at', null)
    .order('issued_at',{ascending:false})
    .limit(1)
    .maybeSingle();
  if (tokenError) throw tokenError;
  if (!tokenRow) throw new Error('Week 4 access credential was not generated.');

  const rawToken = await readCredential(tokenRow.credential_reference);
  const tokenFormatValid = /^[A-HJ-NP-Z2-9]{7}$/.test(rawToken);

  const validation = await validateCredential(context, 'week4', rawToken);
  const finalSummary = await getSummary(context);
  const week4Open = Boolean(
    finalSummary.assessmentComplete &&
    finalSummary.entitlements?.week4 &&
    finalSummary.validatedCredentials?.includes('week4')
  );

  return {
    participant: { name: context.profile.full_name, email: context.profile.email },
    tokenLength: rawToken.length,
    tokenFormatValid,
    tokenPreview: rawToken.slice(0,2) + '•••' + rawToken.slice(-2),
    emailSent: result.emailSent && Boolean(tokenRow.email_sent_at),
    emailError: result.emailError || tokenRow.email_last_error || null,
    validationPassed: Boolean(validation.valid),
    assessmentComplete: finalSummary.assessmentComplete,
    week4Entitled: Boolean(finalSummary.entitlements?.week4),
    week4CredentialRecordedAsValidated: finalSummary.validatedCredentials?.includes('week4') || false,
    week4Open
  };
}

module.exports = async function handler(req, res) {
  if (req.method === 'GET' && req.query?.sevenCharacterWeek4Test === '1') {
    if (!authorized(req)) return json(res, 403, { error: 'Training test authorization failed or expired.' });
    try {
      return json(res, 200, { ok: true, result: await runSevenCharacterWeek4Test() });
    } catch (error) {
      return json(res, 502, { ok: false, error: error.message || 'Training test failed.' });
    }
  }

  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const fullName = String(req.body?.fullName || '').trim().slice(0, 120);
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
        emailRedirectTo: redirectTo,
        ...(fullName ? { data: { full_name: fullName } } : {})
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
