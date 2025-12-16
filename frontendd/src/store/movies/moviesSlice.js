import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchMoviesAPI,
  fetchMovieByIdAPI,
  createMovieAPI,
  updateMovieAPI,
  deleteMovieAPI,
} from "../../api/graphql/movie.API";

// =============================
// Async Thunks (✅ pass token properly)
// =============================
export const fetchMoviesAsync = createAsyncThunk(
  "movies/fetchMovies",
  async (_, { getState }) => {
    const token = getState().auth.token;
    return await fetchMoviesAPI(token);
  }
);

export const fetchMovieByIdAsync = createAsyncThunk(
  "movies/fetchMovieById",
  async (id, { getState }) => {
    const token = getState().auth.token;
    return await fetchMovieByIdAPI(id, token);
  }
);

export const updateMovieAsync = createAsyncThunk(
  "movies/updateMovie",
  async ({ id, input }, { getState }) => {
    const token = getState().auth.token;
    return await updateMovieAPI({ id, input }, token);
  }
);

export const createMovieAsync = createAsyncThunk(
  "movies/createMovie",
  async (newMovie, { getState }) => {
    const token = getState().auth.token;
    return await createMovieAPI(newMovie, token);
  }
);

export const deleteMovieAsync = createAsyncThunk(
  "movies/deleteMovie",
  async (id, { getState }) => {
    const token = getState().auth.token;
    return await deleteMovieAPI(id, token);
  }
);

// =============================
// Initial State
// =============================
const initialState = {
  data: [],
  movieCache: {},
  selectedMovie: null,
  status: "idle",
  error: null,
};

// =============================
// Slice
// =============================
export const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    clearSelectedMovie(state) {
      state.selectedMovie = null;
    },
    setSelectedMovie(state, action) {
      state.selectedMovie = action.payload;
      if (action.payload?.id) {
        state.movieCache[action.payload.id] = action.payload;
      }
    },
    clearMovieCache(state) {
      state.movieCache = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoviesAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMoviesAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = Array.isArray(action.payload) ? action.payload : [];

        for (const m of state.data) {
          if (m?.id != null) state.movieCache[m.id] = m;
        }
      })
      .addCase(fetchMoviesAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message || "Failed to fetch movies";
      })

      .addCase(fetchMovieByIdAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMovieByIdAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        const movie = action.payload;

        if (movie?.id != null) {
          state.movieCache[movie.id] = movie;
        }
        state.selectedMovie = movie;
      })
      .addCase(fetchMovieByIdAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message || "Failed to fetch movie";
      })

      .addCase(createMovieAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createMovieAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        const m = action.payload;

        if (m?.id != null) {
          state.data.push(m);
          state.movieCache[m.id] = m;
        }
      })
      .addCase(createMovieAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message || "Failed to create movie";
      })

      .addCase(updateMovieAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateMovieAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updated = action.payload;

        const idx = state.data.findIndex(
          (m) => Number(m.id) === Number(updated?.id)
        );
        if (idx !== -1) state.data[idx] = updated;

        if (updated?.id != null) state.movieCache[updated.id] = updated;

        if (state.selectedMovie?.id === updated?.id) state.selectedMovie = updated;
      })
      .addCase(updateMovieAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message || "Failed to update movie";
      })

      .addCase(deleteMovieAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteMovieAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        const deletedId = Number(action.meta.arg);

        state.data = state.data.filter((m) => Number(m.id) !== deletedId);
        delete state.movieCache[deletedId];

        if (Number(state.selectedMovie?.id) === deletedId) {
          state.selectedMovie = null;
        }
      })
      .addCase(deleteMovieAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message || "Failed to delete movie";
      });
  },
});

export const { clearSelectedMovie, setSelectedMovie, clearMovieCache } =
  moviesSlice.actions;

export default moviesSlice.reducer;
