"use client";

import React, { useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import api from '@/lib/api';
import { Landmark, Users, CalendarDays, TrendingUp, IndianRupee, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Booking {
  _id: string;
  bookingCode: string;
  totalPrice: number;
  bookingStatus: 'confirmed' | 'cancelled';
  date: string;
  darshanType: string;
  persons: number;
  templeId?: { name: string };
  userId?: { name: string; email: string };
}

export default function AdminDashboardHome() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    bookingsCount: 0,
    revenue: 0,
    templesCount: 0,
    usersCount: 0
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        // Parallel requests to load dashboard aggregates
        const [bookingsRes, templesRes, usersRes] = await Promise.all([
          api.get('/api/bookings/all'),
          api.get('/api/temples'),
          api.get('/api/users')
        ]);

        if (bookingsRes.data.success && templesRes.data.success && usersRes.data.success) {
          const allBookings = bookingsRes.data.data;
          
          // Calculate stats
          const totalRevenue = allBookings
            .filter((b: Booking) => b.bookingStatus === 'confirmed')
            .reduce((acc: number, curr: Booking) => acc + curr.totalPrice, 0);

          setStats({
            bookingsCount: allBookings.length,
            revenue: totalRevenue,
            templesCount: templesRes.data.count,
            usersCount: usersRes.data.count
          });

          setRecentBookings(allBookings.slice(0, 5)); // show latest 5
        }
      } catch (err) {
        showToast('Error retrieving administrative statistics', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, [showToast]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-8 h-8 text-sacred-saffron animate-spin" />
        <p className="text-xs text-gray-500 font-serif">Aggregating platform reports...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="border-b border-divine-gold/20 pb-4">
        <h1 className="font-display text-2xl font-bold text-spiritual-maroon">Administrative Command Center</h1>
        <p className="text-xs text-gray-500 font-serif">Real-time statistics, revenue reporting, and booking auditing</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <div className="bg-sand p-6 rounded-xl border border-divine-gold/20 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Sales</p>
            <p className="text-2xl font-bold font-serif text-spiritual-maroon flex items-center">
              <IndianRupee className="w-5 h-5 flex-shrink-0" />
              <span>{stats.revenue}</span>
            </p>
          </div>
          <div className="bg-emerald-500/10 p-3 rounded-full text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Bookings count */}
        <div className="bg-sand p-6 rounded-xl border border-divine-gold/20 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Bookings</p>
            <p className="text-2xl font-bold font-serif text-spiritual-maroon">{stats.bookingsCount}</p>
          </div>
          <div className="bg-sacred-saffron/10 p-3 rounded-full text-sacred-saffron">
            <CalendarDays className="w-6 h-6" />
          </div>
        </div>

        {/* Temples count */}
        <div className="bg-sand p-6 rounded-xl border border-divine-gold/20 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Active Temples</p>
            <p className="text-2xl font-bold font-serif text-spiritual-maroon">{stats.templesCount}</p>
          </div>
          <div className="bg-amber-500/10 p-3 rounded-full text-sacred-saffron">
            <Landmark className="w-6 h-6" />
          </div>
        </div>

        {/* Users count */}
        <div className="bg-sand p-6 rounded-xl border border-divine-gold/20 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Registered Devotees</p>
            <p className="text-2xl font-bold font-serif text-spiritual-maroon">{stats.usersCount}</p>
          </div>
          <div className="bg-blue-500/10 p-3 rounded-full text-blue-600">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-divine-gold/20 pb-2">
          <h3 className="font-display font-bold text-gray-800 text-lg">Recent Booking Bookings</h3>
          <Link
            href="/admin/bookings"
            className="text-xs font-semibold text-spiritual-maroon hover:text-sacred-saffron transition-colors"
          >
            Manage All Bookings
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="bg-sand p-8 text-center rounded-xl border border-divine-gold/20 text-gray-500 font-serif">
            No booking actions recorded yet.
          </div>
        ) : (
          <div className="bg-sand rounded-xl border border-divine-gold/30 overflow-hidden shadow-md">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-spiritual-maroon text-warm-cream border-b border-divine-gold/30">
                  <th className="p-4 font-display font-semibold uppercase tracking-wider text-xs">Code</th>
                  <th className="p-4 font-display font-semibold uppercase tracking-wider text-xs">Devotee</th>
                  <th className="p-4 font-display font-semibold uppercase tracking-wider text-xs">Temple</th>
                  <th className="p-4 font-display font-semibold uppercase tracking-wider text-xs">Category</th>
                  <th className="p-4 font-display font-semibold uppercase tracking-wider text-xs">Status</th>
                  <th className="p-4 font-display font-semibold uppercase tracking-wider text-xs">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divine-gold/15">
                {recentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-warm-cream/50 transition-colors">
                    <td className="p-4 font-bold text-sacred-saffron">{b.bookingCode}</td>
                    <td className="p-4">
                      <p className="font-semibold text-gray-800">{b.userId?.name || 'Deleted Devotee'}</p>
                      <p className="text-xs text-gray-500">{b.userId?.email || ''}</p>
                    </td>
                    <td className="p-4 font-semibold text-gray-700">{b.templeId?.name}</td>
                    <td className="p-4 font-serif">{b.darshanType} (x{b.persons})</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${
                          b.bookingStatus === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="p-4 font-serif font-bold text-spiritual-maroon">₹{b.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
