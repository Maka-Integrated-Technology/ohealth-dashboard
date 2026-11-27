import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import axiosRetry from "axios-retry";
import {
  clearSession,
  getAccessToken,
  setAccessToken,
} from "~/lib/auth/session";
import { ENV_CONFIG } from "~/lib/utils/constants";

// Marks every request as the browser-session client. The backend uses this to
// select the HttpOnly-cookie refresh transport (never a JS-readable token).
export const OHEALTH_CLIENT_HEADER = "X-OHealth-Client";
export const OHEALTH_CLIENT_BROWSER = "browser";

const axiosInstance = axios.create({
  baseURL: ENV_CONFIG.apiBaseUrl ?? "",
  // Send/receive the backend-managed HttpOnly refresh cookie on auth routes.
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    [OHEALTH_CLIENT_HEADER]: OHEALTH_CLIENT_BROWSER,
  },
  timeout: 10000,
});

axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) =>
    axiosRetry.isNetworkOrIdempotentRequestError(error),
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// Single-flight refresh: concurrent 401s share one credentialed browser-refresh
// call. Resolves to the new access token, or null if refresh was rejected.
// The refresh credential is the HttpOnly cookie — it is never read here, only
// sent automatically via `withCredentials`.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  try {
    // A bare axios call, not axiosInstance — the response interceptor below
    // would otherwise try to refresh again on a 401 and loop.
    const { data } = await axios.post(
      `${ENV_CONFIG.apiBaseUrl ?? ""}/api/auth/browser/refresh`,
      undefined,
      {
        withCredentials: true,
        headers: { [OHEALTH_CLIENT_HEADER]: OHEALTH_CLIENT_BROWSER },
      }
    );
    const access = (data?.data ?? data)?.access_token as string | undefined;
    if (!access) return null;
    setAccessToken(access);
    return access;
  } catch {
    return null;
  }
}

function handleAuthFailure() {
  clearSession();
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const status = error.response?.status;

    if (status !== 401 || !original) {
      return Promise.reject(error);
    }
    if (original._retry) {
      handleAuthFailure();
      return Promise.reject(error);
    }

    original._retry = true;

    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }
    const newToken = await refreshPromise;

    if (!newToken) {
      handleAuthFailure();
      return Promise.reject(error);
    }

    original.headers.set("Authorization", `Bearer ${newToken}`);
    return axiosInstance(original);
  }
);

export default axiosInstance;
