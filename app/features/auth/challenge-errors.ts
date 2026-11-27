// app/features/auth/challenge-errors.ts
//
// Stable challenge error catalogue from the backend contract (Ohealth-be
// #137 / PR #150). The client keys behaviour off `error_code`, never off a
// human message, so copy changes on either side don't break flows (#77).
import { isAxiosError } from "axios";

export const AUTH_CHALLENGE_ERROR_CODES = [
  "AUTH_CHALLENGE_INVALID",
  "AUTH_CHALLENGE_CODE_INVALID",
  "AUTH_CHALLENGE_EXPIRED",
  "AUTH_CHALLENGE_CONSUMED",
  "AUTH_CHALLENGE_SUPERSEDED",
  "AUTH_CHALLENGE_ATTEMPTS_EXHAUSTED",
  "AUTH_CHALLENGE_COOLDOWN",
  "AUTH_CHALLENGE_DELIVERY_UNAVAILABLE",
  "AUTH_SERVICE_TEMPORARILY_UNAVAILABLE",
  "AUTH_RATE_LIMITED",
] as const;

export type AuthChallengeErrorCode =
  (typeof AUTH_CHALLENGE_ERROR_CODES)[number];

export function isAuthChallengeErrorCode(
  value: unknown
): value is AuthChallengeErrorCode {
  return (
    typeof value === "string" &&
    (AUTH_CHALLENGE_ERROR_CODES as readonly string[]).includes(value)
  );
}

/**
 * What the client should do next with the current challenge handle:
 * - `retry-code`: wrong code, same challenge is still valid — let the user try again.
 * - `cooldown`: too soon / rate limited — disable the action for `retryAfterSeconds`.
 * - `restart`: the challenge is dead (expired/consumed/superseded/exhausted/invalid)
 *   — drop the handle and send the user back to the start of the flow.
 * - `unavailable`: transient server/delivery failure — safe to retry later.
 */
export type ChallengeRecovery =
  "retry-code" | "cooldown" | "restart" | "unavailable";

const RECOVERY_BY_CODE: Record<AuthChallengeErrorCode, ChallengeRecovery> = {
  AUTH_CHALLENGE_CODE_INVALID: "retry-code",
  AUTH_CHALLENGE_COOLDOWN: "cooldown",
  AUTH_RATE_LIMITED: "cooldown",
  AUTH_CHALLENGE_INVALID: "restart",
  AUTH_CHALLENGE_EXPIRED: "restart",
  AUTH_CHALLENGE_CONSUMED: "restart",
  AUTH_CHALLENGE_SUPERSEDED: "restart",
  AUTH_CHALLENGE_ATTEMPTS_EXHAUSTED: "restart",
  AUTH_CHALLENGE_DELIVERY_UNAVAILABLE: "unavailable",
  AUTH_SERVICE_TEMPORARILY_UNAVAILABLE: "unavailable",
};

const MESSAGE_BY_CODE: Record<AuthChallengeErrorCode, string> = {
  AUTH_CHALLENGE_CODE_INVALID: "That code isn't right. Please try again.",
  AUTH_CHALLENGE_COOLDOWN: "Please wait before requesting another code.",
  AUTH_RATE_LIMITED: "Too many attempts. Please wait and try again.",
  AUTH_CHALLENGE_INVALID:
    "This request is no longer valid. Please start again.",
  AUTH_CHALLENGE_EXPIRED: "That code has expired. Please start again.",
  AUTH_CHALLENGE_CONSUMED: "That code was already used. Please start again.",
  AUTH_CHALLENGE_SUPERSEDED:
    "A newer code was requested. Please use the latest code or start again.",
  AUTH_CHALLENGE_ATTEMPTS_EXHAUSTED:
    "Too many incorrect codes. Please start again.",
  AUTH_CHALLENGE_DELIVERY_UNAVAILABLE:
    "We couldn't send the code right now. Please try again shortly.",
  AUTH_SERVICE_TEMPORARILY_UNAVAILABLE:
    "The service is temporarily unavailable. Please try again shortly.",
};

export interface ParsedChallengeError {
  code: AuthChallengeErrorCode | null;
  recovery: ChallengeRecovery;
  retryAfterSeconds: number | null;
  message: string;
}

interface ChallengeErrorBody {
  error_code?: unknown;
  retry_after_seconds?: unknown;
  message?: unknown;
}

/**
 * Normalise any auth failure into a stable, code-keyed decision. Unknown or
 * network errors fall back to `unavailable` (safe to retry) so a lost HTTP
 * response never strands the UI in a broken state.
 */
export function parseChallengeError(error: unknown): ParsedChallengeError {
  if (!isAxiosError(error)) {
    return {
      code: null,
      recovery: "unavailable",
      retryAfterSeconds: null,
      message: "Something went wrong. Please try again.",
    };
  }

  // No response body (timeout / lost response / offline) — retryable.
  if (!error.response) {
    return {
      code: null,
      recovery: "unavailable",
      retryAfterSeconds: null,
      message: navigator.onLine
        ? "We couldn't reach the service. Please try again."
        : "No internet connection. Please check your network.",
    };
  }

  const body = (error.response.data ?? {}) as ChallengeErrorBody;
  const code = isAuthChallengeErrorCode(body.error_code)
    ? body.error_code
    : null;

  const headerRetry = Number(error.response.headers?.["retry-after"]);
  const bodyRetry = Number(body.retry_after_seconds);
  const retryAfterSeconds = Number.isFinite(bodyRetry)
    ? bodyRetry
    : Number.isFinite(headerRetry)
      ? headerRetry
      : null;

  if (code) {
    return {
      code,
      recovery: RECOVERY_BY_CODE[code],
      retryAfterSeconds,
      message: MESSAGE_BY_CODE[code],
    };
  }

  // A real response without a known challenge code (400/500 etc.): don't guess
  // a recovery path — surface the server message and let the user retry.
  return {
    code: null,
    recovery: error.response.status >= 500 ? "unavailable" : "retry-code",
    retryAfterSeconds,
    message:
      typeof body.message === "string"
        ? body.message
        : "Something went wrong. Please try again.",
  };
}
