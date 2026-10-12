const crypto = require('crypto');
const { session, json } = require('./_lib');
const { supabaseAdminClient } = require('./_supabase');
const PROGRAMMES = ['executive-leadership-readiness', 'presentation-speaking-skills'];
const hashCode = code => crypto.createHash('sha256').update(String(code || '').replace(/[\s-]/g, '').toUpperCase()).digest('hex');
async function requireProgrammeAccess(userId, programme, code, verifiedEmail) {
  const db = supabaseAdminClient();
  if (code) {
    const { data, error } = await db.rpc('redeem_programme_invitation', { candidate_id: userId, selected_programme: programme, supplied_hash: hashCode(code), candidate_email: verifiedEmail || '' });
    if (error) throw error;
    if (!data) { const e = new Error('This invitation is invalid, expired, already used or assigned to a different email or programme.'); e.status = 403; throw e; }
  }
  const { data, error } = await db.from('programme_access').select('status').eq('user_id', userId).eq('programme', programme).maybeSingle();
  if (error) throw error;
  if (data?.status !== 'active') { const e = new Error('You are not enrolled in this programme. Enter the invitation code supplied by your facilitator.'); e.status = 403; e.code = 'PROGRAMME_ACCESS_REQUIRED'; throw e; }
}
async function accessHandler(req, res) {
  const current = session(req);
  if (!current || current.role !== 'admin') return json(res, 403, { error: 'Administrator access required.' });
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' });
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const programme = String(req.body?.programme || '');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !PROGRAMMES.includes(programme)) return json(res, 400, { error: 'Enter a valid email and choose a programme.' });
    const code = crypto.randomBytes(12).toString('hex').toUpperCase();
    const expiresAt = new Date(Date.now() + 14 * 86400000).toISOString();
    const { error } = await supabaseAdminClient().from('programme_invitations').insert({ email, programme, code_hash: hashCode(code), expires_at: expiresAt });
    if (error) throw error;
    return json(res, 200, { code: code.match(/.{1,4}/g).join('-'), email, programme, expiresAt });
  } catch (error) { return json(res, 500, { error: 'Unable to create the invitation. Please retry.' }); }
}
module.exports = { requireProgrammeAccess, accessHandler, hashCode, PROGRAMMES };
