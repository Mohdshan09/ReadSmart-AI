import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge } from '@/components/common/Badge';
import { useTheme } from '@/hooks/useTheme';
import { fonts } from '@/theme/typography';
import type { WordMeaning } from '@/types';

type Tab = 'explain' | 'example' | 'synonyms';
const TABS: [Tab, string][] = [
  ['explain', '💡 Explain'],
  ['example', '✏️ Example'],
  ['synonyms', '🔗 Words'],
];

type Props = { data: WordMeaning; saved: boolean; onSave: () => void; onClose: () => void };

export function DetailCard({ data, saved, onSave, onClose }: Props) {
  const { t } = useTheme();
  const [tab, setTab] = useState<Tab>('explain');

  return (
    <View style={[styles.card, { backgroundColor: t.card, borderColor: t.accent + '55' }]}>
      <View style={[styles.topBar, { backgroundColor: t.accent }]} />

      <View style={styles.row}>
        <View style={[styles.row, { flex: 1, flexWrap: 'wrap', gap: 7 }]}>
          <Text style={[styles.word, { color: t.accent }]}>{data.word}</Text>
          {data.partOfSpeech ? (
            <Text style={[styles.pos, { color: t.sub, backgroundColor: t.border }]}>{data.partOfSpeech}</Text>
          ) : null}
          {data.difficulty ? <Badge level={data.difficulty} /> : null}
        </View>
        <Pressable onPress={onClose} hitSlop={10}>
          <Text style={{ color: t.sub, fontSize: 22 }}>×</Text>
        </Pressable>
      </View>

      {data.pronunciation ? (
        <Text style={{ fontSize: 11, color: t.sub, fontStyle: 'italic', marginBottom: 8 }}>
          /{data.pronunciation}/
        </Text>
      ) : null}

      <View style={[styles.row, { gap: 7, marginBottom: 10, alignItems: 'stretch' }]}>
        <View style={[styles.pill, { backgroundColor: t.accentL }]}>
          <Text style={[styles.pillLabel, { color: t.accent }]}>English</Text>
          <Text style={{ fontSize: 13, color: t.text, lineHeight: 19 }}>{data.simpleMeaning}</Text>
        </View>
        <View style={[styles.pill, { backgroundColor: t.yellowL }]}>
          <Text style={[styles.pillLabel, { color: t.yellow }]}>हिंदी</Text>
          <Text style={{ fontSize: 13, color: t.text, lineHeight: 19 }}>{data.hindiMeaning}</Text>
        </View>
      </View>

      <View style={[styles.row, { gap: 4, borderBottomWidth: 1, borderBottomColor: t.border, paddingBottom: 7, marginBottom: 9 }]}>
        {TABS.map(([id, label]) => (
          <Pressable
            key={id}
            onPress={() => setTab(id)}
            style={[styles.tab, tab === id && { backgroundColor: t.accent }]}
          >
            <Text style={{ fontSize: 11, fontWeight: '600', color: tab === id ? '#fff' : t.sub }}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={{ minHeight: 42 }}>
        {tab === 'explain' && (
          <Text style={[styles.box, { backgroundColor: t.greenL, borderLeftColor: t.green, color: t.text }]}>
            {data.beginnerExplain}
          </Text>
        )}
        {tab === 'example' && (
          <Text style={[styles.box, { backgroundColor: t.accentL, borderLeftColor: t.accent, color: t.text, fontStyle: 'italic' }]}>
            "{data.exampleSentence}"
          </Text>
        )}
        {tab === 'synonyms' && (
          <View style={[styles.row, { flexWrap: 'wrap', gap: 5 }]}>
            {(data.synonyms ?? []).map((s) => (
              <Text key={s} style={[styles.syn, { backgroundColor: t.accentL, borderColor: t.accent + '33', color: t.accent }]}>
                {s}
              </Text>
            ))}
          </View>
        )}
      </View>

      <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
        <Pressable
          onPress={onSave}
          disabled={saved}
          style={[
            styles.save,
            saved ? { backgroundColor: t.greenL, borderWidth: 1, borderColor: t.green } : { backgroundColor: t.accent },
          ]}
        >
          <Text style={{ color: saved ? t.green : '#fff', fontSize: 12, fontWeight: '700' }}>
            {saved ? '✓ Saved' : '+ Save to Notebook'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1.5, borderRadius: 14, padding: 14, paddingTop: 16, marginTop: 10, marginBottom: 14, overflow: 'hidden' },
  topBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  row: { flexDirection: 'row', alignItems: 'center' },
  word: { fontSize: 20, fontWeight: '700', fontFamily: fonts.heading },
  pos: { fontSize: 10, fontStyle: 'italic', borderRadius: 99, paddingHorizontal: 7, paddingVertical: 1, overflow: 'hidden' },
  pill: { flex: 1, borderRadius: 9, padding: 8 },
  pillLabel: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', marginBottom: 2 },
  tab: { borderRadius: 99, paddingHorizontal: 11, paddingVertical: 4 },
  box: { borderRadius: 8, padding: 10, borderLeftWidth: 3, fontSize: 13, lineHeight: 21, overflow: 'hidden' },
  syn: { borderWidth: 1, borderRadius: 99, paddingHorizontal: 11, paddingVertical: 3, fontSize: 12, overflow: 'hidden' },
  save: { borderRadius: 99, paddingHorizontal: 16, paddingVertical: 7 },
});
