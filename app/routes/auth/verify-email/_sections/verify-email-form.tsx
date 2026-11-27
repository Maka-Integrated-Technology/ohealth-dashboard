// app/routes/auth/verify-email/_sections/verify-email-form.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { notifySuccess } from "~/lib/utils/toast";
import { useVerifySignup, useResendSignup } from "~/features/auth/hooks";
import { ChallengeCodeForm } from "~/features/auth/challenge-code-form";
import {
  parseChallengeError,
  type ParsedChallengeError,
} from "~/features/auth/challenge-errors";
import { useCountdown } from "~/features/auth/use-countdown";
import type { VerifyEmailState } from "~/features/auth/challenge-nav";

export function VerifyEmailForm({ state }: { state: VerifyEmailState }) {
  const navigate = useNavigate();
  const verify = useVerifySignup();
  const resend = useResendSignup();

  // The challenge handle is kept in memory; a resend replaces it.
  const [challengeId, setChallengeId] = useState(state.challengeId);
  const [error, setError] = useState<ParsedChallengeError | null>(null);
  const { secondsLeft, start } = useCountdown(state.resendAfterSeconds);

  const target = state.deliveryTarget ?? state.email;

  function handleVerify(code: string) {
    setError(null);
    verify.mutate(
      { challenge_id: challengeId, code },
      {
        onSuccess: () => navigate("/onboarding"),
        onError: (e) => setError(parseChallengeError(e)),
      }
    );
  }

  function handleResend() {
    setError(null);
    resend.mutate(challengeId, {
      onSuccess: (challenge) => {
        setChallengeId(challenge.challenge_id);
        start(challenge.resend_after_seconds);
        notifySuccess({
          message: `Verification code resent to ${state.email}`,
        });
      },
      onError: (e) => {
        const parsed = parseChallengeError(e);
        setError(parsed);
        if (parsed.recovery === "cooldown" && parsed.retryAfterSeconds) {
          start(parsed.retryAfterSeconds);
        }
      },
    });
  }

  return (
    <ChallengeCodeForm
      heading="Check your email"
      description={
        <>
          We&apos;ve sent you a verification code. Please check your inbox at{" "}
          <span className="font-semibold text-gray-900">{target}</span>
        </>
      }
      onVerify={handleVerify}
      isVerifying={verify.isPending}
      onResend={handleResend}
      isResending={resend.isPending}
      resendCooldownSeconds={secondsLeft}
      error={error}
      onRestart={() => navigate("/sign-up", { replace: true })}
      restartLabel="Back to sign up"
      footer={
        <p className="mt-2 text-sm text-gray-700">
          <Link to="/sign-up" className="hover:underline">
            Back to sign up
          </Link>
        </p>
      }
    />
  );
}
