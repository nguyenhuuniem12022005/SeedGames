'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { sandboxApi } from '@/lib/api-client';
import { handleApiError } from '@/lib/errors';
import { useAuth } from '@/contexts/AuthContext';

export default function UploadSandboxPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    demoUrl: '',
    sourceCodeUrl: '',
    type: 'personal-project' as 'course-project' | 'personal-project',
    tags: '',
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    setError(null);

    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);

    const response = await sandboxApi.create({
      title: formData.title,
      description: formData.description || undefined,
      author: user.fullName || user.username,
      demoUrl: formData.demoUrl,
      sourceCodeUrl: formData.sourceCodeUrl || undefined,
      tags: tagsArray.length > 0 ? tagsArray : undefined,
      type: formData.type,
    });

    if (response.error) {
      setError(handleApiError(response.error));
      setLoading(false);
    } else if (response.data) {
      router.push(`/sandbox/${response.data.project.id}`);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 md:px-8 lg:px-14">
          <h1 className="text-3xl font-bold text-black mb-8">Upload Your Project</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                placeholder="Enter project title"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                placeholder="Describe your project..."
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Type *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="course-project"
                    checked={formData.type === 'course-project'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'course-project' })}
                    className="w-4 h-4"
                  />
                  <span>Course Project</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="personal-project"
                    checked={formData.type === 'personal-project'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'personal-project' })}
                    className="w-4 h-4"
                  />
                  <span>Personal Project</span>
                </label>
              </div>
            </div>

            {/* Demo URL */}
            <div>
              <label htmlFor="demoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Demo URL *
              </label>
              <input
                type="url"
                id="demoUrl"
                required
                value={formData.demoUrl}
                onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                placeholder="https://your-demo-url.com"
              />
            </div>

            {/* Source Code URL */}
            <div>
              <label htmlFor="sourceCodeUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Source Code URL (optional)
              </label>
              <input
                type="url"
                id="sourceCodeUrl"
                value={formData.sourceCodeUrl}
                onChange={(e) => setFormData({ ...formData, sourceCodeUrl: e.target.value })}
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                placeholder="https://github.com/your-repo"
              />
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                placeholder="phaser, 2d, platformer"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Uploading...' : 'Upload Project'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

