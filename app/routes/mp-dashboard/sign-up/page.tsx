// app/routes/mp-dashboard/sign-up/page.tsx
import { SignUpForm } from "~/routes/auth/sign-up/_sections/sign-up-form";
import AuthBadge from "~/components/shared/auth-badge";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-87.5 text-center">
        <AuthBadge />
        <SignUpForm />
      </div>
    </div>
  );
}
