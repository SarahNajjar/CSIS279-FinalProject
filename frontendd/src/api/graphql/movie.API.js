// Import the pre-configured Axios GraphQL client
import { graphqlClient } from "./client";

// Import all GraphQL queries and mutations related to movies
import {
  FETCH_MOVIES_QUERY,
  FETCH_MOVIE_QUERY,
  CREATE_MOVIE_MUTATION,
  UPDATE_MOVIE_MUTATION,
  DELETE_MOVIE_MUTATION,
} from "./movie.queries";

// -------------------------------------------
// Helper function to safely unwrap GraphQL responses
// -------------------------------------------
// - Checks for GraphQL errors and throws them
// - Ensures data exists in the response
// - Optionally returns a specific key from data
function unwrap(res, key) {
  // Extract the main payload from Axios response
  const payload = res?.data;

  // If GraphQL returned errors, throw the first error message
  if (payload?.errors?.length) {
    throw new Error(payload.errors[0]?.message || "GraphQL error");
  }

  // Extract actual GraphQL data
  const data = payload?.data;

  // If no data is returned, throw an error
  if (!data) throw new Error("No data returned from GraphQL");

  // Return specific key if provided, otherwise return full data object
  return key ? data[key] : data;
}

// -------------------------------------------
// Helper function to build Authorization headers
// -------------------------------------------
// - Adds Bearer token if provided
// - Returns empty headers object if no token exists
const authHeaders = (token) =>
  token ? { Authorization: `Bearer ${token}` } : {};

// ------------------------------
// Queries
// ------------------------------

// Fetch all movies (requires auth token)
export const fetchMoviesAPI = async (token) => {
  // Send GraphQL query request
  const res = await graphqlClient.post(
    "",
    { query: FETCH_MOVIES_QUERY },
    { headers: authHeaders(token) }
  );

  // Return list of movies from response
  return unwrap(res, "movies");
};

// Fetch a single movie by its ID (requires auth token)
export const fetchMovieByIdAPI = async (id, token) => {
  // Send GraphQL query with movie ID as variable
  const res = await graphqlClient.post(
    "",
    { query: FETCH_MOVIE_QUERY, variables: { id: Number(id) } },
    { headers: authHeaders(token) }
  );

  // Return the fetched movie object
  return unwrap(res, "movie");
};

// ------------------------------
// Mutations
// ------------------------------

// Create a new movie (requires auth token)
export const createMovieAPI = async (input, token) => {
  // Send GraphQL mutation with input payload
  const res = await graphqlClient.post(
    "",
    { query: CREATE_MOVIE_MUTATION, variables: { input } },
    { headers: authHeaders(token) }
  );

  // Return the newly created movie
  return unwrap(res, "createMovie");
};

// Update an existing movie by ID (requires auth token)
export const updateMovieAPI = async ({ id, input }, token) => {
  // Send GraphQL mutation with movie ID and updated data
  const res = await graphqlClient.post(
    "",
    {
      query: UPDATE_MOVIE_MUTATION,
      variables: { id: Number(id), input },
    },
    { headers: authHeaders(token) }
  );

  // Return the updated movie
  return unwrap(res, "updateMovie");
};

// Delete a movie by its ID (requires auth token)
export const deleteMovieAPI = async (id, token) => {
  // Send GraphQL mutation to delete the movie
  const res = await graphqlClient.post(
    "",
    { query: DELETE_MOVIE_MUTATION, variables: { id: Number(id) } },
    { headers: authHeaders(token) }
  );

  // Unwrap response data
  const data = unwrap(res);

  // Return true if deletion succeeded (fallback safety)
  return data.removeMovie ?? true;
};
