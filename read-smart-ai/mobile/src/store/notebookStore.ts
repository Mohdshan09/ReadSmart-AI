import { create } from 'zustand';
import * as api from '@/services/notebook';
import type { NotebookEntry, WordMeaning } from '@/types';
import { toast } from './toastStore';

// Saved vocab belongs to the signed-in account and lives on the server. Like
// the library store, this is an in-memory mirror that hydrates on login and
// clears on logout, so one account's words never leak into another's session.
type NotebookState = {
  words: NotebookEntry[];
  loaded: boolean;
  loading: boolean;
  hydrate: () => Promise<void>;
  reset: () => void;
  save: (data: WordMeaning, book: string, page: number) => Promise<void>;
  remove: (id: string) => Promise<void>;
  has: (word: string) => boolean;
};

export const useNotebook = create<NotebookState>((set, get) => ({
  words: [],
  loaded: false,
  loading: false,

  hydrate: async () => {
    set({ loading: true });
    try {
      set({ words: (await api.fetchNotebook()).map(api.toEntry), loaded: true });
    } catch {
      set({ loaded: true });
    } finally {
      set({ loading: false });
    }
  },

  reset: () => set({ words: [], loaded: false, loading: false }),

  save: async (data, book, page) => {
    if (get().has(data.word)) {
      toast.info(`"${data.word}" pehle se notebook me hai.`);
      return;
    }
    try {
      const entry = api.toEntry(await api.createNotebookEntry(data, book, page));
      // Guard against a duplicate slipping in between the check and the response.
      set((s) => (s.words.some((w) => w.id === entry.id) ? s : { words: [entry, ...s.words] }));
      toast.success(`"${entry.word}" notebook me save ho gaya!`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Word save nahi hua. Dobara try karo.');
    }
  },

  remove: async (id) => {
    const entry = get().words.find((w) => w.id === id);
    try {
      await api.deleteNotebookEntry(id);
      set((s) => ({ words: s.words.filter((w) => w.id !== id) }));
      toast.success(entry ? `"${entry.word}" notebook se hata diya.` : 'Word hata diya.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Word delete nahi hua. Dobara try karo.');
    }
  },

  has: (word) => get().words.some((w) => w.word.toLowerCase() === word.toLowerCase()),
}));
