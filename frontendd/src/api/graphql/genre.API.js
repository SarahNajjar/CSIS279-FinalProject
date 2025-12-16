// Import the pre-configured Axios GraphQL client
import { graphqlClient } from './client';

// Import all GraphQL queries and mutations related to genres
import {
    FETCH_GENRES_QUERY,
    FETCH_GENRE_QUERY,
    CREATE_GENRE_MUTATION,
    UPDATE_GENRE_MUTATION,
    DELETE_GENRE_MUTATION,
} from './genre.queries';

// ============================================
// Genre APIs (Axios + GraphQL)
// --------------------------------------------
// This file contains helper functions that
// communicate with the GraphQL backend to
// perform CRUD operations on genres.
// ============================================

// Fetch all genres from the backend
export const fetchGenresAPI = async () => {
    // Send a POST request to the GraphQL endpoint
    const response = await graphqlClient.post('', {
        // GraphQL query to retrieve all genres
        query: FETCH_GENRES_QUERY,
    });

    // Return the list of genres from the GraphQL response
    return response.data.data.genres;
};

// Fetch a single genre by its ID
export const fetchGenreByIdAPI = async (id) => {
    // Send a POST request with query variables
    const response = await graphqlClient.post('', {
        // GraphQL query to retrieve a specific genre
        query: FETCH_GENRE_QUERY,
        // Ensure the ID is a number before sending
        variables: { id: Number(id) },
    });

    // Return the fetched genre object
    return response.data.data.genre;
};

// Create a new genre
export const createGenreAPI = async (input) => {
    // Send a POST request with mutation and input data
    const response = await graphqlClient.post('', {
        // GraphQL mutation to create a genre
        query: CREATE_GENRE_MUTATION,
        // Input object containing genre data
        variables: { input },
    });

    // Return the newly created genre
    return response.data.data.createGenre;
};

// Update an existing genre
export const updateGenreAPI = async (input) => {
    // Send a POST request with mutation and updated data
    const response = await graphqlClient.post('', {
        // GraphQL mutation to update a genre
        query: UPDATE_GENRE_MUTATION,
        // Input object containing updated genre data
        variables: { input },
    });

    // Return the updated genre
    return response.data.data.updateGenre;
};

// Delete a genre by its ID
export const deleteGenreAPI = async (id) => {
    // Send a POST request with mutation and genre ID
    const response = await graphqlClient.post('', {
        // GraphQL mutation to delete a genre
        query: DELETE_GENRE_MUTATION,
        // Ensure the ID is a number before sending
        variables: { id: Number(id) },
    });

    // Return the result of the delete operation
    return response.data.data.removeGenre;
};
