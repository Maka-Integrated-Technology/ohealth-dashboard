import Cookies from "universal-cookie";

const cookies = new Cookies();

export const getCookie = (key: string): string | undefined => {
  return cookies.get(key);
};

export const hasCookie = (key: string): boolean => {
  return cookies.get(key) !== undefined;
};
