"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Menu, X, Landmark, User, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully', 'success');
    } catch (error) {
      showToast('Error logging out', 'error');
    }
  };

  return (
    <nav className="bg-spiritual-maroon border-b border-divine-gold text-warm-cream shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-sacred-saffron p-1.5 rounded-full border border-divine-gold transition-transform group-hover:rotate-45 duration-500">
                <Landmark className="w-6 h-6 text-warm-cream" />
              </div>
              <span className="font-display text-xl sm:text-2xl font-bold tracking-wider bg-gradient-to-r from-warm-cream via-divine-gold to-sacred-saffron bg-clip-text text-transparent">
                DarshanEase
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-divine-gold transition-colors font-medium text-sm">
              Home
            </Link>
            <Link href="/temples" className="hover:text-divine-gold transition-colors font-medium text-sm">
              Temples
            </Link>
            <Link href="/about" className="hover:text-divine-gold transition-colors font-medium text-sm">
              How it works
            </Link>
            <Link href="/contact" className="hover:text-divine-gold transition-colors font-medium text-sm">
              Contact
            </Link>

            {/* Auth Dropdowns */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 bg-black/25 hover:bg-black/40 border border-divine-gold/30 px-3 py-1.5 rounded-full transition-colors text-sm font-medium"
                >
                  <User className="w-4 h-4 text-sacred-saffron" />
                  <span>{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-warm-cream text-foreground rounded-md shadow-xl border border-divine-gold/30 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold truncate">{user.email}</p>
                    </div>

                    {user.role === 'admin' ? (
                      <Link
                        href="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-sand transition-colors text-spiritual-maroon font-semibold"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-sand transition-colors text-spiritual-maroon font-semibold"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard/bookings"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-sand transition-colors text-gray-700"
                        >
                          My Bookings
                        </Link>
                      </>
                    )}

                    <Link
                      href={user.role === 'admin' ? '/admin/profile' : '/dashboard/profile'}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-sand transition-colors text-gray-700"
                    >
                      Profile Settings
                    </Link>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 transition-colors border-t border-gray-100"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-medium hover:text-divine-gold transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="bg-sacred-saffron hover:bg-deep-rust text-warm-cream border border-divine-gold text-sm font-medium px-4 py-2 rounded-md transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-warm-cream hover:text-divine-gold focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-spiritual-maroon border-t border-divine-gold/30 px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md hover:bg-black/20 text-base font-medium"
          >
            Home
          </Link>
          <Link
            href="/temples"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md hover:bg-black/20 text-base font-medium"
          >
            Temples
          </Link>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md hover:bg-black/20 text-base font-medium"
          >
            How it works
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md hover:bg-black/20 text-base font-medium"
          >
            Contact
          </Link>

          {user ? (
            <div className="pt-4 border-t border-divine-gold/30 mt-4">
              <div className="px-3 py-2 text-sm text-divine-gold">
                Logged in: <span className="text-warm-cream font-bold">{user.name}</span>
              </div>
              {user.role === 'admin' ? (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md hover:bg-black/20 text-base font-medium text-sacred-saffron"
                >
                  Admin Panel
                </Link>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md hover:bg-black/20 text-base font-medium text-sacred-saffron"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/bookings"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md hover:bg-black/20 text-base font-medium"
                  >
                    My Bookings
                  </Link>
                </>
              )}
              <Link
                href={user.role === 'admin' ? '/admin/profile' : '/dashboard/profile'}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md hover:bg-black/20 text-base font-medium"
              >
                Profile Settings
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left px-3 py-2 rounded-md hover:bg-red-950 text-red-400 text-base font-medium border-t border-divine-gold/10 mt-2"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-divine-gold/30 mt-4 flex flex-col gap-2 px-3">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="text-center py-2 border border-warm-cream/50 rounded-md font-medium"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="text-center py-2 bg-sacred-saffron hover:bg-deep-rust text-warm-cream rounded-md border border-divine-gold font-medium"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
