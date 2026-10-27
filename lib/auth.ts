import crypto from 'crypto';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE_NAME = 'laxman_admin_session';
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

function getSecretKey(): string {
  return process.env.ADMIN_SESSION_SECRET || 'laxman_phool_bhandar_secret_token_1975';
}

export function createSessionToken(): string {
  const issuedAt = Date.now();
  const data = `laxman_admin:${issuedAt}`;
  const hmac = crypto.createHmac('sha256', getSecretKey());
  hmac.update(data);
  const signature = hmac.digest('hex');
  return `${issuedAt}.${signature}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [timestampStr, signature] = parts;
  const issuedAt = parseInt(timestampStr, 10);
  if (isNaN(issuedAt)) return false;

  // Check if expired (7 days)
  if (Date.now() - issuedAt > SESSION_MAX_AGE_SECONDS * 1000) {
    return false;
  }

  const data = `laxman_admin:${issuedAt}`;
  const hmac = crypto.createHmac('sha256', getSecretKey());
  hmac.update(data);
  const expectedSignature = hmac.digest('hex');

  // Constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch {
    return false;
  }
}

export async function isAuthenticatedAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export function validateAdminCredentials(username: string, pass: string): boolean {
  const expectedUser = process.env.ADMIN_USERNAME || 'admin';
  const expectedPass = process.env.ADMIN_PASSWORD || 'laxman1975';

  return username.trim() === expectedUser && pass.trim() === expectedPass;
}
