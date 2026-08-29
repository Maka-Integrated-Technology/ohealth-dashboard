// app/features/auth/google-sign-in-button.tsx
import { GoogleLogin } from "@react-oauth/google";
import { notifyError } from "~/lib/utils/toast";
import { useGoogleLogin } from "./hooks";

export function GoogleSignInButton({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const googleLogin = useGoogleLogin();

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        const idToken = credentialResponse.credential;
        if (!idToken) {
          notifyError({ message: "Google sign-in failed. Please try again." });
          return;
        }
        googleLogin.mutate({ token: idToken }, { onSuccess });
      }}
      onError={() => {
        notifyError({ message: "Google sign-in failed. Please try again." });
      }}
      shape="pill"
      width="350"
      text="continue_with"
    />
  );
}
