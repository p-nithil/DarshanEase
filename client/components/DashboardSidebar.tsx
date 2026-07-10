"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Landmark,
  User,
  CalendarDays,
  History,
  Settings,
  LayoutDashboard,
  Users,
  Compass,
  FileBarChart,
  LogOut,
  Home
} from 'lucide-react';

interface SidebarProps {
  isAdmin?: boolean;
}

export default function DashboardSidebar({ isAdmin = false }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const userLinks = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Bookings', href: '/dashboard/bookings', icon: CalendarDays },
    { name: 'Profile Settings', href: '/dashboard/profile', icon: User },
  ];

  const adminLinks = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Manage Temples', href: '/admin/temples', icon: Landmark },
    { name: 'Manage Slots', href: '/admin/slots', icon: History },
    { name: 'Manage Bookings', href: '/admin/bookings', icon: CalendarDays },
    { name: 'Manage Users', href: '/admin/users', icon: Users },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <aside className="w-64 bg-sand border-r border-divine-gold/30 flex flex-col h-full min-h-screen">
      {/* Header Logo */}
      <div className="p-6 border-b border-divine-gold/20 bg-spiritual-maroon text-warm-cream">
        <Link href="/" className="flex items-center gap-2 group justify-center">
          <div className="bg-sacred-saffron p-1 rounded-full border border-divine-gold">
            <Landmark className="w-5 h-5" />
          </div>
          <span className="font-display font-bold tracking-wider text-lg text-divine-gold">
            DarshanEase
          </span>
        </Link>
        {user && (
          <div className="mt-4 text-center">
            <p className="text-sm font-semibold truncate text-warm-cream">{user.name}</p>
            <p className="text-[10px] text-warm-cream/70 uppercase tracking-widest font-bold mt-0.5">
              {user.role} Portal
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-spiritual-maroon text-warm-cream border border-divine-gold/30 shadow-md'
                  : 'text-gray-700 hover:bg-warm-cream hover:text-spiritual-maroon border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-sacred-saffron' : 'text-gray-500'}`} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Controls */}
      <div className="p-4 border-t border-divine-gold/20 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-warm-cream hover:text-spiritual-maroon transition-colors"
        >
          <Home className="w-4 h-4 text-gray-500" />
          <span>Back to Home</span>
        </Link>
        
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2.5 w-full text-left rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span>Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}
