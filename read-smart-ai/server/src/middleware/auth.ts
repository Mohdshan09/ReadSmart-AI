import type { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../services/auth.service.js';
import { HttpError } from '../utils/httpError.js';

// Make req.userId available to handlers behind requireAuth.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new HttpError(401, 'Login required.'));
  }
  try {
    req.userId = verifyAccessToken(header.slice('Bearer '.length).trim());
    next();
  } catch {
    next(new HttpError(401, 'Session expired. Please log in again.'));
  }
}
