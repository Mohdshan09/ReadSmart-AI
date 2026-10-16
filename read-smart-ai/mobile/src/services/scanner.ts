import type { ScanResult } from '@/types';
import { Platform } from 'react-native';
import { API_URL } from './api';

const SCAN_TIMEOUT_MS = 30_000;

export async function scanImage(uri: string, mimeType: string | null | undefined, fileName?: string | null): Promise<ScanResult> {
  const body = new FormData();
  const name = fileName ?? 'scan.jpg';

  // Browser FormData cannot turn React Native's `{ uri, name, type }` file
  // descriptor into a real multipart file. Convert it to a Blob on web.
  if (Platform.OS === 'web') {
    const imageResponse = await fetch(uri);
    if (!imageResponse.ok) throw new Error('Selected photo read nahi ho saki. Dobara select karo.');
    body.append('image', await imageResponse.blob(), name);
  } else {
    body.append(
      'image',
      {
        uri,
        name,
        type: mimeType ?? 'image/jpeg',
      } as unknown as Blob
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SCAN_TIMEOUT_MS);
  try {
    const response = await fetch(`${API_URL}/api/scanner/ocr`, { method: 'POST', body, signal: controller.signal });
    const result = await response.json().catch(() => null);
    if (!response.ok) throw new Error(result?.error ?? `Scan failed (${response.status})`);
    return result as ScanResult;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Scan mein time lag raha hai. Clear, chhoti photo ke saath dobara try karo.');
    }
    if (error instanceof TypeError) {
      throw new Error(
        `Scanner server se connect nahi hua (${API_URL}). Server start karo aur web app ko reload karo.`
      );
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
