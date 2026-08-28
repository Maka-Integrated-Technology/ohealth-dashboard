// app/routes/auth/login/_sections/login-form.tsx
import { useState, type SyntheticEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { PasswordInput } from "~/components/shared/password-input";
import { useLogin } from "~/features/auth/hooks";
import { ENV_CONFIG } from "~/lib/utils/constants";

const PILL_STYLE = { borderRadius: 9999 };

export function LoginForm() {
  const navigate = useNavigate();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    e.preventDefault();
    login.mutate(
      { email, password },
      {
        onSuccess: () => {
          navigate("/", { replace: true });
        },
      }
    );
  }

  function handleGoogleContinue() {
    window.location.href = `${ENV_CONFIG.apiBaseUrl}
api/v1/auth/google-login
`;
  }

  return (
    <>
      <h1 className="text-xl font-medium text-slate-800">Welcome back!</h1>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-left">
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

        <Button
          type="submit"
          disabled={login.isPending}
          style={PILL_STYLE}
          className="h-11 w-full bg-blue-600 text-sm font-medium hover:bg-blue-700"
        >
          {login.isPending ? "Signing in…" : "Continue with Email"}
        </Button>
      </form>

      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleContinue}
        style={PILL_STYLE}
        className="mt-3 h-11 w-full border-gray-200 bg-gray-50 text-sm font-medium"
      >
        <img src="/icons/google.svg" alt="" className="mr-2 size-5" />
        Continue with Google
      </Button>

      <p className="mt-4 text-center text-xs text-gray-500">
        Don&apos;t have an account yet?{" "}
        <Link to="/sign-up" className="font-semibold text-blue-600">
          Sign up
        </Link>
      </p>
    </>
  );
}
