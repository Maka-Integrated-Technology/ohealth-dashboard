import { isAxiosError, type AxiosError } from "axios";
import { notifyError } from "./toast";
import type { ApiErrorResponse } from "~/types/api";

export function isApiUnreachableError(error: AxiosError): boolean {
  if (error.response) return false;
  if (error.code === "ERR_CANCELED") return false;
  return true;
}

export const handleApiError = (
  error: unknown,
  customHandlers?: Record<number, () => void>
) => {
  if (!isAxiosError(error)) {
    notifyError({ message: "An unexpected error occurred. Please try again." });
    return;
  }

  if (isApiUnreachableError(error)) {
    notifyError({
      message: navigator.onLine
        ? "The service is currently unavailable. Please check back later."
        : "No internet connection. Please check your network and try again.",
    });
    return;
  }

  const status = error.response?.status;
  const errorData = error.response?.data as ApiErrorResponse;

  if (status && customHandlers?.[status]) {
    customHandlers[status]();
    return;
  }

  switch (status) {
    case 400:
      notifyError({
        message: errorData?.message || "Bad request. Please check your input.",
      });
      break;
    case 404:
      notifyError({ message: errorData?.message || "Resource not found." });
      break;
    case 429:
      notifyError({
        message: "Too many requests. Please slow down and try again.",
      });
      break;
    case 500:
      notifyError({
        message: "Server error. Please try again later.",
      });
      break;
    default:
      notifyError({
        message:
          errorData?.message ||
          "An unexpected error occurred. Please try again.",
      });
  }
};
