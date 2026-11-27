// app/features/auth/google-sign-in-button.tsx
//
// Google web OAuth over the browser-session transport (#78). We open a
// nonce-bound transaction, hand the nonce to Google so it is embedded in the
// id_token, then complete through `/auth/browser/oauth/google/complete`. A
// successful completion sets an HttpOnly refresh cookie server-side; only the
// access token reaches memory (handled in the hook).
import { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router";
import {
  useGoogleTransaction,
  useCompleteGoogleOAuth,
  useRegistrationBootstrap,
} from "./hooks";
import { parseChallengeError } from "./challenge-errors";
import type { GoogleTransaction, GoogleTransactionPayload } from "./types";
import type { VerifyEmailState } from "./challenge-nav";
import { ENV_CONFIG } from "~/lib/utils/constants";
import { notifyError, notifyInfo } from "~/lib/utils/toast";

const SIGNUP_INTENT = "healthcare_professional" as const;

export function GoogleSignInButton({
  operation = "signin",
}: {
  operation?: "signin" | "signup";
}) {
  const navigate = useNavigate();
  const bootstrap = useRegistrationBootstrap();
  const startTransaction = useGoogleTransaction();
  const complete = useCompleteGoogleOAuth();
  const [transaction, setTransaction] = useState<GoogleTransaction | null>(
    null
  );

  const audience = ENV_CONFIG.googleClientId;

  function openTransaction() {
    if (!audience) return;
    let payload: GoogleTransactionPayload;
    if (operation === "signup") {
      const legal = bootstrap.data;
      if (!legal) return; // wait for bootstrap; effect re-runs when it lands
      payload = {
        operation: "signup",
        consumer: "web",
        audience,
        intent: SIGNUP_INTENT,
        accepted_terms_version: legal.terms.version,
        accepted_privacy_version: legal.privacy.version,
      };
    } else {
      payload = { operation: "signin", consumer: "web", audience };
    }
    startTransaction.mutate(payload, {
      onSuccess: setTransaction,
      onError: (e) => notifyError({ message: parseChallengeError(e).message }),
    });
  }

  // Open a transaction up front so the nonce is ready when the user clicks, and
  // reopen it when the signup legal versions finish loading.
  useEffect(() => {
    if (!transaction && !startTransaction.isPending) openTransaction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operation, bootstrap.data]);

  function handleCredential(idToken: string) {
    if (!transaction) return;
    complete.mutate(
      {
        id_token: idToken,
        transaction_id: transaction.transaction_id,
        transaction_token: transaction.transaction_token,
      },
      {
        onSuccess: (result) => {
          if (result.kind === "contact-verification") {
            const state: VerifyEmailState = {
              challengeId: result.challenge.challenge_id,
              resendAfterSeconds: result.challenge.resend_after_seconds,
              deliveryTarget: result.challenge.delivery_target,
            };
            navigate("/verify-email", { state });
          } else if (result.kind === "mfa") {
            // No Google-initiated MFA surface yet; direct the user to password
            // sign-in where MFA is handled. Tracked as a follow-up.
            notifyInfo({
              message: "Please sign in with your email to complete two-factor.",
            });
          }
          // `session` navigates inside the hook.
        },
        onError: (e) => {
          notifyError({ message: parseChallengeError(e).message });
          // Transactions are single-use; open a fresh one for the next attempt.
          setTransaction(null);
        },
      }
    );
  }

  if (!audience) return null;

  const busy = complete.isPending || startTransaction.isPending;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={busy ? "pointer-events-none opacity-60" : ""}>
        <GoogleLogin
          nonce={transaction?.nonce}
          onSuccess={(credentialResponse) => {
            const idToken = credentialResponse.credential;
            if (!idToken || !transaction) {
              notifyError({
                message: "Google sign-in failed. Please try again.",
              });
              return;
            }
            handleCredential(idToken);
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
      {complete.isPending && (
        <p className="text-xs font-medium text-blue-600">Signing you in…</p>
      )}
    </div>
  );
}
