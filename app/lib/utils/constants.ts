// `import.meta.env` is injected by Vite in dev/build; fall back to an empty
// object so modules importing this remain usable under the node test runner.
const env = (import.meta.env ?? {}) as Record<string, string | undefined>;

export const ENV_CONFIG = {
  apiBaseUrl: env.VITE_API_BASE_URL,
  googleClientId: env.VITE_GOOGLE_CLIENT_ID,
};

export const BREAKPOINT_1024 = 1024;
export const BREAKPOINT_768 = 768;
export const BREAKPOINT_545 = 545;
