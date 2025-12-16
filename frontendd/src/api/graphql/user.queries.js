export const FETCH_USERS_QUERY = `
  query {
    users {
      id
      username
      email
      role
    }
  }
`;

export const FETCH_USER_QUERY = `
  query ($id: Int!) {
    user(id: $id) {
      id
      username
      email
      role
    }
  }
`;

export const CREATE_USER_MUTATION = `
  mutation ($input: CreateUserInput!) {
    createUser(createUserInput: $input) {
      id
      username
      email
      role
    }
  }
`;

export const UPDATE_USER_MUTATION = `
  mutation ($id: Int!, $input: UpdateUserInput!) {
    updateUser(id: $id, updateUserInput: $input) {
      id
      username
      email
      role
    }
  }
`;

export const DELETE_USER_MUTATION = `
  mutation ($id: Int!) {
    removeUser(id: $id)
  }
`;
