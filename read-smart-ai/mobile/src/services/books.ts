import * as DocumentPicker from 'expo-document-picker';
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
  // React Native's FormData accepts { uri, name, type } for files.
  form.append('file', {
    uri: file.uri,
    name: file.name,
    type: file.mimeType ?? 'application/octet-stream',
  } as unknown as Blob);

  // Parsing a whole book (PDF/EPUB/DOCX) can take a while, so allow longer
  // than the default request timeout before giving up.
  return apiRequest<{ title: string; pages: Page[] }>(
    '/api/books/parse',
    { method: 'POST', body: form },
    60000
  );
}
