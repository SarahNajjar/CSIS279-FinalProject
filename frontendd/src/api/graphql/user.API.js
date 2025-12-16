import { graphqlClient } from './client';

import {
    FETCH_USERS_QUERY,
    FETCH_USER_QUERY,
    CREATE_USER_MUTATION,
    UPDATE_USER_MUTATION,
    DELETE_USER_MUTATION,
} from './user.queries';

// ======================================================
// USER GRAPHQL API (Axios)
// ======================================================

export const fetchUsersAPI = async () => {
    const response = await graphqlClient.post('', {
        query: FETCH_USERS_QUERY,
    });
    return response.data.data.users;
};

export const fetchUserByIdAPI = async (id) => {
    const response = await graphqlClient.post('', {
        query: FETCH_USER_QUERY,
        variables: { id: Number(id) },
    });
    return response.data.data.user;
};

export const createUserAPI = async (input) => {
    const response = await graphqlClient.post('', {
        query: CREATE_USER_MUTATION,
        variables: { input },
    });
    return response.data.data.createUser;
};

export const updateUserAPI = async (id, input) => {
    const response = await graphqlClient.post('', {
        query: UPDATE_USER_MUTATION,
        variables: { id: Number(id), input },
    });
    return response.data.data.updateUser;
};

export const deleteUserAPI = async (id) => {
    const response = await graphqlClient.post('', {
        query: DELETE_USER_MUTATION,
        variables: { id: Number(id) },
    });
    return response.data.data.removeUser;
};
