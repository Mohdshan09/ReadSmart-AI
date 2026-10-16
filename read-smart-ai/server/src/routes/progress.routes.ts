import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { getProgress, setProgress } from '../services/progress.service.js';

export const progressRouter = Router();
progressRouter.use(requireAuth);

const bodySchema = z.object({ pageIndex: z.number().int().nonnegative() });

// GET /api/progress  ->  { lastBookId, progress: { [bookId]: pageIndex } }
progressRouter.get('/', async (req, res, next) => {
  try {
    res.json(await getProgress(req.userId!));
  } catch (err) {
    next(err);
  }
});

// PUT /api/progress/:bookId  { pageIndex }
progressRouter.put('/:bookId', async (req, res, next) => {
  try {
    const { pageIndex } = bodySchema.parse(req.body);
    res.json(await setProgress(req.userId!, req.params.bookId, pageIndex));
  } catch (err) {
    next(err);
  }
});
