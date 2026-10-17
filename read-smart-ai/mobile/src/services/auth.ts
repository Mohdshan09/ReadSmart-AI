import { apiRequest } from './api';

export type AuthUser = { id: string; email: string; displayName: string | null };

// POST /register and /login both return the user plus a fresh token pair.
export type AuthResponse = { user: AuthUser; accessToken: string; refreshToken: string };
export type Tokens = { accessToken: string; refreshToken: string };
export type ProfileResponse = { user: AuthUser; streak: number; lastActiveDay: string | null };
export type ActivityResponse = { streak: number; lastActiveDay: string | null };

const json = (body: unknown): RequestInit => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

const bearer = (accessToken: string): RequestInit => ({
  headers: { Authorization: `Bearer ${accessToken}` },
});

export function register(email: string, password: string, displayName?: string) {
  return apiRequest<AuthResponse>('/api/auth/register', json({ email, password, displayName }));
}

export function login(email: string, password: string) {
  return apiRequest<AuthResponse>('/api/auth/login', json({ email, password }));
}

export function refresh(refreshToken: string) {
  return apiRequest<Tokens>('/api/auth/refresh', json({ refreshToken }));
}

export function logout(refreshToken: string) {
  // Server replies 204 (no body); we don't need the result.
  return apiRequest<void>('/api/auth/logout', json({ refreshToken }));
}

export function getProfile(accessToken: string) {
  return apiRequest<ProfileResponse>('/api/me', bearer(accessToken));
}

// Records a day of activity and returns the updated server-side streak.
export function recordActivity(accessToken: string) {
  return apiRequest<ActivityResponse>('/api/me/active', {
    method: 'POST',
    ...bearer(accessToken),
  });
}
