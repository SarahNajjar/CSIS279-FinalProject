import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    fetchUsersAPI,
    fetchUserByIdAPI,
    createUserAPI,
    updateUserAPI,
    deleteUserAPI,
} from "../../api/graphql/user.API";

// We import review + watchlist APIs to compute stats
import { fetchReviewsAPI } from "../../api/graphql/review.API";
import { fetchWatchlistsAPI } from "../../api/graphql/watchlist.API";

// =======================================================
// FETCH USER STATS (reviews count + watchlist count)
// =======================================================
export const fetchUserStatsAsync = createAsyncThunk(
    "users/fetchStats",
    async (userId) => {
        const reviews = await fetchReviewsAPI();
        const watchlist = await fetchWatchlistsAPI();

        const totalReviews = reviews.filter(
            (r) => Number(r.user_id) === Number(userId)
        ).length;

        const watchlistCount = watchlist.filter(
            (w) => Number(w.profile_id) === Number(userId)
        ).length;

        return { totalReviews, watchlistCount };
    }
);

// =======================================================
// FETCH ALL USERS
// =======================================================
export const fetchUsersAsync = createAsyncThunk(
    "users/fetchAll",
    async () => {
        return await fetchUsersAPI();
    }
);

// FETCH USER BY ID
export const fetchUserByIdAsync = createAsyncThunk(
    "users/fetchById",
    async (id) => {
        return await fetchUserByIdAPI(id);
    }
);

// CREATE USER
export const createUserAsync = createAsyncThunk(
    "users/create",
    async (input) => {
        return await createUserAPI(input);
    }
);

// UPDATE USER
export const updateUserAsync = createAsyncThunk(
    "users/update",
    async ({ id, input }) => {
        return await updateUserAPI(id, input);
    }
);

// DELETE USER
export const deleteUserAsync = createAsyncThunk(
    "users/delete",
    async (id) => {
        await deleteUserAPI(id);
        return id;
    }
);

// =======================================================
// INITIAL STATE
// =======================================================
const initialState = {
    data: [],
    selectedUser: null,
    stats: null,            // ⭐ NEW FIELD
    status: "idle",
    error: null,
};

// =======================================================
// SLICE
// =======================================================
export const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        clearSelectedUser(state) {
            state.selectedUser = null;
        },
    },
    extraReducers: (builder) => {
        builder

            // ----------------------------
            // FETCH ALL USERS
            // ----------------------------
            .addCase(fetchUsersAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchUsersAsync.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(fetchUsersAsync.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })

            // ----------------------------
            // FETCH USER BY ID
            // ----------------------------
            .addCase(fetchUserByIdAsync.fulfilled, (state, action) => {
                state.selectedUser = action.payload;
            })

            // ----------------------------
            // FETCH USER STATS
            // ----------------------------
            .addCase(fetchUserStatsAsync.fulfilled, (state, action) => {
                state.stats = action.payload;
            })

            // ----------------------------
            // CREATE USER
            // ----------------------------
            .addCase(createUserAsync.fulfilled, (state, action) => {
                state.data.push(action.payload);
            })

            // ----------------------------
            // UPDATE USER
            // ----------------------------
            .addCase(updateUserAsync.fulfilled, (state, action) => {
                const index = state.data.findIndex(
                    (u) => u.id === action.payload.id
                );
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })

            // ----------------------------
            // DELETE USER
            // ----------------------------
            .addCase(deleteUserAsync.fulfilled, (state, action) => {
                state.data = state.data.filter((u) => u.id !== action.payload);
            });
    },
});

// EXPORT actions
export const { clearSelectedUser } = usersSlice.actions;

// EXPORT reducer
export default usersSlice.reducer;
