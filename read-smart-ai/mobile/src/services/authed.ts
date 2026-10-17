import { useAuth } from '@/store/authStore';
import { ApiError, apiRequest } from './api';

// A request to an endpoint behind `requireAuth`. Attaches the current access
// token; on a 401 it refreshes the session once and retries. If the refresh
// fails, `refreshSession` clears the session (the root gate then shows login).
export async function authedRequest<T>(path: string, init?: RequestInit, timeoutMs?: number): Promise<T> {
  const withToken = (token: string | null): RequestInit => ({
    ...init,
    headers: { ...(init?.headers ?? {}), Authorization: `Bearer ${token ?? ''}` },
  });

  try {
    return await apiRequest<T>(path, withToken(useAuth.getState().accessToken), timeoutMs);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      await useAuth.getState().refreshSession();
      return apiRequest<T>(path, withToken(useAuth.getState().accessToken), timeoutMs);
    }
    throw err;
  }
}
