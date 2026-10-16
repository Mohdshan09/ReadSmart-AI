import { prisma } from '../db/prisma.js';

// All reading progress for a user. The most recently opened book (first row,
// since ordered by lastOpenedAt desc) is the equivalent of the old `lastBookId`.
export async function getProgress(userId: string) {
  const rows = await prisma.readingProgress.findMany({
    where: { userId },
    orderBy: { lastOpenedAt: 'desc' },
  });
  return {
    lastBookId: rows[0]?.bookId ?? null,
    progress: Object.fromEntries(rows.map((r) => [r.bookId, r.pageIndex])),
  };
}

// Upsert the page the user is on for a given book.
export const setProgress = (userId: string, bookId: string, pageIndex: number) =>
  prisma.readingProgress.upsert({
    where: { userId_bookId: { userId, bookId } },
    create: { userId, bookId, pageIndex },
    update: { pageIndex },
  });
