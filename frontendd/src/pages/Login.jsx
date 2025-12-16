// ===========================================
// Login.jsx (Redux Version - FIXED)
// -------------------------------------------
// Fix: admin check uses role only (no is_admin)
// ===========================================

import React, { useState, useEffect } from "react";
import { Film } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  loginAsync,
  selectAuthUser,
  selectAuthError,
  selectAuthLoading,
} from "../store/auth/authSlice";

function isAdminUser(user) {
  return String(user?.role || "").toLowerCase() === "admin";
}

export function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectAuthUser);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (!user) return;
    navigate(isAdminUser(user) ? "/admin" : "/", { replace: true });
  }, [user, navigate]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginAsync({ email: form.email, password: form.password }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700">
        <div className="flex items-center justify-center mb-8">
          <Film className="w-10 h-10 text-red-500 mr-3" />
          <h1 className="text-3xl font-bold text-white">CineStream</h1>
        </div>

        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(value) => handleChange("email", value)}
            placeholder="you@example.com"
          />

          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(value) => handleChange("password", value)}
            placeholder="••••••••"
          />

          {error && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-400 text-sm">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-red-500 hover:text-red-400 font-medium"
            type="button"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, type, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    </div>
  );
}
