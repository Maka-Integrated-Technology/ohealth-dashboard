// app/features/auth/hooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { saveSession, getSessionId, clearSession } from "~/lib/auth/session";
import { QUERY_KEYS } from "~/lib/utils/query-keys";
import { handleApiError } from "~/lib/utils/error-handler";
import { authApi, deriveNameFromEmail } from "./api";
import type { AuthSession, AuthUser, LoginPayload } from "./types";

function persistSession(session: AuthSession) {
  saveSession({
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    sessionId: session.session_id,
  });
}

function toAuthUser(session: AuthSession): AuthUser {
  return {
    ...session.user,
    middle_name: null,
    gender: null,
    dob: null,
    phone: null,
    country: null,
    image: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function useSignUp() {
  return useMutation({
    mutationFn: (payload: { email: string; password: string }) => {
      const { first_name, last_name } = deriveNameFromEmail(payload.email);
      return authApi.signUp({ ...payload, first_name, last_name });
    },
    onSuccess: (session) => {
      persistSession(session);
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (session) => {
      persistSession(session);
      queryClient.setQueryData(QUERY_KEYS.auth.me(), toAuthUser(session));
      void navigate("/", { replace: true });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me() });
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: authApi.verify,
    onError: (error) => {
      handleApiError(error);
    },
  });
}

export function useResendCode() {
  return useMutation({
    mutationFn: authApi.resendCode,
    onError: (error) => {
      handleApiError(error);
    },
  });
}

export function useGoogleLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.googleLogin,
    onSuccess: (session) => {
      persistSession(session);
      queryClient.setQueryData(QUERY_KEYS.auth.me(), toAuthUser(session));
      void navigate("/", { replace: true });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me() });
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
}

export function useMe(enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.auth.me(),
    queryFn: authApi.me,
    enabled,
    retry: false,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const sessionId = getSessionId();
      if (sessionId) {
        await authApi.logout(sessionId);
      }
    },
    onSettled: () => {
      clearSession();
      queryClient.clear();
      void navigate("/login", { replace: true });
    },
  });
}
