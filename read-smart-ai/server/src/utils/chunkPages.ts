export type Page = { title: string; author?: string; lines: string[] };

const LINES_PER_PAGE = 28;

export function chunkIntoPages(filename: string, text: string) {
  const title = filename.replace(/\.[^.]+$/, '');
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    // collapse runs of blank lines into one
    .filter((l, i, arr) => l !== '' || (i > 0 && arr[i - 1] !== ''));

  const pages: Page[] = [];
  for (let i = 0; i < lines.length; i += LINES_PER_PAGE) {
    pages.push({ title, author: 'Uploaded', lines: lines.slice(i, i + LINES_PER_PAGE) });
  }
  if (pages.length === 0 || !lines.some(Boolean)) {
    return { title, pages: [{ title, author: 'Uploaded', lines: ['(File empty hai)'] }] };
  }
  return { title, pages };
}
