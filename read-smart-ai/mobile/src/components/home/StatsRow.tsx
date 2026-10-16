import { BookOpen, Bookmark, Flame, type LucideIcon } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

type Stat = { value: string; label: string; icon: LucideIcon; color: string; bg: string };

export function StatsRow({ streak, words, books }: { streak: number; words: number; books: number }) {
  const { t } = useTheme();
  const stats: Stat[] = [
    { value: `${streak}`, label: 'Streak', icon: Flame, color: t.yellow, bg: t.yellowL },
    { value: `${words}`, label: 'Words', icon: Bookmark, color: t.accent, bg: t.accentL },
    { value: `${books}`, label: 'Books', icon: BookOpen, color: t.green, bg: t.greenL },
  ];
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {stats.map((s) => (
        <View key={s.label} style={[styles.stat, { backgroundColor: s.bg, borderColor: s.color + '28' }]}>
          <View style={styles.value}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: s.color }}>{s.value}</Text>
            <s.icon color={s.color} size={14} strokeWidth={2.25} />
          </View>
          <Text style={{ fontSize: 10, color: t.sub, fontWeight: '600', marginTop: 1 }}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stat: { flex: 1, borderWidth: 1, borderRadius: 11, paddingVertical: 8, alignItems: 'center' },
  value: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
