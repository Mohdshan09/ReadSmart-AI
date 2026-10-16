import { StyleSheet, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import type { Difficulty } from '@/types';

export function Badge({ level }: { level: Difficulty }) {
  const { t } = useTheme();
  const c = level === 'beginner' ? t.green : level === 'advanced' ? t.pink : t.yellow;
  return (
    <Text style={[styles.badge, { color: c, borderColor: c + '55', backgroundColor: c + '22' }]}>
      {level}
    </Text>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 1,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    overflow: 'hidden',
  },
});
