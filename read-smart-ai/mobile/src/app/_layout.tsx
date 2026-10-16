import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useSettings } from '@/store/settingsStore';

export default function RootLayout() {
  const { t, isDark } = useTheme();
  const markActiveToday = useSettings((s) => s.markActiveToday);

  useEffect(() => {
    markActiveToday();
  }, [markActiveToday]);

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
