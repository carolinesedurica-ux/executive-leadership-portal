const { session, json } = require('./_lib');
const { backendConfigured, contextFromSession, getSummary } = require('./_progress');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' });
  try {
    const current = session(req);
    if (!current || current.role !== 'client') return json(res, 401, { error: 'Sign in required.' });
    if (!backendConfigured()) return json(res, 503, { backendAvailable: false, error: 'Supabase backend is not configured.' });
    const context = await contextFromSession(current);
    return json(res, 200, { ok: true, backendAvailable: true, summary: await getSummary(context) });
  } catch (error) {
    return json(res, 500, { backendAvailable: true, error: error.message || 'Unable to load programme progress.' });
  }
};
