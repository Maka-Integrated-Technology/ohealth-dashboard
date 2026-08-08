import { delay, http, HttpResponse } from "msw";
import type { Review, ReviewsResponse } from "~/features/reviews/types";

const reviews: Review[] = [
  {
    id: "rev-001",
    patientId: "pat-201",
    patientName: "John Adam",
    patientInitials: "JA",
    rating: 5,
    date: "May 25, 2026",
    comment:
      "Dr. Johnson was incredibly patient and took the time to explain my diagnosis in a way I could easily understand. The consultation was smooth, and I felt reassured throughout.",
    likes: 0,
  },
  {
    id: "rev-002",
    patientId: "pat-202",
    patientName: "Alice Brown",
    patientInitials: "AB",
    rating: 5,
    date: "June 10, 2026",
    comment:
      "Dr. Jane Marshal provided a thorough examination and offered several treatment options that fit my needs. I appreciated the friendly atmosphere of the office.",
    likes: 2,
    response: {
      text: "Thank you for your feedback, Alice. I'm pleased to hear that you felt comfortable and well-informed during your visit.",
      date: "June 11, 2026",
    },
  },
  {
    id: "rev-003",
    patientId: "pat-203",
    patientName: "Charlie Miller",
    patientInitials: "CM",
    rating: 5,
    date: "July 15, 2026",
    comment:
      "The consultation was very professional. Dr. Jane Marshal listened carefully to my questions and answered them in detail, which I found very helpful.",
    likes: 1,
    response: {
      text: "Thank you, Charlie. I'm glad the communication was helpful for you. Feel free to reach out anytime!",
      date: "July 16, 2026",
    },
  },
  {
    id: "rev-004",
    patientId: "pat-204",
    patientName: "Diana Turner",
    patientInitials: "DT",
    rating: 5,
    date: "August 5, 2026",
    comment:
      "I had a great experience with Dr. Jane Marshal. The office staff was welcoming, and the doctor was very attentive. I left feeling confident in my health care plan.",
    likes: 4,
    response: {
      text: "Thank you, Diana! I appreciate your positive feedback and am here to support you on your health journey.",
      date: "August 6, 2026",
    },
  },
  {
    id: "rev-005",
    patientId: "pat-205",
    patientName: "Ethan Frank",
    patientInitials: "EF",
    rating: 5,
    date: "September 22, 2026",
    comment:
      "Dr. Jane Marshal was knowledgeable and made sure I understood everything. The follow-up plan was clear, and I felt well taken care of.",
    likes: 0,
    response: {
      text: "Thanks, Ethan! It's wonderful to hear that you felt informed and cared for. Don't hesitate to come back if you have more questions.",
      date: "September 23, 2026",
    },
  },
  {
    id: "rev-006",
    patientId: "pat-206",
    patientName: "Grace Hall",
    patientInitials: "GH",
    rating: 5,
    date: "October 10, 2026",
    comment:
      "I was impressed by Dr. Jane Marshal's dedication. My concerns were addressed thoroughly, and I felt valued as a patient during the entire process.",
    likes: 1,
    response: {
      text: "Thank you, Grace! Your appreciation means a lot, and I'm here to assist you whenever needed.",
      date: "October 11, 2026",
    },
  },
];

function computeSummary() {
  const totalReviews = reviews.length;
  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
  return { averageRating: Number(averageRating.toFixed(1)), totalReviews };
}

const MOCK_NETWORK_DELAY_MS = 500;

export const reviewsHandlers = [
  http.get("/api/reviews", async () => {
    await delay(MOCK_NETWORK_DELAY_MS);
    return HttpResponse.json<ReviewsResponse>({
      data: reviews,
      summary: computeSummary(),
    });
  }),

  http.post("/api/reviews/:id/respond", async ({ params, request }) => {
    await delay(MOCK_NETWORK_DELAY_MS);
    const body = (await request.json()) as { text: string };
    const review = reviews.find((r) => r.id === params.id);
    if (review) {
      review.response = {
        text: body.text,
        date: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      };
    }
    return HttpResponse.json({ success: true });
  }),
];