import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import {
  addNotebookEntry,
  deleteNotebookEntry,
  listNotebook,
} from '../services/notebook.service.js';

export const notebookRouter = Router();
notebookRouter.use(requireAuth);

const entrySchema = z.object({
  word: z.string().trim().min(1).max(60),
  meaning: z.string(),
  hindi: z.string(),
  pronunciation: z.string(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  synonyms: z.array(z.string()).default([]),
  example: z.string().default(''),
  bookTitle: z.string().default(''),
  page: z.number().int().nonnegative().default(0),
});

// GET /api/notebook
notebookRouter.get('/', async (req, res, next) => {
  try {
    res.json(await listNotebook(req.userId!));
  } catch (err) {
    next(err);
  }
});

// POST /api/notebook
notebookRouter.post('/', async (req, res, next) => {
  try {
    const entry = await addNotebookEntry(req.userId!, entrySchema.parse(req.body));
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/notebook/:id
notebookRouter.delete('/:id', async (req, res, next) => {
  try {
    await deleteNotebookEntry(req.userId!, req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});
