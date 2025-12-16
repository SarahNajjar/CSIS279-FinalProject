// ===========================================
// index.jsx
// -------------------------------------------
// App entry point. Mounts the React app and
// sets up Redux, Auth Provider, Router, and
// performance reporting.
// ===========================================

import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

const root = ReactDOM.createRoot(
    document.getElementById('root')
);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

