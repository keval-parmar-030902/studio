"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-background text-center p-4">
      <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
      <h1 className="text-4xl font-bold text-primary mb-2">DayScribe</h1>
      <p className="text-lg text-muted-foreground">Loading your personalized task manager...</p>
    </div>
  );
}
