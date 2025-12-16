// ===========================================
// UserManagement.jsx (Redux + GraphQL Version)
// -------------------------------------------
// Uses Redux Toolkit slices instead of REST.
// UI design remains EXACTLY the same.
// ===========================================

import React, { useEffect, useState } from 'react';
import { Search, Loader2, Trash2, Shield } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

import {
    fetchUsersAsync,
    deleteUserAsync
} from '../../store/users/usersSlice';

export function UserManagement() {

    // -------------------------------------------
    // Redux
    // -------------------------------------------
    const dispatch = useDispatch();
    const { data: users, status, error } = useSelector((state) => state.users);

    // -------------------------------------------
    // Local state (search only)
    // -------------------------------------------
    const [search, setSearch] = useState('');

    // -------------------------------------------
    // Load users on mount
    // -------------------------------------------
    useEffect(() => {
        dispatch(fetchUsersAsync());
    }, [dispatch]);

    // -------------------------------------------
    // Search filter
    // -------------------------------------------
    const filtered =
        users?.filter((u) =>
            `${u.username || ""} ${u.email || ""}`
                .toLowerCase()
                .includes(search.toLowerCase())
        ) || [];

    // -------------------------------------------
    // Delete user (Redux)
    // -------------------------------------------
    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this user?");
        if (!confirm) return;

        dispatch(deleteUserAsync(id));
    };

    const loading = status === 'loading';

    // ===========================================
    // UI Rendering — **IDENTICAL DESIGN**
    // ===========================================
    return (
        <div className="p-6 bg-gray-950 text-white rounded-xl shadow-md">

            {/* =============================== */}
            {/* Header Section */}
            {/* =============================== */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-red-500" />
                    <h2 className="text-2xl font-bold">User Management</h2>
                </div>
            </div>

            {/* =============================== */}
            {/* Search Bar */}
            {/* =============================== */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
            </div>

            {/* =============================== */}
            {/* Loading */}
            {/* =============================== */}
            {loading && (
                <div className="flex justify-center py-10">
                    <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                    <p className="ml-2 text-gray-400">Loading users...</p>
                </div>
            )}

            {/* =============================== */}
            {/* Error */}
            {/* =============================== */}
            {error && (
                <p className="text-red-400 text-center font-medium py-2">
                    {error}
                </p>
            )}

            {/* =============================== */}
            {/* User Table */}
            {/* =============================== */}
            {!loading && filtered.length > 0 ? (
                <div className="overflow-hidden rounded-lg border border-gray-800 shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-900 text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3 text-left border-b border-gray-800">ID</th>
                                <th className="px-6 py-3 text-left border-b border-gray-800">Username</th>
                                <th className="px-6 py-3 text-left border-b border-gray-800">Email</th>
                                <th className="px-6 py-3 text-left border-b border-gray-800">Role</th>
                                <th className="px-6 py-3 text-center border-b border-gray-800">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((user) => (
                                <tr
                                    key={user.id}
                                    className="hover:bg-gray-900 transition-colors border-b border-gray-800"
                                >
                                    <td className="px-6 py-3 text-gray-400">{user.id}</td>
                                    <td className="px-6 py-3 text-white">{user.username}</td>
                                    <td className="px-6 py-3 text-gray-300">{user.email}</td>

                                    {/* Role Badge */}
                                    <td className="px-6 py-3">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full font-medium ${user.role === 'admin'
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                : 'bg-gray-700/40 text-gray-300 border border-gray-600/40'
                                                }`}
                                        >
                                            {user.role || 'user'}
                                        </span>
                                    </td>

                                    {/* Delete */}
                                    <td className="px-6 py-3 text-center">
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="text-gray-400 hover:text-red-500 transition"
                                            title="Delete User"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                !loading && <p className="text-gray-500 text-center py-12">No users found.</p>
            )}
        </div>
    );
}
