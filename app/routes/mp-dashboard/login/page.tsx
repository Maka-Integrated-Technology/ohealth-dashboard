// app/routes/mp-dashboard/login/page.tsx
import { LoginForm } from "~/routes/auth/login/_sections/login-form";
import AuthBadge from "~/components/shared/auth-badge";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-87.5 text-center">
        <AuthBadge />
        <LoginForm />
      </div>
    </div>
  );
}
