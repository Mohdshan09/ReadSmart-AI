import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ProgressBar } from '@/components/common/ProgressBar';
import { useTheme } from '@/hooks/useTheme';
import { islandSoft } from '@/theme/shape';
import { fonts } from '@/theme/typography';
import type { Book } from '@/types';

export function BookRow({ book, progress, onPress }: { book: Book; progress: number; onPress: () => void }) {
  const { t } = useTheme();
  return (
    <Pressable onPress={onPress} style={[styles.row, islandSoft, { backgroundColor: t.card, borderColor: t.border }]}>
      <View style={[styles.cover, { backgroundColor: t.accentL }]}>
        <Text style={{ fontSize: 22 }}>{book.emoji}</Text>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text numberOfLines={1} style={[styles.title, { color: t.text }]}>{book.title}</Text>
        <Text style={{ fontSize: 11, color: t.sub, marginBottom: 6 }}>{book.author}</Text>
        <ProgressBar value={progress} />
      </View>
      <ChevronRight color={t.sub} size={20} strokeWidth={2.25} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 13, padding: 13, borderWidth: 1 },
  cover: { width: 46, height: 58, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 14, fontWeight: '700', fontFamily: fonts.heading },
});
