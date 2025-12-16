export const FETCH_WATCHLISTS_QUERY = `
  query {
    watchlists {
      id
      profile_id
      movie_id
    }
  }
`;

export const FETCH_WATCHLIST_QUERY = `
  query ($id: Int!) {
    watchlist(id: $id) {
      id
      profile_id
      movie_id
    }
  }
`;

export const CREATE_WATCHLIST_MUTATION = `
  mutation ($input: CreateWatchlistInput!) {
    createWatchlist(createWatchlistInput: $input) {
      id
      profile_id
      movie_id
    }
  }
`;

export const UPDATE_WATCHLIST_MUTATION = `
  mutation ($input: UpdateWatchlistInput!) {
    updateWatchlist(updateWatchlistInput: $input) {
      id
      profile_id
      movie_id
    }
  }
`;

export const DELETE_WATCHLIST_MUTATION = `
  mutation ($id: Int!) {
    removeWatchlist(id: $id)
  }
`;
