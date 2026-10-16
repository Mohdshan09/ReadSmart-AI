import { BookmarkPlus, Check, Lightbulb, Link2, type LucideIcon, Pencil, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge } from '@/components/common/Badge';
import { useTheme } from '@/hooks/useTheme';
import { island } from '@/theme/shape';
import { fonts } from '@/theme/typography';
import type { WordMeaning } from '@/types';

type Tab = 'explain' | 'example' | 'synonyms';
const TABS: [Tab, LucideIcon, string][] = [
  ['explain', Lightbulb, 'Explain'],
  ['example', Pencil, 'Example'],
  ['synonyms', Link2, 'Words'],
];

type Props = { data: WordMeaning; saved: boolean; onSave: () => void; onClose: () => void };

export function DetailCard({ data, saved, onSave, onClose }: Props) {
  const { t } = useTheme();
  const [tab, setTab] = useState<Tab>('explain');

  return (
    <View style={[styles.card, island, { backgroundColor: t.card, borderColor: t.accent + '55' }]}>
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
          <X color={t.sub} size={20} strokeWidth={2.25} />
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
        {TABS.map(([id, Icon, label]) => {
          const on = tab === id;
          return (
            <Pressable
              key={id}
              onPress={() => setTab(id)}
              style={[styles.tab, on && { backgroundColor: t.accent }]}
            >
              <Icon color={on ? '#fff' : t.sub} size={13} strokeWidth={2.25} />
              <Text style={{ fontSize: 11, fontWeight: '600', color: on ? '#fff' : t.sub }}>{label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={{ minHeight: 42 }}>
        {tab === 'explain' && (
          <Text style={[styles.box, { backgroundColor: t.greenL, borderLeftColor: t.green, color: t.text }]}>
            {data.beginnerExplain}
          </Text>
        )}
        {tab === 'example' && (
          <Text style={[styles.box, { backgroundColor: t.accentL, borderLeftColor: t.accent, color: t.text, fontStyle: 'italic' }]}>
            {`“${data.exampleSentence}”`}
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
          {saved ? (
            <Check color={t.green} size={15} strokeWidth={2.5} />
          ) : (
            <BookmarkPlus color="#fff" size={15} strokeWidth={2.25} />
          )}
          <Text style={{ color: saved ? t.green : '#fff', fontSize: 12, fontWeight: '700' }}>
            {saved ? 'Saved' : 'Save to Notebook'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1.5, borderRadius: 14, padding: 14, paddingTop: 16, marginTop: 10, marginBottom: 14 },
  topBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 3, borderTopLeftRadius: 14, borderTopRightRadius: 14 },
  row: { flexDirection: 'row', alignItems: 'center' },
  word: { fontSize: 20, fontWeight: '700', fontFamily: fonts.heading },
  pos: { fontSize: 10, fontStyle: 'italic', borderRadius: 99, paddingHorizontal: 7, paddingVertical: 1, overflow: 'hidden' },
  pill: { flex: 1, borderRadius: 9, padding: 8 },
  pillLabel: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', marginBottom: 2 },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 99, paddingHorizontal: 11, paddingVertical: 5 },
  box: { borderRadius: 8, padding: 10, borderLeftWidth: 3, fontSize: 13, lineHeight: 21, overflow: 'hidden' },
  syn: { borderWidth: 1, borderRadius: 99, paddingHorizontal: 11, paddingVertical: 3, fontSize: 12, overflow: 'hidden' },
  save: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 99, paddingHorizontal: 16, paddingVertical: 7 },
});
