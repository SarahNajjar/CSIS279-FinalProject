import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchReviewsAPI,
  fetchReviewByIdAPI,
  createReviewAPI,
  updateReviewAPI,
  deleteReviewAPI,
} from "../../api/graphql/review.API";

// Fetch ALL reviews
export const fetchReviewsAsync = createAsyncThunk("reviews/fetchAll", async () => {
  return await fetchReviewsAPI();
});

// Fetch ONE review
export const fetchReviewByIdAsync = createAsyncThunk("reviews/fetchById", async (id) => {
  return await fetchReviewByIdAPI(id);
});

// Fetch reviews for ONE movie (filter client-side)
export const fetchReviewsByMovieAsync = createAsyncThunk(
  "reviews/fetchByMovie",
  async (movieId) => {
    const all = await fetchReviewsAPI();
    return all.filter(
      (r) =>
        Number(r.movie_id) === Number(movieId) ||
        Number(r.movie?.id) === Number(movieId)
    );
  }
);

// Submit new review (used by MovieDetails)
export const submitReviewAsync = createAsyncThunk(
  "reviews/submit",
  async ({ movie_id, profile_id, rating, review_text }, thunkAPI) => {
    try {
      // hard guard to prevent Int! null
      if (!Number.isFinite(Number(movie_id))) {
        return thunkAPI.rejectWithValue("movie_id is missing/invalid.");
      }

      const created = await createReviewAPI({
        movie_id: Number(movie_id),
        profile_id: profile_id === null ? null : Number(profile_id),
        rating: rating === null ? null : Number(rating),
        review_text: review_text ?? null,
      });

      return created;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Optional CRUD
export const updateReviewAsync = createAsyncThunk(
  "reviews/update",
  async (input, thunkAPI) => {
    try {
      return await updateReviewAPI(input);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const deleteReviewAsync = createAsyncThunk(
  "reviews/delete",
  async (id, thunkAPI) => {
    try {
      await deleteReviewAPI(id);
      return Number(id);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const initialState = {
  data: [],
  selectedReview: null,
  status: "idle",
  error: null,
};

export const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    clearSelectedReview(state) {
      state.selectedReview = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchReviewsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload || [];
      })
      .addCase(fetchReviewsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      .addCase(fetchReviewsByMovieAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchReviewsByMovieAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload || [];
      })
      .addCase(fetchReviewsByMovieAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      .addCase(submitReviewAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(submitReviewAsync.fulfilled, (state, action) => {
        if (action.payload) state.data.unshift(action.payload);
      })
      .addCase(submitReviewAsync.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      .addCase(fetchReviewByIdAsync.fulfilled, (state, action) => {
        state.selectedReview = action.payload;
      })

      .addCase(updateReviewAsync.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.data.findIndex((r) => r.id === updated?.id);
        if (index !== -1) state.data[index] = updated;
      })

      .addCase(deleteReviewAsync.fulfilled, (state, action) => {
        state.data = state.data.filter((r) => r.id !== action.payload);
      });
  },
});

export const { clearSelectedReview } = reviewsSlice.actions;
export default reviewsSlice.reducer;
