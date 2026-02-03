'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await login(formData);
    
    if (result.success) {
      router.push('/profile');
    } else {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-black mb-2">Login</h1>
            <p className="text-gray-600 mb-6">
              Welcome back to SeedGame
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="text-blue-600 font-semibold hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

