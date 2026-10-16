import Storage from 'expo-sqlite/kv-store';
import { createJSONStorage } from 'zustand/middleware';

// Native builds use SQLite so data survives app restarts.
export const persistStorage = createJSONStorage(() => Storage);
