// app/features/auth/challenge-nav.ts
//
// In-memory navigation state carrying a pre-session challenge handle between
// the signup form and the verify-email screen. The opaque `challenge_id`
// travels in router state (never the URL or logs); a direct visit without it
// is redirected back to the start of the flow.

export interface VerifyEmailState {
  challengeId: string;
  /** Known for password signup; absent for Google contact verification. */
  email?: string;
  resendAfterSeconds: number;
  deliveryTarget?: string;
}
