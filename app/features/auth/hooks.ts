// app/features/auth/hooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { setAccessToken, clearSession } from "~/lib/auth/session";
import { QUERY_KEYS } from "~/lib/utils/query-keys";
import { authApi } from "./api";
import type { BrowserSession } from "./types";

// Challenge mutations deliberately do NOT toast or swallow errors: the forms
// read the stable error_code (via parseChallengeError) to drive cooldown,
// restart and retry state. Only after a verified code is a session persisted.
//
// The access token is held in memory only; the refresh credential is the
// backend-managed HttpOnly cookie, which this client never reads or stores.
function persistSession(session: BrowserSession) {
  setAccessToken(session.access_token);
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

// --- Google web OAuth (nonce-bound transaction -> browser completion) ------

export function useGoogleTransaction() {
  return useMutation({ mutationFn: authApi.googleTransaction });
}

export function useCompleteGoogleOAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: authApi.completeGoogleOAuth,
    onSuccess: (result) => {
      // Only a completed session establishes auth; MFA and third-party contact
      // verification are continued by the caller without a session.
      if (result.kind === "session") {
        persistSession(result.session);
        void navigate("/", { replace: true });
        void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me() });
      }
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
    // Revoke the browser session server-side (reads the HttpOnly cookie)
    // before clearing local state, so the refresh credential is invalidated.
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      clearSession();
      queryClient.clear();
      void navigate("/login", { replace: true });
    },
  });
}
