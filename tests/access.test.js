const test = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');
test('programme access rejects cross-programme use and invalid invitations', async () => {
  const grants = new Set(['user-a:executive-leadership-readiness']);
  const db = {
    rpc: async () => ({ data: false, error: null }),
    from() {
      const filters = {};
      return {
        select() { return this; },
        eq(k, v) { filters[k] = v; return this; },
        async maybeSingle() { return { data: grants.has(filters.user_id + ':' + filters.programme) ? { status: 'active' } : null, error: null }; }
      };
    }
  };
  const original = Module._load;
  Module._load = function(request, parent) {
    if (parent?.filename.endsWith('/api/_access.js')) {
      if (request === './_lib') return { session: () => null, json: () => {} };
      if (request === './_supabase') return { supabaseAdminClient: () => db };
    }
    return original.apply(this, arguments);
  };
  delete require.cache[require.resolve('../api/_access')];
  const { requireProgrammeAccess, hashCode } = require('../api/_access');
  Module._load = original;
  await requireProgrammeAccess('user-a', 'executive-leadership-readiness');
  await assert.rejects(requireProgrammeAccess('user-a', 'presentation-speaking-skills'), e => e.status === 403);
  await assert.rejects(requireProgrammeAccess('user-a', 'presentation-speaking-skills', 'INVALID'), e => e.status === 403);
  assert.equal(hashCode('ABCD-1234'), hashCode('abcd 1234'));
  assert.equal(hashCode('ABCD-1234').length, 64);
});
