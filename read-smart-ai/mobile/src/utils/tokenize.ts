export type Token =
  | { kind: 'space'; text: string }
  | { kind: 'plain'; text: string }
  | { kind: 'word'; text: string; clean: string; index: number };

// Splits a line into tokens. Only real words (2+ letters) are tappable.
export function tokenizeLine(line: string): Token[] {
  let index = 0;
  return line
    .split(/(\s+)/)
    .filter((t) => t !== '')
    .map((text): Token => {
      if (/^\s+$/.test(text)) return { kind: 'space', text };
      const clean = text.replace(/[^a-zA-Z'-]/g, '').replace(/^['-]+|['-]+$/g, '');
      if (clean.length < 2) return { kind: 'plain', text };
      return { kind: 'word', text, clean, index: index++ };
    });
}
