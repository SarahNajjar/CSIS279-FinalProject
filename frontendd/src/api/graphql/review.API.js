import { graphqlClient } from "./client";
import {
  FETCH_REVIEWS_QUERY,
  FETCH_REVIEW_QUERY,
  CREATE_REVIEW_MUTATION,
  UPDATE_REVIEW_MUTATION,
  DELETE_REVIEW_MUTATION,
  FETCH_MOVIE_RATINGS_QUERY, // ✅ NEW
} from "./review.queries";

// helper to throw real GraphQL error messages
const throwIfGraphQLError = (data, fallback = "GraphQL request failed") => {
  if (data?.errors?.length) {
    const msg = data.errors[0]?.message || fallback;
    throw new Error(msg);
  }
};

export const fetchReviewsAPI = async () => {
  const response = await graphqlClient.post("", { query: FETCH_REVIEWS_QUERY });
  throwIfGraphQLError(response.data, "Fetch reviews failed");
  return response.data.data.reviews;
};

export const fetchReviewByIdAPI = async (id) => {
  const response = await graphqlClient.post("", {
    query: FETCH_REVIEW_QUERY,
    variables: { id: Number(id) },
  });
  throwIfGraphQLError(response.data, "Fetch review failed");
  return response.data.data.review;
};

export const createReviewAPI = async (input) => {
  const payload = {
    movie_id: Number(input.movie_id),
    profile_id:
      input.profile_id === null || input.profile_id === undefined
        ? null
        : Number(input.profile_id),
    rating:
      input.rating === null || input.rating === undefined
        ? null
        : Number(input.rating),
    review_text: input.review_text ?? null,
  };

  console.log("CREATE REVIEW payload =>", payload);

  const response = await graphqlClient.post("", {
    query: CREATE_REVIEW_MUTATION,
    variables: { createReviewInput: payload },
  });

  console.log("CREATE REVIEW response =>", response.data);

  throwIfGraphQLError(response.data, "Create review failed");
  return response.data.data.createReview;
};

export const updateReviewAPI = async (input) => {
  const payload = {
    id: Number(input.id),
    movie_id:
      input.movie_id === undefined ? undefined : Number(input.movie_id),
    profile_id:
      input.profile_id === undefined || input.profile_id === null
        ? input.profile_id
        : Number(input.profile_id),
    rating:
      input.rating === undefined || input.rating === null
        ? input.rating
        : Number(input.rating),
    review_text: input.review_text,
  };

  const response = await graphqlClient.post("", {
    query: UPDATE_REVIEW_MUTATION,
    variables: { updateReviewInput: payload },
  });

  throwIfGraphQLError(response.data, "Update review failed");
  return response.data.data.updateReview;
};

export const deleteReviewAPI = async (id) => {
  const response = await graphqlClient.post("", {
    query: DELETE_REVIEW_MUTATION,
    variables: { id: Number(id) },
  });

  throwIfGraphQLError(response.data, "Delete review failed");
  return response.data.data.deleteReview;
};

/**
 * ✅ NEW: Get average rating (0–5) for a specific movieId
 * Returns: { movieId, average, count, averageRounded }
 */
export const fetchMovieAverageRatingAPI = async (movieId) => {
  const mid = Number(movieId);
  if (!Number.isFinite(mid)) throw new Error("Invalid movieId");

  const response = await graphqlClient.post("", {
    query: FETCH_MOVIE_RATINGS_QUERY,
  });

  throwIfGraphQLError(response.data, "Fetch movie ratings failed");

  const all = response.data?.data?.reviews || [];

  const ratings = all
    .filter((r) => Number(r?.movie_id) === mid)
    .map((r) => r?.rating)
    .filter((x) => x != null && !Number.isNaN(Number(x)))
    .map(Number);

  if (!ratings.length) {
    return { movieId: mid, average: 0, count: 0, averageRounded: "0.0" };
  }

  const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;

  // clamp between 0 and 5 just in case
  const average = Math.max(0, Math.min(5, avg));

  return {
    movieId: mid,
    average,
    count: ratings.length,
    averageRounded: average.toFixed(1),
  };
};
