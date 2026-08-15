import { appointmentHandlers } from "./appointments";
import { earningsHandlers } from "./earnings";
import { profileSetupHandlers } from "./profile-setup";
import { reviewsHandlers } from "./reviews";
import { chatHandlers } from "./chat";

export const handlers = [
  ...appointmentHandlers,
  ...earningsHandlers,
  ...profileSetupHandlers,
  ...reviewsHandlers,
  ...chatHandlers,
];
