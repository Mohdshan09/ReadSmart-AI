import { Router } from 'express';
import multer from 'multer';
import { parseBook } from '../services/parser.service.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
});

export const booksRouter = Router();

// POST /api/books/parse  multipart form-data with field "file"
booksRouter.post('/parse', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'File nahi mili. "file" field mein bhejo.' });
    const book = await parseBook(req.file.originalname, req.file.buffer);
    res.json(book);
  } catch (err) {
    next(err);
  }
});
