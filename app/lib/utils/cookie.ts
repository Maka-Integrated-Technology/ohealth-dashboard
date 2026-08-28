import Cookies from "universal-cookie";

const cookies = new Cookies();

export const getCookie = (key: string): string | undefined => {
  return cookies.get(key);
};

export const hasCookie = (key: string): boolean => {
  return cookies.get(key) !== undefined;
};

export const setCookie = (
  key: string,
  value: string,
  options?: { maxAgeSeconds?: number }
): void => {
  cookies.set(key, value, {
    path: "/",
    sameSite: "lax",
    secure: window.location.protocol === "https:",
    maxAge: options?.maxAgeSeconds,
  });
};

export const removeCookie = (key: string): void => {
  cookies.remove(key, { path: "/" });
};
