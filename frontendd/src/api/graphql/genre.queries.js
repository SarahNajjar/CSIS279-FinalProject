// ============================================
// GraphQL Queries & Mutations for Genres
// --------------------------------------------
// This file defines all GraphQL operations
// related to the Genre entity.
// ============================================

// Query to fetch all genres
export const FETCH_GENRES_QUERY = `
  query {
    genres {
      id
      name
    }
  }
`;

// Query to fetch a single genre by its ID
export const FETCH_GENRE_QUERY = `
  query ($id: Int!) {
    genre(id: $id) {
      id
      name
    }
  }
`;

// Mutation to create a new genre
export const CREATE_GENRE_MUTATION = `
  mutation ($input: CreateGenreInput!) {
    createGenre(createGenreInput: $input) {
      id
      name
    }
  }
`;

// Mutation to update an existing genre
export const UPDATE_GENRE_MUTATION = `
  mutation ($input: UpdateGenreInput!) {
    updateGenre(updateGenreInput: $input) {
      id
      name
    }
  }
`;

// Mutation to delete a genre by its ID
export const DELETE_GENRE_MUTATION = `
  mutation ($id: Int!) {
    removeGenre(id: $id)
  }
`;
