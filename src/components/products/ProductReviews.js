import { formatDate } from "@/lib/format";
import Rating from "./Rating";

export default function ProductReviews({ reviews }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">Reviews ({reviews.length})</h2>

      {reviews.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">No reviews yet.</p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-100">
          {reviews.map((review, index) => (
            <li key={`${review.reviewerEmail}-${index}`} className="py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-slate-900">{review.reviewerName}</p>
                <p className="text-xs text-slate-500">{formatDate(review.date)}</p>
              </div>
              <div className="mt-1">
                <Rating value={review.rating} />
              </div>
              <p className="mt-1 text-sm text-slate-700">{review.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
