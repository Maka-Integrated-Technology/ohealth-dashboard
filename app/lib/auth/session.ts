// app/lib/auth/session.ts
//
// Known deviation from the target architecture: docs/02-identity-and-access.md
// calls for browser refresh tokens in a secure, HTTP-only cookie with a CSRF
// control. The live `/auth/login` and `/auth/signup` endpoints return both
// tokens in the JSON body, which only a JS-readable cookie can store — an
// HTTP-only cookie can only be set by the server. Storing the refresh token
// this way is a real deviation, not an oversight; moving to server-set
// HTTP-only cookies is a backend change, tracked separately.
import { getCookie, removeCookie, setCookie } from "~/lib/utils/cookie";

const ACCESS_TOKEN_COOKIE = "ohealth_access_token";
const REFRESH_TOKEN_COOKIE = "ohealth_refresh_token";
const SESSION_ID_COOKIE = "ohealth_session_id";

// Access tokens are short-lived (15m); the refresh cookie just needs to
// outlive typical inactivity between visits.
const REFRESH_COOKIE_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

export interface StoredSession {
  accessToken: string;
  refreshToken: string;
  sessionId?: string;
}

export function saveSession(session: StoredSession): void {
  setCookie(ACCESS_TOKEN_COOKIE, session.accessToken, {
    maxAgeSeconds: REFRESH_COOKIE_MAX_AGE_SECONDS,
  });
  setCookie(REFRESH_TOKEN_COOKIE, session.refreshToken, {
    maxAgeSeconds: REFRESH_COOKIE_MAX_AGE_SECONDS,
  });
  if (session.sessionId) {
    setCookie(SESSION_ID_COOKIE, session.sessionId, {
      maxAgeSeconds: REFRESH_COOKIE_MAX_AGE_SECONDS,
    });
  }
}

export function saveAccessToken(accessToken: string): void {
  setCookie(ACCESS_TOKEN_COOKIE, accessToken, {
    maxAgeSeconds: REFRESH_COOKIE_MAX_AGE_SECONDS,
  });
}

export function getAccessToken(): string | undefined {
  return getCookie(ACCESS_TOKEN_COOKIE);
}

export function getRefreshToken(): string | undefined {
  return getCookie(REFRESH_TOKEN_COOKIE);
}

export function getSessionId(): string | undefined {
  return getCookie(SESSION_ID_COOKIE);
}

export function hasSession(): boolean {
  return Boolean(getAccessToken());
}

export function clearSession(): void {
  removeCookie(ACCESS_TOKEN_COOKIE);
  removeCookie(REFRESH_TOKEN_COOKIE);
  removeCookie(SESSION_ID_COOKIE);
}
