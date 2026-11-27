// app/features/auth/api.ts
//
// Canonical challenge-based auth contract (Ohealth-be #137 / PR #150).
// Registration and login are pre-session challenges; tokens are issued only
// by the verify endpoints. See #77. Token transport is still cookie-based
// here — #78 migrates it to the backend-managed browser session.
import axiosInstance from "~/lib/config/axios";
import { unwrapApiData, type ApiEnvelope } from "~/lib/utils/api-response";
import type {
  AuthChallenge,
  AuthSessionTokens,
  AuthUser,
  GoogleLoginPayload,
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
// Mirrors the server's own Google-login fallback naming.
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
    "mfa_challenge_id" in data &&
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
  ): Promise<AuthSessionTokens> => {
    const { data } = await axiosInstance.post<ApiEnvelope<AuthSessionTokens>>(
      "/api/auth/verify",
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
      ApiEnvelope<AuthSessionTokens | MfaChallenge>
    >("/api/auth/login/verify", payload);
    const result = unwrapApiData(data);
    return isMfaChallenge(result)
      ? { kind: "mfa", mfa: result }
      : { kind: "session", session: result };
  },

  verifyLoginMfa: async (
    payload: VerifyChallengePayload
  ): Promise<AuthSessionTokens> => {
    const { data } = await axiosInstance.post<ApiEnvelope<AuthSessionTokens>>(
      "/api/auth/login/mfa/verify",
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

  googleLogin: async (
    payload: GoogleLoginPayload
  ): Promise<AuthSessionTokens> => {
    // Legacy Google entry point; the canonical web OAuth transaction flow is
    // migrated in #78.
    const { data } = await axiosInstance.post<ApiEnvelope<AuthSessionTokens>>(
      "/api/auth/google-login",
      payload
    );
    return unwrapApiData(data);
  },

  logout: async (sessionId: string): Promise<void> => {
    await axiosInstance.post("/api/auth/logout", { session_id: sessionId });
  },
};

export { deriveNameFromEmail };
