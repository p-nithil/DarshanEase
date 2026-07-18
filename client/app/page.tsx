"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TempleCard from '@/components/TempleCard';
import api from '@/lib/api';
import { Landmark, Compass, Calendar, CheckSquare, ShieldCheck, HeartHandshake, ArrowRight, Loader2 } from 'lucide-react';

interface Temple {
  _id: string;
  name: string;
  location: string;
  state: string;
  description: string;
  images: string[];
  timings: string;
  darshanTypes: { name: string; price: number; description?: string }[];
}

export default function HomePage() {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        const res = await api.get('/api/temples');
        if (res.data && res.data.success) {
          setTemples(res.data.data.slice(0, 3)); // show top 3 popular
        }
      } catch (err) {
        console.error('Error fetching temples:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTemples();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-warm-cream">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-spiritual-maroon py-20 md:py-32 border-b-4 border-divine-gold overflow-hidden">
        {/* Background Mandala Watermark decoration */}
        <div className="absolute right-[-100px] top-[-50px] opacity-10 text-warm-cream select-none pointer-events-none animate-spin-slow">
          <svg className="w-[500px] h-[500px]" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 0 C40 15, 60 15, 50 0 M50 100 C40 85, 60 85, 50 100 M0 50 C15 40, 15 60, 0 50 M100 50 C85 40, 85 60, 100 50 M15 15 C30 25, 25 30, 15 15 M85 85 C70 75, 75 70, 85 85 M15 85 C30 75, 25 70, 15 85 M85 15 C70 25, 75 30, 85 15" />
            <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <p className="text-sacred-saffron font-display text-sm md:text-base font-bold tracking-widest uppercase">
            ॥ यतो धर्मस्ततो जयः ॥
          </p>
          
          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-warm-cream leading-tight">
            Simplify Your Sacred Journeys with{' '}
            <span className="bg-gradient-to-r from-divine-gold via-sacred-saffron to-amber-300 bg-clip-text text-transparent">
              DarshanEase
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-warm-cream/90 text-base md:text-lg leading-relaxed font-serif">
            A premium ethnic platform designed to connect devotees with spiritual sanctuaries across India. Book verified darshan slots, special sevas, and rituals seamlessly.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link
              href="/temples"
              className="w-full sm:w-auto bg-sacred-saffron hover:bg-deep-rust text-warm-cream border-2 border-divine-gold px-8 py-3.5 rounded-md font-semibold transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>Explore Temples</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto border border-warm-cream hover:bg-white/10 text-warm-cream px-8 py-3.5 rounded-md font-semibold transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Temples Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <h2 className="font-display text-3xl font-bold text-spiritual-maroon tracking-wider">
            Popular Sacred Sanctuaries
          </h2>
          <div className="flex justify-center items-center gap-1.5">
            <div className="h-0.5 w-10 bg-divine-gold"></div>
            <Landmark className="w-4 h-4 text-sacred-saffron" />
            <div className="h-0.5 w-10 bg-divine-gold"></div>
          </div>
          <p className="text-gray-600 text-sm font-serif">
            Browse and book darshan passes for highly revered temples across regions.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 text-sacred-saffron animate-spin" />
            <p className="text-sm text-gray-500 font-serif">Loading sacred portals...</p>
          </div>
        ) : temples.length === 0 ? (
          <div className="text-center py-20 bg-sand rounded-xl border border-dashed border-divine-gold/30">
            <p className="text-gray-500 font-serif">No temples found. Please run the database seeder script.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {temples.map((temple) => (
              <TempleCard key={temple._id} temple={temple} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/temples"
            className="inline-flex items-center gap-2 border border-spiritual-maroon text-spiritual-maroon hover:bg-spiritual-maroon hover:text-warm-cream font-semibold px-6 py-3 rounded-md transition-all text-sm"
          >
            <span>View All Temples</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-sand border-y border-divine-gold/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <h2 className="font-display text-3xl font-bold text-spiritual-maroon tracking-wider">
              How Simple Bookings Work
            </h2>
            <p className="text-gray-600 text-sm font-serif max-w-md mx-auto">
              Follow four easy steps to reserve your slots and secure booking confirmations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="bg-warm-cream p-6 rounded-xl border border-divine-gold/20 relative shadow-sm flex flex-col items-center text-center space-y-3">
              <div className="bg-spiritual-maroon text-warm-cream w-12 h-12 rounded-full border border-divine-gold flex items-center justify-center font-bold text-lg">
                1
              </div>
              <Compass className="w-8 h-8 text-sacred-saffron" />
              <h3 className="font-display font-bold text-gray-800 text-base">Select Temple</h3>
              <p className="text-xs text-gray-500 font-serif">
                Browse our curated list of sacred temples and view available daily schedules.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-warm-cream p-6 rounded-xl border border-divine-gold/20 relative shadow-sm flex flex-col items-center text-center space-y-3">
              <div className="bg-spiritual-maroon text-warm-cream w-12 h-12 rounded-full border border-divine-gold flex items-center justify-center font-bold text-lg">
                2
              </div>
              <Calendar className="w-8 h-8 text-sacred-saffron" />
              <h3 className="font-display font-bold text-gray-800 text-base">Choose Slot & Date</h3>
              <p className="text-xs text-gray-500 font-serif">
                Select your preferred darshan category (General/VIP/Seva), date, and timing.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-warm-cream p-6 rounded-xl border border-divine-gold/20 relative shadow-sm flex flex-col items-center text-center space-y-3">
              <div className="bg-spiritual-maroon text-warm-cream w-12 h-12 rounded-full border border-divine-gold flex items-center justify-center font-bold text-lg">
                3
              </div>
              <CheckSquare className="w-8 h-8 text-sacred-saffron" />
              <h3 className="font-display font-bold text-gray-800 text-base">Add Devotees</h3>
              <p className="text-xs text-gray-500 font-serif">
                Specify the number of persons. Real-time availability checks ensure seat locks.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-warm-cream p-6 rounded-xl border border-divine-gold/20 relative shadow-sm flex flex-col items-center text-center space-y-3">
              <div className="bg-spiritual-maroon text-warm-cream w-12 h-12 rounded-full border border-divine-gold flex items-center justify-center font-bold text-lg">
                4
              </div>
              <ShieldCheck className="w-8 h-8 text-sacred-saffron" />
              <h3 className="font-display font-bold text-gray-800 text-base">Get Confirmation</h3>
              <p className="text-xs text-gray-500 font-serif">
                Secure your booking code (DE-XXXXXX) instantly. View or print receipt in dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety Features */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="font-display text-3xl font-bold text-spiritual-maroon tracking-wide">
              Ensuring Peaceful Spiritual Journeys
            </h2>
            <p className="text-gray-700 leading-relaxed font-serif">
              Our platform operates in complete harmony with temple boards, managing seat limits to prevent overcrowding and ensure safety during high-demand festivals.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-sacred-saffron/10 p-2 rounded-lg text-sacred-saffron mt-1">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-gray-800">Direct integration</h4>
                  <p className="text-sm text-gray-600 font-serif">Tickets are shared with offline check-posts for swift barcode verification.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-sacred-saffron/10 p-2 rounded-lg text-sacred-saffron mt-1">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-gray-800">Support desk</h4>
                  <p className="text-sm text-gray-600 font-serif">24/7 dedicated support phone line and chat resolving queries for elders.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden border-2 border-divine-gold/50 shadow-2xl h-80">
            <img
              src="https://images.unsplash.com/photo-1544085311-11a028465b03?q=80&w=800&auto=format&fit=crop"
              alt="Indian Spiritual Temple"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-spiritual-maroon/80 to-transparent flex flex-col justify-end p-6">
              <p className="text-divine-gold font-display text-xs uppercase tracking-widest">Devotional Quote</p>
              <p className="text-warm-cream italic font-serif text-sm">"कर्मण्येवाधिकारस्ते मा फलेषु कदाचन..." - Perform your duty with devotion.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-spiritual-maroon text-warm-cream py-12 border-t-2 border-divine-gold">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-wide">
            Ready to Begin Your Sacred Pilgrimage?
          </h2>
          <p className="text-sm font-serif opacity-90 max-w-md mx-auto">
            Create an account in minutes, search timings, and secure tickets for you and your family.
          </p>
          <div className="pt-2">
            <Link
              href="/signup"
              className="bg-sacred-saffron hover:bg-deep-rust text-warm-cream border border-divine-gold px-8 py-3 rounded-md font-semibold transition-all inline-block text-sm"
            >
              Register Account Now
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
