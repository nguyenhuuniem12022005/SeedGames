'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const moduleData = {
  courseName: 'The Complete Phaser.js Game Development Bootcamp',
  moduleName: 'Module 1: Getting Started with Phaser.js',
  title: 'Getting Started with Phaser.js',
  progress: 58,
  learningGoal: 'Build 5 real games, learn JavaScript logic, and master the engine directly in your browser.',
  materials: [
    { name: 'File\' name', size: '3.5 MB', type: 'pdf' },
    { name: 'File\' name', size: '2 KB', type: 'file' },
    { name: 'File\' name', size: '1.1 KB', type: 'file' }
  ]
};

const modules = [
  { id: 1, title: 'Module 1: Getting Started with Phaser.js', active: true },
  { id: 2, title: 'Module 2: Core Game Concepts', active: false },
  { id: 3, title: 'Module 3: Building Your First Game', active: false },
  { id: 4, title: 'Module 4: Advanced Physics & Collisions', active: false },
  { id: 5, title: 'Module 5: Complete Game Project', active: false }
];

const tabs = ['Materials', 'Note', 'Transcript'];

export default function LessonPage() {
  const [activeTab, setActiveTab] = useState('Materials');

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-[1360px] mx-auto px-4 md:px-8 lg:px-14">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 overflow-x-auto">
            <Link href="/courses" className="hover:text-black whitespace-nowrap">Courses</Link>
            <span>›</span>
            <Link href="/courses/1" className="hover:text-black whitespace-nowrap truncate">
              {moduleData.courseName}
            </Link>
            <span>›</span>
            <span className="text-black whitespace-nowrap">{moduleData.moduleName}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2">
              {/* Video Preview */}
              <div className="bg-gradient-to-b from-gray-200 to-gray-300 rounded-xl overflow-hidden mb-6 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">▶</div>
                  <p className="text-gray-500">Video Preview</p>
                </div>
              </div>

              {/* Learning Goal */}
              <div className="bg-pink-100 border-l-4 border-pink-500 rounded-lg p-4 mb-6 flex items-start gap-3">
                <span className="text-2xl mt-0.5">📋</span>
                <div>
                  <h3 className="font-bold text-black mb-1">Learning Goal</h3>
                  <p className="text-gray-700 text-sm">{moduleData.learningGoal}</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-6 border-b border-gray-200">
                <div className="flex gap-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-3 px-1 font-medium text-base transition-colors ${
                        activeTab === tab
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                {activeTab === 'Materials' && (
                  <div className="space-y-4">
                    {moduleData.materials.map((material, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-2xl">
                            {material.type === 'pdf' ? '📄' : '📁'}
                          </span>
                          <div>
                            <p className="font-medium text-gray-900">{material.name}</p>
                            <p className="text-xs text-gray-500">Information</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">{material.size}</span>
                          <button className="px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-1">
                            <span>⬇</span>
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'Note' && (
                  <div className="text-center text-gray-500 py-8">
                    <p>No notes available yet</p>
                  </div>
                )}

                {activeTab === 'Transcript' && (
                  <div className="text-center text-gray-500 py-8">
                    <p>Transcript will be available soon</p>
                  </div>
                )}
              </div>

              {/* Previous/Next Buttons */}
              <div className="flex items-center justify-between">
                <button className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <span>←</span>
                  Previous Lesson
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                  Next Lesson
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                {/* Lesson Overview */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
                  <div className="bg-blue-600 text-white p-4">
                    <h3 className="text-lg font-bold">Lesson Overview</h3>
                  </div>
                  <div className="p-4">
                    <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700 font-medium">
                      {moduleData.moduleName}
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 transition-all"
                          style={{ width: `${moduleData.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{moduleData.progress}%</span>
                    </div>

                    {/* Progress Dots */}
                    <div className="flex gap-1 justify-center mb-4">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < Math.ceil(20 * moduleData.progress / 100)
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          }`}
                        ></div>
                      ))}
                    </div>

                    <p className="text-sm text-gray-600 text-center">{moduleData.progress}% completed</p>
                  </div>
                </div>

                {/* Course Content */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-white p-4 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-black">Course Content</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {modules.map((module) => (
                      <button
                        key={module.id}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                          module.active
                            ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {module.title}
                      </button>
                    ))}
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
