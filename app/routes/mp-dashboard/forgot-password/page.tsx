// app/routes/mp-dashboard/forgot-password/page.tsx
import { ForgotPasswordForm } from "~/routes/auth/forgot-password/_sections/forgot-password-form";
import AuthBadge from "~/components/shared/auth-badge";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md py-16 text-center">
        <AuthBadge />
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
