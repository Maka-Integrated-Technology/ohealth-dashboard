import { appointmentHandlers } from "./appointments";
import { profileSetupHandlers } from "./profile-setup";

export const handlers = [...appointmentHandlers, ...profileSetupHandlers];
