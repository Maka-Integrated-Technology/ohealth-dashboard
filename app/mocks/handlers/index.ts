import { appointmentHandlers } from "./appointments";
import { profileSetupHandlers } from "./profile-setup";
import { reviewsHandlers } from "./reviews";
import { chatHandlers } from "./chat";
import { patientsHandlers } from "./patients";

export const handlers = [
  ...appointmentHandlers,
  ...profileSetupHandlers,
  ...reviewsHandlers,
  ...chatHandlers,
  ...patientsHandlers,
];