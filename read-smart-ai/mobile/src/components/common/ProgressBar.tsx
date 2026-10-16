import { View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export function ProgressBar({ value, height = 3 }: { value: number; height?: number }) {
  const { t } = useTheme();
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <View style={{ height, backgroundColor: t.border, borderRadius: height }}>
      <View style={{ width: `${pct}%`, height: '100%', backgroundColor: t.accent, borderRadius: height }} />
    </View>
  );
}
