"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import axios from 'axios';
import { User, Mail, Phone, Lock, Loader2, Save } from 'lucide-react';

export default function DevoteeProfilePage() {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Profile Form
  const {
    register: regProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: errorsProfile }
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    }
  });

  // Password Form
  const {
    register: regPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: errorsPassword }
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  // Handle Profile Update
  const onUpdateProfile = async (data: any) => {
    try {
      setSavingProfile(true);
      const res = await axios.put('/api/users/profile/update', data);
      if (res.data && res.data.success) {
        showToast('Devotee profile updated successfully', 'success');
        await refreshUser(); // update context user info
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to update profile details';
      showToast(errMsg, 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Password Modification
  const onUpdatePassword = async (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    try {
      setSavingPassword(true);
      const res = await axios.put('/api/users/profile/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });

      if (res.data && res.data.success) {
        showToast('Password updated successfully', 'success');
        resetPasswordForm(); // clear credentials input fields
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Incorrect current password';
      showToast(errMsg, 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-divine-gold/20 pb-4">
        <h1 className="font-display text-2xl font-bold text-spiritual-maroon">Account & Profile Settings</h1>
        <p className="text-xs text-gray-500 font-serif">Modify your contact details and security passwords</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Profile Card */}
        <div className="bg-sand p-6 rounded-xl border border-divine-gold/30 shadow-md space-y-5">
          <h2 className="font-display text-base font-bold text-spiritual-maroon border-b border-divine-gold/20 pb-2">
            Personal Details
          </h2>

          <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  {...regProfile('name', { required: 'Name is required' })}
                  className="w-full bg-warm-cream border border-divine-gold/30 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-sacred-saffron"
                />
              </div>
              {errorsProfile.name && (
                <span className="text-xs text-red-600 font-serif">{errorsProfile.name.message}</span>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  {...regProfile('email', { required: 'Email is required' })}
                  className="w-full bg-warm-cream border border-divine-gold/30 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-sacred-saffron"
                />
              </div>
              {errorsProfile.email && (
                <span className="text-xs text-red-600 font-serif">{errorsProfile.email.message}</span>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">Phone Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="tel"
                  {...regProfile('phone', { required: 'Phone is required' })}
                  className="w-full bg-warm-cream border border-divine-gold/30 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-sacred-saffron"
                />
              </div>
              {errorsProfile.phone && (
                <span className="text-xs text-red-600 font-serif">{errorsProfile.phone.message}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="bg-sacred-saffron hover:bg-spiritual-maroon disabled:bg-gray-300 text-warm-cream border border-divine-gold/30 font-semibold px-5 py-2.5 rounded-md text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {savingProfile ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security / Password Card */}
        <div className="bg-sand p-6 rounded-xl border border-divine-gold/30 shadow-md space-y-5">
          <h2 className="font-display text-base font-bold text-spiritual-maroon border-b border-divine-gold/20 pb-2">
            Change Password
          </h2>

          <form onSubmit={handlePasswordSubmit(onUpdatePassword)} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">Current Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  {...regPassword('currentPassword', { required: 'Current password is required' })}
                  placeholder="••••••••"
                  className="w-full bg-warm-cream border border-divine-gold/30 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-sacred-saffron"
                />
              </div>
              {errorsPassword.currentPassword && (
                <span className="text-xs text-red-600 font-serif">{errorsPassword.currentPassword.message}</span>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">New Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  {...regPassword('newPassword', {
                    required: 'New password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  placeholder="••••••••"
                  className="w-full bg-warm-cream border border-divine-gold/30 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-sacred-saffron"
                />
              </div>
              {errorsPassword.newPassword && (
                <span className="text-xs text-red-600 font-serif">{errorsPassword.newPassword.message}</span>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">Confirm New Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  {...regPassword('confirmPassword', { required: 'Please confirm your new password' })}
                  placeholder="••••••••"
                  className="w-full bg-warm-cream border border-divine-gold/30 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-sacred-saffron"
                />
              </div>
              {errorsPassword.confirmPassword && (
                <span className="text-xs text-red-600 font-serif">{errorsPassword.confirmPassword.message}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="bg-sacred-saffron hover:bg-spiritual-maroon disabled:bg-gray-300 text-warm-cream border border-divine-gold/30 font-semibold px-5 py-2.5 rounded-md text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {savingPassword ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
