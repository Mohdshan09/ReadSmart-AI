export type Page = {
  title: string;
  author?: string;
  lines: string[];
};

export type Book = {
  id: string;
  title: string;
  author: string;
  emoji: string;
  pages: Page[];
  isSample?: boolean;
};

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type WordMeaning = {
  word: string;
  shortAnnotation: string;
  pronunciation: string;
  partOfSpeech: string;
  simpleMeaning: string;
  hindiMeaning: string;
  beginnerExplain: string;
  synonyms: string[];
  exampleSentence: string;
  difficulty: Difficulty;
};

export type ScanResult = {
  text: string;
};

export type NotebookEntry = {
  id: string;
  word: string;
  meaning: string;
  hindi: string;
  pronunciation: string;
  difficulty: Difficulty;
  synonyms: string[];
  example: string;
  book: string;
  page: number;
  date: string;
};
