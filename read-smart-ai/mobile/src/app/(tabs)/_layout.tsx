import { Tabs } from 'expo-router';
import { BookOpen, Camera, CircleUser, GraduationCap, House, type LucideIcon } from 'lucide-react-native';
import type { ColorValue } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

const tabIcon = (Icon: LucideIcon) => {
  const TabBarIcon = ({ color, size }: { color: ColorValue; size: number }) => (
    <Icon color={color as string} size={size} strokeWidth={2.25} />
  );
  return TabBarIcon;
};

export default function TabsLayout() {
  const { t } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: t.accent,
        tabBarInactiveTintColor: t.sub,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarStyle: {
          backgroundColor: t.card,
          borderTopColor: t.border,
          shadowColor: '#1b1b1f',
          shadowOpacity: 0.06,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: -2 },
          elevation: 8,
        },
        sceneStyle: { backgroundColor: t.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: tabIcon(House) }} />
      <Tabs.Screen name="read" options={{ title: 'Read', tabBarIcon: tabIcon(BookOpen) }} />
      <Tabs.Screen name="vocab" options={{ title: 'Vocab', tabBarIcon: tabIcon(GraduationCap) }} />
      <Tabs.Screen name="scanner" options={{ title: 'Scan', tabBarIcon: tabIcon(Camera) }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: tabIcon(CircleUser) }} />
    </Tabs>
  );
}
