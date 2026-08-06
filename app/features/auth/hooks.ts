// app/features/auth/hooks.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "~/lib/utils/query-keys";
import { handleApiError } from "~/lib/utils/error-handler";
import { authApi } from "./api";

export function useSignUp() {
  return useMutation({
    mutationFn: authApi.signUp,
    onError: (error) => {
      handleApiError(error);
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: authApi.login,
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

export function useVerifyLogin() {
  return useMutation({
    mutationFn: authApi.verifyLogin,
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
  return useMutation({
    mutationFn: authApi.googleLogin,
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
