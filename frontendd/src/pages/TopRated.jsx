// ===========================================
// TopRated.jsx (Redux Version - FIXED)
// -------------------------------------------
// Uses SAME watchlist flow as Home:
// fetchWatchlistAsync(profileId) + toggleWatchlistAsync({ profileId, movieId })
// ===========================================

import React, { useEffect, useMemo, useCallback } from "react";
import { MovieCard } from "../components/molecules/MovieCard";
import { Trophy, Loader2, Search } from "lucide-react";

import { useSelector, useDispatch } from "react-redux";
import { fetchMoviesAsync } from "../store/movies/moviesSlice";
import {
  fetchWatchlistAsync,
  toggleWatchlistAsync,
} from "../store/watchlist/watchlistSlice";
import { selectAuthUser } from "../store/auth/authSlice";
import { useNavigate } from "react-router-dom";

export function TopRated({ searchQuery = "" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectAuthUser);
  const profileId = user?.profile_id || user?.id || null;

  const moviesState = useSelector((state) => state.movies);
  const watchlistState = useSelector((state) => state.watchlist);

  const movies = moviesState.data || [];
  const watchlist = watchlistState.data || [];

  const loading =
    moviesState.status === "loading" || watchlistState.status === "loading";

  // Fetch movies + current user's watchlist
  useEffect(() => {
    dispatch(fetchMoviesAsync());
    if (profileId) dispatch(fetchWatchlistAsync(profileId));
  }, [dispatch, profileId]);

  // Top rated sorting
  const topRatedMovies = useMemo(() => {
    const sorted = [...movies].sort(
      (a, b) => Number(b.average_rating ?? 0) - Number(a.average_rating ?? 0)
    );
    return sorted;
  }, [movies]);

  // Search filter
  const filteredMovies = useMemo(() => {
    if (!searchQuery) return topRatedMovies;
    const q = searchQuery.toLowerCase();
    return topRatedMovies.filter((m) => (m.title || "").toLowerCase().includes(q));
  }, [searchQuery, topRatedMovies]);

  // ✅ Same check as Home (because your watchlist items use movie_id)
  const isInWatchlist = useCallback(
    (movieId) => {
      if (!Array.isArray(watchlist)) return false;

      return watchlist.some(
        (item) =>
          Number(item.movie_id) === Number(movieId) ||
          Number(item.id) === Number(movieId) || // fallback if your API returns movie id directly
          item === movieId
      );
    },
    [watchlist]
  );

  // ✅ Same toggle as Home
  const handleToggleWatchlist = (movieId) => {
    if (!profileId) return;

    dispatch(toggleWatchlistAsync({ profileId, movieId: Number(movieId) }))
      .then(() => dispatch(fetchWatchlistAsync(profileId))); // keep UI synced
  };

  // Navigate to movie details
  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto p-8">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h1 className="text-4xl font-bold text-white">Top Rated Movies</h1>
        </div>

        {/* Search Info */}
        {searchQuery && (
          <div className="flex items-center gap-2 mb-6 text-gray-400">
            <Search className="w-5 h-5" />
            <span>
              Showing results for <span className="italic">“{searchQuery}”</span>
            </span>
          </div>
        )}

        {/* MOVIE GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie, i) => (
              <div key={movie.id} className="relative">
                {!searchQuery && i < 3 && (
                  <div className="absolute -top-2 -left-2 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                    #{i + 1}
                  </div>
                )}

                <MovieCard
                  movie={{
                    ...movie,
                    poster_path: movie.poster_path
                      ? `http://localhost:4000${movie.poster_path}`
                      : null,
                  }}
                  isInWatchlist={isInWatchlist(movie.id)}
                  onToggleWatchlist={() => handleToggleWatchlist(movie.id)}
                  onClick={() => handleMovieClick(movie.id)}
                />
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-400 py-12">
              No movies found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
