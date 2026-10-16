import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../db/prisma.js';
import { getWordMeaning, type WordMeaning } from './gemini.service.js';

// Same formula as mobile/src/store/meaningCache.ts, so the concept of a "key"
// stays consistent across client and server.
const cacheKey = (word: string, line: string) => `${word.toLowerCase()}|${line.trim().toLowerCase()}`;

// Return a cached meaning if we've seen this word+line before (from ANY user);
// otherwise ask Gemini once and store the result for everyone.
export async function lookupMeaning(word: string, line: string, context: string): Promise<WordMeaning> {
  const key = cacheKey(word, line);

  const cached = await prisma.meaningCache.findUnique({ where: { cacheKey: key } });
  if (cached) {
    await prisma.meaningCache.update({
      where: { cacheKey: key },
      data: { hitCount: { increment: 1 } },
    });
    return cached.payload as unknown as WordMeaning;
  }

  const result = await getWordMeaning(word, line, context);
  try {
    await prisma.meaningCache.create({
      data: { cacheKey: key, word, line, payload: result as unknown as Prisma.InputJsonValue },
    });
  } catch (err) {
    // A concurrent request may have inserted the same key first; that's fine.
    if (!(err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002')) throw err;
  }
  return result;
}
