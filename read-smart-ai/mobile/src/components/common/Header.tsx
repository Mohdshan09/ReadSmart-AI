import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { islandSoft } from '@/theme/shape';
import { fonts } from '@/theme/typography';

type Props = { title: string; subtitle?: string; back?: boolean; right?: ReactNode };

export function Header({ title, subtitle, back, right }: Props) {
  const { t } = useTheme();
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/');
  };

  return (
    <View style={[styles.bar, islandSoft, { backgroundColor: t.card, borderBottomColor: t.border }]}>
      {back && (
        <Pressable onPress={handleBack} hitSlop={12}>
          <ArrowLeft color={t.accent} size={22} strokeWidth={2.25} />
        </Pressable>
      )}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text numberOfLines={1} style={[styles.title, { color: t.text }]}>{title}</Text>
        {subtitle ? <Text style={{ fontSize: 11, color: t.sub }}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  title: { fontSize: 18, fontWeight: '800', fontFamily: fonts.heading },
});
