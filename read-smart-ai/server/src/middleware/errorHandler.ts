import type { ErrorRequestHandler } from 'express';
import { MulterError } from 'multer';
import { ZodError } from 'zod';
import { ParseError } from '../services/parser.service.js';
import { HttpError } from '../utils/httpError.js';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) return res.status(err.status).json({ error: err.message });
  if (err instanceof ZodError) {
    return res.status(400).json({ error: err.issues[0]?.message ?? 'Invalid request.' });
  }
  if (err instanceof ParseError) return res.status(err.status).json({ error: err.message });
  if (err instanceof MulterError) return res.status(400).json({ error: `Upload error: ${err.message}` });
  console.error(err);
  res.status(500).json({ error: 'Server pe unexpected error aaya. Thodi der baad dobara try karo.' });
};
