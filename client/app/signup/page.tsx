"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Landmark, User, Mail, Phone, Lock, Loader2, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const { user, register: authRegister, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: ''
    }
  });

  // Redirect if logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, router]);

  const onSubmit = async (data: any) => {
    try {
      setSubmitting(true);
      await authRegister(data.name, data.email, data.phone, data.password);
      showToast('Registration successful! Welcome to DarshanEase.', 'success');
    } catch (error: any) {
      showToast(error.message || 'Registration failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-cream">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative backdrop */}
        <div className="absolute opacity-[0.02] text-spiritual-maroon select-none pointer-events-none animate-spin-slow">
          <svg className="w-[600px] h-[600px]" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" />
          </svg>
        </div>

        <div className="max-w-md w-full bg-sand rounded-xl border border-divine-gold/30 shadow-xl overflow-hidden relative z-10">
          {/* Card Header */}
          <div className="bg-spiritual-maroon text-warm-cream py-6 text-center border-b border-divine-gold/40">
            <div className="bg-sacred-saffron p-2.5 rounded-full border border-divine-gold w-fit mx-auto mb-2">
              <Landmark className="w-6 h-6" />
            </div>
            <h2 className="font-display text-xl font-bold tracking-wider">Devotee Registration</h2>
            <p className="text-xs text-warm-cream/80 font-serif mt-1">Begin your pilgrimage booking journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
                  className="w-full bg-warm-cream border border-divine-gold/30 rounded-md py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-sacred-saffron"
                  placeholder="Rahul Sharma"
                />
              </div>
              {errors.name && (
                <span className="text-xs text-red-600 font-serif">{errors.name.message}</span>
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
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Please provide a valid email address'
                    }
                  })}
                  className="w-full bg-warm-cream border border-divine-gold/30 rounded-md py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-sacred-saffron"
                  placeholder="rahul@example.com"
                />
              </div>
              {errors.email && (
                <span className="text-xs text-red-600 font-serif">{errors.email.message}</span>
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
                  {...register('phone', {
                    required: 'Phone number is required',
                    minLength: {
                      value: 10,
                      message: 'Phone number must be at least 10 digits'
                    }
                  })}
                  className="w-full bg-warm-cream border border-divine-gold/30 rounded-md py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-sacred-saffron"
                  placeholder="9876543210"
                />
              </div>
              {errors.phone && (
                <span className="text-xs text-red-600 font-serif">{errors.phone.message}</span>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  className="w-full bg-warm-cream border border-divine-gold/30 rounded-md py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-sacred-saffron"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <span className="text-xs text-red-600 font-serif">{errors.password.message}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || authLoading}
              className="w-full bg-sacred-saffron hover:bg-deep-rust disabled:bg-amber-400 text-warm-cream border border-divine-gold py-3 rounded-md font-semibold transition-colors flex items-center justify-center gap-2 text-sm shadow-md mt-2"
            >
              {submitting || authLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering Devotee...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Bottom Link */}
            <div className="text-center text-xs font-serif text-gray-600 pt-4 border-t border-divine-gold/10">
              Already registered?{' '}
              <Link href="/login" className="text-spiritual-maroon hover:text-sacred-saffron font-bold transition-colors">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
