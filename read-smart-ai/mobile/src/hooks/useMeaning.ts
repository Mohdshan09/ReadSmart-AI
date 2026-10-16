import { useCallback, useRef, useState } from 'react';
import { getMeaning } from '@/services/meaning';
import { cacheKey, useMeaningCache } from '@/store/meaningCache';
import type { WordMeaning } from '@/types';

export type ActiveWord = { key: string; word: string; line: string; lineIdx: number };

export function useMeaning(pageText: string) {
  const [active, setActive] = useState<ActiveWord | null>(null);
  const [data, setData] = useState<WordMeaning | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);
  const { entries, put } = useMeaningCache();

  const close = useCallback(() => {
    requestId.current++;
    setActive(null);
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  const tap = useCallback(
    async (next: ActiveWord) => {
      if (active?.key === next.key) return close();

      const id = ++requestId.current;
      setActive(next);
      setError(null);

      const ck = cacheKey(next.word, next.line);
      const cached = entries[ck];
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }

      setData(null);
      setLoading(true);
      try {
        const result = await getMeaning(next.word, next.line, pageText);

        if (id !== requestId.current) return;

        put(ck, result);
        setData(result);
      } catch (error: unknown) {
        if (id !== requestId.current) return;

        console.error("Meaning fetch failed:", error);

        const message =
          error instanceof Error
            ? error.message
            : String(error);

        setError(`Meaning load nahi hua: ${message}`);
      } finally {
        if (id === requestId.current) {
          setLoading(false);
        }
      }
    },
    [active, close, entries, pageText, put]
  );

  return { active, data, loading, error, tap, close };
}
