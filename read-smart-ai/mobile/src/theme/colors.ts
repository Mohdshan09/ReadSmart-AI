export type Theme = {
  bg: string; paper: string; card: string;
  text: string; sub: string; border: string;
  accent: string; accentL: string;
  highlight: string; highlightText: string;
  yellow: string; yellowL: string;
  green: string; greenL: string;
  pink: string; pinkL: string;
  danger: string; dangerL: string;
};

// Excalidraw-inspired: a light neutral canvas, white "island" surfaces, and the
// signature violet accent. Supporting colours use Open Color (Excalidraw's own
// palette) so chips/badges feel part of the same system.
export const light: Theme = {
  bg: '#f7f8fa', paper: '#ffffff', card: '#ffffff',
  text: '#1b1b1f', sub: '#868e96', border: '#e9ecef',
  accent: '#6965db', accentL: '#6965db14',
  highlight: '#e0dfff', highlightText: '#2b2866',
  yellow: '#f08c00', yellowL: '#fff9db',
  green: '#2f9e44', greenL: '#ebfbee',
  pink: '#e64980', pinkL: '#fff0f6',
  danger: '#e03131', dangerL: '#fff5f5',
};

// Excalidraw dark theme: near-black canvas, #232329 islands, lightened violet.
export const dark: Theme = {
  bg: '#121212', paper: '#232329', card: '#232329',
  text: '#e3e3e8', sub: '#9a9aa5', border: '#31303b',
  accent: '#a8a5ff', accentL: '#a8a5ff1a',
  highlight: '#403d73', highlightText: '#ede8ff',
  yellow: '#ffc93c', yellowL: '#ffc93c14',
  green: '#51cf66', greenL: '#51cf6614',
  pink: '#f783ac', pinkL: '#f783ac14',
  danger: '#ff6b6b', dangerL: '#ff6b6b20',
};
