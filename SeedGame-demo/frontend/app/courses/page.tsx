'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { coursesApi } from '@/lib/api-client';
import { handleApiError } from '@/lib/errors';
import type { Course } from '@/types/api';

const levelIcons: Record<string, string> = {
  'Beginner': '⚡',
  'Intermediate': '⚡',
  'Advanced': '⚡'
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    setError(null);
    const response = await coursesApi.getAll();
    
    if (response.error) {
      setError(handleApiError(response.error));
    } else if (response.data) {
      setCourses(response.data.courses || []);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    // Search functionality to be implemented
    console.log('Searching for:', searchQuery);
  };

  const filteredCourses = courses.filter((course) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      course.title.toLowerCase().includes(query) ||
      course.description?.toLowerCase().includes(query) ||
      course.level.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-20">
        <div className="max-w-[1360px] mx-auto px-4 md:px-8 lg:px-14">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Master Game Development with<br />Real Projects
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              From zero to hero with C#, Phaser.js, and Unity directly in your browser.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto flex gap-0">
              <input
                type="text"
                placeholder="Search for courses (e.g., RPG, C#)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 h-14 px-6 rounded-l-lg border border-gray-300 text-[15px] focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSearch}
                className="h-14 px-8 bg-blue-600 text-white font-semibold rounded-r-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <span className="text-xl">🔍</span>
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12">
        <div className="max-w-[1360px] mx-auto px-4 md:px-8 lg:px-14">
          {loading && (
            <div className="text-center py-12 text-gray-500">Loading courses...</div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
              Error: {error}
            </div>
          )}

          {!loading && !error && filteredCourses.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              {searchQuery ? 'No courses found matching your search.' : 'No courses available yet.'}
            </div>
          )}

          {!loading && !error && filteredCourses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
              <a
                key={course.id}
                href={`/courses/${course.id}`}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow block"
              >
                {/* Course Image */}
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                  <span className="text-sm">Course Image</span>
                </div>

                {/* Course Details */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-black mb-3">{course.title}</h3>

                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <span>{levelIcons[course.level]}</span>
                      <span>{course.level}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>⏱</span>
                      <span>{course.duration || 'N/A'}</span>
                    </div>
                  </div>

                  <button className="w-full h-11 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
                    Enroll Now
                  </button>
                </div>
              </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
