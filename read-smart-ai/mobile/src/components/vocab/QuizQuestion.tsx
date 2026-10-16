import { ArrowRight, CircleCheck, CircleX } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { island } from '@/theme/shape';
import { fonts } from '@/theme/typography';
import type { NotebookEntry } from '@/types';
import { buildQuestion } from '@/utils/quiz';

export function Quiz({ words }: { words: NotebookEntry[] }) {
  const { t } = useTheme();
  const [qIdx, setQIdx] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [score, setScore] = useState({ right: 0, wrong: 0 });

  // Options are built once per question, not on every render.
  const question = useMemo(() => buildQuestion(words, qIdx % words.length), [words, qIdx]);
  if (!question) return null;

  const choose = (opt: string) => {
    if (answer) return;
    setAnswer(opt);
    const correct = opt === question.entry.meaning;
    setScore((s) => (correct ? { ...s, right: s.right + 1 } : { ...s, wrong: s.wrong + 1 }));
  };

  return (
    <View style={{ gap: 12 }}>
      <View style={[styles.prompt, island, { backgroundColor: t.card, borderColor: t.border }]}>
        <Text style={{ fontSize: 10, color: t.sub, fontWeight: '700', textTransform: 'uppercase', marginBottom: 8 }}>
          Is word ka matlab kya hai?
        </Text>
        <Text style={[styles.word, { color: t.accent }]}>{question.entry.word}</Text>
      </View>

      {question.options.map((opt) => {
        const correct = opt === question.entry.meaning;
        const chosen = answer === opt;
        const border = !answer ? t.border : correct ? t.green : chosen ? t.danger : t.border;
        const bg = answer && correct ? t.greenL : t.card;
        return (
          <Pressable key={opt} onPress={() => choose(opt)} style={[styles.option, { borderColor: border, backgroundColor: bg }]}>
            <Text style={{ flex: 1, color: t.text, fontSize: 13 }}>{opt}</Text>
            {answer && correct ? <CircleCheck color={t.green} size={18} strokeWidth={2.25} /> : null}
            {answer && chosen && !correct ? <CircleX color={t.danger} size={18} strokeWidth={2.25} /> : null}
          </Pressable>
        );
      })}

      {answer && (
        <Pressable
          onPress={() => { setQIdx((i) => i + 1); setAnswer(null); }}
          style={[styles.next, { backgroundColor: t.accent }]}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>Next Question</Text>
          <ArrowRight color="#fff" size={16} strokeWidth={2.25} />
        </Pressable>
      )}

      <View style={{ flexDirection: 'row', gap: 16, justifyContent: 'center' }}>
        <View style={styles.score}>
          <CircleCheck color={t.green} size={15} strokeWidth={2.25} />
          <Text style={{ color: t.green, fontWeight: '700', fontSize: 13 }}>{score.right} Sahi</Text>
        </View>
        <View style={styles.score}>
          <CircleX color={t.danger} size={15} strokeWidth={2.25} />
          <Text style={{ color: t.danger, fontWeight: '700', fontSize: 13 }}>{score.wrong} Galat</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  prompt: { borderRadius: 14, padding: 18, borderWidth: 1, alignItems: 'center' },
  word: { fontSize: 26, fontWeight: '700', fontFamily: fonts.heading },
  option: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 11, padding: 13, borderWidth: 1.5 },
  next: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 99, padding: 12 },
  score: { flexDirection: 'row', alignItems: 'center', gap: 5 },
});
