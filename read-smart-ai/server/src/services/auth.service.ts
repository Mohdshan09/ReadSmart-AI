import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../db/prisma.js';
import { HttpError } from '../utils/httpError.js';

export type Tokens = { accessToken: string; refreshToken: string };

// --- Passwords (bcrypt: slow hash for low-entropy secrets) ---
export const hashPassword = (plain: string) => bcrypt.hash(plain, 10);
export const verifyPassword = (plain: string, hash: string) => bcrypt.compare(plain, hash);

// --- Access token (short-lived JWT) ---
function signAccessToken(userId: string): string {
  return jwt.sign({ sub: userId }, env.jwtAccessSecret, {
    expiresIn: env.accessTokenTtl,
  } as SignOptions);
}

export function verifyAccessToken(token: string): string {
  const decoded = jwt.verify(token, env.jwtAccessSecret) as { sub?: string };
  if (!decoded.sub) throw new HttpError(401, 'Invalid token.');
  return decoded.sub;
}

// --- Refresh token (opaque random string, stored hashed, rotated on use) ---
const sha256 = (value: string) => crypto.createHash('sha256').update(value).digest('hex');

// "30d" / "12h" / "15m" / "45s" -> milliseconds.
function durationToMs(ttl: string): number {
  const match = /^(\d+)([smhd])$/.exec(ttl.trim());
  if (!match) return Number(ttl) || 0;
  const n = Number(match[1]);
  const unit = match[2] as 's' | 'm' | 'h' | 'd';
  const mult = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[unit];
  return n * mult;
}

const REFRESH_TTL_MS = durationToMs(env.refreshTokenTtl);

async function issueRefreshToken(userId: string): Promise<string> {
  const raw = crypto.randomBytes(48).toString('hex');
  await prisma.refreshToken.create({
    data: { userId, tokenHash: sha256(raw), expiresAt: new Date(Date.now() + REFRESH_TTL_MS) },
  });
  return raw;
}

export async function issueTokens(userId: string): Promise<Tokens> {
  return { accessToken: signAccessToken(userId), refreshToken: await issueRefreshToken(userId) };
}

// Verify a refresh token, revoke it, and issue a fresh pair (rotation).
export async function rotateRefreshToken(rawRefresh: string): Promise<Tokens> {
  const record = await prisma.refreshToken.findUnique({ where: { tokenHash: sha256(rawRefresh) } });
  if (!record || record.revoked || record.expiresAt < new Date()) {
    throw new HttpError(401, 'Session expired. Please log in again.');
  }
  await prisma.refreshToken.update({ where: { id: record.id }, data: { revoked: true } });
  return issueTokens(record.userId);
}

export async function revokeRefreshToken(rawRefresh: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { tokenHash: sha256(rawRefresh) },
    data: { revoked: true },
  });
}
