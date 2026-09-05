const crypto = require('crypto');

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateAccessToken() {
  const bytes = crypto.randomBytes(20);
  let body = '';
  for (const byte of bytes) body += ALPHABET[byte % ALPHABET.length];
  return 'ELR-' + body.match(/.{1,4}/g).join('-');
}

function tokenSecret() {
  const value = process.env.TOKEN_HASH_SECRET || process.env.SESSION_SECRET;
  if (!value) throw new Error('TOKEN_HASH_SECRET or SESSION_SECRET is not configured');
  return value;
}

function hashAccessToken(token) {
  return crypto.createHmac('sha256', tokenSecret()).update(String(token || '')).digest('hex');
}

function tokenExpiry() {
  const days = Math.max(1, Number(process.env.MILESTONE_TOKEN_TTL_DAYS || 90));
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

module.exports = { generateAccessToken, hashAccessToken, tokenExpiry };
