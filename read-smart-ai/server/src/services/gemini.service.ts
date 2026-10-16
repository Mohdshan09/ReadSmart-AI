import { GoogleGenAI, Type } from '@google/genai';
import { buildMeaningPrompt } from '../prompts/meaning.prompt.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';

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
  difficulty: 'beginner' | 'intermediate' | 'advanced';
};

// Structured output: Gemini is forced to return JSON in exactly this shape,
// so no regex cleanup of ```json fences is needed.
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    word: { type: Type.STRING },
    shortAnnotation: { type: Type.STRING },
    pronunciation: { type: Type.STRING },
    partOfSpeech: { type: Type.STRING },
    simpleMeaning: { type: Type.STRING },
    hindiMeaning: { type: Type.STRING },
    beginnerExplain: { type: Type.STRING },
    synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
    exampleSentence: { type: Type.STRING },
    difficulty: { type: Type.STRING, enum: ['beginner', 'intermediate', 'advanced'] },
  },
  required: [
    'word', 'shortAnnotation', 'pronunciation', 'partOfSpeech', 'simpleMeaning',
    'hindiMeaning', 'beginnerExplain', 'synonyms', 'exampleSentence', 'difficulty',
  ],
};

export async function getWordMeaning(word: string, line: string, context: string): Promise<WordMeaning> {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: buildMeaningPrompt(word, line, context),
    config: {
      responseMimeType: 'application/json',
      responseSchema,
      temperature: 0.3,
      maxOutputTokens: 1024,
    },
  });

  const text = response.text;
  if (!text) throw new Error('Gemini returned an empty response.');
  return JSON.parse(text) as WordMeaning;
}

// Images are processed in memory and are never written to disk or stored.
// The returned text lets the client render individual, tappable words.
export async function extractTextFromImage(image: Buffer, mimeType: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType,
              data: image.toString('base64'),
            },
          },
          {
            text:
              'Transcribe all clearly readable text in this image. Preserve paragraph and line breaks where practical. ' +
              'Return only the transcribed text—do not add a title, commentary, Markdown, or a translation.',
          },
        ],
      },
    ],
    config: {
      temperature: 0,
      maxOutputTokens: 4096,
    },
  });

  const text = response.text?.trim();
  if (!text) throw new Error('Image mein readable text nahi mila. Clear photo ke saath dobara try karo.');
  return text;
}
