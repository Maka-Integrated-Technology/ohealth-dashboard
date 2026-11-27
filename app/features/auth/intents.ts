// app/features/auth/intents.ts
//
// Canonical self-service signup intents. These values are the closed set
// settled by the backend (Ohealth-be #126 / PR #129) and published in the
// generated contract (`SignupIntent` in contracts/openapi.json). The signup
// account-type selector must expose exactly this set and send these exact
// values — no generic `organization` intent, no client-invented subtypes.
import { User, Stethoscope, Pill, FlaskConical, Hospital } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const SIGNUP_INTENTS = [
  "patient",
  "healthcare_professional",
  "pharmacy",
  "laboratory",
  "hospital",
] as const;

export type SignupIntent = (typeof SIGNUP_INTENTS)[number];

export function isSignupIntent(value: unknown): value is SignupIntent {
  return (
    typeof value === "string" &&
    (SIGNUP_INTENTS as readonly string[]).includes(value)
  );
}

export interface SignupIntentOption {
  intent: SignupIntent;
  label: string;
  icon: LucideIcon;
}

// Labels are the canonical display strings from the issue (#74); order follows
// the design's "Join OHealth+" frame (patient-first self-service funnel).
export const SIGNUP_INTENT_OPTIONS: readonly SignupIntentOption[] = [
  { intent: "patient", label: "Patient", icon: User },
  {
    intent: "healthcare_professional",
    label: "Healthcare Professional",
    icon: Stethoscope,
  },
  { intent: "pharmacy", label: "Pharmacy", icon: Pill },
  { intent: "laboratory", label: "Laboratory", icon: FlaskConical },
  { intent: "hospital", label: "Hospital", icon: Hospital },
];
