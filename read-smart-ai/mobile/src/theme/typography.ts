import { Platform } from 'react-native';

// Excalidraw-inspired type: a hand-drawn font for headings/titles/buttons
// (loaded in src/app/_layout.tsx via @expo-google-fonts/patrick-hand), and a
// clean system sans for body/reading text so long passages stay legible.
export const fonts = {
  heading: 'PatrickHand_400Regular',
  body: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  }),
};
