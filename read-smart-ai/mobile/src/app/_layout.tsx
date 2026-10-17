import { PatrickHand_400Regular, useFonts } from '@expo-google-fonts/patrick-hand';
import { type ErrorBoundaryProps, Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Loader } from '@/components/common/Loader';
import { ToastHost } from '@/components/common/ToastHost';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/store/authStore';
import { useLibrary } from '@/store/libraryStore';
import { useMeaningCache } from '@/store/meaningCache';
import { useNotebook } from '@/store/notebookStore';
import { useSettings } from '@/store/settingsStore';
import { fonts } from '@/theme/typography';

// Catches any render-time crash in the app below the root, so an unexpected
// error shows a friendly retry screen instead of a blank/red crash.
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  const { t } = useTheme();
  return (
    <SafeAreaView style={[errStyles.screen, { backgroundColor: t.bg }]}>
      <Text style={[errStyles.title, { color: t.text }]}>Kuch toot gaya 😕</Text>
      <Text style={[errStyles.msg, { color: t.sub }]}>{error.message || 'Unexpected error aaya.'}</Text>
      <Pressable onPress={retry} style={[errStyles.btn, { backgroundColor: t.accent }]}>
        <Text style={errStyles.btnText}>Dobara try karo</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const errStyles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 28 },
  title: { fontSize: 22, fontWeight: '800', fontFamily: fonts.heading },
  msg: { fontSize: 13, lineHeight: 19, textAlign: 'center' },
  btn: { borderRadius: 12, paddingHorizontal: 22, paddingVertical: 13, marginTop: 6 },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
});

export default function RootLayout() {
  const { t, isDark } = useTheme();
  const markActiveToday = useSettings((s) => s.markActiveToday);
  const [fontsLoaded, fontError] = useFonts({ PatrickHand_400Regular });

  const hydrated = useAuth((s) => s.hydrated);
  const userId = useAuth((s) => s.user?.id ?? null);
  const recordActivity = useAuth((s) => s.recordActivity);
  const segments = useSegments();
  const router = useRouter();

  // Proceed even if the font fails to load (it just falls back to the system
  // font) — never leave the app stuck on the splash loader.
  const ready = (fontsLoaded || !!fontError) && hydrated;

  useEffect(() => {
    markActiveToday();
  }, [markActiveToday]);

  // Load this account's data on sign-in; clear it on sign-out so nothing of one
  // account is visible to the next. Keyed on userId, so switching accounts
  // re-hydrates with the new user's library, notebook and progress.
  useEffect(() => {
    if (!ready) return;
    if (userId) {
      recordActivity();
      useLibrary.getState().hydrate();
      useNotebook.getState().hydrate();
    } else {
      useLibrary.getState().reset();
      useNotebook.getState().reset();
      useMeaningCache.getState().clear();
    }
  }, [ready, userId, recordActivity]);

  // Auth gate: logged-out users are kept in the (auth) group; logged-in users
  // are pushed out of it. Runs only once fonts + the persisted session load.
  useEffect(() => {
    if (!ready) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!userId && !inAuthGroup) {
      router.replace('/login');
    } else if (userId && inAuthGroup) {
      router.replace('/');
    }
  }, [ready, userId, segments, router]);

  // Hold render until the hand-drawn font AND the persisted session are ready,
  // so we never flash the fallback font or the login screen on a cold start.
  if (!ready) {
    return (
      <>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Loader variant="screen" label="Thoda ruko…" />
      </>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: t.bg } }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="reader/[bookId]" />
      </Stack>
      <ToastHost />
    </>
  );
}
