import { router, useLocalSearchParams } from 'expo-router';
import { Bookmark, Hand, TriangleAlert, X } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/common/EmptyState';
import { Header } from '@/components/common/Header';
import { ProgressBar } from '@/components/common/ProgressBar';
import { DetailCard } from '@/components/reader/DetailCard';
import { PageNav } from '@/components/reader/PageNav';
import { SmartLine } from '@/components/reader/SmartLine';
import { useMeaning } from '@/hooks/useMeaning';
import { useTheme } from '@/hooks/useTheme';
import { findBook, useLibrary } from '@/store/libraryStore';
import { useNotebook } from '@/store/notebookStore';
import { fonts } from '@/theme/typography';

export default function ReaderScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const { t } = useTheme();
  const { uploaded, progress, setPage } = useLibrary();
  const notebook = useNotebook();
  const book = findBook(bookId, uploaded);

  const [pageIdx, setPageIdx] = useState(() => progress[bookId] ?? 0);
  const page = book?.pages[Math.min(pageIdx, (book?.pages.length ?? 1) - 1)];
  const lines = page?.lines ?? [];
  const { active, data, loading, error, tap, close } = useMeaning(lines.join(' '));

  const savedWords = notebook.words;
  const isSaved = useCallback(
    (w: string) => savedWords.some((x) => x.word.toLowerCase() === w.toLowerCase()),
    [savedWords]
  );

  if (!book || !page) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
        <Header title="Book not found" back />
        <EmptyState message="Ye book nahi mili." />
      </SafeAreaView>
    );
  }

  const changePage = (n: number) => {
    const next = Math.max(0, Math.min(book.pages.length - 1, n));
    setPageIdx(next);
    setPage(book.id, next);
    close();
  };

  const onWordPress = (word: string, line: string, lineIdx: number, key: string) =>
    tap({ key: `${pageIdx}-${key}`, word, line, lineIdx });

  const activeKeyOnPage = active?.key.startsWith(`${pageIdx}-`) ? active.key.slice(`${pageIdx}-`.length) : null;

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: t.bg }}>
      <Header
        title={book.title}
        subtitle={`Page ${pageIdx + 1} of ${book.pages.length}`}
        back
        right={
          <Pressable
            onPress={() => router.push('/vocab')}
            style={[styles.nbBtn, { backgroundColor: t.yellowL, borderColor: t.yellow + '44' }]}
          >
            <Bookmark color={t.yellow} size={13} strokeWidth={2.25} />
            <Text style={{ color: t.yellow, fontSize: 11, fontWeight: '700' }}>{notebook.words.length}</Text>
          </Pressable>
        }
      />
      <ProgressBar value={(pageIdx + 1) / book.pages.length} />
      <View style={[styles.hint, { backgroundColor: t.accentL }]}>
        <Hand color={t.accent} size={15} strokeWidth={2.25} />
        <Text style={{ flex: 1, fontSize: 12, color: t.accent, fontWeight: '500' }}>
          Kisi bhi word pe tap karo, seedha neeche meaning aayegi
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.page}>
        <Text style={[styles.title, { color: t.text }]}>{page.title}</Text>
        {page.author ? <Text style={[styles.author, { color: t.sub }]}>— {page.author}</Text> : null}

        {lines.map((line, lIdx) => {
          const lineActive = active?.lineIdx === lIdx && activeKeyOnPage !== null;
          return (
            <View key={lIdx}>
              <SmartLine
                line={line}
                lineIdx={lIdx}
                activeKey={activeKeyOnPage}
                loading={loading}
                annotation={data?.shortAnnotation}
                isSaved={isSaved}
                onWordPress={onWordPress}
              />
              {lineActive && loading && (
                <View style={[styles.loading, { backgroundColor: t.card, borderColor: t.accent + '30' }]}>
                  <ActivityIndicator color={t.accent} />
                  <Text style={{ fontSize: 13, color: t.accent, fontWeight: '500' }}>Meaning dhundh raha hai…</Text>
                </View>
              )}
              {lineActive && !loading && data && (
                <DetailCard
                  data={data}
                  saved={notebook.has(data.word)}
                  onSave={() => notebook.save(data, book.title, pageIdx + 1)}
                  onClose={close}
                />
              )}
              {lineActive && !loading && error && (
                <Pressable onPress={close} style={[styles.error, { backgroundColor: t.dangerL }]}>
                  <TriangleAlert color={t.danger} size={15} strokeWidth={2.25} />
                  <Text style={{ flex: 1, fontSize: 12, color: t.danger }}>{error}</Text>
                  <X color={t.danger} size={15} strokeWidth={2.25} />
                </Pressable>
              )}
            </View>
          );
        })}
      </ScrollView>

      <PageNav page={pageIdx} total={book.pages.length} onChange={changePage} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  nbBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 5 },
  hint: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8 },
  page: { paddingHorizontal: 22, paddingTop: 24, paddingBottom: 40 },
  title: { fontFamily: fonts.heading, fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: 5 },
  author: { textAlign: 'center', fontSize: 12, fontStyle: 'italic', marginBottom: 26 },
  loading: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1.5, borderRadius: 10, padding: 10, marginTop: 6, marginBottom: 10 },
  error: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 10, padding: 10, marginTop: 6, marginBottom: 8 },
});
