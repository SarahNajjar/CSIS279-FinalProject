import { Plus, Film, Edit, Trash2 } from "lucide-react";
import { Clock } from "lucide-react";

export function MovieList({ movies, onEdit, onAdd, onDelete }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Movies</h2>
                <button
                    onClick={onAdd}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Movie
                </button>
            </div>

            <div className="grid gap-4">
                {movies.map((movie) => (
                    <div
                        key={movie.id}
                        className="bg-gray-900 border border-gray-700 rounded-xl p-5 flex items-start space-x-4 hover:border-red-600"
                    >
                        <div className="flex-shrink-0">
                            {movie.poster_path ? (
                                <img
                                    src={
                                        movie.poster_path.startsWith("http")
                                            ? movie.poster_path
                                            : `http://localhost:4000${movie.poster_path}`
                                    }
                                    alt={movie.title}
                                    className="w-24 h-36 object-cover rounded-lg"
                                />
                            ) : (
                                <div className="w-24 h-36 bg-gray-800 rounded-lg flex items-center justify-center">
                                    <Film className="w-8 h-8 text-gray-600" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            <h3 className="text-white font-bold text-lg">{movie.title}</h3>
                            <p className="text-gray-400 text-sm">
                                {movie.release_year}
                                {movie.duration != null && (
                                    <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                                        <Clock className="w-4 h-4" />
                                        {movie.duration}m
                                    </p>
                                )}
                            </p>

                            {movie.genreName && (
                                <p className="text-gray-500 text-sm italic mt-1">
                                    {movie.genreName}
                                </p>
                            )}

                            {movie.description && (
                                <p className="text-gray-300 text-sm mt-2 line-clamp-2">
                                    {movie.description}
                                </p>
                            )}
                        </div>

                        <div className="flex space-x-2 ml-4">
                            <button
                                onClick={() => onEdit(movie)}
                                className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onDelete(movie.id)}
                                className="p-2 bg-red-800 hover:bg-red-700 text-white rounded-lg"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
