import { Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export function EmptyState({ message }: { message: string }) {
  const { t } = useTheme();
  return (
    <Text style={{ textAlign: 'center', paddingVertical: 40, color: t.sub, fontSize: 13 }}>
      {message}
    </Text>
  );
}
