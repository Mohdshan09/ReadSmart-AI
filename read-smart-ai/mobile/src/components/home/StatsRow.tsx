import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

type Stat = { value: string; label: string; color: string; bg: string };

export function StatsRow({ streak, words, books }: { streak: number; words: number; books: number }) {
  const { t } = useTheme();
  const stats: Stat[] = [
    { value: `${streak} 🔥`, label: 'Streak', color: t.yellow, bg: t.yellowL },
    { value: `${words} 📚`, label: 'Words', color: t.accent, bg: t.accentL },
    { value: `${books} 📖`, label: 'Books', color: t.green, bg: t.greenL },
  ];
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {stats.map((s) => (
        <View key={s.label} style={[styles.stat, { backgroundColor: s.bg, borderColor: s.color + '28' }]}>
          <Text style={{ fontSize: 14, fontWeight: '800', color: s.color }}>{s.value}</Text>
          <Text style={{ fontSize: 10, color: t.sub, fontWeight: '600', marginTop: 1 }}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stat: { flex: 1, borderWidth: 1, borderRadius: 11, paddingVertical: 8, alignItems: 'center' },
});
