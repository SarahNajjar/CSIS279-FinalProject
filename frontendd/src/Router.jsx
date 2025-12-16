// ===========================================
// Router.jsx (Redux Version — FIXED CLEAN)
// ===========================================

import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthUser, selectIsAuthenticated } from "./store/auth/authSlice";

// Layout
import AppLayout from "./layouts/AppLayout";

// Pages
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Profile } from "./pages/Profile";
import { Admin } from "./pages/Admin";
import { MovieDetails } from "./pages/MovieDetails";
import { Watchlist } from "./pages/Watchlist";
import { TopRated } from "./pages/TopRated";

// ===========================================
// PROTECTED ROUTES
// ===========================================
function PrivateRoute({ children }) {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function isAdminUser(user) {
    return user?.is_admin === true || String(user?.role || "").toLowerCase() === "admin";
}

function AdminRoute({ children }) {
    const { user, token, status } = useSelector((s) => s.auth);

    // ✅ wait until auth finishes (prevents flicker)
    if (status === "loading") return null; // or a spinner

    if (!token || !user) return <Navigate to="/login" replace />;
    if (!isAdminUser(user)) return <Navigate to="/" replace />;

    return children;
}

// ===========================================
// ROUTER
// ===========================================
export default function AppRouter() {
    return (
        <Routes>

            {/* Public pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* MAIN HOME PAGE */}
            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <AppLayout>
                            <Home />
                        </AppLayout>
                    </PrivateRoute>
                }
            />

            {/* HOME button route */}
            <Route
                path="/home"
                element={
                    <PrivateRoute>
                        <AppLayout>
                            <Home />
                        </AppLayout>
                    </PrivateRoute>
                }
            />

            {/* TOP RATED page */}
            <Route
                path="/top-rated"
                element={
                    <AppLayout>
                        <TopRated />
                    </AppLayout>
                }
            />

            {/* Protected routes */}
            <Route
                path="/profile"
                element={
                    <PrivateRoute>
                        <AppLayout>
                            <Profile />
                        </AppLayout>
                    </PrivateRoute>
                }
            />

            <Route
                path="/watchlist"
                element={
                    <PrivateRoute>
                        <AppLayout>
                            <Watchlist />
                        </AppLayout>
                    </PrivateRoute>
                }
            />

            {/* Admin route */}
            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <AppLayout>
                            <Admin />
                        </AppLayout>
                    </AdminRoute>
                }
            />

            {/* Movie details */}
            <Route
                path="/movie/:id"
                element={
                    <AppLayout>
                        <MovieDetails />
                    </AppLayout>
                }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
