import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    fetchWatchlistsAPI,
    fetchWatchlistByIdAPI,
    createWatchlistAPI,
    updateWatchlistAPI,
    deleteWatchlistAPI,
} from "../../api/graphql/watchlist.API";

// ===================================
// FETCH WATCHLIST FOR ONE USER
// ===================================
export const fetchWatchlistAsync = createAsyncThunk(
    "watchlist/fetchWatchlist",
    async (profileId) => {
        const all = await fetchWatchlistsAPI();
        return all.filter((w) => Number(w.profile_id) === Number(profileId));
    }
);

// ===================================
// TOGGLE WATCHLIST ENTRY
// ===================================
export const toggleWatchlistAsync = createAsyncThunk(
    "watchlist/toggleWatchlist",
    async ({ profileId, movieId }, { getState }) => {
        const state = getState().watchlist.data;

        const existing = state.find(
            (item) =>
                Number(item.profile_id) === Number(profileId) &&
                Number(item.movie_id) === Number(movieId)
        );

        // REMOVE
        if (existing) {
            await deleteWatchlistAPI(existing.id);
            return { action: "deleted", id: existing.id };
        }

        // ADD
        const created = await createWatchlistAPI({
            profile_id: Number(profileId),
            movie_id: Number(movieId),
        });

        return { action: "created", item: created };
    }
);

// ===================================
// OTHER CRUD (retain for admin)
// ===================================
export const fetchWatchlistsAsync = createAsyncThunk(
    "watchlist/fetchWatchlists",
    async () => await fetchWatchlistsAPI()
);

export const fetchWatchlistByIdAsync = createAsyncThunk(
    "watchlist/fetchWatchlistById",
    async (id) => await fetchWatchlistByIdAPI(id)
);

export const createWatchlistAsync = createAsyncThunk(
    "watchlist/createWatchlist",
    async (input) => await createWatchlistAPI(input)
);

export const updateWatchlistAsync = createAsyncThunk(
    "watchlist/updateWatchlist",
    async (input) => await updateWatchlistAPI(input)
);

export const deleteWatchlistAsync = createAsyncThunk(
    "watchlist/deleteWatchlist",
    async (id) => await deleteWatchlistAPI(id)
);

// ===================================
// INITIAL STATE
// ===================================
const initialState = {
    data: [], // CURRENT USER’S WATCHLIST
    selectedWatchlist: null,
    status: "idle",
    error: null,
};

// ===================================
// SLICE
// ===================================
export const watchlistSlice = createSlice({
    name: "watchlist",
    initialState,
    reducers: {
        clearSelectedWatchlist: (state) => {
            state.selectedWatchlist = null;
        },
    },

    extraReducers: (builder) => {
        builder
            // USER WATCHLIST
            .addCase(fetchWatchlistAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchWatchlistAsync.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(fetchWatchlistAsync.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })

            // TOGGLE WATCHLIST
            .addCase(toggleWatchlistAsync.fulfilled, (state, action) => {
                if (action.payload.action === "deleted") {
                    state.data = state.data.filter(
                        (item) => item.id !== action.payload.id
                    );
                } else if (action.payload.action === "created") {
                    state.data.push(action.payload.item);
                }
            })

            // ADMIN CRUD (OPTIONAL)
            .addCase(fetchWatchlistsAsync.fulfilled, (state, action) => {
                // DO NOT overwrite user watchlist automatically
            })
            .addCase(fetchWatchlistByIdAsync.fulfilled, (state, action) => {
                state.selectedWatchlist = action.payload;
            })
            .addCase(createWatchlistAsync.fulfilled, (state, action) => {
                state.data.push(action.payload);
            })
            .addCase(updateWatchlistAsync.fulfilled, (state, action) => {
                const index = state.data.findIndex(
                    (item) => item.id === action.payload.id
                );
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            .addCase(deleteWatchlistAsync.fulfilled, (state, action) => {
                const id = action.meta.arg;
                state.data = state.data.filter((item) => item.id !== Number(id));
            });
    },
});

// ===================================
// EXPORT
// ===================================
export const { clearSelectedWatchlist } = watchlistSlice.actions;

export default watchlistSlice.reducer;
