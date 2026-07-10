"use client";

import React, { useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import axios from 'axios';
import { Landmark, Calendar, FileText, CheckCircle, XCircle, Printer, Loader2, X } from 'lucide-react';

interface Booking {
  _id: string;
  bookingCode: string;
  date: string;
  darshanType: string;
  timeSlot: string;
  persons: number;
  totalPrice: number;
  bookingStatus: 'confirmed' | 'cancelled';
  createdAt: string;
  templeId: {
    _id: string;
    name: string;
    location: string;
    state: string;
    timings: string;
    description: string;
  };
}

export default function UserBookingsPage() {
  const { showToast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/bookings/my');
      if (res.data && res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      showToast('Error loading your bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this darshan booking? This will release your reserved slots.')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      const res = await axios.put(`/api/bookings/${bookingId}/cancel`);
      if (res.data && res.data.success) {
        showToast('Darshan booking cancelled successfully. Your slots have been released.', 'success');
        // Refresh
        fetchBookings();
        // Close modal if open
        setSelectedBooking(null);
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to cancel booking';
      showToast(errMsg, 'error');
    } finally {
      setCancellingId(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-divine-gold/20 pb-4">
        <h1 className="font-display text-2xl font-bold text-spiritual-maroon">My Darshan Bookings</h1>
        <p className="text-xs text-gray-500 font-serif">View, print, or manage your active bookings and history</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-sacred-saffron animate-spin" />
          <p className="text-xs text-gray-500 font-serif">Fetching temple passes...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-sand p-12 text-center rounded-xl border border-dashed border-divine-gold/30">
          <Calendar className="w-12 h-12 text-sacred-saffron/40 mx-auto mb-4" />
          <p className="text-gray-500 font-serif mb-4">You have not booked any darshan slots yet.</p>
          <a
            href="/temples"
            className="bg-sacred-saffron hover:bg-spiritual-maroon text-warm-cream border border-divine-gold/30 px-6 py-2.5 rounded-md font-semibold text-sm transition-colors inline-block"
          >
            Find Temples to Book
          </a>
        </div>
      ) : (
        <div className="bg-sand rounded-xl border border-divine-gold/30 overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-spiritual-maroon text-warm-cream border-b border-divine-gold/30">
                  <th className="p-4 font-display font-semibold uppercase tracking-wider text-xs">Code</th>
                  <th className="p-4 font-display font-semibold uppercase tracking-wider text-xs">Temple</th>
                  <th className="p-4 font-display font-semibold uppercase tracking-wider text-xs">Date & Time</th>
                  <th className="p-4 font-display font-semibold uppercase tracking-wider text-xs">Devotees</th>
                  <th className="p-4 font-display font-semibold uppercase tracking-wider text-xs">Status</th>
                  <th className="p-4 font-display font-semibold uppercase tracking-wider text-xs">Total</th>
                  <th className="p-4 font-display font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divine-gold/15">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-warm-cream/50 transition-colors">
                    <td className="p-4 font-bold text-sacred-saffron tracking-wide">{b.bookingCode}</td>
                    <td className="p-4 font-display font-bold text-gray-800">{b.templeId?.name}</td>
                    <td className="p-4 font-serif">
                      <p className="text-gray-700">
                        {new Date(b.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-xs text-gray-500">{b.timeSlot}</p>
                    </td>
                    <td className="p-4 font-serif">{b.persons} Devotee{b.persons > 1 ? 's' : ''}</td>
                    <td className="p-4">
                      {b.bookingStatus === 'confirmed' ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-semibold border border-emerald-200">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Confirmed</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-xs font-semibold border border-red-200">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancelled</span>
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-serif font-bold text-spiritual-maroon">₹{b.totalPrice}</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="text-xs font-bold text-sacred-saffron hover:underline"
                      >
                        Details
                      </button>

                      {b.bookingStatus === 'confirmed' && new Date(b.date) >= new Date() && (
                        <button
                          onClick={() => handleCancelBooking(b._id)}
                          disabled={cancellingId === b._id}
                          className="text-xs font-bold text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
                          {cancellingId === b._id ? 'Releasing...' : 'Cancel'}
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

      {/* Styled Pass Receipt Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-sand border-2 border-divine-gold rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col relative print:shadow-none print:border-0 print:m-0">
            {/* Modal Actions */}
            <div className="absolute right-4 top-4 flex gap-3 print:hidden">
              <button
                onClick={handlePrint}
                className="bg-white/90 hover:bg-white text-gray-700 border border-divine-gold/30 p-1.5 rounded-full shadow transition-colors"
                title="Print Receipt"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedBooking(null)}
                className="bg-white/90 hover:bg-white text-gray-700 border border-divine-gold/30 p-1.5 rounded-full shadow transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Print Area */}
            <div className="p-8 space-y-6 flex-1 print:p-0">
              {/* Receipt Header */}
              <div className="text-center pb-4 border-b-2 border-dashed border-divine-gold/30">
                <div className="bg-sacred-saffron text-warm-cream p-2.5 rounded-full border border-divine-gold w-fit mx-auto mb-2 print:border-none">
                  <Landmark className="w-6 h-6" />
                </div>
                <h2 className="font-display text-xl font-bold text-spiritual-maroon">Darshan Reservation Pass</h2>
                <p className="text-xs text-gray-500 font-serif mt-1">DarshanEase booking confirmation</p>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Booking Code</p>
                  <p className="text-base font-extrabold text-sacred-saffron font-serif">{selectedBooking.bookingCode}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Status</p>
                  <p className={`font-bold capitalize ${selectedBooking.bookingStatus === 'confirmed' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {selectedBooking.bookingStatus}
                  </p>
                </div>

                <div className="col-span-2 border-t border-divine-gold/10 pt-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Temple Name</p>
                  <p className="font-display font-bold text-base text-spiritual-maroon">{selectedBooking.templeId?.name}</p>
                  <p className="text-xs text-gray-500">{selectedBooking.templeId?.location}, {selectedBooking.templeId?.state}</p>
                </div>

                <div className="col-span-2 border-t border-divine-gold/10 pt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Selected Date</p>
                    <p className="font-serif font-semibold">
                      {new Date(selectedBooking.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Time Slot</p>
                    <p className="font-semibold text-gray-700">{selectedBooking.timeSlot}</p>
                  </div>
                </div>

                <div className="col-span-2 border-t border-divine-gold/10 pt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Devotees Count</p>
                    <p className="font-serif font-bold text-gray-800">{selectedBooking.persons} Person(s)</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Darshan Category</p>
                    <p className="font-semibold text-gray-800">{selectedBooking.darshanType}</p>
                  </div>
                </div>

                <div className="col-span-2 border-t-2 border-dashed border-divine-gold/25 pt-4 text-center">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Ticket Price</p>
                  <p className="text-2xl font-black text-spiritual-maroon font-serif mt-1">₹{selectedBooking.totalPrice}</p>
                  <p className="text-[10px] text-gray-500 font-serif mt-0.5">Payment Status: Confirmed & Completed</p>
                </div>
              </div>

              {/* Footer instructions */}
              <div className="bg-warm-cream p-4 rounded-lg border border-divine-gold/15 text-[11px] text-gray-500 font-serif leading-relaxed text-center">
                Please carry this pass along with a valid Government Photo ID (Aadhaar, Passport, or PAN) for check-post verification at the temple entrance corridor. Dress code: strictly traditional.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
