// ===========================================
// authSlice.js — GraphQL Version (FIXED)
// -------------------------------------------
// Fix: remove is_admin from LOGIN_MUTATION (not in schema)
// Use role only for admin checks
// ===========================================

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { graphqlClient } from "../../api/graphql/client";

// -------------------------------------------
// GraphQL Mutations
// -------------------------------------------

// ✅ FIXED: only request fields that exist in your GraphQL User type
const LOGIN_MUTATION = `
  mutation Login($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      token
      user {
        id
        email
        role
      }
    }
  }
`;

const SIGNUP_MUTATION = `
  mutation Signup($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      email
      username
      role
    }
  }
`;

// -------------------------------------------
// OPTIONAL: persistence helpers (safe)
// -------------------------------------------
const LS_TOKEN = "cinestream_token";
const LS_USER = "cinestream_user";

function saveAuthToStorage(token, user) {
  try {
    if (token) localStorage.setItem(LS_TOKEN, token);
    else localStorage.removeItem(LS_TOKEN);

    if (user) localStorage.setItem(LS_USER, JSON.stringify(user));
    else localStorage.removeItem(LS_USER);
  } catch {}
}

function loadAuthFromStorage() {
  try {
    const token = localStorage.getItem(LS_TOKEN);
    const userStr = localStorage.getItem(LS_USER);
    const user = userStr ? JSON.parse(userStr) : null;
    return { token: token || null, user: user || null };
  } catch {
    return { token: null, user: null };
  }
}

// ===========================================
// THUNKS
// ===========================================

export const loginAsync = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await graphqlClient.post("", {
        query: LOGIN_MUTATION,
        variables: { email, password },
      });

      if (response.data?.errors?.length) {
        throw new Error(response.data.errors[0]?.message || "Login failed");
      }

      const loginPayload = response.data?.data?.login;

      if (!loginPayload?.token || !loginPayload?.user) {
        throw new Error("Invalid credentials");
      }

      return loginPayload; // { token, user }
    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data || err.message);
      return thunkAPI.rejectWithValue(err.message || "Login failed");
    }
  }
);

export const signupAsync = createAsyncThunk(
  "auth/signup",
  async ({ email, username, password }, thunkAPI) => {
    try {
      const response = await graphqlClient.post("", {
        query: SIGNUP_MUTATION,
        variables: { input: { email, username, password } },
      });

      if (response.data?.errors?.length) {
        throw new Error(response.data.errors[0]?.message || "Signup failed");
      }

      const created = response.data?.data?.createUser;
      if (!created) throw new Error("Signup failed");

      return created;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Signup failed");
    }
  }
);

// ===========================================
// INITIAL STATE
// ===========================================

const persisted = loadAuthFromStorage();

const initialState = {
  user: persisted.user,
  token: persisted.token,
  loading: false,
  error: null,
};

// ===========================================
// SLICE
// ===========================================

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;
      saveAuthToStorage(null, null);
    },
    setUser(state, action) {
      state.user = action.payload;
      saveAuthToStorage(state.token, state.user);
    },
    setToken(state, action) {
      state.token = action.payload;
      saveAuthToStorage(state.token, state.user);
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        saveAuthToStorage(state.token, state.user);
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      // SIGNUP
      .addCase(signupAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        saveAuthToStorage(state.token, state.user);
      })
      .addCase(signupAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Signup failed";
      });
  },
});

export const { logout, setUser, setToken } = authSlice.actions;

export const selectAuthUser = (state) => state.auth.user;
export const selectAuthToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) =>
  Boolean(state.auth.token && state.auth.user);

export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
