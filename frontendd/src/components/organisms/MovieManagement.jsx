// ===========================================
// MovieManagement.jsx (Redux Version with authSlice)
// -------------------------------------------
// Fully Redux-based: movies, auth, genres
// Replaces apiConfig with Redux token + user
// ===========================================

import { useEffect, useState } from "react";
import { Film, PlusCircle, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
    fetchMoviesAsync,
    deleteMovieAsync,
} from "../../store/movies/moviesSlice";

import { MovieList } from "./MovieList";
import { MovieForm } from "./MovieForm";

export function MovieManagement() {
    const dispatch = useDispatch();

    const movies = useSelector((state) => state.movies.data);
    const status = useSelector((state) => state.movies.status);
    const token = useSelector((state) => state.auth.token);

    // Local state (genres & form states stay local)
    const [genres, setGenres] = useState([]);
    const [editingMovie, setEditingMovie] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    // ============================
    // Fetch Movies (Redux)
    // ============================
    useEffect(() => {
        dispatch(fetchMoviesAsync());
        fetchGenres();
    }, [dispatch, token]);

    // ============================
    // Fetch genres using token from authSlice
    // ============================
    const fetchGenres = async () => {
        if (!token) return;

        try {
            const res = await fetch("http://localhost:4000/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    query: `
          query {
            genres {
              id
              name
            }
          }
        `,
                }),
            });

            const json = await res.json();
            const list = json?.data?.genres ?? [];
            setGenres(Array.isArray(list) ? list : []);
        } catch (err) {
            console.error("Error fetching genres:", err);
            setGenres([]);
        }
    };

    const getGenreName = (genreId) => {
        const idNum = Number(genreId);
        if (!Number.isFinite(idNum) || !Array.isArray(genres)) return "Unknown Genre";

        const g = genres.find(
            (x) => Number(x.id ?? x.genre_id) === idNum
        );

        return g?.name ?? g?.genre_name ?? "Unknown Genre";
    };

    // ============================
    // Delete Movie (Redux)
    // ============================
    const handleDeleteMovie = async (movieId) => {
        if (!window.confirm("Are you sure you want to delete this movie?")) return;
        await dispatch(deleteMovieAsync(movieId));
    };

    // ===========================================
    // UI Layout (UNCHANGED)
    // ===========================================
    return (
        <div className="p-6 bg-gray-950 text-white rounded-xl shadow-md">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Film className="w-6 h-6 text-red-500" />
                    <h2 className="text-2xl font-bold">Movie Management</h2>
                </div>
            </div>

            {/* Loading */}
            {status === "loading" && (
                <div className="flex justify-center py-10">
                    <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                    <p className="ml-2 text-gray-400">Loading movies...</p>
                </div>
            )}

            {/* Movie List */}
            {status !== "loading" && (
                <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-sm p-4">
                    <MovieList
                        movies={(Array.isArray(movies) ? movies : []).map((m) => ({
                            ...m,
                            genreName: getGenreName(m.genre_id),
                        }))}
                        onEdit={setEditingMovie}
                        onAdd={() => setIsCreating(true)}
                        onDelete={handleDeleteMovie}
                    />
                </div>
            )}

            {/* Add/Edit Form */}
            {(isCreating || editingMovie) && (
                <MovieForm
                    movie={editingMovie}
                    onClose={() => {
                        setEditingMovie(null);
                        setIsCreating(false);
                    }}
                    onSaved={() => dispatch(fetchMoviesAsync())}
                />
            )}
        </div>
    );
}
