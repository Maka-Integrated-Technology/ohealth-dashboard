import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils/helpers";
import { notifySuccess } from "~/lib/utils/toast";
import { useVerifyEmail, useResendCode } from "~/features/auth/hooks";

export function VerifyEmailForm({ email }: { email: string }) {
  const navigate = useNavigate();
  const verify = useVerifyEmail();
  const resend = useResendCode();
  const [code, setCode] = useState("");

  // TODO(confirm-schema): assumes 401/400 on invalid code so isError can
  // drive this message. Confirm the actual error contract once available —
  // for now this shows a fixed string rather than the raw API message,
  // matching the Figma's static "Code is not valid" copy.
  const showInvalidCode = verify.isError;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    verify.mutate(
      { email, code },
      {
        onSuccess: () => {
          // TODO(Phase 4 seam): this is where role-based dashboard routing
          // will eventually happen. For now, on to onboarding once that's
          // confirmed with the CTO.
          navigate("/onboarding");
        },
      }
    );
  }

  function handleResend() {
    resend.mutate(
      { email },
      {
        onSuccess: () => {
          notifySuccess({ message: `Verification code resent to ${email}` });
        },
      }
    );
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-900">Check your email</h1>
      <p className="mt-4 text-gray-600">
        We&apos;ve sent you a verification code. Please check your inbox at{" "}
        <span className="font-semibold text-gray-900">{email}</span>
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-2 text-left">
        <Input
          required
          inputMode="numeric"
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className={cn(
            "rounded-full text-center text-lg tracking-widest",
            showInvalidCode && "border-red-400 focus-visible:ring-red-300"
          )}
        />
        {showInvalidCode && (
          <p className="text-left text-sm text-red-500">Code is not valid</p>
        )}

        <Button
          type="submit"
          disabled={verify.isPending}
          className="mt-6! w-full rounded-full bg-blue-600 py-6 text-base font-semibold hover:bg-blue-700"
        >
          {verify.isPending ? "Verifying…" : "Continue"}
        </Button>
      </form>

      <button
        type="button"
        onClick={handleResend}
        disabled={resend.isPending}
        className="mt-6 text-sm text-gray-700 hover:underline disabled:opacity-50"
      >
        {resend.isPending ? "Resending…" : "Resend code"}
      </button>

      <p className="mt-2 text-sm text-gray-700">
        <Link to="/sign-up" className="hover:underline">
          Back to sign up
        </Link>
      </p>
    </>
  );
}
