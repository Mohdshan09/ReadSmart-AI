import { PatrickHand_400Regular, useFonts } from '@expo-google-fonts/patrick-hand';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useSettings } from '@/store/settingsStore';

export default function RootLayout() {
  const { t, isDark } = useTheme();
  const markActiveToday = useSettings((s) => s.markActiveToday);
  const [fontsLoaded] = useFonts({ PatrickHand_400Regular });

  useEffect(() => {
    markActiveToday();
  }, [markActiveToday]);

  // Hold render until the hand-drawn heading font is ready to avoid a flash of
  // the fallback font swapping in.
  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: t.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="reader/[bookId]" />
      </Stack>
    </>
  );
}
