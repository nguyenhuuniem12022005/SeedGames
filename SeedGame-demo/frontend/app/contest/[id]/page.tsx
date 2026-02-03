'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function ContestDetailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-[1360px] mx-auto px-4 md:px-8 lg:px-14">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/contest" className="hover:text-black">Contest</Link>
            <span>›</span>
            <span className="text-black">Maze Spin Challenge</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* Title */}
              <div className="flex items-center gap-4 mb-8">
                <h1 className="text-4xl font-bold text-black">Maze Spin Challenge</h1>
                <span className="bg-green-500 px-3 py-1 rounded-md text-xs font-bold text-white uppercase">
                  ● ONGOING
                </span>
              </div>

              {/* About the Contest */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">About the Contest</h2>
                <p className="text-gray-700 leading-relaxed">
                  In the Maze Sprint Challenge, you'll race against time to guide your character to the finish line as quickly as possible, 
                  Program your character with code, and navigate through randomly generated mazes, avoiding traps and dead ends! 
                  Example fears ....
                </p>
              </div>

              {/* Contest Timeline */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-6">Contest timeline</h2>
                
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute top-8 left-0 w-full h-0.5 bg-gray-300"></div>
                  
                  <div className="relative flex justify-between items-start">
                    {/* Ongoing */}
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2 relative z-10">
                        01
                      </div>
                      <span className="text-sm font-semibold text-orange-500">Ongoing</span>
                      <span className="text-xs text-gray-500">9AM - Today</span>
                    </div>

                    {/* R2 */}
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2 relative z-10">
                        R2
                      </div>
                      <span className="text-xs text-gray-500">9h30AM - Today</span>
                    </div>

                    {/* R3 */}
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2 relative z-10">
                        R3
                      </div>
                      <span className="text-xs text-gray-500">10AM - Today</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rules */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">Rules</h2>
                
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p>
                    In the Maze Sprint Challenge, participants compete against time to guide their character to the finish line as fast as possible.
                  </p>
                  <p>
                    Players must program their character using code to move, turn, and interact with the environment. The maze is randomly generated for each run, requiring logical thinking and adaptive strategies.
                  </p>

                  <div className="mt-4">
                    <h3 className="font-bold text-black mb-2">Objective</h3>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Reach the finish point in the shortest time.</li>
                      <li>Avoid traps, dead ends, and unnecessary movements.</li>
                    </ul>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-bold text-black mb-2">Gameplay Rules</h3>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>The maze layout is generated dynamically at the start of each run.</li>
                      <li>Players control the character only through code, not manual input.</li>
                      <li>The character can:
                        <ul className="list-disc list-inside ml-6">
                          <li>Move forward step by step</li>
                          <li>Turn left or right</li>
                          <li>Detect obstacles or walls</li>
                          <li>Collect keys or activate mechanisms (if available)</li>
                        </ul>
                      </li>
                      <li>Each wrong move or collision may increase completion time.</li>
                    </ul>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-bold text-black mb-2">Scoring</h3>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Ranking is based on completion time.</li>
                      <li>In case of a tie, fewer steps and fewer errors are ranked higher.</li>
                    </ul>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-bold text-black mb-2">Format</h3>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Mode: Solo</li>
                      <li>Difficulty: Beginner</li>
                      <li>Programming language: SeedGame supported language (block-based or text-based)</li>
                    </ul>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-bold text-black mb-2">Fair Play</h3>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Exploits, hard-coded paths, or unauthorized scripts are not allowed.</li>
                      <li>SeedGame reserves the right to disqualify invalid submissions.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                {/* Contest Info Card */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white mb-6">
                  <h3 className="text-xl font-bold mb-4">Contest's Infor</h3>
                  
                  {/* Countdown Timer */}
                  <div className="text-5xl font-bold mb-2">02:29:03</div>
                  <div className="w-full h-2 bg-blue-800 rounded-full mb-6 overflow-hidden">
                    <div className="h-full bg-orange-500 w-2/3"></div>
                  </div>

                  {/* Buttons */}
                  <button className="w-full h-12 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors mb-3">
                    Register
                  </button>
                  <button className="w-full h-12 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors mb-6">
                    Practice Mode
                  </button>

                  {/* Info Icons */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⏱</span>
                      <span>2 hours 30 minutes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">👤</span>
                      <span>Solo</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📊</span>
                      <span>Beginner</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">👥</span>
                      <span>1.2M</span>
                    </div>
                  </div>
                </div>

                {/* Prizes Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-black mb-6">Prizes</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-5xl">🥇</span>
                      <span className="text-3xl font-bold text-gray-900">250$</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-5xl">🥈</span>
                      <span className="text-3xl font-bold text-gray-900">200$</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-5xl">🥉</span>
                      <span className="text-3xl font-bold text-gray-900">150$</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
