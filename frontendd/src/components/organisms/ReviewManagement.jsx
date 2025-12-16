// ===========================================
// ReviewManagement.jsx (Redux Version)
// -------------------------------------------
// Admin dashboard component for moderating user reviews.
// Uses Redux + GraphQL.
// ===========================================

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchReviewsAsync, deleteReviewAsync } from "../../store/reviews/reviewsSlice";

import { Star, Search, Trash2, Film, User, MessageSquare } from "lucide-react";

export function ReviewManagement() {
  const dispatch = useDispatch();
  const { data: reviews, status, error } = useSelector((state) => state.reviews);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchReviewsAsync());
  }, [dispatch]);

  const filteredReviews = useMemo(() => {
    const q = (searchQuery || "").trim().toLowerCase();
    const list = Array.isArray(reviews) ? reviews : [];
    if (!q) return list;

    return list.filter((r) => {
      const haystack = [
        r.review_text,
        r.movie?.title,
        r.user?.email,
        String(r.rating ?? ""),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [reviews, searchQuery]);

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await dispatch(deleteReviewAsync(id)).unwrap();
    } catch (e) {
      console.error("Delete review failed:", e);
    }
  };

  return (
    <div className="p-6 bg-gray-950 text-white rounded-xl shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-red-500" />
          <h2 className="text-2xl font-bold">Review Management</h2>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by text, movie title, or user email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-500"
        />
      </div>

      {/* Error */}
      {status === "failed" && (
        <div className="mb-6 bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error || "Failed to load reviews."}
        </div>
      )}

      {/* Loading */}
      {status === "loading" && (
        <div className="flex justify-center py-10 text-gray-400">Loading reviews...</div>
      )}

      {/* List */}
      {status === "succeeded" && (
        <div className="grid gap-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-900 border border-gray-800 hover:border-red-600 rounded-lg p-6 transition-all"
              >
                <div className="flex items-start justify-between">
                  {/* Left */}
                  <div className="flex-1">
                    {/* Movie + rating */}
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="flex items-center space-x-2">
                        <Film className="w-4 h-4 text-red-500" />
                        <span className="font-semibold text-white">
                          {review.movie?.title || "Unknown Movie"}
                        </span>
                      </div>

                      {Number.isFinite(Number(review.rating)) && (
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Number(review.rating)
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* User */}
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{review.user?.email || "No user linked"}</span>
                      </div>
                    </div>

                    {/* Text */}
                    <p className="text-gray-300">{review.review_text || "No review text."}</p>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="ml-4 p-2 bg-red-900 hover:bg-red-800 text-white rounded-lg transition"
                    title="Delete review"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Star className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500">No reviews found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
