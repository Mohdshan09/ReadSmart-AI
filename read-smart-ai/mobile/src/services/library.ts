import type { Book, Page } from '@/types';
import { authedRequest } from './authed';

// A Book row as the server returns it (pages stored as JSON).
type ServerBook = {
  id: string;
  title: string;
  author: string;
  emoji: string;
  isSample: boolean;
  pages: Page[];
};

export const toBook = (b: ServerBook): Book => ({
  id: b.id,
  title: b.title,
  author: b.author,
  emoji: b.emoji,
  pages: b.pages,
  isSample: b.isSample,
});

export function fetchBooks() {
  return authedRequest<ServerBook[]>('/api/library');
}

export function createBook(title: string, pages: Page[]) {
  return authedRequest<ServerBook>('/api/library', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, pages }),
  });
}

export function deleteBook(id: string) {
  return authedRequest<void>(`/api/library/${id}`, { method: 'DELETE' });
}

// --- Reading progress ---
export type ProgressResponse = { lastBookId: string | null; progress: Record<string, number> };

export function fetchProgress() {
  return authedRequest<ProgressResponse>('/api/progress');
}

export function putProgress(bookId: string, pageIndex: number) {
  return authedRequest<unknown>(`/api/progress/${bookId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pageIndex }),
  });
}
