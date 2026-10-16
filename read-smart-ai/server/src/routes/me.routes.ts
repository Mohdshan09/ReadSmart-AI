import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getProfile, markActiveToday } from '../services/profile.service.js';

export const meRouter = Router();
meRouter.use(requireAuth);

// GET /api/me  ->  { user, streak, lastActiveDay }
meRouter.get('/', async (req, res, next) => {
  try {
    res.json(await getProfile(req.userId!));
  } catch (err) {
    next(err);
  }
});

// POST /api/me/active  -> records a day of activity, returns updated streak
meRouter.post('/active', async (req, res, next) => {
  try {
    res.json(await markActiveToday(req.userId!));
  } catch (err) {
    next(err);
  }
});
