import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { persistStorage } from './storage';

const today = () => new Date().toISOString().slice(0, 10);
const yesterday = () => new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);

type SettingsState = {
  dark: boolean;
  streak: number;
  lastActiveDay: string | null;
  toggleDark: () => void;
  markActiveToday: () => void;
};

export const useSettings = create<SettingsState>()(
  persist(
    (set, get) => ({
      dark: false,
      streak: 0,
      lastActiveDay: null,
      toggleDark: () => set((s) => ({ dark: !s.dark })),
      // Call when the user reads a page: keeps a real daily streak.
      markActiveToday: () => {
        const { lastActiveDay, streak } = get();
        if (lastActiveDay === today()) return;
        set({
          streak: lastActiveDay === yesterday() ? streak + 1 : 1,
          lastActiveDay: today(),
        });
      },
    }),
    { name: 'settings', storage: persistStorage }
  )
);
