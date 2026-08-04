import axiosInstance from "~/lib/config/axios";
import type { ProfileSetupStatus } from "./types";

export const profileSetupApi = {
  getStatus: async (): Promise<ProfileSetupStatus> => {
    const { data } = await axiosInstance.get<ProfileSetupStatus>(
      "/api/profile-setup/status"
    );
    return data;
  },
};
