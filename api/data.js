const { session, readData, writeData, json } = require('./_lib');
const {
  backendConfigured,
  contextFromSession,
  adminParticipantContext,
  getSummary,
  applySummaryToState
} = require('./_progress');

async function authoritativeState(current, elrpState) {
  if (!backendConfigured()) return elrpState || {};
  const context = current.role === 'admin'
    ? await adminParticipantContext()
    : await contextFromSession(current);
  if (!context) return elrpState || {};
  const summary = await getSummary(context);
  return applySummaryToState(elrpState || {}, summary);
}

module.exports = async function handler(req, res) {
  try {
    const current = session(req);
    if (!current) return json(res, 401, { error: 'Sign in required.' });

    if (req.method === 'GET') {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return json(res, 200, { data: null, cloudAvailable: false, localOnly: true });
      }
      const data = await readData();
      if (data?.elrpState && backendConfigured()) {
        data.elrpState = await authoritativeState(current, data.elrpState);
      }
      return json(res, 200, {
        data,
        cloudAvailable: true,
        backendAvailable: backendConfigured()
      });
    }

    if (req.method === 'POST') {
      if (current.role !== 'client') {
        return json(res, 403, { error: 'Only the client portal can update coaching responses.' });
      }
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return json(res, 200, { ok: false, cloudAvailable: false, localOnly: true });
      }

      const body = req.body || {};
      const value = {
        clientName: 'Leadership Coaching Client',
        updatedAt: new Date().toISOString(),
        elrpState: await authoritativeState(current, body.elrpState || {}),
        elrpDailyHabits: body.elrpDailyHabits || {},
        source: 'work-ready-vault-portal'
      };
      await writeData(value);
      return json(res, 200, {
        ok: true,
        updatedAt: value.updatedAt,
        backendAvailable: backendConfigured()
      });
    }

    return json(res, 405, { error: 'Method not allowed' });
  } catch (error) {
    const message = error.message || 'Unable to access coaching data.';
    if (message.includes('BLOB_READ_WRITE_TOKEN')) {
      return json(res, 200, { ok: false, data: null, cloudAvailable: false, localOnly: true });
    }
    return json(res, 500, { error: message });
  }
};
