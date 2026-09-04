const { session, json } = require('./_lib');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' });
  try {
    const current = session(req);
    return json(res, 200, { authenticated: !!current, role: current?.role || null });
  } catch (error) {
    return json(res, 500, { error: error.message || 'Unable to check session.' });
  }
};
