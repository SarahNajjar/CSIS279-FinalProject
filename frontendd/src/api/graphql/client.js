import axios from "axios";

export const graphqlClient = axios.create({
  baseURL: "http://localhost:4000/graphql",
  headers: {
    "Content-Type": "application/json",
  },

  // allow reading GraphQL errors from response.data even when status is 400
  validateStatus: () => true,
});
