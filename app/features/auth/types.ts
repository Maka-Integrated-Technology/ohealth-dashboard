// app/features/auth/types.ts
//
// Shapes match the live legacy endpoints (ohealth-server src/modules/auth) —
// not the role-free `RegisterAccountDto`/challenge contracts, which exist as
// DTOs but aren't wired to a route yet. See docs/05-rework-plan.md step 2.

export interface SignUpPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyEmailPayload {
  email: string;
  code: string;
}

export interface ResendCodePayload {
  email: string;
}

export interface GoogleLoginPayload {
  token: string;
}

export interface AuthUserSummary {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string[];
}

export interface AuthSession {
  message?: string;
  user: AuthUserSummary;
  access_token: string;
  refresh_token: string;
  session_id?: string;
  session_expires_at?: string;
  routing_target?: string;
  access_level?: string;
  verification_status?: string | null;
}

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
