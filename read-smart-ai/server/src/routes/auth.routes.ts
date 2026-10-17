import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { prisma } from '../db/prisma.js';
import {
  hashPassword,
  issueTokens,
  revokeRefreshToken,
  rotateRefreshToken,
  verifyPassword,
} from '../services/auth.service.js';
import { seedSampleBooks } from '../services/library.service.js';
import { HttpError } from '../utils/httpError.js';

export const authRouter = Router();

const credentials = z.object({
  email: z.email('A valid email is required.').trim().toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  displayName: z.string().trim().min(1).max(60).optional(),
});

const refreshBody = z.object({ refreshToken: z.string().min(1, 'refreshToken is required.') });

function publicUser(user: { id: string; email: string; displayName: string | null }) {
  return { id: user.id, email: user.email, displayName: user.displayName };
}

// POST /api/auth/register
authRouter.post('/register', async (req, res, next) => {
  try {
    const { email, password, displayName } = credentials.parse(req.body);
    if (await prisma.user.findUnique({ where: { email } })) {
      throw new HttpError(409, 'An account with this email already exists.');
    }
    const user = await prisma.user.create({
      data: { email, passwordHash: await hashPassword(password), displayName: displayName ?? null },
    });
    await seedSampleBooks(user.id);
    const tokens = await issueTokens(user.id);
    res.status(201).json({ user: publicUser(user), ...tokens });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = credentials.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      throw new HttpError(401, 'Email ya password galat hai.');
    }
    const tokens = await issueTokens(user.id);
    res.json({ user: publicUser(user), ...tokens });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/refresh
authRouter.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = refreshBody.parse(req.body);
    res.json(await rotateRefreshToken(refreshToken));
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout
authRouter.post('/logout', async (req, res, next) => {
  try {
    const { refreshToken } = refreshBody.parse(req.body);
    await revokeRefreshToken(refreshToken);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
authRouter.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) throw new HttpError(404, 'User not found.');
    res.json({ user: publicUser(user), streak: user.streak, lastActiveDay: user.lastActiveDay });
  } catch (err) {
    next(err);
  }
});
