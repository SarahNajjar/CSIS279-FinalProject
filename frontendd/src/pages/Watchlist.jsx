// ===========================================
// Watchlist.jsx (Redux + GraphQL)
// -------------------------------------------
// - Fetches watchlist by profileId
// - Fetches missing movies by ID into movies.movieCache
// - Builds list from cache (no overwriting selectedMovie)
// ===========================================

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bookmark, Loader2, Search } from "lucide-react";

import { MovieCard } from "../components/molecules/MovieCard";
import { fetchWatchlistAsync, toggleWatchlistAsync } from "../store/watchlist/watchlistSlice";
import { fetchMovieByIdAsync } from "../store/movies/moviesSlice";
import { selectAuthUser } from "../store/auth/authSlice";

const API_BASE_URL = "http://localhost:4000";

function normalizePosterUrl(posterPath) {
  if (!posterPath) return null;
  if (posterPath.startsWith("http://") || posterPath.startsWith("https://")) return posterPath;
  return `${API_BASE_URL}${posterPath}`;
}

export function Watchlist({ searchQuery = "", onMovieClick }) {
  const dispatch = useDispatch();

  // Auth
  const user = useSelector(selectAuthUser);
  const profileId = user?.profile_id || user?.id || null;

  // Watchlist state
  const { data: watchlist, status: watchlistStatus } = useSelector((state) => state.watchlist);

  // Movies cache
  const { movieCache } = useSelector((state) => state.movies);

  // -------------------------------------------
  // Fetch Watchlist
  // -------------------------------------------
  useEffect(() => {
    if (!profileId) return;
    dispatch(fetchWatchlistAsync(profileId));
  }, [dispatch, profileId]);

  // -------------------------------------------
  // Fetch missing movies for watchlist entries
  // -------------------------------------------
  useEffect(() => {
    if (!Array.isArray(watchlist) || watchlist.length === 0) return;

    for (const item of watchlist) {
      const movieId = Number(item.movie_id ?? item.movieId ?? item.id);
      if (!movieId) continue;

      // only fetch if missing in cache
      if (!movieCache?.[movieId]) {
        dispatch(fetchMovieByIdAsync(movieId));
      }
    }
  }, [dispatch, watchlist, movieCache]);

  // -------------------------------------------
  // Build movies list from cache
  // -------------------------------------------
  const movies = useMemo(() => {
    if (!Array.isArray(watchlist)) return [];

    return watchlist
      .map((w) => {
        const movieId = Number(w.movie_id ?? w.movieId ?? w.id);
        const m = movieCache?.[movieId];
        if (!m) return null;

        return {
          ...m,
          poster_path: normalizePosterUrl(m.poster_path),
        };
      })
      .filter(Boolean);
  }, [watchlist, movieCache]);

  // -------------------------------------------
  // Filter by search
  // -------------------------------------------
  const filteredMovies = useMemo(() => {
    if (!searchQuery) return movies;
    const q = searchQuery.toLowerCase();
    return movies.filter((m) => (m.title || "").toLowerCase().includes(q));
  }, [movies, searchQuery]);

  // -------------------------------------------
  // Remove from watchlist
  // -------------------------------------------
  const handleRemove = (movieId) => {
    if (!profileId || !movieId) return;

    dispatch(toggleWatchlistAsync({ profileId, movieId }))
      .unwrap?.()
      .catch(() => {})
      .finally(() => {
        // safest: refresh list after toggle
        dispatch(fetchWatchlistAsync(profileId));
      });
  };

  // -------------------------------------------
  // Loading
  // -------------------------------------------
  if (watchlistStatus === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
      </div>
    );
  }

  // -------------------------------------------
  // UI
  // -------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Bookmark className="w-8 h-8 text-red-500" />
          <h1 className="text-4xl font-bold text-white">My Watchlist</h1>
        </div>

        {/* Search Text */}
        {searchQuery && (
          <div className="flex items-center gap-2 mb-6 text-gray-400">
            <Search className="w-5 h-5" />
            <span>
              Showing results for <span className="italic">“{searchQuery}”</span>
            </span>
          </div>
        )}

        {/* Movies */}
        {filteredMovies.length > 0 ? (
          <>
            {!searchQuery && (
              <p className="text-gray-400 mb-8">
                {movies.length} {movies.length === 1 ? "movie" : "movies"} in your watchlist
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isInWatchlist
                  onToggleWatchlist={() => handleRemove(movie.id)}
                  onClick={onMovieClick}
                />
              ))}
            </div>
          </>
        ) : (
          <EmptyWatchlist />
        )}
      </div>
    </div>
  );
}

function EmptyWatchlist() {
  return (
    <div className="text-center py-20">
      <Bookmark className="w-20 h-20 text-gray-700 mx-auto mb-4" />
      <h2 className="text-2xl font-semibold text-gray-400 mb-2">Your watchlist is empty</h2>
      <p className="text-gray-500">Start adding movies you want to watch!</p>
    </div>
  );
}
