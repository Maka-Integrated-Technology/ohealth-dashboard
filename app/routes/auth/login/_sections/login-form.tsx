// app/routes/auth/login/_sections/login-form.tsx
import { useState, type SyntheticEvent } from "react";
import { Link } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { PasswordInput } from "~/components/shared/password-input";
import {
  useLogin,
  useVerifyLogin,
  useVerifyLoginMfa,
  useResendLogin,
} from "~/features/auth/hooks";
import { GoogleSignInButton } from "~/features/auth/google-sign-in-button";
import { ChallengeCodeForm } from "~/features/auth/challenge-code-form";
import {
  parseChallengeError,
  type ParsedChallengeError,
} from "~/features/auth/challenge-errors";
import { useCountdown } from "~/features/auth/use-countdown";
import { notifyError } from "~/lib/utils/toast";

const PILL_STYLE = { borderRadius: 9999 };

type Phase =
  | { step: "password" }
  | { step: "code"; challengeId: string; email: string }
  | { step: "mfa"; mfaChallengeId: string };

export function LoginForm() {
  const login = useLogin();
  const verifyLogin = useVerifyLogin();
  const verifyMfa = useVerifyLoginMfa();
  const resend = useResendLogin();

  const [phase, setPhase] = useState<Phase>({ step: "password" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<ParsedChallengeError | null>(null);
  const { secondsLeft, start } = useCountdown(0);

  function handlePasswordSubmit(
    e: SyntheticEvent<HTMLFormElement, SubmitEvent>
  ) {
    e.preventDefault();
    setError(null);
    login.mutate(
      { email, password },
      {
        onSuccess: (challenge) => {
          setPhase({
            step: "code",
            challengeId: challenge.challenge_id,
            email,
          });
          start(challenge.resend_after_seconds);
        },
        onError: (err) => {
          const parsed = parseChallengeError(err);
          // 401 (wrong credentials) has no challenge code: surface the message.
          notifyError({ message: parsed.message });
          if (parsed.recovery === "cooldown" && parsed.retryAfterSeconds) {
            start(parsed.retryAfterSeconds);
          }
        },
      }
    );
  }

  function handleVerifyCode(code: string) {
    if (phase.step !== "code") return;
    setError(null);
    verifyLogin.mutate(
      { challenge_id: phase.challengeId, code },
      {
        onSuccess: (result) => {
          // Session success navigates inside the hook; handle MFA here.
          if (result.kind === "mfa") {
            setPhase({
              step: "mfa",
              mfaChallengeId: result.mfa.mfa_challenge_id,
            });
          }
        },
        onError: (err) => setError(parseChallengeError(err)),
      }
    );
  }

  function handleResend() {
    if (phase.step !== "code") return;
    setError(null);
    resend.mutate(phase.challengeId, {
      onSuccess: (challenge) => {
        setPhase({ ...phase, challengeId: challenge.challenge_id });
        start(challenge.resend_after_seconds);
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

  function handleVerifyMfa(code: string) {
    if (phase.step !== "mfa") return;
    setError(null);
    verifyMfa.mutate(
      { challenge_id: phase.mfaChallengeId, code },
      { onError: (err) => setError(parseChallengeError(err)) }
    );
  }

  function restart() {
    setPhase({ step: "password" });
    setError(null);
  }

  if (phase.step === "code") {
    return (
      <ChallengeCodeForm
        heading="Enter your code"
        description={
          <>
            We&apos;ve sent a sign-in code to{" "}
            <span className="font-semibold text-gray-900">{phase.email}</span>
          </>
        }
        onVerify={handleVerifyCode}
        isVerifying={verifyLogin.isPending}
        onResend={handleResend}
        isResending={resend.isPending}
        resendCooldownSeconds={secondsLeft}
        error={error}
        onRestart={restart}
        restartLabel="Back to sign in"
      />
    );
  }

  if (phase.step === "mfa") {
    return (
      <ChallengeCodeForm
        heading="Two-factor authentication"
        description="Enter the code from your authenticator app."
        onVerify={handleVerifyMfa}
        isVerifying={verifyMfa.isPending}
        error={error}
        onRestart={restart}
        restartLabel="Back to sign in"
      />
    );
  }

  return (
    <>
      <h1 className="text-xl font-medium text-slate-800">Welcome back!</h1>

      <form
        onSubmit={handlePasswordSubmit}
        className="mt-4 space-y-3 text-left"
      >
        <Input
          type="email"
          required
          placeholder="Enter your email address..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={PILL_STYLE}
          className="h-11 bg-gray-50 px-4 text-sm"
        />
        <PasswordInput
          required
          placeholder="Enter your password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={PILL_STYLE}
          className="h-11 bg-gray-50 px-4 text-sm"
        />

        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={login.isPending}
          style={PILL_STYLE}
          className="h-11 w-full bg-blue-600 text-sm font-medium hover:bg-blue-700"
        >
          {login.isPending ? "Signing in…" : "Continue with Email"}
        </Button>
      </form>

      <div className="mt-3 flex justify-center">
        <GoogleSignInButton />
      </div>

      <p className="mt-4 text-center text-xs text-gray-500">
        Don&apos;t have an account yet?{" "}
        <Link to="/sign-up" className="font-semibold text-blue-600">
          Sign up
        </Link>
      </p>
    </>
  );
}
