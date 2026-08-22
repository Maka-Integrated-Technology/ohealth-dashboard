import { appointmentHandlers } from "./appointments";
import { earningsHandlers } from "./earnings";
import { profileSetupHandlers } from "./profile-setup";
import { reviewsHandlers } from "./reviews";
import { chatHandlers } from "./chat";
import { patientsHandlers } from "./patients";
import { availabilityHandlers } from "./availability";

export const handlers = [
  ...appointmentHandlers,
  ...earningsHandlers,
  ...profileSetupHandlers,
  ...reviewsHandlers,
  ...chatHandlers,
  ...patientsHandlers,
  ...availabilityHandlers,
];
