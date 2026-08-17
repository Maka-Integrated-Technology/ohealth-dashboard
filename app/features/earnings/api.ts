import axiosInstance from "~/lib/config/axios";
import type { EarningsResponse } from "./types";

export const earningsApi = {
  getEarnings: async (): Promise<EarningsResponse> => {
    const { data } = await axiosInstance.get<EarningsResponse>("/api/earnings");
    return data;
  },
};
