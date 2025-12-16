import { graphqlClient } from "./client";
import {
  FETCH_MOVIES_QUERY,
  FETCH_MOVIE_QUERY,
  CREATE_MOVIE_MUTATION,
  UPDATE_MOVIE_MUTATION,
  DELETE_MOVIE_MUTATION,
} from "./movie.queries";

function unwrap(res, key) {
  const payload = res?.data;

  if (payload?.errors?.length) {
    throw new Error(payload.errors[0]?.message || "GraphQL error");
  }

  const data = payload?.data;
  if (!data) throw new Error("No data returned from GraphQL");

  return key ? data[key] : data;
}

const authHeaders = (token) =>
  token ? { Authorization: `Bearer ${token}` } : {};

// ------------------------------
// Queries
// ------------------------------
export const fetchMoviesAPI = async (token) => {
  const res = await graphqlClient.post(
    "",
    { query: FETCH_MOVIES_QUERY },
    { headers: authHeaders(token) }
  );
  return unwrap(res, "movies");
};

export const fetchMovieByIdAPI = async (id, token) => {
  const res = await graphqlClient.post(
    "",
    { query: FETCH_MOVIE_QUERY, variables: { id: Number(id) } },
    { headers: authHeaders(token) }
  );
  return unwrap(res, "movie");
};

// ------------------------------
// Mutations
// ------------------------------
export const createMovieAPI = async (input, token) => {
  const res = await graphqlClient.post(
    "",
    { query: CREATE_MOVIE_MUTATION, variables: { input } },
    { headers: authHeaders(token) }
  );
  return unwrap(res, "createMovie");
};

export const updateMovieAPI = async ({ id, input }, token) => {
  const res = await graphqlClient.post(
    "",
    {
      query: UPDATE_MOVIE_MUTATION,
      variables: { id: Number(id), input },
    },
    { headers: authHeaders(token) }
  );

  return unwrap(res, "updateMovie");
};

export const deleteMovieAPI = async (id, token) => {
  const res = await graphqlClient.post(
    "",
    { query: DELETE_MOVIE_MUTATION, variables: { id: Number(id) } },
    { headers: authHeaders(token) }
  );

  const data = unwrap(res);
  return data.removeMovie ?? true;
};
