import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

const icon = (emoji: string) => () => <Text style={{ fontSize: 20 }}>{emoji}</Text>;

export default function TabsLayout() {
  const { t } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: t.accent,
        tabBarInactiveTintColor: t.sub,
        tabBarStyle: { backgroundColor: t.card, borderTopColor: t.border },
        sceneStyle: { backgroundColor: t.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: icon('🏠') }} />
      <Tabs.Screen name="read" options={{ title: 'Read', tabBarIcon: icon('📖') }} />
      <Tabs.Screen name="vocab" options={{ title: 'Vocab', tabBarIcon: icon('📚') }} />
      <Tabs.Screen name="scanner" options={{ title: 'Scan', tabBarIcon: icon('📷') }} />
    </Tabs>
  );
}
