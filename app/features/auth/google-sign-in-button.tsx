// app/features/auth/google-sign-in-button.tsx
import { GoogleLogin } from "@react-oauth/google";
import { notifyError } from "~/lib/utils/toast";
import { useGoogleLogin } from "./hooks";

export function GoogleSignInButton() {
  const googleLogin = useGoogleLogin();

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={
          googleLogin.isPending ? "pointer-events-none opacity-60" : ""
        }
      >
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            const idToken = credentialResponse.credential;
            if (!idToken) {
              notifyError({
                message: "Google sign-in failed. Please try again.",
              });
              return;
            }
            googleLogin.mutate({ token: idToken });
          }}
          onError={() => {
            notifyError({
              message: "Google sign-in failed. Please try again.",
            });
          }}
          shape="pill"
          width="350"
          text="continue_with"
        />
      </div>
      {googleLogin.isPending && (
        <p className="text-xs font-medium text-blue-600">Signing you in…</p>
      )}
    </div>
  );
}
