import { ActivityIndicator, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { island } from '@/theme/shape';
import { fonts } from '@/theme/typography';

type Props = {
  /** Message shown beside / under the spinner. */
  label?: string;
  /**
   * inline  – spinner + label in a row, no surface (use inside another card).
   * card    – a bordered "island" banner (default; matches loading rows).
   * screen  – full-screen centred loader for app start / empty routes.
   */
  variant?: 'inline' | 'card' | 'screen';
  size?: 'small' | 'large';
  /** Extra style for the container (e.g. margins) on inline/card variants. */
  style?: ViewStyle;
};

export function Loader({ label, variant = 'card', size = 'small', style }: Props) {
  const { t } = useTheme();

  if (variant === 'screen') {
    return (
      <View style={[styles.screen, { backgroundColor: t.bg }]}>
        <View style={[styles.badge, { backgroundColor: t.accentL, borderColor: t.accent + '33' }]}>
          <ActivityIndicator size="large" color={t.accent} />
        </View>
        <Text style={[styles.brand, { color: t.text }]}>Read Smart AI</Text>
        {label ? <Text style={[styles.screenLabel, { color: t.sub }]}>{label}</Text> : null}
      </View>
    );
  }

  const row = (
    <>
      <ActivityIndicator size={size} color={t.accent} />
      {label ? <Text style={[styles.label, { color: t.accent }]}>{label}</Text> : null}
    </>
  );

  if (variant === 'inline') {
    return <View style={[styles.inline, style]}>{row}</View>;
  }

  return (
    <View style={[styles.card, island, { backgroundColor: t.card, borderColor: t.border }, style]}>
      {row}
    </View>
  );
}

const styles = StyleSheet.create({
  inline: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  label: { fontSize: 13, fontWeight: '600' },
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 },
  badge: {
    width: 72,
    height: 72,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: { fontSize: 22, fontFamily: fonts.heading, fontWeight: '800' },
  screenLabel: { fontSize: 13 },
});
