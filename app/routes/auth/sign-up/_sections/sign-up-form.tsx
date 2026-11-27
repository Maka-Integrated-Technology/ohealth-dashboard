// app/routes/auth/sign-up/_sections/sign-up-form.tsx
import { useState, type SyntheticEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { PasswordInput } from "~/components/shared/password-input";
import { useSignUp, useRegistrationBootstrap } from "~/features/auth/hooks";
import { deriveNameFromEmail } from "~/features/auth/api";
import { parseChallengeError } from "~/features/auth/challenge-errors";
import { GoogleSignInButton } from "~/features/auth/google-sign-in-button";
import type { VerifyEmailState } from "~/features/auth/challenge-nav";
import { notifySuccess, notifyError } from "~/lib/utils/toast";

// shortcut: this build is the professional dashboard, so signup is bound to the
// healthcare_professional intent. Upgrade when a shared signup surface needs
// the canonical account-type selector (#74) in front of this form.
const SIGNUP_INTENT = "healthcare_professional" as const;

export function SignUpForm() {
  const navigate = useNavigate();
  const bootstrap = useRegistrationBootstrap();
  const signUp = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    e.preventDefault();

    const legal = bootstrap.data;
    if (!legal) {
      notifyError({
        message: "We couldn't load the latest terms. Please try again.",
      });
      void bootstrap.refetch();
      return;
    }

    const { first_name, last_name } = deriveNameFromEmail(email);
    signUp.mutate(
      {
        intent: SIGNUP_INTENT,
        email,
        password,
        first_name,
        last_name,
        accepted_terms_version: legal.terms.version,
        accepted_privacy_version: legal.privacy.version,
      },
      {
        onSuccess: (challenge) => {
          notifySuccess({
            message: "Account created",
            description: "Check your email for the verification code.",
          });
          const state: VerifyEmailState = {
            challengeId: challenge.challenge_id,
            email,
            resendAfterSeconds: challenge.resend_after_seconds,
            deliveryTarget: challenge.delivery_target,
          };
          navigate("/verify-email", { state });
        },
        onError: (error) => {
          notifyError({ message: parseChallengeError(error).message });
        },
      }
    );
  }

  const disabled = signUp.isPending || bootstrap.isLoading;

  return (
    <>
      <h1 className="text-xl font-medium text-slate-800">Create an Account</h1>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-left">
        <Input
          type="email"
          required
          placeholder="Enter your email address..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 rounded-full! bg-gray-50 px-4 text-sm"
        />
        <PasswordInput
          required
          minLength={8}
          placeholder="Enter your password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-11 rounded-full! bg-gray-50 px-4 text-sm"
        />

        <Button
          type="submit"
          disabled={disabled}
          className="h-11 w-full rounded-full! bg-blue-600 text-sm font-medium hover:bg-blue-700"
        >
          {signUp.isPending ? "Creating account…" : "Continue with Email"}
        </Button>
      </form>

      <div className="mt-3 flex justify-center">
        <GoogleSignInButton operation="signup" />
      </div>

      <p className="mt-4 text-center text-xs text-gray-500">
        By signing up, you agree to our{" "}
        <Link to="/terms" className="font-semibold text-gray-700">
          Terms and Conditions
        </Link>
      </p>

      <p className="mt-2 text-center text-xs text-gray-500">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-blue-600">
          Log in
        </Link>
      </p>
    </>
  );
}
