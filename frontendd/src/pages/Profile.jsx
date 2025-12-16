import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Star, MessageSquare } from 'lucide-react';

// Redux actions
import {
  fetchUserByIdAsync,
  fetchUserStatsAsync,
} from '../store/users/usersSlice';

import { selectAuthUser } from '../store/auth/authSlice';

// ===========================================
// Profile Component
// ===========================================
export function Profile() {
  const dispatch = useDispatch();

  // Logged in user
  const user = useSelector(selectAuthUser);

  // Redux data
  const { selectedUser, stats, status } = useSelector((state) => state.users);

  // ===========================================
  // Load User + Stats
  // ===========================================
  useEffect(() => {
    if (!user || !user.id) return;

    dispatch(fetchUserByIdAsync(user.id)).then((action) => {
      const data = action.payload;
      if (data?.id) {
        dispatch(fetchUserStatsAsync(data.id));
      }
    });
  }, [user, dispatch]);

  // ===========================================
  // Loading
  // ===========================================
  if (status === 'loading' || !selectedUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <p className="text-gray-400 text-lg">Loading profile...</p>
      </div>
    );
  }

  // ===========================================
  // UI Layout
  // ===========================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-4xl mx-auto p-8">

        {/* Profile Card */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">

          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center space-x-6">

              <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-12 h-12 text-white" />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-white">
                  {selectedUser.username || "User"}
                </h1>
                <p className="text-gray-500 text-sm">
                  {user?.email || "No email"}
                </p>
              </div>

            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={<MessageSquare className="w-6 h-6" />}
              label="Reviews"
              value={stats?.totalReviews ?? 0}
            />

            <StatCard
              icon={<Star className="w-6 h-6" />}
              label="Watchlist"
              value={stats?.watchlistCount ?? 0}
            />
          </div>

        </div>

      </div>
    </div>
  );
}

// ===========================================
// StatCard Component
// ===========================================
function StatCard({ icon, label, value }) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700 hover:border-red-600 transition">
      <div className="flex justify-center mb-2 text-red-500">{icon}</div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}
