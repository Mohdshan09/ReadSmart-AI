import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ApiError } from '@/services/api';
import * as authApi from '@/services/auth';
import type { AuthResponse, AuthUser } from '@/services/auth';
import { persistStorage } from './storage';
import { toast } from './toastStore';

// Shared across all callers so a burst of parallel 401s (library + notebook +
// activity all retrying at once) triggers exactly ONE refresh. Refresh tokens
// rotate on use, so a second concurrent refresh with the same token would be
// rejected and wrongly end the session.
let refreshInFlight: Promise<void> | null = null;

type AuthState = {
  /** False until the persisted session has loaded from disk. The auth gate
   *  waits for this so it never flashes the login screen on a cold start. */
  hydrated: boolean;
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  /** Streak from the server profile; 0 until first synced. */
  streak: number;

  setHydrated: () => void;
  signIn: (res: AuthResponse) => void;
  signOut: () => Promise<void>;
  /** Exchange the refresh token for a fresh pair; signs out on failure. */
  refreshSession: () => Promise<void>;
  /** Mark today active on the server and store the returned streak. */
  recordActivity: () => Promise<void>;
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      streak: 0,

      setHydrated: () => set({ hydrated: true }),

      signIn: (res) =>
        set({ user: res.user, accessToken: res.accessToken, refreshToken: res.refreshToken }),

      signOut: async () => {
        const token = get().refreshToken;
        // Best-effort server revoke; clear locally regardless of the result.
        if (token) await authApi.logout(token).catch(() => undefined);
        set({ user: null, accessToken: null, refreshToken: null, streak: 0 });
      },

      refreshSession: () => {
        // Collapse concurrent refreshes into the one already running.
        if (refreshInFlight) return refreshInFlight;
        refreshInFlight = (async () => {
          const token = get().refreshToken;
          if (!token) throw new ApiError('Session expired. Please log in again.', 401);
          try {
            const tokens = await authApi.refresh(token);
            set({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
          } catch (err) {
            // Refresh token rejected/expired -> the session is dead.
            set({ user: null, accessToken: null, refreshToken: null, streak: 0 });
            toast.error('Session khatam ho gaya. Dobara login karo.');
            throw err;
          } finally {
            refreshInFlight = null;
          }
        })();
        return refreshInFlight;
      },

      recordActivity: async () => {
        const run = () => authApi.recordActivity(get().accessToken as string);
        try {
          if (!get().accessToken) return;
          set({ streak: (await run()).streak });
        } catch (err) {
          // Access token may just have expired; refresh once and retry.
          if (err instanceof ApiError && err.status === 401) {
            try {
              await get().refreshSession();
              set({ streak: (await run()).streak });
            } catch {
              // Session gone or server down; activity tracking is non-critical.
            }
          }
        }
      },
    }),
    {
      name: 'auth',
      storage: persistStorage,
      // Only the session itself is durable; `hydrated` is runtime-only.
      partialize: (s) => ({
        user: s.user,
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        streak: s.streak,
      }),
      // Mark ready whether reading storage succeeded (state) or failed (error),
      // so a corrupt/unavailable store can never freeze the app on the splash.
      onRehydrateStorage: () => (state) => {
        if (state) state.setHydrated();
        else useAuth.setState({ hydrated: true });
      },
    }
  )
);
