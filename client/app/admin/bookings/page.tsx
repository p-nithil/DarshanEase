"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/context/ToastContext';
import axios from 'axios';
import { Search, Filter, Calendar, Loader2, CheckCircle2, XCircle, FileText, Printer, X } from 'lucide-react';

interface Booking {
  _id: string;
  bookingCode: string;
  totalPrice: number;
  bookingStatus: 'confirmed' | 'cancelled';
  date: string;
  darshanType: string;
  timeSlot: string;
  persons: number;
  createdAt: string;
  templeId?: { name: string; location: string };
  userId?: { name: string; email: string; phone: string };
}

export default function AdminBookingsPage() {
  const { showToast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const fetchAllBookings = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (dateFilter) params.append('date', dateFilter);
      if (searchTerm) params.append('search', searchTerm);

      const res = await axios.get(`/api/bookings/all?${params.toString()}`);
      if (res.data && res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      showToast('Error loading devotees bookings', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, dateFilter, showToast]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAllBookings();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchAllBookings]);

  const handleUpdateStatus = async (bookingId: string, newStatus: 'confirmed' | 'cancelled') => {
    if (!window.confirm(`Are you sure you want to change this booking status to ${newStatus}?`)) {
      return;
    }

    try {
      setUpdatingId(bookingId);
      const res = await axios.put(`/api/bookings/${bookingId}/status`, {
        bookingStatus: newStatus
      });

      if (res.data && res.data.success) {
        showToast(`Booking status updated to ${newStatus} successfully`, 'success');
        fetchAllBookings();
        // Update detail modal state if open
        if (selectedBooking && selectedBooking._id === bookingId) {
          setSelectedBooking({ ...selectedBooking, bookingStatus: newStatus });
        }
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to update booking status';
      showToast(errMsg, 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-divine-gold/20 pb-4">
        <h1 className="font-display text-2xl font-bold text-spiritual-maroon">Manage Devotee Bookings</h1>
        <p className="text-xs text-gray-500 font-serif">Audit, search, and manually update status for all temple passes</p>
      </div>

      {/* Filter toolbar */}
      <div className="bg-sand p-6 rounded-xl border border-divine-gold/30 shadow-md grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        {/* Search */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-warm-cream border border-divine-gold/30 rounded py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-sacred-saffron"
            placeholder="Search code, devotee name, email..."
          />
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-sacred-saffron flex-shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-warm-cream border border-divine-gold/30 rounded py-2 px-3 text-xs focus:outline-none focus:border-sacred-saffron"
          >
            <option value="">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-sacred-saffron flex-shrink-0" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full bg-warm-cream border border-divine-gold/30 rounded py-2 px-3 text-xs focus:outline-none focus:border-sacred-saffron"
          />
        </div>
      </div>

      {/* Table list */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-sacred-saffron animate-spin" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-sand p-8 text-center rounded-xl border border-divine-gold/20 text-gray-500 font-serif text-sm">
          No bookings found matching filters.
        </div>
      ) : (
        <div className="bg-sand rounded-xl border border-divine-gold/30 overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-spiritual-maroon text-warm-cream border-b border-divine-gold/30">
                  <th className="p-4 font-display font-semibold uppercase tracking-wider text-[10px]">Code</th>
                  <th className="p-4 font-display font-semibold uppercase tracking-wider text-[10px]">Devotee Details</th>
                  <th className="p-4 font-display font-semibold uppercase tracking-wider text-[10px]">Temple</th>
                  <th className="p-4 font-display font-semibold uppercase tracking-wider text-[10px]">Date & Time</th>
                  <th className="p-4 font-display font-semibold uppercase tracking-wider text-[10px]">Total Price</th>
                  <th className="p-4 font-display font-semibold uppercase tracking-wider text-[10px]">Status</th>
                  <th className="p-4 font-display font-semibold uppercase tracking-wider text-[10px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divine-gold/15">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-warm-cream/50 transition-colors">
                    <td className="p-4 font-bold text-sacred-saffron">{b.bookingCode}</td>
                    <td className="p-4">
                      <p className="font-semibold text-gray-800">{b.userId?.name || 'Deleted Devotee'}</p>
                      <p className="text-[10px] text-gray-500">{b.userId?.email || ''}</p>
                      <p className="text-[10px] text-gray-500">{b.userId?.phone || ''}</p>
                    </td>
                    <td className="p-4 font-semibold text-gray-700">{b.templeId?.name}</td>
                    <td className="p-4 font-serif">
                      <p>
                        {new Date(b.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-[10px] text-gray-500">{b.timeSlot}</p>
                      <p className="text-[10px] text-sacred-saffron font-bold font-sans uppercase">{b.darshanType} (x{b.persons})</p>
                    </td>
                    <td className="p-4 font-serif font-bold text-spiritual-maroon">₹{b.totalPrice}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full font-semibold border ${
                          b.bookingStatus === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="text-[10px] font-bold text-sacred-saffron hover:underline"
                      >
                        Details
                      </button>

                      {b.bookingStatus === 'confirmed' ? (
                        <button
                          onClick={() => handleUpdateStatus(b._id, 'cancelled')}
                          disabled={updatingId === b._id}
                          className="text-[10px] font-bold text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(b._id, 'confirmed')}
                          disabled={updatingId === b._id}
                          className="text-[10px] font-bold text-emerald-600 hover:text-emerald-800 disabled:opacity-50"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details receipt popup for Admin */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-sand border-2 border-divine-gold rounded-xl shadow-2xl max-w-md w-full overflow-hidden relative">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute right-4 top-4 bg-white/90 hover:bg-white text-gray-700 border border-divine-gold/30 p-1.5 rounded-full shadow transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 space-y-5">
              <div className="text-center border-b border-divine-gold/20 pb-3">
                <h3 className="font-display font-bold text-spiritual-maroon text-base">Devotee Booking Pass Audit</h3>
                <p className="text-[10px] text-gray-500 font-serif">Internal Verification Record</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-400 font-semibold uppercase">Booking Code</span>
                  <span className="font-bold text-sacred-saffron font-serif">{selectedBooking.bookingCode}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-400 font-semibold uppercase">Status</span>
                  <span className={`font-bold uppercase ${selectedBooking.bookingStatus === 'confirmed' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {selectedBooking.bookingStatus}
                  </span>
                </div>
                <div className="py-2 border-b border-gray-100 space-y-0.5">
                  <span className="text-gray-400 font-semibold uppercase">Devotee Profile</span>
                  <p className="font-semibold text-gray-800">{selectedBooking.userId?.name}</p>
                  <p className="text-[10px] text-gray-500">{selectedBooking.userId?.email} | {selectedBooking.userId?.phone}</p>
                </div>
                <div className="py-2 border-b border-gray-100 space-y-0.5">
                  <span className="text-gray-400 font-semibold uppercase">Temple</span>
                  <p className="font-semibold text-gray-800">{selectedBooking.templeId?.name}</p>
                  <p className="text-[10px] text-gray-500">{selectedBooking.templeId?.location}</p>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-400 font-semibold uppercase">Date</span>
                  <span className="font-serif">
                    {new Date(selectedBooking.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-400 font-semibold uppercase">Time Slot</span>
                  <span>{selectedBooking.timeSlot}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-400 font-semibold uppercase">Devotees Count</span>
                  <span className="font-bold">{selectedBooking.persons} Devotee(s)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-400 font-semibold uppercase">Pass Type</span>
                  <span className="font-semibold text-spiritual-maroon">{selectedBooking.darshanType}</span>
                </div>
                <div className="flex justify-between py-2 border-b-2 border-dashed border-divine-gold/30 font-bold text-sm">
                  <span className="text-gray-800">Total Price</span>
                  <span className="font-serif text-spiritual-maroon text-base">₹{selectedBooking.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
