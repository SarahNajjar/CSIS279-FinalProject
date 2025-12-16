// ===========================================
// App.jsx
// -------------------------------------------
// Root application entry point.
// - Wraps the app with Redux Provider
// - Enables React Router via BrowserRouter
// - Injects the global Redux store
// ===========================================

import "./App.css";                 // Global app-level styles
import { BrowserRouter } from "react-router-dom"; // Enables client-side routing
import { Provider } from "react-redux";           // Makes Redux store available to app
import store from "./store/store";                 // Redux store configuration
import AppRouter from "./Router";                  // Centralized route definitions

export default function App() {
    return (
        // Redux Provider: gives all components access to the store
        <Provider store={store}>
            {/* BrowserRouter enables routing with clean URLs */}
            <BrowserRouter>
                {/* AppRouter contains all route definitions */}
                <AppRouter />
            </BrowserRouter>
        </Provider>
    );
}
