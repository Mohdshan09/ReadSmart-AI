import { create } from 'zustand';
import * as api from '@/services/library';
import { toast } from '@/store/toastStore';
import type { Book, Page } from '@/types';

// The library, reading progress and "continue reading" all belong to the
// signed-in account and live on the server. This store is an in-memory mirror:
// it hydrates on login and clears on logout, so nothing of one account's data
// is left on the device for the next account that signs in.
type LibraryState = {
  books: Book[];
  progress: Record<string, number>; // bookId -> page index
  lastBookId: string | null;
  loaded: boolean;
  loading: boolean;
  hydrate: () => Promise<void>;
  reset: () => void;
  addBook: (title: string, pages: Page[]) => Promise<string>;
  removeBook: (id: string) => Promise<void>;
  setPage: (bookId: string, page: number) => Promise<void>;
};

export const useLibrary = create<LibraryState>((set, get) => ({
  books: [],
  progress: {},
  lastBookId: null,
  loaded: false,
  loading: false,

  hydrate: async () => {
    set({ loading: true });
    try {
      const [books, prog] = await Promise.all([api.fetchBooks(), api.fetchProgress()]);
      set({
        books: books.map(api.toBook),
        progress: prog.progress,
        lastBookId: prog.lastBookId,
        loaded: true,
      });
    } catch {
      // Let the UI proceed; an empty library just shows the empty state.
      set({ loaded: true });
    } finally {
      set({ loading: false });
    }
  },

  reset: () => set({ books: [], progress: {}, lastBookId: null, loaded: false, loading: false }),

  addBook: async (title, pages) => {
    const book = api.toBook(await api.createBook(title, pages));
    set((s) => ({ books: [book, ...s.books] }));
    return book.id;
  },

  removeBook: async (id) => {
    const book = get().books.find((b) => b.id === id);
    try {
      await api.deleteBook(id);
      set((s) => ({ books: s.books.filter((b) => b.id !== id) }));
      toast.success(book ? `"${book.title}" hata di.` : 'Book hata di.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Book delete nahi hui. Dobara try karo.');
    }
  },

  setPage: async (bookId, page) => {
    // Optimistic local update so paging feels instant; persist in the background.
    set((s) => ({ progress: { ...s.progress, [bookId]: page }, lastBookId: bookId }));
    await api.putProgress(bookId, page).catch(() => undefined);
  },
}));

export function useAllBooks(): Book[] {
  return useLibrary((s) => s.books);
}

export function findBook(id: string, books: Book[]): Book | undefined {
  return books.find((b) => b.id === id);
}
