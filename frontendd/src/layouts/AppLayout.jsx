import React, { useEffect, useMemo, useState } from "react";
import { Navbar } from "../components/molecules/Navbar";
import { MessageCircle, X } from "lucide-react";

// ✅ your real GraphQL API files
import { fetchMoviesAPI } from "../api/graphql/movie.API";
import { fetchGenresAPI } from "../api/graphql/genre.API";

export default function AppLayout({ children }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Chat UI
  const [chatOpen, setChatOpen] = useState(false);

  // combobox selections
  const [intent, setIntent] = useState(""); // top_all | top_genre | top_year | top_genre_year
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");

  // Real data
  const [moviesRaw, setMoviesRaw] = useState([]);
  const [genresRaw, setGenresRaw] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleSearchChange = (value) => setSearchQuery(value);

  // Inject searchQuery into child page component (Home, TopRated, etc.)
  const childWithProps = useMemo(() => {
    if (!React.isValidElement(children)) return children;
    return React.cloneElement(children, { searchQuery });
  }, [children, searchQuery]);

  // ------------------------------
  // Token (optional) — only if your backend needs it
  // ------------------------------
  const token = useMemo(() => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken") ||
      ""
    );
  }, []);

  // ------------------------------
  // Fetch real data when chat opens (once)
  // ------------------------------
  useEffect(() => {
    if (!chatOpen) return;
    if (moviesRaw.length || genresRaw.length) return;

    const run = async () => {
      setLoading(true);
      setErrMsg("");

      try {
        const [movies, genres] = await Promise.all([
          fetchMoviesAPI(token || undefined),
          fetchGenresAPI(),
        ]);

        setMoviesRaw(Array.isArray(movies) ? movies : []);
        setGenresRaw(Array.isArray(genres) ? genres : []);
      } catch (e) {
        setErrMsg(e?.message || "Failed to load movies/genres");
      } finally {
        setLoading(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatOpen]);

  // ------------------------------
  // Helpers: normalize backend shapes safely
  // ------------------------------
  const genresById = useMemo(() => {
    const map = new Map();
    (genresRaw || []).forEach((g) => {
      if (g?.id != null) map.set(Number(g.id), g);
    });
    return map;
  }, [genresRaw]);

  const normalizeYear = (m) => {
    const y =
      m?.year ??
      m?.release_year ??
      m?.releaseYear ??
      m?.releaseYearNumber ??
      null;

    if (y != null && !Number.isNaN(Number(y))) return Number(y);

    const d = m?.release_date ?? m?.releaseDate ?? m?.date ?? null;
    if (typeof d === "string" && d.length >= 4) {
      const parsed = Number(d.slice(0, 4));
      if (!Number.isNaN(parsed)) return parsed;
    }

    return null;
  };

  const normalizeGenres = (m) => {
    // movie.genres = [{id,name}] OR ["Action"]
    if (Array.isArray(m?.genres) && m.genres.length) {
      return m.genres
        .map((g) => (typeof g === "string" ? g : g?.name))
        .filter(Boolean);
    }

    // movie.genre = {name} OR "Action"
    if (m?.genre) {
      if (typeof m.genre === "string") return [m.genre];
      if (m.genre?.name) return [m.genre.name];
    }

    // movie.genre_id
    const gid = m?.genre_id ?? m?.genreId ?? null;
    if (gid != null && genresById.has(Number(gid))) {
      const g = genresById.get(Number(gid));
      return g?.name ? [g.name] : [];
    }

    // movie.genre_ids array
    const gids = m?.genre_ids ?? m?.genreIds ?? [];
    if (Array.isArray(gids) && gids.length) {
      return gids
        .map((id) => genresById.get(Number(id))?.name)
        .filter(Boolean);
    }

    return [];
  };

  const normalizeRating = (m) => {
    const direct =
      m?.rating ??
      m?.avgRating ??
      m?.averageRating ??
      m?.average_rating ??
      m?.avg_rating ??
      m?.score ??
      null;

    if (direct != null && !Number.isNaN(Number(direct))) return Number(direct);

    if (Array.isArray(m?.reviews) && m.reviews.length) {
      const nums = m.reviews
        .map((r) => r?.rating)
        .filter((x) => x != null && !Number.isNaN(Number(x)))
        .map(Number);

      if (nums.length) return nums.reduce((a, b) => a + b, 0) / nums.length;
    }

    return 0;
  };

  const movies = useMemo(() => {
    return (moviesRaw || []).map((m) => {
      const yearNum = normalizeYear(m);
      const g = normalizeGenres(m);
      const r = normalizeRating(m);

      return {
        id: m?.id ?? `${m?.title || "movie"}-${yearNum || "x"}`,
        title: m?.title ?? m?.name ?? "Untitled",
        year: yearNum,
        genres: g,
        rating: r,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moviesRaw, genresById]);

  const genreOptions = useMemo(() => {
    const fromGenresTable = (genresRaw || []).map((g) => g?.name).filter(Boolean);
    const fromMovies = movies.flatMap((m) => m.genres || []).filter(Boolean);
    return Array.from(new Set([...fromGenresTable, ...fromMovies])).sort();
  }, [genresRaw, movies]);

  const yearOptions = useMemo(() => {
    const years = movies
      .map((m) => m.year)
      .filter((y) => y != null && !Number.isNaN(Number(y)));
    const uniq = Array.from(new Set(years)).sort((a, b) => b - a);
    return uniq.map(String);
  }, [movies]);

  // ------------------------------
  // Results logic
  // ------------------------------
  const needsGenre = intent === "top_genre" || intent === "top_genre_year";
  const needsYear = intent === "top_year" || intent === "top_genre_year";

  const results = useMemo(() => {
    if (!intent) return [];
    const sorted = [...movies].sort((a, b) => (b.rating || 0) - (a.rating || 0));

    if (intent === "top_all") return sorted.slice(0, 10);

    if (intent === "top_genre") {
      if (!genre) return [];
      return sorted.filter((m) => (m.genres || []).includes(genre)).slice(0, 10);
    }

    if (intent === "top_year") {
      if (!year) return [];
      const y = Number(year);
      return sorted.filter((m) => Number(m.year) === y).slice(0, 10);
    }

    if (intent === "top_genre_year") {
      if (!genre || !year) return [];
      const y = Number(year);
      return sorted
        .filter((m) => Number(m.year) === y && (m.genres || []).includes(genre))
        .slice(0, 10);
    }

    return [];
  }, [intent, genre, year, movies]);

  const assistantLine = useMemo(() => {
    if (loading) return "Loading movies & genres...";
    if (errMsg) return `Error: ${errMsg}`;
    if (!intent) return "Choose what you want.";
    if (intent === "top_all") return "Top rated movies (overall).";
    if (intent === "top_genre" && !genre) return "Choose a genre.";
    if (intent === "top_genre") return `Top rated movies in ${genre}.`;
    if (intent === "top_year" && !year) return "Choose a year.";
    if (intent === "top_year") return `Top rated movies from ${year}.`;
    if (intent === "top_genre_year" && !genre) return "Choose a genre first.";
    if (intent === "top_genre_year" && !year) return "Now choose a year.";
    return `Top rated ${genre} movies from ${year}.`;
  }, [intent, genre, year, loading, errMsg]);

  return (
    <div className="min-h-screen bg-black relative">
      <Navbar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
      <main>{childWithProps}</main>

      {/* ================= CHAT BUTTON (RED/BLACK) ================= */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-50
                     bg-red-600 hover:bg-red-700
                     text-white rounded-full p-4
                     shadow-[0_0_25px_rgba(220,38,38,0.45)]
                     transition"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* ================= CHAT PANEL ================= */}
      {chatOpen && (
        <div
          className="fixed bottom-6 right-6 z-50
                     w-[360px] sm:w-[420px] h-[560px]
                     bg-black border border-zinc-800
                     rounded-2xl overflow-hidden
                     shadow-[0_0_50px_rgba(0,0,0,0.9)]"
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-gradient-to-r from-black via-zinc-950 to-black">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <span className="text-red-500 font-bold">AI</span>
                </div>
                <div className="leading-tight">
                  <p className="font-semibold text-white">Movie Assistant</p>
                  <p className="text-xs text-zinc-400">Real data (GraphQL)</p>
                </div>
              </div>

              <button
                onClick={() => setChatOpen(false)}
                className="text-zinc-400 hover:text-white transition"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {/* Assistant message */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3">
                <p className="text-sm text-zinc-100">{assistantLine}</p>
              </div>

              {/* Question combo box */}
              <div className="space-y-2">
                <label className="text-xs text-zinc-400">Question</label>
                <select
                  value={intent}
                  onChange={(e) => {
                    const v = e.target.value;
                    setIntent(v);
                    setGenre("");
                    setYear("");
                  }}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white
                             outline-none focus:border-red-600/60
                             focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]"
                  disabled={loading}
                >
                  <option value="">— Select —</option>
                  <option value="top_all">Give me top rated movies (overall)</option>
                  <option value="top_genre">Give me top rated movies by genre</option>
                  <option value="top_year">Give me top rated movies by year</option>
                  <option value="top_genre_year">Give me top rated movies by genre + year</option>
                </select>
              </div>

              {/* Genre combo box */}
              {needsGenre && (
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400">Choose genre</label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white
                               outline-none focus:border-red-600/60
                               focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]"
                    disabled={loading || !!errMsg}
                  >
                    <option value="">— Select genre —</option>
                    {genreOptions.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Year combo box */}
              {needsYear && (
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400">Based on this year</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white
                               outline-none focus:border-red-600/60
                               focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]"
                    disabled={loading || !!errMsg}
                  >
                    <option value="">— Select year —</option>
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Results */}
              {intent && (
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3">
                  <p className="text-xs text-zinc-400 mb-2">Results</p>

                  {loading ? (
                    <p className="text-sm text-zinc-300">Loading...</p>
                  ) : errMsg ? (
                    <p className="text-sm text-red-400">{errMsg}</p>
                  ) : results.length === 0 ? (
                    <p className="text-sm text-zinc-300">
                      {needsGenre && !genre
                        ? "Select a genre to see movies."
                        : needsYear && !year
                        ? "Select a year to see movies."
                        : "No results (check your data fields)."}
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {results.map((m) => (
                        <li
                          key={String(m.id)}
                          className="flex items-center justify-between gap-3
                                     rounded-xl border border-zinc-800 bg-black px-3 py-2"
                        >
                          <div className="min-w-0">
                            <p className="text-sm text-white truncate">{m.title}</p>
                            <p className="text-[11px] text-zinc-500">
                              {m.year ?? "—"} • {(m.genres || []).join(", ") || "No genre"}
                            </p>
                          </div>

                          <span className="text-xs text-red-400 border border-red-600/30 bg-red-600/10 px-2 py-1 rounded-lg">
                            {Number.isFinite(m.rating) ? m.rating.toFixed(1) : "0.0"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* ✅ NO ESLINT ERROR HERE */}
              <p className="text-[11px] text-zinc-500">
                Note: your movies query should return id, title, year (or release_date), and either avgRating/rating or reviews (rating).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
