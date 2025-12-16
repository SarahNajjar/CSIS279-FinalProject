// ===========================================
// Home.jsx (Redux Version — SAME DESIGN)
// -------------------------------------------
// Identical UI & behavior to the AuthContext version,
// but fully converted to Redux for movies & watchlist.
// ===========================================

import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MovieCard } from "../components/molecules/MovieCard";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { fetchMoviesAsync } from "../store/movies/moviesSlice";
import {
  fetchWatchlistAsync,
  toggleWatchlistAsync,
} from "../store/watchlist/watchlistSlice";

// ===========================================
// Home Component
// ===========================================
export function Home({ searchQuery, onMovieClick }) {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleMovieClick = (id) => {
    navigate(`/movie/${id}`);
  };

  // Redux Auth User
  const user = useSelector((state) => state.auth.user);

  // Movies Slice
  const { data: movies, status: moviesStatus } = useSelector(
    (state) => state.movies
  );

  // Watchlist Slice
  const { data: watchlist } = useSelector((state) => state.watchlist);

  // Local state for filtering
  const [filteredMovies, setFilteredMovies] = useState([]);

  // -------------------------------------------
  // Title Sorting Helpers
  // -------------------------------------------
  const stripArticles = (s = "") =>
    s.trim().replace(/^(the|an|a)\s+/i, "");

  const sortByTitle = (arr = []) =>
    [...arr].sort((a, b) =>
      stripArticles(a.title).localeCompare(stripArticles(b.title))
    );

  // -------------------------------------------
  // Load Movies + Watchlist
  // -------------------------------------------
  useEffect(() => {
    dispatch(fetchMoviesAsync());

    if (user) {
      const profileId = user.profile_id || user.id;
      dispatch(fetchWatchlistAsync(profileId));
    }
  }, [dispatch, user]);

  // -------------------------------------------
  // Filter + Sort Movies on search
  // -------------------------------------------
  useEffect(() => {
    if (!searchQuery) {
      setFilteredMovies(sortByTitle(movies));
      return;
    }

    const lower = searchQuery.toLowerCase();
    const filtered = movies.filter((m) =>
      (m.title || "").toLowerCase().includes(lower)
    );

    setFilteredMovies(sortByTitle(filtered));
  }, [movies, searchQuery]);

  // -------------------------------------------
  // Check Watchlist Membership
  // -------------------------------------------
  const isInWatchlist = useCallback(
    (movieId) => {
      if (!Array.isArray(watchlist)) return false;

      return watchlist.some(
        (item) =>
          item.movie_id === movieId ||
          item.id === movieId ||
          item === movieId
      );
    },
    [watchlist]
  );

  // -------------------------------------------
  // Toggle Watchlist
  // -------------------------------------------
  const handleToggleWatchlist = (movieId) => {
    if (!user) return;

    const profileId = user.profile_id || user.id;

    dispatch(toggleWatchlistAsync({ profileId, movieId }));
  };

  // -------------------------------------------
  // Loading Screen
  // -------------------------------------------
  if (moviesStatus === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
      </div>
    );
  }

  // -------------------------------------------
  // Main UI (Same exact design)
  // -------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-black">
      {/* ========== HERO SECTION ========== */}
      {!searchQuery && (
        <div className="relative h-96 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />

          <img
            src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920"
            alt="Cinema"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 flex items-center justify-center z-20 text-center">
            <div>
              <h1 className="text-6xl font-bold text-white mb-4">
                Discover Your Next Favorite Film
              </h1>
              <p className="text-xl text-gray-300">
                Explore, rate, and discuss movies with fellow enthusiasts
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========== MOVIE GRID ========== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section>
          <h2 className="text-3xl font-bold text-white mb-6">
            {searchQuery ? "Search Results" : "All Movies"}
          </h2>

          {filteredMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={{
                    id: movie.id,
                    title: movie.title,

                    // ✅ ADD THIS
                    runtime: Number(movie.runtime ?? movie.duration ?? 0) || null,
                    duration: Number(movie.duration ?? movie.runtime ?? 0) || null,

                    poster_path: movie.poster_path
                      ? `http://localhost:4000${movie.poster_path}`
                      : null,
                    description: movie.description,
                    release_year: movie.release_year,
                    average_rating: Number(movie.average_rating ?? 0),
                    total_ratings: Number(movie.total_ratings ?? 0),
                    genre_name: (() => {
                      const GENRE_MAP = {
                        1: "Action",
                        2: "Drama",
                        3: "Comedy",
                        4: "Sci-Fi",
                        5: "Horror",
                        6: "Thriller",
                        7: "Adventure",
                      };
                      return GENRE_MAP[movie.genre_id] || "Unknown";
                    })(),
                  }}
                  isInWatchlist={isInWatchlist(movie.id)}
                  onToggleWatchlist={() => handleToggleWatchlist(movie.id)}
                  onClick={onMovieClick}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-12">
              No movies found matching your search.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
