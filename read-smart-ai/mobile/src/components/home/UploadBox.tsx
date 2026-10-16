import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export function UploadBox({ uploading, onPress }: { uploading: boolean; onPress: () => void }) {
  const { t } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={uploading}
      style={[
        styles.box,
        { borderColor: uploading ? t.green : t.border, backgroundColor: uploading ? t.greenL : t.card },
      ]}
    >
      <Text style={{ fontSize: 32, marginBottom: 5 }}>{uploading ? '⏳' : '📤'}</Text>
      <Text style={{ fontSize: 14, fontWeight: '700', color: t.text, marginBottom: 3 }}>
        {uploading ? 'Parsing kar raha hai…' : 'Apni Book Upload Karo'}
      </Text>
      <Text style={{ fontSize: 12, color: t.sub }}>
        {uploading ? 'Thoda wait karo…' : 'TXT · PDF · EPUB · DOCX'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: { borderWidth: 2, borderStyle: 'dashed', borderRadius: 14, paddingVertical: 20, paddingHorizontal: 14, alignItems: 'center' },
});
