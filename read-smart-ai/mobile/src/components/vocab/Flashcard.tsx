import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { fonts } from '@/theme/typography';
import type { NotebookEntry } from '@/types';

export function Flashcards({ words }: { words: NotebookEntry[] }) {
  const { t } = useTheme();
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const current = words[idx % words.length];

  const go = (delta: number) => {
    setIdx((i) => (i + delta + words.length) % words.length);
    setFlipped(false);
  };

  return (
    <View style={{ gap: 12 }}>
      <Pressable
        onPress={() => setFlipped((f) => !f)}
        style={[styles.card, { backgroundColor: t.card, borderColor: t.accent + '33' }]}
      >
        <Text style={[styles.word, { color: t.accent }]}>{current.word}</Text>
        {flipped ? (
          <>
            <Text style={{ fontSize: 14, color: t.text, marginBottom: 6, textAlign: 'center' }}>{current.meaning}</Text>
            <Text style={{ fontSize: 13, color: t.yellow, textAlign: 'center' }}>{current.hindi}</Text>
          </>
        ) : (
          <Text style={{ fontSize: 12, color: t.sub, fontStyle: 'italic' }}>Tap to reveal meaning</Text>
        )}
      </Pressable>
      <View style={styles.controls}>
        <Pressable onPress={() => go(-1)} style={[styles.btn, { backgroundColor: t.accentL }]}>
          <Text style={{ color: t.accent, fontWeight: '700' }}>← Prev</Text>
        </Pressable>
        <Text style={{ fontSize: 12, color: t.sub }}>{(idx % words.length) + 1}/{words.length}</Text>
        <Pressable onPress={() => go(1)} style={[styles.btn, { backgroundColor: t.accent }]}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Next →</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, paddingVertical: 28, paddingHorizontal: 20, borderWidth: 1.5, minHeight: 160, alignItems: 'center', justifyContent: 'center' },
  word: { fontSize: 24, fontWeight: '800', fontFamily: fonts.heading, marginBottom: 10 },
  controls: { flexDirection: 'row', gap: 10, justifyContent: 'center', alignItems: 'center' },
  btn: { borderRadius: 99, paddingHorizontal: 22, paddingVertical: 9 },
});
