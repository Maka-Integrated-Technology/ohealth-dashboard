import { appointmentHandlers } from "./appointments";
import { profileSetupHandlers } from "./profile-setup";
import { reviewsHandlers } from "./reviews";

export const handlers = [...appointmentHandlers, ...profileSetupHandlers, ...reviewsHandlers];
