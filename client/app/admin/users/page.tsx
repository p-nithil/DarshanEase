"use client";

import React, { useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Users, Trash2, Edit2, Shield, Loader2 } from 'lucide-react';

interface DevoteeUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export default function AdminUsersPage() {
  const { showToast } = useToast();
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState<DevoteeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/users');
      if (res.data && res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      showToast('Error loading devotees list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (userId: string, currentRole: 'user' | 'admin') => {
    if (userId === currentAdmin?.id) {
      showToast('You cannot change your own admin role', 'error');
      return;
    }

    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Are you sure you want to change this devotee's role to ${newRole}?`)) {
      return;
    }

    try {
      setUpdatingId(userId);
      const userToUpdate = users.find((u) => u._id === userId);
      if (!userToUpdate) return;

      const res = await axios.put(`/api/users/${userId}`, {
        ...userToUpdate,
        role: newRole
      });

      if (res.data && res.data.success) {
        showToast('Devotee role updated successfully', 'success');
        fetchUsers();
      }
    } catch (err) {
      showToast('Failed to update devotee role', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === currentAdmin?.id) {
      showToast('You cannot delete your own admin account', 'error');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this devotee account? This will wipe out their credentials access.')) {
      return;
    }

    try {
      setUpdatingId(userId);
      const res = await axios.delete(`/api/users/${userId}`);
      if (res.data && res.data.success) {
        showToast('Devotee account deleted successfully', 'success');
        fetchUsers();
      }
    } catch (err) {
      showToast('Failed to delete devotee account', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-divine-gold/20 pb-4">
        <h1 className="font-display text-2xl font-bold text-spiritual-maroon flex items-center gap-2">
          <Users className="w-6 h-6 text-sacred-saffron" />
          <span>User & Devotee Administration</span>
        </h1>
        <p className="text-xs text-gray-500 font-serif">Audit registered devotee accounts, modify roles, or remove credentials access</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-sacred-saffron animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <div className="bg-sand p-8 text-center rounded-xl border border-divine-gold/20 text-gray-500 font-serif text-sm">
          No registered devotee accounts found.
        </div>
      ) : (
        <div className="bg-sand rounded-xl border border-divine-gold/30 overflow-hidden shadow-md">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-spiritual-maroon text-warm-cream border-b border-divine-gold/30">
                <th className="p-4 font-display font-semibold uppercase tracking-wider text-xs">Name</th>
                <th className="p-4 font-display font-semibold uppercase tracking-wider text-xs">Email</th>
                <th className="p-4 font-display font-semibold uppercase tracking-wider text-xs">Phone</th>
                <th className="p-4 font-display font-semibold uppercase tracking-wider text-xs">Role</th>
                <th className="p-4 font-display font-semibold uppercase tracking-wider text-xs">Registered On</th>
                <th className="p-4 font-display font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divine-gold/15">
              {users.map((devotee) => (
                <tr key={devotee._id} className="hover:bg-warm-cream/50 transition-colors">
                  <td className="p-4 font-bold text-gray-800">{devotee.name}</td>
                  <td className="p-4 font-mono text-xs text-gray-600">{devotee.email}</td>
                  <td className="p-4 font-serif text-gray-700">{devotee.phone}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        devotee.role === 'admin'
                          ? 'bg-amber-50 text-sacred-saffron border-divine-gold/40'
                          : 'bg-warm-cream text-gray-700 border-gray-200'
                      }`}
                    >
                      {devotee.role === 'admin' && <Shield className="w-3 h-3 text-sacred-saffron" />}
                      <span className="capitalize">{devotee.role}</span>
                    </span>
                  </td>
                  <td className="p-4 font-serif text-xs text-gray-500">
                    {new Date(devotee.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleRoleToggle(devotee._id, devotee.role)}
                      disabled={updatingId === devotee._id || devotee._id === currentAdmin?.id}
                      className="text-xs font-bold text-sacred-saffron hover:underline disabled:opacity-50"
                    >
                      Toggle Role
                    </button>
                    <button
                      onClick={() => handleDeleteUser(devotee._id)}
                      disabled={updatingId === devotee._id || devotee._id === currentAdmin?.id}
                      className="text-xs font-bold text-red-600 hover:text-red-800 disabled:opacity-50"
                      title="Delete devotee account"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
