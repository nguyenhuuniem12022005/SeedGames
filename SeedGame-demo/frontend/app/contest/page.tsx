'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { contestsApi } from '@/lib/api-client';
import { handleApiError } from '@/lib/errors';
import type { Contest, Ranking } from '@/types/api';

const statusColors: Record<string, string> = {
  ONGOING: "bg-green-500",
  UPCOMING: "bg-blue-500",
  FINISHED: "bg-gray-400"
};

const medalColors: Record<number, string> = {
  1: "text-yellow-400",
  2: "text-gray-400",
  3: "text-orange-600"
};

export default function ContestPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    loadContests();
  }, []);

  const loadContests = async () => {
    setLoading(true);
    setError(null);
    const response = await contestsApi.getAll();
    
    if (response.error) {
      setError(handleApiError(response.error));
    } else if (response.data) {
      setContests(response.data.contests || []);
    }
    setLoading(false);
  };

  const filteredContests = contests.filter((contest) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return contest.name.toLowerCase().includes(query);
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-100 to-white py-12">
        <div className="max-w-[1360px] mx-auto px-4 md:px-8 lg:px-14">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a2442] mb-4">
            SEEDGAME CONTESTS
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Real-time game programming competition<br />
            for students and developers.
          </p>

          <div className="flex gap-4">
            <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              Explore Contest
            </button>
            <button className="px-8 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors">
              Create Team
            </button>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-[1360px] mx-auto px-4 md:px-8 lg:px-14">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-2xl">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search Contest's name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-300 rounded-lg text-[15px] focus:outline-none focus:border-blue-500"
              />
            </div>
            <button className="w-12 h-12 bg-gray-50 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100">
              <span className="text-xl">☰</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-[1360px] mx-auto px-4 md:px-8 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Hot Contests */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-black flex items-center gap-2">
                  <span className="text-orange-500">🔥</span>
                  Hot Contests
                </h2>
                
                {/* Pagination Dots */}
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        currentPage === idx ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {loading && (
                <div className="text-center py-12 text-gray-500">Loading contests...</div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
                  Error: {error}
                </div>
              )}

              {!loading && !error && filteredContests.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  {searchQuery ? 'No contests found matching your search.' : 'No contests available yet.'}
                </div>
              )}

              {!loading && !error && filteredContests.length > 0 && (
                <div className="space-y-4">
                  {filteredContests.map((contest) => (
                  <div
                    key={contest.id}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex"
                  >
                    {/* Left Blue Square */}
                    <div className="w-40 h-40 bg-gradient-to-br from-blue-600 to-blue-700 shrink-0"></div>

                    {/* Right Content */}
                    <div className="flex-1 p-5 relative">
                      {/* Status Badge */}
                      <span
                        className={`absolute top-4 right-4 ${statusColors[contest.status]} px-3 py-1 rounded-md text-xs font-bold text-white uppercase`}
                      >
                        ● {contest.status}
                      </span>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-black mb-2">{contest.name}</h3>

                      {/* Time */}
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <span>⏱</span>
                        <span>{contest.timeRemaining}</span>
                      </div>

                      {/* Info Row */}
                      <div className="flex items-center gap-4 text-sm text-gray-700 mb-4">
                        <div className="flex items-center gap-1">
                          <span>👤</span>
                          <span>{contest.participants}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>🎮</span>
                          <span>{contest.gameMode}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>⚡</span>
                          <span>{contest.difficulty}</span>
                        </div>
                      </div>

                      {/* Bottom Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 font-bold text-gray-900">
                            <span className="text-yellow-500 text-xl">🏆</span>
                          <span>{contest.prize || '—'}</span>
                          </div>
                          <div className="flex items-center gap-2 font-bold text-gray-900">
                            <span>👥</span>
                        <span>{contest.participantCount ?? 0}</span>
                          </div>
                        </div>
                        <a 
                          href={`/contest/${contest.id}`}
                          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          View Details
                          <span>→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Ranking */}
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-bold text-black mb-6">Ranking</h2>
              
              {rankings.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No rankings available yet.
                </div>
              )}

              {rankings.length > 0 && (
                <div className="space-y-6">
                  {rankings.map((ranking, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <h3 className="font-bold text-lg text-black mb-4">{ranking.contestName}</h3>
                    
                    <div className="space-y-3">
                      {ranking.users.map((user) => (
                        <div key={user.rank} className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 shrink-0">
                            {user.rank === 1 && <span className={`text-3xl ${medalColors[1]}`}>🥇</span>}
                            {user.rank === 2 && <span className={`text-3xl ${medalColors[2]}`}>🥈</span>}
                            {user.rank === 3 && <span className={`text-3xl ${medalColors[3]}`}>🥉</span>}
                          </div>
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{user.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
