// ===========================================
// Signup.jsx (Redux Version)
// -------------------------------------------
// Uses Redux usersSlice instead of AuthContext
// ===========================================

import React, { useState, useEffect } from 'react';
import { Film } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { createUserAsync } from '../store/users/usersSlice';

export function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { status, error } = useSelector((state) => state.users);

  // Local state
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [info, setInfo] = useState('');

  // -------------------------------------------
  // Handle input changes
  // -------------------------------------------
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // -------------------------------------------
  // Submit form using Redux thunk
  // -------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setInfo('');

    if (form.password.length < 6)
      return alert('Password must be at least 6 characters');
    if (form.username.length < 3)
      return alert('Username must be at least 3 characters');

    try {
      const result = await dispatch(
        createUserAsync({
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
        })
      );

      if (result.meta.requestStatus === 'fulfilled') {
        setInfo('Account created successfully! Redirecting...');
        setTimeout(() => navigate('/'), 800);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------------------------------
  // UI (same design)
  // -------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700">

        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <Film className="w-10 h-10 text-red-500 mr-3" />
          <h1 className="text-3xl font-bold text-white">CineStream</h1>
        </div>

        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Create Account
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Username"
            value={form.username}
            onChange={(v) => handleChange('username', v)}
            placeholder="moviefan123"
          />

          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) => handleChange('email', v)}
            placeholder="you@example.com"
          />

          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(v) => handleChange('password', v)}
            placeholder="••••••••"
          />

          {/* Backend Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {info && (
            <div className="bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded-lg text-sm">
              {info}
            </div>
          )}

          <button
            disabled={status === 'loading'}
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50"
          >
            {status === 'loading' ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/')}
            className="text-red-500 hover:text-red-400 font-medium"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

// ===========================================
// Input Component (same as before)
// ===========================================
function Input({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        required
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
      />
    </div>
  );
}
