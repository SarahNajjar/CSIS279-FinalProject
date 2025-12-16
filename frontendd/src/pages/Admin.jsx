// ===========================================
// Admin.jsx (Redux version - FIXED NO LOOP)
// -------------------------------------------
// Fix: no isAuthenticated, use token+user
// Fix: do not redirect while auth.loading is true
// Fix: role-only admin check
// ===========================================

import { useState, useEffect } from "react";
import { Users, Film, Shield, LogOut, MessageSquare } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/auth/authSlice";
import { UserManagement } from "../components/organisms/UserManagement";
import { MovieManagement } from "../components/organisms/MovieManagement";
import { ReviewManagement } from "../components/organisms/ReviewManagement";
import { useNavigate } from "react-router-dom";

function isAdminUser(user) {
  return String(user?.role || "").toLowerCase() === "admin";
}

export function Admin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, token, loading } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    if (loading) return;

    const isAuthed = Boolean(token && user);

    if (!isAuthed) {
      navigate("/login", { replace: true });
      return;
    }

    if (!isAdminUser(user)) {
      navigate("/", { replace: true });
    }
  }, [loading, token, user, navigate]);

  const tabs = [
    { id: "users", label: "Users", icon: Users },
    { id: "movies", label: "Movies", icon: Film },
    { id: "reviews", label: "Reviews", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-red-500" />
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            </div>

            <button
              onClick={() => {
                dispatch(logout());
                navigate("/login", { replace: true });
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-lg transition font-medium
                    ${isActive ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-800"}`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "users" && <UserManagement />}
        {activeTab === "movies" && <MovieManagement />}
        {activeTab === "reviews" && <ReviewManagement />}
      </div>
    </div>
  );
}
