import { useState, type SyntheticEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { PasswordInput } from "~/components/shared/password-input";
import { useSignUp } from "~/features/auth/hooks";

export function SignUpForm() {
  const navigate = useNavigate();
  const signUp = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    e.preventDefault();
    signUp.mutate(
      { email, password },
      {
        onSuccess: () => {
          navigate("/verify-email", { state: { email } });
        },
      }
    );
  }

  // TODO: wire real Google OAuth. Needs a client library (e.g.
  // @react-oauth/google) + a configured Google Client ID env var — neither
  // confirmed yet. This button currently does nothing.
  function handleGoogleContinue() {
    console.warn("Google OAuth not yet wired up");
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-900">
        Create an Account
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-left">
        <Input
          type="email"
          required
          placeholder="Enter your email address..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-full"
        />
        <PasswordInput
          required
          minLength={8}
          placeholder="Enter your password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-full"
        />

        <Button
          type="submit"
          disabled={signUp.isPending}
          className="w-full rounded-full bg-blue-600 py-6 text-base font-semibold hover:bg-blue-700"
        >
          {signUp.isPending ? "Creating account…" : "Continue with Email"}
        </Button>
      </form>

      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleContinue}
        className="mt-3 w-full rounded-full py-6 text-base font-semibold"
      >
        <img src="/icons/google.svg" alt="" className="mr-2 size-5" />
        Continue with Google
      </Button>

      <p className="text-muted-foreground mt-6 text-sm">
        By signing up, you agree to our{" "}
        <Link to="/terms" className="text-foreground font-medium underline">
          Terms and Conditions
        </Link>
      </p>

      <p className="mt-4 text-sm text-gray-700">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-blue-600">
          Log in
        </Link>
      </p>
    </>
  );
}
