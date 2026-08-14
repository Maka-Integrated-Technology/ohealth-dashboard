// app/features/auth/types.ts
export interface SignUpPayload {
  email: string;
  password: string;
}

// TODO(confirm-schema): assumed shape — signup likely just confirms the
// account was created and where the verification code was sent. Adjust
// once the actual /auth/signup response is confirmed in Swagger.
export interface SignUpResponse {
  email: string;
}

// TODO(confirm-schema): assumed login is password-based and, like signup,
// triggers a one-time code sent to the user's email rather than returning
// tokens directly — inferred from the "Welcome back!" -> "Check your email"
// Figma flow. Confirm actual /auth/login response once Swagger is updated.
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  email: string;
}

export interface VerifyEmailPayload {
  email: string;
  code: string;
}

export interface ResendCodePayload {
  email: string;
}

// TODO(confirm-schema): assumed Google login sends the ID token obtained
// from Google's OAuth client on the frontend. Confirm the exact field name
// / whether an authorization code flow is expected instead.
export interface GoogleLoginPayload {
  idToken: string;
}

// TODO(confirm-schema): assumed auth response shape — access token +
// refresh token is the common pattern given /auth/refresh exists.
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isVerified: boolean;
}
