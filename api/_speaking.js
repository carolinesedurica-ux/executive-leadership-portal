const DOMAINS = ['purpose', 'structure', 'delivery', 'preparation', 'engagement', 'visuals', 'adaptability'];

function validateState(state) {
  if (!state || typeof state !== 'object' || Array.isArray(state)) throw new Error('Invalid programme workspace.');
  if (Buffer.byteLength(JSON.stringify(state)) > 180000) throw new Error('Workspace exceeds the size limit.');
  const clean = { fields: {}, checks: {}, ratings: {}, completed: [] };
  for (const [key, value] of Object.entries(state.fields || {})) {
    if (/^(plan|baseline|final|week[1-4])-[a-z0-9-]+$/.test(key) && typeof value === 'string' && value.length <= 8000) clean.fields[key] = value;
  }
  for (const [key, value] of Object.entries(state.checks || {})) {
    if (/^week[1-4]-(lesson[1-5]|day[1-5]|practice|reflect|coach|apply)$/.test(key) && typeof value === 'boolean') clean.checks[key] = value;
  }
  for (const [key, value] of Object.entries(state.ratings || {})) {
    if (/^(baseline|final)-(purpose|structure|delivery|preparation|engagement|visuals|adaptability|confidence)$/.test(key)) {
      const max = key.endsWith('-confidence') ? 10 : 5;
      const min = key.endsWith('-confidence') ? 0 : 1;
      if (Number.isInteger(value) && value >= min && value <= max) clean.ratings[key] = value;
    }
  }
  clean.completed = [1, 2, 3, 4].filter(n => weekReady(clean, n));
  return clean;
}

function weekReady(state, n) {
  const p = `week${n}`;
  return ['lesson1','lesson2','lesson3','lesson4','lesson5','practice','reflect','coach','apply'].every(k => state.checks?.[`${p}-${k}`] === true)
    && ['output','reflection1','reflection2','reflection3','coaching','after'].every(k => String(state.fields?.[`${p}-${k}`] || '').trim().length >= 10);
}

module.exports = { DOMAINS, validateState, weekReady };
