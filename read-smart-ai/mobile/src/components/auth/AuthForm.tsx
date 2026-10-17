import { Link } from 'expo-router';
import { BookOpenText, Eye, EyeOff, Lock, LogIn, Mail, User, UserPlus } from 'lucide-react-native';
import { type ComponentProps, type ReactNode, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import * as authApi from '@/services/auth';
import { useAuth } from '@/store/authStore';
import { toast } from '@/store/toastStore';
import { island, islandSoft } from '@/theme/shape';
import { fonts } from '@/theme/typography';

type Mode = 'login' | 'register';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COPY: Record<Mode, { title: string; sub: string; cta: string; switchText: string; switchLink: string; href: '/login' | '/register' }> = {
  login: {
    title: 'Wapas aa gaye!',
    sub: 'Apne account me login karo aur padhte raho.',
    cta: 'Log in',
    switchText: 'Naye ho? ',
    switchLink: 'Account banao',
    href: '/register',
  },
  register: {
    title: 'Account banao',
    sub: 'Apni reading aur saved words sab jagah sync raho.',
    cta: 'Sign up',
    switchText: 'Pehle se account hai? ',
    switchLink: 'Log in karo',
    href: '/login',
  },
};

export function AuthForm({ mode }: { mode: Mode }) {
  const { t } = useTheme();
  const signIn = useAuth((s) => s.signIn);
  const copy = COPY[mode];

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const mail = email.trim().toLowerCase();
    if (!EMAIL_RE.test(mail)) {
      toast.error('Email sahi format me daalo (jaise naam@mail.com).');
      return;
    }
    if (password.length < 8) {
      toast.error('Password kam se kam 8 characters ka hona chahiye.');
      return;
    }
    setBusy(true);
    try {
      const res =
        mode === 'register'
          ? await authApi.register(mail, password, displayName.trim() || undefined)
          : await authApi.login(mail, password);
      const who = res.user.displayName?.trim() || res.user.email.split('@')[0];
      toast.success(mode === 'register' ? `Account ban gaya — welcome, ${who}!` : `Welcome back, ${who}!`);
      signIn(res);
      // The root auth gate redirects to the app once `user` is set.
    } catch (err) {
      // Surface the server's specific message (e.g. "Email ya password galat hai.").
      toast.error(err instanceof Error ? err.message : 'Login nahi ho paaya. Dobara try karo.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.brand}>
            <View style={[styles.logo, islandSoft, { backgroundColor: t.accentL, borderColor: t.accent + '33' }]}>
              <BookOpenText color={t.accent} size={30} strokeWidth={2} />
            </View>
            <Text style={[styles.appName, { color: t.text }]}>Read Smart AI</Text>
          </View>

          <View style={[styles.card, island, { backgroundColor: t.card, borderColor: t.border }]}>
            <Text style={[styles.title, { color: t.text }]}>{copy.title}</Text>
            <Text style={[styles.sub, { color: t.sub }]}>{copy.sub}</Text>

            {mode === 'register' && (
              <Field
                icon={<User color={t.sub} size={17} strokeWidth={2} />}
                placeholder="Naam (optional)"
                value={displayName}
                onChangeText={setDisplayName}
                autoCapitalize="words"
                t={t}
              />
            )}

            <Field
              icon={<Mail color={t.sub} size={17} strokeWidth={2} />}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              t={t}
            />

            <Field
              icon={<Lock color={t.sub} size={17} strokeWidth={2} />}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              t={t}
              trailing={
                <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={10}>
                  {showPassword ? <EyeOff color={t.sub} size={17} strokeWidth={2} /> : <Eye color={t.sub} size={17} strokeWidth={2} />}
                </Pressable>
              }
            />

            <Pressable
              onPress={submit}
              disabled={busy}
              style={[styles.submit, { backgroundColor: t.accent, opacity: busy ? 0.7 : 1 }]}
            >
              {busy ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : mode === 'register' ? (
                <UserPlus color="#fff" size={17} strokeWidth={2.25} />
              ) : (
                <LogIn color="#fff" size={17} strokeWidth={2.25} />
              )}
              <Text style={styles.submitText}>{copy.cta}</Text>
            </Pressable>

            <View style={styles.switchRow}>
              <Text style={{ color: t.sub, fontSize: 13 }}>{copy.switchText}</Text>
              <Link href={copy.href} replace style={[styles.switchLink, { color: t.accent }]}>
                {copy.switchLink}
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type FieldProps = {
  icon: ReactNode;
  trailing?: ReactNode;
  t: ReturnType<typeof useTheme>['t'];
} & ComponentProps<typeof TextInput>;

function Field({ icon, trailing, t, ...input }: FieldProps) {
  return (
    <View style={[styles.field, { backgroundColor: t.bg, borderColor: t.border }]}>
      {icon}
      <TextInput
        style={[styles.input, { color: t.text }]}
        placeholderTextColor={t.sub}
        {...input}
      />
      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, justifyContent: 'center', padding: 22, gap: 22 },
  brand: { alignItems: 'center', gap: 12 },
  logo: { width: 66, height: 66, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  appName: { fontSize: 24, fontFamily: fonts.heading, fontWeight: '800' },
  card: { borderWidth: 1, borderRadius: 18, padding: 20, gap: 13 },
  title: { fontSize: 21, fontWeight: '800', fontFamily: fonts.heading },
  sub: { fontSize: 13, lineHeight: 19, marginTop: -6, marginBottom: 2 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: Platform.OS === 'ios' ? 13 : 4,
  },
  input: { flex: 1, fontSize: 15, paddingVertical: Platform.OS === 'ios' ? 0 : 9 },
  submit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 4,
  },
  submitText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  switchRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 2 },
  switchLink: { fontSize: 13, fontWeight: '800' },
});
