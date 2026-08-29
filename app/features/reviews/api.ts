import axiosInstance from "~/lib/config/axios";
import type { Review, ReviewsResponse } from "./types";

type ProfessionalReviewResponse = {
  id: string;
  reviewer_id: string;
  rating: number;
  comment?: string | null;
  created_at: string;
};

function getInitials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "PT"
  );
}

function formatReviewDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function toReview(review: ProfessionalReviewResponse): Review {
  const patientName = "Patient";

  return {
    id: review.id,
    patientId: review.reviewer_id,
    patientName,
    patientInitials: getInitials(patientName),
    rating: review.rating,
    date: formatReviewDate(review.created_at),
    comment: review.comment ?? "",
    likes: 0,
  };
}

export const reviewsApi = {
  getReviews: async (professionalId: string): Promise<ReviewsResponse> => {
    const { data } = await axiosInstance.get<ProfessionalReviewResponse[]>(
      `/api/v1/professionals/${professionalId}/reviews`
    );
    const reviews = Array.isArray(data) ? data.map(toReview) : [];
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);

    return {
      data: reviews,
      summary: {
        averageRating:
          reviews.length > 0
            ? Number((totalRating / reviews.length).toFixed(1))
            : 0,
        totalReviews: reviews.length,
      },
    };
  },

  respondToReview: async (params: {
    id: string;
    text: string;
  }): Promise<void> => {
    await axiosInstance.post(`/api/reviews/${params.id}/respond`, {
      text: params.text,
    });
  },
};
