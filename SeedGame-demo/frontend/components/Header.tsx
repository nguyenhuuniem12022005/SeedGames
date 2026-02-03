'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { user, isAuthenticated, loading } = useAuth();

  return (
    <header className="w-full border-b border-[#d7d7d7] bg-[#e7e7e7] select-none" style={{ height: '72px' } as React.CSSProperties}>
      <div className="max-w-[1360px] mx-auto h-full flex items-center px-3 md:px-6 lg:px-14 gap-3 md:gap-6">
        {/* Left: logo + search */}
        <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <img src="/icons/logo-seedgame.png" alt="SeedGame" className="w-[60px] md:w-[80px] h-[60px] md:h-[80px] object-contain" />
          </Link>

          <div className="hidden lg:block relative w-[240px] max-w-sm shrink-0">
            <input
              type="text"
              placeholder="Search"
              className="w-full h-[40px] rounded-full bg-[#d9d9d9] pl-12 pr-4 text-[14px] text-[#3f3f3f] border border-[#d0d0d0] focus:outline-none"
            />
            <img
              src="/icons/search.png"
              alt="Search"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] object-contain opacity-80"
            />
          </div>
        </div>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-8 text-[16px] lg:text-[20px] text-[#2d2d2d] font-medium">
          <Link href="/" className="hover:text-black whitespace-nowrap">Homepage</Link>
          <Link href="/courses" className="hover:text-black whitespace-nowrap">Courses</Link>
          <Link href="/problems" className="hover:text-black whitespace-nowrap">Problems</Link>
          <Link href="/contest" className="hover:text-black whitespace-nowrap">Contest</Link>
          <Link href="/sandbox" className="hover:text-black whitespace-nowrap">Sandbox</Link>
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-2 md:gap-4 ml-auto text-[#3a3a3a] text-[16px]">
          <button aria-label="Notifications" className="w-6 h-6 md:w-7 md:h-7 grid place-items-center">
            <img src="/icons/bell.png" alt="Bell" className="w-full h-full object-contain" />
          </button>
          <div className="hidden sm:flex items-center gap-1">
            <img src="/icons/fire.png" alt="Fire" className="w-5 md:w-6 h-5 md:h-6 object-contain" />
            <span className="text-[15px] md:text-[17px]">0</span>
          </div>
          {loading ? (
            <div className="w-9 md:w-12 h-9 md:h-12 rounded-full bg-gray-200 animate-pulse" />
          ) : isAuthenticated && user ? (
            <Link href="/profile" className="w-9 md:w-12 h-9 md:h-12 rounded-full overflow-hidden border border-[#d0d0d0] hover:border-blue-500 transition-colors">
              {user.avatar ? (
                <img src={user.avatar} alt={user.fullName || user.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                  {(user.fullName || user.username).charAt(0).toUpperCase()}
                </div>
              )}
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-[#2d2d2d] hover:text-black"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

