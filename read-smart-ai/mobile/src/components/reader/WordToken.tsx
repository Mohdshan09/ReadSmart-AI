import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { fonts } from '@/theme/typography';

type Props = {
  display: string;
  isActive: boolean;
  isSaved: boolean;
  isLoading: boolean;
  annotation?: string;
  onPress: () => void;
};

export function WordToken({ display, isActive, isSaved, isLoading, annotation, onPress }: Props) {
  const { t } = useTheme();
  return (
    <View>
      <Pressable onPress={onPress}>
        <Text
          style={[
            styles.word,
            { color: t.text },
            isSaved && { borderBottomWidth: 2, borderBottomColor: t.green },
            isActive && { backgroundColor: t.highlight, color: t.highlightText, fontWeight: '600' },
          ]}
        >
          {display}
        </Text>
      </Pressable>
      {isActive && (isLoading || annotation) ? (
        <View
          pointerEvents="none"
          style={[
            styles.annot,
            { backgroundColor: t.highlight, borderColor: t.accent },
          ]}
        >
          <Text style={{ fontSize: 11, fontStyle: 'italic', color: t.highlightText }}>
            {isLoading ? '…' : annotation}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  word: { fontSize: 17, lineHeight: 34, fontFamily: fonts.body, borderRadius: 3, paddingHorizontal: 1 },
  annot: {
    position: 'absolute',
    top: '100%',
    alignSelf: 'center',
    borderWidth: 1.5,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    zIndex: 10,
    minWidth: 30,
  },
});
