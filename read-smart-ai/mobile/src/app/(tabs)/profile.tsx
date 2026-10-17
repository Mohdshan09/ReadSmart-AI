import { AtSign, LogOut, Moon, ShieldCheck, Sun } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatsRow } from '@/components/home/StatsRow';
import { useTheme } from '@/hooks/useTheme';
import { useAllBooks } from '@/store/libraryStore';
import { useAuth } from '@/store/authStore';
import { useNotebook } from '@/store/notebookStore';
import { useSettings } from '@/store/settingsStore';
import { toast } from '@/store/toastStore';
import { island, islandSoft } from '@/theme/shape';
import { fonts } from '@/theme/typography';

export default function ProfileScreen() {
  const { t, isDark } = useTheme();
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);
  const toggleDark = useSettings((s) => s.toggleDark);
  const streak = useSettings((s) => s.streak);
  const words = useNotebook((s) => s.words);
  const books = useAllBooks();

  const [confirmLogout, setConfirmLogout] = useState(false);
  const [busy, setBusy] = useState(false);

  const name = user?.displayName?.trim() || user?.email?.split('@')[0] || 'Reader';
  const initial = name.charAt(0).toUpperCase();

  const handleLogout = async () => {
    if (!confirmLogout) {
      setConfirmLogout(true);
      return;
    }
    setBusy(true);
    await signOut(); // root gate redirects to /login once user becomes null
    toast.success('Logout ho gaya. Phir milte hain!');
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={[styles.header, islandSoft, { backgroundColor: t.card, borderBottomColor: t.border }]}>
        <Text style={[styles.kicker, { color: t.accent }]}>Account</Text>
        <Text style={[styles.title, { color: t.text }]}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Identity */}
        <View style={[styles.card, island, { backgroundColor: t.card, borderColor: t.border }]}>
          <View style={styles.identity}>
            <View style={[styles.avatar, { backgroundColor: t.accent }]}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text numberOfLines={1} style={[styles.name, { color: t.text }]}>{name}</Text>
              <View style={styles.emailRow}>
                <AtSign color={t.sub} size={13} strokeWidth={2.25} />
                <Text numberOfLines={1} style={{ color: t.sub, fontSize: 13, flex: 1 }}>{user?.email}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Activity */}
        <Text style={[styles.section, { color: t.accent }]}>Your Activity</Text>
        <View style={[styles.card, island, { backgroundColor: t.card, borderColor: t.border }]}>
          <StatsRow streak={streak} words={words.length} books={books.length} />
        </View>

        {/* Preferences */}
        <Text style={[styles.section, { color: t.accent }]}>Preferences</Text>
        <Pressable
          onPress={toggleDark}
          style={[styles.row, island, { backgroundColor: t.card, borderColor: t.border }]}
        >
          <View style={[styles.rowIcon, { backgroundColor: t.accentL }]}>
            {isDark ? <Sun color={t.accent} size={17} strokeWidth={2.25} /> : <Moon color={t.accent} size={17} strokeWidth={2.25} />}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, { color: t.text }]}>Dark mode</Text>
            <Text style={{ color: t.sub, fontSize: 12 }}>{isDark ? 'On' : 'Off'}</Text>
          </View>
          <View style={[styles.pill, { backgroundColor: t.accentL, borderColor: t.accent + '33' }]}>
            <Text style={{ color: t.accent, fontSize: 12, fontWeight: '700' }}>{isDark ? 'Light karo' : 'Dark karo'}</Text>
          </View>
        </Pressable>

        <View style={[styles.row, island, { backgroundColor: t.card, borderColor: t.border }]}>
          <View style={[styles.rowIcon, { backgroundColor: t.greenL }]}>
            <ShieldCheck color={t.green} size={17} strokeWidth={2.25} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, { color: t.text }]}>Signed in</Text>
            <Text style={{ color: t.sub, fontSize: 12 }}>Tumhari progress is account se judi hai</Text>
          </View>
        </View>

        {/* Logout */}
        <Pressable
          onPress={handleLogout}
          disabled={busy}
          style={[styles.logout, { backgroundColor: t.dangerL, borderColor: t.danger + '33', opacity: busy ? 0.6 : 1 }]}
        >
          <LogOut color={t.danger} size={17} strokeWidth={2.25} />
          <Text style={{ color: t.danger, fontWeight: '800', fontSize: 14 }}>
            {confirmLogout ? 'Pakka? Tap karke confirm karo' : 'Log out'}
          </Text>
        </Pressable>
        {confirmLogout && !busy ? (
          <Pressable onPress={() => setConfirmLogout(false)} style={styles.cancel}>
            <Text style={{ color: t.sub, fontSize: 13, fontWeight: '600' }}>Rehne do</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { padding: 16, borderBottomWidth: 1 },
  kicker: { fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  title: { fontSize: 22, fontWeight: '800', fontFamily: fonts.heading },
  card: { borderWidth: 1, borderRadius: 16, padding: 16 },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: '800', fontFamily: fonts.heading },
  name: { fontSize: 18, fontWeight: '800' },
  emailRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 },
  section: { fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 13, borderWidth: 1, borderRadius: 14, padding: 14 },
  rowIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontSize: 14, fontWeight: '700' },
  pill: { borderWidth: 1, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 6 },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 15,
    marginTop: 4,
  },
  cancel: { alignItems: 'center', paddingVertical: 4 },
});
