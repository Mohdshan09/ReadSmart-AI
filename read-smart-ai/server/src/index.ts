import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { prisma } from './db/prisma.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { authRouter } from './routes/auth.routes.js';
import { booksRouter } from './routes/books.routes.js';
import { libraryRouter } from './routes/library.routes.js';
import { meRouter } from './routes/me.routes.js';
import { meaningRouter } from './routes/meaning.routes.js';
import { notebookRouter } from './routes/notebook.routes.js';
import { progressRouter } from './routes/progress.routes.js';
import { scannerRouter } from './routes/scanner.routes.js';

// Importing env validates that every required var is set (fails fast if not).
const app = express();
// Behind a host's reverse proxy (Render, Railway, Fly) X-Forwarded-For carries
// the client IP; without this express-rate-limit rejects proxied requests.
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json({ limit: '100kb' }));

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, db: 'up' });
  } catch {
    res.status(503).json({ ok: false, db: 'down' });
  }
});

app.use('/api', apiLimiter);

// Public
app.use('/api/auth', authRouter);
app.use('/api/meaning', meaningRouter);
app.use('/api/books', booksRouter);
app.use('/api/scanner', scannerRouter);

// Authenticated (each router applies requireAuth)
app.use('/api/notebook', notebookRouter);
app.use('/api/library', libraryRouter);
app.use('/api/progress', progressRouter);
app.use('/api/me', meRouter);

app.use(errorHandler);

// 0.0.0.0 so your phone on the same Wi-Fi can reach it.
app.listen(env.port, '0.0.0.0', () => {
  console.log(`Read Smart AI server running on ${env.port}`);
});
