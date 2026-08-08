import axiosInstance from "~/lib/config/axios";
import type { ReviewsResponse } from "./types";

export const reviewsApi = {
  getReviews: async (): Promise<ReviewsResponse> => {
    const {data} = await axiosInstance.get<ReviewsResponse>("/api/reviews")
    return data
  },

  respondToReview: async (params: {
    id: string;
    text: string;
  }): Promise<void> => {
    await axiosInstance.post(`/api/reviews/${params.id}/respond`, {
      text: params.text,
    })
  }
}