"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Loader2 } from 'lucide-react';

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-warm-cream">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-sacred-saffron animate-spin" />
          <p className="text-sm text-gray-500 font-serif">Verifying sacred session...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-warm-cream">
      {/* Sidebar navigation */}
      <DashboardSidebar isAdmin={false} />
      
      {/* Scrollable content pane */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
