import type { Difficulty, NotebookEntry, WordMeaning } from '@/types';
import { authedRequest } from './authed';

// A NotebookEntry row as the server returns it.
type ServerEntry = {
  id: string;
  word: string;
  meaning: string;
  hindi: string;
  pronunciation: string;
  difficulty: Difficulty;
  synonyms: string[];
  example: string;
  bookTitle: string;
  page: number;
  createdAt: string;
};

export const toEntry = (e: ServerEntry): NotebookEntry => ({
  id: e.id,
  word: e.word,
  meaning: e.meaning,
  hindi: e.hindi,
  pronunciation: e.pronunciation,
  difficulty: e.difficulty,
  synonyms: e.synonyms,
  example: e.example,
  book: e.bookTitle,
  page: e.page,
  date: new Date(e.createdAt).toLocaleDateString('en-IN'),
});

export function fetchNotebook() {
  return authedRequest<ServerEntry[]>('/api/notebook');
}

export function createNotebookEntry(data: WordMeaning, bookTitle: string, page: number) {
  return authedRequest<ServerEntry>('/api/notebook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      word: data.word,
      meaning: data.simpleMeaning,
      hindi: data.hindiMeaning,
      pronunciation: data.pronunciation,
      difficulty: data.difficulty,
      synonyms: data.synonyms ?? [],
      example: data.exampleSentence ?? '',
      bookTitle,
      page,
    }),
  });
}

export function deleteNotebookEntry(id: string) {
  return authedRequest<void>(`/api/notebook/${id}`, { method: 'DELETE' });
}
