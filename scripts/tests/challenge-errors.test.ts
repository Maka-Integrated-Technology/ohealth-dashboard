import assert from "node:assert/strict";
import { test } from "node:test";

// parseChallengeError reads navigator.onLine for the no-response branch.
Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  value: { onLine: true },
});

const { parseChallengeError } =
  await import("../../app/features/auth/challenge-errors");

function axiosError(
  status: number,
  data: unknown,
  headers: Record<string, string> = {}
) {
  return { isAxiosError: true, response: { status, data, headers } };
}

test("classifies a wrong code as retryable on the same challenge", () => {
  const r = parseChallengeError(
    axiosError(400, { error_code: "AUTH_CHALLENGE_CODE_INVALID" })
  );
  assert.equal(r.code, "AUTH_CHALLENGE_CODE_INVALID");
  assert.equal(r.recovery, "retry-code");
});

test("expired, consumed, superseded, exhausted and invalid all force a restart", () => {
  for (const code of [
    "AUTH_CHALLENGE_EXPIRED",
    "AUTH_CHALLENGE_CONSUMED",
    "AUTH_CHALLENGE_SUPERSEDED",
    "AUTH_CHALLENGE_ATTEMPTS_EXHAUSTED",
    "AUTH_CHALLENGE_INVALID",
  ]) {
    const r = parseChallengeError(axiosError(400, { error_code: code }));
    assert.equal(r.recovery, "restart", `${code} should restart`);
    assert.equal(r.code, code);
  }
});

test("cooldown and rate-limited are cooldowns and carry retry_after from the body", () => {
  const cooldown = parseChallengeError(
    axiosError(429, {
      error_code: "AUTH_CHALLENGE_COOLDOWN",
      retry_after_seconds: 42,
    })
  );
  assert.equal(cooldown.recovery, "cooldown");
  assert.equal(cooldown.retryAfterSeconds, 42);

  const limited = parseChallengeError(
    axiosError(429, { error_code: "AUTH_RATE_LIMITED" })
  );
  assert.equal(limited.recovery, "cooldown");
});

test("falls back to the Retry-After header when the body omits it", () => {
  const r = parseChallengeError(
    axiosError(
      429,
      { error_code: "AUTH_CHALLENGE_COOLDOWN" },
      {
        "retry-after": "17",
      }
    )
  );
  assert.equal(r.retryAfterSeconds, 17);
});

test("delivery and service errors are transient (retry later)", () => {
  for (const code of [
    "AUTH_CHALLENGE_DELIVERY_UNAVAILABLE",
    "AUTH_SERVICE_TEMPORARILY_UNAVAILABLE",
  ]) {
    assert.equal(
      parseChallengeError(axiosError(503, { error_code: code })).recovery,
      "unavailable"
    );
  }
});

test("a lost / no-response error is treated as retryable, never as a dead challenge", () => {
  const r = parseChallengeError({ isAxiosError: true, response: undefined });
  assert.equal(r.code, null);
  assert.equal(r.recovery, "unavailable");
});

test("an unknown error code is never silently treated as a valid challenge code", () => {
  const r = parseChallengeError(
    axiosError(400, { error_code: "SOMETHING_NEW", message: "nope" })
  );
  assert.equal(r.code, null);
  assert.equal(r.message, "nope");

  const serverErr = parseChallengeError(axiosError(500, {}));
  assert.equal(serverErr.recovery, "unavailable");
});

test("a non-axios error degrades safely", () => {
  const r = parseChallengeError(new Error("boom"));
  assert.equal(r.code, null);
  assert.equal(r.recovery, "unavailable");
});
