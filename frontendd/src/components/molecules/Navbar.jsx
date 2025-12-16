// ===========================================
// Navbar.jsx (Redux Version — SAME DESIGN)
// -------------------------------------------
// Identical look to your old AuthContext navbar,
// but now fully connected to Redux auth.
// ===========================================

import { Film, Search, Home, Star, Bookmark, User, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/auth/authSlice";

export function Navbar({ searchQuery, onSearchChange }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { user } = useSelector((state) => state.auth);
    const isAuthenticated = Boolean(user);

    const isAdmin =
        user?.role === "admin" || user?.isAdmin === true || user?.user_type === "admin";

    if (isAuthenticated && isAdmin) return null;

    // --- Search handler ---
    const handleSearchChange = (e) => {
        onSearchChange && onSearchChange(e.target.value);
    };

    // --- Navigation buttons (logo + pages) ---
    const renderNavLinks = () => (
        <div className="flex items-center space-x-8">

            {/* LOGO */}
            <button
                onClick={() => navigate("/home")}
                className="flex items-center space-x-2 group"
            >
                <Film className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform" />
                <span className="text-2xl font-bold text-white">CineStream</span>
            </button>

            {/* DESKTOP NAV BUTTONS */}
            <div className="hidden md:flex space-x-1">
                <NavButton
                    icon={<Home className="w-4 h-4" />}
                    label="Home"
                    active={location.pathname === "/home" || location.pathname === "/"}
                    onClick={() => navigate("/home")}
                />

                <NavButton
                    icon={<Star className="w-4 h-4" />}
                    label="Top Rated"
                    active={location.pathname === "/top-rated"}
                    onClick={() => navigate("/top-rated")}
                />

                <NavButton
                    icon={<Bookmark className="w-4 h-4" />}
                    label="Watchlist"
                    active={location.pathname === "/watchlist"}
                    onClick={() => navigate("/watchlist")}
                />
            </div>
        </div>
    );

    // --- User controls: Search + Profile + Logout ---
    const renderUserControls = () => (
        <div className="flex items-center space-x-4">

            {/* SEARCH BAR */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search movies..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 w-64 transition"
                />
            </div>

            {/* PROFILE + LOGOUT */}
            {isAuthenticated && (
                <div className="flex items-center space-x-2">

                    {/* Profile */}
                    <button
                        onClick={() => navigate("/profile")}
                        className={`p-2 rounded-lg transition ${location.pathname === "/profile"
                            ? "bg-red-600 text-white"
                            : "text-gray-300 hover:bg-gray-800"
                            }`}
                        title="Profile"
                    >
                        <User className="w-5 h-5" />
                    </button>

                    {/* Logout */}
                    <button
                        onClick={() => {
                            dispatch(logout());
                            navigate("/");
                        }}
                        className="p-2 text-gray-300 hover:bg-gray-800 rounded-lg transition"
                        title="Sign out"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <nav className="bg-black bg-opacity-95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {renderNavLinks()}
                    {renderUserControls()}
                </div>
            </div>
        </nav>
    );
}

// ===========================================
// Reusable Nav Button
// ===========================================
function NavButton({ icon, label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${active ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-800"
                }`}
        >
            {icon}
            <span className="font-medium">{label}</span>
        </button>
    );
}
