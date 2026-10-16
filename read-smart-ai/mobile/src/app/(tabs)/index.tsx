import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookRow } from '@/components/home/BookRow';
import { StatsRow } from '@/components/home/StatsRow';
import { UploadBox } from '@/components/home/UploadBox';
import { useTheme } from '@/hooks/useTheme';
import { pickFile, uploadBook } from '@/services/books';
import { useAllBooks, useLibrary } from '@/store/libraryStore';
import { useNotebook } from '@/store/notebookStore';
import { useSettings } from '@/store/settingsStore';
import { fonts } from '@/theme/typography';

export default function HomeScreen() {
  const { t, isDark } = useTheme();
  const toggleDark = useSettings((s) => s.toggleDark);
  const streak = useSettings((s) => s.streak);
  const words = useNotebook((s) => s.words);
  const books = useAllBooks();
  const { progress, addBook } = useLibrary();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    setError(null);
    const file = await pickFile();
    if (!file) return;
    setUploading(true);
    try {
      const { title, pages } = await uploadBook(file);
      const id = addBook(title, pages);
      router.push(`/reader/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'File upload mein error aaya.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={[styles.header, { backgroundColor: t.card, borderBottomColor: t.border }]}>
        <View style={styles.titleRow}>
          <View>
            <Text style={[styles.kicker, { color: t.accent }]}>Smart Reader</Text>
            <Text style={[styles.title, { color: t.text }]}>Read Smart AI</Text>
          </View>
          <Pressable onPress={toggleDark} style={[styles.toggle, { backgroundColor: t.accentL, borderColor: t.accent + '33' }]}>
            <Text style={{ color: t.accent, fontSize: 12, fontWeight: '700' }}>{isDark ? '☀️ Light' : '🌙 Dark'}</Text>
          </Pressable>
        </View>
        <StatsRow streak={streak} words={words.length} books={books.length} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <UploadBox uploading={uploading} onPress={handleUpload} />
        {error && (
          <Text style={[styles.error, { backgroundColor: t.dangerL, color: t.danger }]}>⚠️ {error}</Text>
        )}

        <Text style={[styles.section, { color: t.accent }]}>Library</Text>
        <View style={{ gap: 9 }}>
          {books.map((b) => (
            <BookRow
              key={b.id}
              book={b}
              progress={((progress[b.id] ?? 0) + 1) / b.pages.length}
              onPress={() => router.push(`/reader/${b.id}`)}
            />
          ))}
        </View>

        {words.length > 0 && (
          <Pressable
            onPress={() => router.push('/vocab')}
            style={[styles.saved, { backgroundColor: t.yellowL, borderColor: t.yellow + '28' }]}
          >
            <View style={[styles.titleRow, { marginBottom: 7 }]}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: t.yellow }}>📚 Saved Words</Text>
              <Text style={{ fontSize: 11, color: t.yellow }}>Sab dekho →</Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
              {words.slice(0, 6).map((w) => (
                <Text key={w.id} style={[styles.chip, { color: t.yellow, borderColor: t.yellow + '44' }]}>{w.word}</Text>
              ))}
            </View>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { padding: 16, borderBottomWidth: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13 },
  kicker: { fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  title: { fontSize: 22, fontWeight: '800', fontFamily: fonts.heading },
  toggle: { borderWidth: 1, borderRadius: 99, paddingHorizontal: 13, paddingVertical: 7 },
  error: { borderRadius: 10, padding: 12, fontSize: 12, overflow: 'hidden' },
  section: { fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  saved: { borderWidth: 1, borderRadius: 13, padding: 13 },
  chip: { borderWidth: 1, borderRadius: 99, paddingHorizontal: 11, paddingVertical: 3, fontSize: 12, fontWeight: '600' },
});
