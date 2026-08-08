export interface Review {
  id: string;
  patientId: string;
  patientName: string;
  patientInitials: string;
  rating: number;
  date: string;
  comment: string;
  likes: number;
  response?: {
    text: string;
    date: string;
  }
}

export interface ReviewsSummary {
  averageRating: number;
  totalReviews: number;
}

export interface ReviewsResponse {
  data: Review[];
  summary: ReviewsSummary;
}