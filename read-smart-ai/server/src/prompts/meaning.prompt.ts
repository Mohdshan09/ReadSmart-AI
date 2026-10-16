export function buildMeaningPrompt(word: string, line: string, context: string) {
  return `You are a vocabulary assistant in a reading app for Indian users.

Word: "${word}"
Line: "${line}"
Context: "${context}"

Explain the word as it is used in this line. Return JSON with:
- word: the word itself
- shortAnnotation: 2-4 words max, like "deep sadness" or "twisted path", shown inline below the word
- pronunciation: simple phonetic spelling
- partOfSpeech: noun / verb / adjective / adverb / etc.
- simpleMeaning: one clear plain-English sentence
- hindiMeaning: Hindi in Devanagari script, with romanized Hindi in brackets
- beginnerExplain: 1-2 sentences with a simple everyday analogy
- synonyms: exactly 3 simpler synonyms
- exampleSentence: a fresh, vivid example sentence
- difficulty: beginner, intermediate or advanced`;
}
