import { Prisma } from '../generated/prisma/client.js';
import { sampleBooks } from '../data/sampleBooks.js';
import { prisma } from '../db/prisma.js';
import { HttpError } from '../utils/httpError.js';

export type PageInput = { title: string; author?: string; lines: string[] };
export type BookInput = { title: string; author?: string; emoji?: string; pages: PageInput[] };

export const listBooks = (userId: string) =>
  prisma.book.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });

export const addBook = (userId: string, data: BookInput) =>
  prisma.book.create({
    data: {
      userId,
      title: data.title,
      author: data.author ?? 'Uploaded',
      emoji: data.emoji ?? '📄',
      pages: data.pages as unknown as Prisma.InputJsonValue,
    },
  });

export async function deleteBook(userId: string, id: string): Promise<void> {
  const { count } = await prisma.book.deleteMany({ where: { id, userId } });
  if (count === 0) throw new HttpError(404, 'Book not found.');
}

// Give every new account its own copy of the demo books, so the library is
// never empty and reading-progress foreign keys stay valid.
export const seedSampleBooks = (userId: string) =>
  prisma.book.createMany({
    data: sampleBooks.map((b) => ({
      userId,
      title: b.title,
      author: b.author,
      emoji: b.emoji,
      isSample: true,
      pages: b.pages as unknown as Prisma.InputJsonValue,
    })),
  });
