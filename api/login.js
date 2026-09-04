const { safeEqual, setSession, json } = require('./_lib');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  try {
    const { role, password } = req.body || {};
    if (!['client', 'admin'].includes(role)) return json(res, 400, { error: 'Choose a valid sign-in type.' });
    const expected = role === 'admin' ? process.env.ADMIN_ACCESS_CODE : process.env.CLIENT_ACCESS_CODE;
    if (!expected) return json(res, 503, { error: `${role === 'admin' ? 'ADMIN_ACCESS_CODE' : 'CLIENT_ACCESS_CODE'} is not configured.` });
    if (!safeEqual(password, expected)) return json(res, 401, { error: 'Incorrect access code.' });
    setSession(res, role);
    return json(res, 200, { ok: true, role });
  } catch (error) {
    return json(res, 500, { error: error.message || 'Unable to sign in.' });
  }
};
