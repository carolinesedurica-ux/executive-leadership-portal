const { session, json } = require('../_lib');
const { backendConfigured, contextFromSession, validateCredential } = require('../_progress');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  try {
    const current = session(req);
    if (!current || current.role !== 'client') return json(res, 401, { error: 'Sign in required.' });
    if (!backendConfigured()) return json(res, 503, { backendAvailable: false, error: 'Supabase backend is not configured.' });
    const milestoneKey = String(req.body?.milestoneKey || '');
    const token = String(req.body?.token || '');
    if (!milestoneKey || !token) return json(res, 400, { error: 'Milestone and credential are required.' });
    const context = await contextFromSession(current);
    return json(res, 200, { ok: true, ...(await validateCredential(context, milestoneKey, token)) });
  } catch (error) {
    return json(res, 400, { error: error.message || 'Credential could not be validated.' });
  }
};
