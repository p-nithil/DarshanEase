"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/context/ToastContext';
import api from '@/lib/api';
import { History, Plus, Loader2, Landmark, Calendar, Sliders } from 'lucide-react';

interface Temple {
  _id: string;
  name: string;
  location: string;
  state: string;
  darshanTypes: { name: string; price: number }[];
}

interface Slot {
  _id: string;
  templeId: {
    name: string;
  };
  date: string;
  darshanType: string;
  timeSlot: string;
  totalCapacity: number;
  availableSeats: number;
  bookedSeats: number;
  status: string;
}

export default function AdminSlotsPage() {
  const { showToast } = useToast();
  const [temples, setTemples] = useState<Temple[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingTemples, setLoadingTemples] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Slot Auditor filters
  const [filterTemple, setFilterTemple] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // Bulk Generator inputs
  const [genTempleId, setGenTempleId] = useState('');
  const [genStartDate, setGenStartDate] = useState('');
  const [genEndDate, setGenEndDate] = useState('');
  const [genCapacity, setGenCapacity] = useState(100);
  const [genTimeSlots, setGenTimeSlots] = useState<string[]>([
    '06:00 AM - 09:00 AM',
    '09:00 AM - 12:00 PM',
    '03:00 PM - 06:00 PM',
    '06:00 PM - 09:00 PM'
  ]);
  const [genDarshanTypes, setGenDarshanTypes] = useState<string[]>([]);
  
  // Selected temple's actual package options
  const [selectedTemplePackages, setSelectedTemplePackages] = useState<string[]>([]);

  // Fetch Temples on mount
  useEffect(() => {
    const fetchTemples = async () => {
      try {
        setLoadingTemples(true);
        const res = await api.get('/api/temples');
        if (res.data && res.data.success) {
          setTemples(res.data.data);
          if (res.data.data.length > 0) {
            // Select first temple by default for generation
            setGenTempleId(res.data.data[0]._id);
          }
        }
      } catch (err) {
        showToast('Error loading temples', 'error');
      } finally {
        setLoadingTemples(false);
      }
    };
    fetchTemples();
  }, [showToast]);

  // Load temple packages when generator temple selection changes
  useEffect(() => {
    if (!genTempleId || temples.length === 0) return;
    const found = temples.find((t) => t._id === genTempleId);
    if (found) {
      const names = found.darshanTypes.map((d) => d.name);
      setSelectedTemplePackages(names);
      setGenDarshanTypes(names); // Select all packages by default
    }
  }, [genTempleId, temples]);

  // Fetch slots list
  const fetchSlots = useCallback(async () => {
    try {
      setLoadingSlots(true);
      const params = new URLSearchParams();
      if (filterTemple) params.append('templeId', filterTemple);
      if (filterDate) params.append('date', filterDate);

      const res = await api.get(`/api/slots?${params.toString()}`);
      if (res.data && res.data.success) {
        setSlots(res.data.data.slice(0, 50)); // cap list at 50 slots for UI audit
      }
    } catch (err) {
      console.error('Error fetching slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  }, [filterTemple, filterDate]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const handleToggleTimeSlot = (time: string) => {
    if (genTimeSlots.includes(time)) {
      setGenTimeSlots(genTimeSlots.filter((t) => t !== time));
    } else {
      setGenTimeSlots([...genTimeSlots, time]);
    }
  };

  const handleToggleDarshan = (name: string) => {
    if (genDarshanTypes.includes(name)) {
      setGenDarshanTypes(genDarshanTypes.filter((d) => d !== name));
    } else {
      setGenDarshanTypes([...genDarshanTypes, name]);
    }
  };

  const handleGenerateSlots = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!genTempleId || !genStartDate || !genEndDate) {
      showToast('Please fill out all required generation fields', 'error');
      return;
    }

    if (genTimeSlots.length === 0 || genDarshanTypes.length === 0) {
      showToast('Select at least one time slot and one darshan category', 'error');
      return;
    }

    try {
      setGenerating(true);
      const res = await api.post('/api/slots/generate', {
        templeId: genTempleId,
        startDate: genStartDate,
        endDate: genEndDate,
        timeSlots: genTimeSlots,
        darshanTypes: genDarshanTypes,
        totalCapacity: genCapacity
      });

      if (res.data && res.data.success) {
        showToast(res.data.message || 'Slots generated successfully', 'success');
        // Reset generator dates
        setGenStartDate('');
        setGenEndDate('');
        fetchSlots();
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Error occurred while generating slots';
      showToast(errMsg, 'error');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-divine-gold/20 pb-4">
        <h1 className="font-display text-2xl font-bold text-spiritual-maroon flex items-center gap-2">
          <History className="w-6 h-6 text-sacred-saffron" />
          <span>Darshan Slot & Schedule Management</span>
        </h1>
        <p className="text-xs text-gray-500 font-serif">Bulk generate timings or audit slot booking statuses</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Slot Generator Form (1 col) */}
        <div className="lg:col-span-1 bg-sand p-6 rounded-xl border border-divine-gold/30 shadow-md h-fit space-y-5">
          <h2 className="font-display text-base font-bold text-spiritual-maroon border-b border-divine-gold/20 pb-2">
            Bulk Slot Generator
          </h2>

          {loadingTemples ? (
            <div className="flex items-center gap-2 text-xs text-gray-500 font-serif py-4">
              <Loader2 className="w-4 h-4 animate-spin text-sacred-saffron" />
              <span>Fetching temples data...</span>
            </div>
          ) : temples.length === 0 ? (
            <p className="text-xs text-red-600 font-serif">Add temples before generating slots.</p>
          ) : (
            <form onSubmit={handleGenerateSlots} className="space-y-4 text-xs">
              {/* Select Temple */}
              <div className="space-y-1">
                <label className="block font-semibold uppercase tracking-wider text-gray-600">Temple</label>
                <select
                  value={genTempleId}
                  onChange={(e) => setGenTempleId(e.target.value)}
                  className="w-full bg-warm-cream border border-divine-gold/30 rounded py-2 px-2.5 text-xs focus:outline-none focus:border-sacred-saffron font-bold text-gray-800"
                >
                  {temples.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start/End Date */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold uppercase tracking-wider text-gray-600">Start Date</label>
                  <input
                    type="date"
                    value={genStartDate}
                    onChange={(e) => setGenStartDate(e.target.value)}
                    className="w-full bg-warm-cream border border-divine-gold/30 rounded py-2 px-2.5 text-xs focus:outline-none focus:border-sacred-saffron"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-semibold uppercase tracking-wider text-gray-600">End Date</label>
                  <input
                    type="date"
                    value={genEndDate}
                    onChange={(e) => setGenEndDate(e.target.value)}
                    className="w-full bg-warm-cream border border-divine-gold/30 rounded py-2 px-2.5 text-xs focus:outline-none focus:border-sacred-saffron"
                  />
                </div>
              </div>

              {/* Capacity */}
              <div className="space-y-1">
                <label className="block font-semibold uppercase tracking-wider text-gray-600">Total Capacity per Slot</label>
                <input
                  type="number"
                  min="5"
                  value={genCapacity}
                  onChange={(e) => setGenCapacity(Number(e.target.value))}
                  className="w-full bg-warm-cream border border-divine-gold/30 rounded py-2 px-2.5 text-xs focus:outline-none focus:border-sacred-saffron text-center font-bold"
                />
              </div>

              {/* Time Slots checkboxes */}
              <div className="space-y-1.5 pt-1">
                <label className="block font-semibold uppercase tracking-wider text-gray-600">Time Schedules</label>
                <div className="space-y-1 bg-warm-cream/50 p-2 border border-divine-gold/15 rounded">
                  {['06:00 AM - 09:00 AM', '09:00 AM - 12:00 PM', '03:00 PM - 06:00 PM', '06:00 PM - 09:00 PM'].map((t) => (
                    <label key={t} className="flex items-center gap-2 p-1 hover:bg-sand rounded cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={genTimeSlots.includes(t)}
                        onChange={() => handleToggleTimeSlot(t)}
                        className="accent-sacred-saffron"
                      />
                      <span className="font-mono text-[10px] text-gray-700">{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Darshan Packages list */}
              <div className="space-y-1.5 pt-1">
                <label className="block font-semibold uppercase tracking-wider text-gray-600">Darshan Categories</label>
                <div className="space-y-1 bg-warm-cream/50 p-2 border border-divine-gold/15 rounded">
                  {selectedTemplePackages.map((pkg) => (
                    <label key={pkg} className="flex items-center gap-2 p-1 hover:bg-sand rounded cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={genDarshanTypes.includes(pkg)}
                        onChange={() => handleToggleDarshan(pkg)}
                        className="accent-sacred-saffron"
                      />
                      <span className="font-semibold text-gray-700">{pkg}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={generating}
                className="w-full bg-sacred-saffron hover:bg-spiritual-maroon disabled:bg-gray-300 text-warm-cream border border-divine-gold/30 py-2.5 rounded font-semibold transition-colors flex items-center justify-center gap-1.5 shadow"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating Slots...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Generate Schedules</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Slot Auditor Table list (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-divine-gold/20">
            <h2 className="font-display font-bold text-gray-800 text-base flex items-center gap-1">
              <Sliders className="w-4 h-4 text-sacred-saffron" />
              <span>Schedules Auditor (Latest 50)</span>
            </h2>
            
            {/* Filter toolbar */}
            <div className="flex gap-2 w-full sm:w-auto text-xs">
              <select
                value={filterTemple}
                onChange={(e) => setFilterTemple(e.target.value)}
                className="bg-sand border border-divine-gold/30 rounded py-1 px-2 text-xs font-semibold text-gray-700"
              >
                <option value="">All Temples</option>
                {temples.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name.split(' ')[0]}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="bg-sand border border-divine-gold/30 rounded py-1 px-2 text-xs text-gray-700"
              />
            </div>
          </div>

          {loadingSlots ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-sacred-saffron animate-spin" />
            </div>
          ) : slots.length === 0 ? (
            <div className="bg-sand p-8 text-center rounded-xl border border-divine-gold/20 text-gray-500 font-serif text-sm">
              No matching schedules found in the directory.
            </div>
          ) : (
            <div className="bg-sand rounded-xl border border-divine-gold/30 overflow-hidden shadow-md">
              <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 bg-spiritual-maroon text-warm-cream border-b border-divine-gold/30 z-10">
                    <tr>
                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px]">Temple</th>
                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px]">Date</th>
                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px]">Darshan / Time</th>
                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] text-center">Booked</th>
                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] text-center">Available</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-divine-gold/15">
                    {slots.map((s) => (
                      <tr key={s._id} className="hover:bg-warm-cream/50 transition-colors">
                        <td className="p-3 font-bold text-gray-800">{s.templeId?.name || 'Unknown'}</td>
                        <td className="p-3 font-serif">
                          {new Date(s.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="p-3">
                          <p className="font-semibold text-spiritual-maroon">{s.darshanType}</p>
                          <p className="text-[10px] text-gray-500 font-mono mt-0.5">{s.timeSlot}</p>
                        </td>
                        <td className="p-3 text-center font-bold text-gray-700">{s.bookedSeats} / {s.totalCapacity}</td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              s.availableSeats > 20
                                ? 'bg-emerald-50 text-emerald-700'
                                : s.availableSeats > 0
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-red-50 text-red-700'
                            }`}
                          >
                            {s.availableSeats} Left
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
