// ===========================================
// index.jsx
// -------------------------------------------
// Application entry point.
// - Initializes React 18 root
// - Wraps the app with Redux Provider
// - Mounts the App component
// ===========================================

import React from "react";                     // Core React library
import ReactDOM from "react-dom/client";       // React 18 root API
import App from "./App";                       // Main application component
import { Provider } from "react-redux";        // Redux Provider for global state
import store from "./store/store";             // Redux store configuration

// Create React root and render the application
ReactDOM.createRoot(document.getElementById("root")).render(
    // Provide Redux store to the entire app
    <Provider store={store}>
        <App />
    </Provider>
);
