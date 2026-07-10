"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/context/ToastContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Landmark, Loader2, Send } from 'lucide-react';

export default function ContactPage() {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  });

  const onSubmit = async (data: any) => {
    try {
      setSubmitting(true);
      // Simulate API submit delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showToast('Thank you for contacting us! Our helpline team will reach out to you shortly.', 'success');
      reset(); // clear input
    } catch (err) {
      showToast('Error sending message', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-cream">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
        {/* Title */}
        <div className="text-center space-y-3">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-spiritual-maroon tracking-wider">
            Contact Support & Helpdesk
          </h1>
          <div className="flex justify-center items-center gap-1.5">
            <div className="h-0.5 w-10 bg-divine-gold"></div>
            <Landmark className="w-4 h-4 text-sacred-saffron" />
            <div className="h-0.5 w-10 bg-divine-gold"></div>
          </div>
          <p className="text-gray-600 text-sm font-serif max-w-xl mx-auto leading-relaxed">
            Need assistance with booking modifications, refunds, or pilgrim guidelines? Reach out directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Helpdesk Coordinates (Left 2 cols) */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-sand p-6 rounded-xl border border-divine-gold/30 shadow-md space-y-6">
              <h2 className="font-display text-base font-bold text-spiritual-maroon border-b border-divine-gold/20 pb-2">
                Helpdesk Coordinates
              </h2>
              
              <ul className="space-y-4 text-xs text-gray-700 font-serif leading-relaxed">
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-sacred-saffron mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-gray-800">Toll Free Helpline</p>
                    <p className="text-sm font-semibold font-sans text-spiritual-maroon mt-0.5">+91 1800-456-108</p>
                    <p className="text-[10px] text-gray-400">Operational: 6:00 AM - 10:00 PM IST Daily</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-sacred-saffron mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-gray-800">Support Desk Email</p>
                    <p className="text-sm font-semibold font-sans text-spiritual-maroon mt-0.5">support@darshanease.com</p>
                    <p className="text-[10px] text-gray-400">Response time: within 2 hours</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-sacred-saffron mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-gray-800">Registrar Office</p>
                    <p className="text-gray-600 mt-0.5">Suite 108, Haridwar Spiritual Corridor,</p>
                    <p className="text-gray-600">Uttarakhand, India - 249401</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact form (Right 3 cols) */}
          <div className="md:col-span-3">
            <div className="bg-sand p-6 rounded-xl border border-divine-gold/30 shadow-md">
              <h2 className="font-display text-base font-bold text-spiritual-maroon border-b border-divine-gold/20 pb-3 mb-4">
                Leave a Message
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="block font-semibold uppercase tracking-wider text-gray-600">Full Name</label>
                    <input
                      type="text"
                      {...register('name', { required: 'Name is required' })}
                      className="w-full bg-warm-cream border border-divine-gold/30 rounded py-2 px-3 focus:outline-none focus:border-sacred-saffron text-sm"
                      placeholder="Rahul Sharma"
                    />
                    {errors.name && <span className="text-xs text-red-600 font-serif">{errors.name.message}</span>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="block font-semibold uppercase tracking-wider text-gray-600">Email Address</label>
                    <input
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Invalid email'
                        }
                      })}
                      className="w-full bg-warm-cream border border-divine-gold/30 rounded py-2 px-3 focus:outline-none focus:border-sacred-saffron text-sm"
                      placeholder="rahul@example.com"
                    />
                    {errors.email && <span className="text-xs text-red-600 font-serif">{errors.email.message}</span>}
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1">
                  <label className="block font-semibold uppercase tracking-wider text-gray-600">Subject</label>
                  <input
                    type="text"
                    {...register('subject', { required: 'Subject is required' })}
                    className="w-full bg-warm-cream border border-divine-gold/30 rounded py-2 px-3 focus:outline-none focus:border-sacred-saffron text-sm"
                    placeholder="E.g. Help with slot modification"
                  />
                  {errors.subject && <span className="text-xs text-red-600 font-serif">{errors.subject.message}</span>}
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label className="block font-semibold uppercase tracking-wider text-gray-600">Message Content</label>
                  <textarea
                    rows={4}
                    {...register('message', { required: 'Message is required' })}
                    className="w-full bg-warm-cream border border-divine-gold/30 rounded py-2 px-3 focus:outline-none focus:border-sacred-saffron text-sm font-serif"
                    placeholder="Describe your issue in detail..."
                  />
                  {errors.message && <span className="text-xs text-red-600 font-serif">{errors.message.message}</span>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-sacred-saffron hover:bg-spiritual-maroon disabled:bg-gray-300 text-warm-cream border border-divine-gold/30 font-semibold px-6 py-2.5 rounded text-xs transition-colors flex items-center gap-1.5 shadow"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
