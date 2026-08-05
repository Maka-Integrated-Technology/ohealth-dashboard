import axiosInstance from "~/lib/config/axios";
import { buildQueryString } from "~/lib/utils/helpers";
import type { PaginatedResponse } from "~/types/api";
import type { ExampleItem, ExampleListParams } from "./types";

export const exampleApi = {
  list: async (
    params: ExampleListParams
  ): Promise<PaginatedResponse<ExampleItem>> => {
    const { data } = await axiosInstance.get(
      `/api/example${buildQueryString(params as Record<string, string | number | undefined>)}`
    );
    return data;
  },

  getById: async (id: number): Promise<ExampleItem> => {
    const { data } = await axiosInstance.get(`/api/example/${id}`);
    return data;
  },
};
