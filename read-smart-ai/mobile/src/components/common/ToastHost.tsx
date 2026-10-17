import { CircleCheck, CircleX, Info, type LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import type { Theme } from '@/theme/colors';
import { island } from '@/theme/shape';
import { type ToastType, useToastStore } from '@/store/toastStore';

const META: Record<ToastType, { Icon: LucideIcon; color: (t: Theme) => string }> = {
  success: { Icon: CircleCheck, color: (t) => t.green },
  error: { Icon: CircleX, color: (t) => t.danger },
  info: { Icon: Info, color: (t) => t.accent },
};

// A top overlay that renders active toasts. Mounted once at the app root so any
// `toast.success(...)` / `toast.error(...)` call surfaces here, on web + native.
export function ToastHost() {
  const { t } = useTheme();
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  const insets = useSafeAreaInsets();

  if (toasts.length === 0) return null;

  return (
    <View pointerEvents="box-none" style={[styles.host, { top: insets.top + 8 }]}>
      {toasts.map((item) => {
        const { Icon, color } = META[item.type];
        const accent = color(t);
        return (
          <Animated.View
            key={item.id}
            entering={FadeInUp.duration(220)}
            exiting={FadeOutUp.duration(160)}
            layout={LinearTransition.duration(180)}
            style={styles.wrap}
          >
            <Pressable
              onPress={() => dismiss(item.id)}
              style={[styles.toast, island, { backgroundColor: t.card, borderColor: t.border, borderLeftColor: accent }]}
            >
              <Icon color={accent} size={19} strokeWidth={2.25} />
              <Text style={[styles.text, { color: t.text }]}>{item.message}</Text>
            </Pressable>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
    zIndex: 9999,
  },
  wrap: { width: '100%', maxWidth: 460, alignItems: 'center' },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    width: '100%',
    borderWidth: 1,
    borderLeftWidth: 4,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  text: { flex: 1, fontSize: 13.5, lineHeight: 19, fontWeight: '600' },
});
