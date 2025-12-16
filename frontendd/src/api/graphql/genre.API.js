import { graphqlClient } from './client';

import {
    FETCH_GENRES_QUERY,
    FETCH_GENRE_QUERY,
    CREATE_GENRE_MUTATION,
    UPDATE_GENRE_MUTATION,
    DELETE_GENRE_MUTATION,
} from './genre.queries';

// ============================================
// Genre APIs (Axios + GraphQL)
// ============================================

export const fetchGenresAPI = async () => {
    const response = await graphqlClient.post('', {
        query: FETCH_GENRES_QUERY,
    });

    return response.data.data.genres;
};

export const fetchGenreByIdAPI = async (id) => {
    const response = await graphqlClient.post('', {
        query: FETCH_GENRE_QUERY,
        variables: { id: Number(id) },
    });

    return response.data.data.genre;
};

export const createGenreAPI = async (input) => {
    const response = await graphqlClient.post('', {
        query: CREATE_GENRE_MUTATION,
        variables: { input },
    });

    return response.data.data.createGenre;
};

export const updateGenreAPI = async (input) => {
    const response = await graphqlClient.post('', {
        query: UPDATE_GENRE_MUTATION,
        variables: { input },
    });

    return response.data.data.updateGenre;
};

export const deleteGenreAPI = async (id) => {
    const response = await graphqlClient.post('', {
        query: DELETE_GENRE_MUTATION,
        variables: { id: Number(id) },
    });

    return response.data.data.removeGenre;
};
