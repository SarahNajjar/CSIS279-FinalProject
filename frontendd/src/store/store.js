import { configureStore } from "@reduxjs/toolkit";

import authReducer from './auth/authSlice';
import moviesReducer from "./movies/moviesSlice";
import reviewsReducer from "./reviews/reviewsSlice";
import usersReducer from "./users/usersSlice";
import watchlistReducer from "./watchlist/watchlistSlice";

const store = configureStore({
    reducer: {
        auth: authReducer, 
        movies: moviesReducer,
        reviews: reviewsReducer,
        users: usersReducer,
        watchlist: watchlistReducer,
    },
});

export default store;
