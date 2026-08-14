// app/features/auth/api.ts
import axiosInstance from "~/lib/config/axios";
import type {
  SignUpPayload,
  SignUpResponse,
  LoginPayload,
  LoginResponse,
  VerifyEmailPayload,
  ResendCodePayload,
  GoogleLoginPayload,
  AuthTokens,
  AuthUser,
} from "./types";

export const authApi = {
  signUp: async (payload: SignUpPayload): Promise<SignUpResponse> => {
    const { data } = await axiosInstance.post("api/v1/auth/signup", payload);
    return data;
  },

  // TODO(confirm-schema): endpoint path assumed as /auth/login, mirroring
  // /auth/signup. Confirm once Swagger is updated.
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await axiosInstance.post("api/v1/auth/login", payload);
    return data;
  },

  verify: async (payload: VerifyEmailPayload): Promise<AuthTokens> => {
    const { data } = await axiosInstance.post("/api/v1/auth/verify", payload);
    return data;
  },

  // TODO(confirm-schema): assumed a separate verify endpoint for the login
  // flow's code (as opposed to signup's /auth/verify). Confirm whether the
  // backend actually reuses /auth/verify for both flows instead.
  verifyLogin: async (payload: VerifyEmailPayload): Promise<AuthTokens> => {
    const { data } = await axiosInstance.post(
      "api/v1/auth/login/verify",
      payload
    );
    return data;
  },

  resendCode: async (payload: ResendCodePayload): Promise<void> => {
    await axiosInstance.post("api/v1/auth/verify/resend", payload);
  },

  googleLogin: async (payload: GoogleLoginPayload): Promise<AuthTokens> => {
    const { data } = await axiosInstance.post(
      "api/v1/auth/google-login",
      payload
    );
    return data;
  },

  me: async (): Promise<AuthUser> => {
    const { data } = await axiosInstance.get("/api/v1/auth/me");
    return data;
  },
};
