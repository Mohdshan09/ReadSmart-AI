import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sampleBooks } from '@/data/sampleBooks';
import type { Book, Page } from '@/types';
import { persistStorage } from './storage';

type LibraryState = {
  uploaded: Book[];
  progress: Record<string, number>; // bookId -> page index
  lastBookId: string | null;
  addBook: (title: string, pages: Page[]) => string;
  removeBook: (id: string) => void;
  setPage: (bookId: string, page: number) => void;
};

export const useLibrary = create<LibraryState>()(
  persist(
    (set) => ({
      uploaded: [],
      progress: {},
      lastBookId: null,
      addBook: (title, pages) => {
        const id = `upload-${Date.now()}`;
        const book: Book = { id, title, author: 'Uploaded', emoji: '📄', pages };
        set((s) => ({ uploaded: [book, ...s.uploaded] }));
        return id;
      },
      removeBook: (id) => set((s) => ({ uploaded: s.uploaded.filter((b) => b.id !== id) })),
      setPage: (bookId, page) =>
        set((s) => ({ progress: { ...s.progress, [bookId]: page }, lastBookId: bookId })),
    }),
    { name: 'library', storage: persistStorage }
  )
);

export function useAllBooks(): Book[] {
  const uploaded = useLibrary((s) => s.uploaded);
  return [...uploaded, ...sampleBooks];
}

export function findBook(id: string, uploaded: Book[]): Book | undefined {
  return [...uploaded, ...sampleBooks].find((b) => b.id === id);
}
