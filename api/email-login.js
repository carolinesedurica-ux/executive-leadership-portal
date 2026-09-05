const crypto = require('crypto');
const { json } = require('./_lib');
const { supabaseClient } = require('./_supabase');
const { smtpConfigured, sendMail } = require('./_email');

const ONE_TIME_HASH = 'e6c5092b0df970b8411de8fb604ec4ac31dc447c8c3ceea91f303502add30777';
const ONE_TIME_EXPIRES = Date.parse('2026-09-05T15:30:00Z');

function oneTimeAuthorized(req) {
  const token = String(req.query?.token || '');
  if (!token || Date.now() > ONE_TIME_EXPIRES) return false;
  const actual = crypto.createHash('sha256').update(token).digest('hex');
  const a = Buffer.from(actual);
  const b = Buffer.from(ONE_TIME_HASH);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function sendPortalSetupEmails() {
  if (!smtpConfigured()) throw new Error('SMTP is not fully configured');

  const subject = 'Executive Leadership Portal – One-Time Password Setup';
  const makeText = (name) => `Hi ${name},

We have updated the Executive Leadership Coaching Portal to make future sign-ins simpler and more secure.

Because your account was originally created using a secure email sign-in link, you will need to create a password once.

Please follow these steps:

1. Go to https://coaching.workreadyvault.com
2. Select “Participant”.
3. Choose “Sign in”.
4. Enter your email address.
5. Click “Forgot or need to create your password?”
6. Check your inbox for the password email and create your password.
7. Return to the portal and sign in using your email address and password.

After this one-time setup, you will not receive a verification or magic-link email every time you sign in. You will simply use your email and password.

Your existing programme progress and coaching information remain unchanged.

Warm regards,
Foundations Counselling Academy
Executive Leadership Coaching
People | Potential | Purpose`;

  const makeHtml = (name) => `<p>Hi ${name},</p>
<p>We have updated the Executive Leadership Coaching Portal to make future sign-ins simpler and more secure.</p>
<p>Because your account was originally created using a secure email sign-in link, you will need to create a password once.</p>
<p>Please follow these steps:</p>
<ol>
<li>Go to <a href="https://coaching.workreadyvault.com">coaching.workreadyvault.com</a></li>
<li>Select <strong>Participant</strong>.</li>
<li>Choose <strong>Sign in</strong>.</li>
<li>Enter your email address.</li>
<li>Click <strong>Forgot or need to create your password?</strong></li>
<li>Check your inbox for the password email and create your password.</li>
<li>Return to the portal and sign in using your email address and password.</li>
</ol>
<p>After this one-time setup, you will not receive a verification or magic-link email every time you sign in. You will simply use your email and password.</p>
<p>Your existing programme progress and coaching information remain unchanged.</p>
<p>Warm regards,<br><strong>Foundations Counselling Academy</strong><br>Executive Leadership Coaching<br><em>People | Potential | Purpose</em></p>`;

  const recipients = [
    { to: 'sitholenatalie18@gmail.com', name: 'Natalie' },
    { to: 'careermai@gmail.com', name: 'Caroline' }
  ];

  const results = [];
  for (const item of recipients) {
    const info = await sendMail({
      to: item.to,
      subject,
      text: makeText(item.name),
      html: makeHtml(item.name)
    });
    results.push({
      to: item.to,
      accepted: info?.accepted || [],
      rejected: info?.rejected || [],
      messageId: info?.messageId || null
    });
  }
  return results;
}

module.exports = async function handler(req, res) {
  if (req.method === 'GET' && req.query?.sendPortalSetup === '1') {
    if (!oneTimeAuthorized(req)) return json(res, 403, { error: 'Authorization failed or expired.' });
    try {
      const results = await sendPortalSetupEmails();
      return json(res, 200, { ok: true, results });
    } catch (error) {
      return json(res, 502, { ok: false, error: error.message || 'Unable to send portal setup emails.' });
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
