'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { problemsApi } from '@/lib/api-client';
import type { Submission } from '@/types/api';

export default function ProblemSubmissionsPage({ params }: { params: { id: string } }) {
  const { user, isAuthenticated } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user || user.id == null) {
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      const response = await problemsApi.getUserSubmissions(params.id, user.id);
      if (response.error) {
        setError(response.error.message || 'Không thể tải danh sách submissions.');
      } else if (response.data) {
        setSubmissions(response.data.submissions || []);
      }
      setLoading(false);
    };

    load();
  }, [isAuthenticated, user, params.id]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 py-10">
        <div className="max-w-[1000px] mx-auto px-4 md:px-8">
          <h1 className="text-2xl font-bold text-black mb-4">
            Submissions for Problem #{params.id}
          </h1>

          {!isAuthenticated && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700 mb-4 text-sm">
              Bạn cần đăng nhập để xem lịch sử nộp bài.
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-4 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-gray-500 text-sm">Đang tải submissions...</div>
          ) : submissions.length === 0 ? (
            <div className="text-gray-500 text-sm">
              Chưa có submission nào cho bài này.
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Trạng thái</th>
                    <th className="px-4 py-2 text-left">Kết quả chấm</th>
                    <th className="px-4 py-2 text-left">Thời gian nộp</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s, idx) => (
                    <tr
                      key={s.id}
                      className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-4 py-2 border-b border-gray-100">{s.id}</td>
                      <td className="px-4 py-2 border-b border-gray-100">{s.status}</td>
                      <td className="px-4 py-2 border-b border-gray-100">
                        {s.judge_result || '—'}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-100">
                        {new Date(s.submitted_at).toLocaleString('vi-VN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}


