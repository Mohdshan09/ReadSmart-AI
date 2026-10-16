import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NotebookEntry, WordMeaning } from '@/types';
import { persistStorage } from './storage';

type NotebookState = {
  words: NotebookEntry[];
  save: (data: WordMeaning, book: string, page: number) => void;
  remove: (id: string) => void;
  has: (word: string) => boolean;
};

export const useNotebook = create<NotebookState>()(
  persist(
    (set, get) => ({
      words: [],
      save: (data, book, page) => {
        if (get().has(data.word)) return;
        const entry: NotebookEntry = {
          id: `${Date.now()}-${data.word.toLowerCase()}`,
          word: data.word,
          meaning: data.simpleMeaning,
          hindi: data.hindiMeaning,
          pronunciation: data.pronunciation,
          difficulty: data.difficulty,
          synonyms: data.synonyms ?? [],
          example: data.exampleSentence ?? '',
          book,
          page,
          date: new Date().toLocaleDateString('en-IN'),
        };
        set((s) => ({ words: [entry, ...s.words] }));
      },
      remove: (id) => set((s) => ({ words: s.words.filter((w) => w.id !== id) })),
      has: (word) => get().words.some((w) => w.word.toLowerCase() === word.toLowerCase()),
    }),
    { name: 'notebook', storage: persistStorage }
  )
);
