// app/routes/auth/sign-up/_sections/sign-up-form.tsx
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

  function handleGoogleContinue() {
    console.warn("Google OAuth not yet wired up");
  }

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
          disabled={signUp.isPending}
          className="h-11 w-full rounded-full! bg-blue-600 text-sm font-medium hover:bg-blue-700"
        >
          {signUp.isPending ? "Creating account…" : "Continue with Email"}
        </Button>
      </form>

      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleContinue}
        className="mt-3 h-11 w-full rounded-full! border-gray-200 bg-gray-50 text-sm font-medium"
      >
        <img src="/icons/google.svg" alt="" className="mr-2 size-5" />
        Continue with Google
      </Button>

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
