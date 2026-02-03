'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { problemsApi, runApi, apiClient } from '@/lib/api-client';
import { handleApiError } from '@/lib/errors';
import { useAuth } from '@/contexts/AuthContext';
import type { Problem, RunRequest, RunResult, Submission } from '@/types/api';

const Editor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-white text-gray-500">
        Loading...
      </div>
    ),
  }
);

const miniGrids = [
  ['red', 'yellow', 'red'],
  ['yellow', 'red', 'yellow'],
  ['green', 'red', 'yellow'],
  ['red', 'yellow', 'green'],
  ['yellow', 'red', 'green'],
  ['green', 'red', 'green'],
  ['red', 'green', 'red'],
  ['yellow', 'green', 'red'],
  ['green', 'yellow', 'red'],
  ['red', 'green', 'yellow'],
  ['yellow', 'green', 'yellow'],
  ['green', 'yellow', 'green'],
];

type RunState = 'idle' | 'running' | 'success' | 'error';

type RunnerEvent =
  | { type: 'ready' }
  | { type: 'progress'; payload: string }
  | { type: 'success'; payload?: string }
  | { type: 'fail'; payload?: string };

const ProblemDetailPage = ({ params }: { params: { id: string } }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Description');
  const [code, setCode] = useState('void update() {\n  hero.moveRight()\n}');
  const [runState, setRunState] = useState<RunState>('idle');
  const [runOutput, setRunOutput] = useState('Game output will appear here...');
  const [runStats, setRunStats] = useState<{ runtimeMs: number; memoryMb: number } | null>(null);
  const [savedLayout, setSavedLayout] = useState<Record<string, number> | undefined>(undefined);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [showProblemList, setShowProblemList] = useState(false);
  const [problemsList, setProblemsList] = useState<Problem[]>([]);
  const gameFrameRef = useRef<HTMLIFrameElement | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const problemId = useMemo(() => params.id, [params.id]);
  const layoutStorageKey = 'problem-panel-layout';

  useEffect(() => {
    problemsApi.getById(problemId).then((response) => {
      if (response.data) {
        setProblem(response.data.problem);
      }
      setLoading(false);
    });

    // Load problems list for dropdown
    problemsApi.getAll().then((response) => {
      if (response.data) {
        setProblemsList(response.data.problems || []);
      }
    });

    // Load submissions history if user is logged in
    if (user?.id) {
      setLoadingSubmissions(true);
      problemsApi.getUserSubmissions(problemId, user.id).then((response) => {
        if (response.data) {
          setSubmissions(response.data.submissions || []);
        }
        setLoadingSubmissions(false);
      });
    }
  }, [problemId, user?.id]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProblemList(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRun = async () => {
    setRunState('running');
    setRunOutput('Running in sandbox...');

    if (gameFrameRef.current?.contentWindow) {
      gameFrameRef.current.contentWindow.postMessage(
        {
          type: 'run',
          problemId,
          code,
        },
        '*'
      );
    }

    const request: RunRequest = {
      problemId,
      code,
      language: 'javascript', // TODO: Get from editor or user selection
    };

    // Submit with userId if available
    const response = await apiClient.post<{ submission: unknown }>('/problems/submit', {
      userId: user?.id || null,
      problemId: request.problemId,
      codeContent: request.code,
      status: 'PENDING',
      judgeResult: null
    });

    if (response.error) {
      setRunOutput(`Error: ${handleApiError(response.error)}`);
      setRunStats(null);
      setRunState('error');
    } else if (response.data) {
      setRunOutput('Submission stored on backend. Waiting for judge result...');
      setRunStats(null);
      setRunState('success');
      
      // Reload submissions if user is logged in
      if (user?.id) {
        setLoadingSubmissions(true);
        problemsApi.getUserSubmissions(problemId, user.id).then((subResponse) => {
          if (subResponse.data) {
            setSubmissions(subResponse.data.submissions || []);
          }
          setLoadingSubmissions(false);
        }).catch(() => {
          setLoadingSubmissions(false);
        });
      }
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent<RunnerEvent>) => {
      if (!event?.data || typeof event.data !== 'object') return;
      const message = event.data;
      if (message.type === 'ready') {
        setRunOutput('Game runner ready. Click Run code to start.');
      }
      if (message.type === 'progress') {
        setRunOutput((prev) => `${prev}\n[progress] ${message.payload}`);
      }
      if (message.type === 'success') {
        setRunState('success');
        setRunOutput((prev) => `${prev}\n[success] ${message.payload || 'Completed'}`);
      }
      if (message.type === 'fail') {
        setRunState('error');
        setRunOutput((prev) => `${prev}\n[fail] ${message.payload || 'Failed'}`);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(layoutStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, number>;
        setSavedLayout(parsed);
      }
    } catch (err) {
      console.error('Failed to load panel layout', err);
    }
  }, [layoutStorageKey]);

  const handleLayoutChange = (layout: Record<string, number>) => {
    setSavedLayout(layout);
    try {
      localStorage.setItem(layoutStorageKey, JSON.stringify(layout));
    } catch (err) {
      console.error('Failed to persist panel layout', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-[#f8fafc]">
        <div className="h-full flex flex-col">
          <div className="border-b border-[#e5e5e5] bg-white px-4 md:px-8 py-3">
            <div className="flex items-center gap-2 text-[15px] text-black font-medium relative" ref={menuRef}>
              <button
                onClick={() => setShowProblemList(!showProblemList)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label="Problem list"
              >
                <svg aria-hidden xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-black">
                  <path d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z" />
                </svg>
              </button>
              <span>{problem?.title || 'Problem Detail'}</span>
              
              {/* Problem List Dropdown */}
              {showProblemList && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  <div className="p-2 border-b border-gray-200 font-semibold text-sm">Problems</div>
                  <div className="py-1">
                    {problemsList.map((p) => (
                      <Link
                        key={p.id}
                        href={`/problems/${p.id}`}
                        onClick={() => setShowProblemList(false)}
                        className={`block px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                          p.id === Number(problemId) ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{p.id}. {p.title}</span>
                          {p.difficulty && (
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              p.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                              p.difficulty === 'Med.' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {p.difficulty}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <PanelGroup
            direction="horizontal"
            className="flex-1 overflow-hidden"
            defaultLayout={savedLayout}
            onLayoutChange={(layout) => {
              try {
                localStorage.setItem(layoutStorageKey, JSON.stringify(layout));
              } catch (err) {
                console.error('Failed to save panel layout', err);
              }
            }}
          >
            <Panel defaultSize={30} minSize={20} className="flex flex-col border-r border-[#e5e5e5] bg-white overflow-hidden">
              <div className="flex items-center gap-0 border-b border-[#e5e5e5] bg-[#fafafa] px-4">
                <button
                  onClick={() => setActiveTab('Description')}
                  className={`px-3 py-2 text-[14px] font-medium transition-colors ${
                    activeTab === 'Description'
                      ? 'text-[#1a1a1a] border-b-2 border-black'
                      : 'text-[#666]'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('Hints')}
                  className={`px-3 py-2 text-[14px] font-medium transition-colors ${
                    activeTab === 'Hints' ? 'text-[#1a1a1a] border-b-2 border-black' : 'text-[#666]'
                  }`}
                >
                  Hints
                </button>
                <button
                  onClick={() => setActiveTab('Community')}
                  className={`px-3 py-2 text-[14px] font-medium transition-colors ${
                    activeTab === 'Community' ? 'text-[#1a1a1a] border-b-2 border-black' : 'text-[#666]'
                  }`}
                >
                  Community
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5">
                <h2 className="text-[20px] font-semibold text-[#1a1a1a] mb-5">{problem?.title || 'Title'}</h2>

                {activeTab === 'Description' && (
                  <div className="space-y-5 text-[14px] text-[#262626] leading-[1.6]">
                    {problem?.description && (
                      <div className="mb-4">
                        <p>{problem.description}</p>
                      </div>
                    )}
                    <div className="space-y-4">
                      <p className="text-[13px] font-semibold">Example 1:</p>
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {miniGrids.map((grid, idx) => (
                          <div key={idx} className="inline-flex border-2 border-black">
                            {grid.map((color, cellIdx) => (
                              <div
                                key={cellIdx}
                                className="w-[45px] h-[45px]"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                      <div className="border border-[#e5e5e5] rounded bg-[#f9f9f9] px-3 py-2 space-y-1 text-[13px]">
                        <p><strong>Input:</strong> n = 1</p>
                        <p><strong>Output:</strong> 12</p>
                        <p><strong>Explanation:</strong> There are 12 possible ways to paint the grid.</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[13px] font-semibold">Example 2:</p>
                      <div className="border border-[#e5e5e5] rounded bg-[#f9f9f9] px-3 py-2 space-y-1 text-[13px]">
                        <p><strong>Input:</strong> n = 5000</p>
                        <p><strong>Output:</strong> 30228214</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[13px] font-semibold">Constraints:</p>
                      <div className="mt-2 space-y-1">
                        {problem?.constraints && problem.constraints.length > 0 ? (
                          problem.constraints.map((constraint, idx) => (
                            <p key={idx}>• {constraint}</p>
                          ))
                        ) : (
                          <p>• 1 ≤ n ≤ 5000</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'Hints' && (
                  <div className="space-y-4 text-[14px] text-[#262626] leading-[1.6]">
                    {problem?.hints && problem.hints.length > 0 ? (
                      <div className="space-y-3">
                        {problem.hints.map((hint, idx) => (
                          <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded">
                            <p className="font-semibold mb-1">Hint {idx + 1}:</p>
                            <p>{hint}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p className="mb-2">No hints available for this problem yet.</p>
                        <p className="text-sm">Try solving it on your own first!</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'Community' && (
                  <div className="space-y-4 text-[14px] text-[#262626] leading-[1.6]">
                    <div className="text-center py-8 text-gray-500">
                      <p className="mb-2">Community discussions coming soon!</p>
                      <p className="text-sm">Share your solutions and ask questions here.</p>
                    </div>
                    {/* Placeholder for future community features */}
                    <div className="border border-[#e5e5e5] rounded-lg p-4 bg-gray-50">
                      <h3 className="font-semibold mb-2">Discussion Threads</h3>
                      <p className="text-sm text-gray-600">Feature under development...</p>
                    </div>
                  </div>
                )}
              </div>
            </Panel>

            <PanelResizeHandle className="w-[6px] bg-[#e8e8e8] hover:bg-[#cfcfcf] transition-colors cursor-col-resize" />

            <Panel defaultSize={35} minSize={25} className="flex flex-col border-r border-[#e5e5e5] bg-white overflow-hidden">
              <div className="h-10 bg-[#fafafa] border-b border-[#e5e5e5] flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <img src="/icons/code.png" alt="" className="w-4 h-4 object-contain opacity-80" />
                  <span className="text-[13px] font-medium text-[#1a1a1a]">Code</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/problems/${problemId}/submissions`}
                    className="text-[11px] font-medium px-3 py-1.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-[12px]">🕐</span>
                    History
                  </Link>
                  <button
                    onClick={handleRun}
                    disabled={runState === 'running'}
                    className={`text-[11px] font-semibold px-4 py-1.5 rounded text-white ${
                      runState === 'running'
                        ? 'bg-[#9acfb1] cursor-not-allowed'
                        : 'bg-[#1fbf75] hover:bg-[#19a863]'
                    }`}
                  >
                    {runState === 'running' ? 'Running...' : '▶ Run code'}
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme="vs-light"
                  options={{
                    fontSize: 13,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    lineNumbers: 'on',
                    glyphMargin: false,
                    folding: false,
                    lineDecorationsWidth: 0,
                    lineNumbersMinChars: 3,
                  }}
                />
              </div>
              {/* History Panel - Collapsible */}
              {user && (
                <div className="border-t border-[#e5e5e5] bg-[#fafafa] max-h-48 overflow-y-auto">
                  <div className="px-4 py-2 border-b border-[#e5e5e5]">
                    <h3 className="text-[12px] font-semibold text-[#1a1a1a]">Recent Submissions</h3>
                  </div>
                  {loadingSubmissions ? (
                    <div className="px-4 py-4 text-center text-[11px] text-gray-500">
                      Loading submissions...
                    </div>
                  ) : submissions.length === 0 ? (
                    <div className="px-4 py-4 text-center text-[11px] text-gray-500">
                      No submissions yet. Submit your code to see history.
                    </div>
                  ) : (
                    <div className="px-4 py-2 space-y-2">
                      {submissions.slice(0, 3).map((sub) => (
                      <div key={sub.id} className="text-[11px] border border-[#e5e5e5] rounded px-2 py-1.5 bg-white">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            sub.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                            sub.status === 'WRONG_ANSWER' ? 'bg-red-100 text-red-700' :
                            sub.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {sub.status}
                          </span>
                          <span className="text-gray-500">
                            {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                        {sub.judge_result && (
                          <p className="text-gray-600 text-[10px] mt-1 truncate">
                            {typeof sub.judge_result === 'string' 
                              ? sub.judge_result 
                              : JSON.stringify(sub.judge_result)}
                          </p>
                        )}
                      </div>
                    ))}
                      {submissions.length > 3 && (
                        <Link
                          href={`/problems/${problemId}/submissions`}
                          className="block text-center text-[11px] text-blue-600 hover:text-blue-700 font-medium py-1"
                        >
                          View all {submissions.length} submissions →
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Panel>

            <PanelResizeHandle className="w-[6px] bg-[#e8e8e8] hover:bg-[#cfcfcf] transition-colors cursor-col-resize" />

            <Panel defaultSize={35} minSize={25} className="flex flex-col bg-white overflow-hidden">
              <div className="h-10 bg-[#fafafa] border-b border-[#e5e5e5] flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <img src="/icons/terminal.png" alt="" className="w-4 h-4 object-contain opacity-80" />
                  <span className="text-[13px] font-medium text-[#1a1a1a]">Game Output</span>
                </div>
                <span className="text-[11px] text-[#666] font-medium uppercase">Live</span>
              </div>
              <div className="flex-1 grid grid-rows-[auto_1fr]">
                {/* Console Output - Thu nhỏ lại */}
                <div className="overflow-y-auto p-3 bg-[#0f172a] text-[#67e8f9] font-mono text-[11px] max-h-24">
                  <p>{runOutput}</p>
                  {runState === 'running' && <p className="text-[#facc15]">Executing...</p>}
                  {runState === 'success' && <p className="text-[#10b981]">✓ Success!</p>}
                  {runState === 'error' && <p className="text-[#ef4444]">✗ Failed</p>}
                </div>
                
                {/* Game Display - Phần chính */}
                <div className="bg-[#111827] overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between px-3 py-2 bg-[#1e293b] border-b border-gray-700">
                    <span className="font-semibold text-white text-xs">Game Preview</span>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`px-2 py-0.5 rounded ${
                        runState === 'success' ? 'bg-green-500 text-white' : 
                        runState === 'running' ? 'bg-yellow-500 text-white' : 
                        runState === 'error' ? 'bg-red-500 text-white' : 
                        'bg-gray-600 text-gray-300'
                      }`}>
                        {runState.toUpperCase()}
                      </span>
                      {runStats && (
                        <span className="text-gray-400">{runStats.runtimeMs}ms</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 relative"> 
                    <iframe
                      ref={gameFrameRef}
                      title="SeedGame Runner"
                      src="/game/sneker/2/runner.html"
                      className="w-full h-full border-0"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  </div>
                </div>
              </div>
            </Panel>


          </PanelGroup>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProblemDetailPage;

