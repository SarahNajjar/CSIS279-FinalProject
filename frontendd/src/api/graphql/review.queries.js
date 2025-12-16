export const FETCH_REVIEWS_QUERY = `
  query {
    reviews {
      id
      movie_id
      profile_id
      rating
      review_text
      created_at

      movie {
        id
        title
      }

      user {
        id
        email
      }
    }
  }
`;

export const FETCH_REVIEW_QUERY = `
  query ($id: Int!) {
    review(id: $id) {
      id
      movie_id
      profile_id
      rating
      review_text
      created_at

      movie {
        id
        title
      }

      user {
        id
        email
      }
    }
  }
`;

export const CREATE_REVIEW_MUTATION = `
  mutation ($createReviewInput: CreateReviewInput!) {
    createReview(createReviewInput: $createReviewInput) {
      id
      movie_id
      profile_id
      rating
      review_text
      created_at

      movie {
        id
        title
      }

      user {
        id
        email
      }
    }
  }
`;

export const UPDATE_REVIEW_MUTATION = `
  mutation ($updateReviewInput: UpdateReviewInput!) {
    updateReview(updateReviewInput: $updateReviewInput) {
      id
      movie_id
      profile_id
      rating
      review_text
      created_at

      movie {
        id
        title
      }

      user {
        id
        email
      }
    }
  }
`;

export const DELETE_REVIEW_MUTATION = `
  mutation ($id: Int!) {
    deleteReview(id: $id)
  }
`;

/**
 * ✅ NEW: minimal query to compute average in frontend
 * (Backend has no reviewsByMovie(movieId) query)
 */
export const FETCH_MOVIE_RATINGS_QUERY = `
  query {
    reviews {
      movie_id
      rating
    }
  }
`;
