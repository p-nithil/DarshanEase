"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Landmark, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { user, login, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Redirect if already logged in (e.g. came back to login page after session restored)
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'admin') {
        router.replace('/admin');
      } else {
        router.replace('/');
      }
    }
  }, [user, authLoading, router]);

  const onSubmit = async (data: any) => {
    try {
      setSubmitting(true);
      await login(data.email, data.password);
      showToast('Logged in successfully! Welcome back 🙏', 'success');
      // Redirect immediately after successful login
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect') || '/';
      router.replace(redirect);
    } catch (error: any) {
      showToast(error.message || 'Login failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-cream">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative Mandala backdrop */}
        <div className="absolute opacity-[0.03] text-spiritual-maroon select-none pointer-events-none animate-spin-slow">
          <svg className="w-[600px] h-[600px]" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <path d="M50 0 C40 15, 60 15, 50 0 M50 100 C40 85, 60 85, 50 100" />
          </svg>
        </div>

        <div className="max-w-md w-full bg-sand rounded-xl border border-divine-gold/30 shadow-xl overflow-hidden relative z-10">
          {/* Card Header */}
          <div className="bg-spiritual-maroon text-warm-cream py-6 text-center border-b border-divine-gold/40 relative">
            <div className="bg-sacred-saffron p-2.5 rounded-full border border-divine-gold w-fit mx-auto mb-2">
              <Landmark className="w-6 h-6" />
            </div>
            <h2 className="font-display text-xl font-bold tracking-wider">Devotee Login</h2>
            <p className="text-xs text-warm-cream/80 font-serif mt-1">Access your darshan dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
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
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <span className="text-xs text-red-600 font-serif">{errors.email.message}</span>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">Password</label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  {...register('password', {
                    required: 'Password is required'
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
              className="w-full bg-sacred-saffron hover:bg-deep-rust disabled:bg-amber-400 text-warm-cream border border-divine-gold py-3 rounded-md font-semibold transition-colors flex items-center justify-center gap-2 text-sm shadow-md"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Bottom Links */}
            <div className="text-center text-xs font-serif text-gray-600 pt-4 border-t border-divine-gold/10">
              New devotee?{' '}
              <Link href="/signup" className="text-spiritual-maroon hover:text-sacred-saffron font-bold transition-colors">
                Create an account
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
