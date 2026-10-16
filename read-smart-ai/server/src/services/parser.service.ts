import { randomUUID } from 'node:crypto';
import { unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { EPub } from 'epub2';
import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';
import { chunkIntoPages } from '../utils/chunkPages.js';

export class ParseError extends Error {
  status = 400;
}

const MAX_PDF_PAGES = 100;
const MAX_EPUB_CHAPTERS = 30;

export async function parseBook(filename: string, buffer: Buffer) {
  const ext = filename.split('.').pop()?.toLowerCase();
  let text: string;

  try {
    if (ext === 'txt') {
      text = buffer.toString('utf8');
    } else if (ext === 'pdf') {
      const parser = new PDFParse({ data: buffer });
      try {
        const result = await parser.getText({ first: MAX_PDF_PAGES, pageJoiner: '' });
        text = result.text;
      } finally {
        await parser.destroy();
      }
    } else if (ext === 'docx') {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (ext === 'epub') {
      text = await parseEpub(buffer);
    } else {
      throw new ParseError('Yeh format support nahi hai. TXT, PDF, DOCX ya EPUB upload karo.');
    }
  } catch (err) {
    if (err instanceof ParseError) throw err;
    throw new ParseError(`${ext?.toUpperCase()} parse nahi hua. TXT format mein try karo.`);
  }

  return chunkIntoPages(filename, text);
}

// epub2 reads from a file path, so write the upload to a temp file first.
async function parseEpub(buffer: Buffer) {
  const path = join(tmpdir(), `${randomUUID()}.epub`);
  await writeFile(path, buffer);
  try {
    const epub = await EPub.createAsync(path);
    let text = '';
    for (const chapter of epub.flow.slice(0, MAX_EPUB_CHAPTERS)) {
      if (!chapter.id) continue;
      const html = await epub.getChapterAsync(chapter.id);
      text += stripHtml(html) + '\n';
    }
    if (!text.trim()) throw new Error('empty epub');
    return text;
  } finally {
    await unlink(path).catch(() => {});
  }
}

function stripHtml(html: string) {
  return html
    .replace(/<\/(p|div|h[1-6]|li|br)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
