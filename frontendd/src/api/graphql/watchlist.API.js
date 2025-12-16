import { graphqlClient } from './client';

import {
    FETCH_WATCHLISTS_QUERY,
    FETCH_WATCHLIST_QUERY,
    CREATE_WATCHLIST_MUTATION,
    UPDATE_WATCHLIST_MUTATION,
    DELETE_WATCHLIST_MUTATION,
} from './watchlist.queries';

// =============================================
// WATCHLIST API (GraphQL + Axios)
// =============================================

export const fetchWatchlistsAPI = async () => {
    const response = await graphqlClient.post('', {
        query: FETCH_WATCHLISTS_QUERY,
    });
    return response.data.data.watchlists;
};

export const fetchWatchlistByIdAPI = async (id) => {
    const response = await graphqlClient.post('', {
        query: FETCH_WATCHLIST_QUERY,
        variables: { id: Number(id) },
    });
    return response.data.data.watchlist;
};

export const createWatchlistAPI = async (input) => {
    const response = await graphqlClient.post('', {
        query: CREATE_WATCHLIST_MUTATION,
        variables: { input },
    });
    return response.data.data.createWatchlist;
};

export const updateWatchlistAPI = async (input) => {
    const response = await graphqlClient.post('', {
        query: UPDATE_WATCHLIST_MUTATION,
        variables: { input },
    });
    return response.data.data.updateWatchlist;
};

export const deleteWatchlistAPI = async (id) => {
    const response = await graphqlClient.post('', {
        query: DELETE_WATCHLIST_MUTATION,
        variables: { id: Number(id) },
    });
    return response.data.data.removeWatchlist;
};
