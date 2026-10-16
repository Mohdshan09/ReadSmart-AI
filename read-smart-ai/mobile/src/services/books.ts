import * as DocumentPicker from 'expo-document-picker';
import { Platform } from 'react-native';
import type { Page } from '@/types';
import { apiRequest } from './api';

export const SUPPORTED_TYPES = [
  'text/plain',
  'application/pdf',
  'application/epub+zip',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export async function pickFile() {
  const result = await DocumentPicker.getDocumentAsync({
    type: SUPPORTED_TYPES,
    copyToCacheDirectory: true,
  });
  return result.canceled ? null : result.assets[0];
}

export async function uploadBook(file: DocumentPicker.DocumentPickerAsset) {
  const form = new FormData();

  // Browser FormData cannot turn React Native's `{ uri, name, type }` file
  // descriptor into a real multipart file — it serialises to "[object Object]",
  // so multer sees no file and returns 400. Convert it to a Blob on web; native
  // FormData accepts the descriptor directly.
  if (Platform.OS === 'web') {
    const fileResponse = await fetch(file.uri);
    if (!fileResponse.ok) throw new Error('Selected file read nahi ho saki. Dobara select karo.');
    form.append('file', await fileResponse.blob(), file.name);
  } else {
    form.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.mimeType ?? 'application/octet-stream',
    } as unknown as Blob);
  }

  // Parsing a whole book (PDF/EPUB/DOCX) can take a while, so allow longer
  // than the default request timeout before giving up.
  return apiRequest<{ title: string; pages: Page[] }>(
    '/api/books/parse',
    { method: 'POST', body: form },
    60000
  );
}
