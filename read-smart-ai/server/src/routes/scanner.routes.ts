import { Router } from 'express';
import multer from 'multer';
import { extractTextFromImage } from '../services/gemini.service.js';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const supportedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter: (_req, file, callback) => {
    if (!supportedMimeTypes.has(file.mimetype)) {
      callback(new Error('JPEG, PNG, WEBP, or HEIC image upload karo.'));
      return;
    }
    callback(null, true);
  },
});

export const scannerRouter = Router();

// POST /api/scanner/ocr  multipart form-data with the image in field "image".
// Files stay in memory for this request only; nothing is retained by this server.
scannerRouter.post('/ocr', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Photo select karo aur dobara try karo.' });
    const text = await extractTextFromImage(req.file.buffer, req.file.mimetype);
    res.json({ text });
  } catch (err) {
    if (err instanceof Error && err.message.includes('readable text nahi mila')) {
      return res.status(422).json({ error: err.message });
    }
    next(err);
  }
});
