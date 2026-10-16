import { dark, light } from '@/theme/colors';
import { useSettings } from '@/store/settingsStore';

export function useTheme() {
  const isDark = useSettings((s) => s.dark);
  return { t: isDark ? dark : light, isDark };
}
