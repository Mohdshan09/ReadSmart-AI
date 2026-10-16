import Constants from 'expo-constants';

const SERVER_PORT = 4000;

// In Expo Go / dev the API server runs on the SAME machine as the Expo dev
// server. Expo tells us that machine's current address, so we derive the API
// URL from it instead of hard-coding an IP that DHCP keeps reassigning
// (192.168.1.5 → .6 → .7 …). This means the connection keeps working after an
// IP change with no .env edit and no restart needed for the URL.
function devServerHost(): string | null {
  const hostUri = Constants.expoConfig?.hostUri ?? Constants.expoGoConfig?.debuggerHost;
  const host = hostUri?.split(':')[0];
  return host && host.length > 0 ? host : null;
}

// Priority: explicit override (e.g. a deployed server) → auto-detected dev host
// → localhost (web / simulator on the same machine).
const detectedHost = devServerHost();
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (detectedHost ? `http://${detectedHost}:${SERVER_PORT}` : 'http://localhost:4000');

// Default cap on how long we wait before giving up. Without this, fetch hangs
// on the OS-level TCP timeout (often 1–2 minutes) when the server is
// unreachable, so a wrong IP / firewall shows up as a very slow failure.
const DEFAULT_TIMEOUT_MS = 12000;

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_URL}${path}`, { ...init, signal: controller.signal });
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(body?.error ?? `Server error (${res.status})`);
    }
    return body as T;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error(
        `Server se connect nahi hua (${API_URL}). Check karo: phone aur computer same Wi-Fi pe hain, ` +
          `EXPO_PUBLIC_API_URL me sahi IP hai, aur server chal raha hai.`
      );
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
