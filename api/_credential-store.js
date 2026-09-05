const crypto = require('crypto');
const { put, list, del } = require('@vercel/blob');

const PREFIX = 'private/credentials/';

function storageToken() {
  const value = process.env.BLOB_READ_WRITE_TOKEN;
  if (!value) throw new Error('BLOB_READ_WRITE_TOKEN is not configured');
  return value;
}

function key() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET is not configured');
  return crypto.createHash('sha256').update('credential-escrow:' + secret).digest();
}

function encrypt(value) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key(), iv);
  const encrypted = Buffer.concat([cipher.update(String(value), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, encrypted].map(part => part.toString('base64url')).join('.');
}

function decrypt(value) {
  const [iv, tag, data] = String(value || '').split('.');
  if (!iv || !tag || !data) throw new Error('Credential escrow is invalid');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key(), Buffer.from(iv, 'base64url'));
  decipher.setAuthTag(Buffer.from(tag, 'base64url'));
  return Buffer.concat([
    decipher.update(Buffer.from(data, 'base64url')),
    decipher.final()
  ]).toString('utf8');
}

async function storeCredential(token) {
  const reference = PREFIX + crypto.randomUUID() + '.enc';
  await put(reference, encrypt(token), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: false,
    contentType: 'text/plain; charset=utf-8',
    token: storageToken()
  });
  return reference;
}

async function readCredential(reference) {
  if (!String(reference || '').startsWith(PREFIX)) throw new Error('Invalid credential reference');
  const result = await list({ prefix: reference, limit: 2, token: storageToken() });
  const blob = result.blobs.find(item => item.pathname === reference);
  if (!blob) throw new Error('Credential escrow was not found');
  const response = await fetch(blob.url, { cache: 'no-store' });
  if (!response.ok) throw new Error('Credential escrow could not be read');
  return decrypt(await response.text());
}

async function deleteCredential(reference) {
  if (!reference || !String(reference).startsWith(PREFIX)) return;
  try { await del(reference, { token: storageToken() }); } catch {}
}

module.exports = { storeCredential, readCredential, deleteCredential };
