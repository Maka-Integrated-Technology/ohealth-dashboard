// app/features/auth/use-countdown.ts
import { useCallback, useEffect, useState } from "react";

/**
 * A simple seconds countdown used to gate challenge resends by the server's
 * `resend_after_seconds` / `Retry-After`. `start(n)` (re)arms it; `secondsLeft`
 * ticks once per second to 0. Second-granularity drift is fine for a cooldown.
 */
export function useCountdown(initialSeconds = 0) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.max(0, Math.floor(initialSeconds))
  );

  const start = useCallback((seconds: number) => {
    setSecondsLeft(Math.max(0, Math.floor(seconds)));
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  return { secondsLeft, start };
}
