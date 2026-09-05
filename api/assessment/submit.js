const { session, json } = require('../_lib');
const { backendConfigured, contextFromSession, submitAssessment } = require('../_progress');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  try {
    const current = session(req);
    if (!current || current.role !== 'client') return json(res, 401, { error: 'Sign in required.' });
    if (!backendConfigured()) return json(res, 503, { backendAvailable: false, error: 'Supabase backend is not configured.' });
    const context = await contextFromSession(current);
    const result = await submitAssessment(context, {
      scores: req.body?.scores,
      reflections: req.body?.reflections
    });
    return json(res, 200, { ok: true, backendAvailable: true, ...result });
  } catch (error) {
    return json(res, 400, { backendAvailable: true, error: error.message || 'Assessment could not be submitted.' });
  }
};
