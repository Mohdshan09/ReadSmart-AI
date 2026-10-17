import { Brain, Layers, List, type LucideIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/common/EmptyState';
import { Header } from '@/components/common/Header';
import { Loader } from '@/components/common/Loader';
import { Flashcards } from '@/components/vocab/Flashcard';
import { Quiz } from '@/components/vocab/QuizQuestion';
import { WordListItem } from '@/components/vocab/WordListItem';
import { useTheme } from '@/hooks/useTheme';
import { useNotebook } from '@/store/notebookStore';
import { islandSoft } from '@/theme/shape';

type View_ = 'list' | 'flashcard' | 'quiz';
const VIEWS: [View_, LucideIcon, string][] = [
  ['list', List, 'List'],
  ['flashcard', Layers, 'Cards'],
  ['quiz', Brain, 'Quiz'],
];

export default function VocabScreen() {
  const { t } = useTheme();
  const { words, remove } = useNotebook();
  const loaded = useNotebook((s) => s.loaded);
  const [view, setView] = useState<View_>('list');
  const [search, setSearch] = useState('');

  const q = search.toLowerCase();
  const filtered = words.filter(
    (w) => w.word.toLowerCase().includes(q) || w.meaning.toLowerCase().includes(q)
  );

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.bg }}>
      <Header title="Word Notebook" subtitle={`${words.length} words saved`} />
      <View style={[styles.tabs, islandSoft, { backgroundColor: t.card, borderBottomColor: t.border }]}>
        {VIEWS.map(([v, Icon, label]) => {
          const on = view === v;
          return (
            <Pressable key={v} onPress={() => setView(v)} style={[styles.tab, on && { backgroundColor: t.accent }]}>
              <Icon color={on ? '#fff' : t.sub} size={14} strokeWidth={2.25} />
              <Text style={{ fontSize: 12, fontWeight: '600', color: on ? '#fff' : t.sub }}>{label}</Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 9 }} keyboardShouldPersistTaps="handled">
        {view === 'list' && (
          <>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search words..."
              placeholderTextColor={t.sub}
              style={[styles.search, { backgroundColor: t.card, borderColor: t.border, color: t.text }]}
            />
            {!loaded ? (
              <Loader variant="card" label="Words load ho rahe hain…" />
            ) : filtered.length === 0 ? (
              <EmptyState
                message={words.length === 0 ? 'Abhi koi word save nahi hua. Reader mein words pe tap karo!' : 'Koi match nahi mila.'}
              />
            ) : (
              filtered.map((w) => <WordListItem key={w.id} entry={w} onDelete={() => remove(w.id)} />)
            )}
          </>
        )}

        {view === 'flashcard' &&
          (words.length === 0 ? <EmptyState message="Pehle kuch words save karo!" /> : <Flashcards words={words} />)}

        {view === 'quiz' &&
          (words.length < 2 ? <EmptyState message="Quiz ke liye 2+ words save karo!" /> : <Quiz words={words} />)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderBottomWidth: 1 },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 99, paddingHorizontal: 13, paddingVertical: 6 },
  search: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 13, paddingVertical: 10, fontSize: 13, marginBottom: 4 },
});
