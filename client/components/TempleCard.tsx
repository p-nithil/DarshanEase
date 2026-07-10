import React from 'react';
import Link from 'next/link';
import { MapPin, Landmark, ArrowRight } from 'lucide-react';

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

interface TempleCardProps {
  temple: Temple;
}

export default function TempleCard({ temple }: TempleCardProps) {
  // Find minimum price for starting text
  const startingPrice = temple.darshanTypes && temple.darshanTypes.length > 0
    ? Math.min(...temple.darshanTypes.map((d) => d.price))
    : 0;

  // Primary image or fallback
  const displayImage = temple.images && temple.images.length > 0
    ? temple.images[0]
    : 'https://images.unsplash.com/photo-1544085311-11a028465b03?q=80&w=800&auto=format&fit=crop';

  return (
    <div className="bg-sand rounded-xl border border-divine-gold/30 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group h-full">
      {/* Temple Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={displayImage}
          alt={temple.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-spiritual-maroon/90 text-warm-cream text-xs font-semibold px-2.5 py-1 rounded-full border border-divine-gold/40">
          {temple.state}
        </div>
      </div>

      {/* Card Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-sacred-saffron font-semibold uppercase tracking-wider">
            <Landmark className="w-3.5 h-3.5" />
            <span>Timings: {temple.timings.split(' ')[0]} {temple.timings.split(' ')[1] || ''}</span>
          </div>

          <h3 className="font-display text-lg font-bold text-spiritual-maroon hover:text-sacred-saffron transition-colors">
            <Link href={`/temples/${temple._id}`}>{temple.name}</Link>
          </h3>

          <p className="text-gray-600 text-xs flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-sacred-saffron flex-shrink-0" />
            <span>{temple.location}, {temple.state}</span>
          </p>

          <p className="text-gray-700 text-sm leading-relaxed line-clamp-3 pt-1">
            {temple.description}
          </p>
        </div>

        {/* Pricing and Action */}
        <div className="border-t border-divine-gold/20 mt-4 pt-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs">Tickets from</p>
            <p className="font-semibold text-lg text-spiritual-maroon font-serif">
              {startingPrice === 0 ? 'Free' : `₹${startingPrice}`}
            </p>
          </div>
          
          <Link
            href={`/temples/${temple._id}`}
            className="flex items-center gap-1 bg-sacred-saffron hover:bg-spiritual-maroon text-warm-cream border border-divine-gold/40 text-xs font-semibold px-4 py-2 rounded-md transition-colors"
          >
            <span>Book Darshan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
