import type { NotebookEntry } from '@/types';

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export type QuizQuestion = { entry: NotebookEntry; options: string[] };

// Build options once per question so they don't reshuffle on every render.
export function buildQuestion(notebook: NotebookEntry[], index: number): QuizQuestion | null {
  const entry = notebook[index];
  if (!entry || notebook.length < 2) return null;
  const distractors = shuffle(
    Array.from(new Set(notebook.filter((w) => w.id !== entry.id).map((w) => w.meaning)))
      .filter((m) => m !== entry.meaning)
  ).slice(0, 3);
  return { entry, options: shuffle([entry.meaning, ...distractors]) };
}
