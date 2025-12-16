// Import axios HTTP client library
import axios from "axios";

// Create a pre-configured Axios instance for GraphQL requests
export const graphqlClient = axios.create({
  // Base URL of the GraphQL server endpoint
  baseURL: "http://localhost:4000/graphql",

  // Default headers sent with every request
  headers: {
    // GraphQL requests are sent as JSON
    "Content-Type": "application/json",
  },

  // Override Axios default status validation
  // This allows the app to receive and handle GraphQL errors
  // from response.data even when the HTTP status code is 400
  // (GraphQL often returns errors with 200/400 statuses)
  validateStatus: () => true,
});
