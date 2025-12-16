// ===========================================
// useMovies.js
// -------------------------------------------
// Custom React hook for managing movie data.
// Fetches all movie types (all, top-rated, recommended),
// handles search functionality, and manages loading/error state.
// ===========================================

import { useState, useEffect, useCallback } from 'react';
import { movieService } from '../services/movieService';

// ===========================================
// useMovies Hook
// -------------------------------------------
// Provides reusable movie data logic for components.
// Handles API calls via movieService and state management.
// ===========================================
export function useMovies() {
    // -------------------------------------------
    // State Management
    // -------------------------------------------
    const [movies, setMovies] = useState([]);          // All movies
    const [topRated, setTopRated] = useState([]);      // Top-rated movies
    const [recommended, setRecommended] = useState([]);// Recommended movies
    const [loading, setLoading] = useState(false);     // Loading indicator
    const [error, setError] = useState(null);          // Error message handler

    // -------------------------------------------
    // Fetch All Types of Movies
    // - Fetches all, top-rated, and recommended sets
    // - Updates respective states
    // -------------------------------------------
    const fetchMovies = useCallback(async () => {
        setLoading(true);
        try {
            const all = await movieService.getAll();
            const top = await movieService.getTopRated();
            const rec = await movieService.getRecommended();

            setMovies(all || []);
            setTopRated(top || []);
            setRecommended(rec || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // -------------------------------------------
    // Search Movies by Query
    // - Uses movieService.search()
    // - Updates main movie list with results
    // -------------------------------------------
    const searchMovies = useCallback(async (query) => {
        setLoading(true);
        try {
            const data = await movieService.search(query);
            setMovies(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // -------------------------------------------
    // Load Data on Mount
    // - Fetches movie data immediately when hook is used
    // -------------------------------------------
    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    // -------------------------------------------
    // Return Hook API
    // - Provides movie lists, states, and actions
    // -------------------------------------------
    return { movies, topRated, recommended, loading, error, fetchMovies, searchMovies };
}
