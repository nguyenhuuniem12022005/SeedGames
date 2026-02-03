'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { sandboxApi } from '@/lib/api-client';
import { handleApiError } from '@/lib/errors';
import type { SandboxProject } from '@/types/api';

export default function SandboxPage() {
  const [projects, setProjects] = useState<SandboxProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'course-project' | 'personal-project'>('all');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    const response = await sandboxApi.getAll();
    
    if (response.error) {
      setError(handleApiError(response.error));
    } else if (response.data) {
      setProjects(response.data.projects || []);
    }
    setLoading(false);
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || project.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-600 to-purple-700 text-white py-16">
        <div className="max-w-[1360px] mx-auto px-4 md:px-8 lg:px-14">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Sandbox Environment
          </h1>
          <p className="text-lg mb-8 max-w-2xl">
            Where students upload and share their demo products. 
            From course projects to personal projects, discover games created by the SeedGame community.
          </p>
          <Link
            href="/sandbox/upload"
            className="inline-block px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Upload Your Project
          </Link>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-[1360px] mx-auto px-4 md:px-8 lg:px-14">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full max-w-2xl">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-300 rounded-lg text-[15px] focus:outline-none focus:border-purple-500"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('course-project')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === 'course-project'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Course Projects
              </button>
              <button
                onClick={() => setFilterType('personal-project')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === 'personal-project'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Personal Projects
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12">
        <div className="max-w-[1360px] mx-auto px-4 md:px-8 lg:px-14">
          {loading && (
            <div className="text-center py-12 text-gray-500">Loading projects...</div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
              Error: {error}
            </div>
          )}

          {!loading && !error && filteredProjects.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              {searchQuery || filterType !== 'all'
                ? 'No projects found matching your criteria.'
                : 'No projects available yet. Be the first to upload!'}
            </div>
          )}

          {!loading && !error && filteredProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/sandbox/${project.id}`}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  {/* Thumbnail */}
                  <div className="w-full h-48 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-4xl">🎮</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-black line-clamp-2">{project.title}</h3>
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full shrink-0 ml-2">
                        {project.type === 'course-project' ? 'Course' : 'Personal'}
                      </span>
                    </div>

                    {project.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                    )}

                    {/* Author */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold">
                        {project.authorAvatar ? (
                          <img src={project.authorAvatar} alt={project.author} className="w-full h-full rounded-full" />
                        ) : (
                          project.author.charAt(0).toUpperCase()
                        )}
                      </div>
                      <span className="text-sm text-gray-600">{project.author}</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {project.views !== undefined && (
                        <span>👁 {project.views.toLocaleString()} views</span>
                      )}
                      {project.likes !== undefined && (
                        <span>❤️ {project.likes.toLocaleString()} likes</span>
                      )}
                      <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

