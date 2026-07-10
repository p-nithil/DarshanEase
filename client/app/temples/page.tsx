"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TempleCard from '@/components/TempleCard';
import axios from 'axios';
import { Search, Filter, SlidersHorizontal, Landmark, Loader2 } from 'lucide-react';

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

export default function TemplesPage() {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const [darshanFilter, setDarshanFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Hardcoded filters for ease of search
  const states = ['All', 'Uttarakhand', 'Tamil Nadu', 'Andhra Pradesh'];
  const darshanTypes = ['All', 'General', 'VIP', 'Special', 'Maha', 'Seva'];

  const fetchTemples = useCallback(async () => {
    try {
      setLoading(true);
      
      // Construct API query query parameters
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (stateFilter !== 'All') params.append('state', stateFilter);
      if (darshanFilter !== 'All') params.append('darshanType', darshanFilter);
      
      // Map frontend sorting to API parameter
      if (sortBy === 'priceAsc') params.append('sort', 'priceAsc');
      if (sortBy === 'priceDesc') params.append('sort', 'priceDesc');
      if (sortBy === 'name') params.append('sort', 'name');

      const res = await axios.get(`/api/temples?${params.toString()}`);
      if (res.data && res.data.success) {
        setTemples(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching temples:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, stateFilter, darshanFilter, sortBy]);

  useEffect(() => {
    // Debounce search queries to avoid rapid hitting
    const delayDebounceFn = setTimeout(() => {
      fetchTemples();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchTemples]);

  return (
    <div className="flex flex-col min-h-screen bg-warm-cream">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Title */}
        <div className="text-center space-y-2 mb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-spiritual-maroon tracking-wider">
            Explore Sacred Temples
          </h1>
          <div className="flex justify-center items-center gap-1.5">
            <div className="h-0.5 w-10 bg-divine-gold"></div>
            <Landmark className="w-4 h-4 text-sacred-saffron" />
            <div className="h-0.5 w-10 bg-divine-gold"></div>
          </div>
          <p className="text-gray-600 text-sm font-serif max-w-md mx-auto">
            Book darshan passes, review slot availability, and prepare for your divine journey.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-sand p-6 rounded-xl border border-divine-gold/30 shadow-md mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Search box */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-warm-cream border border-divine-gold/30 rounded-md py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-sacred-saffron"
              placeholder="Search by temple, city..."
            />
          </div>

          {/* State Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-sacred-saffron flex-shrink-0" />
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full bg-warm-cream border border-divine-gold/30 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-sacred-saffron"
            >
              {states.map((st) => (
                <option key={st} value={st}>
                  {st === 'All' ? 'All Regions' : st}
                </option>
              ))}
            </select>
          </div>

          {/* Darshan Type Filter */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-sacred-saffron flex-shrink-0" />
            <select
              value={darshanFilter}
              onChange={(e) => setDarshanFilter(e.target.value)}
              className="w-full bg-warm-cream border border-divine-gold/30 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-sacred-saffron"
            >
              {darshanTypes.map((dt) => (
                <option key={dt} value={dt}>
                  {dt === 'All' ? 'All Darshan Types' : `${dt} Darshans`}
                </option>
              ))}
            </select>
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-warm-cream border border-divine-gold/30 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-sacred-saffron"
            >
              <option value="newest">Newest Added</option>
              <option value="name">Temple Name (A-Z)</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 text-sacred-saffron animate-spin" />
            <p className="text-sm text-gray-500 font-serif">Connecting to sacred gateways...</p>
          </div>
        ) : temples.length === 0 ? (
          <div className="text-center py-20 bg-sand rounded-xl border border-dashed border-divine-gold/30">
            <p className="text-gray-500 font-serif">No temples found matching your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {temples.map((temple) => (
              <TempleCard key={temple._id} temple={temple} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
