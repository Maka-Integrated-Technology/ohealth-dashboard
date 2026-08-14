// app/routes/auth/verify-login/_sections/verify-login-form.tsx
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils/helpers";
import { notifySuccess } from "~/lib/utils/toast";
import { useVerifyLogin, useResendCode } from "~/features/auth/hooks";

const PILL_STYLE = { borderRadius: 9999 };

export function VerifyLoginForm({ email }: { email: string }) {
  const navigate = useNavigate();
  const verify = useVerifyLogin();
  const resend = useResendCode();
  const [code, setCode] = useState("");

  const showInvalidCode = verify.isError;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    verify.mutate(
      { email, code },
      {
        onSuccess: () => {
          navigate("/");
        },
      }
    );
  }

  function handleResend() {
    resend.mutate(
      { email },
      {
        onSuccess: () => {
          notifySuccess({ message: `Login code resent to ${email}` });
        },
      }
    );
  }

  return (
    <>
      <h1 className="text-xl font-medium text-slate-800">Check your email</h1>
      <p className="mt-4 text-sm text-gray-500">
        We&apos;ve sent you a login code. Please check your inbox at{" "}
        <span className="font-semibold text-gray-700">{email}</span>
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-2 text-left">
        <Input
          required
          inputMode="numeric"
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={PILL_STYLE}
          className={cn(
            "h-11 bg-gray-50 text-center text-sm tracking-widest",
            showInvalidCode && "border-red-400 focus-visible:ring-red-300"
          )}
        />
        {showInvalidCode && (
          <p className="text-left text-xs text-red-500">Code is not valid</p>
        )}

        <Button
          type="submit"
          disabled={verify.isPending}
          style={PILL_STYLE}
          className="mt-2! h-11 w-full bg-blue-600 text-sm font-medium hover:bg-blue-700"
        >
          {verify.isPending ? "Verifying…" : "Continue"}
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-gray-500">
        <Link to="/login" className="hover:underline">
          Back to log in
        </Link>
      </p>

      <button
        type="button"
        onClick={handleResend}
        disabled={resend.isPending}
        className="mt-2 text-center text-xs text-blue-600"
      >
        {resend.isPending ? "Resending…" : "Resend code"}
      </button>
    </>
  );
}
