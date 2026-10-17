import * as ImagePicker from 'expo-image-picker';
import { Camera, Image as ImageIcon } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/common/Header';
import { Loader } from '@/components/common/Loader';
import { DetailCard } from '@/components/reader/DetailCard';
import { useTheme } from '@/hooks/useTheme';
import { getMeaning } from '@/services/meaning';
import { scanImage } from '@/services/scanner';
import { useNotebook } from '@/store/notebookStore';
import { toast } from '@/store/toastStore';
import { island, islandSoft } from '@/theme/shape';
import type { WordMeaning } from '@/types';

const cleanWord = (value: string) => value.replace(/^[^A-Za-z]+|[^A-Za-z'-]+$/g, '');

export default function ScannerScreen() {
  const { t } = useTheme();
  const notebook = useNotebook();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [scanning, setScanning] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [meaning, setMeaning] = useState<WordMeaning | null>(null);
  const [meaningLoading, setMeaningLoading] = useState(false);
  const words = useMemo(() => text.split(/(\s+)/), [text]);

  const processAsset = async (asset: ImagePicker.ImagePickerAsset) => {
    setImageUri(asset.uri);
    setText('');
    setSelectedWord(null);
    setMeaning(null);
    setScanning(true);
    try {
      const result = await scanImage(asset.uri, asset.mimeType, asset.fileName);
      setText(result.text);
      if (result.text.trim()) toast.success('Text scan ho gaya! Kisi word pe tap karo.');
      else toast.info('Is photo me koi text nahi mila. Clear photo try karo.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Photo scan nahi ho saka. Dobara try karo.');
    } finally {
      setScanning(false);
    }
  };

  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        toast.error('Camera permission allow karo, phir photo le sakte ho.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.75,
      });
      if (!result.canceled) await processAsset(result.assets[0]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Camera open nahi ho paaya. Dobara try karo.');
    }
  };

  const choosePhoto = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        toast.error('Photo library permission allow karo, phir image choose kar sakte ho.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.75,
      });
      if (!result.canceled) await processAsset(result.assets[0]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Photo library open nahi ho paayi. Dobara try karo.');
    }
  };

  const selectWord = async (rawWord: string) => {
    const word = cleanWord(rawWord);
    if (!word || scanning || meaningLoading) return;
    setSelectedWord(word);
    setMeaning(null);
    setMeaningLoading(true);
    try {
      setMeaning(await getMeaning(word, text, text));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Translation load nahi hui. Dobara word select karo.');
    } finally {
      setMeaningLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.bg }}>
      <Header title="Scan & Translate" subtitle="Photo lo, word choose karo" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={[styles.hero, islandSoft, { backgroundColor: t.accentL, borderColor: t.accent + '33' }]}>
          <Text style={[styles.heroTitle, { color: t.text }]}>Text Scanner</Text>
          <Text style={{ color: t.sub, fontSize: 13, lineHeight: 19 }}>
            Book, notes, ya sign ki clear photo lo. Scan ke baad kisi word par tap karke Hindi meaning dekho.
          </Text>
          <View style={styles.actions}>
            <Pressable onPress={takePhoto} disabled={scanning} style={[styles.primary, { backgroundColor: t.accent }]}>
              <Camera color="#fff" size={16} strokeWidth={2.25} />
              <Text style={styles.primaryText}>Take photo</Text>
            </Pressable>
            <Pressable onPress={choosePhoto} disabled={scanning} style={[styles.secondary, { borderColor: t.accent, backgroundColor: t.card }]}>
              <ImageIcon color={t.accent} size={16} strokeWidth={2.25} />
              <Text style={{ color: t.accent, fontWeight: '700', fontSize: 13 }}>Choose photo</Text>
            </Pressable>
          </View>
        </View>

        {imageUri ? <Image source={{ uri: imageUri }} style={[styles.preview, { backgroundColor: t.accentL }]} resizeMode="cover" /> : null}

        {scanning && <Loader variant="card" label="Photo se text nikaal raha hai..." />}

        {text && !scanning ? (
          <View style={[styles.textCard, island, { backgroundColor: t.card, borderColor: t.border }]}>
            <Text style={[styles.label, { color: t.accent }]}>TAP A WORD TO TRANSLATE</Text>
            <Text style={[styles.scannedText, { color: t.text }]}>
              {words.map((part, index) => {
                const word = cleanWord(part);
                if (!word) return part;
                const selected = word.toLowerCase() === selectedWord?.toLowerCase();
                return (
                  <Text
                    key={`${part}-${index}`}
                    onPress={() => selectWord(part)}
                    style={selected ? { backgroundColor: t.highlight, color: t.highlightText, fontWeight: '700' } : undefined}
                  >
                    {part}
                  </Text>
                );
              })}
            </Text>
          </View>
        ) : null}

        {meaningLoading ? <Loader variant="card" label="Meaning dhundh raha hai..." /> : null}

        {meaning ? (
          <DetailCard
            data={meaning}
            saved={notebook.has(meaning.word)}
            onSave={() => notebook.save(meaning, 'Camera Scan', 1)}
            onClose={() => {
              setMeaning(null);
              setSelectedWord(null);
            }}
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 14, paddingBottom: 32 },
  hero: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 9 },
  heroTitle: { fontSize: 19, fontWeight: '800' },
  actions: { flexDirection: 'row', gap: 9, marginTop: 4 },
  primary: { flexDirection: 'row', alignItems: 'center', gap: 7, borderRadius: 10, paddingHorizontal: 15, paddingVertical: 11 },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  secondary: { flexDirection: 'row', alignItems: 'center', gap: 7, borderWidth: 1, borderRadius: 10, paddingHorizontal: 15, paddingVertical: 10 },
  preview: { width: '100%', height: 190, borderRadius: 14 },
  textCard: { borderWidth: 1, borderRadius: 14, padding: 15 },
  label: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8, marginBottom: 9 },
  scannedText: { fontSize: 17, lineHeight: 29 },
});
