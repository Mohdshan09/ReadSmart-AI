import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/common/EmptyState';
import { Header } from '@/components/common/Header';
import { Loader } from '@/components/common/Loader';
import { useTheme } from '@/hooks/useTheme';
import { findBook, useLibrary } from '@/store/libraryStore';

export default function ReadTab() {
  const { t } = useTheme();
  const { lastBookId, books, progress, loaded } = useLibrary();
  const book = lastBookId ? findBook(lastBookId, books) : undefined;

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.bg }}>
      <Header title="Continue Reading" />
      {!loaded ? (
        <Loader variant="card" label="Load ho raha hai…" style={{ margin: 16 }} />
      ) : book ? (
        <View style={{ padding: 16 }}>
          <Pressable
            onPress={() => router.push(`/reader/${book.id}`)}
            style={{ backgroundColor: t.accent, borderRadius: 14, padding: 18 }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>{book.emoji} {book.title}</Text>
            <Text style={{ color: '#ffffffcc', marginTop: 4 }}>
              Page {(progress[book.id] ?? 0) + 1} of {book.pages.length} · Tap to continue
            </Text>
          </Pressable>
        </View>
      ) : (
        <EmptyState message="Abhi koi book nahi khuli. Home se ek book choose karo!" />
      )}
    </SafeAreaView>
  );
}
