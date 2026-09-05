const crypto = require('crypto');
const { put, list } = require('@vercel/blob');

const COOKIE = 'wrv_session';
const DATA_PATH = 'private/client-data-current.enc';

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value) throw new Error('SESSION_SECRET is not configured');
  return value;
}

function b64url(value) {
  return Buffer.from(value).toString('base64url');
}

function sign(payload) {
  const body = b64url(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', secret()).update(body).digest('base64url');
  return `${body}.${sig}`;
}

function verify(token) {
  try {
    const [body, sig] = String(token || '').split('.');
    if (!body || !sig) return null;
    const expected = crypto.createHmac('sha256', secret()).update(body).digest();
    const actual = Buffer.from(sig, 'base64url');
    if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function getCookies(req) {
  return Object.fromEntries(String(req.headers.cookie || '').split(';').filter(Boolean).map(x => {
    const i = x.indexOf('=');
    return [x.slice(0, i).trim(), decodeURIComponent(x.slice(i + 1).trim())];
  }));
}

function session(req) {
  return verify(getCookies(req)[COOKIE]);
}

function setSession(res, role, extra = {}) {
  const token = sign({ ...extra, role, exp: Date.now() + 1000 * 60 * 60 * 12 });
  res.setHeader('Set-Cookie', `${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=43200`);
}

function clearSession(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);
}

function safeEqual(a, b) {
  const aa = Buffer.from(String(a || ''));
  const bb = Buffer.from(String(b || ''));
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}

function encryptionKey() {
  return crypto.createHash('sha256').update(secret()).digest();
}

function encrypt(value) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('base64url')}.${tag.toString('base64url')}.${encrypted.toString('base64url')}`;
}

function decrypt(value) {
  const [iv, tag, data] = String(value || '').split('.');
  if (!iv || !tag || !data) return null;
  const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey(), Buffer.from(iv, 'base64url'));
  decipher.setAuthTag(Buffer.from(tag, 'base64url'));
  const out = Buffer.concat([decipher.update(Buffer.from(data, 'base64url')), decipher.final()]);
  return JSON.parse(out.toString('utf8'));
}

async function readData() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error('BLOB_READ_WRITE_TOKEN is not configured');
  const result = await list({ prefix: DATA_PATH, limit: 10, token: process.env.BLOB_READ_WRITE_TOKEN });
  const blob = result.blobs.find(b => b.pathname === DATA_PATH) || result.blobs[0];
  if (!blob) return null;
  const response = await fetch(blob.url, { cache: 'no-store' });
  if (!response.ok) return null;
  return decrypt(await response.text());
}

async function writeData(value) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error('BLOB_READ_WRITE_TOKEN is not configured');
  const encrypted = encrypt(value);
  await put(DATA_PATH, encrypted, {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'text/plain; charset=utf-8',
    token: process.env.BLOB_READ_WRITE_TOKEN
  });
}

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

module.exports = { safeEqual, session, setSession, clearSession, readData, writeData, json };
