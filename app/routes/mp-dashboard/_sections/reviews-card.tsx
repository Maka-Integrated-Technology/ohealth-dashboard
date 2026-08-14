import { useState } from "react";
import { ThumbsUp, Star } from "lucide-react";
import { Link } from "react-router";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { useReviews, useRespondToReview } from "~/features/reviews/hook";
import type { Review } from "~/features/reviews/types";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={
            i < rating
              ? "size-3.5 fill-amber-400 text-amber-400"
              : "text-muted-foreground/30 size-3.5"
          }
        />
      ))}
    </div>
  );
}

function ReviewRow({ review }: { review: Review }) {
  const [responding, setResponding] = useState(false);
  const [draft, setDraft] = useState("");
  const { mutateAsync: respond, isPending } = useRespondToReview();

  async function handleSend() {
    if (!draft.trim()) return;
    await respond({ id: review.id, text: draft.trim() });
    setResponding(false);
    setDraft("");
  }

  return (
    <div className="border-border border-b py-4 last:border-b-0">
      <div className="flex items-start gap-3">
        <Avatar className="size-9 shrink-0">
          <AvatarFallback className="bg-blue-100 text-sm font-semibold text-blue-700">
            {review.patientInitials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-foreground text-sm font-semibold">
              {review.patientName}
            </p>
            <span className="text-muted-foreground text-xs">{review.date}</span>
          </div>
          <StarRating rating={review.rating} />
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            {review.comment}
          </p>

          <div className="mt-2 flex items-center gap-4">
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              <ThumbsUp className="size-3.5" />
              {review.likes}
            </span>
            {!review.response && !responding && (
              <button
                type="button"
                onClick={() => setResponding(true)}
                className="text-xs font-medium text-blue-600 hover:underline"
              >
                Respond
              </button>
            )}
          </div>

          {responding && (
            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Write a response..."
                className="border-input bg-input-background placeholder:text-muted-foreground focus:ring-ring/50 flex-1 rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              />
              <Button size="sm" isLoading={isPending} onClick={handleSend}>
                Send
              </Button>
            </div>
          )}

          {review.response && (
            <div className="border-border border-l-primary bg-muted mt-3 rounded-lg border-l-2 p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-foreground text-xs font-semibold">
                  My Response
                </span>
                <span className="text-muted-foreground text-xs">
                  {review.response.date}
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {review.response.text}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ReviewsCard() {
  const { data, isLoading, isError } = useReviews();

  if (isLoading) {
    return (
      <div className="border-border bg-card rounded-[20px] border p-6 shadow-sm">
        <Skeleton className="mb-4 h-4 w-40" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="mb-3 h-20 w-full" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="border-border bg-card rounded-[20px] border p-6 shadow-sm">
        <p className="text-muted-foreground text-sm">Failed to load reviews.</p>
      </div>
    );
  }

  const preview = data.data.slice(0, 3);

  return (
    <div className="border-border bg-card rounded-[20px] border p-6 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-foreground text-sm font-semibold">My Reviews</h2>
          <span className="text-muted-foreground flex items-center gap-1 text-sm">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            {data.summary.averageRating} ({data.summary.totalReviews})
          </span>
        </div>

        <Link
          to="/reviews"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          See all reviews
        </Link>
      </div>

      <div>
        {preview.map((review) => (
          <ReviewRow key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
