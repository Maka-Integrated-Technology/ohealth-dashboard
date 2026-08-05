import axiosInstance from "~/lib/config/axios";
import type {
  SignUpPayload,
  SignUpResponse,
  VerifyEmailPayload,
  ResendCodePayload,
  GoogleLoginPayload,
  AuthTokens,
  AuthUser,
} from "./types";

export const authApi = {
  signUp: async (payload: SignUpPayload): Promise<SignUpResponse> => {
    const { data } = await axiosInstance.post("/api/v1/auth/signup", payload);
    return data;
  },

  verify: async (payload: VerifyEmailPayload): Promise<AuthTokens> => {
    const { data } = await axiosInstance.post("/api/v1/auth/verify", payload);
    return data;
  },

  resendCode: async (payload: ResendCodePayload): Promise<void> => {
    await axiosInstance.post("/api/v1/auth/verify/resend", payload);
  },

  googleLogin: async (payload: GoogleLoginPayload): Promise<AuthTokens> => {
    const { data } = await axiosInstance.post("/api/v1/auth/google-login", payload);
    return data;
  },

  me: async (): Promise<AuthUser> => {
    const { data } = await axiosInstance.get("/api/v1/auth/me");
    return data;
  },
};