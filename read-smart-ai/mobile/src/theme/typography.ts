import { Platform } from 'react-native';

// System serif fonts for now. To use Playfair Display + Lora later:
// npx expo install @expo-google-fonts/playfair-display @expo-google-fonts/lora
// then load them in src/app/_layout.tsx and swap the names here.
export const fonts = {
  heading: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
  body: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
};
