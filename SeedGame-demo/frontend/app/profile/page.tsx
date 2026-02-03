'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/api-client';
import Link from 'next/link';

function ChangePasswordForm() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!newPassword || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    if (!user?.email) {
      setError('Không tìm thấy thông tin email.');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.resetPassword({
        email: user.email,
        id: user.id || 0,
        password: newPassword,
      });
      if (response.error) {
        setError(response.error.message || 'Đổi mật khẩu thất bại.');
      } else {
        setSuccess('Đổi mật khẩu thành công!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đổi mật khẩu thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm">
          {success}
        </div>
      )}

      <div>
        <label htmlFor="newPasswordProfile" className="block text-sm font-medium text-gray-700 mb-2">
          New Password *
        </label>
        <div className="relative">
          <input
            type="password"
            id="newPasswordProfile"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 pr-10"
            placeholder="••••••••"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔑</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Tối thiểu 6 ký tự</p>
      </div>

      <div>
        <label htmlFor="confirmPasswordProfile" className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password *
        </label>
        <div className="relative">
          <input
            type="password"
            id="confirmPasswordProfile"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 pr-10"
            placeholder="••••••••"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔑</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="animate-spin">⏳</span>
            <span>Đang đổi mật khẩu...</span>
          </>
        ) : (
          <>
            <span>✓</span>
            <span>Đổi mật khẩu</span>
          </>
        )}
      </button>
    </form>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'settings'>('profile');
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    email: '',
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        bio: user.bio || '',
        email: user.email,
      });
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await updateUser({
        fullName: formData.fullName,
        bio: formData.bio,
      });
      setEditMode(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-14">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.fullName || user.username} className="w-full h-full rounded-full" />
                ) : (
                  <span>{(user.fullName || user.username).charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{user.fullName || user.username}</h1>
                <p className="text-blue-100 mb-1">@{user.username}</p>
                {user.bio && <p className="text-white/90">{user.bio}</p>}
                <p className="text-sm text-white/80 mt-2">
                  Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US') : 'Just joined'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Statistics
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Settings
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-black">Profile Information</h2>
                  {!editMode ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => {
                          setEditMode(false);
                          setFormData({
                            fullName: user.fullName || '',
                            bio: user.bio || '',
                            email: user.email,
                          });
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={user.username}
                      disabled
                      className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      disabled
                      className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      disabled={!editMode}
                      className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      disabled={!editMode}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-50"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-black mb-6">Statistics</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {user.stats?.problemsSolved || 0}
                    </div>
                    <div className="text-gray-600">Problems Solved</div>
                    <Link href="/problems" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
                      View All →
                    </Link>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {user.stats?.contestsParticipated || 0}
                    </div>
                    <div className="text-gray-600">Contests Participated</div>
                    <Link href="/contest" className="text-purple-600 text-sm hover:underline mt-2 inline-block">
                      View All →
                    </Link>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {user.stats?.projectsUploaded || 0}
                    </div>
                    <div className="text-gray-600">Projects Uploaded</div>
                    <Link href="/sandbox" className="text-green-600 text-sm hover:underline mt-2 inline-block">
                      View All →
                    </Link>
                  </div>
                </div>

                {user.stats?.totalScore !== undefined && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Total Score</div>
                        <div className="text-2xl font-bold text-black">{user.stats.totalScore}</div>
                      </div>
                      {user.stats.rank && (
                        <div className="text-right">
                          <div className="text-sm text-gray-600 mb-1">Rank</div>
                          <div className="text-2xl font-bold text-blue-600">#{user.stats.rank}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-black mb-6">Settings</h2>
                
                {/* Change Password Section */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                    <span>🔒</span>
                    Change Password
                  </h3>
                  <ChangePasswordForm />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-black">Email Notifications</div>
                      <div className="text-sm text-gray-600">Receive notifications via email</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        defaultChecked 
                        aria-label="Email Notifications"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-black">Contest Notifications</div>
                      <div className="text-sm text-gray-600">Receive notifications about new contests</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        defaultChecked 
                        aria-label="Contest Notifications"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

