export const FETCH_GENRES_QUERY = `
  query {
    genres {
      id
      name
    }
  }
`;

export const FETCH_GENRE_QUERY = `
  query ($id: Int!) {
    genre(id: $id) {
      id
      name
    }
  }
`;

export const CREATE_GENRE_MUTATION = `
  mutation ($input: CreateGenreInput!) {
    createGenre(createGenreInput: $input) {
      id
      name
    }
  }
`;

export const UPDATE_GENRE_MUTATION = `
  mutation ($input: UpdateGenreInput!) {
    updateGenre(updateGenreInput: $input) {
      id
      name
    }
  }
`;

export const DELETE_GENRE_MUTATION = `
  mutation ($id: Int!) {
    removeGenre(id: $id)
  }
`;
