// ===========================================
// index.jsx
// -------------------------------------------
// Application entry point.
// - Creates the React root
// - Mounts the App component
// - Wraps the app in React.StrictMode
// ===========================================

import React from 'react';                     // Core React library
import ReactDOM from 'react-dom/client';       // React 18 root API

import App from './App';                       // Main App component

// Create a root linked to the HTML element with id="root"
const root = ReactDOM.createRoot(
    document.getElementById('root')
);

// Render the application
root.render(
    // React.StrictMode helps detect potential problems in development
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
