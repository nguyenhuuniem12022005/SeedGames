'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const courseData = {
  title: 'The Complete Phaser.js Game Development Bootcamp',
  subtitle: 'Build 5 real games, learn JavaScript logic, and master the engine directly in your browser.',
  rating: 4.8,
  totalRatings: 1200,
  level: 'Beginner Level',
  lastUpdated: 'Dec 2025',
  price: 19.99,
  originalPrice: 99.99,
  breadcrumbs: ['Courses', '2D Game Dev', 'Phaser.js Ultimate Guide'],
  whatYouLearn: [
    'Master Physics Engine',
    'Deploy to Web',
    'Advanced Animation Techniques',
    'Create Tilemaps',
    'Build Mobile Games',
    'Game State Management'
  ],
  modules: [
    {
      title: 'Module 1: Getting Started with Phaser.js',
      lectures: 8,
      duration: '1h 45min',
      content: 'Content for Module 1: Getting Started with Phaser.js will be displayed here'
    },
    {
      title: 'Module 2: Core Game Concepts',
      lectures: 12,
      duration: '2h 30min'
    },
    {
      title: 'Module 3: Building Your First Game',
      lectures: 15,
      duration: '3h 15min'
    },
    {
      title: 'Module 4: Advanced Physics & Collisions',
      lectures: 11,
      duration: '2h 45min'
    },
    {
      title: 'Module 5: Complete Game Project',
      lectures: 20,
      duration: '4h 00min'
    }
  ],
  description: `This comprehensive bootcamp guides you through building real, playable games with Phaser.js. From basic setup to deploying full games on the web, you'll master every aspect of game development. Our interactive coding environment lets you write and test code right in your browser, with instant feedback and double Jury code review to ensure you're learning best practices. Whether you're building casual 2D games, mobile games, or complex game mechanics, this course covers it all with hands-on projects and real-world examples.`,
  keyFeatures: [
    'Interactive Code Editor with real-time feedback',
    'Double Jury mechanism for peer code review',
    '5 complete game projects from scratch',
    'Mobile game optimization techniques',
    'Deployment strategies for web and mobile'
  ],
  instructor: {
    name: 'Jane Developer',
    avatar: 'J',
    bio: 'Jane is a senior game developer with 15+ years of experience building games for web, mobile, and desktop platforms. She\'s passionate about teaching and has trained over 10,000 students worldwide.'
  }
};

export default function CourseDetailPage() {
  const [expandedModule, setExpandedModule] = useState<number | null>(0);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero Section - Dark Background */}
      <section className="bg-[#1a2332] text-white py-12">
        <div className="max-w-[1360px] mx-auto px-4 md:px-8 lg:px-14">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6 text-gray-300">
            {courseData.breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span>›</span>}
                <Link href={idx === 0 ? '/courses' : '#'} className="hover:text-white">
                  {crumb}
                </Link>
              </React.Fragment>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {courseData.title}
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            {courseData.subtitle}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
              <span className="font-semibold">{courseData.rating} Stars</span>
              <span className="text-gray-400">({courseData.totalRatings.toLocaleString()} ratings)</span>
            </div>
            <span className="text-gray-400">•</span>
            <span>{courseData.level}</span>
            <span className="text-gray-400">•</span>
            <span>Last updated: {courseData.lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-[1360px] mx-auto px-4 md:px-8 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* What you'll learn */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-black mb-6">What you'll learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courseData.whatYouLearn.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Content */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">Course Content</h2>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {courseData.modules.map((module, idx) => (
                    <div key={idx} className="border-b border-gray-200 last:border-b-0">
                      <Link
                        href={`/courses/1/${idx + 1}`}
                        className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100 transition-colors text-left block"
                      >
                        <div>
                          <h3 className="font-bold text-black mb-1">{module.title}</h3>
                          <p className="text-sm text-gray-600">
                            {module.lectures} lectures • {module.duration}
                          </p>
                        </div>
                        <span className="text-xl text-gray-500">
                          ▶
                        </span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">Description</h2>
                
                {/* Code Editor Preview */}
                <div className="bg-gray-100 rounded-lg p-12 mb-6 text-center">
                  <p className="text-gray-500 mb-2">Code Editor Interface Preview</p>
                  <p className="text-sm text-gray-400">Interactive Learning Environment</p>
                </div>

                <div className="text-gray-700 leading-relaxed mb-6">
                  {courseData.description}
                </div>

                <div className="mb-4">
                  <h3 className="font-bold text-black mb-3">Key Features:</h3>
                  <ul className="space-y-2">
                    {courseData.keyFeatures.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Instructor */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-black mb-6">Instructor</h2>
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shrink-0">
                    {courseData.instructor.avatar}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">
                      {courseData.instructor.name}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {courseData.instructor.bio}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                {/* Video Preview */}
                <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <div className="aspect-video flex items-center justify-center bg-gray-200">
                    <div className="text-center">
                      <div className="text-5xl mb-2">▶</div>
                      <p className="text-sm text-gray-500">Video Preview</p>
                    </div>
                  </div>
                </div>

                {/* Pricing Card */}
                <div className="border border-gray-200 rounded-lg p-6 bg-white">
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-bold text-black">${courseData.price}</span>
                      <span className="text-lg text-gray-400 line-through">${courseData.originalPrice}</span>
                    </div>
                    <p className="text-sm text-red-600 font-medium">Limited time offer</p>
                  </div>

                  <button className="w-full h-12 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors mb-3">
                    Buy Now
                  </button>

                  <button className="w-full h-12 bg-white border-2 border-gray-300 text-black font-semibold rounded-md hover:bg-gray-50 transition-colors mb-6">
                    Try Sandbox Free
                  </button>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span className="text-gray-700">Full lifetime access</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span className="text-gray-700">Access on mobile</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span className="text-gray-700">Certificate of completion</span>
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
