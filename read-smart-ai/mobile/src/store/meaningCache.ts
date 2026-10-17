import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WordMeaning } from '@/types';
import { persistStorage } from './storage';

// Cache key includes the line, because the same word can mean different
// things in different sentences.
export const cacheKey = (word: string, line: string) =>
  `${word.toLowerCase()}|${line.trim().toLowerCase()}`;

type CacheState = {
  entries: Record<string, WordMeaning>;
  put: (key: string, value: WordMeaning) => void;
  clear: () => void;
};

export const useMeaningCache = create<CacheState>()(
  persist(
    (set) => ({
      entries: {},
      put: (key, value) => set((s) => ({ entries: { ...s.entries, [key]: value } })),
      // Cleared on logout so one account's lookups aren't visible to the next.
      clear: () => set({ entries: {} }),
    }),
    { name: 'meaning-cache', storage: persistStorage }
  )
);
