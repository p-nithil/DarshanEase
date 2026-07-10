import React from 'react';
import Link from 'next/link';
import { Landmark, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-spiritual-maroon border-t-2 border-divine-gold text-warm-cream mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="bg-sacred-saffron p-1 rounded-full border border-divine-gold">
                <Landmark className="w-5 h-5 text-warm-cream" />
              </div>
              <span className="font-display text-lg font-bold tracking-wider text-divine-gold">
                DarshanEase
              </span>
            </div>
            <p className="text-sm text-warm-cream/80 leading-relaxed font-serif">
              Connecting millions of devotees to sacred temples across India. Book VIP darshans, special pujas, and kalyanotsavams with absolute convenience and peace of mind.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-display text-base font-bold text-divine-gold border-b border-divine-gold/30 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-warm-cream/80">
              <li>
                <Link href="/" className="hover:text-divine-gold transition-colors">
                  Home Page
                </Link>
              </li>
              <li>
                <Link href="/temples" className="hover:text-divine-gold transition-colors">
                  Sacred Temples
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-divine-gold transition-colors">
                  How Bookings Work
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-divine-gold transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Guidelines */}
          <div className="space-y-4">
            <h3 className="font-display text-base font-bold text-divine-gold border-b border-divine-gold/30 pb-2">
              Devotional Guidelines
            </h3>
            <ul className="space-y-2 text-sm text-warm-cream/80">
              <li>• Dress modestly (traditional attire)</li>
              <li>• Carry booking confirmations (digital/print)</li>
              <li>• Adhere to timings printed on tickets</li>
              <li>• Electronic gadgets may be restricted inside</li>
            </ul>
          </div>

          {/* Contact Support */}
          <div className="space-y-4">
            <h3 className="font-display text-base font-bold text-divine-gold border-b border-divine-gold/30 pb-2">
              Helpdesk Contact
            </h3>
            <ul className="space-y-3 text-sm text-warm-cream/80">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sacred-saffron flex-shrink-0" />
                <span>+91 1800-456-108 (Toll Free)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sacred-saffron flex-shrink-0" />
                <span>support@darshanease.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sacred-saffron flex-shrink-0" />
                <span>Spiritual Corridor, Suite 108, Haridwar, UK - 249401</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-divine-gold/20 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-warm-cream/60">
          <div>
            &copy; {new Date().getFullYear()} DarshanEase Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-sacred-saffron fill-current" /> for devotees worldwide.
          </div>
        </div>
      </div>
    </footer>
  );
}
