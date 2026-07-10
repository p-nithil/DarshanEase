"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Landmark, Compass, Calendar, CheckSquare, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-warm-cream">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
        {/* Title */}
        <div className="text-center space-y-3">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-spiritual-maroon tracking-wider">
            About DarshanEase
          </h1>
          <div className="flex justify-center items-center gap-1.5">
            <div className="h-0.5 w-10 bg-divine-gold"></div>
            <Landmark className="w-4 h-4 text-sacred-saffron" />
            <div className="h-0.5 w-10 bg-divine-gold"></div>
          </div>
          <p className="text-gray-600 text-sm font-serif max-w-xl mx-auto leading-relaxed">
            Bridging age-old spiritual traditions and modern convenience to bring peace of mind to devotees worldwide.
          </p>
        </div>

        {/* Philosophy Card */}
        <div className="bg-sand p-8 rounded-xl border border-divine-gold/30 shadow-md grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-spiritual-maroon">Our Spiritual Philosophy</h2>
            <p className="text-gray-700 text-sm leading-relaxed font-serif">
              In the fast-paced modern world, embarking on a pilgrimage can often feel overwhelming due to scheduling, queue lines, and capacity constraints.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed font-serif">
              DarshanEase was established with a singular focus: to make the divine darshan experience accessible, structured, and easy for senior citizens, families, and solo travellers alike.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-divine-gold/20 shadow-md h-56">
            <img
              src="https://images.unsplash.com/photo-1596701062351-df1ff690f214?q=80&w=800&auto=format&fit=crop"
              alt="Himalayan Spiritual Temple"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Detailed Booking Steps */}
        <div className="space-y-6">
          <h2 className="font-display text-2xl font-bold text-spiritual-maroon text-center">How Booking Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Step 1 */}
            <div className="bg-sand p-6 rounded-xl border border-divine-gold/20 flex gap-4">
              <div className="bg-spiritual-maroon text-warm-cream font-bold w-10 h-10 rounded-full flex items-center justify-center border border-divine-gold flex-shrink-0">
                1
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-gray-800 text-sm">Explore and Select Portals</h3>
                <p className="text-xs text-gray-600 font-serif leading-relaxed">
                  Browse iconic Indian temples listed in our registry. View real-time opening hours, historical details, and visual descriptions.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-sand p-6 rounded-xl border border-divine-gold/20 flex gap-4">
              <div className="bg-spiritual-maroon text-warm-cream font-bold w-10 h-10 rounded-full flex items-center justify-center border border-divine-gold flex-shrink-0">
                2
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-gray-800 text-sm">Pick Date & Special Seva</h3>
                <p className="text-xs text-gray-600 font-serif leading-relaxed">
                  Select a convenient date. Check available seat capacities dynamically for General Darshan, express VIP queues, or special morning pujas.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-sand p-6 rounded-xl border border-divine-gold/20 flex gap-4">
              <div className="bg-spiritual-maroon text-warm-cream font-bold w-10 h-10 rounded-full flex items-center justify-center border border-divine-gold flex-shrink-0">
                3
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-gray-800 text-sm">Reserve Devotee Seats</h3>
                <p className="text-xs text-gray-600 font-serif leading-relaxed">
                  Provide devotee details and count. Our automated slot lock system immediately blocks ticket duplicates to guarantee seat availability.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-sand p-6 rounded-xl border border-divine-gold/20 flex gap-4">
              <div className="bg-spiritual-maroon text-warm-cream font-bold w-10 h-10 rounded-full flex items-center justify-center border border-divine-gold flex-shrink-0">
                4
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-gray-800 text-sm">Secure Barcode Confirmation</h3>
                <p className="text-xs text-gray-600 font-serif leading-relaxed">
                  Receive your booking confirmation with code (DE-XXXXXX). Print or save the ticket on your dashboard for seamless check-post entry.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* General Guidelines */}
        <div className="bg-sand p-6 rounded-xl border border-divine-gold/30 shadow-md space-y-4">
          <h2 className="font-display text-base font-bold text-spiritual-maroon border-b border-divine-gold/20 pb-2">
            Important Travel Guidelines
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-700 font-serif leading-relaxed">
            <div className="space-y-2">
              <p><strong>Traditional Dress Code:</strong> Modest ethnic clothing must be worn inside temple corridors. Men: Dhotis or Kurtas. Women: Sarees or Salwar Suits.</p>
              <p><strong>Verification Documents:</strong> Bring a copy of the booking pass along with matching Government photo identity proofs (e.g. Aadhaar, Passport).</p>
            </div>
            <div className="space-y-2">
              <p><strong>Punctuality:</strong> Report to verification checkpoints exactly 30 minutes before your slot timings. Late entry might not be accommodated.</p>
              <p><strong>Prohibited Items:</strong> Mobile phones, bags, and electronic equipment should be kept in locker facilities available outside the main gate.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
