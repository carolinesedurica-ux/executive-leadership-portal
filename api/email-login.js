const crypto = require('crypto');
const { json } = require('./_lib');
const { supabaseClient, supabaseAdminClient } = require('./_supabase');
const { adminParticipantContext, completeMilestone, validateCredential } = require('./_progress');
const { readCredential } = require('./_credential-store');

const TRAINING_PROFILE_ID = '6fb8c10f-867f-45f6-bd33-aedca4d599f2';
const TEST_HASH = '065efe50402b95819827dd2757a21daa2f41bd1303e76b152bd38e3a659ef1dd';
const TEST_EXPIRES = Date.parse('2026-09-05T15:30:00Z');

function authorized(req) {
  const token = String(req.query?.token || '');
  if (!token || Date.now() > TEST_EXPIRES) return false;
  const actual = crypto.createHash('sha256').update(token).digest('hex');
  const a = Buffer.from(actual);
  const b = Buffer.from(TEST_HASH);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function runTrainingProgressionTest() {
  const context = await adminParticipantContext(TRAINING_PROFILE_ID);
  if (!context) throw new Error('Training participant context was not found.');

  const results = [];
  for (const key of ['week1','week2','week3']) {
    const evidence = {
      reflections: [
        'Training test reflection 1 for ' + key,
        'Training test reflection 2 for ' + key,
        'Training test reflection 3 for ' + key
      ],
      checks: { watch: true, reflect: true, coach: true, apply: true }
    };

    const result = await completeMilestone(context, key, evidence, { sendEmail: true });
    results.push({
      milestone: key,
      credentialIssued: result.credentialIssued,
      emailSent: result.emailSent,
      emailError: result.emailError || null,
      completed: result.summary.completed,
      entitlements: result.summary.entitlements
    });
  }

  const db = supabaseAdminClient();
  const { data: assessmentMilestone, error: milestoneError } = await db.from('milestones')
    .select('id,title')
    .eq('programme_id', context.programme.id)
    .eq('milestone_key', 'assessment')
    .single();
  if (milestoneError) throw milestoneError;

  const { data: tokenRow, error: tokenError } = await db.from('milestone_access_tokens')
    .select('id,credential_reference,expires_at,status,email_sent_at,email_last_error')
    .eq('participant_id', context.profile.id)
    .eq('milestone_id', assessmentMilestone.id)
    .eq('status','active')
    .is('revoked_at', null)
    .order('issued_at',{ascending:false})
    .limit(1)
    .maybeSingle();
  if (tokenError) throw tokenError;
  if (!tokenRow) throw new Error('Assessment credential was not generated.');

  const rawToken = await readCredential(tokenRow.credential_reference);
  const validation = await validateCredential(context, 'assessment', rawToken);

  return {
    participant: {
      id: context.profile.id,
      name: context.profile.full_name,
      email: context.profile.email
    },
    weeks: results,
    assessmentUnlocked: Boolean(results.at(-1)?.entitlements?.assessment),
    assessmentCredential: {
      tokenId: tokenRow.id,
      status: tokenRow.status,
      expiresAt: tokenRow.expires_at,
      emailSent: Boolean(tokenRow.email_sent_at),
      emailError: tokenRow.email_last_error || null,
      validationPassed: Boolean(validation.valid)
    }
  };
}

module.exports = async function handler(req, res) {
  if (req.method === 'GET' && req.query?.trainingProgressionTest === '1') {
    if (!authorized(req)) return json(res, 403, { error: 'Training test authorization failed or expired.' });
    try {
      const result = await runTrainingProgressionTest();
      return json(res, 200, { ok: true, result });
    } catch (error) {
      return json(res, 502, { ok: false, error: error.message || 'Training progression test failed.' });
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
