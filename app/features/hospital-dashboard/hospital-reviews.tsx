import {
  Check,
  MessageSquareText,
  Send,
  ShieldAlert,
  Star,
  X,
} from "lucide-react";
import { useState } from "react";

type HospitalReview = {
  id: string;
  initials: string;
  patient: string;
  date: string;
  department: string;
  doctor: string;
  rating: number;
  comment: string;
  response?: string;
};

const initialReviews: HospitalReview[] = [
  {
    id: "review-john",
    initials: "JD",
    patient: "John Doe",
    date: "2024-12-15",
    department: "Cardiology",
    doctor: "Dr. Sarah Chen",
    rating: 5,
    comment:
      "Outstanding care from Dr. Chen. She explained everything clearly and made me feel comfortable throughout my visit. Highly recommended!",
  },
  {
    id: "review-maria",
    initials: "MS",
    patient: "Maria Santos",
    date: "2024-12-12",
    department: "Pediatrics",
    doctor: "Dr. Emily Rodriguez",
    rating: 4,
    comment:
      "Very good experience overall. The wait time was a bit long but the consultation itself was excellent. Dr. Rodriguez was wonderful with my son.",
    response:
      "Thank you for your kind feedback, Maria. We are working on improving our wait times. We are glad Dr. Rodriguez could provide excellent care for your son.",
  },
  {
    id: "review-david",
    initials: "DL",
    patient: "David Lee",
    date: "2024-12-10",
    department: "Neurology",
    doctor: "Dr. James Wilson",
    rating: 5,
    comment:
      "Dr. Wilson is incredibly knowledgeable and compassionate. He spent 45 minutes with me and created a comprehensive treatment plan. Highly recommended.",
  },
  {
    id: "review-emma",
    initials: "EW",
    patient: "Emma Williams",
    date: "2024-12-08",
    department: "Cardiology",
    doctor: "Dr. Sarah Chen",
    rating: 3,
    comment:
      "The facility is clean and modern but the appointment scheduling could be better. Had to wait over an hour past my scheduled time.",
  },
  {
    id: "review-carlos",
    initials: "CM",
    patient: "Carlos Martinez",
    date: "2024-12-05",
    department: "General Medicine",
    doctor: "Dr. Robert Kim",
    rating: 4,
    comment:
      "Good experience. Dr. Kim was thorough and the staff was friendly. Would have given 5 stars but parking was very difficult.",
    response:
      "Thank you for your feedback, Carlos! We appreciate your kind words about Dr. Kim and our staff. We are actively working on improving parking accessibility for our patients.",
  },
  {
    id: "review-priya",
    initials: "PS",
    patient: "Priya Sharma",
    date: "2024-12-01",
    department: "Dermatology",
    doctor: "Dr. Aisha Thompson",
    rating: 5,
    comment:
      "First time visiting and I was extremely impressed. Dr. Thompson was professional, thorough, and made me feel completely at ease. The facility is beautiful.",
  },
];

function StarRating({
  rating,
  size = "size-5",
}: {
  rating: number;
  size?: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={`${size} ${index < rating ? "fill-[#f5b700] text-[#f5b700]" : "fill-[#e5e7eb] text-[#e5e7eb]"}`}
        />
      ))}
    </span>
  );
}

export default function HospitalReviews() {
  const [reviews, setReviews] = useState(initialReviews);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [notice, setNotice] = useState("");
  const count = reviews.length;
  const average = (
    reviews.reduce((total, review) => total + review.rating, 0) / count
  ).toFixed(1);
  const responded = reviews.filter((review) => Boolean(review.response)).length;
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((review) => review.rating === stars).length,
  }));

  const beginReply = (id: string) => {
    setReplyingTo(id);
    setReplyText("");
    setNotice("");
  };
  const publishPreview = (id: string) => {
    const trimmed = replyText.trim();
    if (!trimmed) return;
    setReviews((current) =>
      current.map((review) =>
        review.id === id ? { ...review, response: trimmed } : review
      )
    );
    setReplyingTo(null);
    setReplyText("");
    setNotice(
      "Response saved to this local preview only. No public review response was published."
    );
  };

  return (
    <div className="mx-auto w-full max-w-[1090px] pb-14">
      <div className="mb-8 flex max-w-[883px] items-start gap-3 rounded-xl border border-[#fef0c7] bg-[#fffaeb] px-4 py-3">
        <ShieldAlert className="mt-0.5 size-5 shrink-0 text-[#b54708]" />
        <div>
          <p className="text-sm font-semibold text-[#92400e]">Under Review</p>
          <p className="text-xs leading-5 text-[#b54708]">
            OHealth is currently reviewing your submitted documents — Figma
            preview status only.
          </p>
        </div>
      </div>
      <h2 className="mb-6 text-[25px] font-semibold text-[#1f2a37]">
        Reviews and Ratings
      </h2>
      <section
        className="mb-8 grid gap-6 rounded-[20px] border border-[#f1f5f9] bg-white p-6 sm:grid-cols-[240px_minmax(0,1fr)_168px] sm:p-8"
        aria-label="Rating summary"
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="text-[52px] leading-none font-bold text-[#1f2a37]">
            {average}
          </span>
          <StarRating rating={5} size="size-[22px]" />
          <span className="text-[15px] text-[#6c737f]">{count} reviews</span>
        </div>
        <div className="space-y-3">
          {distribution.map(({ stars, count: starCount }) => (
            <div
              key={stars}
              className="flex items-center gap-3 text-sm text-[#4d5761]"
            >
              <span className="w-3 text-right">{stars}</span>
              <Star className="size-4 fill-[#f5b700] text-[#f5b700]" />
              <div className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[#f1f5f9]">
                <div
                  className="h-full rounded-full bg-[#f5b700]"
                  style={{ width: `${(starCount / count) * 100}%` }}
                />
              </div>
              <span className="w-5 text-right text-[#6c737f]">{starCount}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-row justify-center gap-3 sm:flex-col">
          <div className="flex min-w-0 flex-1 flex-col items-center rounded-xl bg-[#ecfdf3] px-4 py-3 text-center">
            <span className="font-semibold text-[#007a55]">
              {responded}/{count}
            </span>
            <span className="text-[13px] text-[#096]">Responded</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-center rounded-xl bg-[#fffbeb] px-4 py-3 text-center">
            <span className="font-semibold text-[#bb4d00]">
              {count - responded}
            </span>
            <span className="text-[13px] text-[#e17100]">Awaiting Reply</span>
          </div>
        </div>
      </section>
      {notice ? (
        <p
          role="status"
          className="mb-5 rounded-xl bg-[#eff4ff] p-4 text-sm text-[#155eef]"
        >
          {notice}
        </p>
      ) : null}
      <div className="space-y-[14px]">
        {reviews.map((review) => (
          <article
            key={review.id}
            className="rounded-[19px] border border-[#f1f5f9] bg-white p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#0891b2] font-semibold text-white">
                  {review.initials}
                </div>
                <div>
                  <h3 className="text-[18px] font-semibold text-[#1f2a37]">
                    {review.patient}
                  </h3>
                  <p className="mt-1 text-[14px] text-[#90a1b9]">
                    {review.date}
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <StarRating rating={review.rating} />
                <p className="mt-2 text-[14px] text-[#6c737f]">
                  {review.department}
                </p>
                <p className="mt-1 text-[13px] text-[#90a1b9]">
                  {review.doctor}
                </p>
              </div>
            </div>
            <p className="mt-4 text-[17px] leading-7 text-[#45556c]">
              {review.comment}
            </p>
            {review.response ? (
              <div className="mt-4 rounded-[14px] border border-[#cefafe] bg-[#ecfeff] p-4">
                <p className="text-[13px] font-semibold text-[#0092b8]">
                  Hospital Response
                </p>
                <p className="mt-1 text-[15px] leading-6 text-[#005f78]">
                  {review.response}
                </p>
              </div>
            ) : replyingTo === review.id ? (
              <div className="mt-5 rounded-[14px] border border-[#e2e8f0] bg-[#f8fafc] p-4">
                <label
                  htmlFor={`review-response-${review.id}`}
                  className="mb-2 block text-sm font-semibold text-[#1f2a37]"
                >
                  Respond to this review
                </label>
                <textarea
                  id={`review-response-${review.id}`}
                  rows={4}
                  maxLength={1500}
                  value={replyText}
                  onChange={(event) => setReplyText(event.target.value)}
                  placeholder="Write a thoughtful response to this patient's review..."
                  className="w-full resize-y rounded-xl border border-[#d2d6db] bg-white p-3 text-[15px] text-[#1f2a37] outline-none focus:border-[#155eef]"
                />
                <div className="mt-3 flex flex-wrap justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyText("");
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#d2d6db] px-4 py-2.5 text-sm font-medium text-[#4d5761]"
                  >
                    <X className="size-4" />
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!replyText.trim()}
                    onClick={() => publishPreview(review.id)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#155eef] px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send className="size-4" />
                    Publish Response
                  </button>
                </div>
                <p className="mt-3 text-xs text-[#6c737f]">
                  Preview only — no response is published publicly.
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => beginReply(review.id)}
                className="mt-4 inline-flex items-center gap-2 text-[15px] font-medium text-[#0092b8] hover:underline"
              >
                <MessageSquareText className="size-4" />
                Respond to this review
              </button>
            )}
          </article>
        ))}
      </div>
      <p className="mt-5 inline-flex items-center gap-2 text-xs text-[#90a1b9]">
        <Check className="size-4" />
        Six example reviews reproduced from Figma; no live review service is
        connected.
      </p>
    </div>
  );
}
