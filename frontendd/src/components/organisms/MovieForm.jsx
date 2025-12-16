// ===========================================
// MovieForm.jsx (Redux Version with authSlice)
// -------------------------------------------
// Uses Redux thunks and pulls token/user from authSlice
// ===========================================

import { useState, useEffect } from "react";
import { Save, X, Film } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
    createMovieAsync,
    updateMovieAsync,
} from "../../store/movies/moviesSlice";

import { selectAuthUser } from "../../store/auth/authSlice";

export function MovieForm({ movie, onClose, onSaved }) {
    const dispatch = useDispatch();

    // Redux selectors for auth
    const user = useSelector(selectAuthUser);
    const token = useSelector((state) => state.auth.token);


    const isEditing = Boolean(movie);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        genre_id: null,
        duration: null,
        poster_path: "",
        trailer_path: "",
        release_year: new Date().getFullYear(),
    });

    const [genres, setGenres] = useState([]);

    // Pre-fill form when editing
    useEffect(() => {
        if (movie) {
            setFormData({
                title: movie.title || "",
                description: movie.description || "",
                genre_id: movie.genre_id ?? null,
                duration: movie.duration ?? null,
                poster_path: movie.poster_path || "",
                trailer_path: movie.trailer_path || "",
                release_year: movie.release_year || new Date().getFullYear(),
            });
        }
    }, [movie]);

    // Fetch genres using token from Redux
    useEffect(() => {
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
                console.error("Error loading genres:", err);
                setGenres([]);
            }
        };

        fetchGenres();
    }, [token]);

    // Submit Handler (Redux)
    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ build a clean payload (numbers stay numbers)
        const payload = {
            ...formData,
            genre_id: formData.genre_id == null ? null : Number(formData.genre_id),
            duration: formData.duration == null ? null : Number(formData.duration),
            release_year: formData.release_year == null ? null : Number(formData.release_year),
        };

        console.log("SUBMIT payload:", payload);

        try {
            if (isEditing) {
                await dispatch(updateMovieAsync({ id: movie.id, input: payload })).unwrap();
            } else {
                await dispatch(createMovieAsync(payload)).unwrap();
            }

            onSaved();
            onClose();
        } catch (err) {
            console.error("Save failed:", err);
            alert(String(err || "Failed to save movie"));
        }
    };

    // ===========================================
    // UI Layout (UNCHANGED)
    // ===========================================
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">

                {/* Header */}
                <div className="sticky top-0 bg-red-700 px-8 py-6 flex items-center justify-between rounded-t-2xl">
                    <h3 className="text-2xl font-bold text-white flex items-center space-x-3">
                        <Film className="w-7 h-7" />
                        <span>{isEditing ? "Edit Movie" : "Add New Movie"}</span>
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-red-800 rounded-lg">
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">

                    {/* Title */}
                    <div>
                        <label className="block text-sm text-gray-300 mb-2">Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                            required
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm text-gray-300 mb-2">Description</label>
                        <textarea
                            rows={4}
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white resize-none"
                        />
                    </div>

                    {/* Genre Dropdown */}
                    <div>
                        <label className="block text-sm text-gray-300 mb-2">Genre</label>
                        <select
                            value={String(formData.genre_id || "")}
                            onChange={(e) => {
                                const v = e.target.value;
                                setFormData((p) => ({ ...p, genre_id: v ? Number(v) : null }));
                            }}
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white"
                        >
                            <option value="">Select Genre</option>
                            {genres.map((g) => {
                                const id = g.id ?? g.genre_id;
                                const name = g.name ?? g.genre_name;
                                return (
                                    <option key={id} value={id}>
                                        {name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm text-gray-300 mb-2">Duration (minutes)</label>
                        <input
                            type="number"
                            value={formData.duration ?? ""}
                            onChange={(e) => {
                                const v = e.target.value;
                                setFormData((p) => ({ ...p, duration: v ? Number(v) : null }));
                            }}
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white"
                        />
                    </div>

                    {/* Release Year */}
                    <div>
                        <label className="block text-sm text-gray-300 mb-2">Release Year</label>
                        <input
                            type="number"
                            value={formData.release_year}
                            onChange={(e) =>
                                setFormData({ ...formData, release_year: Number(e.target.value) })
                            }
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white"
                        />
                    </div>

                    {/* Poster Path */}
                    <div>
                        <label className="block text-sm text-gray-300 mb-2">Poster Path</label>
                        <input
                            type="text"
                            value={formData.poster_path}
                            onChange={(e) =>
                                setFormData({ ...formData, poster_path: e.target.value })
                            }
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white"
                        />
                    </div>

                    {/* Trailer Path */}
                    <div>
                        <label className="block text-sm text-gray-300 mb-2">Trailer Path</label>
                        <input
                            type="text"
                            value={formData.trailer_path}
                            onChange={(e) =>
                                setFormData({ ...formData, trailer_path: e.target.value })
                            }
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-3 mt-8">
                        <button
                            type="submit"
                            className="flex-1 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl flex items-center justify-center"
                        >
                            <Save className="w-5 h-5 mr-2" />
                            <span>{isEditing ? "Save Changes" : "Create Movie"}</span>
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl"
                        >
                            <X className="w-5 h-5 mr-2" />
                            <span>Cancel</span>
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
