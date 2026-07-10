"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Landmark, Calendar, Award, ShieldAlert, ArrowRight, Loader2 } from 'lucide-react';

interface Booking {
  _id: string;
  bookingCode: string;
  date: string;
  darshanType: string;
  timeSlot: string;
  persons: number;
  totalPrice: number;
  bookingStatus: 'confirmed' | 'cancelled';
  templeId: {
    name: string;
    location: string;
  };
}

export default function UserDashboardHome() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const res = await axios.get('/api/bookings/my');
        if (res.data && res.data.success) {
          setBookings(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyBookings();
  }, []);

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.bookingStatus === 'confirmed').length;
  const upcomingBookings = bookings.filter(
    (b) => b.bookingStatus === 'confirmed' && new Date(b.date) >= new Date()
  ).length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-sand p-8 rounded-xl border border-divine-gold/30 shadow-md relative overflow-hidden">
        {/* Background watermark */}
        <div className="absolute right-6 bottom-[-20px] opacity-10 text-spiritual-maroon pointer-events-none select-none">
          <Landmark className="w-48 h-48" />
        </div>

        <div className="relative z-10 space-y-2">
          <p className="text-sacred-saffron font-semibold text-xs tracking-wider uppercase">Welcome Back</p>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-spiritual-maroon">
            Namaste, {user?.name}
          </h1>
          <p className="text-gray-600 text-sm font-serif max-w-lg leading-relaxed">
            Welcome to your spiritual reservation dashboard. View booking confirmation details, cancel schedules, or register new passes for upcoming festivals.
          </p>
        </div>
      </div>

      {/* Analytics/Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat 1 */}
        <div className="bg-sand p-6 rounded-xl border border-divine-gold/20 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Passes Booked</p>
            <p className="text-2xl font-bold font-serif text-spiritual-maroon">{totalBookings}</p>
          </div>
          <div className="bg-sacred-saffron/10 p-3 rounded-full text-sacred-saffron">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-sand p-6 rounded-xl border border-divine-gold/20 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Confirmed Bookings</p>
            <p className="text-2xl font-bold font-serif text-spiritual-maroon">{confirmedBookings}</p>
          </div>
          <div className="bg-emerald-500/10 p-3 rounded-full text-emerald-600">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-sand p-6 rounded-xl border border-divine-gold/20 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Upcoming Darshans</p>
            <p className="text-2xl font-bold font-serif text-spiritual-maroon">{upcomingBookings}</p>
          </div>
          <div className="bg-amber-500/10 p-3 rounded-full text-sacred-saffron">
            <Landmark className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings Section (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-divine-gold/20">
            <h3 className="font-display font-bold text-gray-800 text-lg">Upcoming Bookings</h3>
            <Link href="/dashboard/bookings" className="text-xs font-semibold text-spiritual-maroon hover:text-sacred-saffron transition-colors flex items-center gap-0.5">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-10 gap-1.5 text-xs text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin text-sacred-saffron" />
              <span>Fetching bookings...</span>
            </div>
          ) : bookings.filter((b) => b.bookingStatus === 'confirmed').length === 0 ? (
            <div className="bg-sand p-8 text-center rounded-xl border border-dashed border-divine-gold/20">
              <p className="text-gray-500 text-sm font-serif mb-4">No active or upcoming bookings found.</p>
              <Link href="/temples" className="inline-block bg-sacred-saffron hover:bg-spiritual-maroon text-warm-cream border border-divine-gold/30 px-5 py-2.5 rounded-md font-semibold text-xs transition-colors">
                Book Darshan Pass
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings
                .filter((b) => b.bookingStatus === 'confirmed')
                .slice(0, 3)
                .map((b) => (
                  <div key={b._id} className="bg-sand p-5 rounded-xl border border-divine-gold/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="space-y-1">
                      <span className="text-[10px] bg-sacred-saffron/15 text-sacred-saffron font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {b.bookingCode}
                      </span>
                      <h4 className="font-display font-bold text-gray-800 text-base">{b.templeId?.name}</h4>
                      <p className="text-xs text-gray-500 font-serif">
                        {new Date(b.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-xs font-semibold text-spiritual-maroon">
                        Slot: {b.timeSlot} | Pass: {b.darshanType}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-start sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 border-divine-gold/10 pt-3 sm:pt-0">
                      <span className="text-sm font-bold text-spiritual-maroon font-serif">₹{b.totalPrice}</span>
                      <span className="text-xs text-gray-500 font-serif">{b.persons} Devotee{b.persons > 1 ? 's' : ''}</span>
                      <Link href="/dashboard/bookings" className="text-xs text-sacred-saffron hover:underline font-bold mt-1.5 block">
                        View Receipt
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Right Info Box */}
        <div className="lg:col-span-1 bg-sand p-6 rounded-xl border border-divine-gold/30 shadow-md h-fit space-y-4">
          <h3 className="font-display font-bold text-spiritual-maroon border-b border-divine-gold/20 pb-2 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-sacred-saffron" />
            <span>Devotional Rules</span>
          </h3>
          <ul className="space-y-3 text-xs text-gray-600 font-serif leading-relaxed">
            <li className="flex items-start gap-1.5">
              <span>•</span>
              <span>Devotees must report 30 minutes prior to their selected time slot at the designated entry point.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span>•</span>
              <span>Traditional Indian dress code is compulsory. Men: Dhoti/Kurta. Women: Saree/Salwar.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span>•</span>
              <span>Please show digital/printed receipt with booking code at verification check-posts.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
