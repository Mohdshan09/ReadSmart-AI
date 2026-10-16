import type { Difficulty } from '../generated/prisma/client.js';
import { prisma } from '../db/prisma.js';
import { HttpError } from '../utils/httpError.js';

export type NotebookInput = {
  word: string;
  meaning: string;
  hindi: string;
  pronunciation: string;
  difficulty: Difficulty;
  synonyms: string[];
  example: string;
  bookTitle: string;
  page: number;
};

export const listNotebook = (userId: string) =>
  prisma.notebookEntry.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });

export const addNotebookEntry = (userId: string, data: NotebookInput) =>
  prisma.notebookEntry.create({ data: { ...data, userId } });

export async function deleteNotebookEntry(userId: string, id: string): Promise<void> {
  // Scope by userId so one user can never delete another's entry.
  const { count } = await prisma.notebookEntry.deleteMany({ where: { id, userId } });
  if (count === 0) throw new HttpError(404, 'Entry not found.');
}
