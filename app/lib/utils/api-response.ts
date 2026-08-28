// app/lib/utils/api-response.ts
//
// The server wraps every response as { status_code, message, data }
// (src/common/interceptors/transform.interceptor.ts). Existing feature
// modules largely return the raw axios response body as-is, which means
// they're handing callers the envelope rather than the payload — a
// pre-existing issue this file doesn't fix outside of the auth module.

export interface ApiEnvelope<T> {
  status_code?: number;
  message?: string | null;
  data: T;
}

export function unwrapApiData<T>(envelope: ApiEnvelope<T>): T {
  return envelope.data;
}
