// app/routes/auth/forgot-password/_sections/forgot-password-form.tsx
import { useState, type SyntheticEvent } from "react";
import { Link } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useForgotPassword } from "~/features/auth/hooks";
import { parseChallengeError } from "~/features/auth/challenge-errors";
import { notifyError } from "~/lib/utils/toast";

export function ForgotPasswordForm() {
  const forgot = useForgotPassword();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    e.preventDefault();
    forgot.mutate(email, {
      // The endpoint is deliberately generic (no account enumeration): show
      // the same confirmation whether or not the address exists.
      onSuccess: () => setSubmitted(true),
      onError: (err) =>
        notifyError({ message: parseChallengeError(err).message }),
    });
  }

  if (submitted) {
    return (
      <>
        <h1 className="text-2xl font-semibold text-gray-900">
          Check your email
        </h1>
        <p className="mt-4 text-gray-600">
          If an account exists for{" "}
          <span className="font-semibold text-gray-900">{email}</span>,
          we&apos;ve sent a link to reset your password.
        </p>
        <p className="mt-6 text-sm text-gray-700">
          <Link to="/login" className="hover:underline">
            Back to sign in
          </Link>
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-900">
        Reset your password
      </h1>
      <p className="mt-4 text-gray-600">
        Enter your email and we&apos;ll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-3 text-left">
        <Input
          type="email"
          required
          placeholder="Enter your email address..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 rounded-full! bg-gray-50 px-4 text-sm"
        />
        <Button
          type="submit"
          disabled={forgot.isPending}
          className="h-11 w-full rounded-full! bg-blue-600 text-sm font-medium hover:bg-blue-700"
        >
          {forgot.isPending ? "Sending…" : "Send reset link"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-gray-700">
        <Link to="/login" className="hover:underline">
          Back to sign in
        </Link>
      </p>
    </>
  );
}
