import { appointmentHandlers } from "./appointments";
import { earningsHandlers } from "./earnings";
import { profileSetupHandlers } from "./profile-setup";
import { reviewsHandlers } from "./reviews";

export const handlers = [
  ...appointmentHandlers,
  ...earningsHandlers,
  ...profileSetupHandlers,
  ...reviewsHandlers,
];
