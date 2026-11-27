// app/features/auth/types.ts
//
// Shapes match the canonical challenge contract published by the backend
// (Ohealth-be #137 / PR #150) in contracts/openapi.json. Registration and
// login are now pre-session challenges: the server returns an opaque
// `challenge_id` with cooldown/expiry, and tokens are issued only after a
// verified code (`/verify`, `/login/verify`). See #77.
import type { SignupIntent } from "./intents";

// ---------------------------------------------------------------------------
// Registration bootstrap (Ohealth-be #136)
// ---------------------------------------------------------------------------

export interface RegistrationBootstrapLegalDocument {
  document_type: string;
  version: string;
}

export interface RegistrationBootstrapIntent {
  intent: SignupIntent;
  label: string;
}

export interface RegistrationBootstrap {
  intents: RegistrationBootstrapIntent[];
  terms: RegistrationBootstrapLegalDocument;
  privacy: RegistrationBootstrapLegalDocument;
}

// ---------------------------------------------------------------------------
// Challenge continuation
// ---------------------------------------------------------------------------

/** A pending pre-session challenge the client must continue with a code. */
export interface AuthChallenge {
  challenge_id: string;
  expires_in_seconds: number;
  resend_after_seconds: number;
  /** Masked destination (e.g. "j•••@example.com"); present on signup. */
  delivery_target?: string;
}

/** Returned when login requires a second factor before a session is issued. */
export interface MfaChallenge {
  mfa_challenge_id: string;
  expires_in_seconds: number;
}

// ---------------------------------------------------------------------------
// Request payloads
// ---------------------------------------------------------------------------

export interface ProfessionalSignupPayload {
  intent: SignupIntent;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  accepted_terms_version: string;
  accepted_privacy_version: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyChallengePayload {
  challenge_id: string;
  code: string;
}

export interface ResetPasswordPayload {
  challenge_id: string;
  code: string;
  newPassword: string;
}

export interface GoogleLoginPayload {
  token: string;
}

// ---------------------------------------------------------------------------
// Session (token transport stays cookie-based here; #78 migrates it to the
// backend-managed HttpOnly browser session)
// ---------------------------------------------------------------------------

export interface AuthSessionTokens {
  access_token: string;
  refresh_token: string;
  session_id: string;
  session_expires_at: string;
}

/** `/login/verify` resolves to either a session or an MFA challenge. */
export type LoginVerifyResult =
  | { kind: "session"; session: AuthSessionTokens }
  | { kind: "mfa"; mfa: MfaChallenge };

export interface AuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  middle_name?: string | null;
  role: string[];
  gender?: string | null;
  dob?: string | null;
  phone?: string | null;
  country?: string | null;
  image?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
