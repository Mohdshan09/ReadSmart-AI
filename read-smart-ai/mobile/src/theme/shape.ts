import type { ViewStyle } from 'react-native';

// The soft, low floating shadow Excalidraw uses to lift panels off the canvas.
// react-native-web maps these shadow props to box-shadow; elevation covers
// Android. Spread it into a container's style to make it read as an "island".
export const island: ViewStyle = {
  shadowColor: '#1b1b1f',
  shadowOpacity: 0.1,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};

// A lighter lift for bars/toolbars pinned to an edge.
export const islandSoft: ViewStyle = {
  shadowColor: '#1b1b1f',
  shadowOpacity: 0.06,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
};
