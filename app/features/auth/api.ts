// app/features/auth/api.ts
//
// Challenge protocol (#77, Ohealth-be #137/#150) over the backend-managed
// browser-session transport (#78, Ohealth-be #138/#157). Verification and
// Google completion go through the explicit `/auth/browser/*` endpoints: the
// refresh credential is set as an HttpOnly cookie and is never returned in the
// body, so only the short-lived access token reaches JavaScript.
import axiosInstance from "~/lib/config/axios";
import { unwrapApiData, type ApiEnvelope } from "~/lib/utils/api-response";
import type {
  AuthChallenge,
  AuthUser,
  BrowserSession,
  CompleteGoogleOAuthPayload,
  GoogleCompleteResult,
  GoogleTransaction,
  GoogleTransactionPayload,
  LoginPayload,
  LoginVerifyResult,
  MfaChallenge,
  ProfessionalSignupPayload,
  RegistrationBootstrap,
  ResetPasswordPayload,
  VerifyChallengePayload,
} from "./types";

// The signup/verify screens collect email + password only; the backend
// requires a non-empty name, overwritten in Profile Setup via PATCH /auth/me.
function deriveNameFromEmail(email: string): {
  first_name: string;
  last_name: string;
} {
  const localPart = email.split("@")[0]?.replace(/\+.*$/, "") ?? "";
  const parts = localPart
    .split(/[._-]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const titleCase = (value: string) =>
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

  if (!parts.length) {
    return { first_name: "OHealth", last_name: "User" };
  }

  return {
    first_name: titleCase(parts[0]),
    last_name: parts.length > 1 ? titleCase(parts.slice(1).join(" ")) : "User",
  };
}

function isMfaChallenge(data: unknown): data is MfaChallenge {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof (data as MfaChallenge).mfa_challenge_id === "string"
  );
}

export const authApi = {
  registrationBootstrap: async (): Promise<RegistrationBootstrap> => {
    const { data } = await axiosInstance.get<
      ApiEnvelope<RegistrationBootstrap>
    >("/api/auth/registration/bootstrap");
    return unwrapApiData(data);
  },

  // --- Signup (pre-session) ------------------------------------------------
  signUp: async (
    payload: ProfessionalSignupPayload
  ): Promise<AuthChallenge> => {
    const { data } = await axiosInstance.post<ApiEnvelope<AuthChallenge>>(
      "/api/auth/signup",
      payload
    );
    return unwrapApiData(data);
  },

  verifySignup: async (
    payload: VerifyChallengePayload
  ): Promise<BrowserSession> => {
    const { data } = await axiosInstance.post<ApiEnvelope<BrowserSession>>(
      "/api/auth/browser/verify",
      payload
    );
    return unwrapApiData(data);
  },

  resendSignup: async (challenge_id: string): Promise<AuthChallenge> => {
    const { data } = await axiosInstance.post<ApiEnvelope<AuthChallenge>>(
      "/api/auth/verify/resend",
      { challenge_id }
    );
    return unwrapApiData(data);
  },

  // --- Login (pre-session) -------------------------------------------------
  login: async (payload: LoginPayload): Promise<AuthChallenge> => {
    const { data } = await axiosInstance.post<ApiEnvelope<AuthChallenge>>(
      "/api/auth/login",
      payload
    );
    return unwrapApiData(data);
  },

  verifyLogin: async (
    payload: VerifyChallengePayload
  ): Promise<LoginVerifyResult> => {
    const { data } = await axiosInstance.post<
      ApiEnvelope<BrowserSession | MfaChallenge>
    >("/api/auth/browser/login/verify", payload);
    const result = unwrapApiData(data);
    return isMfaChallenge(result)
      ? { kind: "mfa", mfa: result }
      : { kind: "session", session: result };
  },

  verifyLoginMfa: async (
    payload: VerifyChallengePayload
  ): Promise<BrowserSession> => {
    const { data } = await axiosInstance.post<ApiEnvelope<BrowserSession>>(
      "/api/auth/browser/login/mfa/verify",
      payload
    );
    return unwrapApiData(data);
  },

  resendLogin: async (challenge_id: string): Promise<AuthChallenge> => {
    const { data } = await axiosInstance.post<ApiEnvelope<AuthChallenge>>(
      "/api/auth/login/resend",
      { challenge_id }
    );
    return unwrapApiData(data);
  },

  // --- Google web OAuth (nonce-bound transaction -> browser completion) ----
  googleTransaction: async (
    payload: GoogleTransactionPayload
  ): Promise<GoogleTransaction> => {
    const { data } = await axiosInstance.post<ApiEnvelope<GoogleTransaction>>(
      "/api/auth/oauth/google/transactions",
      payload
    );
    return unwrapApiData(data);
  },

  completeGoogleOAuth: async (
    payload: CompleteGoogleOAuthPayload
  ): Promise<GoogleCompleteResult> => {
    const response = await axiosInstance.post<
      ApiEnvelope<BrowserSession | MfaChallenge | AuthChallenge>
    >("/api/auth/browser/oauth/google/complete", payload);
    const result = unwrapApiData(response.data);
    // 202 => third-party Google signup needs contact verification; NO session.
    if (response.status === 202) {
      return {
        kind: "contact-verification",
        challenge: result as AuthChallenge,
      };
    }
    return isMfaChallenge(result)
      ? { kind: "mfa", mfa: result }
      : { kind: "session", session: result as BrowserSession };
  },

  // --- Password recovery ---------------------------------------------------
  forgotPassword: async (email: string): Promise<void> => {
    await axiosInstance.post("/api/auth/forgot-password", { email });
  },

  resendForgotPassword: async (
    challenge_id: string
  ): Promise<AuthChallenge> => {
    const { data } = await axiosInstance.post<ApiEnvelope<AuthChallenge>>(
      "/api/auth/forgot-password/resend",
      { challenge_id }
    );
    return unwrapApiData(data);
  },

  resetPassword: async (payload: ResetPasswordPayload): Promise<void> => {
    await axiosInstance.post("/api/auth/reset-password", payload);
  },

  // --- Session -------------------------------------------------------------
  me: async (): Promise<AuthUser> => {
    const { data } =
      await axiosInstance.get<ApiEnvelope<AuthUser>>("/api/auth/me");
    return unwrapApiData(data);
  },

  // Revoke and clear the browser session server-side (HttpOnly cookie). No
  // session id is sent — the backend reads the cookie.
  logout: async (): Promise<void> => {
    await axiosInstance.post("/api/auth/browser/logout");
  },
};

export { deriveNameFromEmail };
