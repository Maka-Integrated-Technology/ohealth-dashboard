import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import axiosRetry from "axios-retry";
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  saveSession,
} from "~/lib/auth/session";
import { ENV_CONFIG } from "~/lib/utils/constants";

const axiosInstance = axios.create({
  baseURL: ENV_CONFIG.apiBaseUrl ?? "",
  headers: {
    "Content-Type": "application/json",
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

// Single-flight refresh: concurrent 401s share one refresh call instead of
// each firing their own. Resolves to the new access token, or null if
// refresh is impossible or was itself rejected.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refresh_token = getRefreshToken();
  if (!refresh_token) return null;

  try {
    // A bare axios call, not axiosInstance — the request interceptor would
    // attach the (expired) access token and the response interceptor below
    // would try to refresh again on a 401, looping.
    const { data } = await axios.post(
      `${ENV_CONFIG.apiBaseUrl ?? ""}/api/auth/refresh`,
      { refresh_token }
    );
    const payload = data?.data ?? data;
    const access = payload?.access_token as string | undefined;
    const refresh = payload?.refresh_token as string | undefined;
    const sessionId = payload?.session_id as string | undefined;

    if (!access || !refresh) return null;

    saveSession({ accessToken: access, refreshToken: refresh, sessionId });
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
