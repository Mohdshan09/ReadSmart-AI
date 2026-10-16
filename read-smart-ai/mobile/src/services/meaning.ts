import type { WordMeaning } from '@/types';
import { apiRequest } from './api';

export function getMeaning(word: string, line: string, context: string) {
  return apiRequest<WordMeaning>('/api/meaning', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word, line, context: context.slice(0, 500) }),
  });
}
