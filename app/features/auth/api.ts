// app/features/auth/api.ts
import axiosInstance from "~/lib/config/axios";
import { unwrapApiData, type ApiEnvelope } from "~/lib/utils/api-response";
import type {
  AuthSession,
  AuthUser,
  GoogleLoginPayload,
  LoginPayload,
  ResendCodePayload,
  SignUpPayload,
  VerifyEmailPayload,
} from "./types";

// The legacy `/auth/signup` endpoint requires a role and a name; this build
// only ever registers healthcare professionals, and the Figma sign-up screen
// deliberately asks for just email + password — first/last name are
// collected properly in Profile Setup step 1 and overwrite this via
// `PATCH /auth/me`. Mirrors the server's own Google-login fallback naming.
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

export const authApi = {
  signUp: async (payload: SignUpPayload): Promise<AuthSession> => {
    const { data } = await axiosInstance.post<ApiEnvelope<AuthSession>>(
      "/api/auth/signup",
      {
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email,
        password: payload.password,
        role: ["DOCTOR"],
      }
    );
    const session = unwrapApiData(data);
    if (
      !session ||
      typeof session.access_token !== "string" ||
      typeof session.refresh_token !== "string"
    ) {
      throw new Error("Signup response was incomplete. Please try again.");
    }
    return session;
  },

  login: async (payload: LoginPayload): Promise<AuthSession> => {
    const { data } = await axiosInstance.post<ApiEnvelope<AuthSession>>(
      "/api/auth/login",
      payload
    );
    return unwrapApiData(data);
  },

  verify: async (payload: VerifyEmailPayload): Promise<{ message: string }> => {
    const { data } = await axiosInstance.post<ApiEnvelope<{ message: string }>>(
      "/api/auth/verify",
      payload
    );
    return unwrapApiData(data);
  },

  resendCode: async (payload: ResendCodePayload): Promise<void> => {
    await axiosInstance.post("/api/auth/verify/resend", payload);
  },

  googleLogin: async (payload: GoogleLoginPayload): Promise<AuthSession> => {
    const { data } = await axiosInstance.post<ApiEnvelope<AuthSession>>(
      "/api/auth/google-login",
      payload
    );
    return unwrapApiData(data);
  },

  me: async (): Promise<AuthUser> => {
    const { data } =
      await axiosInstance.get<ApiEnvelope<AuthUser>>("/api/auth/me");
    return unwrapApiData(data);
  },

  logout: async (sessionId: string): Promise<void> => {
    await axiosInstance.post("/api/auth/logout", { session_id: sessionId });
  },
};

export { deriveNameFromEmail };
