"use client";

import React, { useState, useEffect, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import axios from 'axios';
import { Landmark, MapPin, Clock, Calendar, Users, ShieldAlert, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface DarshanType {
  name: string;
  price: number;
  description?: string;
}

interface Temple {
  _id: string;
  name: string;
  location: string;
  state: string;
  description: string;
  images: string[];
  timings: string;
  darshanTypes: DarshanType[];
}

interface Slot {
  _id: string;
  templeId: string;
  date: string;
  darshanType: string;
  timeSlot: string;
  totalCapacity: number;
  availableSeats: number;
  bookedSeats: number;
  status: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TempleDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const templeId = resolvedParams.id;

  const [temple, setTemple] = useState<Temple | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  // Booking details form states
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedDarshan, setSelectedDarshan] = useState<DarshanType | null>(null);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [devoteesCount, setDevoteesCount] = useState<number>(1);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Quick select dates (Next 7 days)
  const [dateOptions, setDateOptions] = useState<{ dateString: string; displayString: string }[]>([]);

  // Generate next 7 days options
  useEffect(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const date = String(d.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${date}`; // YYYY-MM-DD format
      
      const displayString = d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

      dates.push({ dateString, displayString });
    }
    setDateOptions(dates);
    // Select today as default
    if (dates.length > 0) {
      setSelectedDate(dates[0].dateString);
    }
  }, []);

  // Fetch Temple Details
  useEffect(() => {
    const fetchTempleDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/temples/${templeId}`);
        if (res.data && res.data.success) {
          setTemple(res.data.data);
          // Set first darshan type by default
          if (res.data.data.darshanTypes && res.data.data.darshanTypes.length > 0) {
            setSelectedDarshan(res.data.data.darshanTypes[0]);
          }
        }
      } catch (err) {
        showToast('Error loading temple details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchTempleDetails();
  }, [templeId, showToast]);

  // Fetch Slots when Date or Darshan type changes
  const fetchSlots = useCallback(async () => {
    if (!templeId || !selectedDate || !selectedDarshan) return;
    
    try {
      setLoadingSlots(true);
      setSelectedSlot(null); // Reset selected slot
      
      const res = await axios.get(`/api/slots/temple/${templeId}?date=${selectedDate}`);
      if (res.data && res.data.success) {
        // Filter slots matching the selected darshan category
        const filtered = res.data.data.filter(
          (s: Slot) => s.darshanType.toLowerCase() === selectedDarshan.name.toLowerCase()
        );
        setAvailableSlots(filtered);
        // Default to first active slot if available
        if (filtered.length > 0) {
          setSelectedSlot(filtered[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  }, [templeId, selectedDate, selectedDarshan]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const handleBooking = async () => {
    if (!user) {
      showToast('Please sign in or register to book darshan tickets', 'info');
      router.push(`/login?redirect=/temples/${templeId}`);
      return;
    }

    if (!selectedSlot) {
      showToast('Please select a timing slot', 'error');
      return;
    }

    if (devoteesCount > selectedSlot.availableSeats) {
      showToast('Not enough available seats in the selected slot', 'error');
      return;
    }

    try {
      setBookingInProgress(true);
      
      const totalPrice = selectedDarshan ? selectedDarshan.price * devoteesCount : 0;
      
      const res = await axios.post('/api/bookings', {
        templeId,
        slotId: selectedSlot._id,
        date: selectedDate,
        darshanType: selectedSlot.darshanType,
        timeSlot: selectedSlot.timeSlot,
        persons: devoteesCount,
        totalPrice
      });

      if (res.data && res.data.success) {
        showToast('Darshan ticket booked successfully!', 'success');
        // Redirect to booking detail page
        router.push(`/dashboard/bookings`);
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Error occurred while booking';
      showToast(errMsg, 'error');
    } finally {
      setBookingInProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-cream">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-10 h-10 text-sacred-saffron animate-spin" />
          <p className="text-sm text-gray-500 font-serif">Opening temple doors...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!temple) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-cream">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <p className="text-gray-500 font-serif mb-4">Temple not found.</p>
          <button onClick={() => router.push('/temples')} className="text-spiritual-maroon hover:underline">
            Go back to listings
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const primaryImage = temple.images && temple.images.length > 0
    ? temple.images[0]
    : 'https://images.unsplash.com/photo-1544085311-11a028465b03?q=80&w=800&auto=format&fit=crop';

  const secondaryImage = temple.images && temple.images.length > 1 ? temple.images[1] : null;

  return (
    <div className="flex flex-col min-h-screen bg-warm-cream">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Back Link */}
        <button
          onClick={() => router.push('/temples')}
          className="flex items-center gap-1.5 text-xs font-semibold text-spiritual-maroon hover:text-sacred-saffron transition-colors mb-6 uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Temples</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Temple Information Column (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-sand p-6 rounded-xl border border-divine-gold/30 shadow-md">
              <div className="flex items-center gap-1 text-xs text-sacred-saffron font-bold uppercase tracking-wider mb-2">
                <Landmark className="w-4 h-4" />
                <span>{temple.state}</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-spiritual-maroon mb-2">
                {temple.name}
              </h1>
              <p className="text-gray-600 text-sm flex items-center gap-1">
                <MapPin className="w-4 h-4 text-sacred-saffron flex-shrink-0" />
                <span>{temple.location}, {temple.state}</span>
              </p>
            </div>

            {/* Images Gallery */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl overflow-hidden border border-divine-gold/30 shadow-md h-64">
                <img src={primaryImage} alt={temple.name} className="w-full h-full object-cover" />
              </div>
              {secondaryImage ? (
                <div className="rounded-xl overflow-hidden border border-divine-gold/30 shadow-md h-64">
                  <img src={secondaryImage} alt={temple.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="bg-sand rounded-xl border border-dashed border-divine-gold/30 flex flex-col items-center justify-center p-6 h-64">
                  <Landmark className="w-10 h-10 text-sacred-saffron/40 mb-2" />
                  <p className="text-xs text-gray-500 font-serif">No secondary image available.</p>
                </div>
              )}
            </div>

            {/* Timings and Description */}
            <div className="bg-sand p-6 rounded-xl border border-divine-gold/30 shadow-md space-y-4">
              <div className="flex items-center gap-2 border-b border-divine-gold/20 pb-3">
                <Clock className="w-5 h-5 text-sacred-saffron" />
                <span className="font-display font-bold text-gray-800">Opening Timings:</span>
                <span className="font-serif text-sm text-gray-700 bg-warm-cream px-3 py-1 rounded-full border border-divine-gold/10">
                  {temple.timings}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-bold text-spiritual-maroon">Temple Overview</h3>
                <p className="text-gray-700 text-sm leading-relaxed font-serif whitespace-pre-line">
                  {temple.description}
                </p>
              </div>
            </div>

            {/* Darshan Packages list */}
            <div className="bg-sand p-6 rounded-xl border border-divine-gold/30 shadow-md space-y-4">
              <h3 className="font-display font-bold text-spiritual-maroon border-b border-divine-gold/20 pb-2">
                Darshan Packages & Passes
              </h3>
              <div className="space-y-4">
                {temple.darshanTypes.map((dt, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border transition-all ${
                      selectedDarshan?.name === dt.name
                        ? 'bg-warm-cream border-sacred-saffron shadow-sm'
                        : 'bg-warm-cream/50 border-divine-gold/15'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-display font-bold text-gray-800 text-sm sm:text-base">{dt.name}</h4>
                      <span className="font-serif font-bold text-spiritual-maroon text-sm sm:text-base">
                        {dt.price === 0 ? 'Free' : `₹${dt.price}`}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-serif leading-relaxed">{dt.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Form Widget Column (Right 1 col) */}
          <div className="lg:col-span-1">
            <div className="bg-sand rounded-xl border border-divine-gold/30 shadow-xl overflow-hidden sticky top-20">
              <div className="bg-spiritual-maroon text-warm-cream py-4 text-center border-b border-divine-gold/40">
                <h2 className="font-display text-base font-bold tracking-wider uppercase">Book Darshan Tickets</h2>
              </div>

              <div className="p-6 space-y-5">
                {/* 1. Date Selection (Visual Quick-choice layout) */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-sacred-saffron" />
                    <span>Select Date</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {dateOptions.map((opt) => (
                      <button
                        key={opt.dateString}
                        onClick={() => setSelectedDate(opt.dateString)}
                        className={`text-center py-2 px-1 rounded-md text-xs font-semibold transition-all border ${
                          selectedDate === opt.dateString
                            ? 'bg-sacred-saffron text-warm-cream border-divine-gold shadow-sm'
                            : 'bg-warm-cream text-gray-700 border-divine-gold/20 hover:bg-sand'
                        }`}
                      >
                        {opt.displayString}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Darshan Package Dropdown selection */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Darshan Category
                  </label>
                  <select
                    value={selectedDarshan?.name || ''}
                    onChange={(e) => {
                      const found = temple.darshanTypes.find((d) => d.name === e.target.value);
                      if (found) setSelectedDarshan(found);
                    }}
                    className="w-full bg-warm-cream border border-divine-gold/30 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-sacred-saffron font-semibold"
                  >
                    {temple.darshanTypes.map((dt, idx) => (
                      <option key={idx} value={dt.name}>
                        {dt.name} (₹{dt.price})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Slot Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Available Time Slot
                  </label>
                  {loadingSlots ? (
                    <div className="flex items-center justify-center py-4 gap-1.5 text-xs text-gray-500 font-serif">
                      <Loader2 className="w-4 h-4 animate-spin text-sacred-saffron" />
                      <span>Checking slot schedules...</span>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md text-xs font-serif flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                      <span>No slots available for this package on the selected date.</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {availableSlots.map((slot) => {
                        const isSelect = selectedSlot?._id === slot._id;
                        return (
                          <button
                            key={slot._id}
                            onClick={() => setSelectedSlot(slot)}
                            className={`w-full text-left p-3 rounded-lg border text-xs flex justify-between items-center transition-all ${
                              isSelect
                                ? 'bg-warm-cream border-sacred-saffron shadow-sm'
                                : 'bg-warm-cream/50 border-divine-gold/15 hover:bg-warm-cream'
                            }`}
                          >
                            <div>
                              <p className="font-semibold text-gray-800">{slot.timeSlot}</p>
                              <p className="text-[10px] text-gray-500 mt-0.5">
                                Capacity: {slot.totalCapacity}
                              </p>
                            </div>
                            <span
                              className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                                slot.availableSeats > 20
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : slot.availableSeats > 0
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-red-50 text-red-700'
                              }`}
                            >
                              {slot.availableSeats === 0
                                ? 'Sold Out'
                                : `${slot.availableSeats} Left`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 4. Devotees Count */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-sacred-saffron" />
                    <span>Number of Persons (Max 20)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={devoteesCount}
                    onChange={(e) => setDevoteesCount(Number(e.target.value))}
                    className="w-full bg-warm-cream border border-divine-gold/30 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-sacred-saffron font-bold text-center"
                  />
                </div>

                {/* Price calculation and Checkout button */}
                {selectedDarshan && selectedSlot && (
                  <div className="bg-warm-cream p-4 rounded-lg border border-divine-gold/20 space-y-3 shadow-inner">
                    <div className="flex justify-between items-center text-xs text-gray-600">
                      <span>Pass Price ({selectedDarshan.name})</span>
                      <span>₹{selectedDarshan.price} × {devoteesCount}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-spiritual-maroon text-base border-t border-divine-gold/15 pt-2">
                      <span>Total Amount:</span>
                      <span className="font-serif">₹{selectedDarshan.price * devoteesCount}</span>
                    </div>
                  </div>
                )}

                {/* Booking Button */}
                {user ? (
                  <button
                    onClick={handleBooking}
                    disabled={bookingInProgress || !selectedSlot || selectedSlot.availableSeats === 0}
                    className="w-full bg-sacred-saffron hover:bg-spiritual-maroon disabled:bg-gray-300 disabled:cursor-not-allowed text-warm-cream border border-divine-gold/40 py-3 rounded-md font-semibold transition-colors flex items-center justify-center gap-2 text-sm shadow-md"
                  >
                    {bookingInProgress ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Reserving Tickets...</span>
                      </>
                    ) : selectedSlot && selectedSlot.availableSeats === 0 ? (
                      <span>Sold Out</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm and Book</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-red-50 border border-red-200 text-red-900 p-3 rounded-md text-xs font-serif text-center">
                      Please log in to book darshan passes.
                    </div>
                    <Link
                      href={`/login?redirect=/temples/${templeId}`}
                      className="w-full bg-spiritual-maroon hover:bg-sacred-saffron text-warm-cream border border-divine-gold/30 py-3 rounded-md font-semibold transition-colors block text-center text-sm shadow-md"
                    >
                      Login / Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
