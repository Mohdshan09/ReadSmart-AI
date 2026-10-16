import { Router } from 'express';
import { lookupMeaning } from '../services/meaning.service.js';

export const meaningRouter = Router();

// POST /api/meaning  { word, line, context }
// Public endpoint. Served from the shared MeaningCache when possible, so Gemini
// is only called the first time any user looks up a given word+line.
meaningRouter.post('/', async (req, res, next) => {
  try {
    const { word, line, context } = req.body ?? {};
    if (typeof word !== 'string' || !word.trim() || word.length > 40) {
      return res.status(400).json({ error: 'A valid "word" is required.' });
    }
    const result = await lookupMeaning(
      word.trim(),
      typeof line === 'string' ? line.slice(0, 300) : '',
      typeof context === 'string' ? context.slice(0, 500) : ''
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
});
