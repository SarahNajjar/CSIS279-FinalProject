export const FETCH_MOVIES_QUERY = `
query {
  movies {
    id
    title
    description
    genre_id
    duration
    poster_path
    trailer_path
    release_year

    # ✅ NEW computed fields from backend
    average_rating
    total_ratings
  }
}
`;

export const FETCH_MOVIE_QUERY = `
query ($id: Int!) {
  movie(id: $id) {
    id
    title
    description
    genre_id
    poster_path
    trailer_path
    duration
    release_year

    # ✅ NEW computed fields from backend
    average_rating
    total_ratings

    # optional (if you want genre in details)
    genre {
      id
      name
    }
  }
}
`;

export const CREATE_MOVIE_MUTATION = `
mutation ($input: CreateMovieInput!) {
  createMovie(createMovieInput: $input) {
    id
    title
    description
    genre_id
    poster_path
    trailer_path
    duration
    release_year

    average_rating
    total_ratings
  }
}
`;

export const UPDATE_MOVIE_MUTATION = `
mutation UpdateMovie($id: Int!, $input: UpdateMovieInput!) {
  updateMovie(id: $id, input: $input) {
    id
    title
    description
    genre_id
    duration
    poster_path
    trailer_path
    release_year

    average_rating
    total_ratings
  }
}
`;

export const DELETE_MOVIE_MUTATION = `
mutation ($id: Int!) {
  removeMovie(id: $id)
}
`;
