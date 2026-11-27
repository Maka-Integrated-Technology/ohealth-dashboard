// app/features/auth/hooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { saveSession, getSessionId, clearSession } from "~/lib/auth/session";
import { QUERY_KEYS } from "~/lib/utils/query-keys";
import { authApi } from "./api";
import type { AuthSessionTokens } from "./types";

// Challenge mutations deliberately do NOT toast or swallow errors: the forms
// read the stable error_code (via parseChallengeError) to drive cooldown,
// restart and retry state. Only after a verified code is a session persisted.
function persistSession(tokens: AuthSessionTokens) {
  saveSession({
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    sessionId: tokens.session_id,
  });
}

export function useRegistrationBootstrap() {
  return useQuery({
    queryKey: QUERY_KEYS.auth.registrationBootstrap(),
    queryFn: authApi.registrationBootstrap,
    staleTime: 5 * 60 * 1000,
  });
}

// --- Signup ----------------------------------------------------------------

export function useSignUp() {
  return useMutation({ mutationFn: authApi.signUp });
}

export function useVerifySignup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.verifySignup,
    onSuccess: (tokens) => {
      persistSession(tokens);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me() });
    },
  });
}

export function useResendSignup() {
  return useMutation({ mutationFn: authApi.resendSignup });
}

// --- Login -----------------------------------------------------------------

export function useLogin() {
  return useMutation({ mutationFn: authApi.login });
}

export function useVerifyLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: authApi.verifyLogin,
    onSuccess: (result) => {
      if (result.kind === "session") {
        persistSession(result.session);
        void navigate("/", { replace: true });
        void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me() });
      }
    },
  });
}

export function useVerifyLoginMfa() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: authApi.verifyLoginMfa,
    onSuccess: (tokens) => {
      persistSession(tokens);
      void navigate("/", { replace: true });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me() });
    },
  });
}

export function useResendLogin() {
  return useMutation({ mutationFn: authApi.resendLogin });
}

// Legacy Google entry point, kept working until #78 migrates it to the
// canonical web OAuth transaction flow.
export function useGoogleLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: authApi.googleLogin,
    onSuccess: (tokens) => {
      persistSession(tokens);
      void navigate("/", { replace: true });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me() });
    },
  });
}

// --- Password recovery -----------------------------------------------------

export function useForgotPassword() {
  return useMutation({ mutationFn: authApi.forgotPassword });
}

export function useResendForgotPassword() {
  return useMutation({ mutationFn: authApi.resendForgotPassword });
}

export function useResetPassword() {
  return useMutation({ mutationFn: authApi.resetPassword });
}

// --- Session ---------------------------------------------------------------

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
