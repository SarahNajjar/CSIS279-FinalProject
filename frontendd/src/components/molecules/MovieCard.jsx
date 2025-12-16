// ===========================================
// MovieCard.jsx (Flexible Redux Version + Rating Fallback)
// -------------------------------------------
// Rating logic order:
// 1) movie.average_rating + movie.total_ratings (best, fast)
// 2) If movie.reviews exists, compute avg from reviews[].rating
// 3) Else show N/A
// Also:
// - Supports relative poster paths: "/uploads/..." -> "http://localhost:4000/uploads/..."
// ===========================================

import React, { useMemo, useState } from "react";
import { Star, Clock, Calendar, Bookmark, BookmarkCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  toggleWatchlistAsync,
  fetchWatchlistAsync,
} from "../../store/watchlist/watchlistSlice";

const API_BASE = "http://localhost:4000";

function normalizePosterPath(posterPath) {
  if (!posterPath) return null;

  // already full URL
  if (posterPath.startsWith("http://") || posterPath.startsWith("https://")) {
    return posterPath;
  }

  // relative url from backend
  if (posterPath.startsWith("/")) {
    return `${API_BASE}${posterPath}`;
  }

  // fallback
  return posterPath;
}

export function MovieCard({
  movie,
  isInWatchlist: isInWatchlistProp,
  onToggleWatchlist: onToggleWatchlistProp,
  onClick, // optional: (movie) => void
}) {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const watchlist = useSelector((state) => state.watchlist.data);

  const profileId = user?.profile_id || user?.id || null;

  // Controlled vs uncontrolled watchlist mode
  const isInWatchlistRedux = useMemo(() => {
    if (!Array.isArray(watchlist)) return false;
    return watchlist.some(
      (item) => Number(item?.movie_id) === Number(movie?.id)
    );
  }, [watchlist, movie?.id]);

  const isInWatchlist =
    typeof isInWatchlistProp === "boolean"
      ? isInWatchlistProp
      : isInWatchlistRedux;

  const handleToggle = (e) => {
    e.stopPropagation();

    // Controlled mode
    if (typeof onToggleWatchlistProp === "function") {
      onToggleWatchlistProp();
      return;
    }

    // Redux mode
    if (!profileId || !movie?.id) return;

    dispatch(toggleWatchlistAsync({ profileId, movieId: movie.id }))
      .unwrap?.()
      .catch(() => {})
      .finally(() => {
        dispatch(fetchWatchlistAsync(profileId));
      });
  };

  const handleCardClick = () => {
    if (typeof onClick === "function") {
      onClick(movie);
      return;
    }
    navigate(`/movie/${movie.id}`);
  };

  // ✅ Rating fallback logic
  const { avgText, totalText } = useMemo(() => {
    // 1) Use backend computed fields if present
    const avgFromBackend = movie?.average_rating;
    const totalFromBackend = movie?.total_ratings;

    if (avgFromBackend != null) {
      const avgNum = Number(avgFromBackend);
      const totalNum = Number(totalFromBackend ?? 0);

      return {
        avgText: Number.isFinite(avgNum) ? avgNum.toFixed(1) : "N/A",
        totalText: Number.isFinite(totalNum) ? String(totalNum) : "0",
      };
    }

    // 2) Compute from reviews if included in movie object
    if (Array.isArray(movie?.reviews) && movie.reviews.length > 0) {
      const ratings = movie.reviews
        .map((r) => Number(r?.rating))
        .filter((n) => Number.isFinite(n) && n > 0);

      if (ratings.length > 0) {
        const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        return {
          avgText: avg.toFixed(1),
          totalText: String(ratings.length),
        };
      }
    }

    // 3) Unknown
    return { avgText: "N/A", totalText: "0" };
  }, [movie]);

  // Use duration (DB has duration), runtime fallback
  const runtimeValue = movie?.duration ?? movie?.runtime;

  const posterUrl = normalizePosterPath(movie?.poster_path);

  const renderPoster = () => {
    if (posterUrl && !imageError) {
      return (
        <img
          src={posterUrl}
          alt={movie?.title || "Movie"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setImageError(true)}
        />
      );
    }

    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-800">
        <Star className="w-16 h-16 text-gray-700" />
      </div>
    );
  };

  // genres can be strings or objects, handle both
  const firstGenre = useMemo(() => {
    const g = movie?.genres?.[0];
    if (!g) return null;
    if (typeof g === "string") return g;
    if (typeof g === "object") return g?.name || g?.title || null;
    return null;
  }, [movie]);

  return (
    <div
      className="group relative bg-gray-900 rounded-xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
      onClick={handleCardClick}
    >
      {/* Poster */}
      <div className="aspect-[2/3] relative overflow-hidden bg-gray-800">
        {renderPoster()}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Watchlist Toggle */}
        <button
          onClick={handleToggle}
          className="absolute top-3 right-3 p-2 bg-black bg-opacity-70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-90"
          aria-label="Toggle watchlist"
        >
          {isInWatchlist ? (
            <BookmarkCheck className="w-5 h-5 text-red-500" />
          ) : (
            <Bookmark className="w-5 h-5 text-white" />
          )}
        </button>

        {/* Description */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-sm text-gray-300 line-clamp-3">
            {movie?.description || movie?.synopsis || "No description available"}
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
          {movie?.title}
        </h3>

        {/* Meta */}
        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
          {movie?.release_year && (
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{movie.release_year}</span>
            </div>
          )}

          {runtimeValue && (
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{runtimeValue}m</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="text-white font-semibold">{avgText}</span>
            <span className="text-gray-500 text-sm">({totalText})</span>
          </div>

          {firstGenre && (
            <span className="text-xs text-gray-400 px-2 py-1 bg-gray-800 rounded">
              {firstGenre}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
