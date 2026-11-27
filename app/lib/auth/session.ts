// app/lib/auth/session.ts
//
// Browser-session transport (#78). The refresh credential lives only in a
// backend-managed HttpOnly cookie the client can neither read nor write; the
// short-lived access token is held in memory for the tab's lifetime and never
// persisted to cookies, localStorage, sessionStorage or IndexedDB. On reload
// the access token is gone and is restored via a credentialed
// `POST /auth/browser/refresh` (driven by the 401 interceptor).
//
// SSR is disabled for this app (react-router.config.ts `ssr: false`), so this
// module-level state is strictly per-browser-tab.

let accessToken: string | null = null;

export function setAccessToken(token: string): void {
  accessToken = token;
}

export function getAccessToken(): string | undefined {
  return accessToken ?? undefined;
}

export function hasSession(): boolean {
  return accessToken !== null;
}

/** Drop the in-memory access token (e.g. after a refresh rejection or logout). */
export function clearSession(): void {
  accessToken = null;
}
