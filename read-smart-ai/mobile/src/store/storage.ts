import Storage from 'expo-sqlite/kv-store';
import { createJSONStorage } from 'zustand/middleware';

// Key-value storage on the device, so saved data survives app restarts.
export const persistStorage = createJSONStorage(() => Storage);
