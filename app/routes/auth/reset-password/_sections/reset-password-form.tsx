// app/routes/auth/reset-password/_sections/reset-password-form.tsx
import { useState, type SyntheticEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { PasswordInput } from "~/components/shared/password-input";
import { cn } from "~/lib/utils/helpers";
import {
  useResetPassword,
  useResendForgotPassword,
} from "~/features/auth/hooks";
import {
  parseChallengeError,
  type ParsedChallengeError,
} from "~/features/auth/challenge-errors";
import { useCountdown } from "~/features/auth/use-countdown";
import { notifySuccess } from "~/lib/utils/toast";

/**
 * `initialChallengeId` is read from the approved reset URL
 * (`/reset-password?challenge_id=<uuid>`). The code is entered by the user and
 * never travels in the URL or logs. A resend replaces the in-memory handle.
 */
export function ResetPasswordForm({
  initialChallengeId,
}: {
  initialChallengeId: string;
}) {
  const navigate = useNavigate();
  const reset = useResetPassword();
  const resend = useResendForgotPassword();

  const [challengeId, setChallengeId] = useState(initialChallengeId);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<ParsedChallengeError | null>(null);
  const { secondsLeft, start } = useCountdown(0);

  const mustRestart = error?.recovery === "restart";

  function handleSubmit(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    e.preventDefault();
    setError(null);
    reset.mutate(
      { challenge_id: challengeId, code: code.trim(), newPassword },
      {
        onSuccess: () => {
          notifySuccess({
            message: "Password updated",
            description: "You can now sign in with your new password.",
          });
          navigate("/login", { replace: true });
        },
        onError: (err) => setError(parseChallengeError(err)),
      }
    );
  }

  function handleResend() {
    setError(null);
    resend.mutate(challengeId, {
      onSuccess: (challenge) => {
        setChallengeId(challenge.challenge_id);
        start(challenge.resend_after_seconds);
        notifySuccess({ message: "A new code has been sent." });
      },
      onError: (err) => {
        const parsed = parseChallengeError(err);
        setError(parsed);
        if (parsed.recovery === "cooldown" && parsed.retryAfterSeconds) {
          start(parsed.retryAfterSeconds);
        }
      },
    });
  }

  const resendDisabled = resend.isPending || secondsLeft > 0;

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-900">
        Choose a new password
      </h1>
      <p className="mt-4 text-gray-600">
        Enter the code we emailed you and a new password.
      </p>

      {mustRestart ? (
        <div className="mt-8 space-y-4 text-left">
          <p className="text-sm text-red-500" role="alert">
            {error?.message}
          </p>
          <Button
            type="button"
            onClick={() => navigate("/forgot-password", { replace: true })}
            className="w-full rounded-full! bg-blue-600 py-6 text-base font-semibold hover:bg-blue-700"
          >
            Request a new link
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-3 text-left">
          <Input
            required
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="Enter code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={reset.isPending}
            className={cn(
              "rounded-full! text-center text-lg tracking-widest",
              error && "border-red-400 focus-visible:ring-red-300"
            )}
          />
          <PasswordInput
            required
            minLength={8}
            placeholder="New password..."
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={reset.isPending}
            className="h-11 rounded-full! bg-gray-50 px-4 text-sm"
          />
          {error && (
            <p className="text-left text-sm text-red-500" role="alert">
              {error.message}
            </p>
          )}
          <Button
            type="submit"
            disabled={reset.isPending || !code.trim() || newPassword.length < 8}
            className="mt-2! w-full rounded-full! bg-blue-600 py-6 text-base font-semibold hover:bg-blue-700"
          >
            {reset.isPending ? "Updating…" : "Update password"}
          </Button>
        </form>
      )}

      {!mustRestart && (
        <button
          type="button"
          onClick={handleResend}
          disabled={resendDisabled}
          className="mt-6 text-sm text-gray-700 hover:underline disabled:no-underline disabled:opacity-50"
        >
          {resend.isPending
            ? "Resending…"
            : secondsLeft > 0
              ? `Resend code in ${secondsLeft}s`
              : "Resend code"}
        </button>
      )}

      <p className="mt-2 text-sm text-gray-700">
        <Link to="/login" className="hover:underline">
          Back to sign in
        </Link>
      </p>
    </>
  );
}
