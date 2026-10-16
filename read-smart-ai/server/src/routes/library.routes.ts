import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { addBook, deleteBook, listBooks } from '../services/library.service.js';

export const libraryRouter = Router();
libraryRouter.use(requireAuth);

const pageSchema = z.object({
  title: z.string(),
  author: z.string().optional(),
  lines: z.array(z.string()),
});

const bookSchema = z.object({
  title: z.string().trim().min(1).max(200),
  author: z.string().optional(),
  emoji: z.string().optional(),
  pages: z.array(pageSchema).min(1, 'A book needs at least one page.'),
});

// GET /api/library
libraryRouter.get('/', async (req, res, next) => {
  try {
    res.json(await listBooks(req.userId!));
  } catch (err) {
    next(err);
  }
});

// POST /api/library  (persist a book the client already parsed via /api/books/parse)
libraryRouter.post('/', async (req, res, next) => {
  try {
    const book = await addBook(req.userId!, bookSchema.parse(req.body));
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/library/:id
libraryRouter.delete('/:id', async (req, res, next) => {
  try {
    await deleteBook(req.userId!, req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});
