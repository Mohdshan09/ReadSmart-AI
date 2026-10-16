import { BookOpen, Trash } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { fonts } from '@/theme/typography';
import type { NotebookEntry } from '@/types';

export function WordListItem({ entry, onDelete }: { entry: NotebookEntry; onDelete: () => void }) {
  const { t } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: t.card, borderColor: t.border }]}>
      <View style={styles.row}>
        <Text style={[styles.word, { color: t.accent }]}>{entry.word}</Text>
        <Text style={{ fontSize: 10, color: t.sub }}>{entry.date}</Text>
      </View>
      {entry.pronunciation ? (
        <Text style={{ fontSize: 11, color: t.sub, fontStyle: 'italic', marginBottom: 4 }}>/{entry.pronunciation}/</Text>
      ) : null}
      <Text style={{ fontSize: 13, color: t.text, marginBottom: 4 }}>{entry.meaning}</Text>
      {entry.hindi ? <Text style={{ fontSize: 12, color: t.yellow }}>{entry.hindi}</Text> : null}
      {entry.synonyms.length > 0 && (
        <View style={[styles.row, { flexWrap: 'wrap', gap: 4, marginTop: 6, justifyContent: 'flex-start' }]}>
          {entry.synonyms.map((s) => (
            <Text key={s} style={[styles.syn, { backgroundColor: t.accentL, color: t.accent }]}>{s}</Text>
          ))}
        </View>
      )}
      <View style={[styles.row, { marginTop: 8 }]}>
        <View style={styles.meta}>
          <BookOpen color={t.sub} size={12} strokeWidth={2} />
          <Text style={{ fontSize: 10, color: t.sub }}>{entry.book} · pg {entry.page}</Text>
        </View>
        <Pressable onPress={onDelete} hitSlop={10}>
          <Trash color={t.danger} size={16} strokeWidth={2} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 13, padding: 14, borderWidth: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  word: { fontSize: 16, fontWeight: '700', fontFamily: fonts.heading },
  syn: { borderRadius: 99, paddingHorizontal: 9, paddingVertical: 2, fontSize: 11, overflow: 'hidden' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4, minWidth: 0, flexShrink: 1 },
});
