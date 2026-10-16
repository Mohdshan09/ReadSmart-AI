import { memo, useMemo } from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { fonts } from '@/theme/typography';
import { tokenizeLine } from '@/utils/tokenize';
import { WordToken } from './WordToken';

type Props = {
  line: string;
  lineIdx: number;
  activeKey: string | null;
  loading: boolean;
  annotation?: string;
  isSaved: (word: string) => boolean;
  onWordPress: (word: string, line: string, lineIdx: number, key: string) => void;
};

function SmartLineBase({ line, lineIdx, activeKey, loading, annotation, isSaved, onWordPress }: Props) {
  const { t } = useTheme();
  const tokens = useMemo(() => tokenizeLine(line), [line]);

  if (!line.trim()) return <View style={{ height: 12 }} />;

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      {tokens.map((tok, i) => {
        if (tok.kind !== 'word') {
          return (
            <Text key={i} style={{ fontSize: 17, lineHeight: 34, color: t.text, fontFamily: fonts.body }}>
              {tok.kind === 'space' ? ' ' : tok.text}
            </Text>
          );
        }
        const key = `${lineIdx}-${tok.index}`;
        const isActive = activeKey === key;
        return (
          <WordToken
            key={i}
            display={tok.text}
            isActive={isActive}
            isSaved={isSaved(tok.clean)}
            isLoading={isActive && loading}
            annotation={isActive ? annotation : undefined}
            onPress={() => onWordPress(tok.clean, line, lineIdx, key)}
          />
        );
      })}
    </View>
  );
}

export const SmartLine = memo(SmartLineBase);
