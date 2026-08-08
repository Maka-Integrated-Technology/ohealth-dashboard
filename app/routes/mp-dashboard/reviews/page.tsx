import { Star } from "lucide-react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import { useReviews } from "~/features/reviews/hook";
import { ReviewRow } from "../_sections/review-row";

export default function ReviewsPage() {
  const { data, isLoading, isError } = useReviews();

  return (
    <div className="bg-background min-h-screen p-6 lg:p-8">
      <div className="mx-auto w-full max-w-350">
        <div className="text-muted-foreground mb-4 flex items-center gap-1 text-sm">
          <Link to="/" className="hover:text-foreground hover:underline">
            Dashboard
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground">All Reviews</span>
        </div>

        <div className="border-border bg-card rounded-[20px] border p-6 shadow-sm">
          {isLoading && (
            <>
              <Skeleton className="mb-6 h-6 w-48" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="mb-4 h-24 w-full" />
              ))}
            </>
          )}

          {isError && (
            <p className="text-muted-foreground text-sm">
              Failed to load reviews.
            </p>
          )}

          {data && (
            <>
              <div className="mb-2 flex items-center gap-2">
                <h1 className="text-foreground text-lg font-semibold">
                  My Reviews
                </h1>
                <span className="text-muted-foreground flex items-center gap-1 text-sm">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  {data.summary.averageRating} ({data.summary.totalReviews})
                </span>
              </div>

              <div>
                {data.data.map((review) => (
                  <ReviewRow key={review.id} review={review} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
