// app/features/auth/challenge-code-form.tsx
//
// Shared presentational step for code-based challenge verification (signup
// and login). The container owns the challenge handle and mutations; this
// renders the code entry, resend-with-cooldown, and code-keyed error state.
import { useState, type FormEvent, type ReactNode } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils/helpers";
import type { ParsedChallengeError } from "./challenge-errors";

interface ChallengeCodeFormProps {
  heading: string;
  description: ReactNode;
  onVerify: (code: string) => void;
  isVerifying: boolean;
  /** Omit to hide the resend control (e.g. MFA, which has no resend). */
  onResend?: () => void;
  isResending?: boolean;
  /** Seconds remaining before a resend is allowed (0 = allowed). */
  resendCooldownSeconds?: number;
  error: ParsedChallengeError | null;
  /** Invoked when the challenge is dead and the user must start over. */
  onRestart: () => void;
  restartLabel: string;
  footer?: ReactNode;
}

export function ChallengeCodeForm({
  heading,
  description,
  onVerify,
  isVerifying,
  onResend,
  isResending = false,
  resendCooldownSeconds = 0,
  error,
  onRestart,
  restartLabel,
  footer,
}: ChallengeCodeFormProps) {
  const [code, setCode] = useState("");

  const mustRestart = error?.recovery === "restart";
  const invalidCode =
    error?.recovery === "retry-code" ||
    error?.code === "AUTH_CHALLENGE_CODE_INVALID";
  const resendDisabled = isResending || resendCooldownSeconds > 0;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (mustRestart || !code.trim()) return;
    onVerify(code.trim());
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-900">{heading}</h1>
      <p className="mt-4 text-gray-600">{description}</p>

      {mustRestart ? (
        <div className="mt-8 space-y-4 text-left">
          <p className="text-sm text-red-500" role="alert">
            {error?.message}
          </p>
          <Button
            type="button"
            onClick={onRestart}
            className="w-full rounded-full! bg-blue-600 py-6 text-base font-semibold hover:bg-blue-700"
          >
            {restartLabel}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-2 text-left">
          <Input
            required
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="Enter code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={isVerifying}
            className={cn(
              "rounded-full! text-center text-lg tracking-widest",
              invalidCode && "border-red-400 focus-visible:ring-red-300"
            )}
          />
          {error && !mustRestart && (
            <p className="text-left text-sm text-red-500" role="alert">
              {error.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={isVerifying || !code.trim()}
            className="mt-6! w-full rounded-full! bg-blue-600 py-6 text-base font-semibold hover:bg-blue-700"
          >
            {isVerifying ? "Verifying…" : "Continue"}
          </Button>
        </form>
      )}

      {!mustRestart && onResend && (
        <button
          type="button"
          onClick={onResend}
          disabled={resendDisabled}
          className="mt-6 text-sm text-gray-700 hover:underline disabled:no-underline disabled:opacity-50"
        >
          {isResending
            ? "Resending…"
            : resendCooldownSeconds > 0
              ? `Resend code in ${resendCooldownSeconds}s`
              : "Resend code"}
        </button>
      )}

      {footer}
    </>
  );
}
