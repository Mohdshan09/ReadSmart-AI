export type Theme = {
  bg: string; paper: string; card: string;
  text: string; sub: string; border: string;
  accent: string; accentL: string;
  yellow: string; yellowL: string;
  green: string; greenL: string;
  pink: string; pinkL: string;
  danger: string; dangerL: string;
};

export const light: Theme = {
  bg: '#f5f0e8', paper: '#faf7f2', card: '#ffffff',
  text: '#2c2416', sub: '#7a6f5e', border: '#e2d9c8',
  accent: '#5046e4', accentL: '#5046e412',
  yellow: '#c8820a', yellowL: '#fff8e1',
  green: '#2e7d32', greenL: '#e8f5e9',
  pink: '#b5175a', pinkL: '#fce4ec',
  danger: '#991b1b', dangerL: '#fee2e2',
};

export const dark: Theme = {
  bg: '#0e0b14', paper: '#161220', card: '#1e1a2e',
  text: '#ede8ff', sub: '#8880a8', border: '#2d2845',
  accent: '#7c6fff', accentL: '#7c6fff15',
  yellow: '#f59e0b', yellowL: '#f59e0b12',
  green: '#34d399', greenL: '#34d39912',
  pink: '#f472b6', pinkL: '#f472b612',
  danger: '#fca5a5', dangerL: '#7f1d1d40',
};
