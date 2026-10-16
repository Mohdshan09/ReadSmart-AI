import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ProgressBar } from '@/components/common/ProgressBar';
import { useTheme } from '@/hooks/useTheme';

type Props = { page: number; total: number; onChange: (page: number) => void };

export function PageNav({ page, total, onChange }: Props) {
  const { t } = useTheme();
  const atStart = page === 0;
  const atEnd = page === total - 1;
  return (
    <View style={[styles.bar, { backgroundColor: t.card, borderTopColor: t.border }]}>
      <Pressable
        disabled={atStart}
        onPress={() => onChange(page - 1)}
        style={[styles.btn, { backgroundColor: atStart ? t.border : t.accentL }]}
      >
        <Text style={{ color: atStart ? t.sub : t.accent, fontWeight: '700' }}>← Prev</Text>
      </Pressable>
      <View style={{ flex: 1 }}>
        <ProgressBar value={(page + 1) / total} height={4} />
      </View>
      <Pressable
        disabled={atEnd}
        onPress={() => onChange(page + 1)}
        style={[styles.btn, { backgroundColor: atEnd ? t.border : t.accent }]}
      >
        <Text style={{ color: atEnd ? t.sub : '#fff', fontWeight: '700' }}>Next →</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 18, paddingVertical: 11, borderTopWidth: 1 },
  btn: { borderRadius: 99, paddingHorizontal: 20, paddingVertical: 9 },
});
