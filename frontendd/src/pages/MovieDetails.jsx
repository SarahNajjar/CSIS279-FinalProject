// ===========================================
// MovieDetails.jsx (REDUX + TOXIC ALERT + AVG RATING FROM REVIEWS)
// ===========================================

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Star,
  Clock,
  Calendar,
  User as UserIcon,
  ThumbsUp,
  Trash2,
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import { useParams, useNavigate } from "react-router-dom";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { fetchMovieByIdAsync } from "../store/movies/moviesSlice";
import {
  fetchReviewsByMovieAsync,
  submitReviewAsync,
  deleteReviewAsync,
} from "../store/reviews/reviewsSlice";
import {
  fetchWatchlistAsync,
  toggleWatchlistAsync,
} from "../store/watchlist/watchlistSlice";

import { selectAuthUser } from "../store/auth/authSlice";

function getYouTubeId(input) {
  if (!input) return null;

  // If stored only the ID (11 chars)
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;

  try {
    const url = new URL(input);

    if (url.hostname.includes("youtu.be")) return url.pathname.replace("/", "");
    if (url.hostname.includes("youtube.com")) return url.searchParams.get("v");

    return null;
  } catch {
    return null;
  }
}

// Normalize errors into a readable string
function extractErrorMessage(err, fallback = "Failed to submit review") {
  if (!err) return fallback;
  if (typeof err === "string") return err;

  // RTK rejectWithValue payload
  if (err?.payload) {
    if (typeof err.payload === "string") return err.payload;
    if (err.payload?.message) return String(err.payload.message);
  }

  if (err?.message) return String(err.message);
  if (err?.error?.message) return String(err.error.message);

  return fallback;
}

export function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const user = useSelector(selectAuthUser);
  const profileId = user?.profile_id || user?.id || null;

  const { selectedMovie, status: movieStatus } = useSelector(
    (state) => state.movies
  );

  const reviewsRaw = useSelector((state) => state.reviews?.data);
  const watchlistRaw = useSelector((state) => state.watchlist?.data);

  const reviews = useMemo(
    () => (Array.isArray(reviewsRaw) ? reviewsRaw : []),
    [reviewsRaw]
  );

  const watchlist = useMemo(
    () => (Array.isArray(watchlistRaw) ? watchlistRaw : []),
    [watchlistRaw]
  );

  // Local state
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [likedReviews, setLikedReviews] = useState(new Set());

  // Toxicity / backend reject message
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ===========================================
  // Load Movie, Reviews, Watchlist
  // ===========================================
  useEffect(() => {
    if (!id) return;

    dispatch(fetchMovieByIdAsync(id));
    dispatch(fetchReviewsByMovieAsync(id));

    if (profileId) dispatch(fetchWatchlistAsync(profileId));
  }, [id, profileId, dispatch]);

  // ===========================================
  // Compute average rating from reviews
  // ===========================================
  const averageRating = useMemo(() => {
    const nums = reviews
      .map((r) => Number(r?.rating))
      .filter((n) => Number.isFinite(n) && n > 0);

    if (!nums.length) return null;

    const sum = nums.reduce((a, b) => a + b, 0);
    return sum / nums.length;
  }, [reviews]);

  // ===========================================
  // Check if watchlist contains movie
  // ===========================================
  const isInWatchlist = useCallback(() => {
    const movieIdNum = Number(id);
    if (!Number.isFinite(movieIdNum)) return false;

    return watchlist.some((item) => {
      const mid = Number(item?.movie_id);
      const iid = Number(item?.id);
      return mid === movieIdNum || iid === movieIdNum;
    });
  }, [watchlist, id]);

  // ===========================================
  // Rating
  // ===========================================
  const handleRating = (rating) => {
    if (!profileId) return;

    const movieIdNum = Number(id);
    if (!Number.isFinite(movieIdNum)) return;

    setUserRating(rating);
    setSubmitError("");
  };

  // ===========================================
  // Submit Review (catches toxicity block)
  // ===========================================
  const handleReviewSubmit = async () => {
    if (!profileId) return;

    const movieIdNum = Number(id);
    if (!Number.isFinite(movieIdNum)) return;

    if (!userReview.trim() || !userRating) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const actionPromise = dispatch(
        submitReviewAsync({
          profile_id: Number(profileId),
          movie_id: movieIdNum,
          review_text: userReview.trim(),
          rating: Number(userRating),
        })
      );

      // If using RTK createAsyncThunk
      if (actionPromise?.unwrap) {
        await actionPromise.unwrap();
      } else {
        // Fallback
        const res = await actionPromise;

        if (res?.meta?.requestStatus === "rejected") {
          throw res?.payload || res?.error || new Error("Request rejected");
        }
        if (res?.error) throw res.error;
      }

      // Success
      setUserReview("");
      setUserRating(0);

      dispatch(fetchReviewsByMovieAsync(movieIdNum));
      dispatch(fetchMovieByIdAsync(movieIdNum));
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to submit review");
      setSubmitError(msg);

      // Optional immediate popup
      window.alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ===========================================
  // Delete Review
  // ===========================================
  const handleDeleteReview = (reviewId) => {
    dispatch(deleteReviewAsync(reviewId)).then(() => {
      dispatch(fetchReviewsByMovieAsync(id));
      dispatch(fetchMovieByIdAsync(id));
    });
  };

  // ===========================================
  // Toggle Watchlist
  // ===========================================
  const handleToggleWatchlist = () => {
    if (!profileId) return;

    dispatch(toggleWatchlistAsync({ profileId, movieId: Number(id) })).then(
      () => {
        dispatch(fetchWatchlistAsync(profileId));
      }
    );
  };

  // ===========================================
  // Loading
  // ===========================================
  if (movieStatus === "loading" || !selectedMovie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
      </div>
    );
  }

  const movie = {
    ...selectedMovie,
    poster_path: selectedMovie.poster_path
      ? `http://localhost:4000${selectedMovie.poster_path}`
      : null,
  };

  const trailerId = getYouTubeId(selectedMovie?.trailer_path);
  const trailerEmbedUrl = trailerId
    ? `https://www.youtube.com/embed/${trailerId}`
    : null;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-300 hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* POSTER */}
          <div className="md:w-1/3">
            {movie.poster_path ? (
              <img
                src={movie.poster_path}
                alt={movie.title}
                className="rounded-xl shadow-2xl w-full"
              />
            ) : (
              <div className="w-full aspect-[2/3] rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500">
                No poster
              </div>
            )}

            <button
              onClick={handleToggleWatchlist}
              className={`w-full mt-4 py-3 rounded-lg font-semibold flex justify-center items-center gap-2 transition text-white ${
                isInWatchlist()
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {isInWatchlist() ? <BookmarkCheck /> : <Bookmark />}
              {isInWatchlist() ? "In Watchlist" : "Add to Watchlist"}
            </button>
          </div>

          {/* MOVIE INFO */}
          <div className="md:w-2/3">
            <h1 className="text-5xl font-bold text-white mb-4">{movie.title}</h1>

            <div className="flex items-center gap-6 text-gray-300 mb-6">
              {movie.release_year && (
                <>
                  <Calendar />
                  <span>{movie.release_year}</span>
                </>
              )}

              {movie.runtime && (
                <>
                  <Clock />
                  <span>{movie.runtime} min</span>
                </>
              )}

              <div className="flex items-center gap-2">
                <Star className="text-yellow-500 fill-yellow-500" />
                <span>
                  {averageRating != null ? averageRating.toFixed(1) : "N/A"}
                </span>
                {reviews.length > 0 && (
                  <span className="text-xs text-gray-500">
                    ({reviews.length} review{reviews.length > 1 ? "s" : ""})
                  </span>
                )}
              </div>
            </div>

            <p className="text-gray-300 text-lg mb-8">{movie.synopsis}</p>

            {trailerEmbedUrl && (
              <div className="mb-6">
                <h3 className="text-white font-semibold text-lg mb-3">
                  Trailer
                </h3>

                <div className="w-full aspect-video rounded-xl overflow-hidden border border-gray-800">
                  <iframe
                    src={trailerEmbedUrl}
                    title={`${movie.title} trailer`}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              </div>
            )}

            {/* RATING */}
            <div className="bg-gray-900 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Rate This Movie
              </h3>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => handleRating(star)}
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= (hoveredStar || userRating)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* ERROR BANNER (toxicity / backend message) */}
            {submitError && (
              <div className="mb-6 bg-red-600/10 border border-red-600/30 text-red-300 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold">Review rejected</p>
                <p className="text-sm">{submitError}</p>
              </div>
            )}

            {/* REVIEW FORM */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Write a Review
              </h3>

              <textarea
                value={userReview}
                onChange={(e) => {
                  setUserReview(e.target.value);
                  if (submitError) setSubmitError("");
                }}
                placeholder="Share your thoughts..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white min-h-32 resize-none"
              />

              <button
                onClick={handleReviewSubmit}
                disabled={!userReview.trim() || !userRating || submitting}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <div className="mt-12 pb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Reviews</h2>

          {reviews.length > 0 ? (
            reviews.map((r) => {
              const canDelete =
                profileId != null && Number(profileId) === Number(r?.profile_id);

              const liked = likedReviews.has(String(r?.id));

              return (
                <div key={r.id} className="bg-gray-900 rounded-xl p-6 mb-4">
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">
                          {r.profile_name || "Anonymous"}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {r.created_at
                            ? new Date(r.created_at).toLocaleDateString()
                            : ""}
                        </p>
                      </div>
                    </div>

                    {canDelete && (
                      <button
                        onClick={() => handleDeleteReview(r.id)}
                        className="text-gray-500 hover:text-red-500"
                        aria-label="Delete review"
                      >
                        <Trash2 />
                      </button>
                    )}
                  </div>

                  <p className="text-gray-300 mb-2">{r.review_text}</p>

                  <div
                    className="flex items-center text-gray-500 gap-2 cursor-pointer"
                    onClick={() => {
                      setLikedReviews((prev) => {
                        const next = new Set(prev);
                        const key = String(r?.id);
                        next.has(key) ? next.delete(key) : next.add(key);
                        return next;
                      });
                    }}
                  >
                    <ThumbsUp
                      className={
                        liked ? "text-yellow-500 fill-yellow-500" : ""
                      }
                    />
                    <span>{r.helpful_count} helpful</span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center py-12">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
