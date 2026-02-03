'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-[#0a0e27] relative">
        {/* Hero Image */}
        <div className="relative w-full">
          <img 
            src="/icons/code your game world.png" 
            alt="Code Your Game World"
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* Hot New Releases */}
      <section className="bg-gradient-to-r from-pink-500 to-rose-500 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Hot new Releases</h2>
              <Link href="/courses" className="inline-block text-white font-semibold hover:underline">
                Explore Courses →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: 1,
                image: '/icons/claudecode.png',
                org: 'Vanderbilt University',
                title: 'Claude Code: Software Engineering with Generative AI Agents',
                type: 'Course',
                link: 'https://www.coursera.org/learn/claudecode'
              },
              {
                id: 2,
                image: '/icons/vibecodingesstials.png',
                org: 'Scrimba',
                title: 'Vibe Coding Essentials: Build Apps with AI',
                type: 'Specialization',
                link: 'https://www.coursera.org/learn/vibecoding'
              },
              {
                id: 3,
                image: '/icons/aws.png',
                org: 'Amazon Web Services',
                title: 'AWS Generative AI for Developers',
                type: 'Professional Certificate',
                link: 'https://www.coursera.org/learn/aws-generative-ai'
              }
            ].map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer"
                onClick={() => window.open(course.link, '_blank')}
              >
                <div className="relative w-full h-40 bg-gray-100">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-semibold">Free Trial</div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">{course.org}</p>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm line-clamp-2">{course.title}</h3>
                  <p className="text-xs text-gray-600">{course.type}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <p className="text-white font-semibold">+5 more</p>
          </div>
        </div>
      </section>

      {/* Explore Careers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-black mb-12">Explore Careers</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: 'Data Analyst', image: '/icons/data-analyst.png', salary: '$97,123' },
              { title: 'Data Scientist', image: '/icons/Data_Scientist.png', salary: '$123,456' },
              { title: 'Machine Learning Engineer', image: '/icons/Machine_Learning_Engineer.png', salary: '$156,789' },
              { title: 'Data Scientist', image: '/icons/Data_Scientist-role-card_2x.png (1).png', salary: '$145,678' },
            ].map((career, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow overflow-hidden">
                <div className="w-full h-56 bg-gray-100 rounded mb-4 flex items-center justify-center overflow-hidden">
                  <img 
                    src={career.image} 
                    alt={career.title}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <h3 className="font-bold text-lg text-black mb-3">{career.title}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Lorem ipsum dolor sit amet consectetur. Sit amet pellentesque est velit sit.
                </p>
                <p className="text-xs text-gray-500 mb-4">Median salary: {career.salary}</p>
                <Link href="#" className="text-cyan-600 text-sm font-semibold hover:underline">
                  Learn more →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <Link href="/courses" className="inline-block text-white font-semibold hover:underline mb-8">
            Explore Courses →
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: 1,
                image: '/icons/claudecode.png',
                org: 'Vanderbilt University',
                title: 'Claude Code: Software Engineering with Generative AI Agents',
                type: 'Course',
                link: 'https://www.coursera.org/learn/claudecode'
              },
              {
                id: 2,
                image: '/icons/vibecodingesstials.png',
                org: 'Scrimba',
                title: 'Vibe Coding Essentials: Build Apps with AI',
                type: 'Specialization',
                link: 'https://www.coursera.org/learn/vibecoding'
              },
              {
                id: 3,
                image: '/icons/aws.png',
                org: 'Amazon Web Services',
                title: 'AWS Generative AI for Developers',
                type: 'Professional Certificate',
                link: 'https://www.coursera.org/learn/aws-generative-ai'
              }
            ].map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer"
                onClick={() => window.open(course.link, '_blank')}
              >
                <div className="relative w-full h-56 bg-gray-100">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-semibold">Free Trial</div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">{course.org}</p>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm line-clamp-2">{course.title}</h3>
                  <p className="text-xs text-gray-600">{course.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

