import rateLimit from 'express-rate-limit';

// 60 requests per minute per IP, so nobody can burn through your Gemini quota.
export const apiLimiter = rateLimit({
  windowMs: 60_000,
  limit: 60,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Bahut zyada requests. Thodi der baad try karo.' },
});
