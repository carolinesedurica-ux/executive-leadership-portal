const { session, readData, writeData, json } = require('./_lib');

module.exports = async function handler(req, res) {
  try {
    const current = session(req);
    if (!current) return json(res, 401, { error: 'Sign in required.' });

    if (req.method === 'GET') {
      const data = await readData();
      return json(res, 200, { data });
    }

    if (req.method === 'POST') {
      if (current.role !== 'client') return json(res, 403, { error: 'Only the client portal can update coaching responses.' });
      const body = req.body || {};
      const value = {
        clientName: 'Leadership Coaching Client',
        updatedAt: new Date().toISOString(),
        elrpState: body.elrpState || {},
        elrpDailyHabits: body.elrpDailyHabits || {},
        source: 'work-ready-vault-portal'
      };
      await writeData(value);
      return json(res, 200, { ok: true, updatedAt: value.updatedAt });
    }

    return json(res, 405, { error: 'Method not allowed' });
  } catch (error) {
    return json(res, 500, { error: error.message || 'Unable to access coaching data.' });
  }
};
