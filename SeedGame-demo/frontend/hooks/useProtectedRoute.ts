'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function useProtectedRoute(redirectTo: string = '/login') {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [loading, isAuthenticated, router, redirectTo]);

  return { isAuthenticated, loading };
}

